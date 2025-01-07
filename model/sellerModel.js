const mongoose = require('mongoose');

const { Schema } = mongoose;

const ownerSchema = new Schema({
  sellerFirstName: { type: String, required: true },
  sellerLastName: { type: String, required: true },
  sellerPhone: { type: String, required: true },
  sellerAddress: { type: String, required: true },
  sellerEmail: { type: String, required: true },
  sellerDOB: { type: String, required: true },  // Changed to Date
  sellerCnicNumber: { 
    type: String, 
    // required: true, 
    match: [/^\d{5}-\d{7}-\d$/, 'Please fill a valid CNIC number']  // Optional regex for validation
  },
  sellerCnicFront: { type: String, required: true },
  sellerCnicBack: { type: String, required: true },
  sellerVerifiedCnic: { type: String, required: true },  // Fixed typo here
  sellerQualification: [{
    sellerDegree: String,
    sellerDnstitute: String,
    sellerDegreeStartingDate: String,
    sellerDegreeEndingDate: String,
    sellerCertificate: String,
    sellerDegreeDescription: String
  }],
  sellerExperience: [{
    sellerJobTitle: String,
    sellerJobType: String,
    sellerStartingDate: String,
    sellerEndingDate: String,
    sellerJobLocation: String,
    sellerCompanyName: String,
    sellerExperienceDescription: String
  }]
});

module.exports = mongoose.model('Seller', ownerSchema);
