let express = require("express");
let morgan = require("morgan");
let cors = require("cors");

let app = express();

let isDev = process.env.NODE_ENV !== "production";

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

app.all("*", (req, res) => {
  res.status(404).send({
    res: false,
    msg: "The path does not exists",
  });
});

let errorHander = (err, req, res, next) => {
  res.status(500).send({
    res: false,
    msg: "There was some internal server problem",
    err: isDev ? err : "Please contact the developer",
  });
};

app.use(errorHander);

let PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
