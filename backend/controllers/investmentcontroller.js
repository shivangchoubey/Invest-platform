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

    // Calculate equity
    const equity = (amount / startup.fundingGoal) * (startup.equityOffered || 0);

    // Create investment record
    const investment = await Investment.create({
      investor: req.user._id,
      startup: startupId,
      amount,
      equity,
    });
    // Prevent founder investing in own startup
    if (startup.founder.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot invest in your own startup",
      });
    }
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
      .populate("startup", "title fundingGoal amountRaised industryType")
      .sort({ createdAt: -1 });

    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const investment = await Investment.findById(id);

    if (!investment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    if (investment.investor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const startup = await Startup.findById(investment.startup);
    if (startup) {
      startup.amountRaised = Math.max(0, startup.amountRaised - investment.amount);
      await startup.save();
    }

    await investment.deleteOne();

    res.json({ message: "Investment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};