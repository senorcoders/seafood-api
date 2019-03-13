module.exports = {


  friendlyName: 'Shipping fee',


  description: 'Calculate shippgin fee',


  inputs: {
    fish: {
      type: "ref",
      required: true
    },
    weight: {
      type: "number",
      required: true
    },
    currentCharges: {
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

    let owner = await User.findOne( { id: inputs.fish.store.owner } ) ;
    let firstMileCost = Number( parseFloat( owner.firstMileCost ) ); //get owner fee
    let firstMileFee = firstMileCost * inputs.weight * inputs.fishPrice;

    // getting shipping rate from that city
    shipping = await sails.helpers.shippingByCity( inputs.fish.city, inputs.weight );

    let shippingFee   = shipping * inputs.weight; //b1
    let handlingFee   = inputs.currentCharges.handlingFees * inputs.weight; //b2 //are 3 AED/KG to get the shipment released from Customs.
    let shippingCost  = firstMileFee + shippingFee + handlingFee + inputs.currentCharges.lastMileCost; //C = first mile cost + b1 + b2 + last mile cost
    
    let result = { shippingFee, handlingFee, shippingCost, firstMileFee, firstMileCost }

    // All done.
    return exits.success( result );

  }


};

