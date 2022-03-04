const { request, response } = require("express");
const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");

exports.agregarTarea = async (request, response, next) =>{
    // obtenemos el Proyecto actual
    const proyecto = await Proyectos.findOne({ where: { url: request.params.url}});

    // Leer el valor del input
    const {tarea} = request.body;

    // Estado 0= incompleto y ID del proyecto
    const estado = 0;
    const proyectoId = proyecto.id;

    // Insertar en la base de datos
    const resultado = await Tareas.create({tarea, estado, proyectoId});

    if(!resultado){
        return next();
    }

    // Redireccionar
    response.redirect(`/proyectos/${request.params.url}`);

}

exports.cambiarEstadoTarea = async (request, response, next) => {
    const { id } = request.params;
    const tarea = await Tareas.findOne({ where: { id: id} });

    // Cambiar estado
    let estado = 0
    if(tarea.estado === estado){
        estado = 1;
    }
    tarea.estado = estado;

    const resultado = await tarea.save();

    if(!resultado){
        return next();
    }

    response.status(200).send("Actualizado");
}

exports.eliminarTarea = async (request, response, next) => {
    const { id } = request.params;
    const resultado = await Tareas.destroy({ where : { id : id }});

    if(!resultado){
        return next();
    }

    response.status(200).send("Tarea Eliminada Correctamente.");
}