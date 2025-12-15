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
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter);
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
        membershipForm.addEventListener('submit', function (e) {
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

            // Simulate form submission (replace with actual API call when deployed)
            setTimeout(() => {
                // Show success message
                const modalBody = document.querySelector('#membershipModal .modal-content');
                modalBody.innerHTML = `
                    <div style="padding: 4rem 2rem; text-align: center;">
                        <div style="font-size: 5rem; margin-bottom: 1.5rem;">✅</div>
                        <h2 style="color: #00A859; margin-bottom: 1rem;">Registration Successful!</h2>
                        <p style="color: #666; font-size: 1.1rem; max-width: 400px; margin: 0 auto 2rem; line-height: 1.6;">
                            Thank you for registering with APC GAT 2027 Enugu State Chapter. 
                            Your membership application has been received.
                        </p>
                        <p style="background: #f0f8f0; padding: 1rem; border-radius: 10px; margin-bottom: 2rem;">
                            <strong>Membership No:</strong> GAT2027/ENU/${Date.now().toString().slice(-6)}<br>
                            <small>Please save this number for future reference</small>
                        </p>
                        <button onclick="closeMembershipModal(); location.reload();" 
                            style="padding: 1rem 2rem; background: #00A859; color: white; border: none; border-radius: 10px; font-size: 1rem; cursor: pointer;">
                            <i class="fas fa-check"></i> Done
                        </button>
                    </div>
                `;

                // Log data (in production, send to server)
                console.log('Membership Registration:', data);

            }, 2000);
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
   Grassroots Forum Functions
   ======================================== */

// Forum Admin Password (In production, this should be server-side)
const ADMIN_PASSWORD = 'Nelson2306';

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

// Update UI based on admin status
function updateAdminUI() {
    const adminBar = document.getElementById('forumAdminBar');
    const loginSection = document.querySelector('.admin-login-section');

    if (isAdminLoggedIn()) {
        adminBar.style.display = 'flex';
        adminBar.style.justifyContent = 'center';
        adminBar.style.marginBottom = '2rem';

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
        loginSection.style.display = 'block';
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

// Get posts from localStorage
function getForumPosts() {
    const posts = localStorage.getItem('forumPosts');
    return posts ? JSON.parse(posts) : [];
}

// Save posts to localStorage
function saveForumPosts(posts) {
    localStorage.setItem('forumPosts', JSON.stringify(posts));
}

// Create a new post
function createPost(type, title, content, imageData = null) {
    const posts = getForumPosts();
    const newPost = {
        id: Date.now(),
        type: type,
        title: title,
        content: content,
        image: imageData, // Store base64 image data
        author: 'Nelson Ndudi Idoko',
        authorRole: 'Publicity Secretary, Enugu State',
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        likes: 0
    };

    posts.unshift(newPost); // Add to beginning
    saveForumPosts(posts);
    return newPost;
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

// Delete a post (admin only)
function deletePost(postId) {
    if (!isAdminLoggedIn()) return;

    if (confirm('Are you sure you want to delete this post?')) {
        let posts = getForumPosts();
        posts = posts.filter(p => p.id !== postId);
        saveForumPosts(posts);
        renderForumPosts();
        showNotification('Post deleted successfully.', 'success');
    }
}

// Get post type icon and color
function getPostTypeInfo(type) {
    switch (type) {
        case 'announcement':
            return { icon: '📢', label: 'Announcement', color: '#dc3545' };
        case 'article':
            return { icon: '📰', label: 'Article', color: '#00A859' };
        case 'message':
            return { icon: '💬', label: 'Message', color: '#004B87' };
        default:
            return { icon: '📝', label: 'Post', color: '#00A859' };
    }
}

// Render forum posts
function renderForumPosts() {
    const container = document.getElementById('forumPosts');
    const emptyForum = document.getElementById('emptyForum');
    const posts = getForumPosts();

    if (posts.length === 0) {
        emptyForum.style.display = 'block';
        return;
    }

    emptyForum.style.display = 'none';

    let html = '<div class="posts-grid" style="display: grid; gap: 2rem;">';

    posts.forEach(post => {
        const typeInfo = getPostTypeInfo(post.type);
        const isAdmin = isAdminLoggedIn();
        const comments = getPostComments(post.id);
        const shareUrl = encodeURIComponent(window.location.href + '#post-' + post.id);
        const shareText = encodeURIComponent(post.title + ' - APC GAT2027 Enugu Forum');

        html += `
            <div class="forum-post-card" data-post-id="${post.id}" id="post-${post.id}" style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
                <!-- Post Header -->
                <div style="background: linear-gradient(135deg, ${typeInfo.color}, ${typeInfo.color}dd); padding: 1rem 1.5rem; display: flex; align-items: center; justify-content: space-between;">
                    <span style="background: white; color: ${typeInfo.color}; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; font-size: 0.85rem;">
                        ${typeInfo.icon} ${typeInfo.label}
                    </span>
                    <span style="color: white; font-size: 0.9rem;">
                        <i class="far fa-calendar"></i> ${post.date}
                    </span>
                </div>
                
                <!-- Post Content -->
                <div style="padding: 2rem;">
                    <h3 style="color: #1a5f3c; margin-bottom: 1rem; font-size: 1.5rem;">${post.title}</h3>
                    ${post.image ? `
                        <div style="margin-bottom: 1.5rem;">
                            <img src="${post.image}" alt="Post image" 
                                style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 15px; cursor: pointer; box-shadow: 0 5px 20px rgba(0,0,0,0.1);"
                                onclick="openImageModal('${post.image.replace(/'/g, "\\'")}')">
                        </div>
                    ` : ''}
                    <p style="color: #555; line-height: 1.8; white-space: pre-wrap;">${post.content}</p>
                    
                    <!-- Author Info -->
                    <div style="display: flex; align-items: center; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #eee;">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #00A859, #1a5f3c); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">
                            ${post.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div style="margin-left: 1rem;">
                            <strong style="color: #1a5f3c;">${post.author}</strong>
                            <p style="margin: 0; color: #666; font-size: 0.9rem;">${post.authorRole}</p>
                        </div>
                    </div>
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
                        <a href="mailto:?subject=${shareText}&body=Check out this post: ${decodeURIComponent(shareUrl)}" 
                            class="share-btn" style="background: #EA4335; color: white; padding: 0.5rem 1rem; border-radius: 20px; text-decoration: none; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-envelope"></i> Email
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
                        <button class="like-btn" onclick="likePost(${post.id})" 
                            style="background: none; border: 2px solid #00A859; color: #00A859; padding: 0.5rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease;">
                            <i class="fas fa-heart"></i>
                            <span class="like-count">${post.likes}</span> Likes
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
    });

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

// Get comments for a post
function getPostComments(postId) {
    const comments = localStorage.getItem(`forumComments_${postId}`);
    return comments ? JSON.parse(comments) : [];
}

// Save comments for a post
function savePostComments(postId, comments) {
    localStorage.setItem(`forumComments_${postId}`, JSON.stringify(comments));
}

// Toggle comments section visibility
function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    if (commentsSection) {
        commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
    }
}

// Add a new comment
function addComment(postId) {
    const nameInput = document.getElementById(`commenterName-${postId}`);
    const textInput = document.getElementById(`commentText-${postId}`);

    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!name || !text) {
        showNotification('Please enter your name and comment.', 'error');
        return;
    }

    const comments = getPostComments(postId);
    const newComment = {
        id: Date.now(),
        name: name,
        text: text,
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    comments.unshift(newComment);
    savePostComments(postId, comments);

    // Update UI
    const commentsList = document.getElementById(`commentsList-${postId}`);
    commentsList.innerHTML = renderComments(comments, postId);

    // Update comment count in button
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
    renderForumPosts();

    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!isAdminLoggedIn()) {
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
            createPost(type, title, content, currentPostImageData);

            // Reset image preview
            currentPostImageData = null;
            document.getElementById('postImage').value = '';
            document.getElementById('imagePreview').src = '';
            document.getElementById('imagePreviewContainer').style.display = 'none';
            document.getElementById('imageUploadArea').style.display = 'block';

            closePostModal();
            renderForumPosts();
            showNotification('Post published successfully!', 'success');
        });
    }
});
