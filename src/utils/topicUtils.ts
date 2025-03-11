
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
