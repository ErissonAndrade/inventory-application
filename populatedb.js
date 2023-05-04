#! /usr/bin/env node

const userArgs = process.argv.slice(2);

const Specifications = require("./models/specifications");  
const VideoCard = require("./models/videoCard");
const Stock = require("./models/stock");

const allSpecifications = [];
const stocks = [];
const videoCards = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); 

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB, {dbName: "inventory-application"});
  console.log("Debug: Should be connected?");
  await createSpecifications();
  await createStocks();
  await createVideoCards();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
};

async function specificationsCreate(
  memory,
  memoryType,
  GPUClockSpeed,
  GPUBoostClockSpeed
) {  
  const specifications = new Specifications({
    memory: memory,
    memoryType: memoryType,
    GPUClockSpeed: GPUClockSpeed,
    GPUBoostClockSpeed: GPUBoostClockSpeed
  });

  await specifications.save();
  allSpecifications.push(specifications);
};

async function stockCreate(isAvailable, quantity) {  
  const stock = new Stock({
    isAvailable: isAvailable,
    quantity: quantity,
  });
  await stock.save();
  stocks.push(stock);
};

async function videoCardCreate(
  manufacturer,
  model,
  specifications,
  stock,
  price
) {
  const videoCard = new VideoCard({ 
    manufacturer: manufacturer,
    model: model,
    specifications: specifications,
    stock: stock,
    price: price
  });
  await videoCard.save();
  videoCards.push(videoCard);
  console.log(`Added videoCard: ${manufacturer} ${model}`);
};

async function createSpecifications () {
  console.log("Creating Specifications")
  await Promise.all([
    specificationsCreate(
      "8GB",
      "GDDR6",
      "1365 MHz",
      "1680 MHz",
    ),
    specificationsCreate(
      "8GB",
      "GDDR6",
      "1410 MHz",
      "1750 MHz",
    ),
    specificationsCreate(
      "8GB",
      "GDDR6",
      "1515 MHz",
      "1710 MHz",
    ),
    specificationsCreate(
      "12GB",
      "GDDR6",
      "1320 MHz",
      "1777 MHz",
    ),
    specificationsCreate(
      "8GB",
      "GDDR6",
      "1500 MHz",
      "1725 MHz",
    ),
  ])
};

async function createStocks () {
  console.log("Creating Stocks");
  await Promise.all([
    stockCreate(
      true,
      1
    ),
    stockCreate(
      true,
      3
    ),
    stockCreate(
      false,
      0
    ),
    stockCreate(
      true,
      7
    ),
    stockCreate(
      true,
      2
    ),
  ]);
};

async function createVideoCards () {
  console.log("Creating Video Cards");
  await Promise.all([
    videoCardCreate(
      "Nvidia",
      "RTX 2060",
      allSpecifications[0],
      stocks[0],
      239.90
    ),
    videoCardCreate(
      "Nvidia",
      "RTX 2070",
      allSpecifications[1],
      stocks[1],
      319.90
    ),
    videoCardCreate(
      "Nvidia",
      "RTX 2080",
      allSpecifications[2],
      stocks[2],
      369.90
    ),
    videoCardCreate(
      "Nvidia",
      "RTX 3060",
      allSpecifications[3],
      stocks[3],
      379.99
    ),
    videoCardCreate(
      "Nvidia",
      "RTX 3070",
      allSpecifications[4],
      stocks[4],
      529.29
    )
  ]);
};

