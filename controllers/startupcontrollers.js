import Startup from "../models/startup.js";
import Investment from "../models/invest.js"; // ✅ FIXED: correct file name

export const createStartup = async (req, res) => {
  try {
    const { title, description, fundingGoal } = req.body;

    const startup = await Startup.create({
      title,
      description,
      fundingGoal,
      founder: req.user._id,
      // verificationStatus will default to "PENDING"
    });

    res.status(201).json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllStartups = async (req, res) => {
  try {
    const startups = await Startup.find({
      verificationStatus: "APPROVED", // ✅ ADDED: only show approved startups
    }).populate("founder", "name email role");

    const result = startups.map((s) => ({
      ...s._doc,
      fundingProgress: (
        (s.amountRaised / s.fundingGoal) *
        100
      ).toFixed(2),
    }));

    res.json(result);
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

    // ✅ OPTIONAL IMPROVEMENT: add fundingProgress here too
    const result = startups.map((s) => ({
      ...s._doc,
      fundingProgress: (
        (s.amountRaised / s.fundingGoal) *
        100
      ).toFixed(2),
    }));

    res.json(result);
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

    // ✅ ADDED: block access if not approved
    if (startup.verificationStatus !== "APPROVED") {
      return res.status(403).json({
        message: "Startup not approved yet",
      });
    }

    const investments = await Investment.find({
      startup: id,
    }).populate("investor", "name email");

    res.json({
      startup: {
        ...startup._doc,
        fundingProgress: (
          (startup.amountRaised / startup.fundingGoal) *
          100
        ).toFixed(2),
      },
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