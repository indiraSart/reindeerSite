const express = require('express');
const Reindeer = require('../models/reindeer');

const router = express.Router();

// Register a new reindeer
router.post('/', async (req, res) => {
  const { serialNumber, name, herd, birthDate } = req.body;

  // Simple validation
  if (!serialNumber || !name || !herd || !birthDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if reindeer already exists
  const existingReindeer = await Reindeer.findOne({ serialNumber });
  if (existingReindeer) {
    return res.status(400).json({ error: 'Reindeer with this serial number already exists' });
  }

  // Create new reindeer
  const newReindeer = new Reindeer({ serialNumber, name, herd, birthDate });

  try {
    await newReindeer.save();
    res.status(201).json({ message: 'Reindeer registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch all reindeer
router.get('/', async (req, res) => {
  try {
    const reindeerList = await Reindeer.find();
    res.json(reindeerList);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
