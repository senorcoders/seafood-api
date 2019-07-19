const moment = require("moment");
const typesEmailSeller = [
  'sendCartPaidSellerNotified',
  'orderSellerPaid',
  'orderArrivedSeller',
  'sellerCancelledOrderSeller'
];

module.exports = {


  friendlyName: 'Get data order',


  description: '',


  inputs: {
    sellerName: {
      type: "string",
      required: false
    },
    cart: {
      type: "ref",
      required: true
    },
    items: {
      type: "json",
      required: true
    },
    orderNumber: {
      type: "number",
      required: true
    },
    type: {
      type: "string",
      required: true
    },
    URL: {
      type: "string",
      required: true
    }
  },


  exits: {

    outputType: {
      result: "ref"
    }

  },


  fn: async function (inputs, exits) {
    let sellerName = inputs.sellerName,
      cart = inputs.cart,
      items = inputs.items,
      orderNumber = inputs.orderNumber,
      type = inputs.type, URL = inputs.URL;
    items = JSON.parse(JSON.stringify(items));
    try {
      //Perder la referencia de la variable
      items = JSON.parse(JSON.stringify(items));

      //check if emails is for seller user
      let forSeller = typesEmailSeller.findIndex(it => { return type === it; }) !== -1;
      let currency = '', grandTotal = 0;
      let exchangeRates = Number(cart.currentCharges.exchangeRates);
      let calcs = await sails.helpers.calcsPrices.with({
        items,
        exchangeRates,
        forSeller
      });
      currency = calcs.currency;
      items = calcs.items;
      let total_ = cart.total.toString().replace(/,/g, '');
      grandTotal = currency === 'AED' ? Number(total_).toFixed(2) : (Number(total_) / exchangeRates).toFixed(2);

      let paidDateTime = "";
      if (cart.isDefined("paidDateTime") && cart.paidDateTime !== '') {
        paidDateTime = await sails.helpers.formatDate.with({
          date: new Date(cart.paidDateTime),
          format: "DD/MM/YYYY"
        });
      }

      //Para completar el src de image primary
      for (let i = 0; i < items.length; i++) {
        let it = items[i];
        if (it.fish.imagePrimary && it.fish.imagePrimary !== '') {
          it.fish.imagePrimary = URL + it.fish.imagePrimary;
        }
        if (it.isDefined('buyerExpectedDeliveryDate') === true && it.buyerExpectedDeliveryDate !== '' &&
          /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/.test(it.buyerExpectedDeliveryDate) === true) {
          it.buyerExpectedDeliveryDate = moment(it.buyerExpectedDeliveryDate, "MM/DD/YYYY").format("MM/DD/YYYY");
        }
        if (it.isDefined('sellerExpectedDeliveryDate') === true && it.sellerExpectedDeliveryDate !== '' &&
          /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/.test(it.sellerExpectedDeliveryDate) === true) {
          it.sellerExpectedDeliveryDate = moment(it.sellerExpectedDeliveryDate, "MM/DD/YYYY").format("MM/DD/YYYY");
        }
        items[i] = it;
      }

      //Para obtener los sellers
      let _stores = [];
      for (let it of items) {
        let ind = _stores.findIndex(i => { return i.id === it.fish.store.id; });
        if (ind === -1) _stores.push(it.fish.store);
      }
      let sellers = "";
      for (let i = 0; i < _stores.length; i++) {
        let space = (i + 1) === _stores.length ? '' : (i + 1) === (_stores.length - 1) ? ' and ' : ', ';
        //for get names of the owners of stores and show in invoice o PO
        if (_stores[i] && _stores[i].isDefined("owner") === true && _stores[i].owner.typeObject() === "object")
          sellers += _stores[i].owner.firstName + " " + _stores[i].owner.lastName + space;
      }
      if (_stores.length === 1) {
        if (_stores[0].isDefined("owner") === true && _stores[0].owner.typeObject() === "object")
          sellers = _stores[0].owner.firstName + " " + _stores[0].owner.lastName;
      }

      return exits.success({
        name: sellerName,
        sellerName: sellerName,
        cart: cart,
        sellers,
        items: items,
        orderNumber: orderNumber,
        url: URL,
        paidDateTime,
        grandTotal, 
        currency
      });
    }
    catch (e) {
      console.error(e);
    }

  }


};

