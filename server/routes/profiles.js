const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// GET /api/profiles — all profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/profiles/search?name=&location=&department=
// IMPORTANT: must be defined before /:id so 'search' is not treated as an ObjectId
// OR/fuzzy: non-empty fields are OR'd together; full matches scored higher via aggregation
router.get('/search', async (req, res) => {
  try {
    const { name, location, department } = req.query;

    // Build OR conditions only for non-empty query params
    const orConditions = [];
    if (name && name.trim()) {
      orConditions.push({ name: { $regex: name.trim(), $options: 'i' } });
      orConditions.push({ tags: { $regex: name.trim(), $options: 'i' } });
    }
    if (location && location.trim()) {
      orConditions.push({ location: { $regex: location.trim(), $options: 'i' } });
    }
    if (department && department.trim()) {
      orConditions.push({ department: { $regex: department.trim(), $options: 'i' } });
    }

    // If no params provided, return all profiles
    if (orConditions.length === 0) {
      const all = await Profile.find().sort({ createdAt: -1 });
      return res.json(all);
    }

    // Use aggregation to score matches (more matching fields = higher score)
    const scoringConditions = [];
    if (name && name.trim()) {
      scoringConditions.push({
        $cond: [{ $regexMatch: { input: '$name', regex: name.trim(), options: 'i' } }, 2, 0]
      });
      scoringConditions.push({
        $cond: [{ $gt: [{ $size: { $filter: { input: { $ifNull: ['$tags', []] }, as: 't', cond: { $regexMatch: { input: '$$t', regex: name.trim(), options: 'i' } } } } }, 0] }, 1, 0]
      });
    }
    if (location && location.trim()) {
      scoringConditions.push({
        $cond: [{ $regexMatch: { input: { $ifNull: ['$location', ''] }, regex: location.trim(), options: 'i' } }, 2, 0]
      });
    }
    if (department && department.trim()) {
      scoringConditions.push({
        $cond: [{ $regexMatch: { input: { $ifNull: ['$department', ''] }, regex: department.trim(), options: 'i' } }, 2, 0]
      });
    }

    const results = await Profile.aggregate([
      { $match: { $or: orConditions } },
      {
        $addFields: {
          score: { $add: scoringConditions }
        }
      },
      { $sort: { score: -1, createdAt: -1 } },
      { $project: { score: 0 } } // remove internal score field from response
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/profiles/:id — single profile (must be after /search)
router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// POST /api/profiles — create a new profile
router.post('/', async (req, res) => {
  try {
    const profile = new Profile(req.body);
    const saved = await profile.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/profiles/:id — update a profile
router.put('/:id', async (req, res) => {
  try {
    const updated = await Profile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Profile not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/profiles/:id — delete a profile
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Profile.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Profile not found' });
    res.json({ message: 'Profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
