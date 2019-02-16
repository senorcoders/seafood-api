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
    },
    getStoreTrimming : async ( req, res ) => {
        try {
            let storeID = req.param("store");

            let storeTrim = await StoreTrimming.find( { store: storeID } ).populate('processingParts').sort( 'trimmingType ASC' );

            let result = [];
            await await Promise.all( storeTrim.map( async ( item ) => {
                let itemType = await TrimmingType.find( { id: item.trimmingType } );
                item.type = itemType;

                result.push( item );
            } ) )

            res.status( 200 ).json( result );
        } catch (error) {
            res.status( 400 ).json( error );
        }
    }

};

