/**
 * Processes a response string containing topics/sections and returns an array of topics
 */
export const processTopicsFromResponse = (response: string): string[] => {
  console.log("Processing topics from response:", response);
  
  // First, check if we have a line with "fascinating educational topics for X year olds" format
  // and remove it from processing
  let cleanedResponse = response;
  const introLines = [
    /here are \d+ fascinating educational topics for.*/i,
    /fascinating educational topics for.*/i,
    /educational topics for.*/i,
    /topics for \d+-\d+ year olds.*/i
  ];
  
  for (const pattern of introLines) {
    if (pattern.test(cleanedResponse)) {
      cleanedResponse = cleanedResponse.replace(pattern, '');
      break;
    }
  }
  
  // Check if it's a numbered list (most common format)
  // e.g., "1. First topic\n2. Second topic\n3. ..."
  if (/\d+\./.test(cleanedResponse)) {
    // Split by line breaks and extract topics
    const lines = cleanedResponse.split('\n').filter(line => line.trim());
    
    // Extract topics and remove any "table of contents" or intro headers
    const topics = lines
      .filter(line => /\d+\./.test(line))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(topic => {
        const lowerTopic = topic.toLowerCase();
        return !(
          lowerTopic.includes("table of content") ||
          lowerTopic.includes("table of contents") ||
          lowerTopic.includes("welcome") ||
          lowerTopic.includes("introduction") ||
          lowerTopic.includes("here's what") ||
          lowerTopic.includes("let's explore") ||
          lowerTopic.includes("let's learn")
        );
      });
      
    console.log("Processed as numbered list:", topics);
    return topics;
  }

  // Check if it's a bullet list
  // e.g., "• First topic\n• Second topic\n• ..."
  if (/[•*-]/.test(cleanedResponse)) {
    const lines = cleanedResponse.split('\n').filter(line => line.trim());
    
    // Extract topics
    const topics = lines
      .filter(line => /[•*-]/.test(line))
      .map(line => line.replace(/^[•*-]\s*/, '').trim())
      .filter(topic => {
        const lowerTopic = topic.toLowerCase();
        return !(
          lowerTopic.includes("table of content") ||
          lowerTopic.includes("welcome") ||
          lowerTopic.includes("introduction")
        );
      });
      
    console.log("Processed as bullet list:", topics);
    return topics;
  }

  // Check if it's a comma-separated list
  // e.g., "First topic, Second topic, Third topic"
  if (cleanedResponse.includes(',')) {
    const topics = cleanedResponse
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .filter(topic => {
        const lowerTopic = topic.toLowerCase();
        return !(
          lowerTopic.includes("table of content") ||
          lowerTopic.includes("welcome") ||
          lowerTopic.includes("introduction")
        );
      });
      
    console.log("Processed as comma-separated list:", topics);
    return topics;
  }

  // Check if it's a semicolon-separated list
  // e.g., "First topic; Second topic; Third topic"
  if (cleanedResponse.includes(';')) {
    const topics = cleanedResponse
      .split(';')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .filter(topic => {
        const lowerTopic = topic.toLowerCase();
        return !(
          lowerTopic.includes("table of content") ||
          lowerTopic.includes("welcome") ||
          lowerTopic.includes("introduction")
        );
      });
      
    console.log("Processed as semicolon-separated list:", topics);
    return topics;
  }

  // If none of the above formats match, split by lines and filter out empty lines
  const lines = cleanedResponse
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .filter(line => {
      const lowerLine = line.toLowerCase();
      return !(
        lowerLine.includes("table of content") ||
        lowerLine.includes("welcome") ||
        lowerLine.includes("introduction") ||
        lowerLine.includes("here's what") ||
        lowerLine.includes("let's explore") ||
        lowerLine.includes("here are") ||
        lowerLine.match(/^\d+-\d+ year/)
      );
    });
    
  console.log("Processed as line breaks:", lines);
  return lines.length > 0 ? lines : [cleanedResponse];
};

/**
 * Returns an appropriate emoji for a given topic based on keyword matching
 */
export const getTopicEmoji = (topic: string): string => {
  const lowerTopic = topic.toLowerCase();
  
  // Science topics
  if (lowerTopic.includes('science') || lowerTopic.includes('experiment') || lowerTopic.includes('laboratory')) return '🔬';
  if (lowerTopic.includes('astronomy') || lowerTopic.includes('space') || lowerTopic.includes('planet') || lowerTopic.includes('star') || lowerTopic.includes('galaxy')) return '🚀';
  if (lowerTopic.includes('biology') || lowerTopic.includes('cell') || lowerTopic.includes('organism')) return '🧫';
  if (lowerTopic.includes('chemistry') || lowerTopic.includes('chemical') || lowerTopic.includes('element') || lowerTopic.includes('compound')) return '⚗️';
  if (lowerTopic.includes('physics') || lowerTopic.includes('force') || lowerTopic.includes('energy') || lowerTopic.includes('motion')) return '⚡';
  
  // Nature topics
  if (lowerTopic.includes('animal') || lowerTopic.includes('mammal') || lowerTopic.includes('wildlife')) return '🦁';
  if (lowerTopic.includes('plant') || lowerTopic.includes('flower') || lowerTopic.includes('tree')) return '🌱';
  if (lowerTopic.includes('ocean') || lowerTopic.includes('sea') || lowerTopic.includes('marine')) return '🌊';
  if (lowerTopic.includes('forest') || lowerTopic.includes('jungle') || lowerTopic.includes('ecosystem')) return '🌳';
  if (lowerTopic.includes('weather') || lowerTopic.includes('climate') || lowerTopic.includes('meteorology')) return '🌦️';
  
  // History topics
  if (lowerTopic.includes('history') || lowerTopic.includes('ancient') || lowerTopic.includes('past')) return '📜';
  if (lowerTopic.includes('war') || lowerTopic.includes('battle') || lowerTopic.includes('conflict')) return '⚔️';
  if (lowerTopic.includes('civilization') || lowerTopic.includes('culture') || lowerTopic.includes('society')) return '🏛️';
  
  // Geography topics
  if (lowerTopic.includes('geography') || lowerTopic.includes('map') || lowerTopic.includes('terrain')) return '🗺️';
  if (lowerTopic.includes('mountain') || lowerTopic.includes('volcano')) return '🏔️';
  if (lowerTopic.includes('river') || lowerTopic.includes('lake')) return '🏞️';
  if (lowerTopic.includes('desert')) return '🏜️';
  
  // Technology topics
  if (lowerTopic.includes('computer') || lowerTopic.includes('technology') || lowerTopic.includes('digital')) return '💻';
  if (lowerTopic.includes('internet') || lowerTopic.includes('web') || lowerTopic.includes('online')) return '🌐';
  if (lowerTopic.includes('robot') || lowerTopic.includes('artificial intelligence') || lowerTopic.includes('ai')) return '🤖';
  
  // Math topics
  if (lowerTopic.includes('math') || lowerTopic.includes('mathematics') || lowerTopic.includes('calculation')) return '🔢';
  if (lowerTopic.includes('geometry') || lowerTopic.includes('shape')) return '📐';
  
  // Art topics
  if (lowerTopic.includes('art') || lowerTopic.includes('painting') || lowerTopic.includes('drawing')) return '🎨';
  if (lowerTopic.includes('music') || lowerTopic.includes('instrument') || lowerTopic.includes('song')) return '🎵';
  if (lowerTopic.includes('literature') || lowerTopic.includes('book') || lowerTopic.includes('story')) return '📚';
  
  // Sports and activities
  if (lowerTopic.includes('sport') || lowerTopic.includes('game') || lowerTopic.includes('play')) return '🏅';
  if (lowerTopic.includes('exercise') || lowerTopic.includes('fitness') || lowerTopic.includes('health')) return '🏋️';
  
  // Human body topics
  if (lowerTopic.includes('human body') || lowerTopic.includes('anatomy') || lowerTopic.includes('organ')) return '🫀';
  if (lowerTopic.includes('brain') || lowerTopic.includes('mind') || lowerTopic.includes('neuron')) return '🧠';
  
  // Food topics
  if (lowerTopic.includes('food') || lowerTopic.includes('nutrition') || lowerTopic.includes('diet')) return '🍎';
  if (lowerTopic.includes('cooking') || lowerTopic.includes('recipe') || lowerTopic.includes('cuisine')) return '👨‍🍳';
  
  // Default emoji for topics that don't match any category
  return '✨';
};
