const bcrypt = require("bcryptjs");
const con = require("../../lib/db_connection");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ADD PRODUCT
async function addProduct(req, res) {
  if (req.user.user_type === "admin")
    try {
      let date = new Date().toISOString().slice(0, 19).replace("T", " ");
      let sql = "INSERT INTO products SET ?";
      let product = ({
        sku: req.body.sku,
        name: req.body.name,
        price: req.body.price,
        weight: req.body.weight,
        descriptions: req.body.descriptions,
        thumbnail: req.body.thumbnail,
        image: req.body.image,
        category: req.body.category,
        create_date: date,
        stock: req.body.stock,
      } = req.body);
      con.query(sql, product, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    } catch (error) {
      console.log(error);
    }
  else {
    res.send("Not Allowed");
  }
}

// DELETE PRODUCT
async function editProduct(req, res) {
  if (req.user.user_type === "admin") {
    try {
      let sql = "SELECT * FROM products WHERE ? ";
      let product = { product_id: req.params.id };
      con.query(sql, product, (err, result) => {
        if (err) throw err;
        if (result.length !== 0) {
          let updateSql = `UPDATE products SET ? WHERE product_id = ${req.params.id}`;
          let updateProduct = {
            sku: req.body.sku,
            name: req.body.name,
            price: req.body.price,
            weight: req.body.weight,
            descriptions: req.body.descriptions,
            thumbnail: req.body.thumbnail,
            image: req.body.image,
            category: req.body.category,
            create_date: req.body.create_date,
            stock: req.body.stock,
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
  if (req.user.user_type === "admin")
    try {
      let sql = "Delete from products WHERE ?";
      let product = { product_id: req.params.id };
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
