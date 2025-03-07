
/**
 * Processes a response string containing topics/sections and returns an array of topics
 */
export const processTopicsFromResponse = (response: string): string[] => {
  console.log("Processing topics from response:", response);
  
  // Check if it's a numbered list (most common format)
  // e.g., "1. First topic\n2. Second topic\n3. ..."
  if (/\d+\./.test(response)) {
    // Split by line breaks and extract topics
    const lines = response.split('\n').filter(line => line.trim());
    
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
  if (/[•*-]/.test(response)) {
    const lines = response.split('\n').filter(line => line.trim());
    
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
  if (response.includes(',')) {
    const topics = response
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
  if (response.includes(';')) {
    const topics = response
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
  const lines = response
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
        lowerLine.includes("let's explore")
      );
    });
    
  console.log("Processed as line breaks:", lines);
  return lines.length > 0 ? lines : [response];
};
