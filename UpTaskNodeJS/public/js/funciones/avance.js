import Swal from "sweetalert2";

export const actualizarAvance = () => {
    // Selecionar el total de tareas
    const tareas = document.querySelectorAll("li.tarea");

    if(tareas.length){
        // Selecionar las tareas completas
        const tareasCompletas = document.querySelectorAll("i.completo");

        // Calcular avance
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);

        // Mostrar avance
        const porcentaje = document.querySelector("#porcentaje");
        porcentaje.style.width = avance+"%";

        if(avance == 100){
            Swal.fire(
                "Completaste el Proyecto",
                "Felicidades, has completado todas tus tareas.",
                "success"
            )
        }
    }
}