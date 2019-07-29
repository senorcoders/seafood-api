const isLogged = require("./../policies/is-logged-in");
module.exports = {


  friendlyName: 'Is authenticated',


  description: '',


  inputs: {
    req: {
      type: 'ref',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    //for delete refence
    let auth = await new Promise((resolve, reject) => {
      let res = {
        send: function () { resolve(false) }, status: console.log
      };
      //for re-use function for validate 
      isLogged(inputs.req, res, function () { resolve(true); });
    });

    exits.success(auth);
  }


};

