const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  naam: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  wachtwoord: { type: String, required: true },
  profielfoto: { type: String, default: '' },
  volgers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  volgend: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  datum: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
