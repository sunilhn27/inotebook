const express = require('express');
const router = express.Router();
const User = require('../modules/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_TOKEN = "Sunil"


router.post("/createuser", [
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

router.post("/login", [
  body('email', 'Enter Valid Email').isEmail(),
  body('password', 'password cannot be blank').exists()
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Sorry User does not exist" })
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ error: "Please try to login with correct Credentials" });
    }
    const data = {
      user: {
        id: user.id
      }
    }

    const authToken = jwt.sign(data, JWT_TOKEN);
    res.send({ authToken });

  } catch (error) {

  }

});


//login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    console.log("user " + user);
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" })
  }

});

module.exports = router;






