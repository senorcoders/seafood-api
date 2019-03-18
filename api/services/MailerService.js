var nodeMailer = require("nodemailer");
var Email = require('email-templates');
const ADMIN_EMAIL = sails.config.custom.adminEmails;
console.log( 'custom', sails.config.custom.adminEmails );
const APP_NAME = sails.config.APP_NAME;
const config = sails.config.mailer;
const sender = config.auth.user;
const emailSender = 'Seafoodsouq <do-not-reply@seafoodsouq.com>';

//El url base del api, segun su enviroment
const URL = sails.config.custom.baseUrl, 
logoSrc = URL + "/images/logo_email.png";
console.log( logoSrc );
//El json default que se usa en los correos como emails y logos
const DEFAULT = {
    logoSrc,
    emailSeller: "sellers@seafoodsouq.com",
    emailInfo: 'info@seafoodsouq.com',
    FAQLink: URL + '/login',
    url: URL,
    contactUs: URL + '/login',
};
console.log(DEFAULT);
//Para asignar variables globales en los datas de los mailers
function applyExtend(data) {
    return _.extend(data, DEFAULT);
}

const transporter = nodeMailer.createTransport({
    host: config.host,
    port: 465,
    //secure: true, // true for 465, false for other ports
    auth: config.auth,
    tls: {
        rejectUnauthorized: false
    }
});

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
            applyExtend({
                name: user.firstName + ' ' + user.lastName,
                id: user.id,
                code: user.code
            })
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: user.email,
                    subject: 'Your Account is Under Review',
                    html: res, // html body
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
            applyExtend({
                role: roleType
            })
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: ADMIN_EMAIL,
                    subject: `New ${roleType} is pending confirmation`,
                    html: res, // html body
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
        console.log(applyExtend({
            name: name
        }));
        email.render('../email_templates/approved_account',
            applyExtend({
                name: name
            })
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: emailAddress,
                    subject: 'Welcome Onboard, Getting Started with Seafood Souq !',
                    html: res, // html body
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
            applyExtend({
                name: name,
                id,
                code
            })
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: emailAddress,
                    subject: 'Welcome Onboard, Getting Started with Seafood Souq !',
                    html: res, // html body
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
            applyExtend({
                name: name
            })
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: emailAddress,
                    subject: 'Your Next Steps to Sell On Seafood Souq',
                    html: res, // html body
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
        email.render('../email_templates/rejected_user',
            applyExtend({
                name: name,
                message: denialMessage,
                roleType: role,
                emailContact
            })
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: emailAddress,
                    subject: 'Update - Seafood Souq Account',
                    html: res, // html body
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
            applyExtend({
                code: code,
                name: name
            })
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: emailAddress,
                    subject: 'Password Recovery for Seafood Souq',
                    html: res, // html body
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
            applyExtend({
                nameBuyer: nameBuyer,
                nameSeller: nameSeller,
                message: message,
                emailBuyer: emailBuyer
            })
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: emailAddress,
                    subject: 'New Message of Contact in Seafood Souq',
                    html: res, // html body
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
            applyExtend({
                name: seller.firstName + ' ' + seller.lastName,
                product: product
            })
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: ADMIN_EMAIL,
                    subject: `Product #${product.seafood_sku} is awaiting Review`,
                    html: res, // html body
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
            applyExtend({
                name: seller.firstName + ' ' + seller.lastName,
                product: product
            })
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: seller.email,
                    subject: `Product #${product.seafood_sku} is Under Review `,
                    html: res, // html body
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
            applyExtend({
                name: seller.firstName + ' ' + seller.lastName,
                product: product,
                SFSAdminFeedback: SFSAdminFeedback
            })
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: seller.email,
                    subject: `Product #${product.seafood_sku} is awaiting Review`,
                    html: res, // html body
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
            applyExtend({
                name: seller.firstName + ' ' + seller.lastName,
                product: product
            })
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: seller.email,
                    subject: `Product #${product.seafood_sku} is awaiting Review`,
                    html: res, // html body
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
    sendCartPaidSellerNotified: async (sellerName, cart, items, orderNumber, emailAddress, sellerInvoice, buyerETA) => {

        let buyerExpectedDeliveryDate = items.buyerExpectedDeliveryDate.split("/");
        let buyerDate = new Date(buyerExpectedDeliveryDate[2], buyerExpectedDeliveryDate[0], buyerExpectedDeliveryDate[1]);
        items.buyerExpectedDeliveryDate = await sails.helpers.formatDate(buyerDate);
        items = Object.prototype.toString.call(items) === '[object Object]' ? [items] : items;
        let data = await sails.helpers.getDataOrder.with({
            URL,
            sellerName,
            cart,
            items,
            orderNumber,
            type: "sendCartPaidSellerNotified"
        });
        data.buyerETA = buyerETA;
        email.render('../email_templates/cart_paid_seller_notified',
            applyExtend(data)
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: emailAddress,
                    subject: `Order #${orderNumber} is Placed`,
                    html: res, // html body
                    attachments: [
                        {
                            filename: sellerInvoice,
                            path: `pdf_purchase_order/${sellerInvoice}`
                        }
                    ]
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
        let data = await sails.helpers.getDataOrder.with({
            URL,
            sellerName: cart.buyer.firstName + " " + cart.buyer.lastName,
            cart,
            items,
            orderNumber,
            type: "sendCartPaidBuyerNotified"
        });
        email.render('../email_templates/cart_paid_buyer_notified',
            applyExtend(data)
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: cart.buyer.email,
                    subject: `Order #${orderNumber} is Placed`,
                    html: res, // html body
                    attachments: [
                        {
                            filename: `seafood-invoice-${orderNumber}.pdf`,
                            path: `pdf_invoices/${pdf_invoice}`
                        }
                    ]
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
    sendCartPaidAdminNotified: async (items, cart, orderNumber, stores) => {
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
        let data = await sails.helpers.getDataOrder.with({
            URL,
            sellerName: cart.buyer.firstName + " " + cart.buyer.lastName,
            cart,
            items,
            orderNumber,
            type: "sendCartPaidAdminNotified"
        });
        email.render('../email_templates/cart_paid_admin_notified',
            applyExtend(data)
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: ADMIN_EMAIL,
                    subject: `Order #${orderNumber} is Placed`,
                    html: res, // html body
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
        item = item.typeObject() === 'object' ? [item] : item;
        let paidDateTime = await formatDates(cart.paidDateTime);
        let data = await sails.helpers.getDataOrder.with({
            URL,
            sellerName: name,
            cart,
            items: item,
            orderNumber: cart.orderNumber,
            type: "buyerCancelledOrderBuyer"
        });
        data.paidDateTime = paidDateTime;
        data.store = store
        email.render('../email_templates/buyer_cancelled_order',
            applyExtend(data)
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: cart.buyer.email,
                    subject: `Order #${cart.orderNumber} is Cancelled`,
                    html: res, // html body
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
        item = item.typeObject() === 'object' ? [item] : item;
        let data = await sails.helpers.getDataOrder.with({
            URL,
            sellerName: store.owner.firstName + ' ' + store.owner.lastName,
            cart,
            items: item,
            orderNumber: cart.orderNumber,
            type: "buyerCancelledOrderSeller"
        });
        data.paidDateTime = paidDateTime;
        email.render('../email_templates/buyer_cancelled_order_seller',
            applyExtend(data)
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: store.owner.email,
                    subject: `Order #${cart.orderNumber} is Cancelled`,
                    html: res, // html body
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
        item = item.typeObject() === 'object' ? [item] : item;
        let data = await sails.helpers.getDataOrder.with({
            URL,
            sellerName: "",
            cart,
            items: item,
            orderNumber: cart.orderNumber,
            type: "buyerCancelledOrderAdmin"
        });
        data.paidDateTime = paidDateTime;
        data.store = store;
        email.render('../email_templates/buyer_cancelled_order_admin',
            applyExtend(data)
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: ADMIN_EMAIL,
                    subject: `Order #${cart.orderNumber} is Cancelled`,
                    html: res, // html body
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
        item = item.typeObject() === 'object' ? [item] : item;
        let data = await sails.helpers.getDataOrder.with({
            URL,
            sellerName: name,
            cart,
            items: item,
            orderNumber: cart.orderNumber,
            type: "buyerCancelledOrderAdmin"
        });
        data.paidDateTime = paidDateTime;
        data.store = store;
        email.render('../email_templates/seller_cancelled_order_buyer',
            applyExtend(data)
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: cart.buyer.email,
                    subject: 'Your Order has been cancelled !',
                    html: res, // html body
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
    sellerCancelledOrderSeller: async (name, emailSeller, cart, store, item) => {
        let paidDateTime = await formatDates(cart.paidDateTime);
        item = item.typeObject() === 'object' ? [item] : item;
        let data = await sails.helpers.getDataOrder.with({
            URL,
            sellerName: name,
            cart,
            items: item,
            orderNumber: cart.orderNumber,
            type: "sellerCancelledOrderSeller"
        });
        data.paidDateTime = paidDateTime;
        data.store = store;
        email.render('../email_templates/seller_cancelled_order_seller',
            applyExtend(data)
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: emailSeller,
                    subject: `Order #${cart.orderNumber} is Cancelled`,
                    html: res, // html body
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
    sellerCancelledOrderAdmin: async (name, nameSeller, cart, store, item) => {
        let paidDateTime = await formatDates(cart.paidDateTime);
        item = item.typeObject() === 'object' ? [item] : item;
        let data = await sails.helpers.getDataOrder.with({
            URL,
            sellerName: name,
            cart,
            items: item,
            orderNumber: cart.orderNumber,
            type: "sellerCancelledOrderAdmin"
        });
        data.paidDateTime = paidDateTime;
        data.store = store;
        data.nameSeller = nameSeller;
        email.render('../email_templates/seller_cancelled_order_admin',
            applyExtend(data)
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: ADMIN_EMAIL,
                    subject: `Order #${cart.orderNumber} is Cancelled`,
                    html: res, // html body
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

        
        let sellerExpectedDeliveryDate = item.sellerExpectedDeliveryDate.split("/");
        let sellerDate = new Date(sellerExpectedDeliveryDate[2], sellerExpectedDeliveryDate[0], sellerExpectedDeliveryDate[1]);
        sellerExpectedDeliveryDate = await sails.helpers.formatDate(sellerDate);
        
        let paidDateTime = new Date(cart.paidDateTime);
        cart.paidDateTime = await sails.helpers.formatDate(paidDateTime);
        console.log(cart.paidDateTime);
        paidDateTime = await formatDates(cart.paidDateTime);

        item = item.typeObject() === 'object' ? [item] : item;
        let data = await sails.helpers.getDataOrder.with({
            URL,
            sellerName: name,
            cart,
            items: item,
            orderNumber: cart.orderNumber,
            type: "itemShipped"
        });
        data.paidDateTime = paidDateTime;
        data.store = store;
        data.sellerExpectedDeliveryDate = sellerExpectedDeliveryDate;
        email.render('../email_templates/itemShipped',
            applyExtend(data)
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: cart.buyer.email,
                    subject: `Order #${cart.orderNumber} is being Shipped`,
                    html: res, // html body
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
        let sellerDate = new Date(sellerExpectedDeliveryDate[2], sellerExpectedDeliveryDate[0], sellerExpectedDeliveryDate[1]);
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
        let data = await sails.helpers.getDataOrder.with({
            URL,
            sellerName: "",
            cart,
            items: [item],
            orderNumber: item.orderInvoice,
            type: "sentAdminWarningETA"
        });
        data.sellerName = store.owner.firstName + ' ' + store.owner.lastName;
        data.buyerName = buyer;
        data.sellerExpectedDeliveryDate = sellerExpectedDeliveryDate;
        email.render('../email_templates/admin_warning_ETA',
            applyExtend(data)
        )
            .then(res => {
                transporter.sendMail({
                    from: emailSender,
                    to: ADMIN_EMAIL,
                    subject: `ETA Warning`,
                    html: res
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
