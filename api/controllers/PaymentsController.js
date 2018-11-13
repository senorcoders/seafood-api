/**
 * PaymentsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAuthorization: async (req, res) => {
    let params = req.body;
    console.log( params );
    let data = {
        response: params,
        type: params.service_command ,
        shoppingCart: params.merchant_reference
    };

    let payment = await Payments.create( data ); 
    res.status(200).json( payment );

  }

};

