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
      if (!req.file){
        return res.status(400).json({
            success: false,
            error: "please upload a PDF file",
            statuscode: 400
        });
      }

      const {title} = req.body;
      if (!title){
        //delete uploaded file if no title provided 
        await fs.unlink(req.file.path);
        return res.status(400).json({
            success: false,
            error: 'please provide a document file',
            statuscode: 400
        });
      }
      //construct the url for the uploaded file
      const baseURL = `http://localhost:${process.env.PORT || 8000}`;
      const fileURL = `${baseURL}/uploads/documents/${req.file.filename}`;

      //create document record 
      const document = await Document.create({
        userId: req.user._id,
        title,
        fileName: req.file.originalname,
        filePath: fileURL, //store the url instead of the local path 
        fileSize: req.file.size,
        status: 'processing'
      });

      //process PDF in background (in production, use a queue like Bull)
      processPDF(document._id, req.file.path).catch(err =>{
        console.error('PDF processing error:',err);
      });

      res.status(201).json({
        success: true,
        data: document,
        message: 'Document uploaded successfully. processing in progress...'
      });
    }catch (error){
     //clean up file on error 
     if(req.file){
        await fs.unlink(req.file.path).catch(()=>{});
     }
     next(error);
    }
};

//helper function to process PDF
const processPDF = async (documentId, filePath)=>{
    try{
        const {text} = await extractTextFromPDF(filePath);

        //create chunks
        const chunks = chunkText(text, 500, 50);

        //update document
        await Document.findByIdAndUpdate(documentId,{
            extractedText: text,
            chunks: chunks,
            status: 'ready'
        });

        console.log(`Document ${documentId} processed successfully`);
    } catch (error) {
      console.error(`error processing document ${documentId}:`, error);

      await Document.findByIdAndUpdate(documentId, {
        status: 'failed'
      });
    }
};

//@desc get all user documents
//@route GET/api/documents
export const getDocuments = async (req, res, next)=>{
    try{
      const documents = await Document.aggregate([
        {
          $match: { userId: new mongoose.Types.ObjectId(req.user._id)}
        },
        {
          $lookup: {
            from: 'flashcards',
            localField: '_id',
            foreignField: 'documentId',
            as: 'flashCardSets'
          }
        },
        {
          $lookup: {
            from: 'quizzes',
            localField: '_id',
            foreignField: 'documentId',
            as: 'quizzes'
          }
        },
        {
          $addFields: {
            flashcardCount : {
              $size: '$flashcardSets'
            },
            quizCount: {
              $size: '$quizzes'
            }
          }
        },
        {
          $project : {
            extractedText: 0,
            chunks: 0,
            flashcardSets: 0,
            quizzes: 0
          }
        },
        {
          $sort: {
            uploadDate: -1
          }
        }
      ]);    
    }catch (error){
     next(error);
    }
};

//@desc get single document with chunks
//@route GET/api/documents/:id
export const getDocument = async (req, res, next)=>{
    try{
      const document = await Document.findOne({
        _id: req.params.id,
        userId: req.user._id
      });

      if (!document){
        return res.status(404).json({
          success: false,
          error: 'Document not found',
          statuscode: 404
        });
      }

      //Get counts of associated falshcards and quizzes
      const flashcardCount = await Flashcard.countDocuments({documentId: document._id, userId: req.user._id});
      const quizCount = await Quiz.countDocuments({documentId: document._id, userId: req.user._id});

      //update last accessed
      document.lastAccessed = Date.now();
      await document.save();

      //combine document data with counts
      const documentData = document.toObject();
      documentData.flashcardCount = flashcardCount;
      documentData.quizCount =quizCount;

      res.status(200).json({
        success: true,
        data: documentData
      }); 
    }catch (error){
     next(error);
    }
};

//@desc Delete document
//@route DELETE /api/documents/:id
export const deleteDocument = async (req, res, next)=>{
      try{
     const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
     });
     if(!document){
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        statuscode: 404
      });
     } 

     //delete file from filesystem
     await fs.unlink(document.filePath).catch(()=>{});

     //delete document
     await document.deleteOne();

     res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
     });
    }catch (error){
     next(error);
    }
};

//@desc update document title
//@route PUT /api/documents/:id
export const updateDocument = async (req, res, next)=>{
     try{
      
    }catch (error){
     next(error);
    }
};

