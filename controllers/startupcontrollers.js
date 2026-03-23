import Startup from "../models/startup.js";
import Investment from "../models/invest.js";

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
export const getMyStartups = async (req, res) => {
  try {
    const startups = await Startup.find({
      founder: req.user._id,
    })
      .populate("founder", "name email")
      .sort({ createdAt: -1 });

    res.json(startups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStartupById = async (req, res) => {
  try {
    const { id } = req.params;

    const startup = await Startup.findById(id).populate(
      "founder",
      "name email"
    );

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    const investments = await Investment.find({
      startup: id,
    }).populate("investor", "name email");

    res.json({
      startup,
      investors: investments.map((inv) => ({
        investor: inv.investor,
        amount: inv.amount,
        date: inv.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};