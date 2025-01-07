const mongoose = require("mongoose");
const { Schema } = mongoose;

// Enum for Store Types
const StorePlan = {
  SINGLE_EMPLOYEE: "SINGLE_EMPLOYEE",
  FOUR_EMPLOYEES: "FOUR_EMPLOYEES",
  MORE_THAN_FOUR: "MORE_THAN_FOUR",
};

// Store schema
const storeSchema = new Schema({
  businessName: { type: String, required: true },

  storeAddress: { type: String, required: true },

  logo: { type: String, required: true },

  storePhone: { type: String, required: true },

  storeEmail: { type: String, required: true },

  businessRegistration: { type: String, required: true },

  socialMedia: { type: String, required: true },

  storeLocation: { type: String, required: true },

  storeType: {
    type: String,
    // required:true
  },

  isActive: {type: Boolean, default:false},

  // REFERENCE COLUMNS (COMPLEX LOGIC)

  owner: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User who owns the store

  sellers: [{ type: Schema.Types.ObjectId, ref: "Seller" }], // Array of sellers

  repairers: [{ type: Schema.Types.ObjectId, ref: "Repairer" }], // Array of repairers

  branches: [{ type: Schema.Types.ObjectId, ref: "Branch" }], // Array of branches

  plan: {
    type: String,
    enum: Object.values(StorePlan),
    required: true,
  },

  ads: [{ type: Schema.Types.ObjectId, ref: "Ad" }], // Array of ad references

  numberOfEmployees: { type: Number, default: 0 }, // Stores number of employees (sellers + repairers)

  monthlyCharge: { type: Number }, // The monthly charge based on the number of employees
});

// Method to calculate monthly charge based on the number of employees
storeSchema.methods.calculateMonthlyCharge = function () {
  if (this.numberOfEmployees === 1) {
    return 1000; // 1 Employee Store
  } else if (this.numberOfEmployees === 4) {
    return 10000; // 4 Employees Store
  } else if (this.numberOfEmployees > 4) {
    return 5000; // More than 4 Employees Store
  }
  return 0; // If no employees, no charge
};

// Hook to update monthly charge before saving the store
storeSchema.pre("save", function (next) {
  this.monthlyCharge = this.calculateMonthlyCharge();
  next();
});

// Models
const StoreModel = mongoose.model("Store", storeSchema);

// Exporting models and store plans
module.exports = StoreModel;
