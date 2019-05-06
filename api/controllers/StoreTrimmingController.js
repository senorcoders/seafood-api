/**
 * StoreTrimmingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    getTrimmTypes: async (req, res) => {
        try {
            trimTypes = ["Trim A", "Trim B", 'Trim C', 'Trim D', 'Trim E'];
            res.status(200).json(trimTypes);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    getStoreTrimming: async (req, res) => {
        try {
            let storeID = req.param("store");

            // let storeTrim = await StoreTrimming.find( { store: storeID } ).populate('processingParts').sort( 'trimmingType ASC' );

            // let result = [];
            // await Promise.all( storeTrim.map( async ( item ) => {
            //     let itemType = await TrimmingType.find( { id: item.trimmingType } );
            //     item.type = itemType;

            //     result.push( item );
            // } ) )

            let trimmingsDefault = await TrimmingType.find();
            let storeTrim = await StoreTrimming.find({ store: storeID }).populate('processingParts').sort('trimmingType ASC');
            let result = [];
            for (let trim of trimmingsDefault) {
                let indexs = []; let ind = 0;
                for (let str of storeTrim) {
                    if (str.trimmingType === trim.id)
                        indexs.push(ind);
                    ind += 1;
                }
                if (indexs.length === 0)
                    result.push({ type: [trim] });
                else {
                    for (let index of indexs) {
                        storeTrim[index].type = [trim];
                        result.push(storeTrim[index]);
                    }
                }
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error);
        }
    }

};

