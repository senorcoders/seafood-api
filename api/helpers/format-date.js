module.exports = {


  friendlyName: 'Format date',


  description: '',


  inputs: {
    date:{
      type: "ref",
      required: true
    }
  },


  exits: {
    outputType:{
      result: "ref"
    }
  },


  fn: async function (inputs, exits) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    let formatDate = inputs.date.toLocaleDateString("en-US", options);    
    // All done.
    return exits.success(formatDate);

  }


};

