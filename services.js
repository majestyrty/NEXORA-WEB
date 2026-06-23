// Open Apply Form Modal
function openApplyForm(jobTitle) {
    document.getElementById('jobTitle').textContent = jobTitle;
    document.getElementById('applyModal').style.display = 'block';
    document.getElementById('applicationForm').reset();
    document.getElementById('fileError').style.display = 'none';
}

// Close Apply Form Modal
function closeApplyForm() {
    document.getElementById('applyModal').style.display = 'none';
}

// Close Apply Form Modal
function closeApplyForm() {
    document.getElementById('applyModal').style.display = 'none';
}

// Open Status Check Modal
function openStatusCheck() {
    document.getElementById('statusModal').style.display = 'block';
    document.getElementById('statusResult').classList.remove('active');
    document.getElementById('statusForm').reset();
}

// Close Status Check Modal
function closeStatusCheck() {
    document.getElementById('statusModal').style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const applyModal = document.getElementById('applyModal');
    const statusModal = document.getElementById('statusModal');
    
    if (event.target == applyModal) {
        applyModal.style.display = 'none';
    }
    if (event.target == statusModal) {
        statusModal.style.display = 'none';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // CV File Size Validation
    const resumeInput = document.getElementById('resume');
    if (resumeInput) {
        resumeInput.addEventListener('change', function() {
            const file = this.files[0];
            const fileError = document.getElementById('fileError');
            const maxSize = 100 * 1024 * 1024; // 100MB in bytes
            
            if (file && file.size > maxSize) {
                fileError.textContent = `File size exceeds 100MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
                fileError.style.display = 'block';
                this.value = '';
            } else if (file) {
                fileError.style.display = 'none';
            }
        });
    }

    // Handle Application Form Submission
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const experience = document.getElementById('experience').value;
            const coverLetter = document.getElementById('coverLetter').value;
            const resume = document.getElementById('resume').value;
            
            // Validate all fields
            if (!fullName || !email || !phone || !experience || !coverLetter || !resume) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Phone validation
            if (phone.length < 10) {
                alert('Please enter a valid phone number');
                return;
            }
            
            // Show success message
            const jobTitle = document.getElementById('jobTitle').textContent;
            alert(`Thank you for your application for ${jobTitle}! We will review your application and get back to you soon.`);
            
            // Close modal
            closeApplyForm();
        });
    }

    // Handle Status Check Form
    const statusForm = document.getElementById('statusForm');
    if (statusForm) {
        statusForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('statusEmail').value;
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Show status
            const statusResult = document.getElementById('statusResult');
            statusResult.innerHTML = `
                <strong>Application Status for: ${email}</strong><br><br>
                <p>Your application is currently <strong style="color: #00d4ff;">UNDER REVIEW</strong></p>
                <p>We received your application on <strong>June 23, 2026</strong></p>
                <p>You will be notified via email when there are updates on your application.</p>
                <p><em>Thank you for your interest in Nexora Tech!</em></p>
            `;
            statusResult.classList.add('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Scroll animations for cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe job cards and other cards
    document.querySelectorAll('.job-card, .service-detail').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
});
