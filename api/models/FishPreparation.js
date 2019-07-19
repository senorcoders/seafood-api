/**
 * FishPreparation.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {
      type: "string",
      required: true
    },
    isTrimming: {
      type: "boolean",
      defaultsTo: false
    },
    defaultProccessingParts: {
      type: 'json',
      required: false
    },
    prepType: {
      type: 'json',
      required: false
    },
    parent: {
      type: 'string',
      required: false
    },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

  beforeCreate: async (fishpreparation, next) => {
    try {
      let identifier = fishpreparation.name.toLowerCase().replace(/[/()]/g, '').replace(/ /g, '_');
      let counts = await FishPreparation.count({ identifier });
      if (counts > 0)
        identifier += '_' + counts;
      fishpreparation.identifier = identifier;
      next();
    }
    catch (e) {
      console.error(e);
      next(e);
    }
  }

};

