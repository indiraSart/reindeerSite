const router = require('express').Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const reindeerController = require('../controllers/reindeerController');

// Get all reindeers
router.get('/', auth, reindeerController.getAllReindeers);

// Get single reindeer
router.get('/:id', auth, reindeerController.getReindeer);

// Create reindeer
router.post('/', [
    auth,
    check('name', 'Name is required').not().isEmpty(),
    check('age', 'Age must be a number').isNumeric(),
    check('gender', 'Gender must be either male or female').isIn(['male', 'female']),
    check('weight', 'Weight must be a number').isNumeric()
], reindeerController.createReindeer);

// Update reindeer
router.put('/:id', auth, reindeerController.updateReindeer);

// Delete reindeer
router.delete('/:id', auth, reindeerController.deleteReindeer);

module.exports = router; 