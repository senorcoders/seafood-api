/**
 * VariationsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getVariationSkus: async(req, res) => {
    let userID = req.param('userID');
    let stores = await Store.find( { owner: userID } );
    let store_ids = [];
    stores.map( store => {
        store_ids.push( store.id );
    } )

    let fishes = await Fish.find( { store: store_ids } );
    let fishes_ids = [];
    fishes.map( fish => {
        fishes_ids.push( fish.id );
    } );

    let variations = await Variations.find( { fish: fishes_ids } );
    
    let skus = [];
    variations.map( variation => {
        skus.push( { id: variation.id, sku: variation.sku } );
    } );
    return res.status(200).json(skus);
  }

};

