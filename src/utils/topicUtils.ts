
// Process topics from a response string into an array
export const processTopicsFromResponse = (response: string): string[] => {
  console.log("Processing topics from response:", response);
  
  // Check if already formatted as a list with numbers or bullets
  if (response.includes("\n")) {
    const lines = response.split("\n").map(line => 
      line.replace(/^\d+[\.\)]?\s*|\*\s*|•\s*|-\s*/, "").trim()
    ).filter(line => line.length > 0);
    
    console.log("Processed as numbered/bulleted list:", lines);
    return lines;
  }
  
  // Check if it's a comma-separated list
  if (response.includes(",")) {
    const topics = response.split(",").map(topic => 
      topic.replace(/^\d+[\.\)]?\s*/, "").trim()
    ).filter(topic => topic.length > 0);
    
    console.log("Processed as comma-separated list:", topics);
    return topics;
  }
  
  // Just return as a single item if no clear separator
  console.log("No clear separator, returning as single item");
  return [response.trim()];
};
