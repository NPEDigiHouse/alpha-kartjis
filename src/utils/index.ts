import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const createResponse = (
  status: string,
  data: string | object | null = null
) => {
  if (data) {
    return { status, data };
  }

  return { status, message: data };
};

export const hashData = (data: string, algorithm: string, salt?: string) => {
  // Create a SHA256 hash object
  const hash = crypto.createHash(algorithm);

  // Combine the salt and data
  const saltedData = (salt ?? "") + data;

  // Update the hash object with the salted data
  hash.update(saltedData, "utf8");

  // Generate the hexadecimal hash
  const hashedData = hash.digest("hex");

  return hashedData;
};

export const constants = {
  SUCCESS_RESPONSE_MESSAGE: "success",
  FAILED_RESPONSE_MESSAGE: "failed",
};
