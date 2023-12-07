const api = require("../utils/CEXClient");
module.exports = class Market {
  //{ price: price, amount: amount, denom: denom}
  static async buy(market, token) {
    try {
      const data = await api
        .post("/market/buy", market, {
          headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        })
        .then(async (response) => {
          return { data: response.data };
        });
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  static async sell(market, token) {
    try {
      const data = await api
        .post("/market/sell", market, {
          headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        })
        .then(async (response) => {
          return { data: response.data };
        });
      return data;
    } catch (error) {
      return error;
    }
  }
};
