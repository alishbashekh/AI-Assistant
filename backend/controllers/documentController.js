import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import {extractTextFromPDF} from '../utils/pdfparser.js';
import {chunkText} from '../utils/textchunker.js';
import fs from 'fs/promises';
import mongoose from 'mongoose';


//@desc upload pdf document
//@route POST/api/documents/upload
export const uploadDocument = async (req, res, next)=>{
    try{
      
    }catch (error){
     //clean up file on error 
     if(req.file){
        await fs.unlink(req.file.path).catch(()=>{});
     }
     next(error);
    }
};

//@desc get all user documents
//@route GET/api/documents
export const getDocuments = async (req, res, next)=>{

};

//@desc get single document with chunks
//@route GET/api/documents/:id
export const getDocument = async (req, res, next)=>{

};

//@desc Delete document
//@route DELETE /api/documents/:id
export const deleteDocument = async (req, res, next)=>{

};

//@desc update document title
//@route PUT /api/documents/:id
export const updateDocument = async (req, res, next)=>{

};

