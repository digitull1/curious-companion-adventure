
import React, { useState } from "react";
import { Volume2, Loader2 } from "lucide-react";
import { useOpenAI } from "@/hooks/useOpenAI";
import AudioPlayer from "@/components/AudioPlayer";

interface SpeechButtonProps {
  text: string;
  messageId: string;
}

const SpeechButton: React.FC<SpeechButtonProps> = ({ text, messageId }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioData, setAudioData] = useState<{ audioContent: string; contentType: string } | null>(null);
  const { textToSpeech } = useOpenAI();

  const handleGenerateSpeech = async () => {
    if (isGenerating || audioData) return;
    
    setIsGenerating(true);
    try {
      const result = await textToSpeech(text);
      if (result) {
        // Fix: Create a proper audioData object instead of trying to set a string
        setAudioData({ 
          audioContent: result, 
          contentType: "audio/mpeg" 
        });
      }
    } catch (error) {
      console.error("Failed to generate speech:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      {!audioData ? (
        <button
          onClick={handleGenerateSpeech}
          disabled={isGenerating}
          className="inline-flex items-center justify-center text-wonder-purple hover:text-wonder-purple-dark transition-colors"
          title="Listen to this explanation"
          aria-label="Generate speech"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </button>
      ) : (
        <AudioPlayer 
          audioContent={audioData.audioContent} 
          contentType={audioData.contentType} 
          messageId={messageId}
        />
      )}
    </div>
  );
};

export default SpeechButton;
