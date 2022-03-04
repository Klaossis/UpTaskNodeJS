const passport = require("passport");
const Usuarios = require("../models/Usuarios");
const Sequelize = require("sequelize");
const Op = Sequelize.Op
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const enviarEmail = require("../handlers/email");


exports.autenticarUsuario = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/iniciar-sesion",
    failureFlash: true,
    badRequestMessage: "Ambos campos son obligatorios"
});

// Funcion para revisar si el usuario esta iniciado o no
exports.usuarioAutenticado = (request, response, next) => {

    // Si el usuario esta autenticado, Adelante
    if(request.isAuthenticated()) {
        return next();
    }

    //Si no esta autenticado, redirigir al formulario
    return response.redirect("/iniciar-sesion");
}

// Funcion para cerrar sesion
exports.cerrarSesion = (request, response) => {
    request.session.destroy(() => {
        response.redirect("/iniciar-sesion");
    });
}


// Genera un token si el usuario es valido, similar a hanumat
exports.enviarToken = async (request, response) => {
    // Verificar que el usuario que nos mando existe
    const {email} = request.body;
    const usuario = await Usuarios.findOne({where : { email }});

    if(!usuario){
        request.flash("error", "No existe esa cuenta");
        response.redirect("/reestablecer");
    }

    // Usuario existe
    usuario.token = crypto.randomBytes(20).toString("hex");

    // Generar expiracion
    usuario.expiracion = Date.now() + 3600000;

    // Gurdarlos en la base de datos
    await usuario.save();

    // url del reset
    const resetUrl = `http://${request.headers.host}/reestablecer/${usuario.token}`;

    // Enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: "Password Reset",
        resetUrl,
        archivo: "reestablecer-password"
    });

    // Terminacion
    request.flash("correcto", "Se envio un mensaje a tu correo.");
    response.redirect("/iniciar-sesion");
}

exports.validarToken = async (request, response) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: request.params.token
        }
    });

    // Si el usuario no existe

    if(!usuario){
        request.flash("error", "No valido");
        response.redirect("/reestablecer");
    }

    // Formulario para reestablecer contraseña
    response.render("resetPassword", {
        nombrePagina: "Reestablecer Password"
    });
}

exports.actualiarPassword = async (request, response) => {

    // Verifica que el token sea valido y la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: request.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    if(!usuario){
        request.flash("error", "No Valido");
        response.redirect("/reestablecer");
    }

    // Hashear el nuevo password
    usuario.password = bcrypt.hashSync(request.body.password, bcrypt.genSaltSync(10) );
    usuario.token = null;
    usuario.expiracion = null;

    // Guardamos el nuevo password
    await usuario.save();

    request.flash("correcto", "Tu Password se ha modificado correctamente");
    response.redirect("/iniciar-sesion");

}
