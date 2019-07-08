module.exports = {


  friendlyName: 'Shipping by city',


  description: 'Get the shipping rate for the city (port of loading) and weight. The shipping rate is returned in AED',


  inputs: {
    city: {
      type: 'string'
    },
    weight: {
      type: 'number'
    }
  },


  exits: {
    outputType:{
      result: "number"
    }
  },


  fn: async function (inputs, exits) {
    try {
      let city = inputs.city;
      let weight = inputs.weight;
      let shippingRate = 0;
      let lastRate = 0, founded = false;
      shipping = await ShippingRates.find( { sellerCity: city } )
          .sort('weight ASC'  );
      
      shipping.map( row =>{
        lastRate = row.cost;
        if( weight < row.weight && !founded ){
	        shippingRate = row.cost;
	        founded = true;
        }
      } );
      if ( !founded ) //if the weight is over the last range of prices we use the last price
	      shippingRate = lastRate;
	  
      return exits.success(shippingRate);
    } catch (e) {
      console.error(e);
      return e;
    }
    // All done.
  }
};

