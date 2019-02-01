/**
 * XeroController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const XeroClient = require('xero-node').AccountingAPIClient;
const XeroConfig = sails.config.xero;



module.exports = {
    
    connect: async ( req, res ) => {
        let orders = await ShoppingCart.find( { status: 'paid'/*, xeroRef: ''*/ }  ).populate( 'buyer' ).populate( 'items' ).sort( 'createdAt DESC' );
        //console.log(orders);      
        //, xeroRef: ''
        if ( !isEmptyObject( orders ) ) {
          let xero = new XeroClient( XeroConfig );
          sails.config.xeroToken.lastRequestToken = await xero.oauth1Client.getRequestToken();
          
          let authorizeUrl = xero.oauth1Client.buildAuthoriseUrl( sails.config.xeroToken.lastRequestToken );
          res.redirect( authorizeUrl );
        } else {
          //res.status( 400 ).json( { message: 'There is no orders to sync with Invoice', error: 'There is no orders to sync with Invoice' } );
          res.redirect('http://platform.seafoodsouq.com/manage-orders');
        }

        
    },

    updateXero: async (req, res ) => {
        try {
            let xero = new XeroClient( XeroConfig );
            let oauth_token = req.param( 'oauth_token' );
            let oauth_verifier = req.param( 'oauth_verifier' );
            let org = req.param( 'org' );
            
            //console.log( sails.config.xeroToken.lastRequestToken );
            //console.log( 'oauth_verifier', oauth_verifier );
            let accessToken = await xero.oauth1Client.swapRequestTokenforAccessToken( sails.config.xeroToken.lastRequestToken, oauth_verifier );

            //console.log( 'accessToken', accessToken );

            //let organization = await xero.organizations.get();
            //console.log( 'organization', organization );

            //let invoices = await xero.invoices.get();
            //console.log( 'invoices', invoices );

          let orders = await ShoppingCart.find( { status: 'paid'/*, xeroRef: ''*/ },  ).populate( 'buyer' ).populate( 'items' ).sort( 'createdAt DESC' );
          let ordersUpdated = 0;
          await Promise.all( orders.map( async ( order ) => {
                //console.log( 'order', order );
                if ( order.hasOwnProperty( 'buyer' ) ) {
                  if( order.buyer !== null ) {
                    //console.log( 'buyer', order.buyer );
                        let contactID = '';
                        if ( order.buyer['contactID'] == undefined || order.buyer['contactID'] == null ){
                            // lets create the contact
                            newContactData = {
                                "Contacts": [
                                  {
                                    "Name": order.buyer.firstName + ' ' + order.buyer.lastName ,
                                    "FirstName": order.buyer.firstName,
                                    "LastName": order.buyer.lastName,
                                    "EmailAddress": order.buyer.email
                                  }
                                ]
                              };
                            console.log( 'newContactData', newContactData );
                            let newContact = await xero.contacts.create( newContactData );
                            console.log( 'newContact', newContact.Contacts[0]/*.ValidationErrors*/ );
                            contactID = newContact.Contacts[0].ContactID;
                            let updatedUser = await User.update( { id: order.buyer.id }, { contactID } ).fetch();
                            // console.log( 'updatedUser', updatedUser );
                            
                        } else {
                            contactID = order.buyer.contactID;
                        }
                        // console.log( 'contactID', contactID );         
                        // console.log('starting invoice');
                        let xeroRef = '';                        
                        if( !order.hasOwnProperty( 'xeroRef' ) ) {
                          //if ( order['xeroRef'] == undefined || order['xeroRef'] == null || order['xeroRef'] == '' || !order.hasOwnProperty( 'xeroRef' ) ) {
                            // items
                            //console.log( 'order.items', order.items );
                            if( !isEmptyObject( order.items ) ) {
                              let lineItemsFish = [];
                              await  Promise.all( order.items.map( async ( item ) => {
                                let itemFish = await Fish.findOne( { id: item.fish } );
                                //console.log( itemFish );
                                await lineItemsFish.push( 
                                  {
                                    "Description": itemFish.name,
                                    "Quantity": item.quantity.value ,
                                    "UnitAmount": ( ( item.price.value * item.quantity.value ) + item.sfsMargin + item.customs + item.uaeTaxes + item.shipping ) / item.quantity.value , 
                                    "AccountCode": "200",
                                    "DiscountRate": "0"
                                  } );

                                let newInvoiceData = {
                                  "Type": "ACCREC",
                                  "Contact": { 
                                    "ContactID": contactID
                                  },
                                  "Reference": order.orderNumber,
                                  "LineAmountTypes": "Exclusive",
                                  "Status": "PAID",
                                  "LineItems": lineItemsFish
                                }

                                if( !isEmptyObject( order.items ) ) {
                                  let newInvoice = await xero.invoices.create( newInvoiceData );
//                                  console.log( 'newInvoice2', newInvoice );
                                    if( newInvoice.Invoices[0].hasOwnProperty('InvoiceNumber') ) { 
                                                              await ShoppingCart.update( { id: order.id }, { xeroRef: newInvoice.Invoices[0].InvoiceNumber } )
                                                              ordersUpdated += 1;
                                    }else {
                                    console.log( 'xero error', newInvoice.Invoices[0] ); 
                                    //console.log( 'error', newInvoiceData );
                                    //console.log( 'newContact', newContact );
                                    }
    
                                } else {
                                  console.log( 'no invoice' );
                                }

                            }
                            
                          //}
                        }

                  } // buyer is null?
                }
            } ) )
	        res.redirect('http://platform.seafoodsouq.com/manage-orders');
        } catch (error) {
            res.status( 400 ).json( error );    
        }
        
    }




};

// This should work both there and elsewhere.
function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}