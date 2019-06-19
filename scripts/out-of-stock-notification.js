catchErrors = callback => {

  return async function (req, res) {
      try {
          await callback(req, res);
      }
      catch (e) {
          sails.log("error", e);
          console.error(e);
          res.serverError();
      }
  }

};
Object.defineProperty(Object.prototype, 'typeObject', {
  value: function() {
      return Object.prototype.toString.call(this).split(" ")[1].replace("]", "").toLowerCase();
  },
  enumerable: false
});

Object.defineProperty(Object.prototype, 'isDefined', {
  value: function(attribute) {
      return this[attribute] !== null && this[attribute] !== undefined;
  },
  enumerable: false
});

module.exports = {


  friendlyName: 'Out of stock notification',


  description: '',


  inputs: {

  },


  fn: async function (inputs, exits) {

    sails.log('Running custom shell script... (`out-of-stock-notification`)');    
    await sails.helpers.outOfStock();
      return exits.success( { "message": "ok" } );
    
    // All done.

  }


};

