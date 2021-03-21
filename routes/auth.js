let router = require("express").Router();
let User = require("../database/models/user");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");

router.post("/register", async (req, res, next) => {
  let data = req.body;

  try {
    data.password = await bcrypt.hash(data.password, 10);
    let exists = await User.exists({ email: data.email });

    if (exists) {
      res.send({
        res: false,
        msg: "Another user with the same email already exists",
      });
    } else {
      let user = new User(data);
      let saved_user = await user.save();

      let token_data = {
        name: saved_user.name,
        email: saved_user.email,
      };

      let token = jwt.sign(token_data, process.env.JWT_PASS);

      res.cookie("jwt", token);

      res.send({
        res: true,
        msg: "User created sucessfully",
        token: token,
      });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  let data = req.body;

  try {
    let user = await User.findOne({ email: data.email });

    if (user) {
      let same = await bcrypt.compare(data.password, user.password);
      if (same) {
        let token_data = {
          email: user.email,
          name: user.name,
        };

        let token = jwt.sign(token_data, process.env.JWT_PASS);

        res.cookie("jwt", token);

        res.send({
          res: true,
          msg: "User crendientials are correct",
        });
      } else {
        res.status(401).send({
          res: false,
          msg: "Incorrect password",
        });
      }
    } else {
      res.status(401).send({
        res: false,
        msg: "User with this email does not exists",
      });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/verifyToken", (req, res, next) => {});

module.exports = router;
