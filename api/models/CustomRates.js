/**
 * CustomRates.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    mode: {
      type: "string",
      required: true,
      description: `
      two types: - percent
                 - flat rate
      `
    },

    value: {
      type: "json",
      columnType: "double",
      required: true
    },

    id_concatenated: {
      type: "string",
      required: true,
      unique: true,
      description: "is the id of category + specie + subspecie + preparation, for not repeat"
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    category:{
      model: 'fishtype',
      required: true
    },

    specie: {
      model: 'fishtype',
      required: true
    },

    subspecie: {
      model: 'fishtype',
      required: true
    },

    preparation:{
      model: "fishpreparation",
      required: false
    },

    
  },

  beforeCreate: async function(rate, next){
    try{
      rate.id_concatenated = rate.category+ "."+ rate.specie+ "."+ rate.subspecie+ "."+ rate.preparation;
    }
    catch(e){
      return next(e);
    }
    next();
  }

};

