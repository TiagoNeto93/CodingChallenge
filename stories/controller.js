const express = require("express");
const router = express.Router();
const storyService = require("./service");


// router.post("/add/:date", addStoriesFromDate);
// router.get("/date/:date", getByDate);
router.get("/topten", getTopTen);

module.exports = router;


// function register(req, res, next) {
//   storyService
//     .create(req.body)
//     .then(() => res.json({}))
//     .catch((err) => next(err));
// }

// function getAll(req, res, next) {
//   storyService
//     .getAll()
//     .then((users) => res.json(users))
//     .catch((err) => next(err));
// }

function addStoriesFromDate(req, res, next) {
  const date = req.params.date;
  storyService
    .populateWeekStoriesFromStartingDate(date)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function getByDate (req, res, next) {
  const date = req.params.date;
  storyService
    .getStoriesByDate(date)
    .then((stories) => res.json({stories}))
    .catch((err) => next(err));
}


function getTopTen (req, res, next) {
  storyService
    .getTopTenWordsByDate()
    .then((words) => res.json({...words}))
    .catch((err) => next(err));
}

