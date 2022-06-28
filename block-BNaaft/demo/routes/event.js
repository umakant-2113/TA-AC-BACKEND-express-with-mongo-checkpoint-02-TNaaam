const express = require('express');
const router = express.Router();
let Event = require('../models/Event');
let moment=require("moment");
let Comment = require('../models/Comment');
let {format}=require("date-fns");

//list of events

router.get('/', (req, res, next) => {
  let { location_name, category_name } = req.query;
  let allCategory = [];
  let locations = [];

  let obj = {};
  Event.find({}, (err, events) => {
    if (err) return next(err);
    // category find
    events.forEach((elm) => {
      elm.category_name.forEach((elm) => {
        allCategory.push(elm);
      });
    });
    allCategory = Array.from(new Set(allCategory));
    //  location find

    events.forEach((elm) => {
      locations.push(elm.location_name);
    });
    locations = Array.from(new Set(locations));
  });
  if (location_name) {
    obj = { location_name: location_name };
  } else if (category_name) {
    obj = { category_name: category_name };
  } else if (req.query.startDate) {
    console.log(req.query);
    obj = {
      $and: [
        { startDate: { $gte: req.query.startDate } },
        { endDate: { $lte: req.query.endDate } },
      ],
    };
  }

  Event.find(obj, (err, events) => {
    if (err) return next(err);
    res.render('event', { events, allCategory, locations });
  });
});

// add events
router.get('/new', (req, res, next) => {
  res.render('form');
});

// capture the all event

router.post('/new', (req, res, next) => {
  console.log(req.body);
  req.body.category_name = req.body.category_name.split(' ');
  Event.create(req.body, (err, event) => {
    if (err) return next(err);
    res.redirect('/events');
  });
});

// edit form data
router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Event.findById(id, (err, events) => {
    if (err) return next(err);
    res.render('update', { events,format });
  });
});

// post updated data

router.post('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Event.findByIdAndUpdate(id, req.body, (err, events) => {
    if (err) return next(err);
    res.redirect('/events/' + id + '/details');
  });
});

// delete data

router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Event.findByIdAndDelete(id, (err, event) => {
    if (err) return next(err);
    res.redirect('/events');
  });
});

// likes increment

router.get('/:id/likes', (req, res, next) => {
  let id = req.params.id;
  Event.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, events) => {
    if (err) return next(err);
    res.redirect('/events/' + id + '/details');
  });
});

router.get('/:id/dislikes', (req, res, next) => {
  let id = req.params.id;
  Event.findById(id, (err, events) => {
    if (events.likes > 0) {
      Event.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, events) => {
        if (err) return next(err);
        res.redirect('/events/' + id + '/details');
      });
    }
  });
});

// add comment
router.post('/:id/comments', (req, res, next) => {
  console.log(req.body);
  let id = req.params.id;
  req.body.eventId = id;
  Comment.create(req.body, (err, comments) => {
    if (err) return next(err);
    res.redirect('/events/' + id + '/details');
  });
});

// details page

router.get('/:id/details', (req, res, next) => {
  let id = req.params.id;
  Event.findById(id, (err, events) => {
             
    Comment.find({ eventId: id }, (err, comments) => {
      if (err) return next(err);
      res.render('details', { events, comments,format });
    });
  });
});

module.exports = router;
