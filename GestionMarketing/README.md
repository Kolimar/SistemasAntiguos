
##
##
##
##
##
##	PASOS PARA HACERLO CORRER.-
##
##
##
##
##
1) descarga.
2) se crea una bd y se clona el bd.sql ubicado en la raiz del proyecto.
BACKEND:
3) se configura el archivo .env con los datos de mail y base de datos a utilizar, por defecto el mail usa log que es un archivo en storage/logs/laravel.log.
4)en consola dentro de backend se corren los siguientes comandos:

## composer install           //Esto instala las dependencias del proyecto
## php artisan key:generate  //Esto crea una nueva clave de proyecto
## php artisan passport:key  //Esto crea claves passport
## php artisan passposrt:client --password //esto pide un nombre y genera ID y Secret para una api.

FRONTEND:
5) en la carpeta frontend dentro de la consola se corren los sig comandos:

## npm install         //esto instala las dependencias del proyecto.
6) Modificar dentro de frontend/src/app/globals/globalesVar.ts => "urlApi","urlImagenes","clientID" y "client_secret" por los correspondientes al backend.


GENERAL:

ººEl front inicializa usando el comando "ng serve" dentro de frontend. (requiere nodejs y angular cli instalado globalmente), se puede configurar con --host {hostip} y/o --port {portnumber}.

ººEl back inicializa con apache y Mysql(Para usar xampp recomiendo configurarle un virtualhost, la aplicacion que se alimente del back deberia apuntar a la carpeta "backend/public").

ººHay una carpeta que se llama testingPost que simplemente simula ser un dispositivo y manda las variables e id como test.

ººEl user admin de la BD es test@test.com y la pass de todos es 123456