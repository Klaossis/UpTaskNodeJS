//import express from "expres";
const express = require ("express");
const router = express.Router();

// Importar express validator
const { body } = require("express-validator/check");

// Importar controlador
const proyectosController = require ("../controllers/proyectosController");


//export default 
module.exports = function() {
    
    // Ruta para el home
    router.get("/", proyectosController.proyectosHome);
    router.get("/nuevo-proyecto",proyectosController.formularioProyecto);
    router.post("/nuevo-proyecto",
        body("nombre").isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );

    // Listar proyecto
    router.get("/proyecto/:url", proyectosController.proyectoPorUrl);

    // Actualiza el proyecto
    router.get("/proyecto/editar/:id", proyectosController.formularioEditar);

    return router;
}



