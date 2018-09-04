
module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    logo: {
      type: "string",
      required: false
    },

    name: {
      type: "string",
      required: false
    },

    heroImage: {
      type: "string",
      required: false
    },

    description: {
      type: "string",
      required: false
    },

    location: {
      type: "string",
      required: false
    },

    SFS_SalesOrderForm:{
      type: "string",
      required: false
    },

    SFS_TradeLicense:{
      type: "string",
      required: false
    },

    SFS_ImportCode:{
      type: "string",
      required: false
    },

    SFS_HSCode:{
      type: "string",
      required: false
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    galeryImages:{
      type: "json",
      columnType: "array",
      required: false
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    owner: {
      model: "user",
      required: true
    },

    fish: {
      collection: "fish", 
      via: 'store'
    },

  },

};

