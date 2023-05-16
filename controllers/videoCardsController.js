const VideoCard = require('../models/videoCard');
const Specifications = require('../models/specifications');
const Stock = require('../models/stock');
const { body, validationResult } = require('express-validator');

function validators() {
    return [
        body("manufacturer", "Manufacturer must not be empty").isLength({ min: 1 }).trim().escape(),
        body("model", "Model must not be empty").isLength({ min: 1 }).trim().escape(),

        body("memory", "Memory type must be in the format '8GB, 10GB'(GB must be a capital letter)")
            .matches(/^\d{1,2}GB$/)
            .trim()
            .escape(),
        body("memoryType", "Memory type must be in the format 'GDDR5, GDDR6, GDDR7'(GDDR must be capital letters)")
            .matches(/^GDDR[5-7]$/)
            .trim()
            .escape(),
        body("GPUClockSpeed", "GPU Clock Speed must be in the format '1234Mhz'(M and H must be capital letters)")
            .matches(/^\d{3,4}MHz$/)
            .trim()
            .escape(),
        body("GPUBoostClockSpeed", "GPU Boost Clock Speed must be in the format '1234Mhz'(M and H must be capital letters)")
            .matches(/^\d{3,4}MHz$/)
            .trim()
            .escape(),

        body("quantity", "Quantity must not be empty").isLength({ min: 1 }).trim().escape(),
        body("isAvailable", "Is Available must be true or false").trim().escape(),
        body("videoCardPrice", "Video Card Price must be a number").isNumeric().trim().escape()
    ];
};

exports.videoCard_list = async (req, res, next) => {
    try {
        const allVideoCards = await VideoCard.find();
        res.render("videoCard_list", { videoCards_list: allVideoCards });
    }
    catch (err) {
        console.error(err);
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
                quantity: videoCard.stock.quantity,
                videoCardUrl: videoCard.url
            }
        );
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};

exports.videoCard_create_get = (req, res, next) => {
    try {
        res.render("videoCard_create");
    } catch (err) {
        console.error(err)
        next(err)
    }
};

exports.videoCard_create_post = [
    validators(),

    async function (req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.render("videoCard_create", { errors: errors.array() })
            }

            const [specifications, stock] = await Promise.all([
                new Specifications({
                    memory: req.body.memory,
                    memoryType: req.body.memoryType,
                    GPUClockSpeed: req.body.GPUClockSpeed,
                    GPUBoostClockSpeed: req.body.GPUClockSpeed
                }),
                new Stock({ quantity: req.body.quantity, isAvailable: Boolean(req.body.isAvailable) })
            ]);

            const videoCard = new VideoCard({
                manufacturer: req.body.manufacturer,
                model: req.body.model,
                specifications: specifications._id,
                stock: stock._id,
                price: req.body.videoCardPrice
            });

            await specifications.save();
            await stock.save();
            await videoCard.save();

            res.redirect("/video-cards");
        }
        catch (err) {
            console.error(err)
            next(err)
        }
    }
];

exports.videoCard_delete_get = (req, res, next) => {
    try {
        res.render("videoCard_delete", { lastPage: req.headers.referer });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};

exports.videoCard_delete_post = async (req, res, next) => {
    try {
        const videoCard = await VideoCard.findById(req.params.id);
        await Specifications.findByIdAndRemove(videoCard.specifications._id);
        await Stock.findByIdAndRemove(videoCard.stock._id);
        await VideoCard.findByIdAndRemove(req.params.id);
        res.redirect("/video-cards");
    }
    catch (error) {
        console.error(err);
        next(err);
    }
};

exports.videoCard_update_get = async (req, res, next) => {
    try {
        const videoCard = await VideoCard.findById(req.params.id).populate("specifications").populate("stock")
        return res.render("videoCard_create", {
            manufacturer: videoCard.manufacturer,
            model: videoCard.model,
            memory: videoCard.specifications.memory,
            memoryType: videoCard.specifications.memoryType,
            GPUClockSpeed: videoCard.specifications.GPUClockSpeed,
            GPUBoostClockSpeed: videoCard.specifications.GPUBoostClockSpeed,
            quantity: videoCard.stock.quantity,
            videoCardPrice: videoCard.price
        })
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.videoCard_update_post = [
    validators(),

    async function (req, res, next) {
        try {
            const videoCard = await VideoCard.findById(req.params.id).populate("specifications").populate("stock");
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.render(
                    "videoCard_create",
                    {
                        errors: errors.array(),
                        manufacturer: videoCard.manufacturer,
                        model: videoCard.model,
                        memory: videoCard.specifications.memory,
                        memoryType: videoCard.specifications.memoryType,
                        GPUClockSpeed: videoCard.specifications.GPUClockSpeed,
                        GPUBoostClockSpeed: videoCard.specifications.GPUBoostClockSpeed,
                        quantity: videoCard.stock.quantity,
                        videoCardPrice: videoCard.price
                    }
                )
            }

            const [specifications, stock] = await Promise.all([
                Specifications.findByIdAndUpdate(
                    videoCard.specifications._id,
                    {
                        memory: req.body.memory,
                        memoryType: req.body.memoryType,
                        GPUClockSpeed: req.body.GPUClockSpeed,
                        GPUBoostClockSpeed: req.body.GPUBoostClockSpeed
                    }
                ),
                Stock.findByIdAndUpdate(
                    videoCard.stock._id,
                    {
                        quantity: req.body.quantity,
                        isAvailable: req.body.isAvailable
                    }
                )
            ]);

            await VideoCard.findByIdAndUpdate(
                req.params.id,
                {
                    manufacturer: req.body.manufacturer,
                    model: req.body.model,
                    specifications: specifications._id,
                    stock: stock._id,
                    price: req.body.videoCardPrice
                }
            );

            return res.redirect(videoCard.url)
        }
        catch (err) {
            console.error(err);
            next(err)
        }
    }
];