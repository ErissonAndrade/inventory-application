const VideoCard = require('../models/videoCard');
const Specifications = require('../models/specifications')
const Stock = require('../models/stock')

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
    res.send("This is where the form is shown for creating a new video card");
};

exports.videoCard_create_post = (req, res, next) => {
    res.send("This is the action of creating the video card in the db");
};

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