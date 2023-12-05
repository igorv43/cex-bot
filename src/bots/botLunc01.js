var CexKrakenLUNC = require("../models/CexKrakenLUNC");
var Coin = require("../models/Coin");

const botLunc01 = async () => {
  const coin = await Coin.findOne({ Denom: "LUNC/USDT" });
  const total = CexKrakenLUNC.find().count();
  for (let index = 0; index < total; index++) {
    setInterval(async function () {
      const list = await CexKrakenLUNC.find().limit(1).skip(index);

      //Se for uma compra tranforma LUNc para USTC
      const USDT = list[0].Price * coin.Price;
      // cham a api de compra com a conta bot01
    }, 10000);
  }

  // if (type == "buy") {
  //     obj.Amount = obj.Amount / obj.Price;
  //   }
};
