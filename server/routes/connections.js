const express = require('express');
const router = express.Router();
const Connection = require('../models/Connection');

// GET /api/connections — fetch all connection requests with populated profile details
router.get('/', async (req, res) => {
  try {
    const rawConnections = await Connection.find().sort({ createdAt: -1 }).lean();
    const profileIds = rawConnections.map((c) => c.profileId).filter(Boolean);
    const Profile = require('../models/Profile');
    const profiles = await Profile.find({ _id: { $in: profileIds } }).lean();
    const profileMap = new Map(profiles.map((p) => [p._id.toString(), p]));

    const result = rawConnections.map((c) => {
      const pIdStr = c.profileId ? c.profileId.toString() : '';
      const foundProfile = pIdStr ? profileMap.get(pIdStr) : null;
      return {
        ...c,
        rawProfileId: pIdStr,
        profileId: foundProfile || null,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/connections
router.post('/', async (req, res) => {
  try {
    const { profileId, visitorName, visitorEmail, visitorPhone } = req.body;

    if (!profileId || !visitorName || !visitorEmail || !visitorPhone) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const connection = new Connection({ profileId, visitorName, visitorEmail, visitorPhone });
    await connection.save();

    res.status(201).json({ message: 'Connection request saved!', connection });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/connections/:id — dismiss/remove a connection request
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Connection.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Request not found' });
    res.json({ message: 'Request removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
