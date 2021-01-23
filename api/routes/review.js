const express = require("express");
const router = express.Router();

var ReviewController = require("../controller/review");

router.get("/", ReviewController.get_reviews);

router.post("/", ReviewController.post_review);

router.get("/:reviewID", ReviewController.get_review_by_ID);

router.get("/status/pending", ReviewController.get_pending_reviews);

router.get("/:reviewID/accepted", ReviewController.update_review_accepted);

router.get("/:reviewID/rejected", ReviewController.update_review_rejected);

router.get("/:reviewID/report", ReviewController.report_review);

router.get("/:reviewID/vote", ReviewController.vote_review);

module.exports = router;