#  Frontend - Sistema de Gestión de Reciclaje (Angular)

Este repositorio contiene la aplicación web (SPA) desarrollada en **Angular 17+** para el sistema de reciclaje. La interfaz permite a los usuarios interactuar con los servicios del backend de forma intuitiva, visualizando centros de reciclaje, gestionando perfiles y consultando estadísticas de impacto ambiental.

##  Tecnologías Utilizadas

* **Angular:** Framework principal para la creación de la interfaz.
* **TypeScript:** Lenguaje base para una programación robusta.
* **Angular Material / Bootstrap:** Para un diseño responsivo y moderno.
* **Mapbox API:** Implementación de mapas interactivos para localizar puntos de reciclaje.
* **RxJS:** Gestión de flujos de datos asíncronos y peticiones HTTP.
* **JSON Web Tokens (JWT):** Manejo de sesiones seguras y autenticación.

##  Vista Previa del Proyecto

<img width="2548" height="1325" alt="image" src="https://github.com/user-attachments/assets/ff2daa47-6bae-41c4-b8f6-68bf5a25fbef" />
*Captura de pantalla de la interfaz principal del sistema.*

##  Características Principales

1. **Dashboard de Usuario:** Visualización de puntos acumulados y materiales reciclados.
2. **Mapa Interactivo:** Localización en tiempo real de centros de acopio cercanos.
3. **Gestión de Centros:** Formularios reactivos para la creación y edición de puntos de reciclaje (módulo administrativo).
4. **Seguridad:** Guardianes de ruta (AuthGuards) para proteger el acceso a usuarios no autenticados.

##  Configuración para Desarrollo

Si deseas ejecutar este proyecto localmente, sigue estos pasos:

### 1. Clonar el repositorio
Usa el siguiente comando en tu terminal:
`git clone https://github.com/RicardoPee/sistema-reciclaje-frontend.git`

### 2. Instalar dependencias
Asegúrate de tener [Node.js](https://nodejs.org/) instalado y ejecuta:
`npm install`

### 3. Configurar el Token de Mapbox
Por motivos de seguridad, los tokens de acceso han sido ocultados en el repositorio público. Para que los mapas funcionen, debes colocar tu token en los componentes correspondientes:
* `src/app/components/centro-reciclaje/creareditarcentroreciclaje/creareditarcentroreciclaje.component.ts`
* `src/app/components/centro-reciclaje/listarcentroreciclaje/listarcentroreciclaje.component.ts`

### 4. Levantar el servidor de desarrollo
Ejecuta el comando:
`ng serve`
Una vez que el comando termine, abre tu navegador en `http://localhost:4200/`.

---
Desarrollado por **Ricardo** - Estudiante de Ingeniería de Sistemas (9no ciclo).
