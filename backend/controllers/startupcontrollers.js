import Startup from "../models/startup.js";
import Investment from "../models/invest.js"; // ✅ FIXED: correct file name

export const createStartup = async (req, res) => {
  try {
    const { title, description, opportunity, industryType, fundingGoal, image, equityOffered } = req.body;

    const startup = await Startup.create({
      title,
      description,
      opportunity,
      industryType: industryType || "TECH",
      fundingGoal,
      equityOffered: equityOffered || 0,
      image: image || undefined,
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
    // 🔹 query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "createdAt"; // optional
    const order = req.query.order === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    // 🔹 total count for pagination
    const total = await Startup.countDocuments({
      verificationStatus: "APPROVED",
    });

    let startups = [];

    if (sortBy === "fundingProgress") {
      startups = await Startup.aggregate([
        { $match: { verificationStatus: "APPROVED" } },
        {
          $addFields: {
            fundingProgressNum: {
              $cond: [
                { $eq: ["$fundingGoal", 0] },
                0,
                { $multiply: [{ $divide: ["$amountRaised", "$fundingGoal"] }, 100] }
              ]
            }
          }
        },
        { $sort: { fundingProgressNum: order } },
        { $skip: skip },
        { $limit: limit }
      ]);
      await Startup.populate(startups, { path: "founder", select: "name email role" });
    } else {
      // 🔹 fetch startups
      startups = await Startup.find({
        verificationStatus: "APPROVED",
      })
        .populate("founder", "name email role")
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit);
    }

    // 🔹 get investor count for each startup
    const result = await Promise.all(
      startups.map(async (s) => {
        const startupId = s._id || s._id;
        const investorCount = await Investment.countDocuments({
          startup: startupId,
        });

        return {
          ...(s._doc || s),
          fundingProgress: (
            (s.amountRaised / s.fundingGoal) *
            100
          ).toFixed(2),
          investorCount, // 🔥 NEW
        };
      })
    );

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      total,
      data: result,
    });
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

    const result = await Promise.all(
      startups.map(async (s) => {
        const investorCount = await Investment.countDocuments({
          startup: s._id,
        });

        return {
          ...s._doc,
          fundingProgress: (
            (s.amountRaised / s.fundingGoal) *
            100
          ).toFixed(2),
          investorCount,
        };
      })
    );

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

export const updateStartupImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;

    const startup = await Startup.findById(id);

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    if (startup.founder.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this startup" });
    }

    startup.image = image || undefined;
    await startup.save();

    res.json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const flagStartup = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const startup = await Startup.findById(id);

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    startup.flags.push({
      investor: req.user._id,
      reason,
    });

    await startup.save();

    res.json({ message: "Startup flagged successfully", startup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeStartup = async (req, res) => {
  try {
    const { id } = req.params;
    const startup = await Startup.findById(id);

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    if (startup.founder.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    startup.verificationStatus = "REMOVED";
    await startup.save();

    res.json({ message: "Startup removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const raiseAgain = async (req, res) => {
  try {
    const { id } = req.params;
    const { fundingGoal } = req.body;

    const startup = await Startup.findById(id);

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    if (startup.founder.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    startup.fundingGoal = fundingGoal;
    await startup.save();

    res.json({ message: "Funding goal updated successfully", startup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStartupCompletely = async (req, res) => {
  try {
    const { id } = req.params;
    const startup = await Startup.findById(id);

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    if (startup.founder.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (startup.verificationStatus !== "REMOVED") {
      return res.status(400).json({ message: "Startup must be removed first before complete deletion." });
    }

    await Investment.deleteMany({ startup: id });
    await startup.deleteOne();

    res.json({ message: "Startup completely deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};