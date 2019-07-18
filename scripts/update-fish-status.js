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


  friendlyName: 'Update fish status',


  description: '',


  fn: async function () {

    sails.log('Running custom shell script... (`sails run update-fish-status`)');
    result = await sails.helpers.updateFishStatus.with({
      id: 0,
      is_cron: true
    });
    sails.log( result )

  }


};

