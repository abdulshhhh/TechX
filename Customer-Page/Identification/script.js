
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 60,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#2e7d32"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                }
            },
            opacity: {
                value: 0.3,
                random: true,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#1b5e20",
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });

    // Card selection functionality
    const cards = document.querySelectorAll('.card');
    const selectButtons = document.querySelectorAll('.select-btn');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't flip back if clicking the select button
            if (e.target.classList.contains('select-btn')) return;
            
            this.querySelector('.card-inner').classList.toggle('flipped');
        });
    });
    
    selectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const role = this.closest('.card').dataset.role;
            selectRole(role);
        });
    });
    
    function selectRole(role) {
        // Here you would typically redirect or show a form
        // For now, we'll just show an alert
        const roleNames = {
            farmer: 'Farmer',
            customer: 'Customer',
            driver: 'Driver'
        };
        
        // Create a delightful confirmation
        const confirmation = document.createElement('div');
        confirmation.className = 'confirmation';
        confirmation.innerHTML = `
            <div class="confirmation-content">
                <i class="fas fa-check-circle"></i>
                <h3>Welcome, ${roleNames[role]}!</h3>
                <p>You've selected to continue as a ${roleNames[role].toLowerCase()}.</p>
                <button class="continue-btn">Continue</button>
            </div>
        `;
        
        document.body.appendChild(confirmation);
        
        // Add some styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            .confirmation {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            
            .confirmation-content {
                background: var(--card-bg);
                padding: 2rem;
                border-radius: 15px;
                text-align: center;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                transform: scale(0.9);
                animation: scaleUp 0.3s ease forwards;
            }
            
            .confirmation i {
                font-size: 4rem;
                color: var(--success);
                margin-bottom: 1rem;
            }
            
            .confirmation h3 {
                margin-bottom: 1rem;
                color: var(--text);
            }
            
            .confirmation p {
                color: var(--text-secondary);
                margin-bottom: 1.5rem;
            }
            
            .continue-btn {
                background: var(--primary);
                color: white;
                border: none;
                padding: 0.8rem 2rem;
                border-radius: 50px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .continue-btn:hover {
                background: var(--primary-dark);
                transform: translateY(-2px);
            }
            
            @keyframes scaleUp {
                to {
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Handle continue button
        confirmation.querySelector('.continue-btn').addEventListener('click', function() {
            // In a real app, you would redirect to the appropriate registration page
            alert(`Redirecting to ${roleNames[role]} registration...`);
            document.body.removeChild(confirmation);
            document.head.removeChild(style);
        });
    }
    
    // Add more floating icons dynamically
    const icons = ['fa-leaf', 'fa-apple-alt', 'fa-carrot', 'fa-seedling', 'fa-wheat', 'fa-pepper-hot'];
    const colors = ['#2e7d32', '#1b5e20', '#ff6d00', '#ff9800', '#4caf50', '#8bc34a'];
    
    for (let i = 0; i < 10; i++) {
        const icon = document.createElement('i');
        icon.className = `fas ${icons[Math.floor(Math.random() * icons.length)]} floating-icon`;
        icon.style.color = colors[Math.floor(Math.random() * colors.length)];
        icon.style.opacity = '0.1';
        icon.style.left = `${Math.random() * 100}%`;
        icon.style.top = `${Math.random() * 100}%`;
        icon.style.fontSize = `${Math.random() * 2 + 1}rem`;
        icon.style.animationDuration = `${Math.random() * 10 + 10}s`;
        icon.style.animationDelay = `${Math.random() * 10}s`;
        document.querySelector('.floating-icons').appendChild(icon);
    }
});