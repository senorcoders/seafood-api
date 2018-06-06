/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  //'*': 'is-logged-in',

  // Bypass the `is-logged-in` policy for:
  'user/verificationCode': true,

  'FishController': {
    getAllPagination: true,
    customWhere: true,
    search: true,
    getXMultipleID: true
  },

  FishTypeController: {
    getXNamePagination: true
  },

  ImageController: {
    getImage: true,
    getImagesCategory: true,
    getImagesLicense: true
  },

  'entrance/*': true,
  'account/logout': true,
  'view-homepage-or-redirect': true,
  'deliver-contact-form-message': true,

};
