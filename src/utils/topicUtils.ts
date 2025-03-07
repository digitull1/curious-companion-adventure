
// Process topics from a response string into an array
export const processTopicsFromResponse = (response: string): string[] => {
  console.log("Processing topics from response:", response);
  
  // Clean up the response first - remove any prefixes like "Here are 5 topics..."
  let cleanedResponse = response.replace(/^(here are|these are)\s+\d+\s+(engaging|educational|interesting)?.*(topics|ideas|subjects).*?:/i, "").trim();
  
  // Check if already formatted as a list with numbers or bullets
  if (cleanedResponse.includes("\n")) {
    const lines = cleanedResponse.split("\n").map(line => 
      line.replace(/^\d+[\.\)]?\s*|\*\s*|•\s*|-\s*|and\s+/i, "").trim()
    ).filter(line => line.length > 0);
    
    console.log("Processed as numbered/bulleted list:", lines);
    return lines;
  }
  
  // Check if it's a comma-separated list
  if (cleanedResponse.includes(",")) {
    const topics = cleanedResponse.split(",").map(topic => 
      topic.replace(/^\d+[\.\)]?\s*|and\s+$/i, "").trim()
    ).filter(topic => topic.length > 0);
    
    console.log("Processed as comma-separated list:", topics);
    return topics;
  }
  
  // Just return as a single item if no clear separator
  console.log("No clear separator, returning as single item");
  return [cleanedResponse.trim()];
};

// Map topics to appropriate emoji icons based on keywords
export const getTopicEmoji = (topic: string): string => {
  const lowercaseTopic = topic.toLowerCase();
  
  if (lowercaseTopic.includes("dinosaur")) return "🦖";
  if (lowercaseTopic.includes("planet") || lowercaseTopic.includes("space") || lowercaseTopic.includes("solar")) return "🪐";
  if (lowercaseTopic.includes("robot") || lowercaseTopic.includes("tech")) return "🤖";
  if (lowercaseTopic.includes("animal") || lowercaseTopic.includes("wildlife")) return "🦁";
  if (lowercaseTopic.includes("ocean") || lowercaseTopic.includes("sea") || lowercaseTopic.includes("marine")) return "🌊";
  if (lowercaseTopic.includes("plant") || lowercaseTopic.includes("tree") || lowercaseTopic.includes("flower")) return "🌱";
  if (lowercaseTopic.includes("experiment") || lowercaseTopic.includes("science")) return "🧪";
  if (lowercaseTopic.includes("weather") || lowercaseTopic.includes("climate")) return "🌦️";
  if (lowercaseTopic.includes("insect") || lowercaseTopic.includes("bug") || lowercaseTopic.includes("butterfly")) return "🦋";
  if (lowercaseTopic.includes("volcano") || lowercaseTopic.includes("lava")) return "🌋";
  if (lowercaseTopic.includes("rainbow") || lowercaseTopic.includes("color")) return "🌈";
  if (lowercaseTopic.includes("star") || lowercaseTopic.includes("galaxy")) return "⭐";
  if (lowercaseTopic.includes("mountain") || lowercaseTopic.includes("hill")) return "⛰️";
  if (lowercaseTopic.includes("water") || lowercaseTopic.includes("rain")) return "💧";
  if (lowercaseTopic.includes("history") || lowercaseTopic.includes("ancient")) return "📜";
  if (lowercaseTopic.includes("math") || lowercaseTopic.includes("number")) return "🔢";
  if (lowercaseTopic.includes("music") || lowercaseTopic.includes("instrument")) return "🎵";
  if (lowercaseTopic.includes("art") || lowercaseTopic.includes("craft") || lowercaseTopic.includes("draw")) return "🎨";
  if (lowercaseTopic.includes("build") || lowercaseTopic.includes("bridge") || lowercaseTopic.includes("construct")) return "🏗️";
  
  // Default emoji for topics without specific matches
  return "✨";
};
