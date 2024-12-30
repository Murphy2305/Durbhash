const express = require('express');
const { protect } = require('../Middleware/authMildware');
const router = express.Router();

// router.get('/:chatId',allMessages);
router.post('/',sendMessage);

module.exports = router;