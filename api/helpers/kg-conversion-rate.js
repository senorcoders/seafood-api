module.exports = {


  friendlyName: 'Kg conversion rate',


  description: '',


  inputs: {
    fish: {
      type: "json",
      required: true
    },
    weight: {
      type: "number",
      required: true
    }
  },


  exits: {

    outputType:{
      result: "number"
    }

  },


  fn: async function (inputs, exits) {
    // TODO
    let variation = await Variations.find( { fish: inputs.fish.id } ).limit(1);
    let kgConversionRate = 0;
    
    if( !variation.hasOwnProperty('kgConversionRate') || variation.kgConversionRate == undefined || variation.kgConversionRate == null ) {
      let fishType = inputs.fish.type;
      if( inputs.fish.type.hasOwnProperty( 'id' ) ) {
        fishType = inputs.fish.type.id;
      }
      let fishInformation = await FishType.findOne( { id: fishType } );
      let unitOfMeasure = await UnitOfMeasure.findOne( { name: fishInformation.unitOfMeasure, isActive: true } )
      kgConversionRate = unitOfMeasure.kgConversionRate;
    } else {
      kgConversionRate = variation.kgConversionRate;
    }
    

    let weightInKG = inputs.weight * kgConversionRate;

    return exits.success( weightInKG );
  }


};
