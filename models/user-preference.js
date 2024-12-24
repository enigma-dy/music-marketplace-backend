import mongoose from "mongoose";

const settingSchema = mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const UserPreference = mongoose.model("Preference", settingSchema);

export default UserPreference;
