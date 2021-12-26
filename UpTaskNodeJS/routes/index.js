//import express from "expres";
const express = require ("express");
const router = express.Router();

// Importar controlador
const proyectosController = require ("../controllers/proyectosController");


//export default 
module.exports = function() {
    
    // Ruta para el home
    router.get("/", proyectosController.proyectosHome);
    router.get("/nuevo-proyecto",proyectosController.formularioProyecto);
    router.post("/nuevo-proyecto",proyectosController.nuevoProyecto);

    return router;
}



