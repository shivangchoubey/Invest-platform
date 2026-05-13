import Startup from "../models/startup.js";
import Investment from "../models/invest.js";

export const canAccessChat = async (user, startupId) => {
  const startup = await Startup.findById(startupId);
  if (!startup) return { allowed: false, status: 404, message: "Startup not found" };

  // Admins can see everything
  if (user.role === "ADMIN") return { allowed: true, startup };

  // Founders can see their own startup chat
  if (user.role === "FOUNDER" && startup.founder.toString() === user._id.toString()) {
    return { allowed: true, startup };
  }

  // Investors can see chat IF the startup is approved AND they have invested (or if we allow all investors to see public discussion)
  // For this platform, let's assume all verified investors can see approved startup chats
  if (user.role === "INVESTOR" && startup.verificationStatus === "APPROVED") {
    return { allowed: true, startup };
  }

  return { allowed: false, status: 403, message: "You do not have access to this chat" };
};
