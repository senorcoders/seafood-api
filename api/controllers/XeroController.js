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
//                            console.log( 'updatedUser', updatedUser );
                            
                        } else {
                            contactID = order.buyer.contactID;
                        }
  //                      console.log( 'contactID', contactID );         
//			console.log('starting invoice');
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
                                  /*  
                                  //item.quantity.value,
                                  //item.price.value,
                                  Shipment 1 of 1 sold by <%= store.name %> <%= item.fish.name %> <%= (item.price.value* item.quantity.value).toFixed(2) %> AED                                
                                  <% let shipping=item.shipping,otherTaxes=item.sfsMargin+item.customs+item.uaeTaxes; %>
                                  <% let subtotal=shipping+otherTaxes+(item.price.value*item.quantity.value); %>
                                  Shipping Fees <%= otherTaxes.toFixed(2) %> AED
                                  Sub Total<%= subtotal.toFixed(2) %> AED
                                  */
                                } ) );
  //                              console.log( 'newInvoiceData.LineItems', lineItemsFish );                                
                                //newInvoiceData['lineItems'] = lineItemsFish;

                                let newInvoiceData = {
                                  "Type": "ACCREC",
                                  "Contact": { 
                                    "ContactID": contactID
                                  },
                                  "Reference": order.orderNumber,
                                  "LineAmountTypes": "Exclusive",
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

            
            //res.status( 200 ).json( { 'ordersUpdated': ordersUpdated } );
	     res.redirect('http://platform.seafoodsouq.com/manage-orders');
            /*await Xero.create( {
                xeroAuth: {
                    oauthToken,
                    oauthVerifier,
                    org
                }
            } )*/
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

/*
{
  "Type": "ACCREC",
  "Contact": { 
    "ContactID": "eaa28f49-6028-4b6e-bb12-d8f6278073fc" 
  },
  "Date": "\/Date(1518685950940+0000)\/",
  "DueDate": "\/Date(1518685950940+0000)\/",
  "DateString": "2009-05-27T00:00:00",
  "DueDateString": "2009-06-06T00:00:00",
  "LineAmountTypes": "Exclusive",
  "LineItems": [
    {
      "Description": "Consulting services as agreed (20% off standard rate)",
      "Quantity": "10",
      "UnitAmount": "100.00",
      "AccountCode": "200",
      "DiscountRate": "20"
    }
  ]
}


{
  "Contacts": [
    {
      "Name": "24 locks",
      "FirstName": "Ben",
      "LastName": "Bowden",
      "EmailAddress": "ben.bowden@24locks.com",
      "ContactPersons": [
        {
          "FirstName": "John",
          "LastName": "Smith",
          "EmailAddress": "john.smith@24locks.com",
          "IncludeInEmails": "true"
        }
      ]
    }
  ]
}


Shipment 1 of 1 sold by <%= store.name %> <%= item.fish.name %> <%= (item.price.value* item.quantity.value).toFixed(2) %> AED
                                
<% let shipping=item.shipping,otherTaxes=item.sfsMargin+item.customs+item.uaeTaxes; %>
<% let subtotal=shipping+otherTaxes+(item.price.value*item.quantity.value); %>
Shipping Fees <%= otherTaxes.toFixed(2) %> AED
Sub Total<%= subtotal.toFixed(2) %> AED
*/
