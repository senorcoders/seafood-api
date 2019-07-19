/**
 * WholeFishWeightController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    delete: async (req, res) => {
        try {
            let id = req.param('id');

            await WholeFishWeight.update( { id }, { isActive: false } )
            return res.send( { "message": "Variation deleted" } )
        } catch (error) {
            res.serverError(error)
        }
    }
};

