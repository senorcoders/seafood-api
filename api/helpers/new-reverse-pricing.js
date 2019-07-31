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
    
    // todo shipping

    let inventory = await sails.helpers.getEtaStock( inputs.variationID, weight ); // S | here we have the stock record plus available field = quantity - purchased
      if( inventory == 0 ) { // is out of stock
        partnerFreightCost = 0;  
        inventory = { available: 0 };        
        return exits.success( { price: 0 } );
      } else {
        inventory = inventory.available ;
        let quantityOrdered = weight;
        let fixedCustoms = currentAdminCharges.flatCustoms / inventory;
        let lastMileCost = currentAdminCharges.lastMileCost / quantityOrdered;
        let pickUpCost = currentAdminCharges.lastMileCost / inventory;
        let fixedHanlingFees = currentAdminCharges.flatHandlingFees / inventory
        let handlingFees = currentAdminCharges.handlingFees;
        let partnerFreightCost = currentAdminCharges.partnerFreightCosts / inventory;
        let uaeTaxes = ( currentAdminCharges.uaeTaxes / 100 ) * deliveredPricePerKG
        let totalCost = fixedCustoms + lastMileCost + pickUpCost + fixedHanlingFees + handlingFees + partnerFreightCost + uaeTaxes;
        let sellerPriceWithSFSMargin = deliveredPricePerKG - totalCost
        let sfsMarginCost = sellerPriceWithSFSMargin * ( 5 / 100 );
        let price = sellerPriceWithSFSMargin - sfsMarginCost

        let exchangeRates = currentAdminCharges.exchangeRates;
          if (inputs.in_AED) {
              exchangeRates = 1;
          } else {
            price = Number(parseFloat(price / exchangeRates).toFixed(2));
          }
        let charges = {
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
          price,
          currentAdminCharges
        }
        return exits.success( charges );
      }

  }


};

