var fs = require('fs');
var ejs = require('ejs');
var pdf = require('html-pdf')
var api_url = sails.config.API_URL;
module.exports = {
    buyerInvoice: async ( itemsShopping, cart,OrderNumber, storeName, uaeTaxes) => {
        console.log( 'dir name', __dirname );
        var compiled = await ejs.compile(fs.readFileSync(__dirname + '/../../pdf_templates/invoice.html', 'utf8'));
        console.log( 'cart', cart );
        //console.log( 'itemsShopping', itemsShopping );
        //let today = cart.paidDatetime;
        let today = new Date();
        date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let paidDateTime= date;

        var html = await compiled(
            { 
                invoiceDueDate: paidDateTime,
                invoiceDate: paidDateTime,
                buyerContactName: cart.buyer.firstName + ' ' + cart.buyer.lastName,
                buyerContactPostalAddress: `${cart.buyer.dataExtra.Address}, ${cart.buyer.dataExtra.City}, ${cart.buyer.dataExtra.country}, ${cart.buyer.dataExtra.zipCode}`,
                contactAccountNumber : '100552524900003', 
                InvoiceNumber : 'InvoiceNumber',
                purchase_order_date: paidDateTime,
                delivery_order_date: paidDateTime,
                invoice_number: OrderNumber,
                orderNumber: OrderNumber,
                items: itemsShopping,
                subTotal: cart.subTotal,
                customHandlingFee: cart.totalOtherFees ,
                uaeTaxesFee: cart.uaeTaxes,
                shippingFees : cart.shipping,
                total: cart.total,
                uaeTaxes: uaeTaxes,
                api_url: api_url

            }
        );
        let pdf_name = `invoice-order-${itemsShopping.orderInvoice}.pdf`;
        await pdf.create(html).toFile(`./pdf_invoices/${pdf_name}`, async () => {
            console.log('pdf done', pdf_name);          
            MailerService.sendCartPaidBuyerNotified(itemsShopping, cart,OrderNumber,storeName, `invoice-order-${itemsShopping.orderInvoice}.pdf`, itemsShopping.orderInvoice);
            let pdf_updated_1 = await ShoppingCart.update( { id: cart.id } , { invoice_pdf: pdf_name } );
        } );        

        return pdf_name;

        
    },
    sellerPurchaseOrder: async ( fullName, cart, itemsShopping, orderNumber, sellerAddress, counter, currentExchangeRate ) => {
        var compiled = await ejs.compile(fs.readFileSync(__dirname + '/../../pdf_templates/PurchaseOrder.html', 'utf8'));
        //console.log( 'cart', cart );
        //console.log( 'itemsShopping', itemsShopping );
        //let today = cart.paidDatetime;
        var today = new Date();
        var deliveryDate = new Date();
        deliveryDate.setDate( deliveryDate.getDate() + 1 );
        date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        date2 = deliveryDate.getFullYear()+'-'+(deliveryDate.getMonth()+1)+'-'+deliveryDate.getDate();
        let paidDateTime= date; //new Date().toISOString();
        var html =  await compiled(
            { 
                invoiceDueDate: date2,
                invoiceDate: date2,
                seller_contact_name: fullName,
                seller_contact_address: sellerAddress,      
                contactAccountNumber: '100552524900003',
                invoice_number : 'invoice_number',
                purchase_order_date: paidDateTime,
                delivery_order_date: date2,
                invoice_number: itemsShopping.orderInvoice,
                purchase_number: itemsShopping.purchaseOrder,
                orderNumber: orderNumber,
                items: itemsShopping,
                subTotal: itemsShopping.subTotal,
                total: cart.total,
                currentExchangeRate: currentExchangeRate,
                api_url: api_url

            }
        );
        let pdf_name = `purchase-order-${orderNumber}-${paidDateTime}-${counter}.pdf`;
        await pdf.create(html).toFile(`./pdf_purchase_order/${pdf_name}`, async () => {
            console.log('pdf done', pdf_name);
            MailerService.sendCartPaidSellerNotified(fullName, cart, itemsShopping, orderNumber,itemsShopping.fish.store.owner.email, pdf_name);
            let pdf_updated = await ItemShopping.update( { id: itemsShopping.id } , { po_path: pdf_name } );
        } )        
        return pdf_name;
    },	
    sendPDF: async (req, res, pdf_directory, pdf_name) => {
	    let path = `${sails.config.appPath}/${pdf_directory}/${pdf_name}`;	
        try {
            res.sendFile( path );
	    console.log( path );
        } catch (error) {
            res.serverError( error );
        }
    }

}
