const express = require("express");

const {
    getUSDCBalance
} = require("../controllers/smartContractController");


const router = express.Router();

router.route("/getUSDCBalance").get(getUSDCBalance);


module.exports = router;
