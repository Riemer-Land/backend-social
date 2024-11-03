const Post = require('../models/Post');
const User = require('../models/User');
const path = require('path');

// Maak een nieuwe post
exports.createPost = async (req, res) => {
  try {
    const newPost = new Post({
      beschrijving: req.body.beschrijving,
      auteur: req.user.id,
    });

    if (req.file) {
      newPost.mediaUrl = req.file.filename;
    }

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Haal feed op
exports.getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const posts = await Post.find({ auteur: { $in: [req.user.id, ...user.volgend] } })
      .sort({ datum: -1 })
      .populate('auteur', ['naam', 'profielfoto']);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Haal post op via ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('auteur', ['naam', 'profielfoto']);
    if (!post) {
      return res.status(404).json({ msg: 'Post niet gevonden' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post niet gevonden' });
    }
    res.status(500).send('Server Error');
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: 'Post niet gevonden' });

    // Controleer of de gebruiker de auteur is
    if (post.auteur.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Gebruiker niet geautoriseerd' });
    }

    post.beschrijving = req.body.beschrijving || post.beschrijving;

    if (req.file) {
      post.mediaUrl = req.file.filename;
    }

    post = await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Verwijder post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: 'Post niet gevonden' });

    // Controleer of de gebruiker de auteur is
    if (post.auteur.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Gebruiker niet geautoriseerd' });
    }

    await post.remove();

    res.json({ msg: 'Post verwijderd' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Like een post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Controleer of de post al geliked is door deze gebruiker
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Post al geliked' });
    }

    post.likes.push(req.user.id);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Reageer op een post
exports.commentOnPost = async (req, res) => {
  const { reactie } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    const newComment = {
      reactie,
      gebruiker: req.user.id,
    };

    post.reacties.unshift(newComment);

    await post.save();

    res.json(post.reacties);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Haal posts op van specifieke gebruiker
/*exports.getPostsByUser = async (req, res) => {
    try {
      const posts = await Post.find({ auteur: req.params.id })
        .sort({ datum: -1 })
        .populate('auteur', ['naam', 'profielfoto']);
      res.json(posts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }; */
  
