import React, {useState, useEffect} from 'react';
import {Plus, Upload, Trash2, FileText, X} from 'lucide-react';
import toast from "react-hot-toast";

import Documentservice from "../../services/Documentservice";
import Spinner from '../../components/common/Spinner';


const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  //state for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  //state for delete confirmation modal 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

 const fetchDocuments = async () => {
  try{
   const data = await Documentservice.getDocuments();
   setDocuments(data);
  }catch(error){
    toast.error("failed to fetch documents.");
    console.error(error);
  } finally {
    setLoading(false);
  }
 };

 useEffect(()=>{
  fetchDocuments();
 },[]);

 const handleFileChange = (e) => {
  const file = e.target.files[0];
  if(file){
    setUploadFile(file);
    setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
  }
 };

 const handleUpload = async (e) =>{
  e.preventDefault();
  if(!uploadFile || !uploadTitle) {
    toast.error("please provide a title and select a file.");
    return;
  }
  setUploading(true);
  const formData = new FormData();
  formData.append('file',uploadFile);
  formData.append('title',uploadTitle);

 try{
  await Documentservice.uploadDocument(formData);
  toast.success("Document uploaded successfully!");
  setIsUploadModalOpen(false);
  setUploadFile(null);
  setUploadTitle("");
  setLoading(true);
  fetchDocuments();
 }catch(error){
  toast.error(error.message || "upload failed.");
 }finally {
  setUploading(false);
 }
 };
 const handleDeleteRequest = (doc) => {
  setSelectedDoc(doc);
  setIsDeleteModalOpen(true);
 };

 const handleConfirmationDelete = async () => {
  if(!selectedDoc) return;
  setDeleting(true);
  try{
  await Documentservice.deleteDocument(selectedDoc._id);
  toast.success(`'${selectedDoc.title}' deleted.`);
  setIsDeleteModalOpen(false);
  setSelectedDoc(null);
  setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
  }catch(error){
   toast.error(error.message || 'Failed to delete document.');
  }finally{
  setDeleting(false);
  }
 };

 const renderContent = () => {
  return <div>renderContent</div>
 };




  return (
    <div>DocumentListPage</div>
  )
}

export default DocumentListPage