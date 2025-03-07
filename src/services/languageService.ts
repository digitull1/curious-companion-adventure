
interface LanguageStrings {
  [key: string]: {
    welcomeMessage: string;
    errorProcessing: string;
    tryAgain: string;
    loading: string;
    awardPoints: string;
    [key: string]: string;
  };
}

// Default language strings for the application
const strings: LanguageStrings = {
  en: {
    welcomeMessage: "Hello! What would you like to learn about today?",
    errorProcessing: "I encountered a problem processing your request. Let's try something else!",
    tryAgain: "Sorry, there was an error. Please try again.",
    loading: "Loading...",
    awardPoints: "Points awarded:",
    completedSection: "Section completed!",
    relatedTopics: "Related Topics",
    suggestedPrompts: "Suggested Topics",
  },
  es: {
    welcomeMessage: "¡Hola! ¿Sobre qué te gustaría aprender hoy?",
    errorProcessing: "Encontré un problema al procesar tu solicitud. ¡Intentemos otra cosa!",
    tryAgain: "Lo siento, hubo un error. Por favor, inténtalo de nuevo.",
    loading: "Cargando...",
    awardPoints: "Puntos otorgados:",
    completedSection: "¡Sección completada!",
    relatedTopics: "Temas relacionados",
    suggestedPrompts: "Temas sugeridos",
  },
  fr: {
    welcomeMessage: "Bonjour! Qu'aimeriez-vous apprendre aujourd'hui?",
    errorProcessing: "J'ai rencontré un problème lors du traitement de votre demande. Essayons autre chose!",
    tryAgain: "Désolé, une erreur s'est produite. Veuillez réessayer.",
    loading: "Chargement...",
    awardPoints: "Points attribués:",
    completedSection: "Section terminée!",
    relatedTopics: "Sujets connexes",
    suggestedPrompts: "Sujets suggérés",
  },
  // Add more languages as needed
};

// Get string based on current language
export const getString = (key: string, language: string = "en"): string => {
  // Default to English if language not found
  const langStrings = strings[language] || strings.en;
  return langStrings[key] || strings.en[key] || key;
};

// Get welcome message based on language and age range
export const getWelcomeMessage = (language: string = "en", ageRange: string = "8-10"): string => {
  const baseMessage = getString("welcomeMessage", language);
  
  // We could customize messages based on age range here
  if (language === "en") {
    if (ageRange === "5-7") {
      return "Hi there! What fun thing should we learn about today?";
    } else if (ageRange === "11-13") {
      return "Welcome! What interesting topic would you like to explore today?";
    }
  }
  
  return baseMessage;
};

// Format the error message based on language
export const getErrorMessage = (language: string = "en", errorDetails?: string): string => {
  return getString("errorProcessing", language);
};

export default {
  getString,
  getWelcomeMessage,
  getErrorMessage
};
