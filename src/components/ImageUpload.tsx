
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
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { ideal: 'environment' } }
      });
      
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
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };
  
  const captureImage = () => {
    if (videoRef.current && streamRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        stopCamera();
      }
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setCapturedImage(base64Image);
    };
    reader.readAsDataURL(file);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const resetCapture = () => {
    setCapturedImage(null);
  };
  
  const confirmImage = () => {
    if (capturedImage) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-magical">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-medium text-wonder-purple">
                Homework Helper
              </h3>
              <button 
                onClick={closeModal}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Take a picture of your homework question, and I'll help you solve it step by step!
              </p>
              
              {!capturedImage && !isCapturing && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={startCamera}
                    className="flex flex-col items-center justify-center gap-2 p-4 border border-wonder-purple/20 rounded-lg bg-wonder-purple/5 hover:bg-wonder-purple/10 transition-colors"
                  >
                    <Camera className="h-6 w-6 text-wonder-purple" />
                    <span className="text-sm font-medium text-wonder-purple">Take Photo</span>
                  </button>
                  
                  <button
                    onClick={triggerFileInput}
                    className="flex flex-col items-center justify-center gap-2 p-4 border border-wonder-purple/20 rounded-lg bg-wonder-purple/5 hover:bg-wonder-purple/10 transition-colors"
                  >
                    <UploadCloud className="h-6 w-6 text-wonder-purple" />
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
                      className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <Camera className="h-6 w-6 text-wonder-purple" />
                    </button>
                    
                    <button
                      onClick={stopCamera}
                      className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-6 w-6 text-red-500" />
                    </button>
                  </div>
                </div>
              )}
              
              {capturedImage && (
                <div className="relative">
                  <img
                    src={capturedImage}
                    alt="Captured homework"
                    className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
                  />
                  
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={resetCapture}
                      className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Retake
                    </button>
                    
                    <button
                      onClick={confirmImage}
                      disabled={isProcessing}
                      className={`py-2 px-4 rounded-lg text-white text-sm font-medium flex items-center gap-2 ${
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
                          <CheckCircle className="h-4 w-4" />
                          <span>Use this image</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-3 text-xs text-gray-500 text-center">
              Images are analyzed to provide homework help and are not stored permanently.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUpload;
