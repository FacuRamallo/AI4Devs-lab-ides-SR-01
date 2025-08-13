# Plan de Implementación: Gestión de Candidatos

A continuación se presentan los tickets de desarrollo en el orden secuencial recomendado para su implementación.

---
---

## Backend

El desarrollo del backend debe completarse primero, ya que el frontend dependerá de los contratos y endpoints definidos aquí.

### **TICKET 1: Modelado del Dominio y sus Contratos (Puertos)**

> **Asignado a:** Desarrollador Backend
> **Épica:** Gestión de Candidatos
>
> **Descripción:**
> Este ticket establece el corazón de nuestro **Contexto Delimitado (Bounded Context)** de "Gestión de Candidatos". Utilizando los patrones de DDD, modelaremos la lógica de negocio en un **Agregado**, cuya raíz será la entidad `Candidate`. El objetivo es crear un modelo de dominio rico que encapsule todas las reglas de negocio, invariantes y comportamiento, utilizando un **Lenguaje Ubicuo** que sea compartido entre desarrolladores y expertos del dominio. Este modelo será completamente independiente de la infraestructura y se centrará en la modificación directa de su estado para ser persistido.
>
> **Tareas a Realizar:**
> 1.  **Estructura de Carpetas:** Crear la estructura de directorios que refleje la arquitectura hexagonal: `domain`, `application`, `infrastructure`.
> 2.  **Definir Objetos de Valor (Value Objects):** Dentro de `domain/value-objects`, crear clases inmutables para conceptos que se describen por sus atributos. Cada VO encapsulará sus propias validaciones.
>     * `CandidateId.vo.ts`
>     * `Email.vo.ts`
>     * `Telefono.vo.ts`
>     * `Direccion.vo.ts`
>     * `WorkExperience.vo.ts`
>     * `Education.vo.ts`
> 3.  **Definir la Raíz del Agregado (Aggregate Root):** En `domain/aggregates`, crear la clase `Candidate.aggregate.ts` como la **Entidad** principal y el único punto de entrada para modificaciones. Se compondrá de los Objetos de Valor.
> 4.  **Encapsular Reglas de Negocio (Invariantes):** Implementar métodos públicos en la clase `Candidate` para manejar todas las modificaciones de estado y garantizar que el agregado siempre esté en un estado consistente.
>     * `addWorkExperience(experience: WorkExperience)`: Este método contendrá la lógica que lanza un error si se intentan añadir más de 3 experiencias.
>     * `assignCv(cvUrl: string)`: Método para asociar la URL del CV.
> 5.  **Definir el Contrato del Repositorio (Puerto):** La interfaz `ICandidateRepository.port.ts` ahora trabajará exclusivamente con el Agregado.
>     * `save(candidate: Candidate): Promise<void>`
>     * `findById(id: CandidateId): Promise<Candidate | null>`
>     * `findByEmail(email: Email): Promise<Candidate | null>`
>
> **Criterios de Aceptación:**
> * ✅ El `Candidate` está modelado como un Agregado con su raíz, entidades internas y Objetos de Valor.
> * ✅ Las reglas de negocio (ej: límite de 3 experiencias) están encapsuladas como métodos que modifican el estado interno del Agregado.
> * ✅ El puerto `ICandidateRepository` está definido para operar únicamente sobre el agregado `Candidate`, asegurando que las transacciones sean atómicas para todo el agregado.
> * ✅ Los Objetos de Valor contienen su propia lógica de validación, fallando en su creación si los datos son inválidos.

### **TICKET 2: Implementar Caso de Uso y Adaptadores para crear el Agregado `Candidate`**

> **Asignado a:** Desarrollador Backend
> **Épica:** Gestión de Candidatos
>
> **Descripción:**
> Este ticket implementa el flujo completo para la creación de un nuevo candidato siguiendo los patrones de DDD y Arquitectura Hexagonal. Un **Comando** desde la capa de infraestructura activará un **Servicio de Aplicación (Caso de Uso)**. Este servicio orquestará la creación del **Agregado** `Candidate` y usará el **Repositorio** para persistir su estado final.
>
> **Tareas a Realizar:**
> 1.  **Capa de Aplicación (Casos de Uso):**
>     * Crear el caso de uso `CreateCandidate.usecase.ts` que recibirá un DTO (Comando).
>     * El constructor del caso de uso recibirá el `ICandidateRepository` como una dependencia (inyección de dependencias).
>     * La lógica del `execute` será:
>         1. Verificar que no exista un candidato con el mismo email (usando el método `findByEmail` del repositorio).
>         2. Crear los **Objetos de Valor** (`Email`, `Telefono`, etc.) a partir de los datos del comando.
>         3. Invocar al método de fábrica `Candidate.create(...)` para instanciar el nuevo agregado.
>         4. Llamar al método `repository.save(newCandidate)` para persistir el agregado completo.
> 2.  **Capa de Infraestructura (Adaptadores):**
>     * **Adaptador de Repositorio:** Crear `MongoCandidateRepository.adapter.ts` que implemente `ICandidateRepository.port.ts`. Será responsable de mapear el Agregado del dominio a los modelos del ORM/ODM y viceversa.
>     * **Adaptador de Entrada (Controlador):** Crear `Candidate.controller.ts` para la ruta `POST /api/v1/candidates`. Su rol es recibir la petición HTTP, transformarla en un Comando y pasársela al caso de uso.
> 3.  **Configuración:** Configurar el contenedor de inyección de dependencias para conectar la interfaz del repositorio con su implementación concreta.
>
> **Criterios de Aceptación:**
> * ✅ La lógica de orquestación para crear un candidato está completamente contenida dentro de `CreateCandidate.usecase.ts`.
> * ✅ El caso de uso depende de la abstracción `ICandidateRepository.port.ts`, no de la implementación concreta de la base de datos.
> * ✅ La lógica de base de datos está totalmente encapsulada en `MongoCandidateRepository.adapter.ts`.
> * ✅ El controlador de Express es "delgado" (thin controller), sin lógica de negocio, y solo se comunica con la capa de aplicación.
> * ✅ El endpoint es funcional y cumple con todos los requisitos de negocio y validación definidos en el dominio.

### **TICKET 3: Implementar Caso de Uso y Adaptadores para añadir un CV al Agregado `Candidate`**

> **Asignado a:** Desarrollador Backend
> **Épica:** Gestión de Candidatos
>
> **Descripción:**
> Este ticket aborda la modificación de un agregado existente, tratando a AWS S3 como un servicio externo gestionado a través de un **puerto** y un **adaptador**. El **Servicio de Aplicación** orquestará la interacción, que culminará con la invocación de un método en la **Raíz del Agregado** `Candidate` para actualizar su estado.
>
> **Tareas a Realizar:**
> 1.  **Capa de Dominio:**
>     * Asegurarse de que el método `assignCv(cvUrl: string)` esté implementado en `Candidate.aggregate.ts`.
>     * Definir el puerto `IFileStorage.port.ts` con el método `upload(file: Buffer, path: string): Promise<string>`.
> 2.  **Capa de Aplicación (Casos de Uso):**
>     * Crear el caso de uso `UploadCv.usecase.ts`.
>     * El constructor recibirá `ICandidateRepository` y `IFileStorage` como dependencias.
>     * Su método `execute` recibirá un comando con el `candidateId` y el `fileBuffer`.
>     * La lógica del `execute` será:
>         1. Invocar al `IFileStorage.upload(...)` para subir el archivo.
>         2. Usar `ICandidateRepository.findById(...)` para obtener la instancia completa del agregado `Candidate`.
>         3. Invocar el método de negocio en el agregado: `candidate.assignCv(urlFromS3)`.
>         4. Llamar a `ICandidateRepository.save(candidate)` para persistir el estado actualizado del agregado.
> 3.  **Capa de Infraestructura (Adaptadores):**
>     * Implementar `S3FileStorage.adapter.ts`, que contendrá toda la lógica del SDK de AWS e implementará `IFileStorage.port.ts`.
>     * Actualizar el `Candidate.controller.ts` con la ruta `POST /api/v1/candidates/:candidateId/cv`, usando `multer` para procesar el archivo y llamar al caso de uso.
>
> **Criterios de Aceptación:**
> * ✅ La modificación del estado del candidato (la asignación de la URL del CV) se realiza exclusivamente a través de una llamada a un método en la instancia del agregado `Candidate`.
> * ✅ El servicio de aplicación (`UploadCv.usecase.ts`) orquesta el proceso: obtiene el agregado, llama a su método de negocio y lo vuelve a guardar.
> * ✅ La lógica de comunicación con AWS S3 está completamente aislada en el `S3FileStorage.adapter.ts`.
> * ✅ El repositorio siempre guarda el agregado como una unidad atómica.
> * ✅ El endpoint funciona correctamente, resultando en un archivo subido a S3 y la URL correspondiente persistida en el candidato correcto.

---
---

## Frontend

Una vez que los endpoints del backend estén definidos y (al menos inicialmente) implementados, el equipo de frontend puede comenzar su trabajo.

### **TICKET 4: Crear UI para el formulario de añadir nuevo candidato**

> **Asignado a:** Desarrollador Frontend
> **Épica:** Gestión de Candidatos
>
> **Descripción:**
> Este ticket cubre la construcción completa de la interfaz de usuario (UI) en **React** para la funcionalidad de "Añadir Candidato". Se utilizará la librería de componentes **Material-UI (MUI)** para asegurar la consistencia visual y la rapidez en el desarrollo. El formulario se conectará al endpoint `POST /api/v1/candidates` definido por el backend.
>
> **Tareas a Realizar:**
> 1.  **Punto de Entrada:** Añadir un componente `Button` de MUI con icono y texto "Añadir Candidato" en el `Dashboard` principal.
> 2.  **Routing:** Configurar la ruta `/candidates/new` para la página de creación.
> 3.  **Componente de Formulario:** Desarrollar un formulario con componentes de MUI (`TextField`, `Box`, `Grid`) para todos los campos: Nombre, Apellidos, Email, Teléfono, y los 4 campos de Dirección.
> 4.  **Manejo de Campos Dinámicos:**
>     * Para `educación`, usar `Autocomplete` de MUI para el campo `tipo` e implementar botones para añadir/quitar bloques de formación dinámicamente.
>     * Para `experiencia laboral`, implementar lógica similar con botones para añadir/quitar hasta un máximo de 3 bloques de experiencia.
> 5.  **Validación en Cliente:** Integrar `Formik` o `React Hook Form` con `yup` para ofrecer feedback instantáneo de validación al usuario.
> 6.  **Integración con API:** Al enviar un formulario válido, construir el objeto JSON y realizar una petición `POST` al endpoint del backend.
> 7.  **Manejo de Respuestas:** Utilizar el componente `Snackbar` de MUI para mostrar mensajes de éxito (`201 Created`) o error (`4xx`, `5xx`).
> 8.  **Responsividad y Accesibilidad:** Asegurar que el formulario sea usable y se vea bien en todos los dispositivos.
>
> **Criterios de Aceptación:**
> * ✅ Un botón para añadir candidatos es visible y funcional en el dashboard.
> * ✅ Al hacer clic, se muestra el formulario completo con todos los campos requeridos.
> * ✅ El usuario puede añadir y eliminar dinámicamente registros de educación y experiencia laboral (con el límite de 3).
> * ✅ La validación en cliente muestra errores claros para datos incorrectos o faltantes.
> * ✅ Al enviar un formulario válido, se realiza una petición `POST` a `/api/v1/candidates`.
> * ✅ Se muestra un `Snackbar` de éxito o error según la respuesta del servidor.
> * ✅ El formulario es completamente usable en los navegadores modernos tanto en escritorio como en móvil.

### **TICKET 5: Integrar funcionalidad de carga de CV en el formulario**

> **Asignado a:** Desarrollador Frontend
> **Épica:** Gestión de Candidatos
>
> **Descripción:**
> Este ticket se enfoca en añadir la capacidad de subir un archivo de CV al formulario de creación de candidatos. La implementación se basará en un flujo de dos pasos: primero se crea el candidato y, si la creación es exitosa, se sube inmediatamente el archivo asociado al nuevo ID del candidato.
>
> **Tareas a Realizar:**
> 1.  **Añadir Componente de UI:** Incorporar un componente para la selección de archivos en el formulario existente. Se puede estilizar un `<input type="file">` oculto con un `Button` de MUI para una mejor experiencia.
> 2.  **Manejo de Estado del Archivo:** Guardar el objeto del archivo seleccionado en el estado del componente del formulario. Mostrar el nombre del archivo seleccionado en la UI.
> 3.  **Modificar Flujo de Envío:**
>     * Tras recibir una respuesta exitosa (`201`) de la creación del candidato, extraer el `id` del nuevo candidato de la respuesta.
>     * Verificar si hay un archivo en el estado.
>     * Si hay un archivo, construir un objeto `FormData` y realizar una segunda petición `POST` al endpoint `/api/v1/candidates/:id/cv`.
> 4.  **Feedback de Carga:** Implementar un `Snackbar` o indicador específico para notificar al usuario el estado de la subida del archivo (éxito o error), de forma independiente a la notificación de la creación del candidato.
>
> **Criterios de Aceptación:**
> * ✅ El formulario de creación de candidatos incluye un botón para seleccionar un archivo (PDF o DOCX).
> * ✅ El nombre del archivo seleccionado es visible para el usuario antes de enviar el formulario.
> * ✅ Después de que el candidato se crea con éxito, se envía automáticamente una segunda petición `POST` al endpoint de carga de CV con el archivo.
> * ✅ El usuario recibe una notificación de éxito específica cuando el archivo del CV se ha subido correctamente.
> * ✅ Si la subida del archivo falla, el usuario recibe un mensaje de error claro y específico para ese fallo.

### **Detalles Adicionales para Todos los Tickets**

#### **Backend**
- **Validaciones Manuales:**
  - Implementar validaciones directamente en los métodos de dominio y controladores.
  - Ejemplo: Validar el formato de un email en el Value Object `Email` usando expresiones regulares.
  - Evitar dependencias externas para validaciones.

- **Preparación para JWT:**
  - Añadir un middleware genérico para autenticación que se pueda extender con JWT en el futuro.
  - Configurar un archivo `.env` para almacenar claves secretas y otros valores sensibles.

#### **Frontend**
- **Estado Global:**
  - Inicialmente, manejar el estado localmente dentro de los componentes.
  - Diseñar los componentes de manera que puedan integrarse fácilmente con `Context API` si se decide usar un estado global más adelante.

- **Accesibilidad:**
  - Asegurar que los formularios tengan etiquetas asociadas (`label` para cada `input`).
  - Usar atributos como `aria-label` o `aria-describedby` solo cuando sea necesario.

#### **Global**
- **Configuración de ESLint:**
  - Añadir un archivo `.eslintrc.json` con reglas básicas para TypeScript.
  - Configurar scripts en `package.json` para ejecutar ESLint.
  - Comando para verificar errores `npm run lint`
  - Commando para formatear automaticamente `npx eslint 'src/**/*.{ts,tsx}' --fix`

- **Documentación con OpenAPI:**
  - Usar `swagger-jsdoc` para generar documentación automática de los endpoints.
  - Crear un archivo `swagger.json` en el backend para definir los esquemas y rutas.
  - Añadir una ruta en el backend para servir la documentación (por ejemplo, `/api-docs`).


