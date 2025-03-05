
// Simple confetti animation
export function launchConfetti() {
  const colors = ['#9b87f5', '#58d7c5', '#FF7E67', '#FFCA58', '#7ED957'];
  const numConfetti = 100;
  
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
    confetti.style.borderRadius = '50%';
    confetti.style.opacity = '0.7';
    
    // Starting position
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.top = `${Math.random() * 20 - 20}vh`;
    
    // Animation
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.transition = `all ${Math.random() * 2 + 1}s ease-out`;
    
    container.appendChild(confetti);
    
    // Animate after a small delay to trigger the transition
    setTimeout(() => {
      confetti.style.top = `${100 + Math.random() * 20}vh`;
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.opacity = '0';
    }, 10);
  }
  
  // Remove container after animations complete
  setTimeout(() => {
    document.body.removeChild(container);
  }, 3000);
}
