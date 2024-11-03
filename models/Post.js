const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  beschrijving: { type: String, required: true },
  mediaUrl: { type: String, default: '' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reacties: [
    {
      gebruiker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reactie: { type: String },
      datum: { type: Date, default: Date.now },
    },
  ],
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  datum: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);
