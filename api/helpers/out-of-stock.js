module.exports = {


  friendlyName: 'Out of stock',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    try {
      let outOfStocks = await FishStock.find( { purchased: { '>': 0 }  } ).populate('variations');
      outOfStockItems = [];
      outOfStocksIds = [];
      await Promise.all( outOfStocks.map( async ( item ) => {
          if( item.purchased >= item.quantity && !outOfStocksIds.includes( item.variations.id ) ) {
              outOfStocksIds.push( item.variations.id )

              let stock = await sails.helpers.getEtaStock( item.variations.id , 1 );

              if( stock === 0 ) {
                  // the item is out of stock
                  let fish;
                  if( !['5c93bff065e25a011eefbcc2', '5c93c00465e25a011eefbcc3'].includes(item.fishPreparation) ) { //is whole fish
                      fish = await Variations.findOne( { id:  item.variations.id } ).populate('fish').populate('fishPreparation').populate('wholeFishWeight');
                  } else {
                      fish = await Variations.findOne( { id:  item.variations.id } ).populate('fish').populate('fishPreparation');
                  }
                  outOfStockItems.push(fish);
              }
              
          }
      } ) );
      console.log( outOfStockItems );
      res = await MailerService.outOfStockNotification( outOfStockItems );
      console.log(outOfStockItems);
      // All done.
      return exits.success();
    } catch (error) {
      return exits.error( error );
    }

  }


};

