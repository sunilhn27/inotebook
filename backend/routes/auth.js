const express = require('express');
const router = express.Router();
const User = require('../modules/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const JWT_TOKEN = "Sunil"


router.post("/createUser", [
  body('name', 'Name should be atleast 5 char').isLength({ min: 5 }),
  body('email', 'Enter Valid Email').isEmail(),
  body('password', 'password should be more than 5 char').isLength({ min: 5 }),
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const salt = await bcrypt.genSalt(10);
  const securePassword = await bcrypt.hash(req.body.password, salt);

  let user = await User.findOne({ email: req.body.email })
  if (user) {
    return res.status(400).json({ error: "Email alrerady in Use" })
  }

  User.create({
    name: req.body.name,
    email: req.body.email,
    password: securePassword
  })

  const data = {
    user: {
      id: User.id
    }
  }

  const authToken = jwt.sign(data, JWT_TOKEN);
  res.send({ authToken });


})

module.exports = router;


// .then(user => res.json(user))
//     .catch(err => {
//       console.log(err)
//       res.json({ error: "Please enter unique Email ID" })
//     });