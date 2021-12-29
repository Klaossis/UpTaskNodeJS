//import express from "express";
const express = require("express");
const routes = require("./routes");
const path = require("path");
const bodyParse = require("body-parser");

// Crear conexion a la BD
const db = require("./config/db");

// Importar el modelo
require("./models/Proyectos");

db.sync()
    .then( () => console.log("Conectado a la base de datos") )
    .catch( error => console.log(error));

// Crear una app de express
const app = express();

// Donde cargar los archivos estaticos
app.use(express.static("public") );

// Habilitar Pug
app.set("view engine", "pug");

// Añadir la carpeta de las vistas
app.set("views", path.join(__dirname, "./views") );

// Habilitar bodyParser para leer datos del formulario
app.use(bodyParse.urlencoded({extended: true}));

app.use("/", routes() );

app.listen(3000);

