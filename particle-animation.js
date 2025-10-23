// Particle Animation Script for Playhouse SMP (3D Enhanced)
// Add <div class="particle-overlay"></div> to your HTML body
// Then include this script before closing </body> tag

(function() {
    'use strict';
    
    console.log('🎨 3D Particle animation script loaded');
    
    function initParticles() {
        setTimeout(() => {
            const particlesContainer = document.querySelector('.particle-overlay');
            
            if (!particlesContainer) {
                console.warn('⚠️ Particle overlay element not found. Add <div class="particle-overlay"></div> to your HTML');
                return;
            }
            
            console.log('✅ Particle container found! Creating 3D particles...');
            
            // Apply perspective for 3D depth
            particlesContainer.style.perspective = '800px';
            particlesContainer.style.transformStyle = 'preserve-3d';
            particlesContainer.style.overflow = 'hidden';
            particlesContainer.style.position = 'absolute';
            particlesContainer.style.top = '0';
            particlesContainer.style.left = '0';
            particlesContainer.style.width = '100%';
            particlesContainer.style.height = '100%';
            particlesContainer.style.pointerEvents = 'none';
            particlesContainer.style.zIndex = '2';
            
            function createParticle() {
                const particle = document.createElement('div');
                
                // Random depth (Z-axis)
                const depth = Math.random() * 800 - 400; // -400 to 400px
                const scale = 1 - Math.abs(depth) / 800; // smaller when farther
                
                // Random size (1–8px)
                const size = (Math.random() * 7 + 1) * scale;
                
                // Random position - START BELOW SCREEN
                const leftPosition = Math.random() * 100;
                const bottomPosition = Math.random() * -30; // Start below screen (-30% to 0%)
                
                // Random animation delay and duration - FASTER!
                const delay = Math.random() * 0.5; // minimal delay for instant start
                const duration = Math.random() * 6 + 3; // 3–9s for faster movement
                
                // Colors from logo palette
                const colors = [
                    'rgba(224, 167, 54, 1)',    // Bright Gold
                    'rgba(255, 200, 87, 1)',    // Lighter Gold
                    'rgba(49, 39, 131, 0.8)',   // Logo Purple
                    'rgba(42, 31, 71, 0.8)',    // Container Purple
                    'rgba(255, 255, 255, 0.9)'  // White
                ];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                // Apply styles
                particle.style.position = 'absolute';
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.background = color;
                particle.style.borderRadius = '50%';
                particle.style.left = leftPosition + '%';
                particle.style.bottom = bottomPosition + '%';
                particle.style.opacity = 0; // Start invisible!
                particle.style.boxShadow = `0 0 ${size * 6}px ${color}`;
                particle.style.transform = `translateZ(${depth}px) scale(${scale})`;
                particle.style.animation = `floatUpFade ${duration}s linear ${delay}s infinite`;
                particle.style.pointerEvents = 'none';
                
                particlesContainer.appendChild(particle);
            }
            
            // Create 500 particles for dense effect
            for (let i = 0; i < 500; i++) {
                createParticle();
            }
            
            console.log('✅ Created 500 3D particles successfully!');
        }, 100);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticles);
    } else {
        initParticles();
    }
})();