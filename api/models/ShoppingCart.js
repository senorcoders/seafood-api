
module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    uaeTaxes: {
      type: "number",
      required: false
    },
    handlingFees: {
      type: "number",
      required: false
    },
    firstMileCosts: {
      type: "number",
      required: false
    },
    lastMileCost: {
      type: "number",
      required: false
    },
    customs: {
      type: "number",
      required: false
    },
    sfsMargin: {
      type: "number",
      required: false
    },
    shipping: {
      type: "number",
      required: false
    },
    totalOtherFees: {
      type: "number",
      required: false
    },
    total: {
      type: "number",
      required: false
    },

    status: {
      type: "string",
      defaultsTo: "pending"
    },

    paidDateTime: {
      type: "string",
      columnType: "datetime",
      required: false
    },        
    orderNumber: {
      type: "number",
      required: false
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    buyer:{
      model: "user",
      required: true
    },
    items: {
      collection: "itemshopping",
      via: "shoppingCart",
      required: false
    },

    orderStatus: {
      model: "OrderStatus",
      required: false
    }
  },

};

