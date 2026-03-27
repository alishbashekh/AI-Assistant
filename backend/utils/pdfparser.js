import fs from "fs/promises";
import * as pdfParse from "pdf-parse"; // Import entire module as namespace

/**
 * Extract text from a PDF file
 * @param {string} filePath
 * @returns {Promise<{text: string, numPages: number, info: object}>}
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);

    // pdfParse is a namespace, the function is the module itself
    const data = await pdfParse.default
      ? await pdfParse.default(dataBuffer)
      : await pdfParse(dataBuffer);

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