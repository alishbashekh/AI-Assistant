import fs from "fs/promises";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

/**
 * extract text from pdf file
 * @param {string} filePath - path to pdf file
 * @returns {Promise<{text: string, numPages: number}>}
 */

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);

    // pdf-parse is a function, not a class
    const data = await pdf(dataBuffer);

    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    };

  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};