
import React from "react";

interface AvatarButtonProps {
  avatar: string;
  onClick: () => void;
}

const AvatarButton: React.FC<AvatarButtonProps> = ({
  avatar,
  onClick
}) => {
  const getAvatarEmoji = () => {
    switch (avatar) {
      case "explorer": return "🧭";
      case "scientist": return "🔬";
      case "storyteller": return "📚";
      default: return "🧭";
    }
  };

  const getAvatarColor = () => {
    switch (avatar) {
      case "explorer": return "bg-gradient-to-br from-wonder-yellow to-wonder-yellow-dark";
      case "scientist": return "bg-gradient-to-br from-wonder-teal to-wonder-teal-dark";
      case "storyteller": return "bg-gradient-to-br from-wonder-coral to-wonder-coral-dark";
      default: return "bg-gradient-to-br from-wonder-yellow to-wonder-yellow-dark";
    }
  };

  return (
    <div 
      className={`h-10 w-10 rounded-full ${getAvatarColor()} text-white flex items-center justify-center shadow-magical cursor-pointer transition-all duration-300 hover:shadow-magical-hover text-lg touch-manipulation z-20`}
      onClick={onClick}
      aria-label="Open user menu"
    >
      {getAvatarEmoji()}
    </div>
  );
};

export default AvatarButton;
