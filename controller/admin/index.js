const bcrypt = require("bcryptjs");
const con = require("../../lib/db_connection");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ADD PRODUCT
async function addProduct(req, res) {

    try {
      let date = new Date().toISOString().slice(0, 19).replace("T", " ");
      let sql = "INSERT INTO products SET ?";
      let product = ({
        title: req.body.title,
        img: req.body.img,
        thumbnail: req.body.thumbnail,
        price: req.body.price,
        color: req.body.color,
        description: req.body.description,
        quantity: req.body.quantity,
        category: req.body.category,
        sku: req.body.sku,
        available: req.body.available,
      } = req.body);
      con.query(sql, product, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    } catch (error) {
      console.log(error);
    }

}

// EDIT PRODUCT
async function editProduct(req, res) {
  if (req.user.userRole === "admin" || req.user.userRole === "user") {
    try {
      let sql = "SELECT * FROM products WHERE ? ";
      let product = { id: req.params.id };
      con.query(sql, product, (err, result) => {
        if (err) throw err;
        if (result.length !== 0) {
          let updateSql = `UPDATE products SET ? WHERE id = ${req.params.id}`;
          let updateProduct = {
            title: req.body.title,
            img: req.body.img,
            thumbnail: req.body.thumbnail,
            price: req.body.price,
            color: req.body.color,
            description: req.body.description,
            quantity: req.body.quantity,
            category: req.body.category,
            sku: req.body.sku,
            available: req.body.available,
          };
          con.query(updateSql, updateProduct, (err, updated) => {
            if (err) throw err;
            res.send("Successfully updated Product");
          });
        } else {
          res.send("Product not found");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

async function deleteProduct(req, res) {
  if (req.user.userRole === "admin")
    try {
      let sql = "Delete from products WHERE ?";
      let product = { id: req.params.id };
      con.query(sql, product, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    } catch (error) {
      console.log(error);
    }
}
module.exports = {
  addProduct,
  editProduct,
  deleteProduct,
};
