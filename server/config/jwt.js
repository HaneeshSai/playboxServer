import jwt from "jsonwebtoken";

const SECRET_KEY = "your-secret-key"; // Replace this with an environment variable in production

// Generate Token
export function generateToken(userId) {
  const token = jwt.sign({ userId }, SECRET_KEY);
  return token;
}

// Verify Token
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded; // Returns the decoded payload if the token is valid
  } catch (error) {
    console.error("Invalid token:", error);
    return null; // Returns null if the token is invalid
  }
}
