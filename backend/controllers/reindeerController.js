const { validationResult } = require('express-validator');
const Reindeer = require('../models/Reindeer');

// Get all reindeers
exports.getAllReindeers = async (req, res) => {
    try {
        const reindeers = await Reindeer.find({ owner: req.user.id }).sort({ registrationDate: -1 });
        res.json(reindeers);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single reindeer
exports.getReindeer = async (req, res) => {
    try {
        const reindeer = await Reindeer.findOne({
            _id: req.params.id,
            owner: req.user.id
        });

        if (!reindeer) {
            return res.status(404).json({ message: 'Reindeer not found' });
        }

        res.json(reindeer);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create reindeer
exports.createReindeer = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, age, gender, weight, description } = req.body;

        const reindeer = new Reindeer({
            name,
            age,
            gender,
            weight,
            description,
            owner: req.user.id
        });

        await reindeer.save();
        res.status(201).json(reindeer);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update reindeer
exports.updateReindeer = async (req, res) => {
    try {
        const { name, age, gender, weight, description, isActive } = req.body;

        let reindeer = await Reindeer.findOne({
            _id: req.params.id,
            owner: req.user.id
        });

        if (!reindeer) {
            return res.status(404).json({ message: 'Reindeer not found' });
        }

        reindeer.name = name || reindeer.name;
        reindeer.age = age || reindeer.age;
        reindeer.gender = gender || reindeer.gender;
        reindeer.weight = weight || reindeer.weight;
        reindeer.description = description || reindeer.description;
        reindeer.isActive = isActive !== undefined ? isActive : reindeer.isActive;

        await reindeer.save();
        res.json(reindeer);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete reindeer
exports.deleteReindeer = async (req, res) => {
    try {
        const reindeer = await Reindeer.findOne({
            _id: req.params.id,
            owner: req.user.id
        });

        if (!reindeer) {
            return res.status(404).json({ message: 'Reindeer not found' });
        }

        await Reindeer.deleteOne({ _id: req.params.id });
        res.json({ message: 'Reindeer removed' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}; 