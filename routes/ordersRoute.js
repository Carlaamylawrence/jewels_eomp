const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");
const middleware = require("../middleware/auth");

// GET ALL CATEGORIES
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM orders", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//ADD An ORDER
router.post("/", middleware, (req, res) => {
  if (req.user.user_type === "admin")
    try {
      let sql = "INSERT INTO orders SET ?";
      let orders = ({
        order_id: req.body.order_id,
        user_id: req.body.user_id,
        amount: req.body.amount,
        shipping_address: req.body.shipping_address,
        order_email: req.body.order_email,
        order_date: req.body.order_date,
        order_status: req.body.order_status,
      } = req.body);
      con.query(sql, orders, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    } catch (error) {
      console.log(error);
    }
  else {
    res.send("Not Allowed");
  }
});

// GET SINGLE ORDER
router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM orders where order_id= ${req.params.id} `,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//EDIT AN ORDER
router.put("/:id", middleware, (req, res) => {
  if (req.user.usr_type === "admin") {
    try {
      let sql = "SELECT * FROM products WHERE ?";
      let orders = { order_id: req.params.id };
      con.query(sql, orders, (err, result) => {
        if (err) throw err;
        if (result.length !== 0) {
          let updateSql = `UPDATE orders SET ? WHERE order_id = ${req.params.id}`;
          let updateOrder = {
            order_id: req.body.order_id,
            user_id: req.body.user_id,
            amount: req.body.amount,
            shipping_address: req.body.shipping_address,
            order_email: req.body.order_email,
            order_date: req.body.order_date,
            order_status: req.body.order_status,
          };
          con.query(updateSql, updateOrder, (err, updated) => {
            if (err) throw err;
            res.send("Successfully updated Order");
          });
        } else {
          res.send("Order not found");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
});
// DELETE AN ORDER
router.delete("/:id", middleware, (req, res) => {
  if (req.user.user_type === "admin")
    try {
      let sql = "Delete from orders WHERE ?";
      let orders = { order_id: req.params.id };
      con.query(sql, orders, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    } catch (error) {
      console.log(error);
    }
});
module.exports = router;
