export const COMMON_WEAK_PASSWORDS = [
  "password",
  "password123",
  "password123!",
  "password1234",
  "12345678",
  "123456789",
  "1234567890",
  "qwerty123",
  "qwerty1234",
  "admin123",
  "admin1234",
  "admin123!",
  "welcome123",
  "welcome123!",
  "letmein123",
  "iloveyou123",
  "pass1234",
  "1234pass",
];

export const checkPasswordCriteria = (password, email = "") => {
  const trimmed = password || "";
  const emailPrefix = email ? email.split("@")[0].toLowerCase() : "";

  const criteria = {
    length: trimmed.length >= 8,
    lowercase: /[a-z]/.test(trimmed),
    uppercase: /[A-Z]/.test(trimmed),
    number: /[0-9]/.test(trimmed),
    special: /[^A-Za-z0-9]/.test(trimmed),
    notCommon: !COMMON_WEAK_PASSWORDS.includes(trimmed.toLowerCase()),
    noRepeatedChars: !/^(.)\1+$/.test(trimmed) && trimmed.length > 0,
    noEmailMatch: !emailPrefix || emailPrefix.length < 3 || !trimmed.toLowerCase().includes(emailPrefix),
  };

  // Calculate score (0 to 4)
  let score = 0;
  if (criteria.length) score += 1;
  if (criteria.lowercase && criteria.uppercase) score += 1;
  if (criteria.number) score += 1;
  if (criteria.special) score += 1;

  // Penalize if common, repeated, or contains email
  if (!criteria.notCommon || !criteria.noRepeatedChars || !criteria.noEmailMatch) {
    score = Math.min(score, 1);
  }

  // Label and colors
  let strengthLabel = "Weak";
  let strengthColor = "text-red-500";
  let barColor = "bg-red-500";

  if (trimmed.length === 0) {
    strengthLabel = "None";
    strengthColor = "text-gray-400";
    barColor = "bg-gray-200";
  } else if (score <= 1) {
    strengthLabel = "Weak";
    strengthColor = "text-red-500";
    barColor = "bg-red-500";
  } else if (score === 2) {
    strengthLabel = "Fair";
    strengthColor = "text-amber-500";
    barColor = "bg-amber-500";
  } else if (score === 3) {
    strengthLabel = "Good";
    strengthColor = "text-blue-500";
    barColor = "bg-blue-500";
  } else if (score === 4) {
    strengthLabel = "Strong";
    strengthColor = "text-emerald-600";
    barColor = "bg-emerald-600";
  }

  const isAllValid =
    criteria.length &&
    criteria.lowercase &&
    criteria.uppercase &&
    criteria.number &&
    criteria.special &&
    criteria.notCommon &&
    criteria.noRepeatedChars &&
    criteria.noEmailMatch;

  return {
    criteria,
    score,
    strengthLabel,
    strengthColor,
    barColor,
    isValid: isAllValid,
  };
};
