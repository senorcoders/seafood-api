
module.exports = {


  friendlyName: 'Get data',


  description: 'get data for value unique',


  inputs: {
    name: {
      type: 'string',
      required: true
    }
  },


  exits: {
    success: {
      responseType: 'json',
    },

    badCombo: {
      responseType: 'not found'
    },
  },


  fn: async function (inputs, exits) {
    try {
      let names = inputs.name.replace(/['"]/g, '').split(','), data = {};
      for (let name of names) {
        //to validated the names 
        let indicates = name.split('.');
        if (indicates.length === 0 || sails.models[indicates[0]] === undefined)
          continue;
        else if (indicates.length === 1) //if is just name so get all data of model
          data[indicates[0]] = await sails.models[indicates[0]].find();
        else if (indicates.length === 2){ //if is length get only one document
          data[indicates[0]] = {
            [indicates[1]]: await sails.models[indicates[0]].findOne({ identifier: indicates[1] })
          };
        }else if (indicates.length > 2) { //major than 2 get more one
          data[indicates[0]] = {};
          for (let i = 1; i < indicates.length; i++) {
            data[indicates[0]][indicates[i]] = await sails.models[indicates[0]].findOne({ identifier: indicates[i] })
          }
        }
      }
      // All done.
      return exits.success(data);
    }
    catch (e) {
      console.error(e);
      exits.badCombo(e);
    }

  }


};
