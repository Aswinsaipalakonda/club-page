document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    const menuLinks = document.querySelectorAll('.menu a');
    const contactSection = document.querySelector('.contact-section');

    // Toggle menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbar.classList.toggle('active');
    });

    // Handle all menu links including contact
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            // Close mobile menu
            hamburger.classList.remove('active');
            navbar.classList.remove('active');

            // Handle different sections
            if (targetId === '#home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else if (targetId === '#contact') {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navbar.classList.remove('active');
        }
    });

    // Close menu when scrolling
    window.addEventListener('scroll', () => {
        hamburger.classList.remove('active');
        navbar.classList.remove('active');
    });

    // Smooth scroll for Register button
    document.querySelector('.register-btn').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Close mobile menu if open
        const hamburger = document.querySelector('.hamburger');
        const navbar = document.querySelector('.navbar');
        hamburger.classList.remove('active');
        navbar.classList.remove('active');
        
        // Scroll to contact form
        const contactSection = document.querySelector('#contact');
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Focus on the name input field after scrolling
        setTimeout(() => {
            document.querySelector('#name').focus();
        }, 800);
    });

    // Intersection Observer for scroll animations
    const sections = document.querySelectorAll('.about-us, .events, .contact-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2
    });

    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Read More functionality
    const readMoreButtons = document.querySelectorAll('.read-more');
    
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Find the parent container
            const contentContainer = this.closest('.event-content') || this.closest('.about-content');
            
            if (contentContainer) {
                // Find the content elements
                const hiddenContent = contentContainer.querySelector('.hidden-content');
                const shortContent = contentContainer.querySelector('.short-content');
                
                if (hiddenContent) {
                    if (hiddenContent.style.display === 'none' || !hiddenContent.style.display) {
                        // Show full content
                        hiddenContent.style.display = 'block';
                        if (shortContent) {
                            shortContent.style.display = 'block'; // Keep short content visible
                        }
                        this.textContent = 'Read Less';
                    } else {
                        // Hide additional content
                        hiddenContent.style.display = 'none';
                        if (shortContent) {
                            shortContent.style.display = 'block';
                        }
                        this.textContent = 'Read More';
                    }
                    
                    // Smooth scroll
                    hiddenContent.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            }
        });
    });

    // Smooth scroll to contact form
    document.querySelectorAll('a[href="#contact"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector('#contact').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Optional: Focus on the name field
            setTimeout(() => {
                document.querySelector('#name').focus();
            }, 800);
        });
    });

    // Form submission handler
    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const form = this;
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Submit the form data to Formspree
        fetch('https://formspree.io/f/xeoqpklv', {  // Replace YOUR_FORM_ID with your Formspree form ID
            method: 'POST',
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Show success message
                showNotification('Form submitted successfully! We will contact you soon.', 'success');
                form.reset();
            } else {
                // Show error message
                showNotification('Failed to send message. Please try again.', 'error');
            }
        })
        .catch(error => {
            // Show error message
            showNotification('Failed to send message. Please try again.', 'error');
        })
        .finally(() => {
            // Reset button state
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        });
    });

    // Add the showNotification function if it doesn't exist
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add to document
        document.body.appendChild(notification);

        // Add animation
        notification.style.animation = 'slideIn 0.5s forwards';

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s forwards';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // Add this CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            z-index: 1000;
        }

        .notification.success {
            background-color: #4CAF50;
        }

        .notification.error {
            background-color: #f44336;
        }

        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});