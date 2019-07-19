/**
 * FishPreparationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  getFishPreparation: async (req, res) => { 
        try {
            let fp = await FishPreparation.find( {
                name: { '!=': 'Head Off Gutted' }, 
                isActive: true  } );

            res.status(200).json(fp);
        } catch (error) {
            res.serverError(error);
        }
    },
    getFishPreparationParents: async (req, res) => {
        try {
            let parent_id = req.param('parent_id');
            let fp = await FishPreparation.find( { isActive: true } ).where( {
                parent: parent_id
            } )

            res.json( fp );
        } catch (error) {
            res.serverError(error)
        }
    },
    
    getFishPreparationChilds: async (req, res) => {
        try {
            let fp = await FishPreparation.find( { isActive: true } ).where( {
                parent: { '!=': '0' }
            } )

            res.json( fp );
        } catch (error) {
            res.serverError(error)
        }
    },
    
    delete: async (req, res) => {
        try {
            let id = req.param('id');

            await FishPreparation.update( { id }, { isActive: false } )
            return res.send( { "message": "Preparation deleted" } )
        } catch (error) {
            res.serverError(error)
        }
    }

};

