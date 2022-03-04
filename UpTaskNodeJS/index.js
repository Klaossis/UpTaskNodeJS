//import express from "express";
const express = require("express");
const routes = require("./routes");
const path = require("path");
const bodyParse = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");

// Extraer valores de variables .env
require("dotenv").config({ path: "variables.env"});

// Exportamos las funciones del helper
const helpers = require("./helpers");

// Crear conexion a la BD
const db = require("./config/db");

// Importar el modelo
require("./models/Proyectos");
require("./models/Tareas");
require("./models/Usuarios");

db.sync()
    .then( () => console.log("Conectado a la base de datos") )
    .catch( error => console.log(error));

// Crear una app de express
const app = express();

// Donde cargar los archivos estaticos
app.use(express.static("public") );

// Habilitar Pug
app.set("view engine", "pug");

// Habilitar bodyParser para leer datos del formulario
app.use(bodyParse.urlencoded({extended: true}));

// Añadir la carpeta de las vistas
app.set("views", path.join(__dirname, "./views") );

// Agregar flash messages
app.use(flash());

app.use(cookieParser());

// Sessiones nos permite navegare entre paginas sin volver a autentificar
app.use(session({
    secret: "supersecreto",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Para var dump a la aplicacion
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null; 
    next();
})



app.use("/", routes() );

//app.listen(3000);

//require("./handlers/email");


// Servidor y puerto
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log("El servidor esta funcionando.");
});