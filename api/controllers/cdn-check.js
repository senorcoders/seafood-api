const axios = require('axios');

module.exports = {


  friendlyName: 'Cdn check',


  description: '',


  inputs: {

  },


  exits: {
    success: {
      responseType: 'json',
      description: 'return info of country',
      extendedDescription:
        ``
    },
  },


  fn: async function (inputs) {

    try {
      let ip = this.req.ip;
      // let ip = this.req.ip === '::1' ? '92.98.65.22' : this.req.ip;
      console.log(ip);
      let url = `https://ipapi.co/${ip}/json/`;
      let data = await axios.get(url, { 'Content-Type': 'application/json', 'cache-control': 'no-cache' });
      console.log(data.data);
      if (data.status === 200)
        return this.res.v2(data.data);
      else
        return this.res.v2(new Error("IP not found"));
    }
    catch (e) {
      console.error(e);
      return this.res.v2(new Error("IP not found"));

    }

  }


};
