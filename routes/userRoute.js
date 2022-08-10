const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");
const bcrypt = require("bcryptjs");
const middleware = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const authController = require("../controller/auth/index");
const passController = require("../controller/password/index");
const displayController = require("../controller/display/index");

// Get users
router.get("/", (req, res) => {
  return displayController.getUsers(req, res);
});

//ADD A USER
router.post("/", (req, res) => {
  const {
    fullname,
    email,
    password,
    userRole,
    phone,
    created,
    cart,
  } = req.body;
  try {
    con.query(
      `INSERT INTO users (fullname,
        email,
        password,
        userRole,
        phone,
        created,
        cart,) values ("${fullname}","${email}","${password}","${userRole}","${phone}","${created}","${cart}")`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// GET SINGLE USER
router.get("/", (req, res) => {
  return displayController.getSingleUser(req, res);
});

//EDIT A USER
router.put("/:id", (req, res) => {
  const {
    fullname,
    email,
    password,
    userRole,
    phone,
    created,
    cart,
  } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  try {
    con.query(
      `UPDATE users SET fullname="${fullname}", email="${email}", password="${hash}", userRole="${userRole}",  phone="${phone}", created="${created}", cart="${cart}" WHERE user_id= ${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// DELETE A USER
router.delete("/:id", middleware, (req, res) => {
  if (req.user.user_type === "admin")
    try {
      let sql = "Delete from users WHERE ?";
      let users = { user_id: req.params.id };
      con.query(sql, users, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    } catch (error) {
      console.log(error);
    }
});

// Register
router.post("/register", (req, res) => {
  return authController.Register(req, res);
});

// Login
router.post("/login", (req, res) => {
  console.log(req.body);
  return authController.Login(req, res);
});

// Verify
router.get("/users/verify", (req, res) => {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({
        msg: "Unauthorized Access!",
      });
    } else {
      res.status(200);
      res.send(decodedToken);
    }
  });
});

// FORGOT PASSWORD
router.post("/forgot-psw", (req, res) => {
  return passController.forgotPsw(req, res);
});

// Rest Password Route

router.put("/reset-psw/:id", (req, res) => {
  return passController.resetPsw(req, res);
});

module.exports = router;
