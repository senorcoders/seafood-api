

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {
      type: "string",
      required: true
    },

    description: {
      type: "string",
      required: true
    },

    country: {
      type: "string",
      required: true
    },

    processingCountry: {
      type: "string",
      required: false
    },

    city: {
      type: "string"
    },

    quality: {
      type: 'string',
      maxLength: 200,
      required: true
    },

    minimumOrder:{
      type: "number",
      required: false
    },

    raised: {
      type: "string",
      required: false
    },

    preparation: {
      type: "string", 
      required: false
    },

    treatment: {
      type: "string",
      required: false
    },

    wholeFishWeight: {
      type: "string",
      required: false
    }
    
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    weight: {
      type: 'json',
      required: true,
      example: `
        weight: {
          type: "pounds",
          value: 2
        }
      `
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

    imagePrimary: {
      type: "json",
      required: false
    },

    images: {
      type: 'json', 
      columnType: 'array',
      required: false
    },

    seller_sku: {
      type: 'string',
      maxLength: 200,
    },
    seafood_sku: {
      type: 'string',
      maxLength: 200,
    },
    SFSAdminFeedback:{
      type:'string'
    },
    stock: {
      type: 'number',
      required: false
    },
    waterLostRate: {
      type: 'string',
      required: false
    },
    mortalityRate: {
      type: 'number',
      required: false
    },
    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    store: {
      model: "store",
      required: false
    },

    type: {
      model: 'fishtype',
      required: true
    },

    descriptor: {
      model: 'fishtype',
      required: false
    },

    shoppingCart: {
      collection: "itemshopping",
      via: "fish",
      required: false
    },

    status: {
      model: "FishStatus",
      required: false
    }

  },

};

