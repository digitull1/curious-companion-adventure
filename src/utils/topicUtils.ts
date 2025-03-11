
/**
 * Process topics from a response string into a string array
 */
export const processTopicsFromResponse = (response: string): string[] => {
  console.log("[TopicUtils] Processing raw topics from response:", response);
  
  if (!response || typeof response !== 'string') {
    console.error("[TopicUtils] Invalid response:", response);
    return [];
  }
  
  // Try to extract a comma-separated list first
  if (response.includes(',')) {
    const commaSeparated = response
      .split(',')
      .map(topic => topic.trim())
      .filter(topic => topic.length > 0);
    
    if (commaSeparated.length > 0) {
      console.log("[TopicUtils] Extracted comma-separated topics:", commaSeparated);
      return commaSeparated;
    }
  }
  
  // Try to extract a newline-separated list
  if (response.includes('\n')) {
    const lines = response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Remove numbers, bullets, etc.
        return line.replace(/^[0-9\.\-\*]+\s*/, '').trim();
      });
    
    if (lines.length > 0) {
      console.log("[TopicUtils] Extracted line-separated topics:", lines);
      return lines;
    }
  }
  
  // If all else fails, just use the entire response as a single topic
  console.log("[TopicUtils] Using entire response as a single topic");
  return [response.trim()];
};

/**
 * Filter topics to ensure they are appropriate and relevant
 */
export const filterTopics = (topics: string[]): string[] => {
  return topics
    .filter(topic => topic.length > 0)
    .filter(topic => 
      !topic.toLowerCase().includes('introduction') && 
      !topic.toLowerCase().includes('welcome') && 
      !topic.toLowerCase().includes('topics') && 
      !topic.toLowerCase().includes('suggested')
    )
    .map(topic => {
      // Remove any remaining prefix numbering or formatting
      return topic
        .replace(/^[0-9\.\-\*]+\s*/, '')  // Remove leading numbers, dots, etc.
        .replace(/^\"|\"$/g, '')         // Remove quote marks
        .trim();
    });
};

/**
 * Get an appropriate emoji for a topic based on its content
 */
export const getTopicEmoji = (topic: string): string => {
  const lowerTopic = topic.toLowerCase();
  
  // Science topics
  if (lowerTopic.includes('space') || lowerTopic.includes('planet') || lowerTopic.includes('star') || lowerTopic.includes('galaxy')) {
    return '🚀';
  }
  if (lowerTopic.includes('animal') || lowerTopic.includes('wildlife') || lowerTopic.includes('pet')) {
    return '🐾';
  }
  if (lowerTopic.includes('dinosaur') || lowerTopic.includes('prehistoric')) {
    return '🦕';
  }
  if (lowerTopic.includes('ocean') || lowerTopic.includes('sea') || lowerTopic.includes('marine')) {
    return '🌊';
  }
  if (lowerTopic.includes('weather') || lowerTopic.includes('climate')) {
    return '🌦️';
  }
  if (lowerTopic.includes('experiment') || lowerTopic.includes('chemistry') || lowerTopic.includes('lab')) {
    return '🧪';
  }
  if (lowerTopic.includes('volcano') || lowerTopic.includes('earthquake')) {
    return '🌋';
  }
  if (lowerTopic.includes('robot') || lowerTopic.includes('technology') || lowerTopic.includes('computer')) {
    return '🤖';
  }
  
  // History topics
  if (lowerTopic.includes('history') || lowerTopic.includes('ancient') || lowerTopic.includes('past')) {
    return '📜';
  }
  if (lowerTopic.includes('egypt') || lowerTopic.includes('pyramid')) {
    return '🏺';
  }
  if (lowerTopic.includes('castle') || lowerTopic.includes('knight') || lowerTopic.includes('medieval')) {
    return '🏰';
  }
  if (lowerTopic.includes('dinosaur')) {
    return '🦖';
  }
  
  // Art topics
  if (lowerTopic.includes('art') || lowerTopic.includes('craft') || lowerTopic.includes('paint')) {
    return '🎨';
  }
  if (lowerTopic.includes('music') || lowerTopic.includes('instrument')) {
    return '🎵';
  }
  
  // Math topics
  if (lowerTopic.includes('math') || lowerTopic.includes('number')) {
    return '🔢';
  }
  
  // Geography topics
  if (lowerTopic.includes('map') || lowerTopic.includes('world') || lowerTopic.includes('country')) {
    return '🗺️';
  }
  if (lowerTopic.includes('mountain') || lowerTopic.includes('volcano')) {
    return '⛰️';
  }
  
  // Activity topics
  if (lowerTopic.includes('game') || lowerTopic.includes('play')) {
    return '🎮';
  }
  if (lowerTopic.includes('cook') || lowerTopic.includes('food') || lowerTopic.includes('bake')) {
    return '👨‍🍳';
  }
  if (lowerTopic.includes('garden') || lowerTopic.includes('plant') || lowerTopic.includes('flower')) {
    return '🌱';
  }
  
  // Default emojis for general categories
  if (lowerTopic.includes('science')) return '🔬';
  if (lowerTopic.includes('nature')) return '🌿';
  if (lowerTopic.includes('book') || lowerTopic.includes('story')) return '📚';
  if (lowerTopic.includes('sport') || lowerTopic.includes('exercise')) return '⚽';
  
  // Fallback to these general emojis if no specific match
  const generalEmojis = ['✨', '🌟', '💡', '🔍', '🧠', '🌈', '🎓', '📝', '🌍', '🔮'];
  const randomIndex = Math.floor(Math.random() * generalEmojis.length);
  return generalEmojis[randomIndex];
};
