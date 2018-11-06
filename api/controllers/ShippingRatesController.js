/**
 * ShippingRatesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    getShippingRate: async (country, weight, type) => {
        console.log( country ); 
        console.log( weight ); 
        console.log( type ); 
        try {
            shippingRate = 0;
            shipping = await ShippingRates.find( { sellerCountry: country } )
                .sort( [{ weight: 'ASC' }] )
                .then( 
                    result => {
                        var BreakException = {};
                        try {
                            result.forEach( row => {
                                let over=false;
                                let overCost = 0;
                                let under = false;
                                let unerCost = 0;
                                let shippingCost = 0;
                                if( row.type == 'Pounds' ) { //changing pounds to kg
                                    row.weight = row.weight / 2.2;
                                }
                                if( type !== "kg" ){ //changing pounds to kg
                                    weight = weight / 2.2;                                
                                }
                                if( row.operation == 'Over' ){
                                    if( weight >= row.weight  ){
                                        //over = true;
                                        //overCost = row.cost;
                                        shippingRate = row.cost
                                        throw BreakException
                                    }
                                }else{
                                    if( weight < row.weight ){
                                        //underCost = row.cost;
                                        shippingRate = row.cost;
                                        throw BreakException
                                    }
                                }
                            });
                        } catch (e) {
                            console.log(country +' .. '+ weight +' .. '+ type);
                            return shippingRate;
                            if (e !== BreakException) throw e;
                        }
                        
                    },
                    error => {
                        console.log(error);
                    }
                )
                console.log( shippingRate );
                return shippingRate;
            }
            catch (e) {
                console.error(e);
                res.serverError(e);
            }
    },
    getCountryWithShippings: async (req, res) => {
        try {
            var db = ShippingRates.getDatastore().manager;
            var shippingRates = db.collection(ShippingRates.tableName);

            let countries = await new Promise((resolve, reject) => {
                shippingRates.distinct("sellerCountry", {},
                    function (err, docs) {
                        if (err) {
                            return reject(err);
                        }
                        if (docs) {
                            resolve(docs);
                        }
                    })
            });


            res.json(countries.sort());
        }
        catch (e) {
            console.error(e);
            res.serverError(e);
        }
    },
};

