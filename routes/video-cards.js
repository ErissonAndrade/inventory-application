const express = require('express');
const router = express.Router();

const videoCard_controller = require('../controllers/videoCardsController');

router.get("/", videoCard_controller.videoCard_list);

router.get("/create", videoCard_controller.videoCard_create_get);
router.post("/create", videoCard_controller.videoCard_create_post);

router.get("/:id/update", videoCard_controller.videoCard_update_get);
router.post("/:id/update", videoCard_controller.videoCard_update_post);

router.get("/:id/delete", videoCard_controller.videoCard_delete_get);
router.post("/:id/delete", videoCard_controller.videoCard_delete_post);

router.get("/:id", videoCard_controller.videoCard_details);

module.exports = router;