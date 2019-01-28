/**
 * StoreTrimmingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    getTrimmTypes : async (req, res) => {
        try {
            trimTypes = ["Trim A", "Trim B", 'Trim C', 'Trim D', 'Trim E'];
            res.status( 200 ).json( trimTypes );
        } catch (error) {
            res.status( 400 ).json( error );
        }
    }

};

