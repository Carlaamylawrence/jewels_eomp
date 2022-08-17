const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");
const middleware = require("../middleware/auth");
const adminController = require("../controller/admin/index");
const displayController = require("../controller/display/index");

// GET ALL PRODUCTS
router.get("/", (req, res) => {
  return displayController.getProducts(req, res);
});

//ADD A PRODUCT
router.post("/",  (req, res) => {
  return adminController.addProduct(req, res);
});

// GET SINGLE PRODUCT
router.get("/:id", (req, res) => {
  return displayController.SingleProduct(req, res);
});

//EDIT A PRODUCT
router.put("/:id", middleware, (req, res) => {
  return adminController.editProduct(req, res);
});

// DELETE A PRODUCT
router.delete("/:id", middleware, (req, res) => {
  return adminController.deleteProduct(req, res);
});
module.exports = router;
