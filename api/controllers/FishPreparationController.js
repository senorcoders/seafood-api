/**
 * FishPreparationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  getFishPreparation: async (req, res) => { 
        try {
            let fp = await FishPreparation.find( {name: { '!=': 'Head Off Gutted' }} );

            res.status(200).json(fp);
        } catch (error) {
            res.serverError(error);
        }
    }
};

