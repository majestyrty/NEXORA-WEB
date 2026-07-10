// Email Notification System
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.initContainer();
    }

    initContainer() {
        if (document.querySelector('.notification-container')) return;
        
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }

    // Send in-app notification
    showNotification(message, type = 'success', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        this.container.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Close button handler
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });

        // Auto-remove after duration
        const timeout = setTimeout(() => {
            this.removeNotification(notification);
        }, duration);

        notification.dataset.timeout = timeout;
    }

    removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }

    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ',
            warning: '⚠'
        };
        return icons[type] || icons.info;
    }

    // Send email notification (client-side simulation)
    async sendEmailNotification(email, subject, message) {
        try {
            // In production, this would call your backend API
            // For now, we'll simulate with a success notification
            
            // Show local notification
            this.showNotification(
                `Email sent to ${email}`,
                'success',
                5000
            );

            // Store in localStorage for tracking
            this.trackEmailNotification(email, subject);

            return true;
        } catch (error) {
            this.showNotification(
                'Failed to send email notification',
                'error',
                4000
            );
            return false;
        }
    }

    trackEmailNotification(email, subject) {
        const notifications = JSON.parse(localStorage.getItem('emailNotifications') || '[]');
        notifications.push({
            email,
            subject,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('emailNotifications', JSON.stringify(notifications));
    }
}

// Application Status Tracking
class ApplicationStatus {
    constructor() {
        this.currentPage = 'home';
        this.userActions = [];
        this.sessionStart = new Date();
        this.initTracking();
    }

    initTracking() {
        // Track current page/section
        this.trackPageView();
        
        // Track user interactions
        this.trackUserActions();
    }

    trackPageView() {
        // Detect current page
        const path = window.location.pathname;
        if (path.includes('about')) this.currentPage = 'about';
        else if (path.includes('services')) this.currentPage = 'services';
        else if (path.includes('nexora-pay')) this.currentPage = 'nexora-pay';
        else this.currentPage = 'home';

        // Or track by section on single page
        if (window.location.href.includes('index.html')) {
            this.trackSectionScroll();
        }

        this.logActivity('page_view', { page: this.currentPage });
    }

    trackSectionScroll() {
        const sections = document.querySelectorAll('section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id || entry.target.className;
                    this.currentPage = sectionId;
                    this.logActivity('section_view', { section: sectionId });
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => observer.observe(section));
    }

    trackUserActions() {
        // Track clicks
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, a, input');
            if (target) {
                this.logActivity('click', { 
                    element: target.tagName, 
                    text: target.textContent?.substring(0, 50) || target.value
                });
            }
        }, true);

        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            this.logActivity('form_submit', { 
                form: form.id || form.className 
            });
        }, true);
    }

    logActivity(action, data = {}) {
        const activity = {
            action,
            data,
            timestamp: new Date().toISOString(),
            page: this.currentPage
        };

        this.userActions.push(activity);

        // Keep only last 100 actions in memory
        if (this.userActions.length > 100) {
            this.userActions.shift();
        }

        // Store in sessionStorage for current session
        try {
            sessionStorage.setItem('appStatus', JSON.stringify({
                currentPage: this.currentPage,
                sessionStart: this.sessionStart.toISOString(),
                totalActions: this.userActions.length,
                lastAction: activity
            }));
        } catch (e) {
            console.log('Could not store status to sessionStorage');
        }
    }

    getStatus() {
        return {
            currentPage: this.currentPage,
            sessionStart: this.sessionStart,
            totalActions: this.userActions.length,
            recentActions: this.userActions.slice(-5)
        };
    }

    displayStatus() {
        const status = this.getStatus();
        console.log('Current Status:', status);
        return status;
    }
}

// Initialize systems when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.notificationSystem = new NotificationSystem();
    window.appStatus = new ApplicationStatus();
});
