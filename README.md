# FriendlyStakes: Fomentando la Competencia Amistosa


![Java](https://img.shields.io/badge/Java-11-007396?logo=java&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-14.17.0-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

## Descripción del Proyecto
FriendlyStakes es una plataforma digital que permite a los usuarios participar en apuestas amistosas y desafíos interactivos, fomentando la sana competencia y diversión entre amigos. Con características como registro de usuarios, gestión de apuestas, transacciones seguras y comunicación en tiempo real, FriendlyStakes busca convertirse en la referencia para la organización de eventos de apuestas entre amigos.

## Estado del Proyecto
![Project Status](https://img.shields.io/badge/Status-Completed-brightgreen)

El proyecto ha finalizado con éxito, alcanzando todos los objetivos planteados inicialmente. Sin embargo, continuamos trabajando en mejoras y nuevas funcionalidades.

## Instalación del Proyecto

### Requisitos Previos
- Java 11
- MySQL 8.0
- Node.js 14.17.0
- Maven 3.6.3

### Configurar la Base de Datos

1. **Crear una base de datos MySQL:**
   ```sql
   CREATE DATABASE friendlystakes;
2.Importar el esquema de base de datos desde db/schema.sql.

3. **Configurar las variables de entorno:**
Crear un archivo .env en el directorio raíz del proyecto con las siguientes variables:
DB_URL=jdbc:mysql://localhost:3306/friendlystakes
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña

**Construir el Proyecto**

mvn clean install

**Ejecutar la Aplicación**
mvn spring-boot:run
### Funcionalidades
- Registro e inicio de sesión de usuarios.
- Creación y gestión de apuestas amistosas.
- Sistema seguro de transacciones financieras.
- Comunicación en tiempo real entre usuarios.
- Verificación de edad mediante documentos de identificación.
- Compartir videos de desafíos y logros en redes sociales.
### Tecnologías Utilizadas
#### Backend:
- Java 11
- Spring Boot
- MySQL
- JPA/Hibernate
#### Frontend:
- Node.js 14.17.0
- Express.js
#### Herramientas y Servicios:
- Maven
- DBeaver
- Visual Studio Code
- IntelliJ IDEA
- Postman
### Autores
**Victor Heredia Lamuela: [GitHub**](https://github.com/Buny200)

### Licencia
Este proyecto está bajo la Licencia MIT. Para más información, consulta el archivo LICENSE.



# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
