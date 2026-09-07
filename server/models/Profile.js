const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, default: '' },           // URL to profile image
  location: { type: String, default: '' },         // e.g. "Mumbai · Maharashtra"
  department: { type: String, default: '' },        // fashion, healthcare, music, etc.
  profession: { type: String, default: '' },        // editorial display field e.g. "Textile Designer"
  bio: { type: String, default: '' },              // short bio
  editorial_content: { type: String, default: '' }, // longer editorial writing
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  socialLinks: {
    instagram: { type: String, default: '' },
    linkedin:  { type: String, default: '' },
    website:   { type: String, default: '' },
  },
  tags: [{ type: String }],                        // e.g. ["stylist", "designer"]
  layout_style: {
    type: String,
    enum: ['left', 'right'],
    default: 'left',
  },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
