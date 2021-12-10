//import express from "expres";
const express = require ("express");
const router = express.Router();

// Importar controlador
const proyectosController = require ("../controllers/proyectosController");


//export default 
module.exports = function() {
    
    // Ruta para el home
    router.get("/", proyectosController.proyectosHome);

    router.get("/nosotros", (request, response) => {
        response.send("Nosotros");
    });

    return router;
}



