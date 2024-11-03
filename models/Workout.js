const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  beschrijving: { type: String, required: true },
  afbeeldingUrl: { type: String, default: '' },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  datum: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Workout', WorkoutSchema);
