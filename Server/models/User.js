const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      unique: false,
      require: [true, "first name is required"],
      trim: true,
    },
    lastname: {
      type: String,
      unique: false,
      required: [true, "last name is required"],
      trim: true,
    },
    username: {
      type: String,
      unique: false,
      required: [true, "username is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email already exists"],
      trim: true,
      validate: {
        validator: isEmail,
        message: "Please provide valid email",
      },
    },
    password: {
      type: String,
      unique: false,
      required: [true, "please provide password"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    profilePicture: {
      type: String,
      unique: false,
      default: "",
    },
    bio: {
      unique: false,
      type: String,
    },
    socialLinks: {
      unique: false,
      type: [String],
    },
    website: {
      unique: false,
      type: String,
    },
    dateOfBirth: {
      unique: false,
      type: Date,
    },
    location: {
      unique: false,
      type: String,
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    registrationDate: {
      type: Date,
      unique: false,
      default: Date.now,
    },
    lastLoginDate: {
      unique: false,
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      unique: false,
      default: false,
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },
  },
  { toJSON: { virtuals: true } },
  { timestamps: true }
);

userSchema.virtual("fullname").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

userSchema.virtual("postCounts").get(function () {
  return this.posts.length;
});

userSchema.virtual("followersCount").get(function () {
  return this.followers.length;
});

userSchema.virtual("followingCount").get(function () {
  return this.following.length;
});

userSchema.virtual("followersCount").get(function () {
  return this.followers.length;
});
userSchema.virtual("followersCount").get(function () {
  return this.followers.length;
});
userSchema.virtual("followersCount").get(function () {
  return this.followers.length;
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
