/**
 * Content guidelines utility for WonderWhiz's LLM output
 * This ensures consistent formatting across all AI-generated content
 */

/**
 * Cleanses the output text according to content guidelines
 * - Reduces excessive emojis
 * - Ensures proper formatting
 * - Maintains educational, friendly tone
 */
export const formatLLMResponse = (text: string): string => {
  if (!text) return '';
  
  // Track emoji usage to limit frequency
  let emojiCount = 0;
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  const emojisInText = text.match(emojiRegex) || [];
  emojiCount = emojisInText.length;
  
  let formattedText = text;
  
  // 1. Reduce excessive emojis (limit to ~1 emoji per paragraph)
  if (emojiCount > 3) {
    // Count paragraphs to determine reasonable emoji count
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
    const targetEmojiCount = Math.min(paragraphs.length + 1, 5); // Max 5 emojis
    
    if (emojiCount > targetEmojiCount) {
      // Extract all emojis
      const emojis = Array.from(text.matchAll(emojiRegex)).map(m => m[0]);
      
      // Keep only the first few emojis
      const emojisToKeep = emojis.slice(0, targetEmojiCount);
      const emojisToRemove = emojis.slice(targetEmojiCount);
      
      // Remove excess emojis
      let cleanedText = formattedText;
      emojisToRemove.forEach(emoji => {
        cleanedText = cleanedText.replace(new RegExp(emoji, 'g'), '');
      });
      
      formattedText = cleanedText;
    }
  }
  
  // 2. Remove emoji clusters (more than 2 consecutive emojis)
  formattedText = formattedText.replace(/(?:[\p{Emoji_Presentation}\p{Extended_Pictographic}]{2,})/gu, match => {
    return match.slice(0, 1); // Keep only the first emoji
  });
  
  // 3. Fix formatting issues
  // Remove extra whitespace
  formattedText = formattedText.replace(/\s+/g, ' ').trim();
  
  // Restore paragraph breaks
  formattedText = formattedText.replace(/\.\s+([A-Z])/g, '.\n\n$1');
  
  // Ensure consistent capitalization for section titles
  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, (_, title) => {
    // Convert title to Title Case
    const titleCase = title.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    return `**${titleCase}**`;
  });
  
  // 4. Remove duplicate paragraph breaks
  formattedText = formattedText.replace(/\n{3,}/g, '\n\n');
  
  // 5. Add closing hooks if missing (for engagement)
  if (!formattedText.includes('?') && !formattedText.match(/what do you think|ready to|want to learn|try it|discover/i)) {
    const hooks = [
      "What do you think about that?", 
      "Ready to learn more?",
      "What would you like to discover next?",
      "Isn't that fascinating?",
      "Want to explore further?"
    ];
    const randomHook = hooks[Math.floor(Math.random() * hooks.length)];
    formattedText = `${formattedText}\n\n${randomHook}`;
  }
  
  return formattedText;
};

/**
 * Formats a prompt to guide the LLM to follow our content guidelines
 */
export const getSystemPromptForAge = (ageRange: string, language: string = 'en'): string => {
  // Build a system prompt matching our guidelines
  let systemPrompt = `You are WonderWhiz, an educational AI assistant designed for children aged ${ageRange}.
  Your responses should be:
  - Engaging, friendly, and encouraging
  - Age-appropriate in language and content (for ${ageRange} year olds)
  - Educational and factually accurate
  - Concise (2-3 paragraphs maximum)
  - Focused on explaining complex topics in simple terms
  - Free of any inappropriate content
  - Written with short sentences and simple vocabulary
  - Include VERY SPARING use of emojis (maximum 2-3 per response) to emphasize key points
  - Structured with paragraph breaks for readability
  - Include mind-blowing facts that will fascinate children
  - Occasionally use storytelling to explain complex concepts
  - End with a question or hook to encourage further exploration
  - IMPORTANT: Limit your content to 5 main points or less
  - IMPORTANT: Stay 100% on topic and directly address the specific question or topic`;
  
  // Add language-specific instructions
  if (language !== 'en') {
    systemPrompt += `\n\nIMPORTANT: Respond in ${language} language only. All your content must be in ${language}.`;
  }
  
  return systemPrompt;
};
