const mongoose = require('mongoose');
const { Schema } = mongoose;

const ownerSchema = new Schema({
  ownerFirstName: { type: String, required: true },
  ownerLastName: { type: String, required: true },
  ownerPhone: { type: Number, required: true },
  ownerAddress: { type: String, required: true },
  ownerEmail: { type: String, required: true },
  ownerDOB: { type: String, required: true },  // Changed to Date
  ownerCnicNumber: { 
    type: String, 
    // required: true, 
    match: [/^\d{5}-\d{7}-\d$/, 'Please fill a valid CNIC number']  // Optional regex for validation
  },
  ownerCnicFront: { type: String, required: true },
  ownerCnicBack: { type: String, required: true },
  ownerVerifiedCnic: { type: String, required: true },  // Fixed typo here
});

module.exports = mongoose.model('Owner', ownerSchema);
