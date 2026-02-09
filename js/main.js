// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Tabbed Navigation System
// Select all potential "pages" - sections and the header which serves as Home
const pages = document.querySelectorAll('section, header.hero');
const navItems = document.querySelectorAll('.nav-links a');

// Function to show a specific section
function showSection(targetId) {
    // 1. Hide all sections
    pages.forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('fade-in'); // Reset animation
    });

    // 2. Remove active class from all nav links
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    // 3. Show target section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('fade-in');

        // Scroll to top when switching views for a "page turn" feel
        window.scrollTo(0, 0);
    }

    // 4. Set active state on nav link
    const activeLink = document.querySelector(`.nav-links a[href="#${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Initialize: Show Home only
document.addEventListener('DOMContentLoaded', () => {
    // Hide everything first
    pages.forEach(page => page.classList.add('hidden'));

    // Show Home
    showSection('home');
});

// Event Delegation for all internal links
document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        showSection(targetId);
    }
});


// FAQ Accordion (Preserved)
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(faq => {
                if (faq !== item) {
                    faq.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    }
});

// Contact Form Handler (Preserved)
// Smartphone Chat Handler
const contactForm = document.querySelector('.contact-form');
const phoneModal = document.getElementById('phone-modal');
const closePhoneBtn = document.getElementById('close-phone');
const chatBody = document.getElementById('chat-body');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');

if (contactForm && phoneModal) {
    // EmailJS Configuration
    const serviceID = 'YOUR_SERVICE_ID';
    const templateID = 'YOUR_TEMPLATE_ID';

    // 1. Open Phone Handler (Form Submit)
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show loading state or immediate feedback?
        const submitBtn = contactForm.querySelector('button');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';

        // Send Email via EmailJS
        emailjs.sendForm(serviceID, templateID, contactForm)
            .then(() => {
                submitBtn.textContent = 'Message Sent!';

                // Open Phone Modal
                phoneModal.classList.remove('hidden');

                // Get user inputs for chat context
                const nameInput = contactForm.querySelector('input[type="text"]');
                const msgInput = contactForm.querySelector('textarea');
                const userMsg = msgInput.value;

                // Add User's initial message to chat
                addMessage(userMsg, 'sent');
                scrollToBottom();

                // Specific Auto-Reply for Contact Form
                setTimeout(() => {
                    showTypingIndicator();
                    setTimeout(() => {
                        removeTypingIndicator();
                        const reply = "I'm currently unavailable. An email has been sent to the website address regarding your inquiry.";
                        addMessage(reply, 'received');
                        playSound('receive');
                        scrollToBottom();
                    }, 1500);
                }, 1000);

                // Reset form
                contactForm.reset();
                setTimeout(() => { submitBtn.textContent = originalBtnText; }, 3000);
            }, (err) => {
                submitBtn.textContent = 'Error!';
                alert('Failed to send email. Please try again later.');
                console.error('EmailJS Error:', err);
                submitBtn.textContent = originalBtnText;
            });
    });

    // 2. Close Phone Handler
    closePhoneBtn.addEventListener('click', () => {
        phoneModal.classList.add('hidden');
    });

    // Chat State
    let conversationState = 'initial'; // initial, waiting_for_inquiry

    // 3. Chat Interaction (Send New Message)
    function handleChatSubmit() {
        const text = chatInput.value.trim();
        if (text) {
            addMessage(text, 'sent');
            chatInput.value = '';
            scrollToBottom();

            // Handling Chat Logic
            setTimeout(() => {
                showTypingIndicator();
                setTimeout(() => {
                    removeTypingIndicator();

                    if (conversationState === 'initial') {
                        // First interaction in chat (not from form)
                        const reply = "I'm currently offline. Please leave your message here, and it will be automatically sent to arnau8730@gmail.com.";
                        addMessage(reply, 'received');
                        conversationState = 'waiting_for_inquiry';
                    } else if (conversationState === 'waiting_for_inquiry') {
                        // User sent the inquiry
                        // Send this text as an email
                        const params = {
                            from_name: "Chat User",
                            message: text,
                            reply_to: "arnau8730@gmail.com" // simplistic fallback
                        };

                        emailjs.send(serviceID, templateID, params)
                            .then(() => {
                                addMessage("Message sent successfully.", 'received');
                            })
                            .catch((err) => {
                                console.error('EmailJS Error:', err);
                                addMessage("There was an error sending the message.", 'received');
                            });

                        conversationState = 'initial'; // Reset or keep? Resetting allows new inquiries.
                    }

                    scrollToBottom();
                }, 1500);
            }, 1000);
        }
    }

    // Indicators
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.classList.add('message', 'received', 'typing');
        typingDiv.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        chatBody.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    function playSound(type) {
        // Placeholder for sound effect
    }

    // Scroll Reveal Animation (Visual Overhaul)
    const revealElements = document.querySelectorAll('section, .service-card, .project-card, .testimonial-card, .achievement-item, .hero-content, .hero-image');

    // Add base reveal class
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed for one-time animation
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
}
