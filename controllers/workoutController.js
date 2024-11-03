const Workout = require('../models/Workout');
const User = require('../models/User');

// Maak een nieuwe workout
exports.createWorkout = async (req, res) => {
  try {
    const newWorkout = new Workout({
      beschrijving: req.body.beschrijving,
      auteur: req.user.id,
    });

    if (req.file) {
      newWorkout.afbeeldingUrl = req.file.filename;
    }

    const workout = await newWorkout.save();
    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Haal workouts op
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ auteur: req.user.id }).sort({ datum: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
