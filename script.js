/* ========================================
   APC Enugu State 2027 - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functions
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initCounterAnimation();
    initBackToTop();
    initFormValidation();
    initScrollAnimations();
    initNewsFilter();
    checkAdminAccess();
    // Load forum posts from database
    asyncRenderForumPosts();
});

/* Navbar Scroll Effect */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const topBar = document.querySelector('.top-bar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            topBar.style.transform = 'translateY(-100%)';
        } else {
            navbar.classList.remove('scrolled');
            topBar.style.transform = 'translateY(0)';
        }
    });
}

/* Mobile Menu Toggle */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    mobileToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');

        // Toggle hamburger animation
        const spans = this.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

/* Smooth Scrolling */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active nav link
                updateActiveNav(href);
            }
        });
    });

    // Update active nav on scroll
    window.addEventListener('scroll', function () {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a:not(.btn-join)');

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    });
}

function updateActiveNav(href) {
    const navLinks = document.querySelectorAll('.nav-menu a:not(.btn-join)');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === href) {
            link.classList.add('active');
        }
    });
}

/* Counter Animation */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const noComma = counter.hasAttribute('data-no-comma');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = noComma ? Math.floor(current) : Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = noComma ? target : target.toLocaleString();
            }
        };

        updateCounter();
    };

    // Use Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '50px' });

    counters.forEach(counter => {
        // Check if counter is already in viewport (fallback for page load)
        const rect = counter.getBoundingClientRect();
        const isInViewport = rect.top >= 0 && rect.top <= window.innerHeight;
        if (isInViewport) {
            animateCounter(counter);
        } else {
            observer.observe(counter);
        }
    });
}

/* Back to Top Button */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* Form Validation */
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const lga = document.getElementById('lga').value;
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !email || !lga || !message) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');

            if (!isValidEmail(emailInput.value.trim())) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            showNotification('Thank you for subscribing to our newsletter!', 'success');
            emailInput.value = '';
        });
    }
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#00A859' : '#dc3545'};
        color: white;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
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
    }

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/* Scroll Animations */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.about-content, .about-image, .leader-card, .news-card, .member-stat, .cta-card, .info-card'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

/* Parallax Effect for Hero (Optional Enhancement) */
window.addEventListener('scroll', function () {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.scrollY;
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

/* Preloader (Optional) */
window.addEventListener('load', function () {
    document.body.classList.add('loaded');
});

/* News Filter Functionality */
function initNewsFilter() {
    const filterTabs = document.querySelectorAll('.news-tab');
    const newsCards = document.querySelectorAll('.news-card[data-category]');

    if (filterTabs.length === 0) return;

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Update active tab styling
            filterTabs.forEach(t => {
                t.style.background = 'transparent';
                t.style.color = '#00A859';
            });
            this.style.background = '#00A859';
            this.style.color = 'white';

            // Filter news cards
            const filter = this.getAttribute('data-filter');

            newsCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Add fadeIn animation if not exists
    if (!document.querySelector('#news-filter-styles')) {
        const style = document.createElement('style');
        style.id = 'news-filter-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes ticker {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
            .ticker-content {
                display: inline-block;
                animation: ticker 20s linear infinite;
            }
        `;
        document.head.appendChild(style);
    }
}

/* ========================================
   Membership Modal Functions
   ======================================== */

function openMembershipModal() {
    const modal = document.getElementById('membershipModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Add animation styles if not exists
        if (!document.querySelector('#modal-styles')) {
            const style = document.createElement('style');
            style.id = 'modal-styles';
            style.textContent = `
                @keyframes modalSlideIn {
                    from { opacity: 0; transform: translateY(-50px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .modal-content:hover button[type="submit"] {
                    transform: scale(1.02);
                }
            `;
            document.head.appendChild(style);
        }
    }
}

function closeMembershipModal() {
    const modal = document.getElementById('membershipModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function (e) {
    const modal = document.getElementById('membershipModal');
    if (e.target === modal) {
        closeMembershipModal();
    }
});

// Handle membership form submission
document.addEventListener('DOMContentLoaded', function () {
    const membershipForm = document.getElementById('membershipForm');
    if (membershipForm) {
        membershipForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                if (data[key]) {
                    if (Array.isArray(data[key])) {
                        data[key].push(value);
                    } else {
                        data[key] = [data[key], value];
                    }
                } else {
                    data[key] = value;
                }
            });

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;

            try {
                // Submit to API
                const response = await fetch('api/submit-membership.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    // Show success message
                    const modalBody = document.querySelector('#membershipModal .modal-content');
                    modalBody.innerHTML = `
                        <div style="padding: 4rem 2rem; text-align: center;">
                            <div style="font-size: 5rem; margin-bottom: 1.5rem;">✅</div>
                            <h2 style="color: #00A859; margin-bottom: 1rem;">Registration Successful!</h2>
                            <p style="color: #666; font-size: 1.1rem; max-width: 400px; margin: 0 auto 2rem; line-height: 1.6;">
                                Thank you for registering with APC GAT 2027 Enugu State Chapter. 
                                Your membership application has been received and is pending approval.
                            </p>
                            <p style="background: #f0f8f0; padding: 1rem; border-radius: 10px; margin-bottom: 2rem;">
                                <strong>Membership No:</strong> ${result.membershipNo || 'Pending'}<br>
                                <small>Please save this number for future reference</small>
                            </p>
                            <button onclick="closeMembershipModal(); location.reload();" 
                                style="padding: 1rem 2rem; background: #00A859; color: white; border: none; border-radius: 10px; font-size: 1rem; cursor: pointer;">
                                <i class="fas fa-check"></i> Done
                            </button>
                        </div>
                    `;
                } else {
                    showNotification(result.message || 'Submission failed. Please try again.', 'error');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Network error. Please try again later.', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

/* ========================================
   Polling Units Modal Functions
   ======================================== */

// Enugu State LGAs and Polling Units Data
const enuguPollingUnits = {
    'aninri': {
        name: 'Aninri LGA',
        wards: [
            { name: 'Nenwe Ward', units: ['Nenwe Central Primary School', 'Nenwe Community Hall', 'Nenwe Market Square'] },
            { name: 'Oduma Ward', units: ['Oduma Town Hall', 'Oduma Primary School', 'Oduma Health Center'] },
            { name: 'Mpu Ward', units: ['Mpu Central School', 'Mpu Community Square', 'Mpu Market'] },
            { name: 'Okpanku Ward', units: ['Okpanku Primary School', 'Okpanku Town Hall'] },
            { name: 'Ndiabor Ward', units: ['Ndiabor Central School', 'Ndiabor Village Square'] }
        ]
    },
    'awgu': {
        name: 'Awgu LGA',
        wards: [
            { name: 'Awgu Ward I', units: ['Awgu Central School', 'Awgu Town Hall', 'St. Patrick\'s Primary School'] },
            { name: 'Awgu Ward II', units: ['Community Primary School Awgu', 'Awgu Market Square'] },
            { name: 'Mgbowo Ward', units: ['Mgbowo Primary School', 'Mgbowo Town Hall', 'Mgbowo Health Center'] },
            { name: 'Ituku Ward', units: ['Ituku Central School', 'Ituku Community Hall'] },
            { name: 'Ugwueme Ward', units: ['Ugwueme Primary School', 'Ugwueme Town Square'] }
        ]
    },
    'enugu-east': {
        name: 'Enugu East LGA',
        wards: [
            { name: 'Abakpa Nike Ward I', units: ['Abakpa Nike Primary School', 'Nike Lake Resort Area', 'Trans-Ekulu Primary School'] },
            { name: 'Abakpa Nike Ward II', units: ['Community School Abakpa', 'Nike Grammar School', 'Abakpa Market'] },
            { name: 'Nkwo Nike Ward', units: ['Nkwo Nike Primary School', 'Nike Town Hall', 'St. Mary\'s Primary School'] },
            { name: 'Amechi Idodo Ward', units: ['Amechi Primary School', 'Idodo Community Hall'] },
            { name: 'Emene Ward', units: ['Emene Primary School', 'Emene Industrial Area Hall', 'PRODA Gate'] }
        ]
    },
    'enugu-north': {
        name: 'Enugu North LGA',
        wards: [
            { name: 'GRA Ward', units: ['Government House Area', 'State House of Assembly', 'Government College'] },
            { name: 'Asata Ward', units: ['Asata Primary School', 'Asata Town Hall', 'St. Patrick\'s Asata'] },
            { name: 'Ogui Ward', units: ['Ogui Urban Primary School', 'Ogui Nike Road', 'IMT Junction'] },
            { name: 'New Haven Ward', units: ['New Haven Primary School', 'Holy Ghost Cathedral Area', 'New Haven Market'] },
            { name: 'Independence Layout Ward', units: ['Independence Layout School', 'ESUT Teaching Hospital Area'] }
        ]
    },
    'enugu-south': {
        name: 'Enugu South LGA',
        wards: [
            { name: 'Achara Layout Ward', units: ['Achara Layout Primary School', 'Achara Town Hall', 'Maryland Junction'] },
            { name: 'Uwani Ward', units: ['Uwani Primary School', 'Uwani Market', 'UNEC Gate Area'] },
            { name: 'Awkunanaw Ward', units: ['Awkunanaw Primary School', 'Awkunanaw Town Hall'] },
            { name: 'Amechi Ward', units: ['Amechi Awkunanaw School', 'Gariki Market Area'] },
            { name: 'Agbani Road Ward', units: ['Agbani Road Primary School', 'Holy Rosary Junction'] }
        ]
    },
    'ezeagu': {
        name: 'Ezeagu LGA',
        wards: [
            { name: 'Aguobu-Owa Ward', units: ['Aguobu Primary School', 'Owa Town Hall', 'Milken Hill Area'] },
            { name: 'Umana Ndiagu Ward', units: ['Umana Primary School', 'Ndiagu Community Hall'] },
            { name: 'Olo Ward', units: ['Olo Central School', 'Olo Market Square'] },
            { name: 'Aguobu-Iwollo Ward', units: ['Iwollo Primary School', 'Iwollo Town Hall'] },
            { name: 'Oghe Ward', units: ['Oghe Primary School', 'Oghe Community Center'] }
        ]
    },
    'igbo-etiti': {
        name: 'Igbo Etiti LGA',
        wards: [
            { name: 'Ogbede Ward', units: ['Ogbede Primary School', 'Ogbede Town Hall', '9th Mile Corner'] },
            { name: 'Ukehe Ward', units: ['Ukehe Central School', 'Ukehe Market', 'St. Theresa\'s School'] },
            { name: 'Aku Ward', units: ['Aku Primary School', 'Aku Town Hall'] },
            { name: 'Ohodo Ward', units: ['Ohodo Community School', 'Ohodo Market Square'] },
            { name: 'Ozalla Ward', units: ['Ozalla Primary School', 'Ozalla Town Hall'] }
        ]
    },
    'igbo-eze-north': {
        name: 'Igbo Eze North LGA',
        wards: [
            { name: 'Enugu-Ezike Ward I', units: ['Enugu-Ezike Central School', 'Enugu-Ezike Town Hall', 'Ogrute Market'] },
            { name: 'Enugu-Ezike Ward II', units: ['Community School Enugu-Ezike', 'St. John\'s Primary School'] },
            { name: 'Obollo-Afor Ward', units: ['Obollo-Afor Primary School', 'Obollo Market', 'Obollo Town Hall'] },
            { name: 'Aji Ward', units: ['Aji Primary School', 'Aji Community Center'] },
            { name: 'Unadu Ward', units: ['Unadu Central School', 'Unadu Town Hall'] }
        ]
    },
    'igbo-eze-south': {
        name: 'Igbo Eze South LGA',
        wards: [
            { name: 'Ibagwa-Aka Ward', units: ['Ibagwa-Aka Primary School', 'Ibagwa Town Hall', 'Community Health Center'] },
            { name: 'Itchi Ward', units: ['Itchi Central School', 'Itchi Market Square'] },
            { name: 'Uhunowerre Ward', units: ['Uhunowerre Primary School', 'Uhunowerre Town Hall'] },
            { name: 'Nkalagu-Obukpa Ward', units: ['Nkalagu Primary School', 'Obukpa Community Hall'] },
            { name: 'Ovoko Ward', units: ['Ovoko Central School', 'Ovoko Town Hall'] }
        ]
    },
    'isi-uzo': {
        name: 'Isi Uzo LGA',
        wards: [
            { name: 'Ikem Ward', units: ['Ikem Central School', 'Ikem Town Hall', 'Ikem Market Square'] },
            { name: 'Eha-Amufu Ward I', units: ['Eha-Amufu Primary School', 'College of Education Area'] },
            { name: 'Eha-Amufu Ward II', units: ['Community School Eha-Amufu', 'Eha-Amufu Market'] },
            { name: 'Mbu Ward', units: ['Mbu Primary School', 'Mbu Town Hall'] },
            { name: 'Neke Ward', units: ['Neke Central School', 'Neke Community Center'] }
        ]
    },
    'nkanu-east': {
        name: 'Nkanu East LGA',
        wards: [
            { name: 'Amagunze Ward', units: ['Amagunze Primary School', 'Amagunze Town Hall', 'Community Health Center'] },
            { name: 'Nomeh Ward', units: ['Nomeh Central School', 'Nomeh Market Square'] },
            { name: 'Mburubu Ward', units: ['Mburubu Primary School', 'Mburubu Town Hall'] },
            { name: 'Nara Ward', units: ['Nara Central School', 'Nara Community Center'] },
            { name: 'Oruku Ward', units: ['Oruku Primary School', 'Oruku Town Hall'] }
        ]
    },
    'nkanu-west': {
        name: 'Nkanu West LGA',
        wards: [
            { name: 'Agbani Ward', units: ['Agbani Central Primary School', 'Agbani Town Hall', 'Agbani Market'] },
            { name: 'Akpugo Ward', units: ['Akpugo Primary School', 'Akpugo Community Hall'] },
            { name: 'Ozalla Ward', units: ['Ozalla Primary School', 'Ozalla Town Hall'] },
            { name: 'Obe Ward', units: ['Obe Central School', 'Obe Market Square'] },
            { name: 'Amurri Ward', units: ['Amurri Primary School', 'Amurri Town Hall'] }
        ]
    },
    'nsukka': {
        name: 'Nsukka LGA',
        wards: [
            { name: 'Nsukka Urban Ward I', units: ['UNN Main Gate', 'Nsukka Town Hall', 'Ogige Market'] },
            { name: 'Nsukka Urban Ward II', units: ['St. Theresa\'s Cathedral', 'University Market', 'Odenigwe'] },
            { name: 'Obukpa Ward', units: ['Obukpa Primary School', 'Obukpa Town Hall'] },
            { name: 'Eha-Alumona Ward', units: ['Eha-Alumona Central School', 'Eha-Alumona Market'] },
            { name: 'Alor-Uno Ward', units: ['Alor-Uno Primary School', 'Alor-Uno Town Hall'] }
        ]
    },
    'oji-river': {
        name: 'Oji River LGA',
        wards: [
            { name: 'Oji Urban Ward', units: ['Oji River Township School', 'Ochi Ngwu', 'Oji River Market'] },
            { name: 'Inyi Ward', units: ['Inyi Primary School', 'Inyi Town Hall', 'Inyi Market'] },
            { name: 'Akpugoeze Ward', units: ['Akpugoeze Central School', 'Akpugoeze Community Hall'] },
            { name: 'Ugwuoba Ward', units: ['Ugwuoba Primary School', 'Ugwuoba Town Hall'] },
            { name: 'Achi Ward', units: ['Achi Central School', 'Achi Market Square'] }
        ]
    },
    'udenu': {
        name: 'Udenu LGA',
        wards: [
            { name: 'Obollo-Eke Ward', units: ['Obollo-Eke Central School', 'Obollo-Eke Market', 'Obollo-Eke Junction'] },
            { name: 'Ezimo Ward', units: ['Ezimo Primary School', 'Ezimo Town Hall'] },
            { name: 'Orba Ward', units: ['Orba Central School', 'Orba Market Square'] },
            { name: 'Obollo-Etiti Ward', units: ['Obollo-Etiti Primary School', 'Obollo-Etiti Town Hall'] },
            { name: 'Amalla Ward', units: ['Amalla Primary School', 'Amalla Community Center'] }
        ]
    },
    'udi': {
        name: 'Udi LGA',
        wards: [
            { name: 'Udi Urban Ward', units: ['Udi Township School', 'Udi Town Hall', 'Udi Market'] },
            { name: 'Nsude Ward', units: ['Nsude Primary School', 'Nsude Town Hall'] },
            { name: 'Ngwo Ward', units: ['Ngwo Central School', 'Ngwo Market', 'Ngwo Cave Area'] },
            { name: 'Abia Ward', units: ['Abia Primary School', 'Abia Community Hall'] },
            { name: 'Affa Ward', units: ['Affa Central School', 'Affa Town Hall'] }
        ]
    },
    'uzo-uwani': {
        name: 'Uzo Uwani LGA',
        wards: [
            { name: 'Umulokpa Ward', units: ['Umulokpa Primary School', 'Umulokpa Town Hall', 'Umulokpa Market'] },
            { name: 'Adani Ward', units: ['Adani Central School', 'Adani Market', 'Adani Town Hall'] },
            { name: 'Nimbo Ward', units: ['Nimbo Primary School', 'Nimbo Community Hall'] },
            { name: 'Ugbene-Ajima Ward', units: ['Ugbene Primary School', 'Ajima Town Hall'] },
            { name: 'Nrobo Ward', units: ['Nrobo Central School', 'Nrobo Market Square'] }
        ]
    }
};

function openPollingUnitsModal() {
    const modal = document.getElementById('pollingUnitsModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        // Reset selector
        document.getElementById('lgaSelector').value = '';
        document.getElementById('pollingUnitsContainer').style.display = 'none';
    }
}

function closePollingUnitsModal() {
    const modal = document.getElementById('pollingUnitsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function showPollingUnits(lgaValue) {
    const container = document.getElementById('pollingUnitsContainer');
    const lgaName = document.getElementById('selectedLgaName');
    const unitsList = document.getElementById('pollingUnitsList');

    if (!lgaValue) {
        container.style.display = 'none';
        return;
    }

    const lgaData = enuguPollingUnits[lgaValue];
    if (!lgaData) return;

    lgaName.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${lgaData.name} - Wards & Polling Units`;

    let html = '';
    lgaData.wards.forEach((ward, index) => {
        html += `
            <div style="margin-bottom: 1rem; padding: 1rem; background: ${index % 2 === 0 ? '#f9f9f9' : '#fff'}; border-radius: 10px; border-left: 4px solid #00A859;">
                <h5 style="color: #004B87; margin-bottom: 0.5rem;"><i class="fas fa-landmark"></i> ${ward.name}</h5>
                <ul style="margin: 0; padding-left: 1.5rem; color: #666;">
                    ${ward.units.map(unit => `<li style="padding: 3px 0;"><i class="fas fa-check-circle" style="color: #00A859; font-size: 0.8rem;"></i> ${unit}</li>`).join('')}
                </ul>
            </div>
        `;
    });

    unitsList.innerHTML = html;
    container.style.display = 'block';
}

// Close modal when clicking outside
document.addEventListener('click', function (e) {
    const modal = document.getElementById('pollingUnitsModal');
    if (e.target === modal) {
        closePollingUnitsModal();
    }
});

/* ========================================
   Backend Admin Session Check
   ======================================== */

// Global variable to store admin session data
let backendAdminData = null;

// Check if admin is logged in via backend
async function checkBackendAdminSession() {
    try {
        const response = await fetch('api/check_admin_session.php', {
            credentials: 'include' // Important: send cookies with request
        });
        const data = await response.json();

        if (data.isAdmin) {
            backendAdminData = data;
            showFrontendAdminControls();
        } else {
            backendAdminData = null;
            hideFrontendAdminControls();
        }
    } catch (error) {
        console.error('Error checking admin session:', error);
        backendAdminData = null;
    }
}

// Show admin controls on frontend
function showFrontendAdminControls() {
    // Show "Create Post" floating button
    let adminBtn = document.getElementById('frontendAdminBtn');
    if (!adminBtn) {
        // Create floating button
        adminBtn = document.createElement('button');
        adminBtn.id = 'frontendAdminBtn';
        adminBtn.innerHTML = '<i class="fas fa-plus"></i> Create Post';
        adminBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #00A859, #1a5f3c);
            color: white;
            padding: 15px 25px;
            border: none;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 5px 25px rgba(0,168,89,0.4);
            z-index: 9999;
            transition: all 0.3s ease;
        `;

        adminBtn.onmouseover = () => {
            adminBtn.style.transform = 'translateY(-3px)';
            adminBtn.style.boxShadow = '0 8px 30px rgba(0,168,89,0.6)';
        };
        adminBtn.onmouseout = () => {
            adminBtn.style.transform = 'translateY(0)';
            adminBtn.style.boxShadow = '0 5px 25px rgba(0,168,89,0.4)';
        };

        adminBtn.onclick = openPostModal;
        document.body.appendChild(adminBtn);
    }
    adminBtn.style.display = 'block';
}

// Hide admin controls
function hideFrontendAdminControls() {
    const adminBtn = document.getElementById('frontendAdminBtn');
    if (adminBtn) {
        adminBtn.style.display = 'none';
    }
}


/* ========================================
   Grassroots Forum Functions
   ======================================== */

// Forum Admin Password (In production, this should be server-side)
const ADMIN_PASSWORD = 'Idokonelson2306';

// Check if admin is logged in
function isAdminLoggedIn() {
    return sessionStorage.getItem('forumAdminLoggedIn') === 'true';
}

// Toggle admin login form visibility
function toggleAdminLogin() {
    const loginForm = document.getElementById('adminLoginForm');
    const toggleBtn = document.getElementById('adminToggleBtn');

    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        toggleBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
    } else {
        loginForm.style.display = 'none';
        toggleBtn.innerHTML = '<i class="fas fa-lock"></i> Admin Login';
    }
}

// Admin login function
function adminLogin() {
    const password = document.getElementById('adminPassword').value;

    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('forumAdminLoggedIn', 'true');
        showNotification('Welcome, Publicity Secretary! You are now logged in.', 'success');
        updateAdminUI();
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminLoginForm').style.display = 'none';
    } else {
        showNotification('Incorrect password. Please try again.', 'error');
    }
}

// Check for admin access via URL parameter or existing session
function checkAdminAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const isAdminParam = urlParams.get('admin') === 'true';
    const loginSection = document.getElementById('adminLoginSection');

    // If admin query param is present, show the login button
    if (isAdminParam || isAdminLoggedIn()) {
        if (loginSection) {
            loginSection.style.display = 'block';
        }
    }
}

// Update UI based on admin status
function updateAdminUI() {
    const adminBar = document.getElementById('forumAdminBar');
    const loginSection = document.querySelector('.admin-login-section');
    const forumFeatures = document.getElementById('forumFeaturesSection');

    if (isAdminLoggedIn()) {
        adminBar.style.display = 'flex';
        adminBar.style.justifyContent = 'center';
        adminBar.style.marginBottom = '2rem';

        // Show Forum Features for admin
        if (forumFeatures) {
            forumFeatures.style.display = 'block';
        }

        // Add logout button
        adminBar.innerHTML = `
            <button class="btn btn-primary" onclick="openPostModal()" style="margin-right: 1rem;">
                <i class="fas fa-plus"></i> Create New Post
            </button>
            <button class="btn btn-outline" onclick="adminLogout()" style="border-color: #dc3545; color: #dc3545;">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        `;
        loginSection.style.display = 'none';
    } else {
        adminBar.style.display = 'none';

        // Only show login section if admin param is present
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('admin') === 'true') {
            loginSection.style.display = 'block';
        } else {
            loginSection.style.display = 'none';
        }

        // Hide Forum Features for non-admin
        if (forumFeatures) {
            forumFeatures.style.display = 'none';
        }
    }
}

// Admin logout
function adminLogout() {
    sessionStorage.removeItem('forumAdminLoggedIn');
    showNotification('You have been logged out.', 'success');
    updateAdminUI();
}

// Open post creation modal
function openPostModal() {
    const modal = document.getElementById('postModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Open post creation modal with pre-selected type
function openPostModalWithType(type) {
    const modal = document.getElementById('postModal');
    const typeSelect = document.getElementById('postType');
    if (modal && typeSelect) {
        typeSelect.value = type;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Close post creation modal
function closePostModal() {
    const modal = document.getElementById('postModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Reset form
        document.getElementById('postForm').reset();
    }
}

// Close modal when clicking outside
document.addEventListener('click', function (e) {
    const postModal = document.getElementById('postModal');
    if (e.target === postModal) {
        closePostModal();
    }
});

// Get posts from API
async function getForumPosts() {
    try {
        const response = await fetch('api/forum_posts.php');
        const result = await response.json();
        return result.success ? result.posts : [];
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

// Create a new post via API
async function createPost(type, title, content, imageData = null) {
    const postData = {
        type,
        title,
        content,
        image: imageData,
        author: backendAdminData?.adminName || 'Nelson Ndudi Idoko',
        authorRole: 'Publicity Secretary, Enugu State'
    };

    try {
        const response = await fetch('api/forum_posts.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });
        const result = await response.json();
        return result.success ? result.post : null;
    } catch (error) {
        console.error('Error creating post:', error);
        return null;
    }
}

// Store the current post image data
let currentPostImageData = null;

// Preview post image before upload
function previewPostImage(input) {
    const file = input.files[0];
    if (file) {
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Image size must be less than 5MB', 'error');
            input.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            currentPostImageData = e.target.result;
            document.getElementById('imagePreview').src = currentPostImageData;
            document.getElementById('imagePreviewContainer').style.display = 'block';
            document.getElementById('imageUploadArea').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

// Remove post image
function removePostImage() {
    currentPostImageData = null;
    document.getElementById('postImage').value = '';
    document.getElementById('imagePreview').src = '';
    document.getElementById('imagePreviewContainer').style.display = 'none';
    document.getElementById('imageUploadArea').style.display = 'block';
}

// Like a post
function likePost(postId) {
    const posts = getForumPosts();
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex !== -1) {
        posts[postIndex].likes += 1;
        saveForumPosts(posts);

        // Update UI
        const likeBtn = document.querySelector(`[data-post-id="${postId}"] .like-count`);
        if (likeBtn) {
            likeBtn.textContent = posts[postIndex].likes;

            // Add animation
            const btn = document.querySelector(`[data-post-id="${postId}"] .like-btn`);
            btn.classList.add('liked');
            setTimeout(() => btn.classList.remove('liked'), 300);
        }
    }
}

// Delete a post via API
async function deletePost(postId) {
    if (!isAdminLoggedIn()) return;

    if (confirm('Are you sure you want to delete this post?')) {
        try {
            const response = await fetch(`api/forum_posts.php?id=${postId}`, { method: 'DELETE' });
            const result = await response.json();

            if (result.success) {
                renderForumPosts();
                showNotification('Post deleted successfully.', 'success');
            } else {
                showNotification('Failed to delete post.', 'error');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            showNotification('Network error.', 'error');
        }
    }
}

// Get post type icon and color
function getPostTypeInfo(type) {
    switch (type) {
        case 'announcement':
            return { icon: '📢', label: 'Announcement', color: '#004B87' };
        case 'article':
            return { icon: '📰', label: 'Article', color: '#00A859' };
        case 'message':
            return { icon: '💬', label: 'Discussion', color: '#6f42c1' };
        case 'presentation':
            return { icon: '📊', label: 'Presentation', color: '#00A859' };
        case 'resource':
            return { icon: '📥', label: 'Resource', color: '#dc3545' };
        default:
            return { icon: '📝', label: 'Post', color: '#00A859' };
    }
}

// Render forum posts
async function asyncRenderForumPosts() {
    const container = document.getElementById('forumPosts');
    const emptyForum = document.getElementById('emptyForum');
    const posts = await getForumPosts();

    if (posts.length === 0) {
        emptyForum.style.display = 'block';
        return;
    }

    emptyForum.style.display = 'none';

    let html = '<div class="posts-grid" style="display: grid; gap: 2rem;">';

    // Use Promise.all to handle async map
    const postsHtml = await Promise.all(posts.map(async post => {
        const typeInfo = getPostTypeInfo(post.type);
        const isAdmin = isAdminLoggedIn();
        const comments = await getPostComments(post.id);
        const shareUrl = encodeURIComponent(window.location.href + '#post-' + post.id);
        const shareText = encodeURIComponent(post.title + ' - APC GAT2027 Enugu Forum');

        return `
            <div class="forum-post-card" data-post-id="${post.id}" id="post-${post.id}" style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); transition: transform 0.3s ease; margin-bottom: 1.5rem;">
                <!-- Post Header - Always Visible -->
                <div class="post-header-clickable" onclick="togglePostExpand(${post.id})" style="cursor: pointer; background: linear-gradient(135deg, ${typeInfo.color}, ${typeInfo.color}dd); padding: 1.5rem; transition: all 0.3s ease;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                        <span style="background: white; color: ${typeInfo.color}; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; font-size: 0.85rem;">
                            ${typeInfo.icon} ${typeInfo.label}
                        </span>
                        <span style="color: white; font-size: 0.9rem;">
                            <i class="far fa-calendar"></i> ${post.date}
                        </span>
                    </div>
                    <h3 style="color: white; margin: 0; font-size: 1.3rem; line-height: 1.4;">${post.title}</h3>
                    <div style="margin-top: 1rem; display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 35px; height: 35px; border-radius: 50%; background: rgba(255,255,255,0.9); display: flex; align-items: center; justify-content: center; color: ${typeInfo.color}; font-weight: bold; font-size: 0.9rem;">
                                ${post.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                                <strong style="color: white; font-size: 0.9rem; display: block;">${post.author}</strong>
                                <span style="color: rgba(255,255,255,0.9); font-size: 0.8rem;">${post.author_role}</span>
                            </div>
                        </div>
                        <div id="expand-icon-${post.id}" style="color: white; font-size: 1.2rem; transition: transform 0.3s ease;">
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>
                </div>
                
                <!-- Post Content - Collapsible -->
                <div id="post-content-${post.id}" style="display: none; transition: all 0.3s ease;">
                    <div style="padding: 2rem;">
                        ${post.image ? `
                            <div style="margin-bottom: 1.5rem;">
                                <img src="${post.image}" alt="Post image" 
                                    style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 15px; cursor: pointer; box-shadow: 0 5px 20px rgba(0,0,0,0.1);"
                                    onclick="openImageModal('${post.image.replace(/'/g, "\\'")}')">
                            </div>
                        ` : ''}
                        <p style="color: #555; line-height: 1.8; white-space: pre-wrap; font-size: 1.05rem;">${post.content}</p>
                    </div>
                    
                    <!-- Share Buttons -->
                    <div style="padding: 1rem 2rem; border-top: 1px solid #eee; background: #fafafa;">
                        <p style="margin: 0 0 0.75rem; font-weight: 600; color: #333; font-size: 0.9rem;"><i class="fas fa-share-alt"></i> Share this post:</p>
                        <div class="share-buttons" style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                            <a href="https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}" target="_blank" 
                                class="share-btn" style="background: #1DA1F2; color: white; padding: 0.5rem 1rem; border-radius: 20px; text-decoration: none; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fab fa-twitter"></i> Twitter
                            </a>
                            <a href="https://wa.me/?text=${shareText}%20${shareUrl}" target="_blank" 
                                class="share-btn" style="background: #25D366; color: white; padding: 0.5rem 1rem; border-radius: 20px; text-decoration: none; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fab fa-whatsapp"></i> WhatsApp
                            </a>
                            <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" 
                                class="share-btn" style="background: #1877F2; color: white; padding: 0.5rem 1rem; border-radius: 20px; text-decoration: none; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fab fa-facebook-f"></i> Facebook
                            </a>
                            <button onclick="copyPostLink(${post.id})" 
                                class="share-btn" style="background: #6c757d; color: white; padding: 0.5rem 1rem; border-radius: 20px; border: none; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-link"></i> Copy Link
                            </button>
                        </div>
                    </div>
                    
                    <!-- Post Footer with Like -->
                    <div style="background: #f8f9fa; padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                        <div style="display: flex; gap: 1rem; align-items: center;">
                            <button class="like-btn" onclick="likePostPersistent(${post.id}, event)" 
                                style="background: none; border: 2px solid #00A859; color: #00A859; padding: 0.5rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease;">
                                <i class="fas fa-heart"></i>
                                <span class="like-count" id="like-count-${post.id}">${post.likes}</span> Likes
                            </button>
                            <button onclick="toggleComments(${post.id})" 
                                style="background: none; border: 2px solid #004B87; color: #004B87; padding: 0.5rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease;">
                                <i class="fas fa-comments"></i>
                                <span>${comments.length}</span> Comments
                            </button>
                        </div>
                        ${isAdmin ? `
                            <button onclick="deletePost(${post.id})" 
                                style="background: none; border: none; color: #dc3545; cursor: pointer; font-size: 0.9rem;">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        ` : ''}
                    </div>
                
                <!-- Comments Section -->
                <div id="comments-${post.id}" class="comments-section" style="display: none; padding: 1.5rem 2rem; background: #f0f2f5; border-top: 1px solid #ddd;">
                    <h4 style="color: #1a5f3c; margin: 0 0 1rem; font-size: 1.1rem;"><i class="fas fa-comments"></i> Comments (${comments.length})</h4>
                    
                    <!-- Comment Form -->
                    <div style="margin-bottom: 1.5rem; background: white; padding: 1rem; border-radius: 10px;">
                        <input type="text" id="commenterName-${post.id}" placeholder="Your Name" 
                            style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 0.75rem; font-size: 0.95rem;">
                        <textarea id="commentText-${post.id}" placeholder="Write a comment..." rows="3" 
                            style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 0.75rem; font-size: 0.95rem; resize: vertical;"></textarea>
                        <button onclick="addComment(${post.id})" 
                            style="background: linear-gradient(135deg, #00A859, #1a5f3c); color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                            <i class="fas fa-paper-plane"></i> Post Comment
                        </button>
                    </div>
                    
                    <!-- Comments List -->
                    <div id="commentsList-${post.id}" class="comments-list">
                        ${renderComments(comments, post.id)}
                    </div>
                </div>
            </div>
        `;
    }));

    html += postsHtml.join('');
    html += '</div>';

    // Keep the empty forum div but hide it
    container.innerHTML = `<div class="empty-forum" id="emptyForum" style="display: none;">
        <div style="text-align: center; padding: 4rem 2rem; background: linear-gradient(135deg, #f8f9fa, #e9ecef); border-radius: 20px;">
            <i class="fas fa-comments" style="font-size: 4rem; color: #00A859; margin-bottom: 1.5rem;"></i>
            <h3 style="color: #1a5f3c; margin-bottom: 1rem;">Welcome to the Grassroots Forum</h3>
            <p style="color: #666; max-width: 500px; margin: 0 auto;">
                Stay tuned for announcements, articles, and messages from our Publicity Secretary. 
                Engage with fellow members and be part of the conversation!
            </p>
        </div>
    </div>` + html;
}

// Get comments from API
async function getPostComments(postId) {
    try {
        const response = await fetch(`api/forum_comments.php?post_id=${postId}`);
        const result = await response.json();
        return result.success ? result.comments : [];
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
}

// Toggle comments section visibility
function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    if (commentsSection) {
        commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
    }
}

// Add a new comment
async function addComment(postId) {
    const nameInput = document.getElementById(`commenterName-${postId}`);
    const textInput = document.getElementById(`commentText-${postId}`);

    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!name || !text) {
        showNotification('Please enter your name and comment.', 'error');
        return;
    }

    try {
        const response = await fetch('api/forum_comments.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post_id: postId, name, comment: text })
        });
        const result = await response.json();

        if (result.success) {
            // Refresh comments
            const comments = await getPostComments(postId);

            // Update UI
            const commentsList = document.getElementById(`commentsList-${postId}`);
            commentsList.innerHTML = renderComments(comments, postId);

            // Update comment count
            const postCard = document.querySelector(`[data-post-id="${postId}"]`);
            if (postCard) {
                const commentBtn = postCard.querySelector('button[onclick^="toggleComments"]');
                if (commentBtn) {
                    commentBtn.innerHTML = `<i class="fas fa-comments"></i> <span>${comments.length}</span> Comments`;
                }
                const commentHeader = document.querySelector(`#comments-${postId} h4`);
                if (commentHeader) {
                    commentHeader.innerHTML = `<i class="fas fa-comments"></i> Comments (${comments.length})`;
                }
            }

            // Clear inputs
            nameInput.value = '';
            textInput.value = '';

            showNotification('Comment posted successfully!', 'success');
        } else {
            showNotification('Failed to post comment.', 'error');
        }
    } catch (error) {
        console.error('Error posting comment:', error);
        showNotification('Network error.', 'error');
    }
}

// Render comments HTML
function renderComments(comments, postId) {
    if (comments.length === 0) {
        return '<p style="color: #666; text-align: center; padding: 1rem;">No comments yet. Be the first to comment!</p>';
    }

    return comments.map(comment => `
        <div class="comment-item" style="background: white; padding: 1rem; border-radius: 10px; margin-bottom: 0.75rem; border-left: 3px solid #00A859;">
            <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                <div style="width: 35px; height: 35px; border-radius: 50%; background: linear-gradient(135deg, #00A859, #1a5f3c); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.9rem;">
                    ${comment.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div style="margin-left: 0.75rem;">
                    <strong style="color: #1a5f3c; font-size: 0.95rem;">${comment.name}</strong>
                    <p style="margin: 0; color: #888; font-size: 0.8rem;">${comment.date}</p>
                </div>
            </div>
            <p style="margin: 0; color: #555; line-height: 1.6; padding-left: 2.75rem;">${comment.text}</p>
        </div>
    `).join('');
}

// Copy post link to clipboard
function copyPostLink(postId) {
    const url = window.location.href.split('#')[0] + '#post-' + postId;
    navigator.clipboard.writeText(url).then(() => {
        showNotification('Link copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Link copied to clipboard!', 'success');
    });
}

// Toggle post expand/collapse
function togglePostExpand(postId) {
    const contentDiv = document.getElementById(`post-content-${postId}`);
    const expandIcon = document.getElementById(`expand-icon-${postId}`);

    if (contentDiv.style.display === 'none') {
        // Expand
        contentDiv.style.display = 'block';
        expandIcon.innerHTML = '<i class="fas fa-chevron-up"></i>';
        expandIcon.style.transform = 'rotate(180deg)';
    } else {
        // Collapse
        contentDiv.style.display = 'none';
        expandIcon.innerHTML = '<i class="fas fa-chevron-down"></i>';
        expandIcon.style.transform = 'rotate(0deg)';
    }
}

// Like a post with persistent database save
async function likePostPersistent(postId, event) {
    if (event) event.stopPropagation();

    try {
        const response = await fetch('api/like_post.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post_id: postId })
        });
        const result = await response.json();

        if (result.success) {
            // Update UI with new like count
            const likeCountElement = document.getElementById(`like-count-${postId}`);
            if (likeCountElement) {
                likeCountElement.textContent = result.likes;

                // Add animation
                const btn = likeCountElement.closest('.like-btn');
                btn.style.transform = 'scale(1.1)';
                btn.style.borderColor = '#ff0066';
                btn.style.color = '#ff0066';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                    setTimeout(() => {
                        btn.style.borderColor = '#00A859';
                        btn.style.color = '#00A859';
                    }, 200);
                }, 300);
            }
        }
    } catch (error) {
        console.error('Error liking post:', error);
        showNotification('Could not like post. Please try again.', 'error');
    }
}

// Open image in full-screen modal
function openImageModal(imageSrc) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'imageViewerModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.95);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: zoom-out;
        animation: fadeIn 0.3s ease;
    `;
    modal.onclick = () => modal.remove();

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        background: none;
        border: none;
        color: white;
        font-size: 3rem;
        cursor: pointer;
        z-index: 100000;
    `;
    closeBtn.onclick = () => modal.remove();

    // Create image
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 10px;
        box-shadow: 0 10px 50px rgba(0,0,0,0.5);
    `;
    img.onclick = (e) => e.stopPropagation(); // Prevent closing when clicking image

    modal.appendChild(closeBtn);
    modal.appendChild(img);
    document.body.appendChild(modal);
}

// Add forum styles
function addForumStyles() {
    if (!document.querySelector('#forum-styles')) {
        const style = document.createElement('style');
        style.id = 'forum-styles';
        style.textContent = `
            .forum-post-card:hover {
                transform: translateY(-5px);
            }
            .like-btn:hover {
                background: #00A859 !important;
                color: white !important;
            }
            .like-btn.liked {
                animation: likeAnimation 0.3s ease;
            }
            @keyframes likeAnimation {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            .btn-outline {
                background: transparent;
                border: 2px solid #00A859;
                color: #00A859;
                padding: 0.75rem 1.5rem;
                border-radius: 25px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            .btn-outline:hover {
                background: #00A859;
                color: white;
            }
            .btn-large {
                padding: 1rem 2.5rem;
                font-size: 1.1rem;
            }
        `;
        document.head.appendChild(style);
    }
}

// Handle post form submission
document.addEventListener('DOMContentLoaded', function () {
    // Initialize forum
    addForumStyles();
    updateAdminUI();
    asyncRenderForumPosts();
    checkBackendAdminSession(); // Check if admin is logged in via backend


    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!isAdminLoggedIn() && !backendAdminData) {
                showNotification('You must be logged in as admin to create posts.', 'error');
                return;
            }

            const type = document.getElementById('postType').value;
            const title = document.getElementById('postTitle').value.trim();
            const content = document.getElementById('postContent').value.trim();

            if (!title || !content) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }

            // Pass image data to createPost
            await createPost(type, title, content, currentPostImageData);

            // Reset image preview
            currentPostImageData = null;
            document.getElementById('postImage').value = '';
            document.getElementById('imagePreview').src = '';
            document.getElementById('imagePreviewContainer').style.display = 'none';
            document.getElementById('imageUploadArea').style.display = 'block';

            closePostModal();
            asyncRenderForumPosts();
            showNotification('Post published successfully!', 'success');
        });
    }

    // Contact form handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('api/submit-contact.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    showNotification('Message sent successfully!', 'success');
                    this.reset();
                } else {
                    showNotification(result.message || 'Failed to send message.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Network error. Please try again.', 'error');
            }

            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }

    // Initialize dynamic news
    loadDynamicNews();
});

/* ========================================
   Dynamic News System
   ======================================== */

// News data - Updated daily with Nigerian political news, jobs, and recruitment
const politicalNewsData = [
    {
        category: 'breaking',
        headline: 'Governor Peter Mbah Leads Historic Defection to APC',
        summary: 'Governor Peter Mbah of Enugu State officially joined the All Progressives Congress with all 24 State House of Assembly members.',
        source: 'APC National',
        time: 'Today'
    },
    {
        category: 'jobs',
        headline: 'NNPC Recruitment 2025: Application Portal Now Open',
        summary: 'The Nigerian National Petroleum Company has opened applications for graduate trainees and experienced professionals across all departments.',
        source: 'NNPC Careers',
        time: 'Today'
    },
    {
        category: 'breaking',
        headline: 'All Eight Enugu Reps Now in APC After Mass Defection',
        summary: 'Five House of Representatives members from Enugu State joined the APC, bringing total Enugu lawmakers in the party to eight.',
        source: 'Premium Times',
        time: '2 hours ago'
    },
    {
        category: 'recruitment',
        headline: 'Federal Civil Service Commission Opens Mass Recruitment',
        summary: 'FCSC announces recruitment of 10,000 graduates across ministries. Application deadline is January 31, 2026.',
        source: 'FCSC Portal',
        time: '3 hours ago'
    },
    {
        category: 'politics',
        headline: 'Senator Kelvin Chukwu Joins APC From Labour Party',
        summary: 'Senator Kelvin Chukwu representing Enugu East Senatorial District officially defected to the APC.',
        source: 'Channels TV',
        time: '4 hours ago'
    },
    {
        category: 'jobs',
        headline: 'CBN Graduate Trainee Program 2026 - Apply Now',
        summary: 'Central Bank of Nigeria seeks fresh graduates for its intensive 18-month management trainee program.',
        source: 'CBN Careers',
        time: '5 hours ago'
    },
    {
        category: 'national',
        headline: 'APC Dominance Grows: Multiple Governors Join Ruling Party',
        summary: 'Following Enugu, governors from Rivers, Taraba, Bayelsa, Delta, and Akwa Ibom states have joined APC.',
        source: 'Vanguard News',
        time: '6 hours ago'
    },
    {
        category: 'subscription',
        headline: 'JAMB 2026: Registration Portal Opens Next Week',
        summary: 'Joint Admissions and Matriculation Board announces e-registration for 2026 UTME begins December 20th.',
        source: 'JAMB Official',
        time: '6 hours ago'
    },
    {
        category: 'events',
        headline: 'GAT 2027 Enugu Chapter Launches Grassroot Campaign',
        summary: 'The Grassroot Advocacy for Tinubu 2027 Enugu State Chapter launched its campaign across all 17 LGAs.',
        source: 'APC GAT2027',
        time: 'Yesterday'
    },
    {
        category: 'recruitment',
        headline: 'Nigerian Army Recruitment 2026: 85RRI Exercise Announced',
        summary: 'Nigerian Army opens portal for 85 Regular Recruit Intake for trades and non-tradesmen/women.',
        source: 'Nigerian Army',
        time: 'Yesterday'
    },
    {
        category: 'events',
        headline: 'Massive Membership Registration Launched Across All LGAs',
        summary: 'APC GAT 2027 Enugu State kicks off statewide membership registration campaign.',
        source: 'APC GAT2027',
        time: 'Yesterday'
    },
    {
        category: 'jobs',
        headline: 'NDLEA Recruitment: 5,000 Positions Available Nationwide',
        summary: 'National Drug Law Enforcement Agency recruiting officers, apply via official portal before deadline.',
        source: 'NDLEA Nigeria',
        time: '1 day ago'
    },
    {
        category: 'national',
        headline: 'President Tinubu Announces New Economic Policies for 2026',
        summary: 'The President outlined key economic reforms expected to boost Nigeria\'s GDP growth.',
        source: 'NTA News',
        time: '1 day ago'
    },
    {
        category: 'subscription',
        headline: 'NIN Registration: New Centers Open in Enugu State',
        summary: 'NIMC opens 15 new enrollment centers across Enugu State for NIN registration.',
        source: 'NIMC',
        time: '1 day ago'
    },
    {
        category: 'politics',
        headline: 'APC National Convention Sets Date for 2026',
        summary: 'The ruling party announces plans for its national convention to prepare for 2027 elections.',
        source: 'ThisDay Live',
        time: '1 day ago'
    }
];

// Nigerian news from live sources - Politics, Jobs, Recruitment
const liveNewsHeadlines = [
    { headline: 'Immigration Service Opens Recruitment Portal for 2026', source: 'NIS Portal', time: '15 mins ago', category: 'recruitment' },
    { headline: 'FG Announces New Infrastructure Projects for South-East Region', source: 'Punch News', time: '30 mins ago', category: 'national' },
    { headline: 'NYSC Batch A 2026: Online Registration Begins', source: 'NYSC Official', time: '45 mins ago', category: 'subscription' },
    { headline: 'Minister of Works Inspects Enugu-Onitsha Expressway', source: 'Vanguard', time: '1 hour ago', category: 'development' },
    { headline: 'Police Force Recruitment: 30,000 Constables Needed', source: 'NPF Recruitment', time: '1.5 hours ago', category: 'jobs' },
    { headline: 'CBN Releases New Guidelines on Foreign Exchange', source: 'BusinessDay', time: '2 hours ago', category: 'economy' },
    { headline: 'FRSC Recruitment 2026: Marshal Inspectors Wanted', source: 'FRSC Nigeria', time: '2.5 hours ago', category: 'recruitment' },
    { headline: 'INEC Begins Preparation for 2027 General Elections', source: 'Channels TV', time: '3 hours ago', category: 'politics' },
    { headline: 'Scholarship Alert: PTDF Overseas Postgraduate Program', source: 'PTDF', time: '3.5 hours ago', category: 'subscription' },
    { headline: 'Senate Passes New Bill for Electoral Reform', source: 'Premium Times', time: '4 hours ago', category: 'politics' },
    { headline: 'DSS Recruitment Exercise: Apply for Field Agent Roles', source: 'DSS Nigeria', time: '4.5 hours ago', category: 'jobs' },
    { headline: 'APC Welcomes New Members in South-East Expansion', source: 'The Nation', time: '5 hours ago', category: 'politics' },
    { headline: 'WAEC Registration 2026: Deadline Approaches', source: 'WAEC Nigeria', time: '5.5 hours ago', category: 'subscription' },
    { headline: 'Nigeria Signs New Trade Agreement with EU Partners', source: 'The Guardian', time: '6 hours ago', category: 'economy' },
    { headline: 'Education Ministry Announces Scholarship Programs', source: 'Daily Trust', time: '7 hours ago', category: 'education' }
];

// Get category styling
function getCategoryStyle(category) {
    const styles = {
        'breaking': { bg: '#dc3545', label: '🔴 BREAKING' },
        'politics': { bg: '#004B87', label: '🏛️ Politics' },
        'national': { bg: '#6f42c1', label: '🇳🇬 National' },
        'events': { bg: '#00A859', label: '📅 Events' },
        'economy': { bg: '#fd7e14', label: '💰 Economy' },
        'development': { bg: '#20c997', label: '🏗️ Development' },
        'education': { bg: '#17a2b8', label: '📚 Education' },
        'jobs': { bg: '#e83e8c', label: '💼 Jobs' },
        'recruitment': { bg: '#28a745', label: '📋 Recruitment' },
        'subscription': { bg: '#6610f2', label: '✍️ Registration' }
    };
    return styles[category] || { bg: '#00A859', label: '📰 News' };
}

// Load dynamic news on page load
async function loadDynamicNews() {
    // Show loading state
    const container = document.getElementById('dynamicNewsContainer');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #00A859;"></i>
                <p style="color: #666; margin-top: 1rem;">Loading latest news...</p>
            </div>
        `;
    }

    // Try to fetch live news from RSS feeds
    try {
        await fetchLiveRSSNews();
    } catch (error) {
        console.log('Using cached news data:', error);
    }

    // Render the news
    renderMainNews();
    renderLiveNews();
    renderNewsTicker();
}

// RSS Feed sources for Nigerian news
const RSS_FEEDS = [
    { url: 'https://punchng.com/feed/', source: 'Punch News', category: 'politics' },
    { url: 'https://www.vanguardngr.com/feed/', source: 'Vanguard', category: 'national' },
    { url: 'https://www.premiumtimesng.com/feed', source: 'Premium Times', category: 'breaking' },
    { url: 'https://dailypost.ng/feed/', source: 'Daily Post', category: 'politics' },
    { url: 'https://www.thecable.ng/feed', source: 'The Cable', category: 'economy' }
];

// Fetch live news from RSS feeds
async function fetchLiveRSSNews() {
    const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';
    const fetchedNews = [];
    const fetchedLiveNews = [];

    // Fetch from multiple sources
    const fetchPromises = RSS_FEEDS.slice(0, 3).map(async (feed) => {
        try {
            const response = await fetch(RSS2JSON_API + encodeURIComponent(feed.url), {
                mode: 'cors'
            });
            const data = await response.json();

            if (data.status === 'ok' && data.items) {
                data.items.slice(0, 5).forEach((item, index) => {
                    const newsItem = {
                        category: categorizeNews(item.title),
                        headline: cleanTitle(item.title),
                        summary: cleanSummary(item.description),
                        source: feed.source,
                        time: getRelativeTime(item.pubDate),
                        link: item.link
                    };

                    if (index < 2) {
                        fetchedNews.push(newsItem);
                    } else {
                        fetchedLiveNews.push({
                            headline: newsItem.headline,
                            source: newsItem.source,
                            time: newsItem.time,
                            category: newsItem.category,
                            link: newsItem.link
                        });
                    }
                });
            }
        } catch (err) {
            console.log(`Failed to fetch from ${feed.source}:`, err);
        }
    });

    await Promise.allSettled(fetchPromises);

    // Update news arrays if we got new data
    if (fetchedNews.length > 0) {
        // Merge fetched news with existing data
        politicalNewsData.unshift(...fetchedNews.slice(0, 4));
        // Keep array manageable
        if (politicalNewsData.length > 20) {
            politicalNewsData.splice(20);
        }
    }

    if (fetchedLiveNews.length > 0) {
        liveNewsHeadlines.unshift(...fetchedLiveNews.slice(0, 5));
        if (liveNewsHeadlines.length > 15) {
            liveNewsHeadlines.splice(15);
        }
    }
}

// Categorize news based on keywords
function categorizeNews(title) {
    const lower = title.toLowerCase();
    if (lower.includes('breaking') || lower.includes('just in')) return 'breaking';
    if (lower.includes('recruit') || lower.includes('hiring') || lower.includes('vacancy')) return 'recruitment';
    if (lower.includes('job') || lower.includes('career') || lower.includes('employment')) return 'jobs';
    if (lower.includes('registration') || lower.includes('apply') || lower.includes('portal')) return 'subscription';
    if (lower.includes('apc') || lower.includes('pdp') || lower.includes('election') || lower.includes('governor') || lower.includes('senate') || lower.includes('tinubu')) return 'politics';
    if (lower.includes('economy') || lower.includes('naira') || lower.includes('cbn') || lower.includes('inflation')) return 'economy';
    if (lower.includes('education') || lower.includes('university') || lower.includes('school')) return 'education';
    return 'national';
}

// Clean HTML from title
function cleanTitle(title) {
    return title.replace(/<[^>]*>/g, '').trim().substring(0, 120);
}

// Clean and truncate summary
function cleanSummary(html) {
    const text = html.replace(/<[^>]*>/g, '').trim();
    return text.substring(0, 200) + (text.length > 200 ? '...' : '');
}

// Get relative time from date
function getRelativeTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
}

// Render main news section - Enhanced with highlighted captions (no images)
function renderMainNews() {
    const container = document.getElementById('dynamicNewsContainer');
    if (!container) return;

    let html = '<div class="news-headlines-container">';

    politicalNewsData.forEach((news, index) => {
        const style = getCategoryStyle(news.category);
        const isFeatured = index === 0;

        html += `
            <div class="news-headline-card ${isFeatured ? 'featured-news' : ''}" onclick="openNewsModal(${index}, 'main')">
                <div class="news-category-badge" style="background: ${style.bg};">
                    ${style.label}
                </div>
                <h4 class="news-headline-text ${isFeatured ? 'featured-headline' : ''}">${news.headline}</h4>
                <p class="news-summary-text">${news.summary}</p>
                <div class="news-meta-info">
                    <span class="news-time"><i class="far fa-clock"></i> ${news.time}</span>
                    <span class="news-source"><i class="far fa-newspaper"></i> ${news.source}</span>
                    ${news.link ? '<span class="news-link-indicator"><i class="fas fa-external-link-alt"></i></span>' : ''}
                </div>
                <div class="news-read-more">
                    <span>Read more <i class="fas fa-chevron-right"></i></span>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

// Render live news headlines - Enhanced with highlighted captions (no images)
function renderLiveNews() {
    const container = document.getElementById('liveNewsContainer');
    if (!container) return;

    let html = '';

    liveNewsHeadlines.forEach((news, index) => {
        const style = getCategoryStyle(news.category);

        html += `
            <div class="live-news-card" onclick="openNewsModal(${index}, 'live')">
                <div class="live-news-badge" style="background: ${style.bg};">${style.label}</div>
                <div class="live-news-content">
                    <h5 class="live-news-headline">${news.headline}</h5>
                    <div class="live-news-meta">
                        <span class="live-news-source">${news.source}</span>
                        <span class="live-news-time">${news.time}</span>
                        ${news.link ? '<span class="live-news-link"><i class="fas fa-external-link-alt"></i></span>' : ''}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Render news ticker
function renderNewsTicker() {
    const ticker = document.getElementById('tickerContent');
    if (!ticker) return;

    let html = '';
    politicalNewsData.slice(0, 5).forEach((news, index) => {
        html += `<span ${index > 0 ? 'style="margin-left: 3rem;"' : ''}>📢 ${news.headline}</span>`;
    });

    ticker.innerHTML = html;
}

// Load more / refresh news from live RSS feeds
async function loadMoreNews() {
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching live news...';
    btn.disabled = true;

    try {
        // Fetch fresh news from RSS feeds
        await fetchLiveRSSNews();
        renderMainNews();
        renderLiveNews();
        renderNewsTicker();
        showNotification('News updated with latest headlines!', 'success');
    } catch (error) {
        console.log('Refresh error:', error);
        // Shuffle existing news as fallback
        liveNewsHeadlines.sort(() => Math.random() - 0.5);
        renderLiveNews();
        showNotification('Showing cached news', 'success');
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
}

// Add pulse animation for live feed badge
if (!document.querySelector('#news-pulse-styles')) {
    const style = document.createElement('style');
    style.id = 'news-pulse-styles';
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        .news-headline-card:hover h4 {
            color: #00A859 !important;
        }
    `;
    document.head.appendChild(style);
}

// Open news modal with full details
function openNewsModal(index, type) {
    const news = type === 'main' ? politicalNewsData[index] : liveNewsHeadlines[index];
    if (!news) return;

    const style = getCategoryStyle(news.category);

    // Create modal HTML
    const modalHTML = `
        <div id="newsDetailModal" onclick="closeNewsModal(event)" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            animation: fadeIn 0.3s ease;
        ">
            <div onclick="event.stopPropagation()" style="
                background: white;
                max-width: 700px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                border-radius: 20px;
                position: relative;
                animation: slideUp 0.3s ease;
            ">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, ${style.bg}, ${style.bg}dd); padding: 2rem; border-radius: 20px 20px 0 0;">
                    <button onclick="closeNewsModal(event)" style="
                        position: absolute;
                        top: 1rem;
                        right: 1rem;
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 1.5rem;
                    ">&times;</button>
                    <span style="background: white; color: ${style.bg}; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; font-size: 0.85rem;">
                        ${style.label}
                    </span>
                    <h2 style="color: white; margin: 1.5rem 0 0.5rem; font-size: 1.5rem; line-height: 1.4;">
                        ${news.headline}
                    </h2>
                    <div style="color: rgba(255,255,255,0.9); font-size: 0.9rem;">
                        <span><i class="far fa-newspaper"></i> ${news.source}</span>
                        <span style="margin-left: 1.5rem;"><i class="far fa-clock"></i> ${news.time}</span>
                    </div>
                </div>
                
                <!-- Content -->
                <div style="padding: 2rem;">
                    <p style="color: #333; font-size: 1.1rem; line-height: 1.8; margin: 0 0 1.5rem;">
                        ${news.summary || 'Click the button below to read the full story on the source website.'}
                    </p>
                    
                    ${news.link ? `
                        <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 1.5rem; border-radius: 15px; text-align: center;">
                            <p style="color: #666; margin: 0 0 1rem;"><i class="fas fa-external-link-alt"></i> This news has an external source link</p>
                            <a href="${news.link}" target="_blank" rel="noopener noreferrer" style="
                                display: inline-block;
                                background: linear-gradient(135deg, #00A859, #1a5f3c);
                                color: white;
                                padding: 1rem 2rem;
                                border-radius: 30px;
                                text-decoration: none;
                                font-weight: 600;
                                font-size: 1rem;
                            ">
                                <i class="fas fa-arrow-right"></i> Read Full Story on ${news.source}
                            </a>
                        </div>
                    ` : `
                        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 15px; text-align: center;">
                            <p style="color: #666; margin: 0;"><i class="fas fa-info-circle"></i> No external link available for this news item</p>
                        </div>
                    `}
                    
                    <!-- Share Buttons -->
                    <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #eee;">
                        <p style="color: #888; margin: 0 0 1rem; font-size: 0.9rem;"><i class="fas fa-share-alt"></i> Share this news:</p>
                        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(news.headline)}${news.link ? '&url=' + encodeURIComponent(news.link) : ''}" target="_blank" 
                                style="background: #1DA1F2; color: white; padding: 0.5rem 1rem; border-radius: 20px; text-decoration: none; font-size: 0.85rem;">
                                <i class="fab fa-twitter"></i> Twitter
                            </a>
                            <a href="https://wa.me/?text=${encodeURIComponent(news.headline + (news.link ? ' ' + news.link : ''))}" target="_blank" 
                                style="background: #25D366; color: white; padding: 0.5rem 1rem; border-radius: 20px; text-decoration: none; font-size: 0.85rem;">
                                <i class="fab fa-whatsapp"></i> WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

// Close news modal
function closeNewsModal(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('newsDetailModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Add modal animation styles
if (!document.querySelector('#news-modal-styles')) {
    const modalStyle = document.createElement('style');
    modalStyle.id = 'news-modal-styles';
    modalStyle.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(modalStyle);
}
