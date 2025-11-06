import Profile from "../models/Profile.js";

export const me = async (req, res) => {
  try {
    const tokenPayload = req.user || null;
    let profile = null;
    if (tokenPayload && tokenPayload.sub) {
      profile = await Profile.findOne({ userSub: tokenPayload.sub }).lean();
    }
    return res.json({ tokenPayload, profile });
  } catch (err) {
    console.error("Debug me error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Find profiles for debugging. Query with ?sub=<userSub> to search by Cognito sub.
export const findProfiles = async (req, res) => {
  try {
    const { sub } = req.query;
    if (sub) {
      const profile = await Profile.findOne({ userSub: sub }).lean();
      return res.json({ profiles: profile ? [profile] : [] });
    }
    const profiles = await Profile.find({}).limit(200).lean();
    return res.json({ profiles });
  } catch (err) {
    console.error("Debug findProfiles error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
