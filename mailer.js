const nodemailer = require('nodemailer');
const config = require("./config/local").mailer;
const path = require('path'), fs = require("fs");
const IMAGES = path.join(__dirname, '/images'),
    TEMPLATE = path.join(__dirname, "/template_emails");

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: config.host,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: config.auth
});


//#region para enviar codigo enlace para verificacion de correo.

function getTemplateDenialMessage(id, email, message) {

    return new Promise(function (resolve, reject) {
        let body = `
        <div align="center" class="button-container center " style="padding-right: 10px; padding-left: 10px; padding-top:10px; padding-bottom:10px;">
        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top:10px; padding-bottom:10px;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://138.68.19.227:7000/verification/${id + '/' }" style="height:31pt; v-text-anchor:middle; width:150pt;" arcsize="10%" strokecolor="#D61A1A" fillcolor="#D61A1A"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size:16px;"><![endif]-->
        ${message}
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
        <div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">If there are any problems with the button, just copy and paste this link in your browser address bar:</span></p><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px; color: rgb(0, 0, 255);">https://seafood.senorcoders.com/verification/${id + '/' }</span></p></div>	
        </div>
    `;
        fs.readFile("./template_emails/verification_code_part1.html", "utf8", function (err, data) {
            if (err) { return reject(err); }
            fs.readFile("./template_emails/verification_code_part2.html", "utf8", function (err, data2) {
                if (err) { return reject(err); }
                resolve(data + body + data2);
            });
        });
    });
}

function getTemplateVerificationCode(name) {

    return new Promise(function (resolve, reject) {
        let body=`
        <div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><span style="line-height: 26px; font-size: 22px;">Hey ${name},</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div>`;
        fs.readFile("./template_emails/verification_code_part1.html", "utf8", function (err, data) {
            if (err) { return reject(err); }
            fs.readFile("./template_emails/verification_code_part2.html", "utf8", function (err, data2) {
                if (err) { return reject(err); }
                resolve(data + body + data2);
            });
        });
    });
}
function getTemplateSellerEmail(name) {

    return new Promise(function (resolve, reject) {
        let body=`
        <div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><span style="line-height: 26px; font-size: 22px;">Hey ${name},</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div>`;
        fs.readFile("./template_emails/approved_seller_header.html", "utf8", function (err, data) {
            if (err) { return reject(err); }
            fs.readFile("./template_emails/approved_seller_footer.html", "utf8", function (err, data2) {
                if (err) { return reject(err); }
                resolve(data + body + data2);
            });
        });
    });
}
exports.sendSellerEmail = async function (email,name) {
    try {
        let template = await getTemplateSellerEmail(name);

        nodemailer.createTestAccount((err, account) => {

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Senorcoders" <milton@senorcoders.com>', // sender address
                to: email, // list of receivers
                subject: `Your Next Steps to Sell On Seafood Souq`, // Subject line
                text: '', // plain text body
                html: template, // html body
                attachments: [{
                    filename: 'logo.png',
                    path: './template_emails/images/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
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
//set the first part of email where include the name and role
function getTemplateregistrationRejection(role,name,message) {

    return new Promise(function (resolve, reject) {
        let roleType;
        if(role==0){
            roleType="Admin"
        }else if(role==1){
            roleType="Seller"
        }else{roleType="Buyer"}
        let body=`
        <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><span style="line-height: 26px; font-size: 22px;">Hey ${name},</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div><div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">We appreciate your interest in Seafood Souq! We regret to inform you that your SFS account has not been approved at the moment. There are multiple reasons for not approving ${roleType} accounts:</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">${message}</span></p>`;        
        fs.readFile("./template_emails/registration_rejection_part1.html", "utf8", function (err, data) {
            if (err) { return reject(err); }
            fs.readFile("./template_emails/registration_rejection_part2.html", "utf8", function (err, data2) {
                if (err) { return reject(err); }
                resolve(data + body + data2);
            });
        });
    });
}
//send email when admin reject an account
exports.registrationRejection=async function(email,role,name, message){
    try{
    let template=await getTemplateregistrationRejection(role,name,message);
    nodemailer.createTestAccount((err, account) => {

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Senorcoders" <milton@senorcoders.com>', // sender address
                to: email, // list of receivers
                subject: `Update - Seafood Souq Account`, // Subject line
                text: '', // plain text body
                html: template, // html body
                attachments: [{
                    filename: 'logo.png',
                    path: './template_emails/images/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
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
exports.sendCode = async function (id, email, code,name) {
    try {

        'use strict'
        console.log('sending email to verfication code ' + email);

        let template = await getTemplateVerificationCode(name);

        nodemailer.createTestAccount((err, account) => {

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Senorcoders" <milton@senorcoders.com>', // sender address
                to: email, // list of receivers
                subject: `Welcome Onboard, Getting Started with Seafood Souq !`, // Subject line
                text: '', // plain text body
                html: template, // html body
                attachments: [{
                    filename: 'logo.png',
                    path: './template_emails/images/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
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

exports.sendDenialMessage = async function (id, email, message) {
    try {

        'use strict'
        console.log('sending email for denial message ' + email);

        let template = await getTemplateDenialMessage(id, email, message);

        nodemailer.createTestAccount((err, account) => {

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Senorcoders" <milton@senorcoders.com>', // sender address
                to: 'milton@senorcoders.com',//email, // list of receivers
                subject: `Registration Denied - Seafood Souq`, // Subject line
                text: '', // plain text body
                html: template, // html body
                attachments: [{
                    filename: 'logo.png',
                    path: './template_emails/images/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
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
function getTemplateUserRevision(id, code,name) {

    return new Promise(function (resolve, reject) {
        let header=`<div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><spanstyle="line-height: 26px; font-size: 22px;">Hey ${name},</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div>`;
        let body = `
        <div align="center" class="button-container center " style="padding-right: 10px; padding-left: 10px; padding-top:10px; padding-bottom:10px;">
        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top:10px; padding-bottom:10px;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://138.68.19.227:7000/verification/${id + '/' + code}" style="height:31pt; v-text-anchor:middle; width:150pt;" arcsize="10%" strokecolor="#D61A1A" fillcolor="#D61A1A"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size:16px;"><![endif]-->
        <a href="https://seafood.senorcoders.com/verification/${id + '/' + code}" target="_blank" style="display: block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #ffffff; background-color: #D61A1A; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; max-width: 200px; width: 160px;width: auto; border-top: 0px solid transparent; border-right: 0px solid transparent; border-bottom: 0px solid transparent; border-left: 0px solid transparent; padding-top: 5px; padding-right: 20px; padding-bottom: 5px; padding-left: 20px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;mso-border-alt: none">
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
        <div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;color:black">If there are any problems with the button, just copy and paste this link in your browser address bar:</span></p><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px; color: rgb(0, 0, 255);">https://seafood.senorcoders.com/verification/${id + '/' + code}</span></p><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;color:black">For the meanwhile please have a look at our <a href="https://seafood.senorcoders.com/guides" style="font-size: 15px; line-height: 22px; color: rgb(0, 0, 255);">Seafood Souq guide</a> to familiarize yourself with our platform and services.</p></div>    
        </div>
    `;
        fs.readFile("./template_emails/admin_confirmation_part1.html", "utf8", function (err, data) {
            if (err) { return reject(err); }
            fs.readFile("./template_emails/admin_confirmation_part2.html", "utf8", function (err, data2) {
                if (err) { return reject(err); }
                fs.readFile("./template_emails/admin_confirmation_part3.html", "utf8",function(err,data3){
                    if(err){return reject(err)}
                    resolve(data + header + data2 + body + data3);
                })
            });
        });
    });
}
exports.registerUserRevision = function (user) {

    return new Promise(async function (resolve, reject) {
        let name=user.firstName+' '+user.lastName;
        let template = await getTemplateUserRevision(user.id, user.code, name);
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Senorcoders" <milton@senorcoders.com>', // sender address
            to: user.email, // list of receivers
            subject: 'Your Account is Under Review',
            text: '',
            html: template,
            attachments: [{
                filename: 'image.png',
                path: './template_emails/images/logo.png',
                cid: 'unique@kreata.ee' //same cid value as in the html img src
            }]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error)
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            resolve();
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });

    });

}

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

exports.newUserNotification = async function (firstName, lastName, role, email) {
    let roleType;
        if(role==0){
            roleType="Admin"
        }else if(role==1){
            roleType="Seller"
        }else{roleType="Buyer"}
    //Obtenemos el template
    let template = await new Promise((resolve, reject) => {
        let tempt = fs.readFileSync(path.join(TEMPLATE, "verify_new_user1.html"), { encoding: "utf-8" })
        let temp0 = `
        A new ${roleType} has been created and pending review, please Log In into the Admin dashboard to complete the process of reviewing and confirming/rejecting the account. `;
        let temp1 = fs.readFileSync(path.join(TEMPLATE, "verify_new_user2.html"), { encoding: "utf-8" })

        resolve(tempt + temp0 + temp1);
    });

    return new Promise(function (resolve, reject) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Senorcoders" <milton@senorcoders.com>', // sender address
            to: 'brian@senorcoders.com', // "jos.ojiron@gmail.com",
            subject: `New ${roleType} is pending confirmation`, // Subject line
            text: '',
            html: template,
            attachments: [{
                filename: 'image.png',
                path: './template_emails/images/logo.png',
                cid: 'unique@kreata.ee' //same cid value as in the html img src
            }]
        };

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

}

exports.sendEmailForgotPassword = function (email, code) {
    'use strict'
    console.log('sending reset password, email to ' + email);
    let template = fs.readFileSync("./template_emails/change_password.html", { encoding: "utf-8" })
    template = template.replace("$coderesetPassword", code);
    
    nodemailer.createTestAccount((err, account) => {

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Senorcoders" <milton@senorcoders.com>', // sender address
            to: email, // list of receivers
            subject: 'Password Recovery for Seafood Souq', // Subject line
            text: '', // plain text body
            html: template,
            attachments: [{
                filename: 'image.png',
                path: './template_emails/images/logo.png',
                cid: 'unique@kreata.ee' //same cid value as in the html img src
            }]
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

exports.sendDataFormContactToSeller = function (email, data) {
    'use strict'
    console.log('sending data contact form to email ' + email);

    return new Promise((resolve, reject) => {

        for (let name of Object.keys(data)) {
            if (data[name] === undefined || data[name] === null) {
                throw new Error(`Paramter is Required ${name}`)
            }
        }

        nodemailer.createTestAccount((err) => {

            if (err) { return reject(err) }

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

//#region para enviar un correo cuando se haya pagado un carrito de compra

function addItem(item) {
    let itemParser = `
                    <div class="row">
                    <div class="name">${ item.fish.name}</div>
                    <div class="price-unit">${ item.price.type + " " + item.price.value}</div>
                    <div class="quantity">${ item.quantity.type + " - " + item.quantity.value}</div>
                    <div class="subtotal">${ parseFloat(item.quantity.value * item.price.value).toFixed(2)}</div>
                    </div>
                `;

    return itemParser;
}

function calcTotaItem(items) {
    let total = 0;
    for (let it of items) {
        total += it.quantity.value * it.price.value;
    }

    return items[0].price.type + " " + parseFloat(total).toFixed(2);
}

async function getTemplateShopping(items,cart,orderNumber,storeName) {
    let store,storeLng=storeName.length;
    for(let [index,value] of storeName.entries()){
        if(index==0){
            if(storeLng>1){
                store=value+' and ';
            }
            else{
                store=value;
            }
        }else{
            if(index==storeLng-1){
                 store+=value
            }else{
                store+=value+' and '
            }
        }
    }
    let head = fs.readFileSync(path.join(TEMPLATE, "purchase_buyer", "purchase_buyer1.html"), { encoding: "utf-8" })
        , footer = fs.readFileSync(path.join(TEMPLATE, "purchase_buyer", "purchase_buyer2.html"), { encoding: "utf-8" })
        ,salute=`<div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><span style="line-height: 26px; font-size: 22px;">Hey ${cart.buyer.firstName} ${cart.buyer.lastName},</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
        ,introduction=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Thank you for shopping on Seafood Souq !</span></p><p style="margin: 0;font-size: 14px;line-height: 21px;margin-top: 20px;"><span style="font-size: 15px; line-height: 22px;">Your order has been placed and it's now awaiting fulfilment by ${store}.</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Your Order Details:</span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
        ,order=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><div style="font-size: 15px; float: left;width: 40%;">Order #${orderNumber}</div><div style="font-size: 15px; float: left;width: 60%;padding-left: 5px;box-sizing: border-box; text-align: right;">Estimated Delivery: <span style="color:#9aa84f;font-weight: bold;">Thursday, Nov 1, 2018</span></div></div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
        ,tableStart=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;border: 1px solid black;box-sizing: border-box;">`
        ,tableEnd=`</div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>   `
    let itemsTemplate = "";
    for (let [index,it] of items.entries()) {
        let img;
        if(it.fish.imagePrimary && it.fish.imagePrimary!=''){
            img=`<img src="https://apiseafood.senorcoders.com${it.fish.imagePrimary}" alt="" style="width:100%" />`
        }
        else{
            img=''
        }
        itemsTemplate+=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width:100%"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%">${img}</div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%">Shipment 1 of 1 sold by ${storeName[index]}<br /><span style="color:blue;font-weight: bold;">${it.fish.name}</span> <br /> <span style="color:black;font-weight: bold;">QTY - ${it.quantity.value} ${it.quantity.type}</span></div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;position:relative;display:table"><p style="position: absolute;top: 50%;transform: translate(0,-50%)">${it.price.value* it.quantity.value} AED</p></div></div>`
        //itemsTemplate += addItem(it);
    }
    let shipping=cart.shipping,otherTaxes=cart.totalOtherFees+cart.uaeTaxes;
    let subtotal=cart.total+shipping+otherTaxes;
    let taxesHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Shipping Fees</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${shipping} AED</span></div></div><div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Taxes and Customs and other Fees </div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${otherTaxes} AED</span></div></div>`
    let subtotalHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: bold;;font-size: 14px"> Sub Total </div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black; font-weight: bold;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${subtotal}AED</span></div></div>`
    let address=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 15px;line-height: 22px">Your Order will be delivered to: Address: ${cart.buyer.dataExtra.Address},<br> City: ${cart.buyer.dataExtra.City},<br> Country: ${cart.buyer.dataExtra.country},<br> zipCode: ${cart.buyer.dataExtra.zipCode}</p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">To track and manage your orders, please login into SFS Orders page or click on the button below:</span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`;

    return head +salute+introduction+order+tableStart+ itemsTemplate +taxesHtml+ subtotalHtml+ tableEnd +address + footer;
}

exports.sendCartPaidBuyer = async function (items,cart,orderNumber,storeName) {
let template = await getTemplateShopping(items,cart,orderNumber,storeName);
    //console.log(cart);
    return new Promise(function (resolve, reject) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Senorcoders" <milton@senorcoders.com>', // sender address
            to: cart.buyer.email, // list of receivers
            subject: `Order #${orderNumber} is Placed`, // Subject line
            text: '',
            html: template,
            attachments: [{
                filename: 'image.png',
                path: './template_emails/images/logo.png',
                cid: 'unique@kreata.ee' //same cid value as in the html img src
            }]
        };

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
}
async function getTemplateShoppingSeller(sellerName,cart,items,orderNumber) {
    let head = fs.readFileSync(path.join(TEMPLATE, "purchase_buyer", "purchase_buyer1.html"), { encoding: "utf-8" })
        , footer = fs.readFileSync(path.join(TEMPLATE, "purchase_buyer", "purchase_buyer_seller_notified.html"), { encoding: "utf-8" })
        ,salute=`<div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><span style="line-height: 26px; font-size: 22px;">Hey ${sellerName},</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
        ,introduction=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">You have received an order containing the following items/products, and is awaiting confirmation and fulfilment from your side.</span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
        ,order=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:right;"><div style="font-size: 15px;">Order #<b>${orderNumber} </b></div></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div> `
        ,tableStart=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;border: 1px solid black;box-sizing: border-box;">`
        ,tableEnd=`</div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>   `
    let itemsTemplate = "";
    let price=0, shippingRate=0;
    for (let [index,it] of items.entries()) {
        let img;
        if(it.fish.imagePrimary && it.fish.imagePrimary!=''){
            img=`<img src="https://apiseafood.senorcoders.com${it.fish.imagePrimary}" alt="" style="width:100%" />`
        }
        else{
            img=''
        }
        itemsTemplate+=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width:100%"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%">${img}</div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%;color:black">Shipment 1 of 1 sold by ${it.fish.store.name}<br /><span style="color:blue;font-weight: bold;">${it.fish.name}</span> <br />SKU: ${it.fish.seafood_sku}<br /><span style="color:black;font-weight: bold;">QTY - ${it.quantity.value} ${it.quantity.type}</span></div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;position:relative;display:table"><p style="position: absolute;top: 50%;transform: translate(0,-50%)">${it.price.value* it.quantity.value} AED</p></div></div>`
        let subtotal=it.price.value* it.quantity.value;
        price+=subtotal;
        shippingRate+=it.shipping
    }
    let shipping=shippingRate;
    let subtotal=price+shipping;
    let taxesHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;color:black">Shipping Fees</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${shipping} AED</span></div></div>`
    let subtotalHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: bold;;font-size: 14px"> Sub Total </div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black; font-weight: bold;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${subtotal}AED</span></div></div>`
    let delivery=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">The expected delivery date for this order is <span style="color:#9aa84f;font-weight: bold;">Thursday, 1st November 2018.</span></span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">The Order will be delivered to:</span></p><p style="margin-top: 20px;font-size: 15px; line-height: 22px;">Address: ${cart.buyer.dataExtra.Address},<br> City: ${cart.buyer.dataExtra.City},<br> Country: ${cart.buyer.dataExtra.country},<br> zipCode: ${cart.buyer.dataExtra.zipCode}</p>`
    return head+salute+introduction+order+tableStart+itemsTemplate+taxesHtml+subtotalHtml+tableEnd+delivery+ footer;
}
exports.sendCartPaidSellerNotified = async function (sellerName,cart,items,orderNumber,email) {
let template = await getTemplateShoppingSeller(sellerName,cart,items,orderNumber);
    return new Promise(function (resolve, reject) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Senorcoders" <milton@senorcoders.com>', // sender address
            to: email, // list of receivers
            subject: `Order #${orderNumber} is Placed`, // Subject line
            text: '',
            html: template,
            attachments: [{
                filename: 'image.png',
                path: './template_emails/images/logo.png',
                cid: 'unique@kreata.ee' //same cid value as in the html img src
            }]
        };

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
}
async function getTemplateShoppingAdmin(items,cart,orderNumber,storeName) {
    let store,storeLng=storeName.length;
    for(let [index,value] of storeName.entries()){
        if(index==0){
            if(storeLng>1){
                store=value+' and ';
            }
            else{
                store=value;
            }
        }else{
            if(index==storeLng-1){
                 store+=value
            }else{
                store+=value+' and '
            }
        }
    }
    let head = fs.readFileSync(path.join(TEMPLATE, "purchase_buyer", "purchase_buyer_admin_notified_header.html"), { encoding: "utf-8" })
        ,introduction=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">An order has been placed by ${cart.buyer.firstName} ${cart.buyer.lastName} and is to be fulfilled by ${store}.</span></p><p style="margin: 0;font-size: 14px;line-height: 21px;margin-top: 20px;"><span style="font-size: 15px; line-height: 22px;">All the Invoices and Receipts issued for this order are attached to this email.</span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
        ,order=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><div style="font-size: 15px; float: left;width: 40%;">Order #${orderNumber}</div><div style="font-size: 15px; float: left;width: 60%;padding-left: 5px;box-sizing: border-box; text-align: right;">Estimated Delivery: <span style="color:#9aa84f;font-weight: bold;">Thursday, Nov 1, 2018</span></div></div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
        ,tableStart=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;border: 1px solid black;box-sizing: border-box;">`
        ,tableEnd=`</div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>   `
    let itemsTemplate = "";
    for (let [index,it] of items.entries()) {
        let img;
        if(it.fish.imagePrimary && it.fish.imagePrimary!=''){
            img=`<img src="https://apiseafood.senorcoders.com${it.fish.imagePrimary}" alt="" style="width:100%" />`
        }
        else{
            img=''
        }
        itemsTemplate+=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width:100%"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%">${img}</div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%;color:black">Shipment 1 of 1 sold by ${storeName[index]}<br /><span style="color:blue;font-weight: bold;">${it.fish.name}</span> <br /> <span style="color:black;font-weight: bold;">QTY - ${it.quantity.value} ${it.quantity.type}</span></div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;position:relative;display:table"><p style="position: absolute;top: 50%;transform: translate(0,-50%)">${it.price.value* it.quantity.value} AED</p></div></div>`
        //itemsTemplate += addItem(it);
    }
    let shipping=cart.shipping,otherTaxes=cart.totalOtherFees+cart.uaeTaxes;
    let subtotal=cart.total+shipping+otherTaxes;
    let taxesHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Shipping Fees</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${shipping} AED</span></div></div><div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;color:black">Taxes and Customs and other Fees </div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${otherTaxes} AED</span></div></div>`
    let subtotalHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: bold;;font-size: 14px"> Sub Total Paid </div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black; font-weight: bold;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${subtotal}AED</span></div></div>`
    let address=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 15px;line-height: 22px">The Order will be delivered to:<br> Address: ${cart.buyer.dataExtra.Address},<br> City: ${cart.buyer.dataExtra.City},<br> Country: ${cart.buyer.dataExtra.country},<br> zipCode: ${cart.buyer.dataExtra.zipCode}</p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`;
    let footer=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->&#160;<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div><!--[if (mso)|(IE)]></td></tr></table><![endif]--></td></tr></tbody></table><!--[if (mso)|(IE)]></div><![endif]--></body></html>`
    return head +introduction+order+tableStart+ itemsTemplate +taxesHtml+ subtotalHtml+ tableEnd +address + footer;
}

exports.sendCartPaidAdmin = async function (items,cart,orderNumber,storeName) {
let template = await getTemplateShoppingAdmin(items,cart,orderNumber,storeName);
    //console.log(cart);
    return new Promise(function (resolve, reject) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Senorcoders" <milton@senorcoders.com>', // sender address
            to: "bryandanglas05@gmail.com", // list of receivers
            subject: `Order #${orderNumber} is Placed`, // Subject line
            text: '',
            html: template,
            attachments: [{
                filename: 'image.png',
                path: './template_emails/images/logo.png',
                cid: 'unique@kreata.ee' //same cid value as in the html img src
            }]
        };

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
}
exports.sendCartSeller = async function (fullName, fullNameBuyer, emailBuyer, items, email) {
    let msgTitle = `Hey! ${fullName}`,
        msgBeforeItems = "You have sales made for " + fullNameBuyer + ", " + emailBuyer,
        msgAfterItems = "The total of its products sold is";

    let template = await getTemplateShopping(msgTitle, msgBeforeItems, msgAfterItems, items);
    console.log("seller:: ", email);
    return new Promise(function (resolve, reject) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Senorcoders" <milton@senorcoders.com>', // sender address
            to: email, // list of receivers
            subject: 'Shopping at Seafood Souq', // Subject line
            text: '',
            html: template
        };

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
}

//#endregion

//#region para enviar correo cuando un pescado esta de camino
async function getTemplateItemShopping(name,cart,store,item) {
//     let producto = `
//     <div style="color:#555555;line-height:120%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
//     <div style="font-size:12px;line-height:14px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px">${item.fish.name}</p></div>	
// </div>
// <!--[if mso]></td></tr></table><![endif]-->
// </div>
              
//           <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
//           </div>
//         </div>
//           <!--[if (mso)|(IE)]></td><td align="center" width="333" style=" width:333px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
//         <div class="col num8" style="display: table-cell;vertical-align: top;min-width: 320px;max-width: 328px;">
//           <div style="background-color: transparent; width: 100% !important;">
//           <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

              
//                 <div class="">
// <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
// <div style="color:#555555;line-height:120%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
//     <div style="font-size:12px;line-height:14px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px">${item.quantity.type + " - " + item.quantity.value}</p></div>	
// </div>
//     `;
    return new Promise(async function (resolve, reject) {
        let paidDateTime=await formatDates(cart.paidDateTime);
        let header=`<div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><span style="line-height: 26px; font-size: 22px;">Hey ${name},</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
        let body=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Thank you for shopping on Seafood Souq !</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Your order placed on ${paidDateTime} has been fulfilled by the Seller ${store.owner.firstName} ${store.owner.lastName} and it's now being shipped to Dubai.</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Your Order Details:</span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div><div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><div style="font-size: 15px; float: left;width: 40%;">Order # ${cart.orderNumber}</div><div style="font-size: 15px; float: left;width: 60%;padding-left: 5px;box-sizing: border-box; text-align: right;">Estimated Delivery: <span style="color:#9aa84f;font-weight: bold;">Thursday, Nov 1, 2018</span></div></div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`;
        let tableStart=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;border: 1px solid black;box-sizing: border-box;">`
            ,tableEnd=`</div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>   `
        let itemsTemplate = "";
        let img;
        if(item.fish.imagePrimary && item.fish.imagePrimary!=''){
            img=`<img src="https://apiseafood.senorcoders.com${item.fish.imagePrimary}" alt="" style="width:100%" />`
        }
        else{
            img=''
        }
        itemsTemplate=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width:100%"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%">${img}</div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%">Shipment 1 of 1 sold by ${store.name}<br /><span style="color:blue;font-weight: bold;">${item.fish.name}</span> <br /> <span style="color:black;font-weight: bold;">QTY - ${item.quantity.value} ${item.quantity.type}</span></div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;position:relative;display:table"><p style="position: absolute;top: 50%;transform: translate(0,-50%)">${item.price.value* item.quantity.value} AED</p></div></div>`
        let shipping=item.shipping,otherTaxes=item.sfsMargin+item.customs+item.uaeTaxes;
        let subtotal=shipping+otherTaxes+(item.price.value*item.quantity.value);
        let taxesHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Shipping Fees</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${shipping} AED</span></div></div><div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Taxes and Customs and other Fees </div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${otherTaxes} AED</span></div></div>`
        let subtotalHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: bold;;font-size: 14px"> Sub Total </div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black; font-weight: bold;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${subtotal}AED</span></div></div>`
        let prefooter=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Your Order will be delivered to: <br>Address: ${cart.buyer.dataExtra.Address},<br> City: ${cart.buyer.dataExtra.City},<br> Country: ${cart.buyer.dataExtra.country},<br> zipCode: ${cart.buyer.dataExtra.zipCode}</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">To track and manage your orders, please login into SFS Orders page or click on the button below:</span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
        fs.readFile("./template_emails/order_shipped_header.html", "utf8", function (err, data) {
                if (err) { return reject(err); }
                fs.readFile("./template_emails/order_shipped_footer.html", "utf8", function (err, data2) {
                    if (err) { return reject(err); }
                    resolve(data + header + body +tableStart+itemsTemplate+taxesHtml+subtotalHtml +tableEnd+prefooter+ data2);
                });
            });
    })
}
async function formatDates(d){
    let date=new Date(d)
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // get time am or pm
    let hours=date.getHours()
    let min = date.getMinutes();
    let dates=months[date.getMonth()]+'/'+ date.getDate()+ '/'+date.getFullYear()+'/'+hours+':'+ min;
    return dates
}
async function getTemplateOrderCancel(name,cart,store,item){
    let paidDateTime=await formatDates(cart.paidDateTime);
    return new Promise(function (resolve, reject) {
    let header=`<div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><span style="line-height: 26px; font-size: 22px;">Hey ${name},</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
    let body=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Your order placed on ${paidDateTime} has been Cancelled upon your request and ${store.name} are notified with the cancellation. <b>Your refund reference number is < Refund Number>.</b></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div><div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><div style="font-size: 15px; float: left;width: 40%;">Order # ${cart.orderNumber}</div><div style="font-size: 15px; float: left;width: 60%;padding-left: 5px;box-sizing: border-box; text-align: right;"><span style="color:red;">Cancelled Order</span></div></div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`;
    let tableStart=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;border: 1px solid black;box-sizing: border-box;">`
        ,tableEnd=`</div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>   `
    let itemsTemplate = "";
    let img;
    if(item.fish.imagePrimary && item.fish.imagePrimary!=''){
        img=`<img src="https://apiseafood.senorcoders.com${item.fish.imagePrimary}" alt="" style="width:100%" />`
    }
    else{
        img=''
    }
    itemsTemplate=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width:100%"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%">${img}</div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%">Shipment 1 of 1 sold by ${store.name}<br /><span style="color:blue;font-weight: bold;">${item.fish.name}</span> <br /> <span style="color:black;font-weight: bold;">QTY - ${item.quantity.value} ${item.quantity.type}</span></div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;position:relative;display:table"><p style="position: absolute;top: 50%;transform: translate(0,-50%)">${item.price.value* item.quantity.value} AED</p></div></div>`
    let shipping=item.shipping,otherTaxes=item.sfsMargin+item.customs+item.uaeTaxes;
    let subtotal=shipping+otherTaxes+(item.price.value*item.quantity.value);
    let taxesHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Shipping Fees</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${shipping} AED</span></div></div><div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Taxes and Customs and other Fees </div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${otherTaxes} AED</span></div></div>`
    let subtotalHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: bold;;font-size: 14px"> Sub Total Paid</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black; font-weight: bold;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${subtotal}AED</span></div></div>`
   
    fs.readFile("./template_emails/order_cancel/order-cancelled-by-buyer-part1.html", "utf8", function (err, data) {
            if (err) { return reject(err); }
            fs.readFile("./template_emails/order_cancel/order-cancelled-by-buyer-part2.html", "utf8", function (err, data2) {
                if (err) { return reject(err); }
                resolve(data + header + body +tableStart+itemsTemplate+taxesHtml+subtotalHtml +tableEnd+ data2);
            });
        });
    })
}
exports.sendEmailOrderStatus=async function(name,cart,store,item){
        try{
    let template = await getTemplateOrderCancel(name,cart,store,item);
    nodemailer.createTestAccount((err, account) => {

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Senorcoders" <milton@senorcoders.com>', // sender address
                to: cart.buyer.email, // list of receivers
                subject: `Order #${cart.orderNumber} is Cancelled`, // Subject line
                text: '', // plain text body
                html: template, // html body
                attachments: [{
                    filename: 'logo.png',
                    path: './template_emails/images/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
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
async function getTemplateOrderArrived(name,cart,store,item){
    let paidDateTime=await formatDates(cart.paidDateTime);
    return new Promise(function (resolve, reject) {
    let header=`<div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><span style="line-height: 26px; font-size: 22px;">Hey ${name},</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
    let body=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Thank you for shopping on Seafood Souq !</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Your order placed on ${paidDateTime}  has arrived in Dubai and is awaiting delivery.</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Your Order Details:</span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div><div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><div style="font-size: 15px; float: left;width: 40%;">Order # ${cart.orderNumber}</div><div style="font-size: 15px; float: left;width: 60%;padding-left: 5px;box-sizing: border-box; text-align: right;"><span style="color:red;"><span style="color:#9aa84f;font-weight: bold;">Estimated Delivery: Thursday, Nov 1, 2018</span></span></div></div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`;
    let tableStart=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;border: 1px solid black;box-sizing: border-box;">`
        ,tableEnd=`</div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>   `
    let itemsTemplate = "";
    let img;
    if(item.fish.imagePrimary && item.fish.imagePrimary!=''){
        img=`<img src="https://apiseafood.senorcoders.com${item.fish.imagePrimary}" alt="" style="width:100%" />`
    }
    else{
        img=''
    }
    itemsTemplate=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width:100%"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%">${img}</div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%">Shipment 1 of 1 sold by ${store.name}<br /><span style="color:blue;font-weight: bold;">${item.fish.name}</span> <br /> <span style="color:black;font-weight: bold;">QTY - ${item.quantity.value} ${item.quantity.type}</span></div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;position:relative;display:table"><p style="position: absolute;top: 50%;transform: translate(0,-50%)">${item.price.value* item.quantity.value} AED</p></div></div>`
    let shipping=item.shipping,otherTaxes=item.sfsMargin+item.customs+item.uaeTaxes;
    let subtotal=shipping+otherTaxes+(item.price.value*item.quantity.value);
    let taxesHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Shipping Fees</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${shipping} AED</span></div></div><div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Taxes and Customs and other Fees </div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${otherTaxes} AED</span></div></div>`
    let subtotalHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: bold;;font-size: 14px"> Sub Total</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black; font-weight: bold;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${subtotal}AED</span></div></div>`
    let prefooter=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Shipping address: <br>Address: ${cart.buyer.dataExtra.Address},<br> City: ${cart.buyer.dataExtra.City},<br> Country: ${cart.buyer.dataExtra.country},<br> zipCode: ${cart.buyer.dataExtra.zipCode}</span></p>`
    fs.readFile("./template_emails/order_arrived/header.html", "utf8", function (err, data) {
            if (err) { return reject(err); }
            fs.readFile("./template_emails/order_arrived/footer.html", "utf8", function (err, data2) {
                if (err) { return reject(err); }
                resolve(data + header + body +tableStart+itemsTemplate+taxesHtml+subtotalHtml +tableEnd+prefooter+ data2);
            });
        });
    })
}
exports.sendEmailOrderArrived=async function(name,cart,store,item){
        try{
    let template = await getTemplateOrderArrived(name,cart,store,item);
    nodemailer.createTestAccount((err, account) => {

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Senorcoders" <milton@senorcoders.com>', // sender address
                to: cart.buyer.email, // list of receivers
                subject: `Order #${cart.orderNumber} has arrived in Dubai !`, // Subject line
                text: '', // plain text body
                html: template, // html body
                attachments: [{
                    filename: 'logo.png',
                    path: './template_emails/images/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
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
async function getTemplateOrderDelivered(name,cart,store,item){
    let paidDateTime=await formatDates(cart.paidDateTime);
    return new Promise(function (resolve, reject) {
    let header=`<div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><span style="line-height: 26px; font-size: 22px;">Hey ${name},</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
    let body=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Thank you for using Seafood Souq, we hope that you had a pleasant experience using our platform and services. We would really appreciate your feedback on the overall experience and we invite you to undertake the <a href="#" style="text-decoration: underline;color: blue">customer satisfaction survey.</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">As the order has been delivered, please find the order details and receipt attached to this email.</span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div><div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><div style="font-size: 15px; float: left;width: 40%;">Order # ${cart.orderNumber}</div><div style="font-size: 15px; float: left;width: 60%;padding-left: 5px;box-sizing: border-box; text-align: right;"><span style="color:red;"><span style="color:#9aa84f;font-weight: bold;">Delivered On: Thursday, Nov 1, 2018</span></span></div></div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`;
    let tableStart=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;border: 1px solid black;box-sizing: border-box;">`
        ,tableEnd=`</div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>   `
    let itemsTemplate = "";
    let img;
    if(item.fish.imagePrimary && item.fish.imagePrimary!=''){
        img=`<img src="https://apiseafood.senorcoders.com${item.fish.imagePrimary}" alt="" style="width:100%" />`
    }
    else{
        img=''
    }
    itemsTemplate=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width:100%"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%">${img}</div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%">Shipment 1 of 1 sold by ${store.name}<br /><span style="color:blue;font-weight: bold;">${item.fish.name}</span> <br /> <span style="color:black;font-weight: bold;">QTY - ${item.quantity.value} ${item.quantity.type}</span></div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;position:relative;display:table"><p style="position: absolute;top: 50%;transform: translate(0,-50%)">${item.price.value* item.quantity.value} AED</p></div></div>`
    let shipping=item.shipping,otherTaxes=item.sfsMargin+item.customs+item.uaeTaxes;
    let subtotal=shipping+otherTaxes+(item.price.value*item.quantity.value);
    let taxesHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Shipping Fees</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${shipping} AED</span></div></div><div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Taxes and Customs and other Fees </div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${otherTaxes} AED</span></div></div>`
    let subtotalHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: bold;;font-size: 14px"> Sub Total</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black; font-weight: bold;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${subtotal}AED</span></div></div>`
    let prefooter=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Shipping address: <br>Address: ${cart.buyer.dataExtra.Address},<br> City: ${cart.buyer.dataExtra.City},<br> Country: ${cart.buyer.dataExtra.country},<br> zipCode: ${cart.buyer.dataExtra.zipCode}</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">To view your historical orders, please log in into your account or click on the button below:</span></p>`
    fs.readFile("./template_emails/order_shipped_header.html", "utf8", function (err, data) {
            if (err) { return reject(err); }
            fs.readFile("./template_emails/order_shipped_footer.html", "utf8", function (err, data2) {
                if (err) { return reject(err); }
                resolve(data + header + body +tableStart+itemsTemplate+taxesHtml+subtotalHtml +tableEnd+prefooter+ data2);
            });
        });
    })
}
exports.sendEmailOrderDelivered=async function(name,cart,store,item){
        try{
    let template = await getTemplateOrderDelivered(name,cart,store,item);
    nodemailer.createTestAccount((err, account) => {

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Senorcoders" <milton@senorcoders.com>', // sender address
                to: cart.buyer.email, // list of receivers
                subject: `Order #${cart.orderNumber} is Delivered !`, // Subject line
                text: '', // plain text body
                html: template, // html body
                attachments: [{
                    filename: 'logo.png',
                    path: './template_emails/images/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
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
async function getTemplateOrderDeliveredSeller(cart,store,item){
    let paidDateTime=await formatDates(cart.paidDateTime);
    return new Promise(function (resolve, reject) {
    let header=`<div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><span style="line-height: 26px; font-size: 22px;">Hey ${store.owner.firstName} ${store.owner.lastName},</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
    let body=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Thank you for fulfilling the order below ${cart.orderNumber}. The order is now delivered and the payment is being processed into your account. It usually takes 5-7 working days to get your funds in your bank account</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Payment Case Number: < Payment Case #></span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">As the order has been delivered, please find the order details and the invoice attached to this email.</span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div><div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><div style="font-size: 15px; float: left;width: 40%;">Order # ${cart.orderNumber}</div><div style="font-size: 15px; float: left;width: 60%;padding-left: 5px;box-sizing: border-box; text-align: right;"><span style="color:red;"><span style="color:#9aa84f;font-weight: bold;">Delivered On: Thursday, Nov 1, 2018</span></span></div></div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`;
    let tableStart=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;border: 1px solid black;box-sizing: border-box;">`
        ,tableEnd=`</div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>   `
    let itemsTemplate = "";
    let img;
    if(item.fish.imagePrimary && item.fish.imagePrimary!=''){
        img=`<img src="https://apiseafood.senorcoders.com${item.fish.imagePrimary}" alt="" style="width:100%" />`
    }
    else{
        img=''
    }
    itemsTemplate=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width:100%"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%">${img}</div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%">Shipment 1 of 1 sold by ${store.name}<br /><span style="color:blue;font-weight: bold;">${item.fish.name}</span> <br />SKU: ${item.fish.seafood_sku}<br/> <span style="color:black;font-weight: bold;">QTY - ${item.quantity.value} ${item.quantity.type}</span></div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;position:relative;display:table"><p style="position: absolute;top: 50%;transform: translate(0,-50%)">${item.price.value* item.quantity.value} AED</p></div></div>`
    let shipping=item.shipping;
    let subtotal=item.price.value*item.quantity.value+shipping;
    let taxesHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Shipping Fees</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${shipping} AED</span></div></div>`;
    let subtotalHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: bold;;font-size: 14px"> Sub Total Paid</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black; font-weight: bold;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${subtotal}AED</span></div></div>`;
    let prefooter=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Shipping Address: <br>Address: ${cart.buyer.dataExtra.Address},<br> City: ${cart.buyer.dataExtra.City},<br> Country: ${cart.buyer.dataExtra.country},<br> zipCode: ${cart.buyer.dataExtra.zipCode}</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">To view and manage your orders, please log in into your account or click on the button below:</span></p>`
    fs.readFile("./template_emails/order_shipped_header.html", "utf8", function (err, data) {
            if (err) { return reject(err); }
            fs.readFile("./template_emails/order_delivered_footer.html", "utf8", function (err, data2) {
                if (err) { return reject(err); }
                resolve(data + header + body +tableStart+itemsTemplate+taxesHtml+subtotalHtml +tableEnd+prefooter+ data2);
            });
        });
    })
}
exports.sendEmailOrderDeliveredSeller=async function(cart,store,item){
        try{
    let template = await getTemplateOrderDeliveredSeller(cart,store,item);
    nodemailer.createTestAccount((err, account) => {

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Senorcoders" <milton@senorcoders.com>', // sender address
                to: store.owner.email, // list of receivers
                subject: `Order #${cart.orderNumber} is Delivered !`, // Subject line
                text: '', // plain text body
                html: template, // html body
                attachments: [{
                    filename: 'logo.png',
                    path: './template_emails/images/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
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
async function getTemplateOrderCancelSeller(name,cart,store,item){
    let paidDateTime=await formatDates(cart.paidDateTime);
    return new Promise(async function (resolve, reject) {
        let header=`<div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><span style="line-height: 26px; font-size: 22px;">Hey ${store.owner.firstName} ${store.owner.lastName},</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
        let body=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">We apologise for any inconvenience caused, the Order #${cart.orderNumber} placed on ${paidDateTime} has been cancelled by the ${cart.buyer.firstName} ${cart.buyer.lastName}.</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">As the status of the order was “Pending Confirmation by the Seller” when it was cancelled, you are no longer required to take any action regarding this order ${cart.orderNumber}</span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div><div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><div style="font-size: 15px; float: left;width: 40%;">Order # ${cart.orderNumber}</div><div style="font-size: 15px; float: left;width: 60%;padding-left: 5px;box-sizing: border-box; text-align: right;"><span style="color:red;">Cancelled Order</span></div></div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`;
        let tableStart=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;border: 1px solid black;box-sizing: border-box;">`
        ,tableEnd=`</div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>   `
        let itemsTemplate = "";
        let img;
        if(item.fish.imagePrimary && item.fish.imagePrimary!=''){
            img=`<img src="https://apiseafood.senorcoders.com${item.fish.imagePrimary}" alt="" style="width:100%" />`
        }
        else{
            img=''
        }
        itemsTemplate=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width:100%"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%">${img}</div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%">Shipment 1 of 1 sold by ${store.name}<br /><span style="color:blue;font-weight: bold;">${item.fish.name}</span> <br />SKU: ${item.fish.seafood_sku}<br/> <span style="color:black;font-weight: bold;">QTY - ${item.quantity.value} ${item.quantity.type}</span></div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;position:relative;display:table"><p style="position: absolute;top: 50%;transform: translate(0,-50%)">${item.price.value* item.quantity.value} AED</p></div></div>`
        let shipping=item.shipping;
        let subtotal=item.price.value*item.quantity.value+shipping;
        let taxesHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Shipping Fees</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${shipping} AED</span></div></div>`;
        let subtotalHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: bold;;font-size: 14px"> Sub Total Paid</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black; font-weight: bold;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${subtotal}AED</span></div></div>`;
        fs.readFile("./template_emails/order_cancel/order-cancelled-by-buyer-part1.html", "utf8", function (err, data) {
                if (err) { return reject(err); }
                fs.readFile("./template_emails/order_cancel/order-cancelled-by-buyer-seller-notified.html", "utf8", function (err, data2) {
                    if (err) { return reject(err); }
                    resolve(data + header + body + tableStart+ itemsTemplate+taxesHtml+subtotalHtml+tableEnd+ data2);
                });
            });
    })
}
exports.sendEmailOrderStatusSeller=async function(name,cart,store,item){
        try{
    let template = await getTemplateOrderCancelSeller(name,cart,store,item);
    nodemailer.createTestAccount((err, account) => {

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Senorcoders" <milton@senorcoders.com>', // sender address
                to: store.owner.email, // list of receivers
                subject: `Order #${cart.orderNumber} is Cancelled`, // Subject line
                text: '', // plain text body
                html: template, // html body
                attachments: [{
                    filename: 'logo.png',
                    path: './template_emails/images/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
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
async function getTemplateOrderCancelAdmin(name,cart,store,item){
    let paidDateTime=await formatDates(cart.paidDateTime);
    return new Promise(function (resolve, reject) {
        let header=`<div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><span style="line-height: 26px; font-size: 22px;">Hey Admin,</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
        let body=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">The Order #${cart.orderNumber} has been cancelled by the buyer ${cart.buyer.firstName} ${cart.buyer.lastName}. ${store.owner.firstName} ${store.owner.lastName} has been notified with cancellation and a refund case for the buyer has been issued.</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Refund Case number #< refund case number></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div><div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><div style="font-size: 15px; float: left;width: 40%;">Order # ${cart.orderNumber}</div><div style="font-size: 15px; float: left;width: 60%;padding-left: 5px;box-sizing: border-box; text-align: right;"><span style="color:red;">Cancelled Order</span></div></div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`;
        let tableStart=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;border: 1px solid black;box-sizing: border-box;">`
        ,tableEnd=`</div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>   `
        let itemsTemplate = "";
        let img;
        if(item.fish.imagePrimary && item.fish.imagePrimary!=''){
            img=`<img src="https://apiseafood.senorcoders.com${item.fish.imagePrimary}" alt="" style="width:100%" />`
        }
        else{
            img=''
        }
        itemsTemplate=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width:100%"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%">${img}</div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%">Shipment 1 of 1 sold by ${store.name}<br /><span style="color:blue;font-weight: bold;">${item.fish.name}</span> <br /> <span style="color:black;font-weight: bold;">QTY - ${item.quantity.value} ${item.quantity.type}</span></div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;position:relative;display:table"><p style="position: absolute;top: 50%;transform: translate(0,-50%)">${item.price.value* item.quantity.value} AED</p></div></div>`
        let shipping=item.shipping,otherTaxes=item.sfsMargin+item.customs+item.uaeTaxes;
        let subtotal=shipping+otherTaxes+(item.price.value*item.quantity.value);
        let taxesHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Shipping Fees</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${shipping} AED</span></div></div><div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Taxes and Customs and other Fees </div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${otherTaxes} AED</span></div></div>`
        let subtotalHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: bold;;font-size: 14px"> Sub Total Paid</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black; font-weight: bold;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${subtotal}AED</span></div></div>`
   
        fs.readFile("./template_emails/order_cancel/order-cancelled-by-buyer-part1.html", "utf8", function (err, data) {
                if (err) { return reject(err); }
                fs.readFile("./template_emails/order_cancel/order-cancelled-by-buyer-admin-footer.html", "utf8", function (err, data2) {
                    if (err) { return reject(err); }
                    resolve(data + header + body +tableStart+itemsTemplate+taxesHtml+subtotalHtml+tableEnd+ data2);
                });
            });
    })
}
exports.sendEmailOrderStatusAdmin=async function(name,cart,store,item){
        try{
    let template = await getTemplateOrderCancelAdmin(name,cart,store,item);
    nodemailer.createTestAccount((err, account) => {

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Senorcoders" <milton@senorcoders.com>', // sender address
                to: 'bryandanglas05@gmail.com', // list of receivers
                subject: `Order #${cart.orderNumber} is Cancelled`, // Subject line
                text: '', // plain text body
                html: template, // html body
                attachments: [{
                    filename: 'logo.png',
                    path: './template_emails/images/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
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
exports.sendEmailItemRoad = async function (name,cart,store,item) {
    let template = await getTemplateItemShopping(name,cart,store,item);
    // console.log("item:: ", email);
    // if (trackingID !== "") {
    //     trackingID = ", you tracking ID " + trackingID
    // }

    return new Promise(function (resolve, reject) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Senorcoders" <milton@senorcoders.com>', // sender address
            to: cart.buyer.email, // list of receivers
            subject: `Order #${cart.orderNumber} is being Shipped`, // Subject line
            text: '',
            html: template,
            attachments: [{
                filename: 'image.png',
                path: './template_emails/images/logo.png',
                cid: 'unique@kreata.ee' //same cid value as in the html img src
            }]
        };

        // if (trackingFile !== "") {

        //     let sp = trackingFile.split("/");
        //     let dirname = path.join(IMAGES, "trackingfile", item.id, sp[sp.length - 2]);
        //     mailOptions.attachments.push({
        //         filename: "tracking.png",
        //         path: dirname,
        //         cid: 'unique@trkeata.ee'
        //     });
        // }

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
}
async function getTemplateProductApproved(seller,product){
    return new Promise(function (resolve, reject) {
        let header=`<div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><span style="line-height: 26px; font-size: 22px;">Hey ${seller.firstName} ${seller.lastName},</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
        let body=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">We are pleased to inform you that the product you have uploaded ${product.name} has been approved. It is now live on the platform and buyers can view and order it.</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;font-weight: bold;">Product Details:</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;"><b>Name: </b>${product.name}<br><b>seller SKU: </b>${product.seller_sku}<br><b>SKU: </b>${product.seafood_sku}<br><b>Description: </b>${product.description}<br><b>Quality: </b>${product.quality}<br><b>Country: </b>${product.country}<br><b>City: </b>${product.city}<br><b>Price: </b>${product.price.value}<br><b>Minimum Order: </b>${product.minimumOrder}<br><b>Maximum Order: </b>${product.maximumOrder}<br><b>Raised: </b>${product.raised}<br><b>Preparation: </b>${product.preparation}<br><b>Treatment: </b>${product.treatment}</span></p>`;
        fs.readFile("./template_emails/products/product_header.html", "utf8", function (err, data) {
                if (err) { return reject(err); }
                fs.readFile("./template_emails/products/product_footer.html", "utf8", function (err, data2) {
                    if (err) { return reject(err); }
                    resolve(data + header + body + data2);
                });
            });
    })
}
//send email if product is approved
exports.sendEmailProductApproved=async function(seller,product){
    try{
        let template = await getTemplateProductApproved(seller,product);
        nodemailer.createTestAccount((err, account) => {

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Senorcoders" <milton@senorcoders.com>', // sender address
                to: seller.email, // list of receivers
                subject: `Product #${product.seafood_sku} is awaiting Review`, // Subject line
                text: '', // plain text body
                html: template, // html body
                attachments: [{
                    filename: 'logo.png',
                    path: './template_emails/images/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
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
async function getTemplateProductRejected(seller,product,SFSAdminFeedback){
    return new Promise(function (resolve, reject) {
        let header=`<div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><span style="line-height: 26px; font-size: 22px;">Hey ${seller.firstName} ${seller.lastName},</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
        let body=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">We are regret to inform you that the product you have uploaded ${product.name} has not been approved. It is now still under review and awaiting modification from your side to comply with SFS products <a href="#" style="text-decoration: underline;color: blue">guidelines.</a></span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;font-weight: bold;">Product Details:</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;"><b>Name: </b>${product.name}<br><b>seller SKU: </b>${product.seller_sku}<br><b>SKU: </b>${product.seafood_sku}<br><b>Description: </b>${product.description}<br><b>Quality: </b>${product.quality}<br><b>Country: </b>${product.country}<br><b>City: </b>${product.city}<br><b>Price: </b>${product.price.value}<br><b>Minimum Order: </b>${product.minimumOrder}<br><b>Maximum Order: </b>${product.maximumOrder}<br><b>Raised: </b>${product.raised}<br><b>Preparation: </b>${product.preparation}<br><b>Treatment: </b>${product.treatment}</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">To help get your products live on the platform, we encourage you to review the feedback given by SFS Team below:<p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">${SFSAdminFeedback}</span></p></span></p>`;
        fs.readFile("./template_emails/products/product_header.html", "utf8", function (err, data) {
                if (err) { return reject(err); }
                fs.readFile("./template_emails/products/product_rejected_footer.html", "utf8", function (err, data2) {
                    if (err) { return reject(err); }
                    resolve(data + header + body + data2);
                });
            });
    })
}
//send email if product is approved
exports.sendEmailProductRejected=async function(seller,product,SFSAdminFeedback){
    try{
        let template = await getTemplateProductRejected(seller,product,SFSAdminFeedback);
        nodemailer.createTestAccount((err, account) => {

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Senorcoders" <milton@senorcoders.com>', // sender address
                to: seller.email, // list of receivers
                subject: `Product #${product.seafood_sku} is awaiting Review`, // Subject line
                text: '', // plain text body
                html: template, // html body
                attachments: [{
                    filename: 'logo.png',
                    path: './template_emails/images/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
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
async function getTemplateNewProductAdded(product,seller){
    return new Promise(function (resolve, reject) {
        let header=`<div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><span style="line-height: 26px; font-size: 22px;">Hey Admin,</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div><div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->`
        let body=`<div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">A new product has been uploaded by ${seller.firstName} ${seller.lastName}, and is awaiting your review. Please login into the Admin dashboard review the product and update its status.</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Product Details:</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;"><b>Name: </b>${product.name}<br><b>seller SKU: </b>${product.seller_sku}<br><b>SKU: </b>${product.seafood_sku}<br><b>Description: </b>${product.description}<br><b>Quality: </b>${product.quality}<br><b>Country: </b>${product.country}<br><b>City: </b>${product.city}<br><b>Price: </b>${product.price.value}<br><b>Minimum Order: </b>${product.minimumOrder}<br><b>Maximum Order: </b>${product.maximumOrder}<br><b>Raised: </b>${product.raised}<br><b>Preparation: </b>${product.preparation}<br><b>Treatment: </b>${product.treatment}</span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`;
        fs.readFile("./template_emails/new_product/header.html", "utf8", function (err, data) {
            if (err) { return reject(err); }
            fs.readFile("./template_emails/new_product/footer.html", "utf8", function (err, data2) {
                if (err) { return reject(err); }
                resolve(data +header+ body + data2);
            });
        });
    })
}
//send email to admin to notify new product
exports.sendEmailNewProductAdded=async function(product,seller){
    try{
        let template = await getTemplateNewProductAdded(product,seller);
        nodemailer.createTestAccount((err, account) => {

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Senorcoders" <milton@senorcoders.com>', // sender address
                to: 'bryandanglas05@gmail.com', // list of receivers
                subject: `Product #${product.seafood_sku} is awaiting Review `, // Subject line
                text: '', // plain text body
                html: template, // html body
                attachments: [{
                    filename: 'logo.png',
                    path: './template_emails/images/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
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
async function getTemplateNewProductAddedSeller(product,seller){
    return new Promise(function (resolve, reject) {
        let header=`<div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><span style="line-height: 26px; font-size: 22px;">Hey ${seller.firstName} ${seller.lastName},</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div><div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->`
        let body=`<div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Thank you for uploading a new product with the title ${product.name} into SFS shop front. As per our Quality Assurance process, the item uploaded is under review and will be processed shortly. Please note that products under review will not appear on the platform until they are approved</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">We aim to get back to you with an update on the product status within the next 24 hours.</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Product Details:</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;"><b>Name: </b>${product.name}<br><b>seller SKU: </b>${product.seller_sku}<br><b>SKU: </b>${product.seafood_sku}<br><b>Description: </b>${product.description}<br><b>Quality: </b>${product.quality}<br><b>Country: </b>${product.country}<br><b>City: </b>${product.city}<br><b>Price: </b>${product.price.value}<br><b>Minimum Order: </b>${product.minimumOrder}<br><b>Maximum Order: </b>${product.maximumOrder}<br><b>Raised: </b>${product.raised}<br><b>Preparation: </b>${product.preparation}<br><b>Treatment: </b>${product.treatment}</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">To view and manage your products, please login into your account or press on the button below.</span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`;
        let prefooter=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div align="center" class="button-container center " style="padding-right: 10px; padding-left: 10px; padding-top:10px; padding-bottom:10px;"><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top:10px; padding-bottom:10px;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://seafood.senorcoders.com/my-products" style="height:31pt; v-text-anchor:middle; width:150pt;" arcsize="10%" strokecolor="#D61A1A" fillcolor="#D61A1A"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size:16px;"><![endif]--><a href="http://seafood.senorcoders.com/my-products" target="_blank" style="display: block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #ffffff; background-color: #D61A1A; max-width: 200px; width: 160px;width: auto; border-top: 0px solid transparent; border-right: 0px solid transparent; border-bottom: 0px solid transparent; border-left: 0px solid transparent; padding-top: 5px; padding-right: 20px; padding-bottom: 5px; padding-left: 20px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;mso-border-alt: none"><span style="font-size:16px;line-height:32px;"><span style="font-size: 15px; line-height: 30px;" data-mce-style="font-size: 15px;">Manage Products</span></span></a><!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
        fs.readFile("./template_emails/new_product/header.html", "utf8", function (err, data) {
            if (err) { return reject(err); }
            fs.readFile("./template_emails/new_product/footer.html", "utf8", function (err, data2) {
                if (err) { return reject(err); }
                resolve(data +header+ body + prefooter+data2);
            });
        });
    })
}
//send email to seller to notify new product
exports.sendEmailNewProductAddedSeller=async function(product,seller){
    try{
        let template = await getTemplateNewProductAddedSeller(product,seller);
        nodemailer.createTestAccount((err, account) => {

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Senorcoders" <milton@senorcoders.com>', // sender address
                to: seller.email, // list of receivers
                subject: `Product #${product.seafood_sku} is Under Review `, // Subject line
                text: '', // plain text body
                html: template, // html body
                attachments: [{
                    filename: 'logo.png',
                    path: './template_emails/images/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
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
async function getTemplateorderCancelledBySellerBuyer(name,cart,store,item){
    return new Promise(function (resolve, reject) {
    let header=`<div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><span style="line-height: 26px; font-size: 22px;">Hey ${name},</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
    let body=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Unfortunately, your order number: ${cart.orderNumber} placed on has been canceled, since the seller is not able to fulfill your order.</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">We're sorry for any inconvenience that have occurred. We hope this will not affect your shopping experience on <a href="http://seafood.senorcoders.com/">Seafoodsouq.com.</a></span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Your payment has been refunded to your Credit Card, the refunded amount will be available in your Credit Card, within 5-7 working days. You can follow up on the refund case using the Refund reference number: < Refund Reference Number>.</span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div><div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><div style="font-size: 15px; float: left;width: 40%;">Order # ${cart.orderNumber}</div><div style="font-size: 15px; float: left;width: 60%;padding-left: 5px;box-sizing: border-box; text-align: right;"><span style="color:red;">Cancelled Order</span></div></div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`;
    let tableStart=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;border: 1px solid black;box-sizing: border-box;">`
        ,tableEnd=`</div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>   `
    let itemsTemplate = "";
    let img;
    if(item.fish.imagePrimary && item.fish.imagePrimary!=''){
        img=`<img src="https://apiseafood.senorcoders.com${item.fish.imagePrimary}" alt="" style="width:100%" />`
    }
    else{
        img=''
    }
    itemsTemplate=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width:100%"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%">${img}</div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%">Shipment 1 of 1 sold by ${store.name}<br /><span style="color:blue;font-weight: bold;">${item.fish.name}</span> <br /> <span style="color:black;font-weight: bold;">QTY - ${item.quantity.value} ${item.quantity.type}</span></div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;position:relative;display:table"><p style="position: absolute;top: 50%;transform: translate(0,-50%)">${item.price.value* item.quantity.value} AED</p></div></div>`
    let shipping=item.shipping,otherTaxes=item.sfsMargin+item.customs+item.uaeTaxes;
    let subtotal=shipping+otherTaxes+(item.price.value*item.quantity.value);
    let taxesHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Shipping Fees</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${shipping} AED</span></div></div><div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Taxes and Customs and other Fees </div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${otherTaxes} AED</span></div></div>`
    let subtotalHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: bold;;font-size: 14px"> Sub Total Paid</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black; font-weight: bold;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${subtotal}AED</span></div></div>`
    let prefooter=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">A Total of ${subtotal} AED has been refunded to your Credit Card.</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">To contact us please reply back to this email or send us an email to < email> with the order number.</span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
    fs.readFile("./template_emails/order_cancel/order-cancelled-by-seller-header.html", "utf8", function (err, data) {
            if (err) { return reject(err); }
            fs.readFile("./template_emails/order_cancel/order-cancelled-by-seller-buyer-footer.html", "utf8", function (err, data2) {
                if (err) { return reject(err); }
                resolve(data + header + body +tableStart+itemsTemplate+taxesHtml+subtotalHtml +tableEnd+prefooter+ data2);
            });
        });
    })
}
exports.orderCancelledBySellerBuyerNotified=async function(name,cart,store,item){
    try{
        let template = await getTemplateorderCancelledBySellerBuyer(name,cart,store,item);
        nodemailer.createTestAccount((err, account) => {

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Senorcoders" <milton@senorcoders.com>', // sender address
                to: cart.buyer.email, // list of receivers
                subject: `Your Order has been cancelled !`, // Subject line
                text: '', // plain text body
                html: template, // html body
                attachments: [{
                    filename: 'logo.png',
                    path: './template_emails/images/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
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
async function getTemplateorderCancelledBySellerAdmin(name,cart,store,item){
    return new Promise(function (resolve, reject) {
    let header=`<div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><![endif]--><div style="color:#555555;line-height:120%;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 22px; line-height: 26px; color: rgb(51, 51, 51);"><strong><span style="line-height: 26px; font-size: 22px;">Hey Admin,</span></strong></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`
    let body=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">The Order #${cart.orderNumber} has been cancelled by the seller ${store.owner.firstName} ${store.owner.lastName}. Buyer ${name} has been notified with cancellation and a refund case for the buyer has been issued.</span></p><p style="margin-top: 20px;font-size: 14px;line-height: 21px"><span style="font-size: 15px; line-height: 22px;">Refund Case number #< refund case number></span></p></div></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div><div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;"><div style="font-size: 15px; float: left;width: 40%;">Order # ${cart.orderNumber}</div><div style="font-size: 15px; float: left;width: 60%;padding-left: 5px;box-sizing: border-box; text-align: right;"><span style="color:red;">Cancelled Order</span></div></div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>`;
    let tableStart=`<div style="background-color:transparent;"><div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]--><div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;"><div style="background-color: transparent; width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div class=""><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]--><div style="color:#555555;line-height:150%;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;border: 1px solid black;box-sizing: border-box;">`
        ,tableEnd=`</div></div><div style="clear: both;"></div><!--[if mso]></td></tr></table><![endif]--></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div>   `
    let itemsTemplate = "";
    let img;
    if(item.fish.imagePrimary && item.fish.imagePrimary!=''){
        img=`<img src="https://apiseafood.senorcoders.com${item.fish.imagePrimary}" alt="" style="width:100%" />`
    }
    else{
        img=''
    }
    itemsTemplate=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width:100%"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%">${img}</div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%">Shipment 1 of 1 sold by ${store.name}<br /><span style="color:blue;font-weight: bold;">${item.fish.name}</span> <br /> <span style="color:black;font-weight: bold;">QTY - ${item.quantity.value} ${item.quantity.type}</span></div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;position:relative;display:table"><p style="position: absolute;top: 50%;transform: translate(0,-50%)">${item.price.value* item.quantity.value} AED</p></div></div>`
    let shipping=item.shipping,otherTaxes=item.sfsMargin+item.customs+item.uaeTaxes;
    let subtotal=shipping+otherTaxes+(item.price.value*item.quantity.value);
    let taxesHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Shipping Fees</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${shipping} AED</span></div></div><div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: lighter;">Taxes and Customs and other Fees </div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;align-items: center;border-left: 1px solid black;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${otherTaxes} AED</span></div></div>`
    let subtotalHtml=`<div style="display: table;height: 100%;flex-wrap: wrap;box-sizing: border-box;padding: 0 0 2px 5px;align-items: center;width: 100%;"><div style="width: 30%;float: left;box-sizing: border-box;padding-top: 5px; height: 100%"></div><div style="width: 50%;float: left;box-sizing:border-box;padding: 5px; height: 100%; font-weight: bold;;font-size: 14px"> Sub Total Paid</div><div style="width: 20%;float: left;background: #b9b4b4;box-sizing:border-box;padding: 5px;color:black; text-transform: uppercase;font-size: 14px; height: 100%;border-left: 1px solid black; font-weight: bold;"><span style="position: absolute;top: 50%;transform: translate(0,-50%)">${subtotal}AED</span></div></div>`
   
    fs.readFile("./template_emails/order_cancel/order-cancelled-by-seller-header.html", "utf8", function (err, data) {
            if (err) { return reject(err); }
            fs.readFile("./template_emails/order_cancel/order-cancelled-by-seller-admin-footer.html", "utf8", function (err, data2) {
                if (err) { return reject(err); }
                resolve(data + header + body +tableStart+itemsTemplate+taxesHtml+subtotalHtml +tableEnd+ data2);
            });
        });
    })
}
exports.orderCancelledBySellerAdminNotified=async function(name,cart,store,item){
    try{
        let template = await getTemplateorderCancelledBySellerAdmin(name,cart,store,item);
        nodemailer.createTestAccount((err, account) => {

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Senorcoders" <milton@senorcoders.com>', // sender address
                to: 'bryandanglas05@gmail.com', // list of receivers
                subject: `Order #${cart.orderNumber}is Cancelled`, // Subject line
                text: '', // plain text body
                html: template, // html body
                attachments: [{
                    filename: 'logo.png',
                    path: './template_emails/images/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
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