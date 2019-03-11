var nodeMailer = require("nodemailer");
var Email = require('email-templates');
const ADMIN_EMAIL = 'kharron@seafoodsouq.com, osama@seafoodsouq.com, omar@seafoodsouq.com';
const APP_NAME = sails.config.APP_NAME;
const config = sails.config.mailer;
const sender = config.auth.user;
const emailSender = 'Seafoodsouq <do-not-reply@seafoodsouq.com>';
const URL = sails.config.linkImagesEmail;
console.log(URL)
const transporter = nodeMailer.createTransport({
    host: config.host,
    port: 465,
    //secure: true, // true for 465, false for other ports
    auth: config.auth,
    tls: {
        rejectUnauthorized: false
    }
});

function getdataOrderPlace(sellerName, cart, items, orderNumber, type) {
    try {
        let grandTotal = 0, imagesPrimary = [], i = 0;
        for (let it of items) {
            grandTotal += Number(parseFloat(Number(it.quantity.value) * Number(it.price.value)).toFixed(2));
            grandTotal += Number(it.shipping);
            grandTotal += Number(it.uaeTaxes);
            grandTotal += Number(it.customs);
            grandTotal += Number(it.sfsMargin);
            if (it.fish.imagePrimary && it.fish.imagePrimary !== '') {
                imagesPrimary.push({
                    filename: `primary${i}.jpg`,
                    path: `./images/primary/${it.fish.imagePrimary.split("/").pop()}/${it.fish.imagePrimary.split("/").slice(-2)[0]}`,
                    cid: `item${i}@seafood.com`
                });
            }
            i += 1;
        }
        grandTotal = Number((grandTotal).toFixed(2));
        let date = new Date(cart.paidDateTime);
        let paidDateTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

        return {
            name: sellerName,
            sellerName: sellerName,
            cart: cart,
            items: items,
            orderNumber: orderNumber,
            url: URL,
            paidDateTime,
            grandTotal,
            imagesPrimary
        };
    }
    catch (e) {
        console.error(e);
    }
}

const email = new Email({
    message: {
        from: emailSender,
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
async function formatDates(d) {
    let date = new Date(d)
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // get time am or pm
    let hours = date.getHours()
    let min = date.getMinutes();
    let dates = months[date.getMonth()] + '/' + date.getDate() + '/' + date.getFullYear() + '/' + hours + ':' + min;
    return dates
};

module.exports = {    
    registerNewUser: (user) => {
        email.render('../email_templates/register_new_user',
            {
                name: user.firstName + ' ' + user.lastName,
                id: user.id,
                code: user.code
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: user.email,
                    subject: 'Your Account is Under Review',
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    newUserNotification: (role) => {
        let roleType;
        if (role == 0) {
            roleType = "Admin"
        } else if (role == 1) {
            roleType = "Seller"
        } else { roleType = "Buyer" }
        email.render('../email_templates/new_user_admin_notification',
            {
                role: roleType
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: ADMIN_EMAIL,
                    subject: `New ${roleType} is pending confirmation`,
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    sendApprovedEmail: (id, emailAddress, code, name) => {
        email.render('../email_templates/approved_account',
            {
                name: name
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: emailAddress,
                    subject: 'Welcome Onboard, Getting Started with Seafood Souq !',
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    sendApprovedBuyerEmail: (id, emailAddress, code, name) => {
        email.render('../email_templates/approved_account_buyer',
            {
                name: name,
                id,
                code
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: emailAddress,
                    subject: 'Welcome Onboard, Getting Started with Seafood Souq !',
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    sendApprovedSellerEmail: (emailAddress, name) => {
        email.render('../email_templates/approved_seller',
            {
                name: name
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: emailAddress,
                    subject: 'Your Next Steps to Sell On Seafood Souq',
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    sendRejectedEmail: (emailAddress, role, name, denialMessage, emailContact) => {
        email.render('../email_templates/rejected_seller',
            {
                name: name,
                message: denialMessage,
                roleType: role,
                emailContact
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: emailAddress,
                    subject: 'Update - Seafood Souq Account',
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    sendEmailForgotPassword: (emailAddress, code, name) => {
        email.render('../email_templates/forgot_password',
            {
                code: code,
                name: name
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: emailAddress,
                    subject: 'Password Recovery for Seafood Souq',
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    sendDataFormContactToSeller: (emailAddress, nameSeller, nameBuyer, emailBuyer, message) => {
        email.render('../email_templates/contact_message',
            {
                nameBuyer: nameBuyer,
                nameSeller: nameSeller,
                message: message,
                emailBuyer: emailBuyer
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: emailAddress,
                    subject: 'New Message of Contact in Seafood Souq',
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    newProductAddedAdminNotified: (product, seller) => {
        email.render('../email_templates/new_product_awaiting_review',
            {
                name: seller.firstName + ' ' + seller.lastName,
                product: product
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: ADMIN_EMAIL,
                    subject: `Product #${product.seafood_sku} is awaiting Review`,
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    newProductAddedSellerNotified: (product, seller) => {
        email.render('../email_templates/new_product_seller_notified',
            {
                name: seller.firstName + ' ' + seller.lastName,
                product: product
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: seller.email,
                    subject: `Product #${product.seafood_sku} is Under Review `,
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    newProductRejected: (seller, product, SFSAdminFeedback) => {
        email.render('../email_templates/new_product_rejected',
            {
                name: seller.firstName + ' ' + seller.lastName,
                product: product,
                SFSAdminFeedback: SFSAdminFeedback
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: seller.email,
                    subject: `Product #${product.seafood_sku} is awaiting Review`,
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    newProductAccepted: (seller, product) => {
        email.render('../email_templates/new_product_accepted',
            {
                name: seller.firstName + ' ' + seller.lastName,
                product: product
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: seller.email,
                    subject: `Product #${product.seafood_sku} is awaiting Review`,
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'seafoodsouq_logo' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    sendCartPaidSellerNotified: async (sellerName, cart, items, orderNumber, emailAddress, sellerInvoice) => {

      let buyerExpectedDeliveryDate = item.buyerExpectedDeliveryDate.split("/");
        let buyerDate = new Date( buyerExpectedDeliveryDate[2], buyerExpectedDeliveryDate[0], buyerExpectedDeliveryDate[1] );
        items.buyerExpectedDeliveryDate = await sails.helpers.formatDate(buyerDate);
        items = Object.prototype.toString.call(items) === '[object Object]' ? [items] : items;
        console.log(Object.prototype.toString.call(items), "sendCartPaidSellerNotified");
        let data = getdataOrderPlace(sellerName, cart, items, orderNumber, "sendCartPaidSellerNotified");
        email.render('../email_templates/cart_paid_seller_notified', data)


        email.render('../email_templates/cart_paid_seller_notified',
            {
                sellerName: sellerName,
                cart: cart,
                items: items,
                orderNumber: orderNumber,
                url: URL
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: emailAddress,
                    subject: `Order #${orderNumber} is Placed`,
                    html: res, // html body
                    attachments: [
                        {
                            filename: 'logo.png',
                            path: './assets/images/logo.png',
                            cid: 'seafoodsouq_logo' //same cid value as in the html img src
                        },
                        {
                            filename: sellerInvoice,
                            path: `pdf_purchase_order/${sellerInvoice}`
                        }
                    ].concat(data.imagesPrimary)
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    sendCartPaidBuyerNotified: async (items, cart, orderNumber, stores, pdf_invoice, invoiceNumber) => {
        let store, storeLng = stores.length;
        for (let [index, value] of stores.entries()) {
            if (index == 0) {
                if (storeLng > 1) {
                    store = value + ' and ';
                }
                else {
                    store = value;
                }
            } else {
                if (index == storeLng - 1) {
                    store += value
                } else {
                    store += value + ' and '
                }
            }
        }
        let data = getdataOrderPlace("", cart, items, orderNumber, "sendCartPaidBuyerNotified")
        email.render('../email_templates/cart_paid_buyer_notified',
            data
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: cart.buyer.email,
                    subject: `Order #${orderNumber} is Placed`,
                    html: res, // html body
                    attachments: [
                        {
                            filename: 'logo.png',
                            path: './assets/images/logo.png',
                            cid: 'seafoodsouq_logo' //same cid value as in the html img src
                        },
                        {
                            filename: `seafood-invoice-${orderNumber}.pdf`,
                            path: `pdf_invoices/${pdf_invoice}`
                        }
                    ].concat(data.imagesPrimary)
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    sendCartPaidAdminNotified: (items, cart, orderNumber, stores) => {
        let store, storeLng = stores.length;
        for (let [index, value] of stores.entries()) {
            if (index == 0) {
                if (storeLng > 1) {
                    store = value + ' and ';
                }
                else {
                    store = value;
                }
            } else {
                if (index == storeLng - 1) {
                    store += value
                } else {
                    store += value + ' and '
                }
            }
        }
        let data = getdataOrderPlace(cart.buyer.firstName + ' ' + cart.buyer.lastName, cart, items, orderNumber, "sendCartPaidAdminNotified");
        let _stores = [];
        for (let it of items) {
            let ind = _stores.findIndex(i => { return i.id === it.fish.store.id; });
            if (ind === -1) _stores.push(it.fish.store);
        }
        let sellers = "";
        for (let i = 0; i < _stores.length; i++) {
            let space = (i + 1) === _stores.length ? '' : (i + 1) === (_stores.length - 1) ? ' and ' : ', ';
            sellers += _stores[i].owner.firstName + " " + _stores[i].owner.lastName + space;
        }
        if (_stores.length === 1) {
            sellers = _stores[0].owner.firstName + " " + _stores[0].owner.lastName;
        }
        data.sellers = sellers;
        console.log(JSON.stringify(data));
        email.render('../email_templates/cart_paid_admin_notified',
            data
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: ADMIN_EMAIL,
                    subject: `Order #${orderNumber} is Placed`,
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }].concat(data.imagesPrimary)
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    buyerCancelledOrderBuyer: async (name, cart, store, item) => {
        let paidDateTime = await formatDates(cart.paidDateTime);
        email.render('../email_templates/buyer_cancelled_order',
            {
                name: name,
                cart: cart,
                store: store,
                item: item,
                paidDateTime: paidDateTime,
                url: URL
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: cart.buyer.email,
                    subject: `Order #${cart.orderNumber} is Cancelled`,
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    buyerCancelledOrderSeller: async (cart, store, item) => {
        let paidDateTime = await formatDates(cart.paidDateTime);
        email.render('../email_templates/buyer_cancelled_order_seller',
            {
                name: store.owner.firstName + ' ' + store.owner.lastName,
                cart: cart,
                store: store,
                item: item,
                paidDateTime: paidDateTime,
                url: URL
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: store.owner.email,
                    subject: `Order #${cart.orderNumber} is Cancelled`,
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    buyerCancelledOrderAdmin: async (cart, store, item) => {
        let paidDateTime = await formatDates(cart.paidDateTime);
        email.render('../email_templates/buyer_cancelled_order_admin',
            {
                cart: cart,
                store: store,
                item: item,
                paidDateTime: paidDateTime,
                url: URL
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: ADMIN_EMAIL,
                    subject: `Order #${cart.orderNumber} is Cancelled`,
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    sellerCancelledOrderBuyer: async (name, cart, store, item) => {
        let paidDateTime = await formatDates(cart.paidDateTime);
        email.render('../email_templates/seller_cancelled_order_buyer',
            {
                name: name,
                cart: cart,
                store: store,
                item: item,
                paidDateTime: paidDateTime,
                url: URL
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: cart.buyer.email,
                    subject: 'Your Order has been cancelled !',
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    sellerCancelledOrderAdmin: async (name, cart, store, item) => {
        let paidDateTime = await formatDates(cart.paidDateTime);
        email.render('../email_templates/seller_cancelled_order_admin',
            {
                name: name,
                cart: cart,
                store: store,
                item: item,
                paidDateTime: paidDateTime,
                url: URL
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: ADMIN_EMAIL,
                    subject: `Order #${cart.orderNumber} is Cancelled`,
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    itemShipped: async (name, cart, store, item) => {
        
        let paidDateTime = new Date(cart.paidDateTime);
        let sellerExpectedDeliveryDate = item.sellerExpectedDeliveryDate.split("/");
        let sellerDate = new Date( sellerExpectedDeliveryDate[2], sellerExpectedDeliveryDate[0], sellerExpectedDeliveryDate[1] );
        item.sellerExpectedDeliveryDate = await sails.helpers.formatDate(sellerDate);
        cart.paidDateTime = await sails.helpers.formatDate(paidDateTime);
        email.render('../email_templates/itemShipped',
            {
                name: name,
                cart: cart,
                store: store,
                item: item,
                url: URL
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to:  cart.buyer.email,
                    subject: `Order #${cart.orderNumber} is being Shipped`,
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    orderArrived: async (name, cart, store, item) => {        
        let paidDateTime = new Date(cart.paidDateTime);
        let sellerExpectedDeliveryDate = item.sellerExpectedDeliveryDate.split("/");
        let sellerDate = new Date( sellerExpectedDeliveryDate[2], sellerExpectedDeliveryDate[0], sellerExpectedDeliveryDate[1] );
        item.sellerExpectedDeliveryDate = await sails.helpers.formatDate(sellerDate);
        cart.paidDateTime = await sails.helpers.formatDate(paidDateTime);
        email.render('../email_templates/order_arrived',
            {
                name: name,
                cart: cart,
                store: store,
                item: item,
                paidDateTime: paidDateTime,
                url: URL
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: cart.buyer.email,
                    subject: `Order #${cart.orderNumber} has arrived in Dubai !`,
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    orderDeliveredBuyer: async (name, cart, store, item) => {
        let paidDateTime = await formatDates(cart.paidDateTime);
        email.render('../email_templates/order_delivered_buyer',
            {
                name: name,
                cart: cart,
                store: store,
                item: item,
                paidDateTime: paidDateTime,
                url: URL
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: cart.buyer.email,
                    subject: `Order #${cart.orderNumber} is Delivered !`,
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    orderOutForDelivery: async (name, cart, store, item) => {
        let paidDateTime = await formatDates(cart.paidDateTime);
        email.render('../email_templates/order_out_for_delivery_buyer',
            {
                name: name,
                cart: cart,
                store: store,
                item: item,
                paidDateTime: paidDateTime,
                url: URL
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: cart.buyer.email,
                    subject: `Order #${cart.orderNumber} is out for Delivery!`,
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'seafood_logo' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    orderArrivedSeller: async (cart, store, item) => {
        let paidDateTime = await formatDates(cart.paidDateTime);
        email.render('../email_templates/order_delivered_seller',
            {
                cart: cart,
                store: store,
                item: item,
                paidDateTime: paidDateTime,
                url: URL
            }
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: store.owner.email,
                    subject: `Order #${cart.orderNumber} is Delivered !`,
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })

            })
            .catch(
                console.error
            )
    },
    sentAdminWarningETA: async (cart, store, item, buyer, sellerExpectedDeliveryDate) => {
        let data = getdataOrderPlace("", cart, [item], item.orderInvoice, "sentAdminWarningETA");
        email.render('../email_templates/admin_warning_ETA',
            _.extend(data, {
                sellerName: store.owner.firstName + ' ' + store.owner.lastName,
                buyerName: buyer,
                sellerExpectedDeliveryDate: sellerExpectedDeliveryDate
            })
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: ADMIN_EMAIL,
                    subject: `ETA Warning`,
                    html: res, // html body
                    attachments: [{
                        filename: 'logo.png',
                        path: './assets/images/logo.png',
                        cid: 'logo@seafoodsouq.com' //same cid value as in the html img src
                    }]
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    return 'Message sent: %s', info.messageId;
                })
            })

    },
}
