/**
 * ShippingRatesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    getShippingRate: async (country, weight, type) => {
        try {
            shippingRate = 0;
            shipping = await ShippingRates.find( { sellerCountry: country } )
                .sort( [{ weight: 'ASC' }] )
                .then( 
                    result => {
                        var BreakException = {};
                        try {
                            let resultSize = Object.keys(result).length ;
                            let resultCount = 0;
                            result.forEach( row => {
                                resultCount +=1 ;                                
                                console.log("weight: " + weight );
                                console.log("row.weight: " + row.weight );
                                console.log("resultSize: " + resultSize );
                                console.log("resultCount: " + resultCount );
                                if( weight < row.weight  ){                                    
                                    shippingRate = row.cost;
                                    throw BreakException;
                                }else {
                                    if( resultCount == resultSize ){
                                        shippingRate = row.cost;
                                        throw BreakException;
                                    }
                                }
                                
                                
                            });
                            //shippingRate = shippingRate;
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

