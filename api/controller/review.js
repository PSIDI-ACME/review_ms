const client = require("./dbConnect");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const url = require('url');


exports.get_reviews = (req, res, next) => {
    const queryObject = url.parse(req.url, true).query;
    const status = queryObject.status;
    const customerId = queryObject.customerId;
    const productId = queryObject.productId;
    const defaultStatus = "accepted";

    var links = new Object;
    var embedded = new Object;

    if (productId != undefined) {
        links.self = "https://reviews-psidi.herokuapp.com/reviews?productId=" + productId;
        links.next = "https://reviews-psidi.herokuapp.com/reviews?productId=" + productId + "&page=2";
        links.start = "https://reviews-psidi.herokuapp.com/reviews?productId=" + productId + "&page=1";
        links.previous = "https://reviews-psidi.herokuapp.com/reviews?productId=" + productId + "&page=1";
        client
            .query('SELECT * FROM reviews.reviews WHERE "objectid" = $1 AND "status" = $2', [productId, defaultStatus])
            .then(docs => {
                var items = [];
                var reviews = [];
                var links_temp = new Object;
                for (i = 0; i < docs.rows.length; i++) {
                    items.push("https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id)
                    links_temp.self = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id;
                    links_temp.customerId = "https://psidi-customers.herokuapp.com/v1/customer/" + docs.rows[i].authorid;
                    links_temp.product = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].objectid;
                    links_temp.funnyfact = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].funnyfact;
                    links_temp.accept = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/accepted";
                    links_temp.reject = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/rejected";
                    links_temp.report = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/report";
                    links_temp.vote = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/vote";
                    reviews.push(links_temp);
                }
                links.items = items;
                var size = docs.rows.length;
                embedded.reviews = reviews;
                res.status(200).json({
                    "_links": links,
                    "size": size,
                    "_embedded": embedded
                })
            })
            .catch(e => console.error(e.stack))
    } else if (customerId != undefined) {
        links.self = "https://reviews-psidi.herokuapp.com/reviews?customerId=" + customerId;
        links.next = "https://reviews-psidi.herokuapp.com/reviews?customerId=" + customerId + "&page=2";
        links.start = "https://reviews-psidi.herokuapp.com/reviews?customerId=" + customerId + "&page=1";
        links.previous = "https://reviews-psidi.herokuapp.com/reviews?customerId=" + customerId + "&page=1";
        links.customer = "https://psidi-customers.herokuapp.com/v1/customer/" + customerId;
        client
            .query('SELECT * FROM reviews.reviews WHERE "authorid" = $1 AND "status" = $2', [customerId, defaultStatus])
            .then(docs => {
                var items = [];
                var reviews = [];
                var links_temp = new Object;
                for (i = 0; i < docs.rows.length; i++) {
                    items.push("https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id)
                    links_temp.self = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id;
                    links_temp.customerId = "https://psidi-customers.herokuapp.com/v1/customer/" + docs.rows[i].authorid;
                    links_temp.product = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].objectid;
                    links_temp.funnyfact = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].funnyfact;
                    links_temp.accept = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/accepted";
                    links_temp.reject = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/rejected";
                    links_temp.report = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/report";
                    links_temp.vote = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/vote";
                    reviews.push(links_temp);
                }
                links.items = items;
                var size = docs.rows.length;
                embedded.reviews = reviews;
                res.status(200).json({
                    "_links": links,
                    "size": size,
                    "_embedded": embedded
                })
            })
            .catch(e => console.error(e.stack))
    } else {
        links.self = "https://reviews-psidi.herokuapp.com/reviews?status=" + status;
        links.next = "https://reviews-psidi.herokuapp.com/reviews?status=" + status + "&page=2";
        links.start = "https://reviews-psidi.herokuapp.com/reviews?status=" + status + "&page=1";
        links.previous = "https://reviews-psidi.herokuapp.com/reviews?status=" + status + "&page=1";
        client
            .query('SELECT * FROM reviews.reviews WHERE status = $1', [status])
            .then(docs => {
                var items = [];
                var reviews = [];
                var links_temp = new Object;
                for (i = 0; i < docs.rows.length; i++) {
                    items.push("https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id)
                    links_temp.self = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id;
                    links_temp.customerId = "https://psidi-customers.herokuapp.com/v1/customer/" + docs.rows[i].authorid;
                    links_temp.product = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].objectid;
                    links_temp.funnyfact = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].funnyfact;
                    links_temp.accept = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/accepted";
                    links_temp.reject = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/rejected";
                    links_temp.report = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/report";
                    links_temp.vote = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/vote";
                    reviews.push(links_temp);
                }
                links.items = items;
                var size = docs.rows.length;
                embedded.reviews = reviews;
                res.status(200).json({
                    "_links": links,
                    "size": size,
                    "_embedded": embedded
                })
            })
            .catch(e => console.error(e.stack))
    }

}

exports.post_review = (req, res, next) => {

    const date = getDate().split("/");
    const url = "http://numbersapi.com/" + date[1] + "/" + date[2] + "/date";
    const Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var response = Http.responseText;
            client
                .query('CREATE SCHEMA IF NOT EXISTS "reviews"; CREATE TABLE IF NOT EXISTS "reviews"."reviews" (id SERIAL PRIMARY KEY, status VARCHAR(40) NOT NULL, score decimal NOT NULL, authorID integer NOT NULL, objectID integer NOT NULL, reviewDescription VARCHAR(250), publishingDate date, funnyFact VARCHAR(200), votes integer NOT NULL, reports integer NOT NULL, voteslist integer[] NOT NULL, reportlist integer[] NOT NULL);');
            client
                .query("INSERT INTO reviews.reviews (status, score, authorid, objectid, reviewdescription, publishingdate, funnyfact, votes, reports, voteslist, reportlist) VALUES ('pending', '" + req.body.score + "', '" + req.body.customerId + "', '" + req.body.productId + "', '" + req.body.reviewDescription + "', '" + getDate() + "', '" + response + "', '0', '0', '{}', '{}') RETURNING id")
                .then(docs => res.status(201).json({
                    "Status": "202",
                    "Message": "Review sent for evaluation"
                }))
                .catch(e => console.error(e.stack))
        }
    }
    Http.send();




    /* function pushUserReview(reviewId) {
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
                res.status(201).json({ "Status": "201", "Message": "Review created successfully", "Review": "https://reviews-psidi.herokuapp.com/reviews/" + reviewId });
            }
        }
        Http.send();
    } */
}

exports.get_review_by_ID = (req, res, next) => {
    const queryObject = url.parse(req.url, true).query;
    const code = queryObject.code;
    const id = req.params.reviewID;
    var status = "accepted"
    if (code == "asd324") {
        client
            .query('SELECT * FROM reviews.reviews WHERE id = ' + id)
            .then(docs => {
                var review = docs.rows;
                var links = new Object;
                links.self = "https://reviews-psidi.herokuapp.com/reviews/" + id;
                links.accept = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/accepted";
                links.reject = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/rejected";
                links.report = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/report";
                links.vote = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/vote";
                links.customer = "https://psidi-customers.herokuapp.com/v1/customers/" + review[0].authorid;
                links.product = "http://catalog-psidi.herokuapp.com/products/" + review[0].objectid;
                if ((!Array.isArray(review) || !review.length)) {
                    res.status(404).json({
                        "Status": "404",
                        "Message": "Review not found"
                    })
                } else {
                    res.status(200).json({
                        "_links": links,
                        "reviewdescription": review[0].reviewdescription,
                        "publishingdate": review[0].publishingdate,
                        "funnyfact": review[0].funnyfact
                    });
                }
            })
            .catch(e => console.error(e.stack))
    } else {
        client
            .query('SELECT * FROM reviews.reviews WHERE id = ' + id + ' AND "status" = $1', [status])
            .then(docs => {
                var review = docs.rows;
                if (review[0] != undefined) {
                    var links = new Object;
                    links.self = "https://reviews-psidi.herokuapp.com/reviews/" + id;
                    links.accept = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/accepted";
                    links.reject = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/rejected";
                    links.report = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/report";
                    links.vote = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/vote";
                    links.customer = "https://psidi-customers.herokuapp.com/v1/customers/" + review[0].authorid;
                    links.product = "http://catalog-psidi.herokuapp.com/products/" + review[0].objectid;
                    if ((!Array.isArray(review) || !review.length)) {
                        res.status(404).json({
                            "Status": "404",
                            "Message": "Review not found"
                        })
                    } else {
                        res.status(200).json({
                            "_links": links,
                            "reviewdescription": review[0].reviewdescription,
                            "publishingdate": review[0].publishingdate,
                            "funnyfact": review[0].funnyfact
                        });
                    }
                } else {
                    res.status(404).json({
                        "Status": "404",
                        "Message": "Review not found"
                    })
                }

            })
            .catch(e => console.error(e.stack))
    }

}

exports.get_pending_reviews = (req, res, next) => {
    const status = "pending";
    var links = new Object;
    var embedded = new Object;
    links.self = "https://reviews-psidi.herokuapp.com/reviews?status=" + status;
    links.next = "https://reviews-psidi.herokuapp.com/reviews?status=" + status + "&page=2";
    links.start = "https://reviews-psidi.herokuapp.com/reviews?status=" + status + "&page=1";
    links.previous = "https://reviews-psidi.herokuapp.com/reviews?status=" + status + "&page=1";
    client
        .query('SELECT * FROM reviews.reviews WHERE status = $1', [status])
        .then(docs => {
            var items = [];
            var reviews = [];
            var links_temp = new Object;
            for (i = 0; i < docs.rows.length; i++) {
                items.push("https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id)
                links_temp.self = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id;
                links_temp.customerId = "https://psidi-customers.herokuapp.com/v1/customer/" + docs.rows[i].authorid;
                links_temp.product = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].objectid;
                links_temp.funnyfact = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].funnyfact;
                links_temp.accept = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/accepted";
                links_temp.reject = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/rejected";
                links_temp.report = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/report";
                links_temp.vote = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/vote";
                reviews.push(links_temp);
            }
            links.items = items;
            var size = docs.rows.length;
            embedded.reviews = reviews;
            res.status(200).json({
                "_links": links,
                "size": size,
                "_embedded": embedded
            })
        })
        .catch(e => console.error(e.stack))

}

exports.report_review = (req, res, next) => {
    const id = req.params.reviewID;
    const queryObject = url.parse(req.url, true).query;
    const user = queryObject.user;
    client
        .query('SELECT * FROM reviews.reviews WHERE "id" = $1', [id])
        .then(docs => {
            var array = docs.rows[0].reportlist;
            if (!array.includes(parseInt(user))) {
                var links = new Object;
                links.self = "https://reviews-psidi.herokuapp.com/reviews/" + id;
                links.report = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/report";
                links.vote = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/vote";
                links.customer = "https://psidi-customers.herokuapp.com/v1/customers/" + docs.rows[0].authorid;
                links.product = "http://catalog-psidi.herokuapp.com/products/" + docs.rows[0].objectid;
                var reports = docs.rows[0].reports + 1;
                array.push(parseInt(user));
                client
                    .query("UPDATE reviews.reviews SET reports = " + reports + ", reportlist = array_append(reportlist, " + parseInt(user) + ") WHERE id = " + id)
                    .then(docs => res.status(201).json({
                        "_links": links
                    }))
                    .catch(e => console.error(e.stack))
            } else {
                res.status(201).json({
                    "Status": 403,
                    "Message": "You have already reported this review"
                })
            }
        })
        .catch(e => {
            res.status(404).json({
                "Status": 404,
                "Message": "Review not found"
            })
            console.error(e.stack)
        });
}

exports.vote_review = (req, res, next) => {
    const id = req.params.reviewID;
    const queryObject = url.parse(req.url, true).query;
    const user = queryObject.user;
    client
        .query('SELECT * FROM reviews.reviews WHERE "id" = $1', [id])
        .then(docs => {
            var array = docs.rows[0].voteslist;
            if (!array.includes(parseInt(user))) {
                var links = new Object;
                links.self = "https://reviews-psidi.herokuapp.com/reviews/" + id;
                links.report = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/report";
                links.vote = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/vote";
                links.customer = "https://psidi-customers.herokuapp.com/v1/customers/" + docs.rows[0].authorid;
                links.product = "http://catalog-psidi.herokuapp.com/products/" + docs.rows[0].objectid;
                var votes = docs.rows[0].votes + 1;
                array.push(parseInt(user));
                client
                    .query("UPDATE reviews.reviews SET votes = " + votes + ", voteslist = array_append(voteslist, " + parseInt(user) + ") WHERE id = " + id)
                    .then(docs => res.status(201).json({
                        "_links": links
                    }))
                    .catch(e => console.error(e.stack))
            } else {
                res.status(201).json({
                    "Status": 403,
                    "Message": "You have already voted for this review"
                })
            }
        })
        .catch(e => {
            res.status(404).json({
                "Status": 404,
                "Message": "Review not found"
            })
            console.error(e.stack)
        });

}

exports.update_review_accepted = (req, res, next) => {
    const id = req.params.reviewID;
    const date = getDate().split("/");
    //const reviewURL = "http://localhost:3000/reviews/" + id + "?code=asd324";
    const reviewURL = "https://reviews-psidi.herokuapp.com/reviews/" + id + "?code=asd324";
    const Http = new XMLHttpRequest();

    Http.open("GET", reviewURL);
    Http.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var obj = JSON.parse(this.responseText);
            console.log(obj);
            var links = new Object;
            links.self = "https://reviews-psidi.herokuapp.com/reviews/" + id;
            links.accept = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/accepted";
            links.reject = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/rejected";
            links.report = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/report";
            links.vote = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/vote";
            links.customer = "https://psidi-customers.herokuapp.com/v1/customers/" + obj.Review.authorid;
            links.product = "http://catalog-psidi.herokuapp.com/products/" + obj.Review.objectid;
            client
                .query("UPDATE reviews.reviews SET status = 'accepted' WHERE id = " + id)
                .then(docs => res.status(201).json({
                    "_links": links
                }))
                .catch(e => console.error(e.stack))
        }
    }
    Http.send();

}

exports.update_review_rejected = (req, res, next) => {
    const id = req.params.reviewID;
    const date = getDate().split("/");
    //const reviewURL = "http://localhost:3000/reviews/" + id + "?code=asd324";
    const reviewURL = "https://reviews-psidi.herokuapp.com/reviews/" + id + "?code=asd324";
    const Http = new XMLHttpRequest();

    Http.open("GET", reviewURL);
    Http.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var obj = JSON.parse(this.responseText);
            console.log(obj);
            var links = new Object;
            links.self = "https://reviews-psidi.herokuapp.com/reviews/" + id;
            links.accept = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/accepted";
            links.reject = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/rejected";
            links.report = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/report";
            links.vote = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/vote";
            links.customer = "https://psidi-customers.herokuapp.com/v1/customers/" + obj.Review.authorid;
            links.product = "http://catalog-psidi.herokuapp.com/products/" + obj.Review.objectid;
            client
                .query("UPDATE reviews.reviews SET status = 'rejected' WHERE id = " + id)
                .then(docs => res.status(201).json({
                    "_links": links
                }))
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