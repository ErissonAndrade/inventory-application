const VideoCard = require('../models/videoCard');
const Specifications = require('../models/specifications');
const Stock = require('../models/stock');
const { body, validationResult } = require('express-validator');

exports.videoCard_list = async (req, res, next) => {
    try{
        const allVideoCards = await VideoCard.find();
        console.log(allVideoCards.map(x => x.url))
        res.render("videoCard_list", { videoCards_list: allVideoCards} );
    }
    catch(err) {
        console.log(err);
        next(err);
    }
};

exports.videoCard_details = async (req, res, next) => {
    try {
        const videoCard = await VideoCard.findById(req.params.id).populate("specifications").populate("stock");
        res.render(
            "videoCard_details",
            {
                title: videoCard.title,
                memory: videoCard.specifications.memory,
                memoryType: videoCard.specifications.memoryType,
                GPUClockSpeed: videoCard.specifications.GPUClockSpeed,
                GPUBoostClockSpeed: videoCard.specifications.GPUBoostClockSpeed,
                isAvailable: videoCard.stock.isAvailable,
                quantity: videoCard.stock.quantity
            }
        );
    }
    catch(err) {
        console.log(err);
        next(err);
    }
};

exports.videoCard_create_get = (req, res, next) => {
    res.render("videoCard_create");
};

exports.videoCard_create_post = [
    body("manufacturer", "Manufacturer must not be empty").isLength({min: 1}).trim().escape(),
    body("model", "Model must not be empty").isLength({ min: 1 }).trim().escape(),

    body("memory", "Memory type must be in the format '8GB, 10GB'(GB must be a capital letter)")
    .matches(/^\d{1,2}GB$/)
    .trim()
    .escape(),
    body("memoryType", "Memory type must be in the format 'GDDR5, GDDR6, GDDR7'(GDDR must be capital letters)")
    .matches(/^GDDR[5-7]$/)
    .trim()
    .escape(),
    body("GPUClockSpeed", "GPU Clock Speed must be in the format '1234Mhz'(M must be a capital letter)")
    .matches(/^\d{3,4}Mhz$/)
    .trim()
    .escape(),
    body("GPUBoostClockSpeed", "GPU Boost Clock Speed must be in the format '1234Mhz'(M must be a capital letter)")
    .matches(/^\d{3,4}Mhz$/)
    .trim()
    .escape(),

    body("quantity", "Quantity must not be empty").isLength({ min: 1 }).trim().escape(),
    body("isAvailable", "Is Available must be true or false").trim().escape(),
    body("videoCardPrice", "Video Card Price must be a number").isNumeric().trim().escape(),

    async function (req, res, next) {
        try {
            const errors = validationResult(req);

            if(errors) {
                return res.render("videoCard_create", { errors: errors.array() })
            }

            const [specifications, stock] = await Promise.all([
                new Specifications({
                    memory: req.body.memory,
                    memoryType: req.body.memoryType,
                    GPUClockSpeed: req.body.GPUClockSpeed,
                    GPUBoostClockSpeed: req.body.GPUClockSpeed
                }),
                new Stock({ quantity: req.body.quantity, isAvailable: req.body.isAvailable })
            ]);

            await specifications.save();
            await stock.save();


            const videoCard = new VideoCard({
                manufacturer: req.body.manufacturer,
                model: req.body.model,
                specifications: specifications._id,
                stock: stock._id,
                price: req.body.videoCardPrice
            });

            await videoCard.save();
            console.log(`Available: ${req.body.isAvailable}`)
            
        }
        catch(err) {
            next(err)
        }
        
    }
];

exports.videoCard_delete_get = (req, res, next) => {
    res.send("This is where you can see everything you're able to delete");
};

exports.videoCard_delete_post = (req, res, next) => {
    res.send("This is the action of deleting a video card in the db");
};

exports.videoCard_update_get = (req, res, next) => {
    res.send("This is where you can see everything you're able to update");
};

exports.videoCard_update_post = (req, res, next) => {
    res.send("This is the action of updating a video card in db");
};