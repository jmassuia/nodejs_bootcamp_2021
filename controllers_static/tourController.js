const fs = require('fs');
const path = require('path');

const tours = JSON.parse(
  fs.readFileSync(
    path.resolve('..', 'starter', 'dev-data', 'data', 'tours-simple.json')
  )
);

/* Sending status success, status code, and arrays length into api requests are really useful most of the
times */

/* Checkid function*/

exports.checkId = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Unsuccessfull',
      message: 'Invalid Id',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  const tour = req.body;
  if (!tour.name || !tour.price || !tour) {
    return res.status(400).json({
      status: 'Unsuccessfull',
      message: 'Missing name, price or data for tour',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1; //ensuring that the parameter will be a number
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  // const tour = req.body;

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  console.log(tours);
  fs.writeFile(
    path.resolve('..', 'starter', 'dev-data', 'data', 'tours-simple.json'),
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'Success',
        result: tours.length,
        data: {
          tours,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  const id = req.params.id * 1;
  const { fild, newValue } = req.body;

  const tour = tours.find((el) => el.id === id);

  tour[fild] = newValue;
  tours[id] = tour;

  fs.writeFile(
    path.resolve('..', 'starter', 'dev-data', 'data', 'tours-simple.json'),
    JSON.stringify(tours),
    (err) => {
      res.status(202).json({
        status: 'Tour updated',
        result: tours.length,
        data: {
          tour,
        },
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  return res.status(204).json({
    status: 'tour deleted',
    data: null,
  });
};
