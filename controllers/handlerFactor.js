const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/errorHandler");

//Get all model
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.find();

    if (!doc) new AppError("No document found for this collection", 404);

    res.status(200).json({
      status: "Sucessful",
      data: doc,
    });
  });

//Get one Model
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    console.log(req.params.id);
    let query = Model.findById(id);

    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return new AppError("No document found with this id", 404);
    }

    return res.status(200).json({
      status: "Successful",
      data: {
        doc,
      },
    });
  });

//Create one Model
exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const data = req.body;

    if (!data) AppError("Missing input data", 505);

    const doc = await Model.create(data);

    return res.status(202).json({
      status: "Doc created successfully",
      data: {
        doc,
      },
    });
  });

//Update one Model
exports.updateOne = (Model) =>
  catchAsync(async (req, res) => {
    const data = req.body;
    const id = req.params.id;

    let doc = await Model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      status: "Successful",
      data: {
        doc,
      },
    });
  });

//Delete one Model
exports.deleteOne = (Model) =>
  catchAsync(async (req, res) => {
    const id = req.params.id;

    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      return new AppError(`There's no document with the id ${id}`, 404);
    }

    return res.status(200).json({
      status: "Successful",
    });
  });
