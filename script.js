document.addEventListener('DOMContentLoaded', () => {

    // 1. Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust scroll position to account for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const offsetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close navbar on mobile after click (for Bootstrap toggler)
                const navbarCollapse = document.getElementById('navbarNav');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            }
        });
    });

    // 2. Language Translation
    const languageSwitchers = document.querySelectorAll('.language-switcher');
    const translatableElements = document.querySelectorAll('[data-en], [data-hi]');

    function setLanguage(lang) {
        translatableElements.forEach(element => {
            if (element.dataset[lang]) {
                if (element.tagName === 'TITLE') {
                    document.title = element.dataset[lang];
                } else {
                    element.textContent = element.dataset[lang];
                }
            }
        });
        // Update specific button texts if they are not picked by generic selector
        const toggleColorButton = document.getElementById('colorSchemeToggle');
        if (toggleColorButton) {
            toggleColorButton.textContent = toggleColorButton.dataset[lang];
        }
        const sendEmailButton = document.querySelector('#contactForm button[type="submit"]');
        if (sendEmailButton) {
             sendEmailButton.textContent = sendEmailButton.dataset[lang];
        }
        const whatsappSendButton = document.getElementById('whatsappSend');
        if (whatsappSendButton) {
             whatsappSendButton.textContent = whatsappSendButton.dataset[lang];
        }
        // Store current language preference
        localStorage.setItem('portfolioLang', lang);
    }

    languageSwitchers.forEach(switcher => {
        switcher.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.target.dataset.lang;
            setLanguage(lang);
        });
    });

    // Initialize with preferred language from localStorage or default to English
    const savedLang = localStorage.getItem('portfolioLang') || 'en';
    setLanguage(savedLang);

    // 3. Color Scheme Switching
    const colorSchemeToggle = document.getElementById('colorSchemeToggle');
    const body = document.body;

    if (colorSchemeToggle) {
        colorSchemeToggle.addEventListener('click', () => {
            body.classList.toggle('alternate-theme');
            // Save user's preference in localStorage
            if (body.classList.contains('alternate-theme')) {
                localStorage.setItem('theme', 'alternate');
            } else {
                localStorage.removeItem('theme'); // Or set to 'default'
            }
        });
    }

    // Check for saved theme preference on load
    if (localStorage.getItem('theme') === 'alternate') {
        body.classList.add('alternate-theme');
    }

    // 4. Contact Form Submission (Google Apps Script Backend)
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            formMessage.textContent = 'Sending message...'; // Show loading message
            formMessage.className = 'mt-3 text-center text-info'; // Style as info

            const formData = new FormData(contactForm);
            const formActionUrl = contactForm.action; // Get URL from form's action attribute

            try {
                // Submit form data to the Google Apps Script Web App URL
                const response = await fetch(formActionUrl, {
                    method: 'POST',
                    body: formData // FormData will automatically set content-type header
                });

                const result = await response.json(); // Assuming the Apps Script returns JSON

                if (result.result === 'success') {
                    formMessage.textContent = result.message; // "Message sent successfully!"
                    formMessage.className = 'mt-3 text-center text-success';
                    contactForm.reset(); // Clear the form fields
                } else {
                    formMessage.textContent = result.message || 'Error sending message. Please try again.';
                    formMessage.className = 'mt-3 text-center text-danger';
                }
            } catch (error) {
                console.error('Submission error:', error);
                formMessage.textContent = 'Network error or server issue. Please try again later.';
                formMessage.className = 'mt-3 text-center text-danger';
            }
        });
    }

    // 5. WhatsApp Form Generation
    const whatsappSendButton = document.getElementById('whatsappSend');

    if (whatsappSendButton) {
        whatsappSendButton.addEventListener('click', () => {
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            // Basic validation: ensure required fields are not empty
            if (!nameInput.value || !emailInput.value || !messageInput.value) {
                if (formMessage) {
                    formMessage.textContent = 'Please fill in all required fields.';
                    formMessage.className = 'mt-3 text-center text-danger';
                }
                return; // Stop execution if fields are empty
            }

            const name = nameInput.value;
            const email = emailInput.value;
            const message = messageInput.value;

            // Define your WhatsApp number (include country code, without +, 00, or spaces)
            // Example: For +91 1234567890, use '911234567890'
            const whatsappNumber = '919433815504'; // <--- REPLACE THIS with your WhatsApp number

            // Construct the message
            let whatsappMessage = `Hello, I'm ${name}.\n`;
            whatsappMessage += `My email is: ${email}\n\n`;
            whatsappMessage += `Message:\n${message}\n\n`;
            whatsappMessage += `(Sent from your portfolio website)`;

            // URL-encode the message to make it safe for URLs
            const encodedMessage = encodeURIComponent(whatsappMessage);

            // Construct the WhatsApp URL
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            // Open WhatsApp in a new tab/window
            window.open(whatsappUrl, '_blank');

            // Provide feedback to the user
            if (formMessage) {
                formMessage.textContent = 'WhatsApp chat opened. Please send the message from WhatsApp.';
                formMessage.className = 'mt-3 text-center text-info';
            }
            // Optionally, clear the form after generating the link for WhatsApp
            document.getElementById('contactForm').reset();
        });
    }
});
