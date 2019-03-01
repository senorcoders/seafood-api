
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
    companyType : {
      type: "string",
      required: false
    },
    Address : {
      type: "string",
      required: false
    },
    City : {
      type: "string",
      required: false
    },
    ContactNumber : {
      type: "string",
      required: false
    },
    CorporateBankAccountNumber : {
      type: "string",
      required: false
    },
    CurrencyofTrade : {
      type: "string",
      required: false
    },
    FoodSafetyCertificacteNumber : {
      type: "string",
      required: false
    },
    ProductInterestedSelling : {
      type: "string",
      required: false
    },
    TradeBrandName : {
      type: "string",
      required: false
    },
    TradeLicenseNumber : {
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

