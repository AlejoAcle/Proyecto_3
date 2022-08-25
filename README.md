# Título del Proyecto

<p align="center" fontweight="bold">Desarrollo Backend para aplicación de Crossfit</p>
<p align="center">
    <img src = "https://github.com/AlejoAcle/Proyecto_3/blob/master/images/kisspng-computer-icons-download-5b28c0a0115797.803029611529397408071.png" widht="200px" height="200px">
</p>

## Comenzando 🚀

_Proyecto 3 del Bootcamp **FullStack**_, creación del servidor y desarrollo del backend, para gestión de reservas y usuarios de una aplicación para un centro de entrenamiento de Crossfit.


### Funcionalidades 📋

- Registro de nuevos usuarios
- Sistema de inicio de sesión
- Subida de imagenes por el usuario para uso como avatar o imagen de perfil
- Creación de reservas para asistencia a entrenamients
- Base de ejercicios
- Posibilidad de registrar resultados y marcas personales por parte de cada usuario
- Creación de un perfil `ADMIN` para la gestión de usuarios, datos e incidencias.


### Tecnologías empleadas 🔧


<p align="center"> <a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="60" height="60"/> </a> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="60" height="60"/> </a> <a href="https://www.mongodb.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="mongodb" width="60" height="60"/> </a> <a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="60" height="60"/> </a> </p>




## Descripción Técnica ⚙️

Descripción de las funcionalidades aplicadas.

### Funciones administrador 🔩

- Al inicio de sesión el sistema reconoce el rol del usuario, detectanto si es administrador o usuario.
- El administrador puede subir los horarios, los entrenos y crear/modificar la base de datos de ejericios.
- El administrador puede ver y gestionar las reservas de todos los usuarios así como procesar la eliminación de los datos bajo petición.


### Funciones usuario ⌨️

- El usuario puede registrarse, iniciar sesión y cambiar su imagen de perfil
- Selección de horario y posibilidad de guardar sus resultados.


## Construido con 🛠️

* Desarrollo en `NodeJS`
* Base de datos alojada en `MongoAtlas`
* Servidor creado con `Express`
* Puerto servidor :5000

## Rutas 🚅

Users 

-`.post(/register)`- Ruta abierta para que el usuario pueda hacer el registro

-`.post(/login)` - Ruta abierta donde el usuario puede iniciar su sesión

-`.get(/updateProfile)` - Ruta para poder actualizar algún parametro del usuario

-`.del(/deleteUser)` - Ruta que permite eliminar un usuario a través del token

-`.del(/destroyPhoto)` - Ruta para eliminar foto de perfil/usuario

-`.post(/upload)` - Ruta para subir una imagen de perfil/usuario

-`.get(/profile)` - Ruta que permite ver el perfil de usuario

-`.get(/exercicesUser)` - Ruta para ver los ejercicios del usuario al loguearse

-`.get(/usersList)` - Ruta para visualizar la totalidad de usuarios registrados

-`.del(deleteUsers/:id)` - Ruta para eliminar algún usuario mediante su ID



Booking

-`.post(/newBooking)` - Ruta para realizar una reserva

-`.del(/deleteBooking/:id)` - Ruta para eliminar una reserva por ID


Classes

-`.get(/classes)` - Ruta para conocer las clases disponibles

-`.get(/newClasses)` - Ruta ADMIN para crear las clases 

-`.get(/updateClass/:id)` - Ruta ADMIN que permite modificar una clase a través de su ID

-`.del(/deleteClass/:id)` - Ruta ADMIN para eliminar la clase creada a través de su ID

-`.get(/classesList/:id)` - Ruta para ver clases y horario disponible a través del ID de la clase


Exercises

-`.put(/updateExercice/:id)` - Ruta para modificar un ejercicio a través de su ID

-`.del(/deleteExercice/:id)` - Ruta para eliminar un ejercico a través de su ID

-`.get(/exercises/:id)` - Ruta para poder ver los ejercicios

-`.post(/newExercises)`- Ruta para crear el repositorio de ejercicios

-`.post(/updateExercises/:id)` - Ruta que permite modificar cada ejercicio del repositorio


Marks

-`.del(/deleteUserMark/:id)` - Ruta que permite modificar las marcas publicadas por el usuario en algún ejercicio, a través del ID

-`.post(/newMarks)` - Ruta para poder guardar los resultados personales


TimeTable

-`.post(/newTimeTable)` - Ruta ADMIN para crear el horario de entrenamiento de un día

-`.put(/updateTimeTable/:id)` - Ruta ADMIN que permite modificar el horario creado

-`.del(/deleteTimeTable/:id)` - Ruta ADMIN para eliminar un horario publicado a través de su ID


WODs

-`.get(/wodsList)` - Ruta para conocer los wods que se programen

-`.post(/createWod)` - Ruta ADMIN para crear y publicar el entrenamiento del día

-`.put(/updateWod/:id)` - Ruta ADMIN que permite modificar el entrenamiento del día publicado

-`.del(/deleteWod/:id)` - Ruta ADMIN que permite modificar el entrenamiento del día publicado


## Versionado 📌

v1.0(24.08.2022 - Presentación proyecto)

## Autores ✒️

* **Alejo** - *Trabajo Inicial* - [Alejo](https://github.com/AlejoAcle)
* **Alexandra** - *Mentora y soporte* - 

## Licencia 📄

Este proyecto está bajo la Licencia AlejoAcle 






[Alejo](https://github.com/AlejoAcle) 🦖​