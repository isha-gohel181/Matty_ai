import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

const apiKeySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    key: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastUsed: {
        type: Date,
        default: null
    },
    usageCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Generate a unique API key
apiKeySchema.statics.generateKey = function() {
    return crypto.randomBytes(32).toString('hex');
};

// Find API key and update usage
apiKeySchema.statics.findAndUpdateUsage = async function(key) {
    const apiKey = await this.findOne({ key, isActive: true }).populate('user');
    if (apiKey) {
        apiKey.lastUsed = new Date();
        apiKey.usageCount += 1;
        await apiKey.save();
    }
    return apiKey;
};

export const ApiKey = mongoose.model("ApiKey", apiKeySchema);