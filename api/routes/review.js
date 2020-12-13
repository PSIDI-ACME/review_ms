const express = require("express");
const router = express.Router();

var ReviewController = require("../controller/review");

router.get("/", ReviewController.get_reviews);

router.post("/", ReviewController.post_review);

router.get("/:reviewID", ReviewController.get_review_by_ID);

router.put("/:reviewID", ReviewController.update_review);

module.exports = router;