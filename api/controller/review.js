const client = require("./dbConnect");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const url = require('url');


exports.get_reviews = (req, res, next) => {
    const queryObject = url.parse(req.url, true).query;
    const status = queryObject.status;
    const customerId = queryObject.customerId;
    const productId = queryObject.productId;

    if (customerId != undefined) {
        client
        .query('SELECT * FROM "Customers"."Customers" WHERE id = $1', [customerId])
        .then(docs => res.status(200).json(docs.rows))
        .catch(e => console.error(e.stack))
    } else if (productId != undefined) {
        client
        .query('SELECT * FROM "Products"."Products" WHERE "productId" = $1', [productId])
        .then(docs => res.status(200).json(docs.rows))
        .catch(e => console.error(e.stack))
    } else {
        client
        .query('SELECT * FROM "reviews"."reviews" WHERE status = $1', [status])
        .then(docs => res.status(200).json(docs.rows))
        .catch(e => console.error(e.stack))
    }
    
}

exports.post_review = (req, res, next) => {
    client
        .query('CREATE SCHEMA IF NOT EXISTS Reviews; CREATE TABLE IF NOT EXISTS Reviews.Reviews (id SERIAL PRIMARY KEY, status VARCHAR(40) NOT NULL, score integer NOT NULL, reviewDescription VARCHAR(250), publishingDate date, funnyFact VARCHAR(200));');
    client
        .query("INSERT INTO reviews.reviews (status, score, reviewDescription, publishingDate, funnyFact) VALUES ('pending', '" + req.body.score + "', '" + req.body.reviewDescription + "', '" + getDate() + "', 'default') RETURNING id",)
        .then(docs => pushUserReview(docs.rows[0].id))
        .catch(e => console.error(e.stack))

    function pushUserReview(reviewId) {
        const url = 'http://psidi-customers.herokuapp.com/v1/customers/' + req.body.customerId + '?review=https://reviews-psidi.herokuapp.com/reviews/' + reviewId;
        const Http = new XMLHttpRequest();
        Http.open("PUT", url);
        Http.onreadystatechange = function () {
            if (this.readyState === 4) {
                pushProductReview(reviewId);
            }
        }
        Http.send();
    }

    function pushProductReview(reviewId) {
        const url = 'http://catalog-psidi.herokuapp.com/products/' + req.body.productId + '?review=https://reviews-psidi.herokuapp.com/reviews/' + reviewId;
        const Http = new XMLHttpRequest();
        Http.open("PATCH", url);
        Http.onreadystatechange = function () {
            if (this.readyState === 4) {
                res.status(201).json({ "Status": "201", "Message": "Review created successfully" });
            }
        }
        Http.send();
    }
}

exports.get_review_by_ID = (req, res, next) => {
    const id = req.params.reviewID;
    client
        .query('SELECT * FROM "reviews"."reviews" WHERE id = ' + id)
        .then(docs => res.status(200).json(docs.rows))
        .catch(e => console.error(e.stack))
}

exports.update_review = (req, res, next) => {
    const id = req.params.reviewID;
    const date = getDate().split("/");
    const url = "http://numbersapi.com/" + date[1] + "/" + date[2] + "/date";
    const Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var response = Http.responseText;
            client
                .query("UPDATE reviews.reviews SET status = '" + req.body.status + "', funnyfact = '" + response + "' WHERE id = " + id)
                .then(docs => res.status(201).json({ "Status": "200", "Message": "Review updated" }))
                .catch(e => console.error(e.stack))
        }
    }
    Http.send();
}

function getDate() {
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + '/' + mm + '/' + dd;
    return today;
}