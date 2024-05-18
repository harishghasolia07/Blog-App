const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const Post = require('../models/Post');
const Comment = require('../models/Comment.js');
const verifyToken = require('../verifyToken.js');
const multer = require('multer');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;

dotenv.config();

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
});

// CREATE POST
router.post('/create', verifyToken, upload.single('image'), async (req, res) => {
    try {
        let imageUrl = '';

        // Check if file is provided (Post Image)
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream((error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }).end(req.file.buffer);
            });

            imageUrl = result.secure_url;
        }

        const newPost = new Post({
            ...req.body,
            image: imageUrl
        });

        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE POST
router.put('/:id', verifyToken, upload.single('image'), async (req, res) => {
    try {
        let updatedData = { ...req.body };

        // Check if file is provided (Post Image)
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream((error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }).end(req.file.buffer);
            });

            updatedData.image = result.secure_url;
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, { $set: updatedData }, { new: true });
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE POST
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({ postId: req.params.id });
        res.status(200).json('Post has been deleted');
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET POST DETAILS
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET POSTS
router.get('/', async (req, res) => {
    const query = req.query;

    try {
        const searchFilter = {
            title: { $regex: query.search, $options: "i" }
        };
        const posts = await Post.find(query.search ? searchFilter : null);
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER POST
router.get('/user/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.userId });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
