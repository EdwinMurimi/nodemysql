const express = require("express");
const { v1: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const router = express.Router();
const connection = require("../database/db");
const _ = require("lodash");

const validateUser = require("../validations/userValidation");
const loginValidation = require("../validations/loginValidation");

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

router.post("/signin", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send({message : error.details[0].message});

  const { email, password } = req.body;

  const sql = `SELECT * FROM hms_users WHERE email=?`;

  connection.query(sql, [email], async (error, result) => {
    if (error) res.status(400).send({message: "Email does not exist"});
    const user = result[0];
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        res
          .status(200)
          .json(
            _.pick(user, [
              "userID",
              "firstName",
              "lastName",
              "gender",
              "email",
              "role",
            ])
          );
      } else {
        res.status(400).send({message: "Invalid Password"});
      }
    } else {
      res.status(401).send({ message: "User does not exist" });
    }
  });
});

//

//
router.post("/signup", async (req, res) => {
  console.log("Accessed");
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send({message : error.details[0].message});

  const userID = uuid();
  const { firstName, lastName, email, gender } = req.body;
  const password = await encryptPassword(req.body.password);
  let user = { userID, firstName, lastName, email, gender, password };
  const sql = `INSERT INTO hms_users SET ?`;
  connection.query(sql, user, (error, result) => {
    if (error) throw error;
    res.send(result);
  });
});

module.exports = router;
 