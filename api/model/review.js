function Review (id, status, score, reviewDescription, publishingDate, funnyFact) {
    this.id = id;
    this.status = status;
    this.score = score;
    this.reviewDescription = reviewDescription;
    this.publishingDate = publishingDate;
    this.funnyFact = funnyFact;
}

module.exports = Review;