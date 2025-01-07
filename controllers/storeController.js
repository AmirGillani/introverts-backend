const catchAsyncError = require("../middleware/utilities/catch-async-errors");

const HttpsErrors = require("../middleware/utilities/http-errors");

const { validationResult } = require("express-validator");

const STOREMODEL = require("../model/storeModel");

const OWNERMODEL = require("../model/ownerModel");

const SELLERMODEL = require("../model/sellerModel");

const BRANCHMODEL = require("../model/branchModel");

module.exports.createStore = catchAsyncError(async (req, res, next) => {
  const {
    // BUSINESS INFO

    businessName,
    storeAddress,
    logo,
    storePhone,
    storeEmail,
    businessRegistration,
    socialMedia,
    storeLocation,
    storeType,

    // OWNER PLUS SELLER BUYER INFO

    ownerFirstName,
    ownerLastName,
    ownerPhone,
    ownerAddress,
    ownerEmail,
    ownerDOB,
    ownerCnicNumber,
    ownerCnicFront,
    ownerCnicBack,
    ownerVerifiedCnic,

    // SELLER INFO

    // EXPERIENCE

    sellerJobTitle,
    sellerJobType,
    sellerCompanyName,
    sellerStartingDate,
    sellerEndingDate,
    sellerJobLocation,
    sellerExperienceDescription,

    //EDUCATION

    sellerDegree,
    sellerInstitute,
    sellerDegreeStartingDate,
    sellerDegreeEndingDate,
    sellerCertificate,
    sellerDegreeDescription,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  };

  const owner = await OWNERMODEL.create({
    ownerFirstName,
    ownerLastName,
    ownerPhone,
    ownerAddress,
    ownerEmail,
    ownerDOB,
    ownerCnicNumber,
    ownerCnicFront,
    ownerCnicBack,
    ownerVerifiedCnic,
  });

 

  if (storeType == "SINGLE_EMPLOYEE") {
    // IN THIS STORE OUR OWNER IS OUR SELLER

    const seller = await SELLERMODEL.create({
      sellerFirstName: ownerFirstName,
      sellerLastName: ownerLastName,
      sellerPhone: ownerPhone,
      sellerAddress: ownerAddress,
      sellerEmail: ownerEmail,
      sellerDOB: ownerDOB,
      sellerCnicNumber: ownerCnicNumber,
      sellerCnicFront: ownerCnicFront,
      sellerCnicBack: ownerCnicBack,
      sellerVerifiedCnic: ownerVerifiedCnic,
      sellerJobTitle,
      sellerJobType,
      sellerCompanyName,
      sellerStartingDate,
      sellerEndingDate,
      sellerJobLocation,
      sellerExperienceDescription,
      sellerDegree,
      sellerInstitute,
      sellerDegreeStartingDate,
      sellerDegreeEndingDate,
      sellerCertificate,
      sellerDegreeDescription,
    });

    const branch = await BRANCHMODEL.create({
      branchName: businessName,
      location: storeAddress,
    });

    const store = await STOREMODEL.create({
      businessName,
      storeAddress,
      logo,
      storePhone,
      storeEmail,
      businessRegistration,
      socialMedia,
      storeLocation,
      owner: owner._id,
      sellers: [seller._id],
      repairers: [],
      branches: [branch._id],
      numberOfEmployees: 1,
      plan: storeType
    });

    res
      .status(200)
      .json({ message: "Single Person Store Created !!", store: store });
  }

  
});
