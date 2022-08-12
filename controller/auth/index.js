const bcrypt = require("bcryptjs");
const con = require("../../lib/db_connection");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// LOGIN FUNCTION

async function Login(req, res) {
  console.log(req.body);
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      email: req.body.email,
    };
    con.query(sql, user, async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.status(400).json({
          status: "error",
          error: "Email Not Found",
        });
      } else {
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        console.log(req.body.password, result[0].password);
        if (!isMatch) {
          res.status(400).json({
            status: "error",
            error: "Password Incorrect",
          });
          console.log("isMatch");
        } else {
          // The information the should be stored inside token
          const payload = {
            user: {
              id: result[0].id,
              fullname: result[0].fullname,
              email: result[0].email,
              userRole: result[0].userRole,
              phone: result[0].phone,
              created: result[0].created,
              cart: result[0].cart,
            },
          };
          // Creating a token and setting expiry date
          jwt.sign(
            payload,
            process.env.jwtSecret,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;

              res.json({ token });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}

// REGISTER FUNCTION
async function Register(req, res) {
  try {
    let sql = "INSERT INTO users SET ?";
    let date = new Date().toISOString().slice(0, 19).replace("T", " ");
    const { id, fullname, email, password, userRole, phone, created, cart } =
      req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    let user = {
      id,
      fullname,
      email,
      password: hash,
      userRole,
      phone,
      created: date,
      cart,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(`User ${(user.fullname, user.email)} created successfully`);
    });
  } catch (error) {
    console.log(error);
  }
}

async function Verify(req, res) {
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
}

module.exports = {
  Login,
  Register,
  Verify,
};
