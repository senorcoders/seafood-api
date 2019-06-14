/**
 * FishStockController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    getFishStock: async(req, res) => {
        let variationID = req.param('id');
        let unixNow = Math.floor(new Date());
        let stocks = await FishStock.find().where({
            "date": { '>': unixNow },
            "variations": variationID
        } ).sort( 'date DESC' ).populate('variations');

     

        return res.status(200).json( stocks );
    },     
    testETAStock: async (req, res) => {
        let stock = await sails.helpers.getEtaStock(req.param('variation'),req.param('quantity') );
        return res.status(200).json( stock );
    },
    updateETA: async (req, res) => {

        let uVariation = {            
            date : req.body.unixDate,            
            short_date: req.body.etaDate,
            quantity : req.body.quantity,            
        };
        let fishStockID = req.body.fishStockID;

        let currentVariation = await FishStock.findOne( { id: fishStockID } )

        if( uVariation.quantity < currentVariation.purchased ) {
            return res.status(200).json( { message: "Quantity can't be less than purchased", currentVariation } )
        }

        let updatedStock = await FishStock.update( { id: fishStockID } ).set( uVariation ).fetch();

        return res.status(200).json( updatedStock )
    },
    saveETA: async ( req, res ) => {
        let uVariation = {
            variations: req.body.sku,
            date : req.body.date,            
            short_date: req.body.short_date,
            quantity : req.body.quantity,            
        };
        let unixNow = Math.floor(new Date());
        let alreadyLive = await FishStock.find().where({
            "date": { '>': unixNow, '!=': uVariation.date },            
            "variations": req.body.sku
        } );

        if( alreadyLive.length >= 3  ) {
            return res.status(200).json( { message: "Only 3 dates can be recorded", inventory: alreadyLive } )
        }

        let exists = await FishStock.find().where( {
            variations: req.body.sku,
            date: req.body.date,
            short_date: req.body.short_date,            
        } );
        

        
        let stock;
        if( exists !== undefined && exists.length == 0 ) { // not found, so let's created
            uVariation['purchased'] = 0;
            stock = await FishStock.create( uVariation ).fetch();
        } else {
            if( uVariation.quantity < exists[0].purchased ) {
                return res.status(200).json( { message: "Quantity can't be less than the purchased field", inventory: exists } )
            }
            stock = await FishStock.update( exists[0].id ).set( uVariation ).fetch();
        }
        return res.status(200).json( { stock, uVariation, exists } );
    }
    
};

