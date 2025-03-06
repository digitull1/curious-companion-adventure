
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

// Star animation for cosmic effect
export function createStarryBackground(container: HTMLElement) {
  // Create stars
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    
    // Random properties
    const size = Math.random() * 3 + 1;
    const opacity = Math.random() * 0.5 + 0.3;
    
    star.style.position = 'absolute';
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.backgroundColor = 'white';
    star.style.borderRadius = '50%';
    star.style.opacity = `${opacity}`;
    
    // Position
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    
    // Animation
    star.style.animation = `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite ${Math.random() * 3}s`;
    
    container.appendChild(star);
  }
  
  // Create floating particles
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    
    // Random properties
    const size = Math.random() * 50 + 20;
    const opacity = Math.random() * 0.1 + 0.05;
    
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = 'radial-gradient(circle, rgba(155,135,245,0.8) 0%, rgba(155,135,245,0) 70%)';
    particle.style.borderRadius = '50%';
    particle.style.opacity = `${opacity}`;
    
    // Position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // Animation
    particle.style.animation = `float ${Math.random() * 20 + 10}s ease-in-out infinite ${Math.random() * 5}s`;
    
    container.appendChild(particle);
  }
}

// Function to show a success message when joining waitlist
export function showWaitlistSuccess() {
  const toast = document.createElement('div');
  toast.className = 'fixed z-50 bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-wonder-purple to-wonder-blue text-white px-6 py-3 rounded-full shadow-2xl flex items-center';
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
    </svg>
    <span>🎉 You've been added to the waitlist! We'll notify you soon.</span>
  `;
  
  document.body.appendChild(toast);
  
  // Add animation
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, 20px)';
    toast.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
  }, 5000);
  
  // Remove from DOM
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 5500);
  
  // Launch confetti
  launchConfetti();
}
