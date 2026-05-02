import Startup from "../models/startup.js";

export const getPendingStartups = async (req, res) => {
  try {
    const pendingStartups = await Startup.find({ verificationStatus: "PENDING" }).sort({ createdAt: -1 });
    res.json(pendingStartups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveStartup = async (req, res) => {
  try {
    const { id } = req.params;

    const startup = await Startup.findById(id);

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    startup.verificationStatus = "APPROVED";
    await startup.save();

    res.json({ message: "Startup approved", startup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectStartup = async (req, res) => {
  try {
    const { id } = req.params;

    const startup = await Startup.findById(id);

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    startup.verificationStatus = "REJECTED";
    await startup.save();

    res.json({ message: "Startup rejected", startup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFlaggedStartups = async (req, res) => {
  try {
    const flaggedStartups = await Startup.find({ 
      "flags.0": { $exists: true },
      verificationStatus: { $ne: "REMOVED" }
    }).sort({ createdAt: -1 });
    res.json(flaggedStartups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const ignoreFlag = async (req, res) => {
  try {
    const { id } = req.params;
    const startup = await Startup.findById(id);

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    startup.flags = [];
    await startup.save();

    res.json({ message: "Flags ignored", startup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFlaggedStartup = async (req, res) => {
  try {
    const { id } = req.params;
    const startup = await Startup.findById(id);

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    startup.verificationStatus = "REMOVED";
    await startup.save();

    res.json({ message: "Startup removed", startup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};