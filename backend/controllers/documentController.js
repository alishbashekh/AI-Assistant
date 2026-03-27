import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import { extractTextFromPDF } from '../utils/pdfparser.js';
import { chunkText } from '../utils/textchunker.js';
import fs from 'fs/promises';
import mongoose from 'mongoose';

//@desc Upload PDF document
//@route POST /api/documents/upload
export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a PDF file",
        statuscode: 400,
      });
    }

    const { title } = req.body;
    if (!title) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({
        success: false,
        error: "Please provide a document title",
        statuscode: 400,
      });
    }

    const baseURL = `http://localhost:${process.env.PORT || 8000}`;
    const fileURL = `${baseURL}/uploads/documents/${req.file.filename}`;

    // Create document record
    const document = await Document.create({
      userId: req.user._id,
      title,
      fileName: req.file.originalname,
      filePath: fileURL, // URL for frontend
      fileLocalPath: req.file.path, // local path for deletion/processing
      fileSize: req.file.size,
      status: 'processing',
    });

    // Process PDF in background
    processPDF(document._id, req.file.path).catch((err) => {
      console.error("PDF processing error:", err);
    });

    res.status(201).json({
      success: true,
      data: document,
      message: "Document uploaded successfully. Processing in progress...",
    });
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    next(error);
  }
};

// Helper: Process PDF text & create chunks
const processPDF = async (documentId, filePath) => {
  try {
    console.log("=== PDF Processing Started ===");
    console.log("Document ID:", documentId);
    console.log("Local file path:", filePath);

    const { text, numPages } = await extractTextFromPDF(filePath);
    console.log("Extracted text length:", text.length);
    console.log("Number of pages:", numPages);

    if (!text || text.length === 0) {
      throw new Error("No text extracted from PDF");
    }

    const chunks = chunkText(text, 500, 50);
    console.log("Number of chunks created:", chunks.length);

    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks: chunks,
      status: "ready",
    });

    console.log(`Document ${documentId} processed successfully`);
    console.log("=== PDF Processing Finished ===\n");
  } catch (error) {
    console.error(`Error processing document ${documentId}:`, error);
    await Document.findByIdAndUpdate(documentId, { status: "failed" });
  }
};

//@desc Get all user documents
//@route GET /api/documents
export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $lookup: {
          from: 'flashcards',
          localField: '_id',
          foreignField: 'documentId',
          as: 'flashcardSets',
        },
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: '_id',
          foreignField: 'documentId',
          as: 'quizzes',
        },
      },
      {
        $addFields: {
          flashcardCount: { $size: { $ifNull: ['$flashcardSets', []] } },
          quizCount: { $size: { $ifNull: ['$quizzes', []] } },
        },
      },
      {
        $project: {
          extractedText: 0,
          chunks: 0,
          flashcardSets: 0,
          quizzes: 0,
        },
      },
      { $sort: { uploadDate: -1 } },
    ]);

    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    next(error);
  }
};

//@desc Get single document with chunks
//@route GET /api/documents/:id
export const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        statuscode: 404,
      });
    }

    const flashcardCount = await Flashcard.countDocuments({
      documentId: document._id,
      userId: req.user._id,
    });
    const quizCount = await Quiz.countDocuments({
      documentId: document._id,
      userId: req.user._id,
    });

    document.lastAccessed = Date.now();
    await document.save();

    const documentData = document.toObject();
    documentData.flashcardCount = flashcardCount;
    documentData.quizCount = quizCount;

    res.status(200).json({ success: true, data: documentData });
  } catch (error) {
    next(error);
  }
};

//@desc Delete document
//@route DELETE /api/documents/:id
export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        statuscode: 404,
      });
    }

    // Delete local file
    if (document.fileLocalPath) {
      await fs.unlink(document.fileLocalPath).catch(() => {});
    }

    await document.deleteOne();

    res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};