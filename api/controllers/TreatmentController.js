/**
 * TreatmentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    delete: async (req, res) => {
        try {
            let id = req.param('id');

            let response = await Treatment.update( { "id": id }).set({ isActive: false } ).fetch();
            res.send( response )
        } catch (error) {
            res.serverError(error)
        }
    }
};

