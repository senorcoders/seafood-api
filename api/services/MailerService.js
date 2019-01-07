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
async function formatDates(d){
        let date=new Date(d)
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // get time am or pm
        let hours=date.getHours()
        let min = date.getMinutes();
        let dates=months[date.getMonth()]+'/'+ date.getDate()+ '/'+date.getFullYear()+'/'+hours+':'+ min;
        return dates
    };

module.exports = {
	registerNewUser: ( user ) => {
        email.render( '../email_templates/register_new_user',
            {
                name:user.firstName+' '+user.lastName,
                id:user.id, 
                code:user.code
            }
        )
        .then( res=> {            
            transporter.sendMail( { 
                from:       sender,
                to:         user.email,
                subject:    'Your Account is Under Review',                    
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
            })
                
        } )
        .catch(
            console.error
        )    
    },
    newUserNotification: (role) => {
    	let roleType;
    	if(role==0){
            roleType="Admin"
        }else if(role==1){
            roleType="Seller"
        }else{roleType="Buyer"}
        email.render( '../email_templates/new_user_admin_notification',
            {
                role:roleType
            }
        )
        .then( res=> {            
            transporter.sendMail( { 
                from:       sender,
                to:         'brian@senorcoders.com',
                subject:    `New ${roleType} is pending confirmation`,                    
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
            })
                
        } )
        .catch(
            console.error
        )    
    },
    sendApprovedEmail: ( id, emailAddress, code, name ) => {
        email.render( '../email_templates/approved_account',
                {
                name:       name
            }
        )
        .then( res=> {            
            transporter.sendMail( { 
                from:       sender,
                to:         emailAddress,
                subject:    'Welcome Onboard, Getting Started with Seafood Souq !',                    
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
            })
                
        } )
        .catch(
            console.error
        )    
    },
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
    },
    sendRejectedEmail: ( emailAddress,role, name,denialMessage ) => {
        email.render( '../email_templates/rejected_seller',
            {
                name:name,
                message:denialMessage,
                roleType:role
            }
        )
        .then( res=> {            
            transporter.sendMail( { 
                from:       sender,
                to:         emailAddress,
                subject:    'Update - Seafood Souq Account',                    
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
            })
                
        } )
        .catch(
            console.error
        )    
    },
    sendEmailForgotPassword: ( emailAddress, code, name ) => {
        email.render( '../email_templates/forgot_password',
            {
                code:code,
                name:name
            }
        )
        .then( res=> {            
            transporter.sendMail( { 
                from:       sender,
                to:         emailAddress,
                subject:    'Password Recovery for Seafood Souq',                    
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
            })
                
        } )
        .catch(
            console.error
        )    
    },
    sendDataFormContactToSeller: ( emailAddress,nameSeller,nameBuyer,emailBuyer,message ) => {
        email.render( '../email_templates/contact_message',
            {
                nameBuyer:nameBuyer,
                nameSeller:nameSeller,
                message:message,
                emailBuyer:emailBuyer
            }
        )
        .then( res=> {            
            transporter.sendMail( { 
                from:       sender,
                to:         emailAddress,
                subject:    'New Message of Contact in Seafood Souq',                    
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
            })
                
        } )
        .catch(
            console.error
        )    
    },
    newProductAddedAdminNotified: ( product, seller ) => {
        email.render( '../email_templates/new_product_awaiting_review',
            {
                name:seller.firstName+' '+seller.lastName,
                product:product
            }
        )
        .then( res=> {            
            transporter.sendMail( { 
                from:       sender,
                to:         'brian@senorcoders.com',
                subject:    `Product #${product.seafood_sku} is awaiting Review`,                    
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
            })
                
        } )
        .catch(
            console.error
        )    
    },
    newProductAddedSellerNotified: ( product, seller ) => {
        email.render( '../email_templates/new_product_seller_notified',
            {
                name:seller.firstName+' '+seller.lastName,
                product:product
            }
        )
        .then( res=> {            
            transporter.sendMail( { 
                from:       sender,
                to:         seller.email,
                subject:    `Product #${product.seafood_sku} is Under Review `,                    
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
            })
                
        } )
        .catch(
            console.error
        )    
    },
    newProductRejected: ( seller,product,SFSAdminFeedback ) => {
        email.render( '../email_templates/new_product_rejected',
            {
                name:seller.firstName+' '+seller.lastName,
                product:product,
                SFSAdminFeedback:SFSAdminFeedback
            }
        )
        .then( res=> {            
            transporter.sendMail( { 
                from:       sender,
                to:         seller.email,
                subject:    `Product #${product.seafood_sku} is awaiting Review`,                    
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
            })
                
        } )
        .catch(
            console.error
        )    
    },
    newProductAccepted: ( seller,product ) => {
        email.render( '../email_templates/new_product_accepted',
            {
                name:seller.firstName+' '+seller.lastName,
                product:product
            }
        )
        .then( res=> {            
            transporter.sendMail( { 
                from:       sender,
                to:         seller.email,
                subject:    `Product #${product.seafood_sku} is awaiting Review`,                    
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
            })
                
        } )
        .catch(
            console.error
        )    
    },
    sendCartPaidSellerNotified: ( sellerName,cart,items,orderNumber,emailAddress) => {
        email.render( '../email_templates/cart_paid_seller_notified',
            {
                sellerName:sellerName,
                cart:cart,
                items:items,
                orderNumber:orderNumber
            }
        )
        .then( res=> {            
            transporter.sendMail( { 
                from:       sender,
                to:         emailAddress,
                subject:    `Order #${orderNumber} is Placed`,                    
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
            })
                
        } )
        .catch(
            console.error
        )    
    },
    sendCartPaidBuyerNotified: ( items,cart,orderNumber,stores) => {
    	let store,storeLng=stores.length;
		    for(let [index,value] of stores.entries()){
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
        email.render( '../email_templates/cart_paid_buyer_notified',
            {
                name:cart.buyer.firstName+ ' '+ cart.buyer.lastName,
                cart:cart,
                items:items,
                orderNumber:orderNumber,
                store:store
            }
        )
        .then( res=> {            
            transporter.sendMail( { 
                from:       sender,
                to:         cart.buyer.email,
                subject:    `Order #${orderNumber} is Placed`,                    
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
            })
                
        } )
        .catch(
            console.error
        )    
    },
    sendCartPaidAdminNotified: ( items,cart,orderNumber,stores) => {
    	let store,storeLng=stores.length;
		    for(let [index,value] of stores.entries()){
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
        email.render( '../email_templates/cart_paid_admin_notified',
            {
                name:cart.buyer.firstName+ ' '+ cart.buyer.lastName,
                cart:cart,
                items:items,
                orderNumber:orderNumber,
                store:store
            }
        )
        .then( res=> {            
            transporter.sendMail( { 
                from:       sender,
                to:         'brian@senorcoders.com',
                subject:    `Order #${orderNumber} is Placed`,                    
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
            })
                
        } )
        .catch(
            console.error
        )    
    },
    buyerCancelledOrderBuyer: async( name,cart,store,item) => {
    	let paidDateTime=await formatDates(cart.paidDateTime);
        email.render( '../email_templates/buyer_cancelled_order',
            {
                name:name,
                cart:cart,
                store:store,
                item:item,
                paidDateTime:paidDateTime
            }
        )
        .then( res=> {            
            transporter.sendMail( { 
                from:       sender,
                to:         cart.buyer.email,
                subject:    `Order #${cart.orderNumber} is Cancelled`,                    
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
            })
                
        } )
        .catch(
            console.error
        )    
    },
    buyerCancelledOrderSeller: async( cart,store,item) => {
    	let paidDateTime=await formatDates(cart.paidDateTime);
        email.render( '../email_templates/buyer_cancelled_order_seller',
            {
                name:store.owner.firstName+ ' ' + store.owner.lastName,
                cart:cart,
                store:store,
                item:item,
                paidDateTime:paidDateTime
            }
        )
        .then( res=> {            
            transporter.sendMail( { 
                from:       sender,
                to:         store.owner.email,
                subject:    `Order #${cart.orderNumber} is Cancelled`,                    
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
            })
                
        } )
        .catch(
            console.error
        )    
    },
    buyerCancelledOrderAdmin: async ( cart,store,item) => {
    	let paidDateTime=await formatDates(cart.paidDateTime);
        email.render( '../email_templates/buyer_cancelled_order_admin',
            {
                cart:cart,
                store:store,
                item:item,
                paidDateTime:paidDateTime
            }
        )
        .then( res=> {            
            transporter.sendMail( { 
                from:       sender,
                to:         'brian@senorcoders.com',
                subject:    `Order #${cart.orderNumber} is Cancelled`,                    
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
            })
                
        } )
        .catch(
            console.error
        )    
    }
}
