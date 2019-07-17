module.exports = {


  friendlyName: 'Current charges',


  description: 'Get Current charges manage by the admin',


  inputs: {

  },


  exits: {
    outputType:{
      result: "ref"
    }
  },


  fn: async function (inputs, exits) {
    try {
      
      let types = [ 'flatCustoms', 'customs', 'lastMileCost', 'uaeTaxes', 'handlingFees', 'flatHandlingFees', 'exchangeRates', 'exchangeRateCommission', 'pickupLogistics', 'partnerFreightCosts' ];

      let data = {};
      await Promise.all( types.map( async ( type ) => {
        let value = await PricingCharges.find( { where: { "type": type } } ).sort( 'createdAt DESC' );
        if( value.length > 0 )
          data[type] = value[0].price;
        else
          data[type] = 0;
      })
      )
      return exits.success(data);
    } catch (error) {
        return  exits.success(error);
    }
   
  }


};

