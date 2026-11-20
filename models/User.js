import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

//the structure (schema) for a User document in MongoDB
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
    // Automatically removes the hashed password whenever user data is converted to JSON
    toJSON:{
        transform: function(doc,ret){
            delete ret.password;
            return ret;
        },
    },
  }
);
//  Pre-save middleware (hook): Runs automatically BEFORE a User is saved to MongoDB
userSchema.pre("save", async function(next){
  // Only hash the password if it is brand new or was just modified
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
 
})
 //Instance method: Lets any user document verify a plain-text password during login
  userSchema.method.isCorrectPassword = async function(plainTextPassword){
    return bcrypt.compare(plainTextPassword, this.password);
  };
  const User = model("User", userSchema);
  export default User;
