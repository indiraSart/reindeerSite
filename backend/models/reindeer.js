const mongoose = require('mongoose');

const reindeerSchema = new mongoose.Schema({
  serialNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  herd: { type: String, required: true },
  birthDate: { type: Date, required: true },
});

module.exports = mongoose.model('Reindeer', reindeerSchema);
