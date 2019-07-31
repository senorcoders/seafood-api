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

  '*': 'is-logged-in',

  // Bypass the `is-logged-in` policy for:
  'user/verificationCode': true,

  'FishController': {
    getAllPagination: true,
    getDistinctCountry: true,
    getItemCharges: true,
    getFishWithVariations: true,
    filterFishWithVariations: true
    //   customWhere: true,
    //   search: true,
    //   getXMultipleID: true
  },

  // FishTypeController: {
  //   getXNamePagination: true
  // },

  ImageController: {
    getImage: true,
    getImagesCategory: true,
    getImagesLicense: true,
    getImagePrimary: true,
    getLogoAndHeroStore: true,
    getImagesStore: true,
    getShippingFiles: true,
    getLogoSeller: true,
    getCertificationSeller: true
  },
  UserController: {
    emailExist: true,
    verificationCode: true,
    resetEmail: true,
    updatePassword: true,
    changePassword: true,
    getPublicIp: true,
    getLogoSeller: true,
    getCertificationSeller: true,
    resendEmail: true
  },
  StoreController: {
    save: true,
    update: true,
    getForSlug: true,
    get: true,
    getWithTypes: true,
    getBrandsAndCertifications: true
  },
  ShoppingCartController: {
    sendPDF: true,
  },
  DocusignController: {
    resposeEnvelope: true
  },
  PaymentsController: {
    getAuthorization: true
  },
  FishStockController: {
    outOfStockNotification: true
  },
  CompanyTypeSeller: {
    '*': true
  },
  FishPreparation: {
    getFishPreparation: true,
    getFishPreparationParents: true
  },
  FishTypeController: {
    getParentsWithFishes: true,
    getParentLevel: true
  },
  // 'raised/get': true,
  // 'treatment/get': true,
  Treatment: {
    '*': true
  },
  Raised: {
    '*': true
  },
  reviewsstore: {
    '*': true,
  },
  PricingCharges: {
    getCurrentPricingCharges: true
  },
  /*  FeaturedProductsController: {
      "*": true
    },
    FeaturedSellerController: {
      "*": true
    },
    FeaturedTypesController: {
      "*": true,
    },
    FishTypeMenu: {
      "*": true
    },
  */
  'countries/find': true,
  'entrance/*': true,
  'account/logout': true,
  'view-homepage-or-redirect': true,
  'deliver-contact-form-message': true,
  '/api/login': true,
  'get-data': true

};
