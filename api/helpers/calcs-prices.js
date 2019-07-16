module.exports = {


  friendlyName: 'Calcs prices',


  description: '',


  inputs: {
    items: {
      type: "json",
      required: true
    },
    exchangeRates: {
      type: 'number',
      required: true
    },
    forSeller: {
      type: 'boolean',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    try {
      let items = inputs.items;
      //if is for seller we need search the currency
      let exchangeRate = Number(inputs.exchangeRates), currency = inputs.forSeller === true ? '' : 'AED';
      items = await Promise.all(items.map(async it => {
        //load store with owner == seller
        if (it.fishCurrent && currency === '') {
          console.log(it.fishCurrent);
          let st = await Store.findOne({ id: typeof it.fishCurrent.store === 'string' ? it.fishCurrent.store : it.fishCurrent.store.id }).populate('owner');
          if (st.owner)
            currency = st.owner.dataExtra.currencyTrade || 'AED';
        }

        let quantity = 0, price = 0, subtotal = 0, taxesAndCustoms = 0, shippingHandles = 0,
          vat = 0, amount = 0;
        quantity = it.itemCharges.weight;

        //if for seller email
        switch (currency) {
          case 'USD':
            price = (Number(it.price) / exchangeRate).toFixed(2);
            subtotal = (Number(it.subtotal) / exchangeRate).toFixed(2);;
            taxesAndCustoms = (
              (Number(it.itemCharges.customsFee) + Number(it.itemCharges.exchangeRateCommission) + Number(it.itemCharges.sfsMarginCost)) / exchangeRate
            ).toFixed(2);
            shippingHandles = (Number(it.itemCharges.shippingCost.cost) / exchangeRate).toFixed(2);
            vat = (Number(it.itemCharges.uaeTaxesFee) / exchangeRate).toFixed(2);
            amount = ((it.itemCharges.weight * it.itemCharges.price) / exchangeRate).toFixed(2);
            break;
          default:
            price = it.price;
            subtotal = it.subtotal;
            taxesAndCustoms = (Number(it.itemCharges.customsFee) + Number(it.itemCharges.exchangeRateCommission) + Number(it.itemCharges.sfsMarginCost)).toFixed(2),
              shippingHandles = it.itemCharges.shippingCost.cost;
            vat = it.itemCharges.uaeTaxesFee;
            amount = (it.itemCharges.weight * it.itemCharges.price).toFixed(2);
            break;

        }

        it.pricesCalc = {
          quantity,
          price,
          subtotal,
          taxesAndCustoms,
          shippingHandles,
          vat,
          amount
        }

        return it;
      }));

      return exits.success({
        items,
        currency
      });
    }
    catch (e) {
      console.error(e);
    }

  }


};

