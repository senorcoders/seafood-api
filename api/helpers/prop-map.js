const propMap = function (obj) {

  let procsProp = function (prop) {
    if(prop===null||prop===undefined) return prop;
    if (prop.typeObject() === 'array' || prop.typeObject() === 'object') {
      prop = propMap(prop);
    } else if (isNaN(prop) === false) {
      prop = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(prop);
    }
    return prop;
  }

  if (obj.typeObject() === "array") {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = procsProp(obj[i]);
    }
  }

  if (obj.typeObject() === 'object') {
    let names = Object.keys(obj);
    for (let name of names) {
      obj[name] = procsProp(obj[name]);
    }
  }

  return obj;
};

module.exports = {


  friendlyName: 'Prop map',


  description: `Para recorrer todas las propiedades de un objecto 
    y convertir las propiedades numericas, en propiedades en cadenas de tecto 
    representando numeros con dos decimales
  `,

  sync: false,

  inputs: {
    prop: {
      type: "ref",
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: function (inputs, exits) {
    // TODO
    //si mantengo la referencia puede afectar en calculos 
    //como en los pdf
    let prop = JSON.parse( JSON.stringify(inputs.prop) );
    return exits.success(propMap(prop));

  }


};

