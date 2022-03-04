const { request, response } = require("express");
const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");

exports.proyectosHome = async (request, response) => {
    const usuarioId = response.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});

    response.render("index", {
        nombrePagina : "Proyectos",
        proyectos
    });
}

exports.formularioProyecto = async (request,response) => {
    const usuarioId = response.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});

    response.render("nuevoProyecto",{
        nombrePagina: "Nuevo Proyecto",
        proyectos
    });
}

exports.nuevoProyecto = async (request,response) => {
    const usuarioId = response.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});

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

    // Si hay errores
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

        const usuarioId = response.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });
        response.redirect("/"); 

    }
    //response.send("Enivaste el formulario.");
}

exports.proyectoPorUrl = async (request, response, next) =>{
    const usuarioId = response.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: { usuarioId }});

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: request.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    // Consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        }
        //include: [
        //    { model: Proyectos}
        //]
    });

    if(!proyecto) return next();

    // Render a la vista
    response.render("tareas", {
        nombrePagina: "Tareas del Proyecto",
        proyecto,
        proyectos,
        tareas
    });
}

exports.formularioEditar = async (request,response) =>{
    const usuarioId = response.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: { usuarioId }});

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: request.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    // Render a la vista
    response.render("nuevoProyecto", {
        nombrePagina: "Editar Proyecto  ",
        proyectos,
        proyecto
    })
}


exports.actualizaProyecto = async (request,response) => {
    const usuarioId = response.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});
    
    // validar que tengamos algo en el input
    const { nombre } = request.body;

    let errores = [];

    if(!nombre) {
        errores.push({
            "texto": "Agrega un Nombre al Proyecto"
        });
    }
    // Si hay errores
    if(errores.length > 0) {
        response.render("nuevoProyecto",{
            nombrePagina: "Nuevo Proyecto",
            errores,
            proyectos
        });
    } else{

        await Proyectos.update(
            { nombre: nombre },
            { where: {id: request.params.id}}
        );
        response.redirect("/"); 
    }
}

exports.eliminarProyecto = async (request, response, next) => {
    // request, query o params tiene los datos
    //console.log(request);
    const {urlProyecto} = request.query;

    const resultado = await Proyectos.destroy({where : { url : urlProyecto}});

    if(!resultado){
        return next();
    }

    response.status(200).send("Proyecto Eliminado Correctamente.");
}