const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const util = require("util");
const emailConfig = require("../config/email");


// Generar HTML
const generarHTML = (archivo, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);
}


// async..await is not allowed in global scope, must use a wrapper
exports.enviar = async (opciones) => {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        auth: {
            user: emailConfig.user, // generated ethereal user
            pass: emailConfig.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText.htmlToText(html);

    let info = await transporter.sendMail({
        from: '"UpTask" <no-reply@uptask.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text , 
        html , // html body
    });

}

/*
exports.enviar = async () => {
    main().catch(console.error);
}*/