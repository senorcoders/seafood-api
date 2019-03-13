module.exports = {


  friendlyName: 'Fish pricing',


  description: 'Get all pricing for a fish',


  inputs: {
    id: {
      type: "string",
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
    let id = inputs.id; //Fish ID 
    let weight = inputs.weight; // Weight to query
    let currentAdminCharges = inputs.currentCharges; // charges manages by admin

    // getting the fish information
    let fish = await Fish.findOne( { where: { id: id } } ).populate( 'type' ).populate( 'store' );   
    let fishPrice = Number( parseFloat( fish.price.value ) );
    
    // getting shipping rate from that city
    shipping = await sails.helpers.shippingByCity( fish.city, weight );
    if( currentAdminCharges === undefined ){                
        //currentAdminCharges = await sails.helpers.currentCharges();
    }

    exchangeRates   = currentAdminCharges.exchangeRates;
    sfsMargin       = fish.type.sfsMargin;
    
    // getting fish shipping fee
    let shippingFees = await sails.helpers.shippingFee( fish, weight, currentAdminCharges );

    //calculate cost using seafoodsouq formula
    let fishCost = (fishPrice * weight); // A

    let sfsMarginCost = (sfsMargin / 100) * fishCost; // D= SFS Fee A //calculated from the total amount of the the product sales excluding shipping fees and taxes.
    let customsFee    = ( currentAdminCharges.customs / 100 )  * fishCost; //E= Customs rate * A  //Customs in the UAE are 5% on the Seller’s invoice (The seller’s Sale excluding additional Costs
    let uaeTaxesFee   = ( fishCost + shippingFees.shippingCost + customsFee + sfsMarginCost  ) * ( currentAdminCharges.uaeTaxes  / 100 ); //F = (A+C+D+E) Tax
    let finalPrice    = fishCost + shippingFees.shippingCost + sfsMarginCost + customsFee + uaeTaxesFee ;

    //returning json
    let charges = {
        price: Number(parseFloat(fishPrice).toFixed(2)),
        weight: Number(parseFloat(weight).toFixed(2)),
        sfsMargin: Number(parseFloat(sfsMargin).toFixed(2)),
        shipping: Number(parseFloat(shipping).toFixed(2)),
        customs: Number(parseFloat(currentAdminCharges.customs).toFixed(2)),
        uaeTaxes: Number(parseFloat(currentAdminCharges.uaeTaxes).toFixed(2)),
        fishCost: Number(parseFloat(fishCost).toFixed(2)),
        firstMileCost: Number(parseFloat(shippingFees.firstMileCost).toFixed(2)),
        lastMileCost: Number(parseFloat(currentAdminCharges.lastMileCost).toFixed(2)),
        shippingFee: Number(parseFloat(shippingFees.shippingFee).toFixed(2)),
        customsFee: Number(parseFloat(customsFee).toFixed(2)),
        handlingFee: Number(parseFloat(shippingFees.handlingFee).toFixed(2)),
        firstMileFee: Number(parseFloat(shippingFees.firstMileFee).toFixed(2)),
        shippingCost: {
            cost: Number(parseFloat(shippingFees.shippingCost).toFixed(2)),
            include: 'first mile cost + shipping fee + handling fee + last mile cost'
        },
        sfsMarginCost: Number(parseFloat(sfsMarginCost).toFixed(2)),
        uaeTaxesFee: Number(parseFloat(uaeTaxesFee).toFixed(2)),
        finalPrice: Number(parseFloat(finalPrice).toFixed(2)) 
    }

    // All done.
    return exits.success( charges );

  }


};

