const { body } = require("express-validator");

module.exports = [

  body("storePhone")
    .matches(/^\+([1-9]{1,4})\d{1,14}$/)
    .withMessage(
      "Phone number must be in E.164 format (+<country code><subscriber number>)"
    )
    .isLength({ min: 10, max: 15 })
    .withMessage(
      "Phone number must be between 10 to 15 digits long (excluding any spaces or formatting characters)"
    ),

  body("storeEmail").isEmail().withMessage("Email should be valid"),

  // OWNER PLUS SELLER BUYER INFO

  body("ownerPhone")
    .matches(/^\+([1-9]{1,4})\d{1,14}$/)
    .withMessage(
      "Phone number must be in E.164 format (+<country code><subscriber number>)"
    )
    .isLength({ min: 10, max: 15 })
    .withMessage(
      "Phone number must be between 10 to 15 digits long (excluding any spaces or formatting characters)"
    ),

  body("ownerEmail").isEmail().withMessage("Email should be valid"),

  body("ownerCnicNumber").matches(/^\d{5}-\d{7}-\d{1}$/)
    .withMessage("CNIC must follow the format XXXXX-XXXXXXX-X"),

  // SELLER INFO

  // EXPERIENCE

  body("sellerStartingDate")
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage("Starting date must be in the format YYYY-MM-DD")
    .notEmpty()
    .withMessage("Starting date is required"),

  body("sellerEndingDate")
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage("Ending date must be in the format YYYY-MM-DD")
    .notEmpty()
    .withMessage("Ending date is required")
    .custom((value, { req }) => {
      // Custom validation to ensure ending date is not before starting date
      if (new Date(value) < new Date(req.body.sellerStartingDate)) {
        throw new Error("Ending date cannot be earlier than starting date");
      }
      return true;
    }),

  //EDUCATION

  body("sellerDegreeStartingDate")
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage("Starting date must be in the format YYYY-MM-DD")
    .notEmpty()
    .withMessage("Starting date is required"),

  body("sellerDegreeEndingDate")
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage("Ending date must be in the format YYYY-MM-DD")
    .notEmpty()
    .withMessage("Ending date is required")
    .custom((value, { req }) => {
      // Custom validation to ensure ending date is not before starting date
      if (new Date(value) < new Date(req.body.sellerDegreeEndingDate)) {
        throw new Error("Ending date cannot be earlier than starting date");
      }
      return true;
    }),
];
