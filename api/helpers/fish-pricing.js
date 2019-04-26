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
    },
    variation_id: {
      type: 'string',
      required: false
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

    let variation = await VariationPrices.find().where({
      'min': { "<": inputs.weight },
      'max': { ">": inputs.weight },
      variation: inputs.variation_id
    }).limit(1);

   variation = variation[0];

    if( variation === undefined ) {
      // when there is no variation we are going to use the last range of price      
      await VariationPrices.find( { variation: inputs.variation_id } )
          .sort( [{ max: 'ASC' }] )
          .then( 
              result => {
                  var BreakException = {};
                  try {
                      let resultSize = Object.keys(result).length ;
                      let resultCount = 0;
                      result.forEach( row => {
                          resultCount +=1 ;
                          if( resultCount == resultSize ){
                              variation = row;
                              throw BreakException;
                          }                          
                      });                      
                  } catch (e) {
                      
                  return false;                  
                  }
                  
              },
              error => {
                  console.log(error);
              }
          )

    } 
    let fishPrice = Number( parseFloat( variation.price ) );    
    
    // getting shipping rate from that city
    shipping = await sails.helpers.shippingByCity( fish.city, weight );
    if( currentAdminCharges === undefined ){                
        //currentAdminCharges = await sails.helpers.currentCharges();
    }

    exchangeRates   = currentAdminCharges.exchangeRates;

    let owner = await User.findOne( { id: fish.store.owner } ) ;
    console.log('lol', { incoterm: owner.incoterms, type: fish.type.id });
    let marginPercentage  = await IncotermsByType.find( { incoterm: owner.incoterms, type: fish.type.id } );
    if( owner.incoterms === undefined ) {
      sfsMargin = 5;
      marginPercentage = marginPercentage[0];
    } else {
      sfsMargin = marginPercentage.margin  ;// fish.type.sfsMargin;

    }
    //sfsMargin = fish.type.sfsMargin;
    
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
        finalPrice: Number(parseFloat(finalPrice).toFixed(2)),
        marginPercentage,
        variation
    }

    // All done.
    return exits.success( charges );

  }


};

