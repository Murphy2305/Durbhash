const express = require('express');
const { protect } = require('../Middleware/authMildware');
const router = express.Router();
const {sendMessage,allMessages} = require('../Controllers/messageController');

router.route('/:chatId').get(protect,allMessages);
router.route('/').post(protect,sendMessage);

module.exports = router;