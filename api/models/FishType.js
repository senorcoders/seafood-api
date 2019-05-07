
module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {
      type: 'string',
      required: true,
      maxLength: 130,
      unique: true
    },

    description: {
      type: 'string',
      required: true
    },

    images: {
      type: "json",
      columnType: "array",
      required: false
    },

    sfsMargin: {
      type: 'number',
      example: '5 this are pecentage',
      description: 'used for exworks margin'
    },

    level: {
      type: 'number',
      required: false,
      example: '0 , 1 , 2, 4'
    },

    parent: {
      type: 'string',
      required: false
    },

    totalFishes: {
      type: 'number',
      defaultsTo : 0
    },

    exworks: {
      type: 'number',
      required: false
    },
    cpi: {
      type: 'number',
      required: false
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    childsTypes: {
      collection: "parenttype",
      via: "parent"
    },

    parentsTypes: {
      collection: "parenttype",
      via: "child"
    }

  },

};

