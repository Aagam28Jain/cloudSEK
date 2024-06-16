const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const app = express();
const userRouter = require("./routes/users");
const postRouter = require("./routes/posts");
const commentRouter = require("./routes/comments");
const AppError = require("./utils/appError");
app.use(express.json({ limit: "10kb" }));

// put helmet package always at the start of middleware stack
// it set security HTTP headers
app.use(helmet());

//DATA sanitization against NOSQL QUERY injection
app.use(mongoSanitize()); // "email":{"$gt":""} and any correct password will open this and this query always returns true

// when a hacker is continuously trying to access our routes
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP,please try again after an hour",
});
app.use("/api", limiter);

// 3) ROUTES

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);

// it is a error handler if we somehow wrote  any wrong route
app.all("*", (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
});

module.exports = app;
