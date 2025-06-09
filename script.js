document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Language Translation
    const languageSwitchers = document.querySelectorAll('.language-switcher');
    const translatableElements = document.querySelectorAll('[data-en], [data-hi]');

    function setLanguage(lang) {
        translatableElements.forEach(element => {
            if (element.dataset[lang]) {
                if (element.tagName === 'TITLE') {
                    document.title = element.dataset[lang];
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    // For input/textarea placeholders or values if needed
                    // For now, these are not directly translated via data attributes in this example
                } else {
                    element.textContent = element.dataset[lang];
                }
            }
        });
        // Update button texts specifically if they are not picked by generic selector
        const toggleColorButton = document.getElementById('colorSchemeToggle');
        if (toggleColorButton) {
            toggleColorButton.textContent = toggleColorButton.dataset[lang];
        }
    }

    languageSwitchers.forEach(switcher => {
        switcher.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.target.dataset.lang;
            setLanguage(lang);
        });
    });

    // Initialize with default language (e.g., English)
    setLanguage('en');

    // Color Scheme Switching
    const colorSchemeToggle = document.getElementById('colorSchemeToggle');
    const body = document.body;

    colorSchemeToggle.addEventListener('click', () => {
        body.classList.toggle('alternate-theme');
        // You might want to save the user's preference in localStorage
        if (body.classList.contains('alternate-theme')) {
            localStorage.setItem('theme', 'alternate');
        } else {
            localStorage.removeItem('theme'); // Or set to 'default'
        }
    });

    // Check for saved theme preference on load
    if (localStorage.getItem('theme') === 'alternate') {
        body.classList.add('alternate-theme');
    }
});
