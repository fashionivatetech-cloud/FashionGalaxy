const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  visitorName: { type: String, required: true },
  visitorEmail: { type: String, required: true },
  visitorPhone: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Connection', connectionSchema);
