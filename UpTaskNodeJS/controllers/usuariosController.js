const Usuarios = require("../models/Usuarios");
const enviarEmail = require("../handlers/email");

exports.formCrearCuenta = (request, response) => {
    response.render("crearCuenta", {
        nombrePagina : "Crear Cuenta Uptask"
    })
}

exports.formIniciarSesion = (request, response) => {
    const { error } = response.locals.mensajes;
    response.render("iniciarSesion", {
        nombrePagina : "Iniciar Sesion en Uptask",
        error
    })
}

exports.crearCuenta = async (request, response) => {
    // Leer los datos
    const { email, password} = request.body;

    try {
        // Crear el usuario
        await Usuarios.create({
            email,
            password
        });

        // Crear una URL de confirmacion
        const confirmarUrl = `http://${request.headers.host}/confirmar/${email}`;

        // Crear el objeto usuario
        const usuario = {
            email
        }

        // Enviar el email
        await enviarEmail.enviar({
            usuario,
            subject: "Confirma tu cuenta UpTask",
            confirmarUrl,
            archivo: "confirmar-cuenta"
        });

        // Redirigir al usuario
        request.flash("correcto", "Enviamos un correo, confirma tu cuenta.");
        response.redirect("/iniciar-sesion");
    } catch (error) {
        request.flash("error", error.errors.map(error => error.message));
        response.render("crearCuenta", {
            mensajes: request.flash(),
            nombrePagina : "Crear Cuenta Uptask",
            email,
            password
        })
    }
}

exports.formRestablecerPassword = (request, response) => {
    response.render("reestablecer", {
        nombrePagina: "Reestablecer tu contraseña"
    });
}

// Cambiar el estado de una cuenta
exports.confirmarCuenta = async (request, response) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: request.params.correo
        }
    });

    if(!usuario){
        request.flash("error", "No valido");
        response.redirect("crear-cuenta");
    }

    usuario.activo = 1;
    await usuario.save();

    request.flash("correcto", "cuenta activada correctamente");
    response.redirect("/iniciar-sesion");
}