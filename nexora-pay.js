// Account number handling (dynamic)
let currentAccountNumber = null;

function updateAccountDisplays() {
    const mainDisplay = document.getElementById('accountNumberDisplay');
    const accountName = document.getElementById('accountName');
    const authorizedBy = document.getElementById('authorizedBy');
    const copyBtn = document.querySelector('button[onclick="copyAccount()"]');
    
    if (currentAccountNumber) {
        if (mainDisplay) mainDisplay.textContent = currentAccountNumber;
        if (mainDisplay) mainDisplay.style.color = '#f2f8ff';
        if (accountName) accountName.textContent = 'Nexora Tech Limited';
        if (accountName) accountName.style.color = '#e0e0e0';
        if (authorizedBy) authorizedBy.textContent = 'Majesty Robert (Founder) & Emmanuel Alli (Vice Manager)';
        if (authorizedBy) authorizedBy.style.color = '#e0e0e0';
        if (copyBtn) copyBtn.style.opacity = '1';
        if (copyBtn) copyBtn.style.cursor = 'pointer';
        
        const recipient = document.getElementById('recipientAccount');
        if (recipient) recipient.textContent = currentAccountNumber;
        
        document.querySelectorAll('.account-number').forEach(el => {
            if (el && el.id !== 'accountNumberDisplay') el.textContent = currentAccountNumber;
        });
    }
}

function copyAccount() {
    if (!currentAccountNumber) {
        if (window.notificationSystem) {
            window.notificationSystem.showNotification('Please generate an account first', 'error', 4000);
        }
        return;
    }
    
    navigator.clipboard.writeText(currentAccountNumber).then(() => {
        if (window.notificationSystem) {
            window.notificationSystem.showNotification(`✓ Account copied: ${currentAccountNumber}`, 'success', 4000);
        }
    }).catch(err => {
        if (window.notificationSystem) {
            window.notificationSystem.showNotification('Failed to copy account number', 'error', 4000);
        }
    });
}

function generateAccount() {
    currentAccountNumber = String(Math.floor(1000000000 + Math.random() * 9000000000));
    updateAccountDisplays();
    
    if (window.notificationSystem) {
        window.notificationSystem.showNotification(`✓ Account generated: ${currentAccountNumber}`, 'success', 5000);
    }
}

// Open Payment Modal
function openPaymentModal(method) {
    const methodNames = {
        'card': 'Card Transfer',
        'mobile': 'Mobile Money Transfer',
        'bank': 'Bank Transfer'
    };
    document.getElementById('paymentMethod').textContent = methodNames[method];
    document.getElementById('paymentModal').style.display = 'block';
    document.getElementById('paymentForm').reset();
    document.getElementById('amountDisplay').textContent = '₦0';
    document.getElementById('totalDisplay').textContent = '₦0';
}

// Close Payment Modal
function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const paymentModal = document.getElementById('paymentModal');
    if (event.target == paymentModal) {
        paymentModal.style.display = 'none';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Update amount display in real-time
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.addEventListener('input', function() {
            const amount = this.value || '0';
            const numAmount = parseFloat(amount);
            if (!isNaN(numAmount)) {
                document.getElementById('amountDisplay').textContent = '₦' + numAmount.toLocaleString('en-NG');
                document.getElementById('totalDisplay').textContent = '₦' + numAmount.toLocaleString('en-NG');
            }
        });
    }

    // Handle Payment Form Submission
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('paymentName').value.trim();
            const email = document.getElementById('paymentEmail').value.trim();
            const phone = document.getElementById('paymentPhone').value.trim();
            const amount = document.getElementById('amount').value.trim();
            
            // Validate fields
            if (!name || !email || !phone || !amount) {
                alert('❌ Please fill in all required fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('❌ Please enter a valid email address');
                return;
            }
            
            // Phone validation
            if (phone.length < 10) {
                alert('❌ Please enter a valid phone number');
                return;
            }
            
            // Amount validation
            const numAmount = parseFloat(amount);
            if (isNaN(numAmount) || numAmount < 100) {
                alert('❌ Minimum amount is ₦100');
                return;
            }
            
            // Show success message
            const method = document.getElementById('paymentMethod').textContent;
            const formattedAmount = numAmount.toLocaleString('en-NG');
            
            alert(`✅ Payment Initiated Successfully!\n\n📱 Method: ${method}\n💰 Amount: ₦${formattedAmount}\n🏦 Account: ${currentAccountNumber}\n👤 Name: ${name}\n📧 Email: ${email}\n\nYour payment will be processed shortly.\nThank you for your support!`);
            
            // Close modal
            closePaymentModal();
        });
    }

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

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Scroll animations for payment cards
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

    // Observe payment cards
    document.querySelectorAll('.payment-card, .feature').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });

    // Ensure dynamic account number is shown on load
    updateAccountDisplays();
});
