
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
    }

  }

};

