var nodeMailer = require("nodemailer");
var Email = require('email-templates');

const APP_NAME = sails.config.APP_NAME;
const config = sails.config.mailer;
const sender = config.auth.user;

const transporter = nodeMailer.createTransport({
    host:   config.host,
    port:   465,
    secure: true, // true for 465, false for other ports
    auth:   config.auth,
    tls: {
        rejectUnauthorized: false //for development
    }
});

const email = new Email({
    message: {
        from: sender
    },
    transport: {
        jsonTransport: true
    },
    views: {
        options: {
          extension: 'ejs' // <---- HERE for enable "ejs" engine, if not the app will use "pug" by default
        }
    }
});

module.exports = {
    sendApprovedSellerEmail: ( emailAddress, name ) => {
        email.render( '../email_templates/approved_seller',
                {
                name:       name
            }
        )
        .then( res=> {            
            transporter.sendMail( { 
                from:       sender,
                to:         emailAddress,
                subject:    'Your Next Steps to Sell On Seafood Souq',                    
                html:       res, // html body
                attachments: [{
                    filename: 'logo.png',
                    path: './assets/images/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
            }, ( error, info ) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                return 'Message sent: %s', info.messageId;
                // Preview only available when sending through an Ethereal account
                //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            })
                
        } )
        .catch(
            console.error
        )    
    }
}
