var fs = require('fs');
var ejs = require('ejs');
var pdf = require('html-pdf')

module.exports = {
    buyerInvoice: async ( itemsShopping, cart,OrderNumber, storeName ) => {
        console.log( 'dir name', __dirname );
        var compiled = await ejs.compile(fs.readFileSync(__dirname + '/../../pdf_templates/invoice.html', 'utf8'));
        console.log( 'cart', cart );
        //console.log( 'itemsShopping', itemsShopping );
        let today = cart.paidDatetime;
        var html = compiled(
            { 
                invoiceDueDate: today,
                invoiceDate: today,
                buyerContactName: cart.buyer.firstName + ' ' + cart.buyer.lastName,
                buyerContactPostalAddress: `${cart.buyer.dataExtra.Address}, ${cart.buyer.dataExtra.City}, ${cart.buyer.dataExtra.country}, ${cart.buyer.dataExtra.zipCode}`,
                contactAccountNumber : 'contactAccountNumber', 
                InvoiceNumber : 'InvoiceNumber',
                purchase_order_date: cart.paidDatetime,
                delivery_order_date: cart.paidDatetime,
                invoice_number: cart.xeroRef,
                orderNumber: cart.OrderNumber,
                items: itemsShopping,
                subtotal: cart.subtotal,
                total: cart.total

            }
        );
        let pdf_name = `invoice-order-${OrderNumber}-${today}.pdf`;
        await pdf.create(html).toFile(`./pdf_invoices/${pdf_name}`, () => {
            console.log('pdf done');
        } );

        return pdf_name;
    },
    sellerPurchaseOrder: async ( fullName, cart, itemsShopping, orderNumber, sellerAddress, counter ) => {
        var compiled = await ejs.compile(fs.readFileSync(__dirname + '/../../pdf_templates/PurchaseOrder.html', 'utf8'));
        console.log( 'cart', cart );
        //console.log( 'itemsShopping', itemsShopping );
        let today = cart.paidDatetime;
        var html = compiled(
            { 
                invoiceDueDate: today,
                invoiceDate: today,
                seller_contact_name: fullName,
                seller_contact_address: sellerAddress,
                purchase_order_date : cart.paidDatetime,        
                ContactAccountNumber: 'ContactAccountNumber',
                invoice_number : 'invoice_number',
                purchase_order_date: cart.paidDatetime,
                delivery_order_date: cart.paidDatetime,
                invoice_number: cart.xeroRef,
                orderNumber: cart.OrderNumber,
                items: itemsShopping,
                subtotal: cart.subtotal,
                total: cart.total

            }
        );
        let pdf_name = `purchase-order-${orderNumber}-${today}-${counter}.pdf`;
        await pdf.create(html).toFile(`./pdf_purchase_order/${pdf_name}`, () => {
            console.log('pdf done');
        } );

        return pdf_name;
    },
	testPDF: () => {
        console.log( 'dir name', __dirname );
        var compiled = ejs.compile(fs.readFileSync(__dirname + '/../../pdf_templates/template.html', 'utf8'));
        var html = compiled({ title : 'EJS-EJS ', text : 'Hello, World!' });

        pdf.create(html).toFile('./pdf_invoices/result.pdf',() => {
            console.log('pdf done')
        })
    }
}