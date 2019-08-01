/*
// With named parameters:
          await sails.helpers.reversePrice.with({
            variationID: …,
            weight: …,
            deliveredPricePerKG
          });
*/
// tomar en cuenta diferencia anterior para cambiar de direccion
module.exports = {


  friendlyName: 'Reverse price',


  description: '',


  inputs: {
    fishID: {
      type: 'string'
    },
    variationID: {
      type: "string",
      required: true
    },
    weight: {
      type: "number",
      required: true
    },
    deliveredPricePerKG: {
      type: "number",
      required: true
    },
    count: {
      type: "number"
    },
    tryingWith: {
      type: "number"
    },
    in_AED: {
      type: 'boolean',
      required: true
    }
  },


  exits: {

    outputType: {
      result: "json"
    }

  },

  

  fn: async function (inputs, exits) {
    // TODO
    inputs.count = inputs.count + 1;
    let fishID = inputs.fishID; //Fish ID 
    let weight = inputs.weight; // Weight to query
    let currentAdminCharges = await sails.helpers.currentCharges();
    let fish = await Fish.findOne({ where: { id: fishID } }).populate('type').populate('store').populate('descriptor');    
    //inputs.tryingWith = Number(parseFloat( inputs.tryingWith).toFixed(2));
    
    shipping = await sails.helpers.shippingByCity(fish.city, weight);
    
    let charges = await sails.helpers.fishPricing(fishID, weight, currentAdminCharges, inputs.variationID, inputs.in_AED, inputs.tryingWith, shipping, fish);
    
    let deliveryPricePerKGFound = charges.finalPrice / charges.weight;

    let diff = Math.abs(inputs.deliveredPricePerKG - deliveryPricePerKGFound );
    console.log( 'diff', { diff: Math.abs(inputs.deliveredPricePerKG - deliveryPricePerKGFound ), try: inputs.tryingWith, count: inputs.count } )
    if( diff >= 0.0199 ) {
      if ( inputs.count > 3000 ) {
        return exits.success( result  );
        //return exits.success( { "message": "not found" }  );
      }
      let converion =  inputs.tryingWith / 2;
      if ( diff < 1 ) {
        converion = 0.01
      } else if ( diff < 0.1 ) {
        converion = 0.001
      } else if ( diff < 0.01 ) {
        converion = 0.0001
      } else if ( diff < 0.001 ) {
        converion = 0.00001
      } else if ( diff < 0.0001 ) {
        converion = 0.000001
      } 
      if ( inputs.deliveredPricePerKG > deliveryPricePerKGFound ) {
        inputs.tryingWith = inputs.tryingWith + converion //( inputs.tryingWith / ( 2 + converion ) )
      } else {
        inputs.tryingWith = inputs.tryingWith - converion // ( inputs.tryingWith / ( 2 + converion ) )
      }
    
      result = await sails.helpers.reversePrice.with({
        fishID: fishID,
        variationID: inputs.variationID, 
        weight: inputs.weight, 
        deliveredPricePerKG: inputs.deliveredPricePerKG, 
        count: inputs.count, 
        tryingWith: inputs.tryingWith,
        in_AED: inputs.in_AED
       });

       return exits.success( result  );
    } else {
      let exchangeRates = currentAdminCharges.exchangeRates;
      if (inputs.in_AED) {
          exchangeRates = 1;
      } else {
        charges.price = Number(parseFloat(charges.price / exchangeRates).toFixed(2));
      }
      return exits.success( charges );
    }

    
    

    // All done.
  },

};

