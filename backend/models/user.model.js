import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator"
import crypto from "crypto"

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        minlength: [4, "Name must be at least 3 charaters long"],
        maxlength: [100, "Name cannot be not more than 100 characters"]
    },
    phone: {
        type: Number,
        required: function() {
            return !this.googleId; // Phone required only if not a Google user
        },
        unique: true,
        trim: true,
        validate: {
            validator: function (value) {
                if (!value) return true; // Allow empty for Google users
                const str = value.toString();
                return /^[6-9]\d{9}$/.test(str) && Number.isInteger(value);
            },
            message: "Please enter a valid 10-digit Indian mobile number"
        }

    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value); // ✅ true or false
            },
            message: "Please enter email in correct format - /xyz@gmail.com/"
        }
    },
    gender: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        default: "not specified"
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password required only if not a Google user
        },
        minlength: [8, "Password must be at least 8 chatacter long"],
        // select: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows null values and unique constraint only on non-null
    },
    role: {
        type: String,
        default: "user"
    },
    avatar: {
        public_id: {
            type: String,
            // required: true
        },
        secure_url: {
            type: String,
            // required: true
        }
    },

    refreshToken: {
        type: String,
        // select: false
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    social_links: {
        youtube: {
            type: String,
            default: "",
        },
        instagram: {
            type: String,
            default: "",
        },
        facebook: {
            type: String,
            default: "",
        },
        twitter: {
            type: String,
            default: "",
        },
        github: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        }
    },



    verificationCode: Number,
    verificationCodeExpire: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,

    // Payment and subscription fields
    isPremium: {
        type: Boolean,
        default: false
    },
    subscriptionPlan: {
        type: String,
        enum: ["monthly", "yearly"],
        default: null
    },
    subscriptionEndDate: {
        type: Date,
        default: null
    },

    // Usage tracking for free tier limits
    usageLimits: {
        month: { type: Number, default: new Date().getMonth() },
        year: { type: Number, default: new Date().getFullYear() },
        aiSuggestions: { type: Number, default: 0 },
        colorPalettes: { type: Number, default: 0 }
    },

    // Team collaboration
    teams: [
        {
            team: {
                type: Schema.Types.ObjectId,
                ref: "Team",
            },
            role: {
                type: String,
                enum: ["owner", "admin", "member"],
                default: "member",
            },
            joinedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],

},
    {
        timestamps: true,
    }

);


// * is password modified
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})


// *password validation
userSchema.methods.isPasswordCorrect = async function (password) {
    // console.log(password, this.password)
    return await bcrypt.compare(password, this.password)
}



// * access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            phone: this.phone,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}



// * refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};


// * generate verificatoin code
userSchema.methods.generateVerificationCode = function () {
    function generateCodeNumber() {
        const firstDigit = Math.floor(Math.random() * 9) + 1
        const remainingDigits = Math.floor(Math.random() * 10000).toString().padStart(5, 0)

        return parseInt(firstDigit + remainingDigits)
    }

    const verificationCode = generateCodeNumber()
    this.verificationCode = verificationCode
    this.verificationCodeExpire = Date.now() + 3 * 60 * 1000
    // console.log("Generated Verification Code:", verificationCode);
    return verificationCode
}


// *Reset password link
userSchema.methods.generateResetPasswordLink = function () {
    const forgotToken = crypto.randomBytes(20).toString("hex");

    this.forgotPasswordToken = crypto.createHash("sha256").update(forgotToken).digest("hex")

    this.forgotPasswordTokenExpiry = Date.now() + 7 * 60 * 1000

    return forgotToken
}


export const User = mongoose.model("User", userSchema);