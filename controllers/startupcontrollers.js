import Startup from "../models/startup.js";

export const createStartup = async (req, res) => {
  try {
    const { title, description, fundingGoal } = req.body;

    const startup = await Startup.create({
      title,
      description,
      fundingGoal,
      founder: req.user._id,
    });

    res.status(201).json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllStartups = async (req, res) => {
  try {
    const startups = await Startup.find()
      .populate("founder", "name email role");

    res.json(startups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};