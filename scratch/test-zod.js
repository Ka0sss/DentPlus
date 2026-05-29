import assert from 'assert'

async function runTests() {
  console.log('--- Iniciando Pruebas de Integración de Autenticación, Zod y Aislamiento de Datos ---')
  
  const adminEmail1 = `admin.test1_${Date.now()}@gmail.com`
  const adminEmail2 = `admin.test2_${Date.now()}@gmail.com`
  const adminPassword = 'password123'
  
  // 1. Intentar acceder a /affiliates sin autenticar (Debe redirigir a /login)
  console.log('\n1. Probando protección de rutas (sin autenticar)...')
  const responseUnauth = await fetch('http://localhost:3000/affiliates', {
    method: 'GET',
    redirect: 'manual'
  })
  console.log('Status de respuesta (esperado 302):', responseUnauth.status)
  const isRedirected = responseUnauth.status === 302 && responseUnauth.headers.get('location')?.endsWith('/login')
  console.log('¿Redirigió correctamente a /login?:', isRedirected ? '✅ SÍ' : '❌ NO')
  if (!isRedirected) throw new Error('Fallo en la protección de rutas')

  // 2. Registrar el primer administrador en /login/register
  console.log('\n2. Probando registro de Administrador 1...')
  const responseRegister1 = await fetch('http://localhost:3000/login/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      email: adminEmail1,
      password: adminPassword
    }),
    redirect: 'manual'
  })
  console.log('Status de respuesta (esperado 302):', responseRegister1.status)
  const cookieHeader1 = responseRegister1.headers.get('set-cookie')
  console.log('¿Recibió Cookie de Sesión 1?:', cookieHeader1 ? '✅ SÍ' : '❌ NO')
  if (!cookieHeader1) throw new Error('Fallo en el registro 1')

  // 3. Probando envío de datos válidos a /affiliates/create con la sesión activa (Administrador 1)
  console.log('\n3. Probando creación de afiliado (Administrador 1)...')
  const affiliateEmail1 = `affiliate.valid1_${Date.now()}@gmail.com`
  const responseValid1 = await fetch('http://localhost:3000/affiliates/create', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookieHeader1
    },
    body: new URLSearchParams({
      firstName: 'Juan',
      lastName: 'Pérez',
      email: affiliateEmail1,
      membershipType: 'gold'
    }),
    redirect: 'manual'
  })
  
  console.log('Status de respuesta (esperado 302):', responseValid1.status)
  let affiliateId1 = null
  if (responseValid1.status === 302) {
    console.log('✅ Éxito: Registro válido redireccionó correctamente (302).')
    const location = responseValid1.headers.get('location')
    affiliateId1 = location ? location.split('/').pop() : null
    console.log('ID del afiliado creado:', affiliateId1)
  } else {
    throw new Error('Fallo en la creación de afiliado con sesión 1')
  }

  // 4. Probando envío de datos inválidos (forzando errores de Zod con sesión)
  console.log('\n4. Probando envío de datos INVÁLIDOS (forzando errores de Zod)...')
  const responseInvalid = await fetch('http://localhost:3000/affiliates/create', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookieHeader1
    },
    body: new URLSearchParams({
      firstName: '',
      lastName: '',
      email: 'correo-incorrecto',
      membershipType: ''
    })
  })

  const html = await responseInvalid.text()
  const containsFirstNameError = html.includes('El nombre es requerido')
  const containsLastNameError = html.includes('El apellido es requerido')
  const containsEmailError = html.includes('El correo electrónico no es válido')
  const containsMembershipError = html.includes('El tipo de membresía es requerido')
  
  console.log('¿Contiene error de Nombre?:', containsFirstNameError ? '✅ SÍ' : '❌ NO')
  console.log('¿Contiene error de Apellido?:', containsLastNameError ? '✅ SÍ' : '❌ NO')
  console.log('¿Contiene error de Email?:', containsEmailError ? '✅ SÍ' : '❌ NO')
  console.log('¿Contiene error de Membresía?:', containsMembershipError ? '✅ SÍ' : '❌ NO')
  
  if (containsFirstNameError && containsLastNameError && containsEmailError && containsMembershipError) {
    console.log('✅ Éxito: Los errores de validación de Zod se mapearon y renderizaron correctamente.')
  } else {
    throw new Error('La validación de Zod falló o no se renderizaron los mensajes esperados.')
  }

  // 5. Probando edición de afiliado con email duplicado (Debe mostrar validación, no 404)
  console.log('\n5. Probando edición con email duplicado...')
  const conflictEmail = `conflict.${Date.now()}@gmail.com`
  console.log('Creando un segundo afiliado para Administrador 1 con email:', conflictEmail)
  const responseConflictUser = await fetch('http://localhost:3000/affiliates/create', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookieHeader1
    },
    body: new URLSearchParams({
      firstName: 'Conflicto',
      lastName: 'Prueba',
      email: conflictEmail,
      membershipType: 'silver'
    }),
    redirect: 'manual'
  })
  if (responseConflictUser.status !== 302) throw new Error('Fallo al crear el segundo afiliado de prueba')

  console.log(`Intentando actualizar afiliado ID ${affiliateId1} con el email en conflicto: ${conflictEmail}`)
  const responseEditDuplicate = await fetch(`http://localhost:3000/affiliates/${affiliateId1}/edit`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookieHeader1
    },
    body: new URLSearchParams({
      firstName: 'Juan',
      lastName: 'Pérez Modificado',
      email: conflictEmail,
      membershipType: 'gold'
    }),
    redirect: 'manual'
  })

  console.log('Status de respuesta (esperado 200):', responseEditDuplicate.status)
  const editHtml = await responseEditDuplicate.text()
  const containsDuplicateError = editHtml.includes('Este correo electrónico ya está registrado')
  console.log('¿Contiene error de email duplicado?:', containsDuplicateError ? '✅ SÍ' : '❌ NO')
  if (!containsDuplicateError) throw new Error('Fallo: No se mostró error de email duplicado en edición')

  // 6. Aislamiento absoluto de datos: Registrar Administrador 2 y validar que no ve los datos de Administrador 1
  console.log('\n6. Probando aislamiento de datos (Administrador 2)...')
  const responseRegister2 = await fetch('http://localhost:3000/login/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      email: adminEmail2,
      password: adminPassword
    }),
    redirect: 'manual'
  })
  const cookieHeader2 = responseRegister2.headers.get('set-cookie')
  if (!cookieHeader2) throw new Error('Fallo en el registro 2')

  // Administrador 2 consulta la lista de afiliados: Debe estar vacía porque no tiene afiliados propios
  console.log('Administrador 2 consulta su lista de afiliados...')
  const responseList2 = await fetch('http://localhost:3000/affiliates', {
    method: 'GET',
    headers: { 'Cookie': cookieHeader2 }
  })
  const listHtml2 = await responseList2.text()
  const containsFirstAffiliateName = listHtml2.includes('Juan Pérez')
  console.log('¿La lista de Admin 2 contiene afiliados de Admin 1?:', containsFirstAffiliateName ? '❌ SÍ (Fallo de aislamiento)' : '✅ NO (Aislamiento correcto)')
  if (containsFirstAffiliateName) throw new Error('Fallo de aislamiento: Admin 2 ve afiliados de Admin 1 en el listado')

  // Administrador 2 intenta ver el detalle del afiliado de Administrador 1: Debe retornar 404
  console.log(`Administrador 2 intenta acceder al detalle del afiliado ID ${affiliateId1}...`)
  const responseDetail2 = await fetch(`http://localhost:3000/affiliates/${affiliateId1}`, {
    method: 'GET',
    headers: { 'Cookie': cookieHeader2 }
  })
  console.log('Status de respuesta recibido (esperado 404):', responseDetail2.status)
  if (responseDetail2.status !== 404) {
    throw new Error('Fallo de aislamiento: Admin 2 pudo acceder al afiliado de Admin 1 o no retornó 404')
  }
  console.log('✅ Éxito: Admin 2 recibió correctamente un error 404 al intentar ingresar a un afiliado ajeno.')

  console.log('\n🎉 ¡Todas las pruebas de integración (Sesiones, bcrypt, Zod, Route Protection, Duplicate Email Handling, DATA ISOLATION) pasaron con éxito rotundo!')
}

runTests().catch(err => {
  console.error('❌ Error durante las pruebas:', err)
  process.exit(1)
})
