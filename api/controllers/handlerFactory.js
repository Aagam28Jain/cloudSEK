const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(
        new AppError(
          `no ${Model} found with the id ${req.params.id}  in DB`,
          404
        )
      );
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const originaldoc = await Model.findById(req.params.id);
    if (!originaldoc) {
      return next(
        new AppError(
          `no ${Model} found with the id ${req.params.id}  in DB`,
          404
        )
      );
    }
    if (String(originaldoc.user) !== req.user.id) {
      return next(new AppError(`You are not authorized to update this `, 401));
    }
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(
        new AppError(
          `no ${Model} found with the id ${req.params.id}  in DB`,
          404
        )
      );
    }
    res.json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate("reviews");
    const doc = await query;
    if (!doc) {
      return next(
        new AppError(
          `no ${Model} found with the id ${req.params.id}  in DB`,
          404
        )
      );
    }
    res.json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.userId) filter = { user: req.params.userId };

    const features = new ApiFeatures(Model.find(filter), req.query).filter();

    const doc = await features.query;
    res.json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
function convertToHtml(text) {
  let html = text;

  // Convert bold (**text**) to <strong>text</strong>
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Convert italic (*text*) to <em>text</em>
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Convert hyperlinks [text](url) to <a href="url">text</a>
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  return html;
}

exports.createComment = (Model) =>
  catchAsync(async (req, res, next) => {
    const htmlOutput = convertToHtml(req.body.comment);
    const doc = await Model.create({
      comment: htmlOutput,
      post: req.body.post,
      user: req.body.user,
    });
    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.getAllbyUser = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.id) filter = { user: req.params.id };
    const features = new ApiFeatures(Model.find(filter), req.query).filter();
    const doc = await features.query;
    res.json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
exports.getAllComments = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.Postid) filter = { post: req.params.Postid };
    const features = new ApiFeatures(Model.find(filter), req.query).filter();
    const doc = await features.query;
    res.json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
