# DentPlus 🦷

DentPlus es un sistema web integral y moderno, desarrollado para facilitar la gestión de pacientes y simulaciones de citas médicas. Utiliza una arquitectura MVC (Modelo-Vista-Controlador) construida sobre Node.js y Express.

## 🚀 Características Principales

- **Gestión Completa de Usuarios (CRUD):** Visualiza, añade, edita y elimina registros de usuarios de manera sencilla.
- **Sistema de Membresías:** Diferenciación de pacientes por nivel de membresía (Silver, Gold, Platinum).
- **Simulador de Descuentos:** Herramienta integrada en el perfil de cada usuario que calcula el costo de una cita aplicando automáticamente el porcentaje de descuento según su membresía:
  - **Silver:** 5% de descuento
  - **Gold:** 10% de descuento
  - **Platinum:** 15% de descuento
- **Interfaz Moderna y Responsiva:** UI limpia construida con Bootstrap 5, tarjetas con sombras suaves y tablas responsivas.

## 🛠️ Tecnologías Utilizadas

- **Backend:** Node.js, Express.js
- **Lenguaje:** TypeScript
- **Motor de Plantillas:** Handlebars (`express-handlebars`)
- **Frontend / Estilos:** Bootstrap 5.3 (vía CDN)
- **Herramientas de Desarrollo:** Nodemon, ts-node, ESLint

## ⚙️ Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:
- Node.js (v18 o superior)
- Git

## 💻 Instalación y Ejecución

Sigue estos pasos para levantar el proyecto en tu entorno local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Ka0sss/DentPlus.git
   cd DentPlus
   ```

2. **Instalar las dependencias:**
   ```bash
   yarn install
   ```

3. **Iniciar el servidor en modo desarrollo:**
   Este comando utiliza `nodemon` para escuchar cambios en los archivos y reiniciar el servidor automáticamente.
   ```bash
   yarn dev
   ```

4. **Ver la aplicación:**
   Abre tu navegador web y visita la siguiente dirección (asumiendo que el puerto por defecto es 3000 o el que tengas configurado en `src/index.ts`):
   ```
   http://localhost:3000
   ```

## 📦 Compilación para Producción

Si deseas compilar el código de TypeScript a JavaScript plano para un entorno de producción, ejecuta:

```bash
yarn build
yarn start
```

---