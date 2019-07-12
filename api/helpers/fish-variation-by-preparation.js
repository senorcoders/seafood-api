module.exports = {


  friendlyName: 'Fish variation by preparation',


  description: '',


  inputs: {
    type: {
      type: "string",
      required: true
    },
    preparation: {
      type: "string",
      required: true
    },
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    //try {
      let type = inputs.type,
      preparation = inputs.preparation;

      let fishPreparation = await FishVariations.findOne( { fishType: type, fishPreparation: preparation } ).populate('fishPreparation').populate('fishType');

      if ( fishPreparation ) {
          let variations = [];
          await Promise.all( fishPreparation.variations.map( async variation => {
            // get label for each variation
            let variationInfo = await WholeFishWeight.findOne({ id: variation });
            variations.push(variationInfo);
          } ) )
          fishPreparation['variationInfo'] = variations;

          return exits.success(fishPreparation);
      } else {
        return exits.success( null );
      }
    /*} catch (error) {
      return { message: "something happend", error: error } ;
    }*/
  }


};

