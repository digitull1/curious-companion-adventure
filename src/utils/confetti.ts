
// Enhanced confetti animation with options
interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: {
    x?: number;
    y?: number;
  };
  colors?: string[];
}

export function launchConfetti(options: ConfettiOptions = {}) {
  const colors = options.colors || ['#9b87f5', '#58d7c5', '#FF7E67', '#FFCA58', '#7ED957'];
  const numConfetti = options.particleCount || 100;
  const spread = options.spread || 70;
  const originX = options.origin?.x || 0.5; // Default to center
  const originY = options.origin?.y || 0.5; // Default to middle
  
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);
  
  for (let i = 0; i < numConfetti; i++) {
    const confetti = document.createElement('div');
    
    // Random properties
    const size = Math.random() * 10 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    confetti.style.position = 'absolute';
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.backgroundColor = color;
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'; // Mix of circles and squares
    confetti.style.opacity = '0.7';
    
    // Starting position - use the origin parameters
    const startX = originX * window.innerWidth;
    const startY = originY * window.innerHeight;
    const angle = Math.random() * Math.PI * 2; // Random direction
    const distance = Math.random() * spread;
    
    confetti.style.left = `${startX}px`;
    confetti.style.top = `${startY}px`;
    
    // Animation
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.transition = `all ${Math.random() * 2 + 1}s ease-out`;
    
    container.appendChild(confetti);
    
    // Animate after a small delay to trigger the transition
    setTimeout(() => {
      // Calculate end position based on angle and distance
      const endX = startX + Math.cos(angle) * distance * 10;
      const endY = startY + Math.sin(angle) * distance * 5 + 200; // Add gravity effect
      
      confetti.style.top = `${endY}px`;
      confetti.style.left = `${endX}px`;
      confetti.style.opacity = '0';
    }, 10);
  }
  
  // Remove container after animations complete
  setTimeout(() => {
    document.body.removeChild(container);
  }, 3000);
}
