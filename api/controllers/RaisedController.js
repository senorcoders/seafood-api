/**
 * RaisedController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    delete: async (req, res) => {
        try {
            let id = req.param('id');

            await Raised.update( { id }, { isActive: false } )
            return res.send( { "message": "Raise deleted" } )
        } catch (error) {
            res.serverError(error)
        }
    }
};

