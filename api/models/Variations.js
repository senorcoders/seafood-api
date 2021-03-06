/**
 * Variations.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝    
    sku: {
      type: 'string',
      unique: true,
      required: true
    },
    stockStatus: {
      type: "string",
      description: `
        inStock
        outOfStock,        
      `
    },
    minDeliveryUnixDate: {
      type: 'number',
      required: false
    },
    orderStatus: {
      type: 'number',
      required: false
    },
    kgConversionRate: {
      type: 'number',
      required: false
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    fishPreparation: {
      model: "fishPreparation",
      required: true
    },
    parentFishPreparation: {
      model: "fishPreparation",
      required: true
    },
    fish: {
      model: "fish",
      required: true
    },
    wholeFishWeight: {
      model: "wholeFishWeight",
      required: false
    }
  },

};

