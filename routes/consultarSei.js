var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
var Bolsista = require('../models/bolsistas');
util = require('util');

router.get('/consultarsei', middleware.isLoggedIn, async (req, res) => {
    res.render('consultaSei');
});

module.exports = router;