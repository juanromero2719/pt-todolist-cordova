
# Respuestas a las preguntas de la entrevista

## ¿Cuáles fueron los principales desafíos que enfrentaste al implementar las nuevas funcionalidades?

Durante la implementación del proyecto, enfrenté varios desafíos técnicos significativos:

### 1. **Configuración e Integración de Firebase**
- **Desafío:** Configurar correctamente Firebase Remote Config con Angular, especialmente la inicialización del servicio `RemoteConfig` que requería una instancia válida de Firebase App.
- **Solución:** Implementé la inicialización correcta usando `getApp()` para obtener la instancia de Firebase App antes de crear Remote Config, asegurando que el servicio estuviera correctamente asociado al proyecto Firebase.

### 2. **Manejo de Errores en Remote Config**
- **Desafío:** Implementar un sistema robusto de feature flags que funcionara incluso cuando Firebase Remote Config no estuviera disponible o fallara la conexión.
- **Solución:** Implementé valores por defecto en `FirebaseRemoteConfigFlags` y un manejo de errores con `try-catch` que permite que la aplicación funcione con valores locales cuando hay problemas de conectividad.

### 3. **Build de Android en Docker**
- **Desafío:** Configurar un entorno Docker completo para compilar APKs de Android, incluyendo Android SDK, Build Tools, Gradle y todas las dependencias necesarias.
- **Solución:** Creé `Dockerfile.android` con instalación completa de Android SDK, aceptación automática de licencias, instalación de Gradle 8.5, y configuración correcta de variables de entorno (`ANDROID_HOME`, `GRADLE_HOME`).452

## ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?

Implementé múltiples técnicas de optimización basadas en las mejores prácticas de Angular y RxJS:

### 1. **Change Detection Strategy OnPush**
```typescript
changeDetection: ChangeDetectionStrategy.OnPush
```
- **Por qué:** Reduce drásticamente las verificaciones de cambios, mejorando el rendimiento especialmente en listas grandes. Angular solo verifica cambios cuando:
  - Cambian las referencias de `@Input()`
  - Se disparan eventos del componente
  - Se marca manualmente con `ChangeDetectorRef`


### 2. **Optimización de Renderizado de Listas**
```typescript
trackByTaskId(index: number, task: any): string {
    return task.id;
}
```
- **Por qué:** Permite a Angular identificar elementos únicos en listas, evitando recrear elementos del DOM cuando solo cambian propiedades, mejorando significativamente el rendimiento en listas grandes.

### 3. **Lazy Loading de Componentes**
- **Por qué:** Reduce el tamaño del bundle inicial, cargando componentes solo cuando son necesarios, mejorando el tiempo de carga inicial de la aplicación.

### Resultados Esperados:
- ⚡ **Inicio más rápido:** Lazy loading reduce el bundle inicial
- 🚀 **Menos recálculos:** OnPush y distinctUntilChanged reducen verificaciones innecesarias
- 💾 **Mejor uso de memoria:** shareReplay y take(1) optimizan el uso de recursos
- 📱 **Renderizado optimizado:** trackBy mejora el rendimiento en listas grandes

## ¿Cómo aseguraste la calidad y mantenibilidad del código?

Implementé varias prácticas y patrones arquitectónicos para garantizar código de calidad y fácil mantenimiento:

### 1. **Arquitectura Limpia (Clean Architecture)**
El proyecto sigue una arquitectura en capas bien definida:

```
src/app/core/
├── domain/              # Modelos de dominio puros (Task, TaskStatus)
├── application/         # Use cases y lógica de negocio
├── infraestructure/     # Implementaciones concretas (repositorios, servicios externos)
└── services/           # Servicios compartidos
```

- **Separación de responsabilidades:** Cada capa tiene una responsabilidad clara
- **Independencia de frameworks:** La lógica de negocio no depende de Angular o Firebase
- **Testabilidad:** Cada capa puede ser testeada independientemente

### 2. **Patrón de Use Cases**
```typescript
export class AddTaskUseCase {
    constructor(private taskRepository: TaskRepository) {}
    execute(title: string, category: string): Observable<Task[]> {
        // Lógica de negocio encapsulada
    }
}
```
- **Ventajas:** Encapsula la lógica de negocio, facilita testing y reutilización
- **Mantenibilidad:** Cambios en la lógica de negocio se centralizan en un solo lugar

### 3. **Inversión de Dependencias (Dependency Injection)**
```typescript
@Injectable({ providedIn: 'root'})
export class LocalTaskRepository implements TaskRepository {
    // Implementación concreta
}
```
- **Interfaces:** Uso de interfaces (`TaskRepository`, `FeatureFlags`) para contratos claros
- **Inyección de dependencias:** Angular maneja la creación e inyección de dependencias
- **Flexibilidad:** Fácil intercambiar implementaciones (ej: cambiar de localStorage a Firebase)

### 4. **TypeScript para Type Safety**
- **Tipado fuerte:** Todos los modelos, interfaces y funciones están tipados
- **Detección temprana de errores:** El compilador detecta errores antes de ejecución
- **Autocompletado:** Mejor experiencia de desarrollo y menos errores

- **Estado reactivo:** El estado se actualiza reactivamente, facilitando el debugging

### 5. **Configuración y Entornos**
- **Environment files:** Separación clara entre desarrollo y producción
- **Configuración centralizada:** Firebase y otras configuraciones en un solo lugar
- **Fácil despliegue:** Cambios de entorno sin modificar código

### 6. **Documentación y Estructura Clara**
- **README detallado:** Documentación completa del proyecto
- **Nombres descriptivos:** Variables, funciones y clases con nombres claros
- **Comentarios cuando es necesario:** Comentarios en código complejo o no obvio

### 7. **Testing Preparado**
- **Karma y Jasmine:** Framework de testing configurado
- **Arquitectura testeable:** Separación de lógica facilita unit testing
- **Mocks facilitados:** Interfaces permiten fácil creación de mocks

### 8. **Docker para Consistencia**
- **Entornos reproducibles:** Docker asegura que todos trabajen en el mismo entorno
- **Builds consistentes:** El build de Android funciona igual en cualquier máquina
- **Documentación viva:** Dockerfiles documentan las dependencias del proyecto

# Nota importa

No se logro probar la parte de iOS debido a que no poseo una macOs para realizar la prueba.

# 📱 PT Cordova Todo

Aplicación móvil To-Do List desarrollada con Ionic, Angular y Cordova, con integración de Firebase Remote Config para feature flags y optimizaciones de rendimiento.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Build y Despliegue](#-build-y-despliegue)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Optimizaciones de Rendimiento](#-optimizaciones-de-rendimiento)
|- [Docker](#-docker)
- [Scripts Disponibles](#-scripts-disponibles)
- [Contribución](#-contribución)

## ✨ Características

### Funcionalidades Principales

- ✅ **Gestión de Tareas**
  - Agregar nuevas tareas con título y categoría
  - Marcar tareas como completadas
  - Eliminar tareas con animación
  - Visualización de estado (pendiente/completada)

- 🏷️ **Sistema de Categorías**
  - Asignar categorías a las tareas
  - Filtrar tareas por categoría
  - Lista dinámica de categorías disponibles

- 💾 **Almacenamiento Local**
  - Persistencia de datos en `localStorage`
  - Los datos se mantienen entre sesiones
  - Sin necesidad de conexión a internet

- 🚩 **Feature Flags con Firebase Remote Config**
  - Control remoto de funcionalidades
  - Feature flags implementados:
    - `ff_enable_categories`: Habilita/deshabilita categorías
    - `ff_enable_delete`: Habilita/deshabilita botón de eliminar
    - `ff_enable_complete`: Habilita/deshabilita completar tareas

- 🎨 **Interfaz Moderna**
  - Diseño con gradientes y animaciones
  - Feedback visual con sonidos
  - Animaciones suaves en transiciones
  - UI responsiva y adaptable

- ⚡ **Optimizaciones de Rendimiento**
  - Change Detection Strategy OnPush
  - Lazy loading de componentes
  - Memoización de cálculos costosos
  - Optimización de observables RxJS

## 🛠️ Tecnologías

### Frontend
- **Ionic 8** - Framework UI para aplicaciones móviles
- **Angular 20** - Framework de desarrollo
- **TypeScript 5.9** - Lenguaje de programación
- **RxJS 7.8** - Programación reactiva
- **SCSS** - Preprocesador CSS

### Mobile
- **Cordova 14** - Plataforma para apps híbridas
- **Cordova Android 14.0.1** - Plataforma Android
- **Cordova iOS** - Plataforma iOS (requiere macOS)

### Backend/Servicios
- **Firebase 11.10** - Backend como servicio
- **Firebase Remote Config** - Feature flags remotos
- **Angular Fire 20.1** - Integración Angular con Firebase

### Herramientas de Desarrollo
- **Angular CLI 20** - Herramientas de línea de comandos
- **Ionic CLI** - CLI de Ionic
- **Cordova CLI** - CLI de Cordova
- **ESLint** - Linter de código
- **Karma & Jasmine** - Testing framework

## 📦 Requisitos Previos

### Para Desarrollo Web
- **Node.js** >= 18.x
- **npm** >= 9.x
- **Angular CLI** (se instala con npm)

### Para Android
- **Java JDK** 17 o superior
- **Android SDK** (Android Studio recomendado)
- **Android Build Tools** 35.0.0
- Variables de entorno configuradas:
  - `ANDROID_HOME` o `ANDROID_SDK_ROOT`

### Para iOS (solo macOS)
- **macOS** 12.0 o superior
- **Xcode** 14.0 o superior
- **CocoaPods** (se instala con `sudo gem install cocoapods`)
- **Apple Developer Account** (gratis o de pago)

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd pt-cordova-todo
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Instalar Plataformas de Cordova

```bash
# Android (requerido)
cordova platform add android

# iOS (solo en macOS)
cordova platform add ios
```

### 4. Verificar Requisitos

```bash
# Verificar Android
cordova requirements android

# Verificar iOS (solo macOS)
cordova requirements ios
```

## ⚙️ Configuración

### Configurar Firebase

1. **Crear Proyecto en Firebase Console**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente
   - Agrega una aplicación Web

2. **Obtener Credenciales**
   - Copia la configuración de Firebase
   - Actualiza los archivos de environment:

**`src/environments/environment.ts`** (desarrollo):
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'TU_API_KEY',
    authDomain: 'TU_PROJECT.firebaseapp.com',
    projectId: 'TU_PROJECT_ID',
    appId: 'TU_APP_ID',
    storageBucket: 'TU_PROJECT.appspot.com',
    messagingSenderId: 'TU_SENDER_ID',
    measurementId: 'TU_MEASUREMENT_ID'
  },
};
```

**`src/environments/environment.prod.ts`** (producción):
```typescript
export const environment = {
  production: true,
  firebase: {
    // Mismas credenciales o diferentes según tu configuración
  },
};
```

### Configurar Firebase Remote Config (Opcional)

1. Ve a Firebase Console → **Remote Config**
2. Crea los siguientes parámetros:
   - `ff_enable_categories` (Boolean, default: `true`)
   - `ff_enable_delete` (Boolean, default: `true`)
   - `ff_enable_complete` (Boolean, default: `true`)
3. Publica los cambios

**Nota:** La app funciona sin configurar Remote Config, usando valores por defecto.

### Configurar Signing para Android (Producción)

1. **Crear Keystore:**
```bash
keytool -genkey -v -keystore pt-cordova-release.keystore -alias pt-cordova -keyalg RSA -keysize 2048 -validity 10000
```

2. **Crear `platforms/android/release-signing.properties`:**
```properties
storeFile=../pt-cordova-release.keystore
storePassword=TU_PASSWORD
keyAlias=pt-cordova
keyPassword=TU_PASSWORD
```

**⚠️ IMPORTANTE:** No subas el keystore ni las propiedades al repositorio.

## 💻 Uso

### Desarrollo Web

```bash
# Iniciar servidor de desarrollo
npm start
# o
ionic serve
```

La aplicación estará disponible en `http://localhost:4200`

### Desarrollo Android

```bash
# Build de debug
npm run build:android:debug

# Ejecutar en dispositivo/emulador
npm run run:android
```

### Desarrollo iOS (solo macOS)

```bash
# Build de debug
npm run build:ios

# Ejecutar en dispositivo/emulador
npm run run:ios

# Abrir en Xcode
open platforms/ios/MyApp.xcworkspace
```

## 📱 Build y Despliegue

### Generar APK (Android)

#### APK de Debug
```bash
npm run build:android:debug
```
**Ubicación:** `platforms/android/app/build/outputs/apk/debug/app-debug.apk`

#### APK de Release (Firmado)
```bash
npm run build:android:release
```
**Ubicación:** `platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk`

**Nota:** Si configuraste el signing, el APK se firmará automáticamente.

### Generar IPA (iOS - solo macOS)

1. **Abrir proyecto en Xcode:**
```bash
open platforms/ios/MyApp.xcworkspace
```

2. **Configurar en Xcode:**
   - Seleccionar tu Team
   - Configurar Bundle ID único
   - Habilitar "Automatically manage signing"

3. **Generar Archive:**
   - En Xcode: **Product → Archive**
   - En Organizer: **Distribute App**
   - Seleccionar método de distribución

**Ubicación del IPA:** Se genera después de exportar desde Xcode Organizer.

### Distribución

- **Google Play Store:** Sube el APK firmado desde Google Play Console
- **Apple App Store:** Sube el IPA desde Xcode Organizer o App Store Connect
- **Distribución Externa:** 
  - Android: Instala el APK directamente (sideloading)
  - iOS: Usa TestFlight o distribución Enterprise

## 📁 Estructura del Proyecto

```
pt-cordova-todo/
├── platforms/              # Plataformas nativas (Android/iOS)
├── plugins/                # Plugins de Cordova
├── resources/              # Iconos y splash screens
│   ├── android/
│   └── ios/
├── src/
│   ├── app/
│   │   ├── core/           # Código core de la aplicación
│   │   │   ├── application/    # Use cases y lógica de negocio
│   │   │   ├── domain/         # Modelos de dominio
│   │   │   ├── infraestructure/ # Repositorios e implementaciones
│   │   │   └── services/       # Servicios compartidos
│   │   ├── features/       # Features de la aplicación
│   │   │   └── todo/          # Feature To-Do
│   │   │       ├── state/      # Estado y store
│   │   │       └── ui/         # Componentes UI
│   │   ├── home/           # Módulo Home
│   │   ├── app.module.ts   # Módulo principal
│   │   └── app-routing.module.ts
│   ├── assets/             # Assets estáticos
│   ├── environments/       # Configuración de environments
│   ├── theme/              # Tema y variables SCSS
│   ├── global.scss         # Estilos globales
│   ├── index.html          # HTML principal
│   └── main.ts             # Punto de entrada
├── www/                    # Build output (generado)
├── config.xml              # Configuración de Cordova
├── angular.json            # Configuración de Angular
├── package.json            # Dependencias y scripts
└── README.md               # Este archivo
```

### Arquitectura

El proyecto sigue una **arquitectura limpia** con separación de responsabilidades:

- **Domain:** Modelos y lógica de negocio pura
- **Application:** Use cases que orquestan la lógica
- **Infrastructure:** Implementaciones concretas (repositorios, servicios externos)
- **UI:** Componentes y presentación

## ⚡ Optimizaciones de Rendimiento

### Implementadas

1. **Change Detection Strategy OnPush**
   - Reduce verificaciones innecesarias de cambios
   - Mejora significativa en rendimiento

2. **Lazy Loading**
   - Componentes cargados bajo demanda
   - Code splitting automático

3. **Optimización de Observables**
   - `shareReplay(1)`: Cachea valores y comparte entre suscriptores
   - `distinctUntilChanged()`: Evita emisiones duplicadas

4. **Manejo de Memoria**
   - `take(1)` en suscripciones para evitar memory leaks
   - Async pipe para manejo automático de suscripciones

5. **Optimización de Listas**
   - `trackBy` en `*ngFor` para mejor rendimiento en listas grandes

### Resultados Esperados

- ⚡ Inicio más rápido gracias al lazy loading
- 🚀 Menos recálculos con OnPush y distinctUntilChanged
- 💾 Mejor uso de memoria con shareReplay y take(1)
- 📱 Renderizado optimizado con trackBy

## 🐳 Docker

El proyecto incluye configuración de Docker para contenerización y despliegue.

### Requisitos

- **Docker** >= 20.10
- **Docker Compose** >= 2.0 (opcional, pero recomendado)

### Dockerfiles Disponibles

#### 1. `Dockerfile` - Producción
Multi-stage build optimizado para producción:
- Stage 1: Build de la aplicación Angular/Ionic
- Stage 2: Servidor Nginx para servir la aplicación

#### 2. `Dockerfile.dev` - Desarrollo
Imagen para desarrollo con todas las herramientas:
- Node.js 20
- Ionic CLI y Cordova CLI
- Hot reload habilitado

#### 3. `Dockerfile.android` - Build Android
Imagen para compilar APK de Android:
- Android SDK completo
- Build Tools 35.0.0
- Java JDK 17

### Uso con Docker

#### Desarrollo

```bash
# Build de la imagen de desarrollo
docker build -f Dockerfile.dev -t pt-cordova-todo:dev .

# Ejecutar contenedor de desarrollo
docker run -it --rm \
  -p 4200:4200 \
  -p 8100:8100 \
  -v ${PWD}:/app \
  pt-cordova-todo:dev
```

#### Producción

```bash
# Build de la imagen de producción
docker build -t pt-cordova-todo:prod .

# Ejecutar contenedor de producción
docker run -d --name pt-cordova-todo \
  -p 8080:80 \
  --restart unless-stopped \
  pt-cordova-todo:prod
```

La aplicación estará disponible en `http://localhost:8080`

#### Build de Android

```bash
# Build de la imagen para Android
docker build -f Dockerfile.android -t pt-cordova-todo:android .

# Ejecutar build de Android
docker run --rm \
  -v ${PWD}:/app \
  -v android-builds:/app/platforms/android/app/build/outputs/apk \
  pt-cordova-todo:android
```

### Uso con Docker Compose

#### Desarrollo

```bash
# Iniciar servicio de desarrollo
docker-compose up app-dev

# O en modo detached
docker-compose up -d app-dev
```

#### Producción

```bash
# Build e iniciar servicio de producción
docker-compose up -d app-prod
```

#### Build de Android

```bash
# Ejecutar build de Android
docker-compose run --rm android-builder
```

### Comandos Útiles

```bash
# Ver logs
docker-compose logs -f app-dev

# Detener servicios
docker-compose down

# Rebuild de imágenes
docker-compose build --no-cache

# Limpiar contenedores e imágenes
docker-compose down --rmi all -v
```

### Volúmenes

Docker Compose configura los siguientes volúmenes:
- Código fuente montado para desarrollo
- `node_modules` como volumen separado
- `android-builds` para APKs generados

### Variables de Entorno

Puedes crear un archivo `.env` para configurar variables:

```env
NODE_ENV=development
PORT=4200
```

Y usarlo con Docker Compose:
```bash
docker-compose --env-file .env up
```

## 📜 Scripts Disponibles

### Desarrollo
```bash
npm start              # Servidor de desarrollo
npm run build          # Build de producción
npm run watch          # Build con watch mode
npm test               # Ejecutar tests
npm run lint           # Linter de código
```

### Android
```bash
npm run build:android              # Build debug
npm run build:android:debug        # Build debug (explícito)
npm run build:android:release      # Build release
npm run run:android                # Ejecutar en dispositivo
```

### iOS
```bash
npm run build:ios                  # Build debug
npm run build:ios:release          # Build release
npm run run:ios                    # Ejecutar en dispositivo
npm run add:ios                    # Agregar plataforma iOS
npm run requirements:ios           # Verificar requisitos iOS
```

### Docker
```bash
npm run docker:dev                 # Iniciar desarrollo con Docker
npm run docker:prod                # Iniciar producción con Docker
npm run docker:build               # Build de imagen de producción
npm run docker:android             # Build de Android con Docker
```

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test

# Ejecutar tests con coverage
npm run test -- --code-coverage
```

## 🐛 Solución de Problemas

### Error: "No installed build tools found"
```bash
# Instalar Android Build Tools
sdkmanager "build-tools;35.0.0"

# Aceptar licencias
sdkmanager --licenses
```

### Error: "platform ios is not installed"
```bash
# Solo en macOS
cordova platform add ios
```

### Error: Firebase no funciona
- Verifica que las credenciales estén correctas en `environment.ts`
- Asegúrate de que el proyecto Firebase esté activo
- Verifica la conexión a internet

### APK no se instala
- Verifica que "Fuentes desconocidas" esté habilitado en Android
- Asegúrate de que el APK esté firmado correctamente

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Ionic Framework Team** - Trabajo inicial
- **Tu Nombre** - Desarrollo y mejoras

## 🙏 Agradecimientos

- [Ionic Framework](https://ionicframework.com/)
- [Angular](https://angular.io/)
- [Apache Cordova](https://cordova.apache.org/)
- [Firebase](https://firebase.google.com/)

## 📞 Soporte

Para soporte, abre un issue en el repositorio o contacta al equipo de desarrollo.

---

**Versión:** 0.0.1  
**Última actualización:** 2025

