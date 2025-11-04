import Profile from "../models/Profile.js";

export const getProfile = async (req, res) => {
  try {
    const userSub = req.user && req.user.sub;
    if (!userSub) return res.status(400).json({ error: "Missing user identifier" });

    const profile = await Profile.findOne({ userSub }).lean();
    console.log("Fetched profile for userSub:", userSub, "profile:", profile);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json({ profile });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createProfile = async (req, res) => {
  try {
    const userSub = req.user && req.user.sub;
    if (!userSub) return res.status(400).json({ error: "Missing user identifier" });

    const { name, weight, gender, goal, age, height } = req.body;

    const existing = await Profile.findOne({ userSub });
    if (existing) {
      return res.status(400).json({ error: "Profile already exists" });
    }

    const profile = new Profile({ userSub, name, weight, gender, goal, age, height });
    await profile.save();
    res.status(201).json({ profile });
  } catch (err) {
    console.error("Create profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userSub = req.user && req.user.sub;
    if (!userSub) return res.status(400).json({ error: "Missing user identifier" });

    const { name, weight, gender, goal, age, height } = req.body;
    console.log("Updating profile for userSub:", userSub, "updates:", { name, weight, gender, goal, age, height });
    const profile = await Profile.findOneAndUpdate(
      { userSub },
      { name, weight, gender, goal, age, height },
      { new: true, upsert: false }
    ).lean();
    console.log("Updated profile:", profile);

    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json({ profile });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Record a login for the current user (one entry per day)
export const recordLogin = async (req, res) => {
  try {
    const userSub = req.user && req.user.sub;
    if (!userSub) return res.status(400).json({ error: "Missing user identifier" });

    const today = new Date();
    const todayStr = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();

    // Fetch existing profile
    let profile = await Profile.findOne({ userSub });
    if (!profile) {
      // create minimal profile with loginDates if none exists
      profile = new Profile({ userSub, loginDates: [todayStr] });
      await profile.save();
      return res.json({ message: "Login recorded", profile });
    }

    // Normalize existing dates to date-only ISO strings for comparison
    const hasToday = (profile.loginDates || []).some(d => {
      const dt = new Date(d);
      return dt.getFullYear() === today.getFullYear() && dt.getMonth() === today.getMonth() && dt.getDate() === today.getDate();
    });

    if (!hasToday) {
      profile.loginDates = profile.loginDates || [];
      profile.loginDates.push(today);
      await profile.save();
    }

    res.json({ message: "Login recorded", profile });
  } catch (err) {
    console.error("Record login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
