const { request, response } = require("express");
const Proyectos = require("../models/Proyectos");

exports.proyectosHome = async (request, response) => {
    const proyectos = await Proyectos.findAll();

    response.render("index", {
        nombrePagina : "Proyectos",
        proyectos
    });
}

exports.formularioProyecto = async (request,response) => {
    const proyectos = await Proyectos.findAll();

    response.render("nuevoProyecto",{
        nombrePagina: "Nuevo Proyecto",
        proyectos
    });
}

exports.nuevoProyecto = async (request,response) => {
    const proyectos = await Proyectos.findAll();

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
            errores,
            proyectos
        });
    } else{
        // Este es el modo con promesa
        //Proyectos.create({ nombre })
            //.then( () => console.log("Insertado correctamente") )
            //.catch( error => console.log(error) );

        // Este es el modo con async

        const proyecto = await Proyectos.create({ nombre, url });
        response.redirect("/"); 

    }
    //response.send("Enivaste el formulario.");
}

exports.proyectoPorUrl = async (request, response, next) =>{
    const proyectos = await Proyectos.findAll();

    //response.send(request.params.url);
    const proyecto = await Proyectos.findOne({
        where: {
            url: request.params.url
        }
    });

    if(!proyecto) return next();

    // Render a la vista
    response.render("tareas", {
        nombrePagina: "Tareas del Proyecto",
        proyecto,
        proyectos
    });
}

exports.formularioEditar = async (request,response) =>{
    const proyectos = await Proyectos.findAll();

    // Render a la vista
    response.render("nuevoProyecto", {
        nombrePagina: "Editar Proyecto",
        proyectos
    })
}