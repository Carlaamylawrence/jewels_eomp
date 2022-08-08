const bcrypt = require("bcryptjs");
const con = require("../../lib/db_connection");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// GET ALL USER
async function getUsers(req, res) {
  try {
    let sql = "SELECT * FROM users";
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
}

// GET A SINGLE USER
async function getSingleUser(req, res) {
  try {
    con.query(
      `SELECT * FROM users where user_id= ${req.user.id} `,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

async function getProducts(req, res) {
  try {
    con.query("SELECT * FROM products", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
}

async function SingleProduct(req, res) {
  try {
    con.query(
      `SELECT * FROM products where product_id= ${req.params.id} `,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

module.exports = {
  getUsers,
  getSingleUser,
  getProducts,
  SingleProduct,
};
