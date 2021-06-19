const Tour = require("../models/tourSchema");
const APIFeatures = require("../utils/apiFeatures");

module.exports = {
  aliasTopTours(req, res, next) {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";
    next();
  },
  async getToursStats(req, res) {
    try {
      const stats = await Tour.aggregate([
        {
          $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
          $group: {
            _id: "$difficulty",
            numTours: { $sum: 1 },
            numRatings: { $sum: "$ratingsQuantity" },
            avgRating: { $avg: "$ratingsAverage" },
            avgPrice: { $avg: "$price" },
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
          },
        },
        {
          $sort: {
            avgPrice: 1,
          },
        },
      ]);

      return res.status(200).json({
        status: "Sucessfull",
        data: {
          stats,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "fail",
        err,
      });
    }
  },
  async getMonthlyPlan(req, res) {
    try {
      const year = req.params.year * 1;

      const plan = await Tour.aggregate([
        {
          $unwind: "$startDates",
        },
        {
          $match: {
            startDates: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$startDates" },
            numTourStarts: { $sum: 1 },
            tours: { $push: "$name" },
          },
        },
        {
          $addFields: { month: "$_id" },
        },
        {
          $project: {
            _id: 0,
          },
        },
        {
          $sort: { numTourStarts: -1 },
        },
      ]);

      return res.status(200).json({
        status: "Successful",
        data: {
          plan,
        },
      });
    } catch (err) {
      return res.status(404).json({
        status: "Fail",
        message: err,
      });
    }
  },
  async index(req, res) {
    try {
      //Building the query

      // const excludeFields = ['page', 'sort', 'limit', 'fields'];
      // //Excluding unnecessary params
      // excludeFields.forEach((el) => delete queryObj[el]);

      // //Advanced filtering
      // let queryStr = JSON.stringify(queryObj);
      // queryStr = JSON.parse(
      //   queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
      // );

      // //Saving the query
      // let query = Tour.find(queryStr);

      //1) Sorting
      // if (req.query.sort) {
      //   const sortBy = req.query.sort.split(',').join(' ');
      //   query = query.sort(sortBy);
      // } else {
      //   query = query.sort('-createdAt');
      // }

      // //2) Filtering the fields
      // if (req.query.fields) {
      //   const fields = req.query.fields.split(',').join(' ');
      //   query = query.select(fields);
      // } else {
      //   query = query.select('-__v');
      // }

      //3) Pagination
      // const page = req.query.page * 1 || 1;
      // const limit = req.query.limit * 1 || 100;
      // const skip = (page - 1) * limit;

      // query = query.skip(skip).limit(limit);

      // if (req.query.page) {
      //   const numOfTour = await Tour.countDocuments();
      //   if (skip >= numOfTour) throw new Error();
      // }

      //Executing the query
      // const tours = await query;
      const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagination();

      const tours = await features.query;

      return res.status(200).json({
        status: "Successful",
        results: tours.length,
        data: {
          tours,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(404).json({
        status: "Fail",
        message: err,
      });
    }
  },
  async find(req, res) {
    try {
      const id = req.params.id;

      let tour = await Tour.findById(id);

      return res.status(200).json({
        status: "Successful",
        data: {
          tour,
        },
      });
    } catch (err) {
      return res.status(404).json({
        status: "Fail",
        message: "Tour not found",
      });
    }
  },
  async create(req, res) {
    try {
      const data = req.body;
      console.log(data);

      const tour = await Tour.create(data);

      return res.status(202).json({
        status: "Tour created successfully",
        data: {
          tour,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(503).json({
        status: "unsuccesful",
        message: err,
      });
    }
  },
  async update(req, res) {
    const data = req.body;
    const id = req.params.id;
    try {
      let tour = await Tour.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      return res.status(200).json({
        status: "Successful",
        data: {
          tour,
        },
      });
    } catch (err) {
      return res.status(404).json({
        status: "Fail",
        message: "Tour not updated",
        error: err,
      });
    }
  },
  async deleteTour(req, res) {
    const id = req.params.id;
    try {
      await Tour.findByIdAndDelete(id);

      return res.status(200).json({
        status: "Successful",
      });
    } catch (err) {
      return res.status(404).json({
        status: "Fail",
        message: "Tour could not be deleted",
      });
    }
  },
};
