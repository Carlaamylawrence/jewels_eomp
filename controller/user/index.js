const con = require("../../lib/db_connection");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// ADD USER
async function addUser(req, res) {
  const { fullname, email, password, userRole, phone, created, cart } =
    req.body;
  try {
    con.query(
      `INSERT INTO users (fullname,
        email,
        password,
        userRole,
        phone,
        created,
        cart) values ("${fullname}","${email}","${password}","${userRole}","${phone}","${created}","${cart}")`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
}
// EDIT USER
async function editUser(req, res) {
  const { fullname, email, password, userRole, phone, created, cart } =
    req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  try {
    con.query(
      `UPDATE users SET fullname="${fullname}", email="${email}", password="${hash}", userRole="${userRole}",  phone="${phone}", created="${created}", cart="${cart}" WHERE id= ${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
}

//DELETE USER
async function deleteUser(req, res) {
  if ((req.user.userRole = "admin" || "user")) {
    try {
      let sql = "Delete from users WHERE ?";
      let users = { id: req.params.id };
      con.query(sql, users, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send("Not Allowed");
  }
}

async function getCartItems(req, res) {
  let cart = [];
  if (cart !== 0) {
    try {
      let sql = "Select cart FROM users WHERE ?";
      let users = { id: req.params.id };
      con.query(sql, users, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send("empty");
  }
}

// async function addCartItem(req,res) {
//   let cart =[]
//   try {
//     let sql = "Insert into cart"
//   }
// }
module.exports = {
  editUser,
  deleteUser,
  addUser,
  getCartItems,
};
