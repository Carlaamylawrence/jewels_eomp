const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");
const middleware = require("../middleware/auth");

// GET ALL CATEGORIES
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM categories", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//ADD A CATEGORY
router.post("/", middleware, (req, res) => {
  if (req.user.user_type === "admin")
    try {
      let sql = "INSERT INTO categories SET ?";
      let categories = ({
        category_id: req.body.category_id,
        name: req.body.name,
        description: req.body.description,
        thumbnail: req.body.thumbnail,
      } = req.body);
      con.query(sql, categories, (err, result) => {
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

// GET SINGLE CATEGORY
router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM categories where category_id= ${req.params.id} `,
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

//EDIT A CATEGORY
router.put("/:id", middleware, (req, res) => {
  if (req.user.user_type === "admin") {
    try {
      let sql = "SELECT * FROM categories WHERE ? ";
      let categories = { category_id: req.params.id };
      con.query(sql, categories, (err, result) => {
        if (err) throw err;
        if (result.length !== 0) {
          let updateSql = `UPDATE categories SET ? WHERE category_id = ${req.params.id}`;
          let updateCategories = {
            category_id: req.body.category_id,
            name: req.body.name,
            description: req.body.description,
            thumbnail: req.body.thumbnail,
          };
          con.query(updateSql, updateCategories, (err, updated) => {
            if (err) throw err;
            res.send("Successfully updated Categories");
          });
        } else {
          res.send("Categories not found");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
});

// DELETE A CATEGORY
router.delete("/:id", middleware, (req, res) => {
  if (req.user.user_type === "admin")
    try {
      let sql = "Delete from categories WHERE ?";
      let categories = { category_id: req.params.id };
      con.query(sql, categories, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    } catch (error) {
      console.log(error);
    }
});
module.exports = router;
