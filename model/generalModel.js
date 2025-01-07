const mongoose = require('mongoose');
const { Schema } = mongoose;

// Enum for Store Types
const StorePlan = {
  SINGLE_EMPLOYEE: '1 Employee',
  FOUR_EMPLOYEES: '4 Employees',
  MORE_THAN_FOUR: 'More than 4 Employees',
};

// Seller schema
const sellerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  store: { type: Schema.Types.ObjectId, ref: 'Store' }, // Reference to the Store
});

// Repairer schema
const repairerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  store: { type: Schema.Types.ObjectId, ref: 'Store' }, // Reference to the Store
});

// Branch schema
const branchSchema = new Schema({
  branchName: { type: String, required: true },
  location: { type: String, required: true },
  store: { type: Schema.Types.ObjectId, ref: 'Store' }, // Reference to the Store
});

// Ad schema
const adSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  mobileModel: { type: String, required: true },
  price: { type: Number, required: true },
  postedBy: { type: Schema.Types.ObjectId, ref: 'Store' }, // Reference to the Store that posted the ad
  createdAt: { type: Date, default: Date.now },
});

// Store schema
const storeSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User who owns the store
  plan: {
    type: String,
    enum: Object.values(StorePlan),
    required: true,
  },
  sellers: [{ type: Schema.Types.ObjectId, ref: 'Seller' }], // Array of sellers
  repairers: [{ type: Schema.Types.ObjectId, ref: 'Repairer' }], // Array of repairers
  branches: [{ type: Schema.Types.ObjectId, ref: 'Branch' }], // Array of branches
  ads: [{ type: Schema.Types.ObjectId, ref: 'Ad' }], // Array of ad references
  numberOfEmployees: { type: Number, default: 0 }, // Stores number of employees (sellers + repairers)
  monthlyCharge: { type: Number, required: true }, // The monthly charge based on the number of employees
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
storeSchema.pre('save', function (next) {
  this.monthlyCharge = this.calculateMonthlyCharge();
  next();
});

// Models
const StoreModel = mongoose.model('Store', storeSchema);
const SellerModel = mongoose.model('Seller', sellerSchema);
const RepairerModel = mongoose.model('Repairer', repairerSchema);
const BranchModel = mongoose.model('Branch', branchSchema);
const AdModel = mongoose.model('Ad', adSchema);

// Exporting models and store plans
module.exports = {
  StoreModel,
  SellerModel,
  RepairerModel,
  BranchModel,
  AdModel,
  StorePlan,
};
