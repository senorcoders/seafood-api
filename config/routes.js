/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝
  'GET /': { action: 'view-homepage-or-redirect' },
  'GET /welcome': { action: 'dashboard/view-welcome' },

  'GET /faq': { view: 'pages/faq' },
  'GET /legal/terms': { view: 'pages/legal/terms' },
  'GET /legal/privacy': { view: 'pages/legal/privacy' },
  'GET /contact': { view: 'pages/contact' },

  'GET /signup': { action: 'entrance/view-signup' },
  'GET /email/confirm': { action: 'entrance/confirm-email' },
  'GET /email/confirmed': { view: 'pages/entrance/confirmed-email' },

  'GET /login': { action: 'entrance/view-login' },
  'GET /password/forgot': { action: 'entrance/view-forgot-password' },
  'GET /password/new': { action: 'entrance/view-new-password' },

  'GET /account': { action: 'account/view-account-overview' },
  'GET /account/password': { action: 'account/view-edit-password' },
  'GET /account/profile': { action: 'account/view-edit-profile' },


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // from the CloudSDK library.
  '/api/logout': { action: 'account/logout' },
  'PUT   /api/v1/account/update-password': { action: 'account/update-password' },
  'PUT   /api/v1/account/update-profile': { action: 'account/update-profile' },
  'PUT   /api/v1/account/update-billing-card': { action: 'account/update-billing-card' },
  'PUT   /api/login': { action: 'entrance/login' },
  'POST  /api/signup': { action: 'entrance/signup' },
  'POST  /api/v1/entrance/send-password-recovery-email': { action: 'entrance/send-password-recovery-email' },
  'POST  /api/v1/entrance/update-password-and-login': { action: 'entrance/update-password-and-login' },
  'POST  /api/v1/deliver-contact-form-message': { action: 'deliver-contact-form-message' },


  /***************
   * 
   * USER 
   * 
   */

  //Para verificar el codigo
  'GET /verification/:id/:code': "UserController.verificationCode",

  //Para forgot password
  'POST /api/user/forgot': 'UserController.resetEmail',

  //Para actualizar la contraseña despues de enviar el codigo al correo
  'PUT /api/user/password': 'UserController.changePassword',

  //Para actualizar la contraseña usando la contraseña actual
  'PUT /api/user/update-password': 'UserController.updatePassword',

  //Para enviar datos del formulario de contacto
  "POST /api/contact-form/:id": "UserController.sendMessageContact",

  //Para obtener admins
  'GET /api/user/admins': 'UserController.getAdmins',

  //Para Eliminar el usuario
  'DELETE /api/user/:id': 'UserController.deleteUser',

  //Para que actualize el status del usuario
  'PUT /user/status/:id/:status': 'UserController.updateStatus',

  // 'PUT /user':'UserController.updateUser',

  /*************
   * 
   * IMAGES
   * 
   */

  //para subir license de usuario
  'POST /api/user/license/:id': 'ImageController.saveImageLicence',

  //get image license
  'GET /api/images/license/:namefile/:id': 'ImageController.getImagesLicense',

  //subir multiples images for a fish
  'POST /api/images': 'ImageController.imagesUpload',

  //Para guardar multiples images de un producto
  'POST /api/fish/images/:id': 'ImageController.multipleImagesUpload',

  //Para obtener images custom
  'GET /api/images/:namefile/:id': 'ImageController.getImage',

  //Para eliminar imagenes
  'DELETE /api/images/:namefile/:id': 'ImageController.deleteImage',

  'DELETE /api/images/category/:namefile/:id/': 'ImageController.deleteImageCategory',

  //Para guardar la imagen de tracking de items sohopping
  'POST /api/itemshopping/trackingfile/:id': 'ImageController.saveImageTrackingFile',

  ////get la imagen de tracking de items sohopping
  'GET /api/images/trackingfile/:namefile/:id': 'ImageController.getTrackingFile',

  "PUT /api/user-logo-company": "ImageController.saveImageLogoCompany",

  //get image of logo company, user
  "GET /api/logo-company/:userID": "ImageController.getImageLogoCompany",

  /***********
   * 
   * FISH AND FISHTYPE
   * 
   */

   //Para guardar multiples productos
   "POST /api/fishs": "FishController.saveMulti",

  //Para eleimnar un producto
  'DELETE /api/fish/:id': 'FishController.delete',

  //para buscar mariscos por tipos
  'GET /api/fish-type/:name/:page/:limit': 'FishTypeController.getXNamePagination',

  //Para obtener los productos
  'GET /api/fish/:page/:limit': 'FishController.getAllPagination',

  //Para obtener los productos por medio de where
  'GET /api/fish/:where': "FishController.customWhere",

  //Para obtener los productos por medio de where
  'POST /api/fish/search/:page/:limit': "FishController.search",

  //Para obtener sugerencias de los productos
  "POST /api/fish/suggestions": "FishController.getSuggestions",

  //Para obtener por multiple id
  'GET /api/fish-ids/:ids': 'FishController.getXMultipleID',

  "GET /fishtype": "FishController.getFishs",

  //Para guardar images en las categorias (FishType)
  'POST /api/fishtype/images/:id': "ImageController.multipleImagesCategory",

  //Para establecer una imagen primary en el maricos
  'POST /api/fish/image/:id': 'ImageController.setPrimaryImage',

  //Para obtener imagenes de las categorias
  'GET /api/images/category/:namefile/:id': "ImageController.getImagesCategory",

  //Para obtener imagen primaria de un producto
  'GET /api/images/primary/:namefile/:id': 'ImageController.getImagePrimary',

  //Para elimnar la imagen
  'PUT /api/images/primary/:namefile/:id': 'ImageController.updateImagePrimary',

  //Para obtener productos comprador por type
  'GET /api/fish/type/:type': "FishController.getXTypeWithDataEspecified",

  //Para obtener productos comprados agrupados por categoria
  'GET /api/fish/type': "FishController.getWithDataEspecified",

  /***************************
   * 
   * STORE 
   * 
   */

  //Para obtener stores simplificados con toda su informaciòn
  'GET /api/store': "StoreController.getStoreSimplified",

  //Get Store con los types
  "GET /store/:id": "StoreController.getWithTypes",

  //Para guardar store con todo y sus imagenes
  'POST /api/store': "StoreController.save",

  //Para actualizar o guardar logo
  'POST /api/store/logo/:id': "ImageController.saveLogoStore",

  //Para actualizar o guardar hero image
  'POST /api/store/hero/:id': "ImageController.saveHeroStore",

  //Para actualizar o guardar hero image
  'POST /api/store/gallery/:id': "ImageController.saveImagesStore",

  //Para obtener el logo y hero de store
  'GET /api/store/images/:main/:namefile/:id': "ImageController.getLogoAndHeroStore",

  //Para Obtener galeria de imagenes para store
  'GET /api/store/images/:namefile/:id': 'ImageController.getImagesStore',

  //Para obtener store for id
  'GET /api/store/user/:id': 'StoreController.getXUser',

  //Para obtener productos pagados por tienda
  'GET /api/store/fish/paid/:id': 'ItemShoppingController.getItemsXStorePaid',

  //Para obtener productos pagados por tienda y items shippingStatus === 'paid'
  'GET /api/store/fish/items/paid/:id': 'ItemShoppingController.getItemsXStoreAndItemPaid',

  //Para subir las images sfs
  "POST /api/store/sfs/:id": "StoreController.uploadImagesSFS",

  //Para obtener el sfs image
  "GET /image/store/sfs/:namefile/:id": "StoreController.getImageSFS",

  //Delete sfs image
  "DELETE /image/store/sfs/:sfs/:id": "StoreController.deleteImageSFS",

  //Update sfs Image
  "PUT /image/store/sfs/:sfs/:id": "StoreController.updateImageSFS",

  /***********
   * 
   * SHOPPING CART
   * 
   */

  //Para crear un carrito
  'POST /shoppingcart': 'ShoppingCart.createCart',

  //Para agregar un producto al carrito de compra
  'POST /api/shopping/add/:id': 'ShoppingCartController.addItem',

  //Para obtener el store por id
  'GET /shoppingcart/:id': 'ShoppingCartController.getPopulateXID',

  //Para update items for cart
  'PUT /shoppingcart/items': 'ShoppingCartController.updateItems',

  //Para actualizar un carrito de productos a pagado.
  'PUT /api/shoppingcart/:id': "ShoppingCartController.updateShoppingCartPaid",

  //Get Cart paid x buyer
  'GET /api/cart/paid/:buyer': "ShoppingCartController.getCartPaid",

  /***********
   * 
   * ITEMS SHOPPING 
   * 
   */

  //Para obtener items del carrito
  'GET /api/items/:user/:id': "ItemShoppingController.getItemsXCart",

  //Para actualizar status y enviar email
  'PUT /api/itemshopping/status/:id': "ItemShoppingController.updateStatusToShipped",


  /********
   * 
   * FAVORITE FISH
   * 
   */

  //Para obtener fish por user
  'GET /api/favoritefish/:id': 'FavoriteFish.getXUSer',

  //Para saber si el usuario ya tiene ese producto como favorito
  'POST /api/favoritefish': 'FavoriteFishController.getXUserAndFish',

  /********
* 
* ITEM SHOPPING
* 
*/

  //Para obtener fish por user
  'GET /itemshopping/:id': 'ItemShoppingController.getWithAllData',


  /***********
   * FILES UPLOAD ADMIN
   */
  'GET /api/admin/files': 'FilesUploadController.getFiles',
  'POST /api/admin/files': 'FilesUploadController.saveFiles',
  'GET /api/admin/:filename/files': 'FilesUploadController.getFile',
  'DELETE /api/admin/:filename/files': 'FilesUploadController.deleteFile',

  /******
   * FEATURED TYPES
   */
  "POST /featuredtypes": "FeaturedTypesController.saveOrUpdate",

  "GET /featuredtypes": "FeaturedTypesController.get",

   /******
   * FEATURED TYPES MENU
   */
  "POST /featuredtypes-menu": "FishTypeMenu.saveOrUpdate",

  "GET /featuredtypes-menu": "FishTypeMenu.get",

  /********
   * 
   * AVENCED SEARCH
   * 
   */
  "GET /search-avanced/:page/:limit": "FishController.searchAvanced",

  "GET /fish/country": "FishController.getDistinctCountry",

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗
  //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗
  //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝
  '/terms': '/legal/terms',
  '/logout': '/api/v1/account/logout',

};
