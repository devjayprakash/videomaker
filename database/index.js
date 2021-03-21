let mongoose = require("mongoose");

mongoose.connect(``, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;

db.on("open", () => {
  console.log("Connected to the database successfully");
});

db.once("error", (err) => {
  console.log("There was some error connecting to the database");
  console.error(err);
});
