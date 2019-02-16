/**
 * CountriesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    getAllCities: async (req, res)=>{
        let countries = await Countries.find();
        let cities = [];
        let getCities = async () => {
            await asyncForEach(countries, async (country) => {   
                await asyncForEach(country.cities, async ( city ) => {
                    cities.push( city );
                } )
            });
            
            console.log('Done');
            
            console.log( cities );
            res.status(200).json( cities );
          }
        
        getCities();
        
    },
    
    updateCityEta: async ( req, res ) => {
        let countryID = req.body.country;
        let cityCode = req.body.city;
        let mineta = req.body.mineta;
        console.log( 'id', countryID );
        let country = await Countries.findOne( { id: countryID } );
        console.log('country', country);
        let cities = [];
        await asyncForEach( country.cities, async ( city ) => {
            if ( cityCode === city.code ){
                city.mineta = mineta;
            }
            cities.push( city )
        } )

        let updated = await Countries.update( { id: countryID }, { cities: cities } );

        res.status(200).json( updated );

    }

};
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

