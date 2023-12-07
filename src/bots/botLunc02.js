const { clearInterval } = require("timers");
var CexKrakenLUNC = require("../models/CexKrakenLUNC");
var Coin = require("../models/Coin");
var Market = require("../utils/Market");
let GlobalTokenBot01;
let GlobalTokenBot02;
const {
  Bot03Name,
  Bot03Email,
  Bot03Password,
  Bot04Name,
  Bot04Email,
  Bot04Password,
} = require("../config");
const Auth = require("../Auth/Auth");
const AccountBot01 = async () => {
  const objAuthBot = await Auth.generationToken(Bot03Email, Bot03Password);

  if (objAuthBot.status === "error") {
    if (objAuthBot.message === "password invalid or user not Exists") {
      const objCreateAuthBot = await Auth.create(
        Bot03Name,
        Bot03Email,
        Bot03Password
      );
      GlobalTokenBot01 = objCreateAuthBot.token;
      await Auth.createCoinUser(
        { denom: "USDT", amount: 5605437.0 },
        GlobalTokenBot01
      );
    }
  } else {
    GlobalTokenBot01 = objAuthBot.token;
  }
};
const AccountBot02 = async () => {
  const objAuthBot = await Auth.generationToken(Bot03Email, Bot03Password);

  if (objAuthBot.status === "error") {
    if (objAuthBot.message === "password invalid or user not Exists") {
      const objCreateAuthBot = await Auth.create(
        Bot03Name,
        Bot03Email,
        Bot03Password
      );
      GlobalTokenBot02 = objCreateAuthBot.token;
      await Auth.createCoinUser(
        { denom: "LUNC", amount: 2005437.0 },
        GlobalTokenBot02
      );
    }
  } else {
    GlobalTokenBot02 = objAuthBot.token;
  }
};
const botLunc02 = async () => {
  //return token
  AccountBot01();
  AccountBot02();
  const coin = await Coin.findOne({ Denom: "LUNC/USDT" });
  const total = await CexKrakenLUNC.countDocuments({ open: { $gte: 10 } });
  //console.log("total", total);
  let count = 1;
  const id = setInterval(excBot, 1500);
  async function excBot() {
    const list = await CexKrakenLUNC.find({ open: { $gte: 10 } })
      .skip(count)
      .limit(1);

    //Se for uma compra tranforma LUNc para USTC

    await Market.sell(
      { price: undefined, amount: list[0].buyvolume, denom: "LUNC/USDT" },
      GlobalTokenBot02
    );
    console.log("sell: ", list[0].buyvolume, " - ", coin.Price, " - LUNC: ");

    const USDT = coin.Price * list[0].buyvolume;
    // const datareturn = await Market.buy(
    //   { price: undefined, amount: USDT, denom: "LUNC/USDT" },
    //   GlobalTokenBot01
    // );
    // console.log(
    //   "buy: ",
    //   list[0].buyvolume,
    //   " - ",
    //   coin.Price,
    //   " - USDT: ",
    //   USDT
    // );
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
botLunc02();
