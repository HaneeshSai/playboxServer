import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf } = format;

// Custom log format
const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
  level: "info", // Default log level
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), customFormat),
  transports: [
    new transports.File({ filename: "./logs/server.log", level: "info" }), // Info and above
    new transports.File({ filename: "./logs/error.log", level: "error" }), // Errors only
  ],
});

// Console logging in non-production environments
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        customFormat
      ),
    })
  );
}

export default logger;
