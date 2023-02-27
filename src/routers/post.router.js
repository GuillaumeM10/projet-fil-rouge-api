const express = require('express');
const PostController = require('../controllers/post.controller');
const router = express.Router();

const host = "/posts";
const controller = PostController;


router.get(`${host}`, controller.getAll);
router.get(`${host}/:id`, controller.getOne);
router.post(`${host}`, controller.create);
router.put(`${host}/:id`, controller.update);
router.delete(`${host}/:id`, controller.delete);

module.exports = router