const express = require('express')
const router = express.Router();


router.get("/", (req, res) => {
    console.log("Notes")
    res.send("Notes");

})

module.exports = router