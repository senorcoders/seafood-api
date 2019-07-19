/**
 * FishVariationsController.getFishVariationByPreparation
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    getFishVariationByPreparation: async ( req, res ) => {
        try {
            let type = req.param('typeID'),
            preparation = req.param('preparationID');

            let fishPreparation = await sails.helpers.fishVariationByPreparation.with({
                type,
                preparation
            });

            res.json( fishPreparation );
            
        } catch (error) {
            res.serverError( error );
        }
    },
    delete: async (req, res) => {
        try {
            let id = req.param('id');

            await FishVariations.update( { id }, { isActive: false } )
            return res.send( { "message": "Raise deleted" } )
        } catch (error) {
            res.serverError(error)
        }
    }
};

