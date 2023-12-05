const csv = require("csvtojson");
var fs = require("fs");
var CexKrakenLUNC = require("../models/CexKrakenLUNC");
const TransactionCEXImport = () => {
  const csvFilePath = "luna_kraken_c.csv";

  csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
      CexKrakenLUNC.insertMany(jsonObj)
        .then(function () {
          console.log("Success");
        })
        .catch(function (error) {
          console.log(error);
        });
      // console.log(jsonObj);
      /**
       * [
       * 	{a:"1", b:"2", c:"3"},
       * 	{a:"4", b:"5". c:"6"}
       * ]
       */
    });
};
//module.exports = TransactionCEXImport;
TransactionCEXImport();
