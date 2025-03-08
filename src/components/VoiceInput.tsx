
import React, { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
// Reference the type definitions
/// <reference path="../types/webspeech.d.ts" />

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  isListening: boolean;
  toggleListening: () => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onTranscript, 
  isListening, 
  toggleListening 
}) => {
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionAPI();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);
        onTranscript(currentTranscript);
      };
      
      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        if (isListening) {
          toggleListening();
        }
      };
      
      setRecognition(recognitionInstance);
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);
  
  useEffect(() => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
      setTranscript("");
    }
  }, [isListening, recognition]);
  
  return (
    <button
      onClick={toggleListening}
      className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
        isListening
          ? "bg-destructive text-white animate-pulse"
          : "bg-wonder-purple/10 text-wonder-purple hover:bg-wonder-purple/20"
      }`}
      title={isListening ? "Stop listening" : "Start voice input"}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </button>
  );
};

export default VoiceInput;
