const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
  try {
    const settingsList = await Settings.find();
    const settings = {};
    settingsList.forEach(s => {
      settings[s.key] = s.value;
    });
    res.json(settings);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    for (const key in updates) {
      await Settings.findOneAndUpdate(
        { key },
        { key, value: updates[key] },
        { upsert: true, new: true }
      );
    }
    res.json({
  success: true,
  settings: updates,
});
  } catch (err) {
    res.status(500).send('Server error');
  }
};
