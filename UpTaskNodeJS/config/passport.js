const passport = require("passport");
const { Strategy } = require("passport-local");
const LocalStrategy = require("passport-local").Strategy;

// Referencia al Modelo donde vamos a autenticar
const Usuario = require("../models/Usuarios");

//local strategy - Login con credenciales propios (usuario y password)
passport.use(
    new LocalStrategy(
        // Ppr default local strategy espera un usuario y password
        {
            usernameField: "email",
            passwordField: "password"
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuario.findOne({
                    where : { 
                        email: email,
                        activo: 1
                    }
                })
                // El usuario existe pero el password no es correcto
                if(!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: "Password incorrecto"
                    })
                }
                // El email existe y contraseña correcta
                return done(null, usuario);
            } catch (error) {
                // El usuario(correo) no existe 
                return done(null, false, {
                    message: "Esa cuenta no existe"
                })
                
            }
        }
    )
);

// Serializar el usuario
passport.serializeUser((usuario, callback) =>{
    callback(null, usuario);
});

// deserializar el usuario
passport.deserializeUser((usuario, callback) =>{
    callback(null, usuario);
});

module.exports = passport;