
import React from "react";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  language?: string;
  onLanguageChange?: (newLanguage: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onLanguageChange
}) => {
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "it", name: "Italiano" },
    { code: "pt", name: "Português" },
    { code: "hi", name: "हिन्दी" },
    { code: "zh", name: "中文" },
    { code: "ja", name: "日本語" },
    { code: "ko", name: "한국어" },
  ];

  console.log("LanguageSelector rendering, current language:", language);

  if (!onLanguageChange) {
    console.log("No onLanguageChange provided, returning null");
    return null;
  }

  const handleLanguageClick = (lang: string) => {
    console.log("Language selected:", lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  return (
    <div className="px-4 py-2.5 bg-white">
      <div className="text-sm mb-2 text-muted-foreground flex items-center gap-1.5">
        <Globe className="h-4 w-4" />
        <span>Language / भाषा</span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {languages.slice(0, 6).map((lang) => (
          <button
            key={lang.code}
            className={`text-left px-2 py-1 text-xs rounded-md ${
              language === lang.code
                ? "bg-wonder-purple/20 text-wonder-purple font-medium"
                : "hover:bg-wonder-purple/5"
            }`}
            onClick={() => handleLanguageClick(lang.code)}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
