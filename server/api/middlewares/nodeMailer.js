const nodemailer = require('nodemailer');
const config = require('config');

module.exports.signUpEmail = async (email, confirmationCode) => {  // TODO: in async nabashe behtare 

    let transporter = nodemailer.createTransport({

        /* TODO: toye file config baas inaro set koni ... 
            az gmail estefade beshe rahat tare... 
            gamil security ham bayad disable beshe
        */

        service: config.get('app.mail.servise'),
        secure: false,
        auth: {
            user: config.get('app.mail.mail'),
            pass: config.get('app.mail.password')
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    // TODO: in await nabashe behtare ... 
    // TODO: ye route badan baas ezafe beshe ke age mail ersal nashod dobare ersal beshe
    let info = await transporter
        .sendMail({
            from: config.get('app.mail.mail'),
            to: email,
            subject: 'ye onvan !!! ', // TODO: fill this shit
            text: `inama ke matne dg` // TODO: code taeed ro bass befresti
        })
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
        });
};
// TODO: in async nabashe behtare 
module.exports.forgetPasswordEmail = async (email) => { // TODO: nemidoonm masiret che joorie... args ro ok bass koni

    let transporter = nodemailer.createTransport({

        service: config.get('app.mail.servise'),
        secure: false,
        auth: {
            user: config.get('app.mail.mail'),
            pass: config.get('app.mail.password')
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    // TODO: in await nabashe behtare ... 
    // TODO: ye route badan baas ezafe beshe ke age mail ersal nashod dobare ersal beshe
    let info = await transporter
        .sendMail({
            from: config.get('app.mail.mail'),
            to: email,
            subject: 'ye onvan !!! ', // TODO: fill this shit
            text: `inama ke matne dg` // TODO:
        })
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
        });
};