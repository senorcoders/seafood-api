module.exports = {


  friendlyName: 'Get eta stock',


  description: '',


  inputs: {
    variation: {
      type: "string",
      required: true
    },
    quantity: {
      type: "number",
      required: true
    },
  },


  exits: {

    success: {
      outputFriendlyName: 'Eta stock',
      outputType: 'ref'
    },

  },


  fn: async function (inputs, exits) {
    let variationID = inputs.variation; //variation id
    let quantity = inputs.quantity; // quantity to add to the cart
   
    let unixNow = Math.floor(new Date());
    let stocks = await FishStock.find().where({
        "date": { '>': unixNow },
        "variations": variationID        
    } ).sort( [{ date: 'ASC' }] );

    //checking the query    
    stocks.map( stock => {
      if (stock.quantity - stock.purchased >= quantity) {
        stock.available = stock.quantity - stock.purchased;
        return exits.success( stock );
      }
    } )


    // Send back the result through the success exit.
    return exits.success(0);
    
  }

};

