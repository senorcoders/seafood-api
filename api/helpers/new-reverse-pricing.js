module.exports = {


  friendlyName: 'New reverse pricing',


  description: '',


  inputs: {
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
    let deliveredPricePerKG = inputs.deliveredPricePerKG;
    let weight = inputs.weight; // Weight to query
    let currentAdminCharges = await sails.helpers.currentCharges();
    let variation = await Variations.findOne( { id: inputs.variationID } );
    let in_AED = inputs.in_AED;
    let fish = await Fish.findOne({ where: { id: variation.fish } }).populate('type').populate('store').populate('descriptor');    
    let owner = await User.findOne({ id: fish.store.owner });
    let sfsMargin = 5;
    let is_flat_custom = false;
    let is_domestic = false; // TODO: we had to change this because the name in the database is foreign fish and should be is_domestic

    
    if ( fish.hasOwnProperty( 'foreign_fish' ) )
      is_domestic = fish.foreign_fish; // verificamos si el fish es local

    if (fish.descriptor !== null) {
      sfsMargin = fish.descriptor.cpi;
      
    } else if (fish.type.hasOwnProperty('cpi')) {
      sfsMargin = fish.type.cpi;      
    } 

    //TODO change to use filleted name
    if ( variation.fishPreparation !== '5c93c01465e25a011eefbcc4' && variation.fishPreparation !== '5c4b9b8e23a9a60223553d04' && variation.fishPreparation !== '5c4b9ba023a9a60223553d05' && variation.fishPreparation !== '5c4b9ba523a9a60223553d06' && variation.fishPreparation !== '5c4b9baa23a9a60223553d07' && variation.fishPreparation !== '5c4b9bae23a9a60223553d08') {
      is_flat_custom = true;
      currentAdminCharges['selectedCustoms'] = currentAdminCharges.flatCustoms;  
    }  else {
      currentAdminCharges['selectedCustoms'] = currentAdminCharges.customs;
    }
    if (is_domestic && is_domestic === true) {
      currentAdminCharges.selectedCustoms = 0;
    }
    /*let customsFee = currentAdminCharges.selectedCustoms; //E= Customs rate * A  //Customs in the UAE are 5% on the Seller’s invoice (The seller’s Sale excluding additional Costs
    if (!is_flat_custom) { // if is not flat custom then we use the percentaje;
      customsFee = Number(parseFloat((currentAdminCharges.selectedCustoms / 100) * fishCost).toFixed(2));
    }*/
    
    

    let inventory = await sails.helpers.getEtaStock( inputs.variationID, weight ); // S | here we have the stock record plus available field = quantity - purchased
      if( inventory == 0 ) { // is out of stock
        partnerFreightCost = 0;  
        inventory = { available: 0 };        
        return exits.success( { price: 0 } );
      } else {
        inventory = inventory.available ;
        // todo shipping
        let shippingFees = await sails.helpers.shippingFee(fish, weight, currentAdminCharges); //B
        shippingCost = shippingFees.shippingCost / inventory;
        //deliveredPricePerKG = deliveredPricePerKG  + shippingCost;

        let quantityOrdered = weight;
        let fixedCustoms = Number(parseFloat(( currentAdminCharges.flatCustoms / inventory)).toFixed(2));
        let lastMileCost = Number(parseFloat(( currentAdminCharges.lastMileCost / quantityOrdered)).toFixed(2));
        let pickUpCost = Number(parseFloat(( currentAdminCharges.lastMileCost / inventory)).toFixed(2));
        let fixedHanlingFees = Number(parseFloat(( currentAdminCharges.flatHandlingFees / inventory)).toFixed(2))
        let handlingFees = Number(parseFloat(( currentAdminCharges.handlingFees)).toFixed(2));
        let partnerFreightCost = Number(parseFloat(( currentAdminCharges.partnerFreightCosts / inventory)).toFixed(2));
        let uaeTaxes = Number(parseFloat(( ( currentAdminCharges.uaeTaxes / 100 ) * deliveredPricePerKG)).toFixed(2))
        let totalCost = Number(parseFloat(( fixedCustoms + lastMileCost + pickUpCost + fixedHanlingFees + handlingFees + partnerFreightCost + uaeTaxes)).toFixed(2));
        let sellerPriceWithSFSMargin = Number(parseFloat(( deliveredPricePerKG - totalCost)).toFixed(2))
        let sfsMarginCost = Number(parseFloat(( sellerPriceWithSFSMargin * ( 5 / 100 ))).toFixed(2));
        let price = Number(parseFloat(( sellerPriceWithSFSMargin - sfsMarginCost + shippingCost )).toFixed(2))

        let exchangeRates = currentAdminCharges.exchangeRates;
          if (inputs.in_AED) {
              exchangeRates = 1;
          } else {
            price = Number(parseFloat(price / exchangeRates).toFixed(2));
          }
        let charges = {
          price,
          inventory,
          quantityOrdered,
          fixedCustoms,
          lastMileCost,
          pickUpCost,
          fixedHanlingFees,
          handlingFees,
          partnerFreightCost,
          uaeTaxes,
          totalCost,
          sellerPriceWithSFSMargin,
          sfsMarginCost,
          shippingFees,
          shippingCost,
          currentAdminCharges
        }
        return exits.success( charges );
      }

  }


};

