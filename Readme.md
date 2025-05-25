# RediboBack

Repositorio para el desarrollo Front-end de la aplicación web RediBo. Este proyecto es desarrollado para la materia Ingenieria de Software con la docente Indira Camacho de la Universiad Mayor de San Simón
Las tecnologías que se usarán para su desarrollo son:
    - Next.js
    - React
    - Tailwind

## 🛠 Tecnologías Requeridas
- [Next.js]
- [React]
- [Tailwind]
- NPM (Node Package Manager)

## Requisitos Previos
Asegúrate de tener instalado Node.js desde: <https://nodejs.org/en>  
Verifica que esté instalado ejecutando en la terminal:

```bash
node -v
npm -v
```

## 🚀 Comienzo Rápido
- Clonar el repositorio correctamente

### - 1. Clonar el repositorio

Ejecuta el siguiente comando para clonar el proyecto en tu máquina:

```bash
git clone <URL-del-repositorio>
```
Una vez clonado el repositorio debera de acceder a la carpeta de **Redibo_Back**

### - 2. Cambiar de rama

Cambiarse de rama a su rama de grupo para hacar su respectivo pull de la rama **develop** a su rama de grupo
Verificar

### - 3. Pasos

Ya que se encuentre en la carpeta **Redibo_Back** se debera de acceder a la carpeta **my-app**

```bash
cd my-app
```
Y para confirmar que se hizo clone correctamente ingrese el siguiente comando.

```bash
npm run dev
```

Si todo esta bien te mostrara una ruta local

Next.js 15.2.4 (Turbopack)
   - Local:   http://localhost:3000
   - Network: http://192.168.1.85:3000

El cual podras verificar en tu navegador colocando la ruta <http://localhost:3000>

### - 4. Problemas comunes

1. Si al ejecutar npm run dev te aparece un error, asegúrate de haber corrido primero npm install.

```bash
npm install
```
2. Si usas PowerShell y ves un error del tipo “la ejecución de scripts está deshabilitada”, puedes usar el comando a continuacion en tu **PowerShell** ejecutado como administrador lo siguiente.

```bash
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### - 5. Documentación general

Por si tienes dudas puedes seguir los siguiente pasos o acceder a la documentación.

Este es un proyecto de [Next.js](https://nextjs.org) iniciado con [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

#### Primeros pasos

- Instalacion por completo 

```bash
npx create-next-app@latest
```
Se te mostrara asi

- What is your project named? my-app
- Would you like to use TypeScript? No / Yes
- Would you like to use ESLint? No / Yes
- Would you like to use Tailwind CSS? No / Yes
- Would you like your code inside a `src/` directory? No / Yes
- Would you like to use App Router? (recommended) No / Yes
- Would you like to use Turbopack for `next dev`?  No / Yes
- Would you like to customize the import alias (`@/*` by default)? No / Yes
- What import alias would you like configured? @/*
- Primero, ejecute el servidor de desarrollo:

Y seleccionamos todo Yes si es posible.

Una vez finalizada la instalacion debemos de acceder a la carpeta creada my-app.

Ingresado a la carpeta ejecute los siguiente comandos por defecto ejecute el primer comando.

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

## instalar axios
'' npm install axios

Abra [http://localhost:3000](http://localhost:3000) con su navegador para ver el resultado.

Puede comenzar a editar la página modificando `app/page.tsx`. La página se actualiza automáticamente a medida que edita el archivo.

Este proyecto utiliza [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) para optimizar y cargar automáticamente [Geist](https://vercel.com/font), una nueva familia de fuentes para Vercel.

## Más información

Para obtener más información sobre Next.js, consulta los siguientes recursos:

- [Documentación de Next.js](https://nextjs.org/docs): conoce las características y la API de Next.js.
- [Aprende Next.js](https://nextjs.org/learn): un tutorial interactivo de Next.js.

Puedes consultar el repositorio de GitHub de Next.js](https://github.com/vercel/next.js). ¡Agradecemos tus comentarios y contribuciones!

## Implementar en Vercel

La forma más sencilla de implementar tu aplicación Next.js es usar la [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) de los creadores de Next.js.

Consulta nuestra [Documentación de implementación de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para obtener más información.

## Instalar para ejecutar el calendario 
npm install react-hot-toast
npm install react-date-range
npm install react-datepicker
