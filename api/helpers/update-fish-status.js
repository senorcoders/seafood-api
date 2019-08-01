module.exports = {


  friendlyName: 'Update fish status',


  description: '',


  inputs: {
    id: {
      type: 'string',
      required: false
    },
    is_cron: {
      type: 'boolean',
      required: true
    }
  },


  exits: {

    success: {
      result: "ref",
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    let status = await FishStatus.findOne( { status: 'Approved' } );
    var today = new Date();
    let unixNow = Math.floor(today);

    let fishWhere = {
      status: status.id
    }
    if( !inputs.is_cron ){
      fishWhere['id'] = inputs.id
    }
    
    let fishes = await Fish.find( fishWhere );

    let result = await Promise.all( fishes.map( async ( fish ) => {
      
      let fishVariations =  await Variations.find( { fish: fish.id } );
      let is_inStock = false;
      let currentMinDate = new Date();
      let coomingSoonDate = new Date();
      currentMinDate = currentMinDate.setDate( currentMinDate.getDate() +150 );
      var outOfStockDate = new Date();
      outOfStockDate.setDate(today.getDate() + 150);
      coomingSoonDate.setDate(today.getDate() + 200);
      await Promise.all( fishVariations.map( async ( variation ) => {
        // looking for delivery date        
        let inventory = await FishStock.find().where({
          "date": { '>': unixNow },
          "variations": variation.id
        }).sort('date ASC');

        if( inventory.length > 0 && fish.minimumOrder > 0) {
          let dateParts = inventory[0].short_date.split('/');
          let variationMinDate = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
          if( variationMinDate < currentMinDate )
            currentMinDate = variationMinDate;

          let fishStock = await sails.helpers.getEtaStock( variation.id, fish.minimumOrder);
      
          if( fishStock !== 0 ) {
            is_inStock = true;
            await Variations.update( { id: variation.id }, { minDeliveryUnixDate: currentMinDate.getTime() / 1000, stockStatus: 'inStock', orderStatus: 1 } )
          } else {
            await Variations.update( { id: variation.id }, { minDeliveryUnixDate: outOfStockDate.getTime() / 1000, stockStatus: 'outOfStock', orderStatus: 2 } )
          }
        } else {
          await Variations.update( { id: variation.id }, { minDeliveryUnixDate: outOfStockDate.getTime() / 1000, stockStatus: 'outOfStock', orderStatus: 2 } )
        }

        
       
      } ) )
      //currentMinDate = Math.floor(currentMinDate.getTime() / 1000;
      if ( fish.cooming_soon === true ) {
        await Fish.update( { id: fish.id }, { minDeliveryUnixDate: coomingSoonDate.getTime() / 1000 , stockStatus: 'comingSoon', orderStatus: 3 })
      } else if( is_inStock ) {
        await Fish.update( { id: fish.id }, { minDeliveryUnixDate: currentMinDate.getTime() / 1000, stockStatus: 'inStock', orderStatus: 1 })
      }
      else{
        await Fish.update( { id: fish.id }, { minDeliveryUnixDate: outOfStockDate.getTime() / 1000, stockStatus: 'outOfStock', orderStatus: 2 } )

      }
       
    } ) )
    return exits.success(result);
  }


};
