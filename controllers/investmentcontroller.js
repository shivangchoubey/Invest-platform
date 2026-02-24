import Investment from "../models/invest.js";
import Startup from "../models/startup.js";

export const investInStartup = async (req, res) => {
  try {
    const { startupId, amount } = req.body;

    if (!startupId || !amount) {
      return res.status(400).json({ message: "Startup and amount required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Investment must be positive" });
    }

    const startup = await Startup.findById(startupId);

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    // Prevent overfunding
    if (startup.amountRaised + amount > startup.fundingGoal) {
      return res.status(400).json({
        message: "Investment exceeds funding goal",
      });
    }

    // Create investment record
    const investment = await Investment.create({
      investor: req.user._id,
      startup: startupId,
      amount,
    });

    // Update startup amountRaised
    startup.amountRaised += amount;
    await startup.save();

    res.status(201).json({
      message: "Investment successful",
      investment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({
      investor: req.user._id,
    })
      .populate("startup", "title fundingGoal amountRaised")
      .sort({ createdAt: -1 });

    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};