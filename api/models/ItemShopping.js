
module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    quantity: {
      type: "json",
      required: true
    },

    price: {
      type: 'json',
      required: true,
      example: `
        price: {
          type: "$",
          value: 3,
          description: $2 for pack
        }
        `
    },

    shippingFiles: {
      type: 'json',
      required: false
    },

    shippingStatus: {
      type: "string",
      required: false
    },

    trackingID:{
      type: "string",
      required: false
    },

    trackingFile:{
      type: "string",
      required: false
    },

    currentCharges: {
      type: 'json',
      required: false
    },
    shipping: {
      type: 'number',
      required: false
    },
    handling: {
      type: 'number',
      required: false
    },
    sfsMargin: { 
      type: 'number',
      required: false
    },
    customs: {
      type: 'number',
      required: false
    },
    uaeTaxes: {
      type: 'number',
      required: false
    },
    shippedAt: {
      type: 'number',
      required: false
    },
    arrivedAt: {
      type: 'number',
      required: false
    },
    outForDeliveryAt:{
      type: 'number',
      required: false
    },
    deliveredAt:{
      type: 'number',
      required: false
    },    
    cancelAt: {
      type: 'number',
      required: false
    },
    repayedAt: {
      type: 'number',
      required: false
    },
    updateInfo: {
      type: 'json',
      required: false
    },
    repayedRef: {
      type: 'string',
      required: false
    },
    buyerExpectedDeliveryDate: {
      type: 'string',
      required: false
    },
    sellerExpectedDeliveryDate: {
      type: 'string',
      required: false
    },
    adminNumberOfDaysForDelivery: {
      type: 'number',
      required: false
    },
    po_pdf: {
      type: 'string',
      required: false
    },
    orderInvoice: {
      type: 'number',
      required: false,
    },
    purchaseOrder: {
      type: "number",
      required: false
    },
    subtotal: {
      type: "number",
      required: false
    },
    total: {
      type: "number",
      required: false
    }

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    fish: {
      model: "fish",
      required: true
    },

    shoppingCart: {
      model: "shoppingcart",
      required: true
    },

    status: {
      model: "OrderStatus",
      required: false
    },
    paymentStatus: {
      model: "OrderStatus",
      required: false
    }

  }

};

