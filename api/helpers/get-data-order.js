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

      //for add price of item and calculate depending of currency
      let owners = {}; //check if all owners or seller these are same
      let currency = 'AED';
      //type change
      let exchangeRate = Number(cart.currentCharges.exchangeRates);
      items = await Promise.all(items.map(async it => {
        //load store with owner == seller
        if (it.fishCurrent) { console.log(it.fishCurrent);
          let st = await Store.findOne({ id: typeof it.fishCurrent.store === 'string' ? it.fishCurrent.store : it.fishCurrent.store.id }).populate('owner');
          if (st.owner) {
            currency = st.owner.dataExtra.currencyTrade || 'AED';

            //add id seller for know if there are more than one seller
            if (owners[st.owner.id] !== true)
              owners[st.owner.id] = true;
          }
          let quantity = 0, price = 0, subtotal = 0, taxesAndCustoms = 0, shippingHandles = 0,
            vat = 0;
          quantity = it.itemCharges.weight;
          //if for seller email
          if (forSeller === true && currency !== 'AED') {
            switch(currency){
              case 'USD':
                  price = (Number(it.price) / exchangeRate).toFixed(2);
                  subtotal = it.subtotal;
                  taxesAndCustoms = (
                    (Number(it.itemCharges.customsFee) + Number(it.itemCharges.exchangeRateCommission) + Number(it.itemCharges.sfsMarginCost)) / exchangeRate
                  ).toFixed(2);
                  shippingHandles = (Number(it.itemCharges.shippingCost.cost) / exchangeRate).toFixed(2);
                  vat = (Number(it.itemCharges.uaeTaxesFee) / exchangeRate).toFixed(2);
                  break;
            }
          }
          else {
            price = it.price;
            subtotal = it.subtotal;
            taxesAndCustoms = (Number(it.itemCharges.customsFee) + Number(it.itemCharges.exchangeRateCommission) + Number(it.itemCharges.sfsMarginCost)).toFixed(2),
              shippingHandles = it.itemCharges.shippingCost.cost;
            vat = it.itemCharges.uaeTaxesFee;
          }

          it.pricesCalc = {
            quantity,
            price,
            subtotal,
            taxesAndCustoms,
            shippingHandles,
            vat
          }
        }

        return it;
      }));
      console.log('/n/n', owners, currency, '/n/n');
      //if owners === 1 currency no change if more than 1 is AED
      if (Object.keys(owners).length > 1) currency = 'AED';

      //Para obtener el total y parsiar la fecha de pago
      let grandTotal = currency === 'AED' ? Number(cart.total).toFixed(2) : (Number(cart.total) /exchangeRate).toFixed(2);

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

