const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');

// GET /api/feed — get all posts, newest first, with author populated
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name house stream role')
      .populate('comments.author', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// POST /api/feed — create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { text, type } = req.body;
    if (!text?.trim()) return res.status(400).json({ msg: 'Text is required' });

    const post = new Post({ author: req.user.id, text, type: type || 'update' });
    await post.save();
    await post.populate('author', 'name house stream role');
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// PUT /api/feed/:id/like — toggle like
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const userId = req.user.id;
    const alreadyLiked = post.likes.some(id => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// POST /api/feed/:id/comment — add a comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ msg: 'Comment text required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    post.comments.push({ author: req.user.id, text });
    await post.save();
    await post.populate('comments.author', 'name');
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// DELETE /api/feed/:id — delete own post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.author.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Unauthorized' });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
