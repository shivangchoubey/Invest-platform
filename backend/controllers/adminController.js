import Startup from "../models/startup.js";

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