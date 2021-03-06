module.exports = {


  friendlyName: 'Generate sku',


  description: '',


  inputs: {
    store: {
      type: 'string',
      required: true
    },
    category: {
      type: 'string'
    },
    subcategory: {
      type: 'string'
    },
    country: {
      type: 'string'
    },
    type: {
      type: 'string'
    }
  },


  exits: {
    outputType: {
      result: "string"
    }
  },


  fn: async function (inputs, exits) {
    let store_name = await Store.find(
      {
        where: {
          "id": inputs.store
        }
      }
    )


    let country_name = await Countries.find(
      {
        where: {
          "code": inputs.country
        }
      }
    )

    let category_name = await FishType.find(
      {
        where: {
          "id": inputs.category
        }
      }
    )

    let subcategory_name = await FishType.find(
      {
        where: {
          "id": inputs.subcategory
        }
      }
    )

    let fishes = await Fish.count({
      processingCountry: inputs.country,
      store: inputs.store,
      type: inputs.type,
    })

    console.log('/n/n/n countttt', {
      processingCountry: inputs.country,
      store: inputs.store,
      type: inputs.type,
    }, fishes, '/n/n/n/n');

    fishes += 1;
    if (fishes < 10)
      fishes = '0' + fishes;

    // All done.
    return exits.success(`${store_name[0].name.substring(0, 3).toUpperCase()}-${category_name[0].name.substring(0, 3).toUpperCase()}-${subcategory_name[0].name.substring(0, 3).toUpperCase()}-${country_name[0].name.substring(0, 2).toUpperCase()}-${fishes}`);

    // return exits.success("seafood_sku_test_");

  }


};

