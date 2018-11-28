/**
 * PricingChargesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    getCurrentPricingCharges: async(req, res) => {
        try{
            let customs = await PricingCharges.find( { where: { type: 'customs' } } ).sort( 'updatedAt DESC' ).limit(1);

            let lastMileCost = await PricingCharges.find( { where: { type: 'lastMileCost' } } ).sort( 'updatedAt DESC' ).limit(1);

            let uaeTaxes = await PricingCharges.find( { where: { type: 'uaeTaxes' } } ).sort( 'updatedAt DESC' ).limit(1);

            let handlingFees = await PricingCharges.find( { where: { type: 'handlingFees' } } ).sort( 'updatedAt DESC' ).limit(1);
            
            let data = {
                "customs": customs,
                "lastMileCost": lastMileCost,
                "uaeTaxes": uaeTaxes,
                "handlingFees": handlingFees
            }
            
            res.status(200).json( data );

        }catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    getPricingChargesHistory: async(req, res) => {
        try{
            let customs = await PricingCharges.find( { where: { type: 'customs' } } ).sort( 'updatedAt DESC' );

            let lastMileCost = await PricingCharges.find( { where: { type: 'lastMileCost' } } ).sort( 'updatedAt DESC' );

            let uaeTaxes = await PricingCharges.find( { where: { type: 'uaeTaxes' } } ).sort( 'updatedAt DESC' );

            let handlingFees = await PricingCharges.find( { where: { type: 'handlingFees' } } ).sort( 'updatedAt DESC' );
            
            let data = {
                "customs": customs,
                "lastMileCost": lastMileCost,
                "uaeTaxes": uaeTaxes,
                "handlingFees": handlingFees
            }
            
            res.status(200).json( data );

        }catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

    getFishPricingCharges: async( req, res ) => {
        try {
            let fishID = req.param('id');

            let customs = await PricingCharges.find( { where: { type: 'customs' } } ).sort( 'updatedAt DESC' ).limit(1);

            let fish = await Fish.findOne( { where: { id: fishID } } ).populate("type").populate("store");

            let lastMileCost = await PricingCharges.find( { where: { type: 'lastMileCost' } } ).sort( 'updatedAt DESC' ).limit(1);

            let uaeTaxes = await PricingCharges.find( { where: { type: 'uaeTaxes' } } ).sort( 'updatedAt DESC' ).limit(1);

            let handlingFees = await PricingCharges.find( { where: { type: 'handlingFees' } } ).sort( 'updatedAt DESC' ).limit(1);                         

            let seller = await User.find( { where: { id: fish.store.owner } } ).limit(1)
            let firstMileCost = 0;
            /*if ( seller[0].hasOwnProperty('sfsMargin') ){
                firstMileCost = seller[0].firstMileCost;
            }*/
            let data = {
                "firstMileCost": seller[0].firstMileCost,
                "lastMileCost": lastMileCost[0].price,                
                "uaeTaxes": uaeTaxes[0].price,
                "customs": customs[0].price,
                "sfsMargin": fish.type.sfsMargin,
                "handlingFees": handlingFees[0].price,
            }

            res.status(200).json( data );

        } catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },

};

