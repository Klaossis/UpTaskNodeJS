const Proyectos = require("../models/Proyectos");

exports.proyectosHome = (request, response) => {
    response.render("index", {
        nombrePagina : "Proyectos"
    });
}

exports.formularioProyecto = (request,response) => {
    response.render("nuevoProyecto",{
        nombrePagina: "Nuevo Proyecto"
    });
}

exports.nuevoProyecto = (request,response) => {
    // Enviar a la consola lo que el usuario escriba.
    //console.log(request.body);

    // validar que tengamos algo en el input
    const { nombre } = request.body;

    let errores = [];

    if(!nombre) {
        errores.push({
            "texto": "Agrega un Nombre al Proyecto"
        });
    }

    // So hay errores
    if(errores.length > 0) {
        response.render("nuevoProyecto",{
            nombrePagina: "Nuevo Proyecto",
            errores
        });
    } else{
        // No hay errores
        // Insertar en la DB.
        Proyectos.create({ nombre })
            .then( () => console.log("Insertado correctamente") )
            .catch( error => console.log(error) );
    }
    //response.send("Enivaste el formulario.");
}