import logger from "./logger.js";

export const logError = (error, res) => {
  console.log(error);
  logger.error(error);
  return res.status(500).json({ message: "Internal Server Error" });
};
