export const validateAmount = (amount) => {
  if (!amount || amount <= 0) return false;

  // Check if amount is a valid number
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return false;

  // Check if amount has too many decimal places (more than 6)
  if (amount.toString().split(".")[1]?.length > 6) return false;

  return true;
};
