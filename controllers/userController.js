const User = require('../models/User');

// Haal gebruikersprofiel op
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-wachtwoord').populate('volgers').populate('volgend');
    if (!user) {
      return res.status(404).json({ msg: 'Gebruiker niet gevonden' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update gebruikersprofiel
exports.updateUserProfile = async (req, res) => {
  const { naam, profielfoto } = req.body;

  const userFields = {};
  if (naam) userFields.naam = naam;
  if (profielfoto) userFields.profielfoto = profielfoto;

  try {
    let user = await User.findById(req.user.id);
    if (user) {
      user = await User.findByIdAndUpdate(req.user.id, { $set: userFields }, { new: true });
      return res.json(user);
    }
    res.status(404).json({ msg: 'Gebruiker niet gevonden' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Volg een gebruiker
exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ msg: 'Gebruiker niet gevonden' });
    }

    if (userToFollow.volgers.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Je volgt deze gebruiker al' });
    }

    userToFollow.volgers.push(req.user.id);
    currentUser.volgend.push(req.params.id);

    await userToFollow.save();
    await currentUser.save();

    res.json({ msg: 'Gebruiker gevolgd' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Ontvolg een gebruiker
exports.unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({ msg: 'Gebruiker niet gevonden' });
    }

    if (!userToUnfollow.volgers.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Je volgt deze gebruiker niet' });
    }

    userToUnfollow.volgers.pull(req.user.id);
    currentUser.volgend.pull(req.params.id);

    await userToUnfollow.save();
    await currentUser.save();

    res.json({ msg: 'Gebruiker ontvolgd' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
