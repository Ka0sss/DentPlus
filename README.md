# DentPlus 🦷 — Sistema de Gestión de Afiliados (Evolucionado)

DentPlus es una aplicación web moderna diseñada bajo la arquitectura **MVC (Modelo-Vista-Controlador)** para la administración aislada y segura de afiliados y el cálculo interactivo de descuentos en base a su nivel de membresía (Silver, Gold o Platinum).

Este proyecto ha sido evolucionado a su versión lista para producción de acuerdo a los requerimientos de la **Evaluación Unidad 3**, implementando validaciones robustas con **Zod**, autenticación de usuarios segura con **bcryptjs**, almacenamiento de sesiones del lado del servidor, migración a **PostgreSQL** y empaquetamiento con **Docker**.

---

## 🛠️ Tecnologías y Arquitectura

* **Backend:** Node.js, Express.js y TypeScript
* **ORM:** Prisma (configurado para PostgreSQL)
* **Motor de Plantillas:** Handlebars (`express-handlebars`)
* **Validación:** Zod
* **Seguridad:** Hash irreversible con `bcryptjs` y protección de rutas con middleware
* **Contenedores:** Docker & Docker Compose
* **Estilos:** Bootstrap 5.3 (curado con diseño moderno, sombras suaves y componentes responsivos)

---

## 🚀 Decisiones de Diseño: ¿Por qué bcryptjs va en el Controller y no en el Model?

En un buen diseño MVC, la **Capa de Modelo (Model)** debe ocuparse única y exclusivamente de la persistencia de datos (consultas SQL, interactuar con el ORM, leer/escribir la BD). No debe saber nada sobre lógica de presentación, sesiones HTTP, ni tampoco sobre la procedencia de los datos.

Por ende, **bcryptjs va en el Controller** por los siguientes motivos arquitectónicos clave:
1. **Separación de Capas:** Si ciframos la contraseña en el modelo, estaríamos cargando al modelo con lógica de negocio y seguridad. El modelo solo debe recibir una contraseña ya lista (hasheada) y guardarla.
2. **Reutilización y Flexibilidad:** Si en el futuro decidimos cambiar el método de cifrado (por ejemplo, pasar de bcryptjs a Argon2 o usar un servicio de autenticación externo como Auth0), solo tendríamos que modificar el controlador de autenticación sin alterar la capa de persistencia de datos (el modelo sigue haciendo `create` de la misma forma).
3. **Control del flujo de error:** El controlador maneja las respuestas HTTP y el renderizado de la interfaz. Al procesar el cifrado y la validación en el controlador, podemos capturar inmediatamente fallas en la entrada del usuario y repoblar/mostrar errores directamente en la vista en una sola transacción HTTP.

---

## 💻 Requisitos Previos

Asegúrate de tener instalado en tu sistema:
* **Node.js** (versión 18 o superior)
* **Yarn** o **npm**
* **Docker Desktop** (opcional, recomendado para producción/profesor)

---

## 🐳 Levantamiento con Docker (Recomendado / Máquina de Evaluación)

Docker levantará una base de datos PostgreSQL aislada y configurará la aplicación para que se conecte automáticamente a ella.

1. **Clonar e ingresar al proyecto:**
   ```bash
   git clone https://github.com/Ka0sss/DentPlus.git
   cd DentPlus
   ```

2. **Crear el archivo `.env`:**
   Copia el archivo de ejemplo para configurar las variables de entorno predefinidas:
   ```bash
   copy .env.example .env
   ```

3. **Levantar los servicios:**
   Ejecuta Docker Compose para construir y levantar tanto la aplicación como PostgreSQL. La aplicación ejecutará automáticamente las migraciones y el mapeo de base de datos (`npx prisma db push`) internamente sin necesidad de intervención manual:
   ```bash
   docker compose up --build -d
   ```

4. **Acceder a la aplicación:**
   Una vez que los contenedores estén activos y saludables, abre tu navegador e ingresa a:
   ```
   http://localhost:3000
   ```

---

## ⚙️ Levantamiento Local sin Docker (Entorno de Desarrollo)

Si deseas correr la aplicación sin usar contenedores Docker, necesitarás una instancia local de PostgreSQL en tu máquina.

1. **Instalar dependencias:**
   ```bash
   yarn install
   ```

2. **Configurar el archivo `.env`:**
   Abre tu archivo `.env` y asegúrate de que `DATABASE_URL` apunte a tu PostgreSQL local:
   ```env
   DATABASE_URL=postgresql://[usuario]:[contraseña]@localhost:5432/dentplus?schema=public
   SESSION_SECRET=un-secreto-seguro
   ```

3. **Crear la base de datos y aplicar esquema:**
   ```bash
   npx prisma db push
   ```

4. **Compilar y arrancar la aplicación:**
   * **Compilar TypeScript:**
     ```bash
     node node_modules/typescript/bin/tsc
     ```
   * **Iniciar el Servidor:**
     ```bash
     node dist/index.js
     ```

5. **Acceder a la aplicación:**
   Ingresa a: `http://localhost:3000`

---

## 🧪 Ejecución de Pruebas de Integración

El proyecto incluye un script de pruebas automatizado que valida la seguridad de sesión, los registros de Zod, el repoblado de formularios y el aislamiento de datos (un usuario administrador no puede ver ni modificar los afiliados de otro administrador).

Para ejecutar las pruebas:
```bash
node scratch/test-zod.js
```

---

## 🤖 Declaración de Uso de Inteligencia Artificial

* **Herramientas utilizadas:** Antigravity (diseñado por Google DeepMind).
* **Prompts y Trabajo en Pareja:**
  * *"Implementemos los cambios del repositorio de referencia en mi app."*
  * *"¿Cómo podemos levantar Docker si no tengo instalado en mi computador local?"*
* **Aprendizajes del Proceso:**
  * **Prisma 7 Config:** Aprendimos que en Prisma 7, las variables de conexión se separan del archivo `schema.prisma` y se configuran de forma moderna y programática en `prisma.config.ts`, permitiendo modularidad completa.
  * **Aislamiento de Sesión:** Entendimos la importancia de la seguridad a nivel de datos filtrando todas las consultas del CRUD de afiliados con la variable `userId` extraída directamente de la sesión HTTP en lugar de pasarla a través de inputs ocultos (los cuales un atacante podría alterar fácilmente).
  * **ESM Imports en Node:** Practicamos el empaquetado y resolución de módulos ESM nativos en Node.js, y cómo configurar resoluciones de vistas usando `process.cwd()` de manera robusta para que funcione sin diferencias entre desarrollo (`ts-node`) y producción (`dist/`).