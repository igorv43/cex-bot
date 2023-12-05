const mongoose = require("../db/conn");
const { Schema } = mongoose;
const CexKrakenLUNC = mongoose.model(
  "CexKrakenLUNC",
  new Schema(
    {
      date: { type: String },
      open: { type: String },
      close: { type: String },
      volume: { type: String },
      low: { type: String },
      high: { type: String },
      sellvolume: { type: String },
      buyvolume: { type: String },
      sellcount: { type: String },
      buycount: { type: String },
      count: { type: String },
    },
    { timestamps: true }
  )
);
module.exports = CexKrakenLUNC;
