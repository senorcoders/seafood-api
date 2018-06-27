const nodemailer = require('nodemailer');
const config = require("./config/local").mailer;
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: config.host,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: config.auth
});

const fs = require("fs");


//#region para enviar codigo enlace para verificacion de correo.

function getTemplateVerificationCode(id, email, code) {

    return new Promise(function (resolve, reject) {
        let body = `
        <div align="center" class="button-container center " style="padding-right: 10px; padding-left: 10px; padding-top:10px; padding-bottom:10px;">
        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top:10px; padding-bottom:10px;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://138.68.19.227:7000/verification/${id+'/'+code}" style="height:31pt; v-text-anchor:middle; width:150pt;" arcsize="10%" strokecolor="#D61A1A" fillcolor="#D61A1A"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size:16px;"><![endif]-->
        <a href="http://138.68.19.227:7000/verification/${id+'/'+code}" target="_blank" style="display: block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #ffffff; background-color: #D61A1A; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; max-width: 200px; width: 160px;width: auto; border-top: 0px solid transparent; border-right: 0px solid transparent; border-bottom: 0px solid transparent; border-left: 0px solid transparent; padding-top: 5px; padding-right: 20px; padding-bottom: 5px; padding-left: 20px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;mso-border-alt: none">
            <span style="font-size:16px;line-height:32px;"><span style="font-size: 15px; line-height: 30px;" data-mce-style="font-size: 15px;">Confirm Email Address</span></span>
        </a>
        <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
    </div>

                        
                 
            <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
            </div>
        </div>
        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
        </div>
        </div>    <div style="background-color:transparent;">
        <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

            <!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
        <div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;">
            <div style="background-color: transparent; width: 100% !important;">
            <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                
                <div class="">
        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
        <div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
        <div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">If there are any problems with the button, just copy and paste this link in your browser address bar:</span></p><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px; color: rgb(0, 0, 255);">http://138.68.19.227:7000/verification/${id+'/'+code}</span></p></div>	
        </div>
    `;
        fs.readFile("./template_emails/verification_code_part1.html", "utf8", function (err, data) {
            if (err) { return reject(err); }
            fs.readFile("./template_emails/verification_code_part2.html", "utf8", function (err, data2) {
                if (err) { return reject(err); }
                resolve( data+body+data2 );
            });
        });
    });
}

exports.sendCode = async function (id, email, code) {
    try {

        'use strict'
        console.log('sending email to verfication code ' + email);

        let template = await getTemplateVerificationCode(id, email, code);

        nodemailer.createTestAccount((err, account) => {

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Senorcoders" <milton@senorcoders.com>', // sender address
                to: email, // list of receivers
                subject: code + ' Verification Code ✔', // Subject line
                text: '', // plain text body
                html: template, // html body
                /*attachments: [{
                    filename: 'image.png',
                    path: './template_emails/images/logo_team.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]*/
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
        });
    }
    catch (e) {
        console.error(e);
    }
}



//#endregion

exports.registerUser = async function (fullName, email, password, verificationCode) {

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Senorcoders" <milton@senorcoders.com>', // sender address
        to: email, // list of receivers
        subject: 'Request Accepted, you password is: ' + password, // Subject line
        text: '',
        html: '<b>Does not have the apk, enter the website, click </b><a href="https://seafood.senorcoders.com/">here</a>' // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });

}

exports.sendEmailForgotPassword = function (email, code) {
    'use strict'
    console.log('sending reset password, email to ' + email);

    nodemailer.createTestAccount((err, account) => {

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Senorcoders" <milton@senorcoders.com>', // sender address
            to: email, // list of receivers
            subject: ' Change Password', // Subject line
            text: 'Enter the link to change your password', // plain text body
            html: '<b>Code: ' + code + '</b><br><b>Link: </b><a href="https://seafood.senorcoders.com/recovery-password?code=' + code + '">Reset Password</a>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
}

exports.sendDataFormContactToSeller = function(email, data){
    'use strict'
    console.log('sending data contact form to email ' + email);
    
    return new Promise((resolve, reject)=>{

        for(let name of Object.keys(data)){
            if( data[name] === undefined || data[name] === null ){
                throw new Error(`Paramter is Required ${name}`)
            }
        }

        nodemailer.createTestAccount((err) => {

            if(err){ return reject(err) }
            
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Senorcoders" <milton@senorcoders.com>', // sender address
                to: email, // list of receivers
                subject: 'New Message of Contact in Seafood Souq', // Subject line
                text: '', // plain text body
                html: `
                    <h2><b>Name:<b> ${data.name}</h2>
                    <h4><b>Email:<b> ${data.email}</h4> <br>
                    <p><b>Message:</b> ${data.message}</p>
                `
            };
    
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return reject(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                
                resolve();
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
        });

    });
}