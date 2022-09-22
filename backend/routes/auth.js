const express = require('express')
const router = express.Router();
const User = require('../modules/User');


router.get("/", async (req, res) => {
    try {
        const newUser = new User({
          name: "Sunil",
          email: "sunil@gmail.com",
          password: "123456"
        });
    
        const user = await newUser.save();
        res.status(200).json(user);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    });
    // console.log(req.body);
    // const user = new User(req.body);
    // await user.save();
    // res.send(req.body);



module.exports = router;