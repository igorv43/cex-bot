const { clearInterval } = require("timers");
var CexKrakenLUNC = require("../models/CexKrakenLUNC");
var Coin = require("../models/Coin");
var Market = require("../utils/Market");
let GlobalTokenBot01;
let GlobalTokenBot02;
const {
  Bot01Name,
  Bot01Email,
  Bot01Password,
  Bot02Name,
  Bot02Email,
  Bot02Password,
} = require("../config");
const Auth = require("../Auth/Auth");
const AccountBot01 = async () => {
  const objAuthBot01 = await Auth.generationToken(Bot01Email, Bot01Password);

  if (objAuthBot01.status === "error") {
    if (objAuthBot01.message === "password invalid or user not Exists") {
      const objCreateAuthBot01 = await Auth.create(
        Bot01Name,
        Bot01Email,
        Bot01Password
      );
      GlobalTokenBot01 = objCreateAuthBot01.token;
      await Auth.createCoinUser(
        { denom: "USDT", amount: 5605437.0 },
        GlobalTokenBot01
      );
    }
  } else {
    GlobalTokenBot01 = objAuthBot01.token;
  }
};
const AccountBot02 = async () => {
  const objAuthBot02 = await Auth.generationToken(Bot02Email, Bot02Password);

  if (objAuthBot02.status === "error") {
    if (objAuthBot02.message === "password invalid or user not Exists") {
      const objCreateAuthBot02 = await Auth.create(
        Bot02Name,
        Bot02Email,
        Bot02Password
      );
      GlobalTokenBot02 = objCreateAuthBot02.token;
      await Auth.createCoinUser(
        { denom: "LUNC", amount: 5005437.0 },
        GlobalTokenBot02
      );
    }
  } else {
    GlobalTokenBot02 = objAuthBot02.token;
  }
};
const botLunc01 = async () => {
  //return token
  AccountBot01();
  AccountBot02();
  const coin = await Coin.findOne({ Denom: "LUNC/USDT" });
  const total = await CexKrakenLUNC.countDocuments({ open: { $gte: 10 } });
  //console.log("total", total);
  let count = 1;
  const id = setInterval(excBot, 1300);
  async function excBot() {
    const list = await CexKrakenLUNC.find({ open: { $gte: 10 } })
      .skip(count)
      .limit(1);

    //Se for uma compra tranforma LUNc para USTC
    const USDT = coin.Price * list[0].buyvolume;
    const datareturn = await Market.buy(
      { price: undefined, amount: USDT, denom: "LUNC/USDT" },
      GlobalTokenBot01
    );
    console.log(
      "buy: ",
      list[0].buyvolume,
      " - ",
      coin.Price,
      " - USDT: ",
      USDT
    );
    await Market.sell(
      { price: undefined, amount: list[0].sellvolume, denom: "LUNC/USDT" },
      GlobalTokenBot02
    );
    console.log("sell: ", list[0].sellvolume, " - ", coin.Price, " - LUNC: ");

    //{ price: price, amount: amount, denom: denom}
    // cham a api de compra com a conta bot01
    count++;
    if (count === total) {
      //clearInterval(id);
      count = 1;
      excBot();
    }
  }
};
botLunc01();
