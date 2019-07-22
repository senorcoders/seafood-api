/**
 * UnitOfMeasureController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    delete: async (req, res) => {
        try {
            let id = req.param('id');

            await UnitOfMeasure.update( { id }, { isActive: false } )
            return res.send( { "message": "Unit Of Measure Deleted" } )
        } catch (error) {
            res.serverError(error)
        }
    }
};

