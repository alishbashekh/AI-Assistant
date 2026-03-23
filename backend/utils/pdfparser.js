import fs from 'fs/promises';
import {PDFparse} from "pdf-parse";

/**
 * extract text from pdf file
 * @param {string} filePath - path to pdf file
 * @returns {Promise<{text: string, numPages: number}>}
 */

export const extractTextFromPDF= async (filePath)=>{
    try{
     const dataBuffer = await fs.readFile(filePath);
     //pdf-parse expects a unit8Array, not a Buffer
     const parser = new PDFparse(new Uint8Array(dataBuffer));
     const data = await parser.getText();

     return{
        text: data.text,
        numPages: data.numpages,
        info: data.info,
     };

    }catch (error){
     console.error("PDF parsing error:", error);
     throw new Error("Failed to extract text from PDF");
    }
};