
module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    quantity: {
      type: "json",
      required: true
    },

    price: {
      type: 'json',
      required: true,
      example: `
        price: {
          type: "$",
          value: 3,
          description: $2 for pack
        }
        `
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    fish: {
      model: "fish",
      required: true
    },

    shoppingCart: {
      model: "shoppingcart",
      required: true
    }

  },

  afterCreate: async function(item, next) {
    try{
      let cart = await ShoppingCart.findOne({id: item.shoppingCart }).populate("items");
      let total = 0;
      for(var it of cart.items){
        total += Number(it.price.value);
      }

      total = Number( parseFloat(total).toFixed(2) );

      cart = await ShoppingCart.update({id: cart.id}, {total: total});
      console.log(cart);
      next();

    }
    catch(e){
      console.error(e);
      next();
    }
  }

};

