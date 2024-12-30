const express = require('express');
const { protect } = require('../Middleware/authMildware');
const {accessChat, fetchChat, createGroupChat,removeFromGroupChat,addToGroupChat,renameGroupChat} = require('../Controllers/chatController');
const router = express.Router();

router.route('/').post(protect,accessChat);
router.route('/').get(protect,fetchChat);
router.route('/group').post(protect,createGroupChat);
router.route('/rename').put(protect,renameGroupChat);
router.route('/groupadd').put(protect,addToGroupChat);
router.route('/groupremove').put(protect,removeFromGroupChat);

module.exports = router;