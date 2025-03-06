
import React, { useState, useRef } from "react";
import { Camera, X, Image as ImageIcon, CheckCircle, AlertCircle, UploadCloud } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageCapture: (base64Image: string) => void;
  isProcessing: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageCapture, isProcessing }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const openModal = () => {
    setShowUploadModal(true);
    setCapturedImage(null);
  };
  
  const closeModal = () => {
    setShowUploadModal(false);
    stopCamera();
  };
  
  const startCamera = async () => {
    console.log("Starting camera...");
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { ideal: 'environment' } }
      });
      
      console.log("Camera stream obtained");
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Couldn't access your camera. Please check permissions.");
      setIsCapturing(false);
    }
  };
  
  const stopCamera = () => {
    console.log("Stopping camera...");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };
  
  const captureImage = () => {
    console.log("Capturing image...");
    if (videoRef.current && streamRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        console.log("Image captured successfully");
        setCapturedImage(imageDataUrl);
        stopCamera();
      }
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Handling file upload...");
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 4MB)
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image is too large. Please upload an image smaller than 4MB.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target?.result as string;
      console.log("File loaded successfully");
      setCapturedImage(base64Image);
    };
    reader.readAsDataURL(file);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const resetCapture = () => {
    console.log("Resetting capture...");
    setCapturedImage(null);
  };
  
  const confirmImage = () => {
    if (capturedImage) {
      console.log("Confirming image...");
      onImageCapture(capturedImage);
      closeModal();
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="relative p-2 rounded-full text-wonder-purple hover:bg-wonder-purple/10 transition-colors"
        aria-label="Upload homework image"
        title="Upload homework image for help"
      >
        <Camera className="h-5 w-5" />
      </button>
      
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-magical animate-in slide-in-from-bottom-5 duration-300">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-wonder-purple/5 to-wonder-purple-light/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-wonder-purple/10 flex items-center justify-center">
                  <Camera className="h-4 w-4 text-wonder-purple" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-wonder-purple">
                    Homework Helper
                  </h3>
                  <p className="text-xs text-gray-500">Take a clear photo for best results</p>
                </div>
              </div>
              <button 
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4 p-4 bg-wonder-purple/5 rounded-lg border border-wonder-purple/10">
                <p className="text-sm text-gray-600">
                  Take a picture of your homework question, and I'll help you solve it step by step! Make sure:
                </p>
                <ul className="mt-2 space-y-1">
                  <li className="text-xs text-gray-500 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-wonder-purple" />
                    The image is clear and well-lit
                  </li>
                  <li className="text-xs text-gray-500 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-wonder-purple" />
                    Text is readable and not blurry
                  </li>
                  <li className="text-xs text-gray-500 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-wonder-purple" />
                    The question is centered in the frame
                  </li>
                </ul>
              </div>
              
              {!capturedImage && !isCapturing && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={startCamera}
                    className="flex flex-col items-center justify-center gap-2 p-4 border border-wonder-purple/20 rounded-lg bg-wonder-purple/5 hover:bg-wonder-purple/10 transition-colors group"
                  >
                    <Camera className="h-6 w-6 text-wonder-purple group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-wonder-purple">Take Photo</span>
                  </button>
                  
                  <button
                    onClick={triggerFileInput}
                    className="flex flex-col items-center justify-center gap-2 p-4 border border-wonder-purple/20 rounded-lg bg-wonder-purple/5 hover:bg-wonder-purple/10 transition-colors group"
                  >
                    <UploadCloud className="h-6 w-6 text-wonder-purple group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-wonder-purple">Upload Image</span>
                  </button>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
              
              {isCapturing && (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover rounded-lg bg-black"
                  />
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    <button
                      onClick={captureImage}
                      className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors group"
                    >
                      <Camera className="h-6 w-6 text-wonder-purple group-hover:scale-110 transition-transform" />
                    </button>
                    
                    <button
                      onClick={stopCamera}
                      className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors group"
                    >
                      <X className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              )}
              
              {capturedImage && (
                <div className="relative space-y-4">
                  <div className="relative">
                    <img
                      src={capturedImage}
                      alt="Captured homework"
                      className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg pointer-events-none" />
                  </div>
                  
                  <div className="flex justify-between gap-4">
                    <button
                      onClick={resetCapture}
                      className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2 group"
                    >
                      <Camera className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      Retake
                    </button>
                    
                    <button
                      onClick={confirmImage}
                      disabled={isProcessing}
                      className={`flex-1 py-2 px-4 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-2 group ${
                        isProcessing 
                          ? "bg-wonder-purple/70 cursor-not-allowed" 
                          : "bg-wonder-purple hover:bg-wonder-purple-dark"
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          <span>Use this image</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-3 text-xs text-gray-500 text-center border-t border-gray-100">
              Images are analyzed to provide homework help and are not stored permanently.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUpload;
