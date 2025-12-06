
// Campus Merch Hub - Complete Application
// Combined into a single file for deployment

// ============================================
// MAIN APPLICATION CLASS
// ============================================

class CampusMerchHub {
    constructor() {
        this.viewMode = 'admin';
        this.adminPage = 'dashboard';
        this.userPage = 'catalog';
        this.currentUser = {
            name: 'Admin User',
            role: 'admin',
            department: null
        };
        this.cartItemCount = 3;
        this.isMobileMenuOpen = false;
        
        // Initialize modules
        this.modules = {
            pageLayout: new PageLayout(this),
            productManagement: new ProductManagement(this),
            departments: new Departments(this),
            merchRelease: new MerchRelease(this),
            communityApproval: new CommunityApproval(this),
            adminDashboard: new AdminDashboard(this),
            orderManagement: new OrderManagement(this),
            userVerification: new UserVerification(this)
        };
    }
    
    // App state methods
    getViewMode() { return this.viewMode; }
    setViewMode(mode) { 
        this.viewMode = mode; 
        this.render(); 
    }
    
    getAdminPage() { return this.adminPage; }
    setAdminPage(page) { 
        this.adminPage = page; 
        this.render(); 
    }
    
    getUserPage() { return this.userPage; }
    setUserPage(page) { 
        this.userPage = page; 
        this.render(); 
    }
    
    getCurrentUser() { return this.currentUser; }
    getCartItemCount() { return this.cartItemCount; }
    isAssignedAdmin() { return this.currentUser.role === 'assigned-admin'; }
    getAdminDepartment() { return this.currentUser.department; }
    
    // Render the entire application
    render() {
        const container = document.getElementById('app');
        if (!container) return;
        
        container.innerHTML = this.modules.pageLayout.render();
        this.attachEventListeners();
        
        // Setup event listeners for admin dashboard if it's the current page
        if (this.getViewMode() === 'admin' && this.getAdminPage() === 'dashboard') {
            setTimeout(() => {
                this.modules.adminDashboard.setupEventListeners();
            }, 0);
        }
    }
    
    attachEventListeners() {
        // Event delegation for navigation
        document.addEventListener('click', (e) => {
            // View mode toggles
            if (e.target.closest('[data-action="setViewMode"]')) {
                const btn = e.target.closest('[data-action="setViewMode"]');
                this.setViewMode(btn.dataset.mode);
            }
            
            // Toggle view mode
            if (e.target.closest('[data-action="toggleViewMode"]')) {
                this.setViewMode(this.viewMode === 'admin' ? 'user' : 'admin');
            }
            
            // Admin page navigation
            if (e.target.closest('[data-action="setAdminPage"]')) {
                const btn = e.target.closest('[data-action="setAdminPage"]');
                this.setAdminPage(btn.dataset.page);
            }
            
            // User page navigation
            if (e.target.closest('[data-action="setUserPage"]')) {
                const btn = e.target.closest('[data-action="setUserPage"]');
                this.setUserPage(btn.dataset.page);
            }
            
            // Logout
            if (e.target.closest('[data-action="logout"]')) {
                if (confirm('Are you sure you want to logout?')) {
                    alert('Logged out successfully');
                }
            }
            
            // Mobile menu
            if (e.target.closest('[data-action="openMobileMenu"]')) {
                this.isMobileMenuOpen = true;
                this.modules.pageLayout.updateMobileSheet();
            }
            
            if (e.target.closest('[data-action="closeMobileMenu"]')) {
                this.isMobileMenuOpen = false;
                this.modules.pageLayout.updateMobileSheet();
            }
            
            // Metric card clicks - navigate to corresponding pages
            if (e.target.closest('[data-navigate-to]')) {
                const card = e.target.closest('[data-navigate-to]');
                const page = card.getAttribute('data-navigate-to');
                this.setAdminPage(page);
            }
        });
    }
}

// ============================================
// PAGE LAYOUT MODULE
// ============================================

class PageLayout {
    constructor(app) {
        this.app = app;
        
        this.adminPages = [
            { id: 'dashboard', label: 'Dashboard', icon: 'chart-pie' },
            { id: 'products', label: 'Product Management', icon: 'box' },
            { id: 'orders', label: 'Order Management', icon: 'shopping-bag' },
            { id: 'community', label: 'Community Approval', icon: 'check-square' },
            { id: 'release', label: 'Merch Release', icon: 'qrcode' },
            { id: 'departments', label: 'Departments', icon: 'building' },
        ];

        this.userPages = [
            { id: 'catalog', label: 'Shop Merch', icon: 'store' },
            { id: 'cart', label: 'Shopping Cart', icon: 'shopping-cart' },
            { id: 'design-lab', label: 'Design Lab', icon: 'palette' },
            { id: 'connect', label: 'Campus Connect', icon: 'users' },
            { id: 'profile', label: 'My Profile', icon: 'user-circle' },
        ];

        // Add User Verification for super admin only
        if (this.app.getCurrentUser().role !== 'assigned-admin') {
            this.adminPages.push({ id: 'verification', label: 'User Verification', icon: 'user-check' });
        }
    }

    render() {
        return `
            <div class="min-h-screen bg-gray-50">
                ${this.renderHeader()}
                
                <!-- Mobile Menu Button -->
                <div class="mobile-only">
                    <button class="mobile-menu-btn btn btn-default" data-action="openMobileMenu">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>

                <!-- Mobile Navigation Sheet -->
                <div id="mobile-sheet" class="mobile-sheet ${this.app.isMobileMenuOpen ? 'open' : ''}">
                    <div class="mobile-sheet-content">
                        <div class="mobile-sheet-header">
                            <h2>Navigation</h2>
                            <button class="close-btn" data-action="closeMobileMenu">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="mobile-sheet-body">
                            ${this.app.getViewMode() === 'admin' ? this.renderAdminNavigation() : this.renderUserNavigation()}
                        </div>
                    </div>
                </div>

                <div class="flex">
                    ${this.renderSidebar()}
                    
                    <!-- Main Content -->
                    <main class="main-content">
                        <div id="page-content" class="animate-fade-in">
                            ${this.getPageContent()}
                        </div>
                    </main>
                </div>
            </div>
        `;
    }

    renderHeader() {
        return `
            <header class="sticky-header">
                <div class="container mx-auto px-4 py-3 lg:py-4">
                    <div class="flex items-center justify-between">
                        <!-- Logo and Title -->
                        <div class="header-logo">
                            <div class="logo-icon gradient-bg">
                                <i class="fas fa-box text-yellow-300 text-lg"></i>
                            </div>
                            <div class="logo-text">
                                <h1>Campus Merch Hub</h1>
                                <p class="hidden sm:block">Your Official Campus Store</p>
                            </div>
                        </div>

                        <!-- Desktop Actions -->
                        <div class="hidden-mobile items-center gap-4">
                            <div class="text-right">
                                <p class="text-sm text-gray-600">Welcome,</p>
                                <p class="text-sm text-[#B43A4E]">${this.app.getCurrentUser().name}</p>
                            </div>

                            ${this.app.getViewMode() === 'user' ? `
                                <button class="btn btn-ghost relative" data-action="setUserPage" data-page="cart">
                                    <i class="fas fa-shopping-cart"></i>
                                    ${this.app.getCartItemCount() > 0 ? `
                                        <span class="badge badge-primary absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                                            ${this.app.getCartItemCount()}
                                        </span>
                                    ` : ''}
                                </button>
                            ` : ''}

                            <button class="btn ${this.app.getViewMode() === 'admin' ? 'btn-default' : 'btn-outline'}" data-action="setViewMode" data-mode="admin">
                                <i class="fas fa-chart-pie"></i>
                                Admin
                            </button>

                            <button class="btn ${this.app.getViewMode() === 'user' ? 'btn-default' : 'btn-outline'}" data-action="setViewMode" data-mode="user">
                                <i class="fas fa-user"></i>
                                User
                            </button>

                            <button class="btn btn-ghost" data-action="logout">
                                <i class="fas fa-sign-out-alt"></i>
                                Logout
                            </button>
                        </div>

                        <!-- Mobile Actions -->
                        <div class="flex lg:hidden items-center gap-2">
                            ${this.app.getViewMode() === 'user' ? `
                                <button class="btn btn-ghost btn-sm relative" data-action="setUserPage" data-page="cart">
                                    <i class="fas fa-shopping-cart"></i>
                                    ${this.app.getCartItemCount() > 0 ? `
                                        <span class="badge badge-primary absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs">
                                            ${this.app.getCartItemCount()}
                                        </span>
                                    ` : ''}
                                </button>
                            ` : ''}

                            <button class="btn btn-sm ${this.app.getViewMode() === 'admin' ? 'btn-default' : 'btn-outline'}" data-action="toggleViewMode">
                                ${this.app.getViewMode() === 'admin' ? `
                                    <i class="fas fa-user"></i>
                                    <span class="hidden sm:inline">User</span>
                                ` : `
                                    <i class="fas fa-chart-pie"></i>
                                    <span class="hidden sm:inline">Admin</span>
                                `}
                            </button>

                            <button class="btn btn-ghost btn-sm" data-action="logout">
                                <i class="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        `;
    }

    renderSidebar() {
        if (this.app.getViewMode() === 'admin') {
            return `
                <aside class="sidebar hidden-mobile">
                    ${this.renderAdminNavigation()}
                </aside>
            `;
        } else {
            return `
                <aside class="sidebar hidden-mobile">
                    ${this.renderUserNavigation()}
                </aside>
            `;
        }
    }

    renderAdminNavigation() {
        return `
            <nav class="space-y-2">
                ${this.adminPages.map(page => {
                    const isActive = this.app.getAdminPage() === page.id;
                    return `
                        <button class="nav-item ${isActive ? 'active' : ''}" data-action="setAdminPage" data-page="${page.id}">
                            <i class="fas fa-${page.icon} icon"></i>
                            ${page.label}
                        </button>
                    `;
                }).join('')}
            </nav>
        `;
    }

    renderUserNavigation() {
        return `
            <nav class="space-y-2">
                ${this.userPages.map(page => {
                    const isActive = this.app.getUserPage() === page.id;
                    const isCart = page.id === 'cart';
                    return `
                        <button class="nav-item ${isActive ? 'active' : ''}" data-action="setUserPage" data-page="${page.id}">
                            <i class="fas fa-${page.icon} icon"></i>
                            ${page.label}
                            ${isCart && this.app.getCartItemCount() > 0 ? `
                                <span class="cart-badge">${this.app.getCartItemCount()}</span>
                            ` : ''}
                        </button>
                    `;
                }).join('')}
            </nav>
        `;
    }

    getPageContent() {
        if (this.app.getViewMode() === 'admin') {
            switch(this.app.getAdminPage()) {
                case 'dashboard':
                    return this.app.modules.adminDashboard.render();
                case 'products':
                    return this.app.modules.productManagement.render();
                case 'orders':
                    return this.app.modules.orderManagement.render();
                case 'departments':
                    return this.app.modules.departments.render();
                case 'release':
                    return this.app.modules.merchRelease.render();
                case 'community':
                    return this.app.modules.communityApproval.render();
                case 'verification':
                    return this.app.modules.userVerification.render();
                default:
                    return '<div class="p-6"><h2>Page Not Found</h2></div>';
            }
        } else {
            return '<div class="p-6"><h2>User Interface Coming Soon</h2></div>';
        }
    }

    updateMobileSheet() {
        const sheet = document.getElementById('mobile-sheet');
        if (sheet) {
            if (this.app.isMobileMenuOpen) {
                sheet.classList.remove('hidden');
                sheet.classList.add('open');
            } else {
                sheet.classList.remove('open');
                setTimeout(() => {
                    sheet.classList.add('hidden');
                }, 300);
            }
        }
    }
}

// ============================================
// MOCK DATA (FIXED SYNTAX ERROR)
// ============================================

const mockData = {
    products: [
        {
            id: '1',
            name: 'University T-Shirt',
            category: 'Apparel',
            price: 25.99,
            stock: 100,
            description: 'Comfortable cotton t-shirt with university logo',
            images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
            limitedPerStudent: true,
            maxQuantityPerStudent: 2,
            isPreOrder: false,
            allowedBuyers: { type: 'all_courses' }
        },
        {
            id: '2',
            name: 'Engineering Hoodie',
            category: 'Apparel',
            price: 45.99,
            stock: 50,
            description: 'Warm hoodie for engineering students',
            images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'],
            image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
            limitedPerStudent: false,
            isPreOrder: true,
            preOrderReleaseDate: '2024-12-01',
            allowedBuyers: { type: 'department', department: 'Engineering' }
        }
    ],
    orders: [
        { 
            id: 'ORD001', 
            userName: 'John Doe', 
            total: 1500, 
            status: 'completed',
            department: 'CAS',
            course: 'Computer Science',
            yearLevel: '3rd Year',
            event: 'Intramurals 2025',
            userType: 'student'
        },
        { 
            id: 'ORD002', 
            userName: 'Jane Smith', 
            total: 2300, 
            status: 'processing',
            department: 'CBA',
            course: 'Marketing',
            yearLevel: '4th Year',
            event: 'Foundation Week',
            userType: 'student'
        }
    ],
    eventSalesYearly: {
        "Intramurals 2025": { Jan: 3200, Feb: 4100, Mar: 3900, Apr: 4500, May: 4800, Jun: 5200 },
        "Foundation Week": { Jan: 2800, Feb: 3500, Mar: 3200, Apr: 3800, May: 4200, Jun: 4600 }
    },
    departmentHierarchy: {
        "College of Engineering": {
            total: 11050,
            courses: {
                "Computer Engineering": [
                    { level: "1st Year", sales: 1200 },
                    { level: "2nd Year", sales: 1800 },
                    { level: "3rd Year", sales: 2500 },
                    { level: "4th Year", sales: 2200 },
                    { level: "Alumni", sales: 1500 },
                    { level: "Faculty", sales: 1850 }
                ]
            }
        }
    },
    categoryData: [
        { category: "Apparel", sales: 45 },
        { category: "Accessories", sales: 30 },
        { category: "Custom", sales: 25 }
    ]
};

// ============================================
// ADMIN DASHBOARD MODULE (UPDATED WITH HOVER EFFECTS)
// ============================================

class AdminDashboard {
    constructor(app) {
        this.app = app;
        this.selectedEvent = 'Intramurals 2025';
        this.events = [
            'Intramurals 2025',
            'Foundation Week',
            'Graduation 2025',
            'Freshman Orientation',
            'Homecoming 2024',
            'All Events Overview'
        ];
        
        // Mock data for different events
        this.eventData = {
            'Intramurals 2025': {
                totalRevenue: 25430,
                totalOrders: 156,
                activeUsers: 1243,
                products: 89,
                verifications: 8,
                pendingOrders: 12,
                processingOrders: 24,
                revenueChange: '+12%',
                usersChange: '+8%'
            },
            'Foundation Week': {
                totalRevenue: 18750,
                totalOrders: 98,
                activeUsers: 845,
                products: 76,
                verifications: 5,
                pendingOrders: 8,
                processingOrders: 15,
                revenueChange: '+9%',
                usersChange: '+5%'
            },
            'Graduation 2025': {
                totalRevenue: 32500,
                totalOrders: 210,
                activeUsers: 1560,
                products: 102,
                verifications: 12,
                pendingOrders: 18,
                processingOrders: 32,
                revenueChange: '+15%',
                usersChange: '+12%'
            },
            'Freshman Orientation': {
                totalRevenue: 12900,
                totalOrders: 78,
                activeUsers: 620,
                products: 54,
                verifications: 3,
                pendingOrders: 6,
                processingOrders: 12,
                revenueChange: '+6%',
                usersChange: '+4%'
            },
            'Homecoming 2024': {
                totalRevenue: 28900,
                totalOrders: 185,
                activeUsers: 1420,
                products: 95,
                verifications: 9,
                pendingOrders: 15,
                processingOrders: 28,
                revenueChange: '+14%',
                usersChange: '+10%'
            },
            'All Events Overview': {
                totalRevenue: 118480,
                totalOrders: 727,
                activeUsers: 5688,
                products: 416,
                verifications: 37,
                pendingOrders: 59,
                processingOrders: 111,
                revenueChange: '+11%',
                usersChange: '+8%'
            }
        };
        
        // For searchable dropdown
        this.searchInput = '';
        this.filteredEvents = [...this.events];
        this.dropdownOpen = false;
    }

        render() {
        const data = this.eventData[this.selectedEvent] || this.eventData['Intramurals 2025'];
        
        return `
            <div class="admin-dashboard-container">
                <!-- Dashboard Header -->
                <div class="dashboard-header">
                    <div class="dashboard-title">
                        <h1>Admin Dashboard</h1>
                        <p>Overview for ${this.selectedEvent}</p>
                    </div>
                    <div class="event-selector">
                        <div class="searchable-dropdown">
                            <div class="flex items-center">
                                <i class="fas fa-search text-gray-400 ml-3"></i>
                                <input type="text" 
                                       placeholder="Search events..." 
                                       value="${this.searchInput}"
                                       class="w-full py-2 px-3 text-sm focus:outline-none event-search-input"
                                       id="event-search-input">
                                <button class="p-2 text-gray-400 hover:text-gray-600" onclick="app.modules.adminDashboard.toggleDropdown()">
                                    <i class="fas fa-chevron-${this.dropdownOpen ? 'up' : 'down'}"></i>
                                </button>
                            </div>
                            
                            <!-- Dropdown options -->
                            <div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg ${this.dropdownOpen ? '' : 'hidden'}" 
                                 id="event-dropdown">
                                ${this.filteredEvents.map(event => `
                                    <div class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm ${this.selectedEvent === event ? 'bg-gray-100 font-medium' : ''}"
                                         onclick="app.modules.adminDashboard.selectEvent('${event}')">
                                        ${event}
                                    </div>
                                `).join('')}
                                ${this.filteredEvents.length === 0 ? `
                                    <div class="px-4 py-3 text-sm text-gray-500">
                                        No events found
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Metric Cards Grid - Perfect 5-column layout with hover effects -->
                <div class="metric-cards-grid">
                    <!-- Total Revenue - FIXED TO FIT CARD -->
                    <div class="metric-card admin-card hover:bg-[#fff8f9] transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                         onclick="app.setAdminPage('orders')">
                        <div class="metric-card-content">
                            <div class="metric-card-top">
                                <div class="metric-info">
                                    <span class="metric-label">Total Revenue</span>
                                    <h3 class="metric-value revenue-value">₱${data.totalRevenue.toLocaleString()}</h3>
                                    <div class="metric-change change-positive">
                                        <i class="fas fa-arrow-up"></i>
                                        ${data.revenueChange} from last month
                                    </div>
                                </div>
                                <div class="metric-icon-container icon-bg-primary">
                                    <i class="fas fa-dollar-sign metric-icon icon-primary"></i>
                                </div>
                            </div>
                            <div class="metric-card-bottom">
                                <div class="metric-navigation">
                                    <i class="fas fa-external-link-alt"></i>
                                    Click to view orders
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Total Orders -->
                    <div class="metric-card admin-card hover:bg-[#fff8f9] transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                         onclick="app.setAdminPage('orders')">
                        <div class="metric-card-content">
                            <div class="metric-card-top">
                                <div class="metric-info">
                                    <span class="metric-label">Total Orders</span>
                                    <h3 class="metric-value">${data.totalOrders}</h3>
                                    <div class="status-indicators">
                                        <span class="status-indicator status-pending">
                                            Pending: ${data.pendingOrders}
                                        </span>
                                        <span class="status-indicator status-processing">
                                            Processing: ${data.processingOrders}
                                        </span>
                                    </div>
                                </div>
                                <div class="metric-icon-container icon-bg-secondary">
                                    <i class="fas fa-shopping-bag metric-icon icon-secondary"></i>
                                </div>
                            </div>
                            <div class="metric-card-bottom">
                                <div class="metric-navigation">
                                    <i class="fas fa-external-link-alt"></i>
                                    Click to view orders
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Active Users -->
                    <div class="metric-card admin-card hover:bg-[#fff8f9] transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                         onclick="app.setAdminPage('departments')">
                        <div class="metric-card-content">
                            <div class="metric-card-top">
                                <div class="metric-info">
                                    <span class="metric-label">Active Users</span>
                                    <h3 class="metric-value">${data.activeUsers.toLocaleString()}</h3>
                                    <div class="metric-change change-positive">
                                        <i class="fas fa-arrow-up"></i>
                                        ${data.usersChange} from last month
                                    </div>
                                </div>
                                <div class="metric-icon-container icon-bg-primary">
                                    <i class="fas fa-users metric-icon icon-primary"></i>
                                </div>
                            </div>
                            <div class="metric-card-bottom">
                                <div class="metric-navigation">
                                    <i class="fas fa-external-link-alt"></i>
                                    Click to view departments
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Products -->
                    <div class="metric-card admin-card hover:bg-[#fff8f9] transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                         onclick="app.setAdminPage('products')">
                        <div class="metric-card-content">
                            <div class="metric-card-top">
                                <div class="metric-info">
                                    <span class="metric-label">Products</span>
                                    <h3 class="metric-value">${data.products}</h3>
                                    <div class="mt-2 text-xs text-gray-500">
                                        23 Pre-order items
                                    </div>
                                </div>
                                <div class="metric-icon-container icon-bg-secondary">
                                    <i class="fas fa-box metric-icon icon-secondary"></i>
                                </div>
                            </div>
                            <div class="metric-card-bottom">
                                <div class="metric-navigation">
                                    <i class="fas fa-external-link-alt"></i>
                                    Click to manage products
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Verification -->
                    <div class="metric-card admin-card hover:bg-[#fff8f9] transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                         onclick="app.setAdminPage('verification')">
                        <div class="metric-card-content">
                            <div class="metric-card-top">
                                <div class="metric-info">
                                    <span class="metric-label">Verifications</span>
                                    <h3 class="metric-value">${data.verifications}</h3>
                                    <div class="mt-2 text-xs font-medium text-amber-600">
                                        <i class="fas fa-clock mr-1"></i>
                                        Pending review
                                    </div>
                                </div>
                                <div class="metric-icon-container icon-bg-primary">
                                    <i class="fas fa-user-check metric-icon icon-primary"></i>
                                </div>
                            </div>
                            <div class="metric-card-bottom">
                                <div class="metric-navigation">
                                    <i class="fas fa-external-link-alt"></i>
                                    Click to review verifications
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="charts-grid">
                    <!-- Monthly Sales Trend -->
                    <div class="chart-container admin-card hover:border-burgundy transition-all duration-200">
                        <div class="chart-header">
                            <div>
                                <h4 class="chart-title">Monthly Sales Trend</h4>
                                <p class="chart-subtitle">${this.selectedEvent}</p>
                            </div>
                            <i class="fas fa-chart-line text-xl text-burgundy"></i>
                        </div>
                        <div class="chart-placeholder">
                            <div class="w-16 h-16 bg-gradient-to-r from-burgundy to-orange rounded-full flex items-center justify-center mx-auto mb-3">
                                <i class="fas fa-chart-line text-white text-xl"></i>
                            </div>
                            <p class="text-gray-700 font-medium mb-1">Sales Trend for ${this.selectedEvent}</p>
                            <p class="text-gray-500 text-sm">Chart visualization would appear here</p>
                            <div class="mt-4 grid grid-cols-3 gap-2 text-xs">
                                <div class="bg-gray-50 p-2 rounded">
                                    <p class="text-gray-600">Jan</p>
                                    <p class="font-semibold">₱${(data.totalRevenue * 0.08).toLocaleString()}</p>
                                </div>
                                <div class="bg-gray-50 p-2 rounded">
                                    <p class="text-gray-600">Feb</p>
                                    <p class="font-semibold">₱${(data.totalRevenue * 0.12).toLocaleString()}</p>
                                </div>
                                <div class="bg-gray-50 p-2 rounded">
                                    <p class="text-gray-600">Mar</p>
                                    <p class="font-semibold">₱${(data.totalRevenue * 0.15).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sales by Category -->
                    <div class="chart-container admin-card hover:border-orange transition-all duration-200">
                        <div class="chart-header">
                            <div>
                                <h4 class="chart-title">Sales by Category</h4>
                                <p class="chart-subtitle">${this.selectedEvent}</p>
                            </div>
                            <i class="fas fa-chart-pie text-xl text-orange"></i>
                        </div>
                        <div class="chart-placeholder">
                            <div class="w-16 h-16 bg-gradient-to-r from-orange to-burgundy rounded-full flex items-center justify-center mx-auto mb-3">
                                <i class="fas fa-chart-pie text-white text-xl"></i>
                            </div>
                            <p class="text-gray-700 font-medium mb-1">Category Breakdown</p>
                            <p class="text-gray-500 text-sm">Pie chart visualization</p>
                            <div class="mt-4 flex flex-col gap-2">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <div class="w-3 h-3 bg-burgundy rounded-full mr-2"></div>
                                        <span class="text-sm">Apparel: 45%</span>
                                    </div>
                                    <span class="text-sm font-semibold">₱${(data.totalRevenue * 0.45).toLocaleString()}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <div class="w-3 h-3 bg-orange rounded-full mr-2"></div>
                                        <span class="text-sm">Accessories: 30%</span>
                                    </div>
                                    <span class="text-sm font-semibold">₱${(data.totalRevenue * 0.30).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Department Sales Chart -->
                <div class="chart-container department-sales-chart admin-card hover:border-burgundy transition-all duration-200">
                    <div class="chart-header">
                        <div>
                            <h4 class="chart-title">Department Sales Breakdown</h4>
                            <p class="chart-subtitle">${this.selectedEvent}</p>
                        </div>
                        <i class="fas fa-university text-xl text-burgundy"></i>
                    </div>
                    <div class="chart-placeholder">
                        <div class="w-16 h-16 bg-gradient-to-r from-burgundy to-navy rounded-full flex items-center justify-center mx-auto mb-3">
                            <i class="fas fa-university text-white text-xl"></i>
                        </div>
                        <p class="text-gray-700 font-medium mb-1">Department Performance</p>
                        <p class="text-gray-500 text-sm">Bar chart visualization</p>
                        <div class="mt-4 space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-sm">College of Engineering</span>
                                <div class="w-48 bg-gray-200 rounded-full h-2.5">
                                    <div class="bg-burgundy h-2.5 rounded-full" style="width: 85%"></div>
                                </div>
                                <span class="text-sm font-semibold ml-2">₱${(data.totalRevenue * 0.35).toLocaleString()}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm">College of Business Admin</span>
                                <div class="w-48 bg-gray-200 rounded-full h-2.5">
                                    <div class="bg-orange h-2.5 rounded-full" style="width: 65%"></div>
                                </div>
                                <span class="text-sm font-semibold ml-2">₱${(data.totalRevenue * 0.28).toLocaleString()}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm">College of Arts & Sciences</span>
                                <div class="w-48 bg-gray-200 rounded-full h-2.5">
                                    <div class="bg-navy h-2.5 rounded-full" style="width: 45%"></div>
                                </div>
                                <span class="text-sm font-semibold ml-2">₱${(data.totalRevenue * 0.22).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Add event listener method
    setupEventListeners() {
        // Setup search input event listener
        const searchInput = document.querySelector('.event-search-input');
        if (searchInput) {
            // Remove any existing listeners
            const newSearchInput = searchInput.cloneNode(true);
            searchInput.parentNode.replaceChild(newSearchInput, searchInput);
            
            // Add new listeners
            newSearchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value);
            });
            
            newSearchInput.addEventListener('focus', () => {
                this.dropdownOpen = true;
                this.updateDropdown();
            });
        }
        
        // Close dropdown when clicking outside
        const clickHandler = (e) => {
            if (!e.target.closest('.searchable-dropdown')) {
                this.dropdownOpen = false;
                this.updateDropdown();
            }
        };
        
        // Remove existing listener and add new one
        document.removeEventListener('click', clickHandler);
        document.addEventListener('click', clickHandler);
    }

    handleSearchInput(value) {
        this.searchInput = value;
        this.filteredEvents = this.events.filter(event => 
            event.toLowerCase().includes(value.toLowerCase())
        );
        this.updateDropdown();
    }

    toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
        this.updateDropdown();
    }

    updateDropdown() {
        const dropdown = document.getElementById('event-dropdown');
        const chevron = document.querySelector('.searchable-dropdown button i');
        
        if (dropdown) {
            if (this.dropdownOpen) {
                dropdown.classList.remove('hidden');
                if (chevron) {
                    chevron.className = 'fas fa-chevron-up';
                }
                
                // Update dropdown content
                dropdown.innerHTML = `
                    ${this.filteredEvents.map(event => `
                        <div class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm ${this.selectedEvent === event ? 'bg-gray-100 font-medium' : ''}"
                             onclick="app.modules.adminDashboard.selectEvent('${event}')">
                            ${event}
                        </div>
                    `).join('')}
                    ${this.filteredEvents.length === 0 ? `
                        <div class="px-4 py-3 text-sm text-gray-500">
                            No events found
                        </div>
                    ` : ''}
                `;
            } else {
                dropdown.classList.add('hidden');
                if (chevron) {
                    chevron.className = 'fas fa-chevron-down';
                }
            }
        }
    }

    selectEvent(event) {
        this.selectedEvent = event;
        this.searchInput = '';
        this.filteredEvents = [...this.events];
        this.dropdownOpen = false;
        this.app.render(); // Only full render when event changes
    }

    changeEvent(event) {
        this.selectedEvent = event;
        this.app.render();
    }
}

// ============================================
// PRODUCT MANAGEMENT MODULE (COMPLETE WITH ALL FEATURES)
// ============================================

class ProductManagement {
    constructor(app) {
        this.app = app;
        this.products = [...mockData.products];
        this.searchTerm = '';
        this.categoryFilter = 'all';
        this.selectedProduct = null;
        this.showAddProductDialog = false;
        this.showEditProductDialog = false;
        this.showDeleteConfirmDialog = false;
        this.showPaymentSettingsDialog = false;
        this.showViewProductDialog = false;
        
        // New product form data
        this.newProduct = {
            name: '',
            category: 'Apparel',
            price: 0,
            stock: 0,
            description: '',
            images: [],
            image: '',
            limitedPerStudent: false,
            maxQuantityPerStudent: 2,
            isPreOrder: false,
            preOrderReleaseDate: '',
            allowedBuyers: {
                type: 'all_departments', // all_departments, by_department, alumni, faculty
                departments: [],
                courses: [],
                includeAlumni: true,
                includeFaculty: true
            }
        };
        
        // Departments and courses data
        this.departments = [
            {
                id: 'CAS',
                name: 'College of Arts & Sciences',
                courses: ['Psychology', 'Biology', 'Chemistry', 'Mathematics']
            },
            {
                id: 'CBA',
                name: 'College of Business Admin',
                courses: ['Marketing', 'Finance', 'Management', 'Accounting']
            },
            {
                id: 'CCS',
                name: 'College of Computer Studies',
                courses: ['Computer Science', 'Information Technology', 'Software Engineering']
            },
            {
                id: 'COE',
                name: 'College of Engineering',
                courses: ['Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering']
            }
        ];
        
        // Payment settings with fixed layout
        this.paymentSettings = {
            methods: [
                {
                    id: '1',
                    name: 'GCash',
                    enabled: true,
                    accountNumber: '09123456789',
                    accountName: 'Campus Merch Hub',
                    qrCode: '',
                    instructions: 'Send payment to this GCash number'
                },
                {
                    id: '2',
                    name: 'BPI Bank Transfer',
                    enabled: true,
                    accountNumber: '1234567890',
                    accountName: 'Campus Merch Hub',
                    qrCode: '',
                    instructions: 'Send payment to this bank account'
                },
                {
                    id: '3',
                    name: 'Cash on Delivery',
                    enabled: true,
                    instructions: 'Pay when you receive the merchandise'
                }
            ]
        };
        
        // Add new payment method form
        this.newPaymentMethod = {
            name: '',
            type: 'digital_wallet',
            accountNumber: '',
            accountName: '',
            instructions: ''
        };
    }

    render() {
        const filteredProducts = this.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesCategory = this.categoryFilter === 'all' || product.category === this.categoryFilter;
            return matchesSearch && matchesCategory;
        });

        return `
            <div class="product-management p-4 lg:p-6 space-y-4 lg:space-y-6 pb-20 lg:pb-6">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 class="text-xl lg:text-3xl">Product Management</h2>
                        <p class="text-gray-600 text-sm lg:text-base">Manage your merchandise inventory</p>
                    </div>

                    <div class="flex flex-wrap gap-2 lg:gap-3">
                        <!-- Payment Settings Button -->
                        <button class="btn btn-outline gap-2 flex-1 sm:flex-none btn-sm payment-settings-btn"
                                onclick="app.modules.productManagement.openPaymentSettings()">
                            <i class="fas fa-credit-card"></i>
                            <span class="hidden sm:inline">Payment Settings</span>
                        </button>

                        <!-- Export Button -->
                        <button class="btn btn-outline gap-2 flex-1 sm:flex-none btn-sm export-btn"
                                onclick="app.modules.productManagement.exportProducts()">
                            <i class="fas fa-download"></i>
                            <span class="hidden sm:inline">Export</span>
                        </button>

                        <!-- Add Product Button -->
                        <button class="btn btn-primary gap-2 add-product-btn"
                                onclick="app.modules.productManagement.openAddProductDialog()">
                            <i class="fas fa-plus"></i>
                            Add Product
                        </button>
                    </div>
                </div>

                <!-- Filters -->
                <div class="card p-4">
                    <div class="flex gap-4">
                        <div class="flex-1 relative">
                            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input type="text" placeholder="Search products..." class="input pl-10 search-input" 
                                   value="${this.searchTerm}"
                                   oninput="app.modules.productManagement.handleSearch(this.value)">
                        </div>
                        <select class="select category-filter w-48" 
                                onchange="app.modules.productManagement.handleCategoryFilter(this.value)">
                            <option value="all" ${this.categoryFilter === 'all' ? 'selected' : ''}>All Categories</option>
                            <option value="Apparel" ${this.categoryFilter === 'Apparel' ? 'selected' : ''}>Apparel</option>
                            <option value="Accessories" ${this.categoryFilter === 'Accessories' ? 'selected' : ''}>Accessories</option>
                            <option value="Custom" ${this.categoryFilter === 'Custom' ? 'selected' : ''}>Custom</option>
                        </select>
                    </div>
                </div>

                <!-- Product List -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${filteredProducts.length > 0 ? 
                        filteredProducts.map(product => this.renderProductCard(product)).join('') :
                        '<div class="col-span-3 text-center py-8 text-gray-500"><p>No products found</p></div>'
                    }
                </div>

                <!-- Dialogs -->
                ${this.showAddProductDialog ? this.renderAddProductDialog() : ''}
                ${this.showEditProductDialog ? this.renderEditProductDialog() : ''}
                ${this.showViewProductDialog ? this.renderViewProductDialog() : ''}
                ${this.showDeleteConfirmDialog ? this.renderDeleteConfirmDialog() : ''}
                ${this.showPaymentSettingsDialog ? this.renderPaymentSettingsDialog() : ''}
            </div>
        `;
    }

    renderProductCard(product) {
        // Get buyer restrictions text
        let buyerText = '';
        if (product.allowedBuyers) {
            switch(product.allowedBuyers.type) {
                case 'all_departments':
                    buyerText = 'All Departments';
                    break;
                case 'by_department':
                    buyerText = `${product.allowedBuyers.departments?.length || 0} Departments`;
                    break;
                case 'alumni':
                    buyerText = 'Alumni Only';
                    break;
                case 'faculty':
                    buyerText = 'Faculty Only';
                    break;
                default:
                    buyerText = 'All Users';
            }
        }

        return `
            <div class="product-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div class="relative">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="product-main-image w-full h-48 object-cover cursor-pointer"
                         onclick="app.modules.productManagement.viewProduct('${product.id}')">
                    ${product.images && product.images.length > 1 ? `
                        <div class="product-image-badge absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                            +${product.images.length - 1}
                        </div>
                    ` : ''}
                </div>
                
                <div class="p-4">
                    <h3 class="product-name text-lg font-semibold text-gray-900 mb-1 cursor-pointer hover:text-burgundy"
                        onclick="app.modules.productManagement.viewProduct('${product.id}')">
                        ${product.name}
                    </h3>
                    <p class="product-description text-gray-600 text-sm mb-3">${product.description}</p>
                    
                    <div class="product-tags flex flex-wrap gap-2 mb-4">
                        <span class="badge badge-outline">${product.category}</span>
                        ${product.isPreOrder ? `
                            <span class="badge badge-warning">Pre-Order</span>
                        ` : `
                            <span class="badge ${product.stock > 0 ? 'badge-primary' : 'badge-destructive'}">
                                ${product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                            </span>
                        `}
                        ${product.limitedPerStudent ? `
                            <span class="badge badge-limited">Limited: ${product.maxQuantityPerStudent} per student</span>
                        ` : ''}
                        <span class="badge badge-outline text-xs">${buyerText}</span>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <p class="product-price text-xl font-bold text-burgundy">₱${product.price.toFixed(2)}</p>
                        <div class="flex gap-2">
                            <button class="btn btn-outline btn-sm view-product-btn"
                                    onclick="app.modules.productManagement.viewProduct('${product.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-outline btn-sm edit-product-btn"
                                    onclick="app.modules.productManagement.editProduct('${product.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-outline btn-sm delete-product-btn text-red-600"
                                    onclick="app.modules.productManagement.confirmDeleteProduct('${product.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderAddProductDialog() {
        const selectedDeptId = this.newProduct.allowedBuyers.departments?.[0] || '';
        const selectedCourses = this.newProduct.allowedBuyers.courses || [];
        
        return `
            <div class="dialog-overlay">
                <div class="dialog-content max-w-4xl">
                    <div class="dialog-header">
                        <h2>Add New Product</h2>
                        <p>Fill in the details for the new merchandise</p>
                        <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                                onclick="app.modules.productManagement.closeAddProductDialog()">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div class="dialog-body">
                        <form onsubmit="event.preventDefault(); app.modules.productManagement.saveNewProduct()">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <!-- Left Column: Basic Information -->
                                <div class="space-y-4">
                                    <!-- Product Name -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                        <input type="text" 
                                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                               placeholder="e.g., University T-Shirt"
                                               value="${this.newProduct.name}"
                                               oninput="app.modules.productManagement.updateNewProductField('name', this.value)"
                                               required>
                                    </div>
                                    
                                    <!-- Category and Price -->
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                            <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                                    onchange="app.modules.productManagement.updateNewProductField('category', this.value)">
                                                <option value="Apparel" ${this.newProduct.category === 'Apparel' ? 'selected' : ''}>Apparel</option>
                                                <option value="Accessories" ${this.newProduct.category === 'Accessories' ? 'selected' : ''}>Accessories</option>
                                                <option value="Custom" ${this.newProduct.category === 'Custom' ? 'selected' : ''}>Custom</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Price (₱) *</label>
                                            <input type="number" 
                                                   step="0.01"
                                                   min="0"
                                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                                   placeholder="0.00"
                                                   value="${this.newProduct.price}"
                                                   oninput="app.modules.productManagement.updateNewProductField('price', this.value)"
                                                   required>
                                        </div>
                                    </div>
                                    
                                    <!-- Stock and Pre-order -->
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                                            <input type="number" 
                                                   min="0"
                                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                                   placeholder="0"
                                                   value="${this.newProduct.stock}"
                                                   oninput="app.modules.productManagement.updateNewProductField('stock', this.value)"
                                                   required>
                                        </div>
                                        <div>
                                            <label class="flex items-center space-x-2">
                                                <input type="checkbox" 
                                                       class="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                                                       ${this.newProduct.isPreOrder ? 'checked' : ''}
                                                       onchange="app.modules.productManagement.updateNewProductField('isPreOrder', this.checked)">
                                                <span class="text-sm font-medium text-gray-700">Pre-order Item</span>
                                            </label>
                                            ${this.newProduct.isPreOrder ? `
                                                <div class="mt-2">
                                                    <label class="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
                                                    <input type="date" 
                                                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                                           value="${this.newProduct.preOrderReleaseDate}"
                                                           oninput="app.modules.productManagement.updateNewProductField('preOrderReleaseDate', this.value)">
                                                </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                    
                                    <!-- Description -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                        <textarea class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                                  rows="3"
                                                  placeholder="Describe the product..."
                                                  oninput="app.modules.productManagement.updateNewProductField('description', this.value)">${this.newProduct.description}</textarea>
                                    </div>
                                    
                                    <!-- Limited Purchase -->
                                    <div>
                                        <label class="flex items-center space-x-2">
                                            <input type="checkbox" 
                                                   class="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                                                   ${this.newProduct.limitedPerStudent ? 'checked' : ''}
                                                   onchange="app.modules.productManagement.updateNewProductField('limitedPerStudent', this.checked)">
                                            <span class="text-sm font-medium text-gray-700">Limit purchase per student</span>
                                        </label>
                                        ${this.newProduct.limitedPerStudent ? `
                                            <div class="mt-2">
                                                <label class="block text-sm font-medium text-gray-700 mb-1">Max Quantity per Student</label>
                                                <input type="number" 
                                                       min="1"
                                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                                       value="${this.newProduct.maxQuantityPerStudent}"
                                                       oninput="app.modules.productManagement.updateNewProductField('maxQuantityPerStudent', this.value)">
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                                
                                <!-- Right Column: Images & Who Can Buy -->
                                <div class="space-y-4">
                                    <!-- Image Upload -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Product Images *</label>
                                        <div class="image-upload-container border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-burgundy transition-colors cursor-pointer"
                                             onclick="document.getElementById('product-images-input').click()">
                                            <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                                            <p class="text-gray-600 font-medium">Click to upload product images</p>
                                            <p class="text-gray-400 text-sm mt-1">Supports JPG, PNG up to 5MB</p>
                                            <input type="file" 
                                                   id="product-images-input"
                                                   class="hidden"
                                                   multiple
                                                   accept="image/*"
                                                   onchange="app.modules.productManagement.handleImageUpload(this.files)">
                                        </div>
                                        ${this.newProduct.images.length > 0 ? `
                                            <div class="mt-4">
                                                <p class="text-sm text-gray-600 mb-2">Uploaded Images:</p>
                                                <div class="grid grid-cols-3 gap-2">
                                                    ${this.newProduct.images.map((img, index) => `
                                                        <div class="relative group">
                                                            <img src="${img}" class="w-full h-24 object-cover rounded border">
                                                            ${index === 0 ? `
                                                                <span class="absolute bottom-1 left-1 bg-burgundy text-white text-xs px-1 rounded">Main</span>
                                                            ` : ''}
                                                            <button class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    onclick="app.modules.productManagement.removeImage(${index})">
                                                                <i class="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            </div>
                                        ` : ''}
                                    </div>
                                    
                                    <!-- Who Can Buy -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Who Can Buy *</label>
                                        <div class="space-y-3">
                                            <!-- All Departments -->
                                            <label class="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <input type="radio" 
                                                       name="allowedBuyers" 
                                                       value="all_departments"
                                                       class="mt-1 text-burgundy focus:ring-burgundy"
                                                       ${this.newProduct.allowedBuyers.type === 'all_departments' ? 'checked' : ''}
                                                       onchange="app.modules.productManagement.updateAllowedBuyers('type', 'all_departments')">
                                                <div class="flex-1">
                                                    <span class="font-medium text-gray-900">All Departments</span>
                                                    <p class="text-sm text-gray-500 mt-1">Available to all students from any department</p>
                                                </div>
                                            </label>
                                            
                                            <!-- By Department -->
                                            <label class="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <input type="radio" 
                                                       name="allowedBuyers" 
                                                       value="by_department"
                                                       class="mt-1 text-burgundy focus:ring-burgundy"
                                                       ${this.newProduct.allowedBuyers.type === 'by_department' ? 'checked' : ''}
                                                       onchange="app.modules.productManagement.updateAllowedBuyers('type', 'by_department')">
                                                <div class="flex-1">
                                                    <span class="font-medium text-gray-900">By Department & Course</span>
                                                    <p class="text-sm text-gray-500 mt-1">Select specific departments and courses</p>
                                                    
                                                    ${this.newProduct.allowedBuyers.type === 'by_department' ? `
                                                        <div class="mt-2 space-y-2">
                                                            <select class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                                    onchange="app.modules.productManagement.handleDepartmentSelect(this.value)">
                                                                <option value="">Select Department</option>
                                                                ${this.departments.map(dept => `
                                                                    <option value="${dept.id}" ${selectedDeptId === dept.id ? 'selected' : ''}>${dept.name}</option>
                                                                `).join('')}
                                                            </select>
                                                            
                                                            ${selectedDeptId ? `
                                                                <div>
                                                                    <p class="text-sm font-medium text-gray-700 mb-1">Select Courses:</p>
                                                                    <div class="space-y-1">
                                                                        ${this.getDepartmentCourses(selectedDeptId).map(course => `
                                                                            <label class="flex items-center space-x-2">
                                                                                <input type="checkbox" 
                                                                                       value="${course}"
                                                                                       class="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                                                                                       ${selectedCourses.includes(course) ? 'checked' : ''}
                                                                                       onchange="app.modules.productManagement.handleCourseSelect('${course}', this.checked)">
                                                                                <span class="text-sm">${course}</span>
                                                                            </label>
                                                                        `).join('')}
                                                                    </div>
                                                                </div>
                                                            ` : ''}
                                                        </div>
                                                    ` : ''}
                                                </div>
                                            </label>
                                            
                                            <!-- Alumni Only -->
                                            <label class="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <input type="radio" 
                                                       name="allowedBuyers" 
                                                       value="alumni"
                                                       class="mt-1 text-burgundy focus:ring-burgundy"
                                                       ${this.newProduct.allowedBuyers.type === 'alumni' ? 'checked' : ''}
                                                       onchange="app.modules.productManagement.updateAllowedBuyers('type', 'alumni')">
                                                <div class="flex-1">
                                                    <span class="font-medium text-gray-900">Alumni Only</span>
                                                    <p class="text-sm text-gray-500 mt-1">Available only to alumni members</p>
                                                </div>
                                            </label>
                                            
                                            <!-- Faculty Only -->
                                            <label class="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <input type="radio" 
                                                       name="allowedBuyers" 
                                                       value="faculty"
                                                       class="mt-1 text-burgundy focus:ring-burgundy"
                                                       ${this.newProduct.allowedBuyers.type === 'faculty' ? 'checked' : ''}
                                                       onchange="app.modules.productManagement.updateAllowedBuyers('type', 'faculty')">
                                                <div class="flex-1">
                                                    <span class="font-medium text-gray-900">Faculty Only</span>
                                                    <p class="text-sm text-gray-500 mt-1">Available only to faculty members</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Form Actions -->
                            <div class="flex justify-end gap-3 pt-6 border-t mt-6">
                                <button type="button"
                                        class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                        onclick="app.modules.productManagement.closeAddProductDialog()">
                                    Cancel
                                </button>
                                <button type="submit"
                                        class="px-6 py-2 bg-burgundy text-white rounded-md hover:bg-burgundy/90 transition-colors shadow-sm">
                                    Add Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    renderViewProductDialog() {
        if (!this.selectedProduct) return '';
        const product = this.selectedProduct;
        
        // Get buyer restrictions text
        let buyerText = '';
        if (product.allowedBuyers) {
            switch(product.allowedBuyers.type) {
                case 'all_departments':
                    buyerText = 'Available to all departments';
                    break;
                case 'by_department':
                    buyerText = `Available to ${product.allowedBuyers.departments?.join(', ')} departments`;
                    if (product.allowedBuyers.courses?.length > 0) {
                        buyerText += ` (Courses: ${product.allowedBuyers.courses.join(', ')})`;
                    }
                    break;
                case 'alumni':
                    buyerText = 'Available to alumni only';
                    break;
                case 'faculty':
                    buyerText = 'Available to faculty only';
                    break;
                default:
                    buyerText = 'Available to all users';
            }
        }

        return `
            <div class="dialog-overlay">
                <div class="dialog-content max-w-5xl">
                    <div class="dialog-header">
                        <h2>${product.name}</h2>
                        <p>Product Details</p>
                        <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                                onclick="app.modules.productManagement.closeViewProductDialog()">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div class="dialog-body">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <!-- Product Images Gallery -->
                            <div>
                                <div class="mb-4">
                                    <div class="relative">
                                        <img src="${product.image}" 
                                             alt="${product.name}" 
                                             class="w-full h-64 object-cover rounded-lg shadow-sm"
                                             id="main-product-image">
                                        ${product.images && product.images.length > 1 ? `
                                            <div class="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                                1/${product.images.length}
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                                
                                <!-- Thumbnail Gallery -->
                                ${product.images && product.images.length > 1 ? `
                                    <div class="grid grid-cols-4 gap-2">
                                        ${product.images.map((img, index) => `
                                            <img src="${img}" 
                                                 class="w-full h-20 object-cover rounded border cursor-pointer hover:border-burgundy transition-colors ${index === 0 ? 'border-2 border-burgundy' : 'border-gray-200'}"
                                                 onclick="app.modules.productManagement.changeMainImage('${img}', ${index})">
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                            
                            <!-- Product Details -->
                            <div class="space-y-6">
                                <div>
                                    <h3 class="text-2xl font-bold text-burgundy mb-2">₱${product.price.toFixed(2)}</h3>
                                    <div class="flex items-center gap-2 flex-wrap mb-4">
                                        <span class="badge badge-outline">${product.category}</span>
                                        ${product.isPreOrder ? `
                                            <span class="badge badge-warning">Pre-Order</span>
                                        ` : `
                                            <span class="badge ${product.stock > 0 ? 'badge-primary' : 'badge-destructive'}">
                                                ${product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                                            </span>
                                        `}
                                        ${product.limitedPerStudent ? `
                                            <span class="badge badge-limited">Limited: ${product.maxQuantityPerStudent} per student</span>
                                        ` : ''}
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 class="text-sm font-medium text-gray-700 mb-1">Description</h4>
                                    <p class="text-gray-600">${product.description}</p>
                                </div>
                                
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 class="text-sm font-medium text-gray-700 mb-1">Status</h4>
                                        <p class="text-gray-600">${product.stock > 0 ? 'Available' : 'Out of Stock'}</p>
                                    </div>
                                    <div>
                                        <h4 class="text-sm font-medium text-gray-700 mb-1">Purchase Limit</h4>
                                        <p class="text-gray-600">${product.limitedPerStudent ? `${product.maxQuantityPerStudent} per student` : 'No limit'}</p>
                                    </div>
                                    <div>
                                        <h4 class="text-sm font-medium text-gray-700 mb-1">Availability</h4>
                                        <p class="text-gray-600">${buyerText}</p>
                                    </div>
                                </div>
                                
                                ${product.isPreOrder ? `
                                    <div>
                                        <h4 class="text-sm font-medium text-gray-700 mb-1">Pre-order Release Date</h4>
                                        <p class="text-gray-600">${product.preOrderReleaseDate}</p>
                                    </div>
                                ` : ''}
                                
                                <div class="pt-6 border-t">
                                    <div class="flex gap-3">
                                        <button class="btn btn-outline flex-1 gap-2"
                                                onclick="app.modules.productManagement.editProduct('${product.id}')">
                                            <i class="fas fa-edit"></i>
                                            Edit Product
                                        </button>
                                        <button class="btn btn-destructive flex-1 gap-2"
                                                onclick="app.modules.productManagement.confirmDeleteProduct('${product.id}')">
                                            <i class="fas fa-trash"></i>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderEditProductDialog() {
        if (!this.selectedProduct) return '';
        const product = this.selectedProduct;
        
        const selectedDeptId = product.allowedBuyers?.departments?.[0] || '';
        const selectedCourses = product.allowedBuyers?.courses || [];
        
        return `
            <div class="dialog-overlay">
                <div class="dialog-content max-w-4xl">
                    <div class="dialog-header">
                        <h2>Edit Product</h2>
                        <p>Update product details</p>
                        <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                                onclick="app.modules.productManagement.closeEditProductDialog()">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div class="dialog-body">
                        <form onsubmit="event.preventDefault(); app.modules.productManagement.saveEditedProduct()">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <!-- Left Column: Basic Information -->
                                <div class="space-y-4">
                                    <!-- Product Name -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                        <input type="text" 
                                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                               value="${product.name}"
                                               oninput="app.modules.productManagement.updateProductField('name', this.value)"
                                               required>
                                    </div>
                                    
                                    <!-- Category and Price -->
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                            <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                                    onchange="app.modules.productManagement.updateProductField('category', this.value)">
                                                <option value="Apparel" ${product.category === 'Apparel' ? 'selected' : ''}>Apparel</option>
                                                <option value="Accessories" ${product.category === 'Accessories' ? 'selected' : ''}>Accessories</option>
                                                <option value="Custom" ${product.category === 'Custom' ? 'selected' : ''}>Custom</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Price (₱) *</label>
                                            <input type="number" 
                                                   step="0.01"
                                                   min="0"
                                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                                   value="${product.price}"
                                                   oninput="app.modules.productManagement.updateProductField('price', this.value)"
                                                   required>
                                        </div>
                                    </div>
                                    
                                    <!-- Stock and Pre-order -->
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                                            <input type="number" 
                                                   min="0"
                                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                                   value="${product.stock}"
                                                   oninput="app.modules.productManagement.updateProductField('stock', this.value)"
                                                   required>
                                        </div>
                                        <div>
                                            <label class="flex items-center space-x-2">
                                                <input type="checkbox" 
                                                       class="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                                                       ${product.isPreOrder ? 'checked' : ''}
                                                       onchange="app.modules.productManagement.updateProductField('isPreOrder', this.checked)">
                                                <span class="text-sm font-medium text-gray-700">Pre-order Item</span>
                                            </label>
                                            ${product.isPreOrder ? `
                                                <div class="mt-2">
                                                    <label class="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
                                                    <input type="date" 
                                                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                                           value="${product.preOrderReleaseDate || ''}"
                                                           oninput="app.modules.productManagement.updateProductField('preOrderReleaseDate', this.value)">
                                                </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                    
                                    <!-- Description -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                        <textarea class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                                  rows="3"
                                                  oninput="app.modules.productManagement.updateProductField('description', this.value)">${product.description}</textarea>
                                    </div>
                                    
                                    <!-- Limited Purchase -->
                                    <div>
                                        <label class="flex items-center space-x-2">
                                            <input type="checkbox" 
                                                   class="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                                                   ${product.limitedPerStudent ? 'checked' : ''}
                                                   onchange="app.modules.productManagement.updateProductField('limitedPerStudent', this.checked)">
                                            <span class="text-sm font-medium text-gray-700">Limit purchase per student</span>
                                        </label>
                                        ${product.limitedPerStudent ? `
                                            <div class="mt-2">
                                                <label class="block text-sm font-medium text-gray-700 mb-1">Max Quantity per Student</label>
                                                <input type="number" 
                                                       min="1"
                                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                                       value="${product.maxQuantityPerStudent}"
                                                       oninput="app.modules.productManagement.updateProductField('maxQuantityPerStudent', this.value)">
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                                
                                <!-- Right Column: Who Can Buy -->
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Who Can Buy *</label>
                                        <div class="space-y-3">
                                            <!-- All Departments -->
                                            <label class="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <input type="radio" 
                                                       name="editAllowedBuyers" 
                                                       value="all_departments"
                                                       class="mt-1 text-burgundy focus:ring-burgundy"
                                                       ${product.allowedBuyers?.type === 'all_departments' ? 'checked' : ''}
                                                       onchange="app.modules.productManagement.updateProductAllowedBuyers('type', 'all_departments')">
                                                <div class="flex-1">
                                                    <span class="font-medium text-gray-900">All Departments</span>
                                                    <p class="text-sm text-gray-500 mt-1">Available to all students from any department</p>
                                                </div>
                                            </label>
                                            
                                            <!-- By Department -->
                                            <label class="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <input type="radio" 
                                                       name="editAllowedBuyers" 
                                                       value="by_department"
                                                       class="mt-1 text-burgundy focus:ring-burgundy"
                                                       ${product.allowedBuyers?.type === 'by_department' ? 'checked' : ''}
                                                       onchange="app.modules.productManagement.updateProductAllowedBuyers('type', 'by_department')">
                                                <div class="flex-1">
                                                    <span class="font-medium text-gray-900">By Department & Course</span>
                                                    <p class="text-sm text-gray-500 mt-1">Select specific departments and courses</p>
                                                    
                                                    ${product.allowedBuyers?.type === 'by_department' ? `
                                                        <div class="mt-2 space-y-2">
                                                            <select class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                                    onchange="app.modules.productManagement.handleEditDepartmentSelect(this.value)">
                                                                <option value="">Select Department</option>
                                                                ${this.departments.map(dept => `
                                                                    <option value="${dept.id}" ${selectedDeptId === dept.id ? 'selected' : ''}>${dept.name}</option>
                                                                `).join('')}
                                                            </select>
                                                            
                                                            ${selectedDeptId ? `
                                                                <div>
                                                                    <p class="text-sm font-medium text-gray-700 mb-1">Select Courses:</p>
                                                                    <div class="space-y-1">
                                                                        ${this.getDepartmentCourses(selectedDeptId).map(course => `
                                                                            <label class="flex items-center space-x-2">
                                                                                <input type="checkbox" 
                                                                                       value="${course}"
                                                                                       class="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                                                                                       ${selectedCourses.includes(course) ? 'checked' : ''}
                                                                                       onchange="app.modules.productManagement.handleEditCourseSelect('${course}', this.checked)">
                                                                                <span class="text-sm">${course}</span>
                                                                            </label>
                                                                        `).join('')}
                                                                    </div>
                                                                </div>
                                                            ` : ''}
                                                        </div>
                                                    ` : ''}
                                                </div>
                                            </label>
                                            
                                            <!-- Alumni Only -->
                                            <label class="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <input type="radio" 
                                                       name="editAllowedBuyers" 
                                                       value="alumni"
                                                       class="mt-1 text-burgundy focus:ring-burgundy"
                                                       ${product.allowedBuyers?.type === 'alumni' ? 'checked' : ''}
                                                       onchange="app.modules.productManagement.updateProductAllowedBuyers('type', 'alumni')">
                                                <div class="flex-1">
                                                    <span class="font-medium text-gray-900">Alumni Only</span>
                                                    <p class="text-sm text-gray-500 mt-1">Available only to alumni members</p>
                                                </div>
                                            </label>
                                            
                                            <!-- Faculty Only -->
                                            <label class="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <input type="radio" 
                                                       name="editAllowedBuyers" 
                                                       value="faculty"
                                                       class="mt-1 text-burgundy focus:ring-burgundy"
                                                       ${product.allowedBuyers?.type === 'faculty' ? 'checked' : ''}
                                                       onchange="app.modules.productManagement.updateProductAllowedBuyers('type', 'faculty')">
                                                <div class="flex-1">
                                                    <span class="font-medium text-gray-900">Faculty Only</span>
                                                    <p class="text-sm text-gray-500 mt-1">Available only to faculty members</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Form Actions -->
                            <div class="flex justify-end gap-3 pt-6 border-t mt-6">
                                <button type="button"
                                        class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                        onclick="app.modules.productManagement.closeEditProductDialog()">
                                    Cancel
                                </button>
                                <button type="submit"
                                        class="px-6 py-2 bg-burgundy text-white rounded-md hover:bg-burgundy/90 transition-colors shadow-sm">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    renderPaymentSettingsDialog() {
        return `
            <div class="dialog-overlay">
                <div class="dialog-content max-w-3xl" style="height: 85vh; display: flex; flex-direction: column;">
                    <div class="dialog-header" style="flex-shrink: 0;">
                        <h2>Payment Settings</h2>
                        <p>Manage payment methods for customers</p>
                        <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                                onclick="app.modules.productManagement.closePaymentSettingsDialog()">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div class="dialog-body" style="flex: 1; overflow-y: auto; padding: 1.5rem;">
                        <div class="space-y-6">
                            <!-- Current Payment Methods -->
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                                <div class="space-y-4" id="payment-methods-list">
                                    ${this.paymentSettings.methods.map(method => `
                                        <div class="payment-method-card border border-gray-200 rounded-lg p-4 hover:border-burgundy transition-colors">
                                            <div class="flex items-center justify-between mb-3">
                                                <div class="flex items-center gap-3">
                                                    <div class="w-10 h-10 rounded-lg ${method.name.includes('GCash') ? 'bg-green-100' : method.name.includes('BPI') ? 'bg-blue-100' : 'bg-yellow-100'} flex items-center justify-center">
                                                        <i class="fas ${method.name.includes('GCash') ? 'fa-mobile-alt text-green-600' : method.name.includes('BPI') ? 'fa-university text-blue-600' : 'fa-money-bill-wave text-yellow-600'}"></i>
                                                    </div>
                                                    <div>
                                                        <h4 class="font-semibold text-gray-900">${method.name}</h4>
                                                        <p class="text-sm text-gray-500">${method.instructions}</p>
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-3">
                                                    <label class="switch">
                                                        <input type="checkbox" 
                                                               ${method.enabled ? 'checked' : ''}
                                                               onchange="app.modules.productManagement.togglePaymentMethod('${method.id}', this.checked)">
                                                        <span class="slider"></span>
                                                    </label>
                                                    <button class="text-red-600 hover:text-red-800"
                                                            onclick="app.modules.productManagement.removePaymentMethod('${method.id}')">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            ${method.accountNumber ? `
                                                <div class="bg-gray-50 rounded p-3">
                                                    <div class="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <p class="text-xs text-gray-500">Account Number</p>
                                                            <p class="font-medium">${method.accountNumber}</p>
                                                        </div>
                                                        <div>
                                                            <p class="text-xs text-gray-500">Account Name</p>
                                                            <p class="font-medium">${method.accountName}</p>
                                                        </div>
                                                    </div>
                                                    ${method.qrCode ? `
                                                        <div class="mt-3">
                                                            <p class="text-xs text-gray-500 mb-2">QR Code</p>
                                                            <div class="flex items-center gap-3">
                                                                <img src="${method.qrCode}" class="w-24 h-24 border rounded">
                                                                <button class="text-red-600 text-sm"
                                                                        onclick="app.modules.productManagement.removeQrCode('${method.id}')">
                                                                    Remove QR
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ` : `
                                                        <div class="mt-3">
                                                            <label class="upload-qr-label">
                                                                <div class="upload-qr-box cursor-pointer">
                                                                    <i class="fas fa-upload text-gray-400 mb-1"></i>
                                                                    <span class="text-sm">Upload QR Code</span>
                                                                    <input type="file" 
                                                                           class="hidden"
                                                                           accept="image/*"
                                                                           onchange="app.modules.productManagement.uploadMethodQrCode('${method.id}', this.files)">
                                                                </div>
                                                            </label>
                                                        </div>
                                                    `}
                                                </div>
                                            ` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <!-- Add New Payment Method -->
                            <div class="border-t pt-6">
                                <h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Payment Method</h3>
                                <div class="space-y-4">
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Method Name *</label>
                                            <input type="text" 
                                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                                   placeholder="e.g., PayMaya, BDO"
                                                   value="${this.newPaymentMethod.name}"
                                                   oninput="app.modules.productManagement.updateNewPaymentField('name', this.value)">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                                            <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                                    onchange="app.modules.productManagement.updateNewPaymentField('type', this.value)">
                                                <option value="digital_wallet">Digital Wallet</option>
                                                <option value="bank_transfer">Bank Transfer</option>
                                                <option value="cash">Cash</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    ${this.newPaymentMethod.type !== 'cash' ? `
                                        <div class="grid grid-cols-2 gap-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                                                <input type="text" 
                                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                                       placeholder="e.g., 09123456789"
                                                       value="${this.newPaymentMethod.accountNumber}"
                                                       oninput="app.modules.productManagement.updateNewPaymentField('accountNumber', this.value)">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                                                <input type="text" 
                                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                                       placeholder="e.g., Campus Merch Hub"
                                                       value="${this.newPaymentMethod.accountName}"
                                                       oninput="app.modules.productManagement.updateNewPaymentField('accountName', this.value)">
                                            </div>
                                        </div>
                                    ` : ''}
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Instructions *</label>
                                        <textarea class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
                                                  rows="2"
                                                  placeholder="Payment instructions for customers"
                                                  oninput="app.modules.productManagement.updateNewPaymentField('instructions', this.value)">${this.newPaymentMethod.instructions}</textarea>
                                    </div>
                                    
                                    <div class="flex justify-end">
                                        <button class="px-4 py-2 bg-burgundy text-white rounded-md hover:bg-burgundy/90 transition-colors"
                                                onclick="app.modules.productManagement.addPaymentMethod()">
                                            Add Payment Method
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Dialog Actions -->
                    <div class="border-t p-4 flex justify-end gap-3" style="flex-shrink: 0;">
                        <button class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                onclick="app.modules.productManagement.closePaymentSettingsDialog()">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderDeleteConfirmDialog() {
        if (!this.selectedProduct) return '';
        const product = this.selectedProduct;
        
        return `
            <div class="dialog-overlay">
                <div class="dialog-content max-w-md">
                    <div class="dialog-header">
                        <h2>Delete Product</h2>
                        <p>Are you sure you want to delete this product?</p>
                        <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                                onclick="app.modules.productManagement.closeDeleteConfirmDialog()">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div class="dialog-body">
                        <div class="text-center p-4">
                            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">${product.name}</h3>
                            <p class="text-gray-600 mb-4">This action cannot be undone. All product data will be permanently deleted.</p>
                            
                            <div class="flex justify-center gap-3">
                                <button class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        onclick="app.modules.productManagement.closeDeleteConfirmDialog()">
                                    Cancel
                                </button>
                                <button class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        onclick="app.modules.productManagement.deleteProduct()">
                                    Delete Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== HELPER METHODS =====
    
    getDepartmentCourses(deptId) {
        const dept = this.departments.find(d => d.id === deptId);
        return dept ? dept.courses : [];
    }

    // ===== EVENT HANDLERS =====
    
    handleSearch(value) {
        this.searchTerm = value;
        this.app.render();
    }

    handleCategoryFilter(value) {
        this.categoryFilter = value;
        this.app.render();
    }

    // Product CRUD Operations
    openAddProductDialog() {
        this.showAddProductDialog = true;
        this.newProduct = {
            name: '',
            category: 'Apparel',
            price: 0,
            stock: 0,
            description: '',
            images: [],
            image: '',
            limitedPerStudent: false,
            maxQuantityPerStudent: 2,
            isPreOrder: false,
            preOrderReleaseDate: '',
            allowedBuyers: {
                type: 'all_departments',
                departments: [],
                courses: [],
                includeAlumni: true,
                includeFaculty: true
            }
        };
        this.app.render();
    }

    closeAddProductDialog() {
        this.showAddProductDialog = false;
        this.app.render();
    }

    updateNewProductField(field, value) {
        this.newProduct[field] = value;
        this.app.render();
    }

    updateAllowedBuyers(field, value) {
        if (field === 'type') {
            this.newProduct.allowedBuyers.type = value;
            if (value === 'by_department') {
                this.newProduct.allowedBuyers.departments = [];
                this.newProduct.allowedBuyers.courses = [];
            }
        }
        this.app.render();
    }

    handleDepartmentSelect(deptId) {
        if (deptId && !this.newProduct.allowedBuyers.departments.includes(deptId)) {
            this.newProduct.allowedBuyers.departments = [deptId];
            this.newProduct.allowedBuyers.courses = [];
        }
        this.app.render();
    }

    handleCourseSelect(course, checked) {
        if (checked) {
            this.newProduct.allowedBuyers.courses.push(course);
        } else {
            const index = this.newProduct.allowedBuyers.courses.indexOf(course);
            if (index > -1) {
                this.newProduct.allowedBuyers.courses.splice(index, 1);
            }
        }
        this.app.render();
    }

    handleImageUpload(files) {
        // Simulate image upload - in real app, upload to server
        for (let i = 0; i < Math.min(files.length, 10); i++) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.newProduct.images.push(e.target.result);
                if (!this.newProduct.image) {
                    this.newProduct.image = e.target.result;
                }
                this.app.render();
            };
            reader.readAsDataURL(files[i]);
        }
    }

    removeImage(index) {
        this.newProduct.images.splice(index, 1);
        if (index === 0 && this.newProduct.images.length > 0) {
            this.newProduct.image = this.newProduct.images[0];
        }
        this.app.render();
    }

    saveNewProduct() {
        // Validate required fields
        if (!this.newProduct.name || !this.newProduct.price || !this.newProduct.stock || !this.newProduct.description) {
            alert('Please fill in all required fields');
            return;
        }
        
        if (this.newProduct.images.length === 0) {
            alert('Please upload at least one product image');
            return;
        }

        // Add new product to the list
        const newProduct = {
            ...this.newProduct,
            id: 'PROD' + Date.now(),
            price: parseFloat(this.newProduct.price),
            stock: parseInt(this.newProduct.stock),
            images: [...this.newProduct.images]
        };
        
        this.products.push(newProduct);
        this.showAddProductDialog = false;
        this.showToast('Product added successfully!', 'success');
        this.app.render();
    }

    viewProduct(productId) {
        this.selectedProduct = this.products.find(p => p.id === productId);
        this.showViewProductDialog = true;
        this.app.render();
    }

    closeViewProductDialog() {
        this.showViewProductDialog = false;
        this.selectedProduct = null;
        this.app.render();
    }

    changeMainImage(imgUrl, index) {
        if (this.selectedProduct) {
            // Move the selected image to first position
            const images = [...this.selectedProduct.images];
            images.splice(index, 1);
            images.unshift(imgUrl);
            this.selectedProduct.images = images;
            this.selectedProduct.image = imgUrl;
            this.app.render();
        }
    }

    editProduct(productId) {
        this.selectedProduct = this.products.find(p => p.id === productId);
        if (!this.selectedProduct.allowedBuyers) {
            this.selectedProduct.allowedBuyers = {
                type: 'all_departments',
                departments: [],
                courses: [],
                includeAlumni: true,
                includeFaculty: true
            };
        }
        this.showViewProductDialog = false;
        this.showEditProductDialog = true;
        this.app.render();
    }

    closeEditProductDialog() {
        this.showEditProductDialog = false;
        this.selectedProduct = null;
        this.app.render();
    }

    updateProductField(field, value) {
        if (this.selectedProduct) {
            this.selectedProduct[field] = value;
            this.app.render();
        }
    }

    updateProductAllowedBuyers(field, value) {
        if (this.selectedProduct) {
            if (!this.selectedProduct.allowedBuyers) {
                this.selectedProduct.allowedBuyers = {
                    type: 'all_departments',
                    departments: [],
                    courses: [],
                    includeAlumni: true,
                    includeFaculty: true
                };
            }
            
            if (field === 'type') {
                this.selectedProduct.allowedBuyers.type = value;
                if (value === 'by_department') {
                    this.selectedProduct.allowedBuyers.departments = [];
                    this.selectedProduct.allowedBuyers.courses = [];
                }
            }
            this.app.render();
        }
    }

    handleEditDepartmentSelect(deptId) {
        if (this.selectedProduct && this.selectedProduct.allowedBuyers) {
            if (deptId && !this.selectedProduct.allowedBuyers.departments.includes(deptId)) {
                this.selectedProduct.allowedBuyers.departments = [deptId];
                this.selectedProduct.allowedBuyers.courses = [];
            }
            this.app.render();
        }
    }

    handleEditCourseSelect(course, checked) {
        if (this.selectedProduct && this.selectedProduct.allowedBuyers) {
            if (checked) {
                this.selectedProduct.allowedBuyers.courses.push(course);
            } else {
                const index = this.selectedProduct.allowedBuyers.courses.indexOf(course);
                if (index > -1) {
                    this.selectedProduct.allowedBuyers.courses.splice(index, 1);
                }
            }
            this.app.render();
        }
    }

    saveEditedProduct() {
        // Validate required fields
        if (!this.selectedProduct.name || !this.selectedProduct.price || !this.selectedProduct.stock || !this.selectedProduct.description) {
            alert('Please fill in all required fields');
            return;
        }

        // Update product in the list
        const index = this.products.findIndex(p => p.id === this.selectedProduct.id);
        if (index !== -1) {
            this.products[index] = { ...this.selectedProduct };
            this.showEditProductDialog = false;
            this.selectedProduct = null;
            this.showToast('Product updated successfully!', 'success');
            this.app.render();
        }
    }

    confirmDeleteProduct(productId) {
        this.selectedProduct = this.products.find(p => p.id === productId);
        this.showDeleteConfirmDialog = true;
        this.app.render();
    }

    closeDeleteConfirmDialog() {
        this.showDeleteConfirmDialog = false;
        this.selectedProduct = null;
        this.app.render();
    }

    deleteProduct() {
        const index = this.products.findIndex(p => p.id === this.selectedProduct.id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.showDeleteConfirmDialog = false;
            this.selectedProduct = null;
            this.showToast('Product deleted successfully!', 'success');
            this.app.render();
        }
    }

    // Payment Settings
    openPaymentSettings() {
        this.showPaymentSettingsDialog = true;
        this.newPaymentMethod = {
            name: '',
            type: 'digital_wallet',
            accountNumber: '',
            accountName: '',
            instructions: ''
        };
        this.app.render();
    }

    closePaymentSettingsDialog() {
        this.showPaymentSettingsDialog = false;
        this.app.render();
    }

    updateNewPaymentField(field, value) {
        this.newPaymentMethod[field] = value;
        this.app.render();
    }

    addPaymentMethod() {
        if (!this.newPaymentMethod.name || !this.newPaymentMethod.instructions) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        const newMethod = {
            ...this.newPaymentMethod,
            id: 'PM' + Date.now(),
            enabled: true,
            qrCode: ''
        };

        this.paymentSettings.methods.push(newMethod);
        
        // Reset form
        this.newPaymentMethod = {
            name: '',
            type: 'digital_wallet',
            accountNumber: '',
            accountName: '',
            instructions: ''
        };
        
        this.showToast('Payment method added successfully!', 'success');
        this.app.render();
    }

    togglePaymentMethod(methodId, enabled) {
        const method = this.paymentSettings.methods.find(m => m.id === methodId);
        if (method) {
            method.enabled = enabled;
            this.app.render();
        }
    }

    removePaymentMethod(methodId) {
        if (confirm('Are you sure you want to remove this payment method?')) {
            const index = this.paymentSettings.methods.findIndex(m => m.id === methodId);
            if (index !== -1) {
                this.paymentSettings.methods.splice(index, 1);
                this.showToast('Payment method removed!', 'success');
                this.app.render();
            }
        }
    }

    uploadMethodQrCode(methodId, files) {
        if (files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const method = this.paymentSettings.methods.find(m => m.id === methodId);
                if (method) {
                    method.qrCode = e.target.result;
                    this.showToast('QR code uploaded!', 'success');
                    this.app.render();
                }
            };
            reader.readAsDataURL(files[0]);
        }
    }

    removeQrCode(methodId) {
        const method = this.paymentSettings.methods.find(m => m.id === methodId);
        if (method) {
            method.qrCode = '';
            this.showToast('QR code removed!', 'success');
            this.app.render();
        }
    }

    // Export functionality
    exportProducts() {
        // Simulate export functionality
        const csvContent = this.products.map(product => 
            `${product.id},${product.name},${product.category},₱${product.price},${product.stock},${product.isPreOrder ? 'Pre-order' : 'Available'}`
        ).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `products_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showToast('Products exported successfully!', 'success');
    }

    // Toast notification
    showToast(message, type = 'success') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg animate-slide-in`;
        toast.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// ============================================
// ORDER MANAGEMENT MODULE
// ============================================

class OrderManagement {
    constructor(app) {
        this.app = app;
        this.orders = [...mockData.orders];
        this.searchTerm = '';
        this.statusFilter = 'all';
        this.departmentFilter = 'all';
        this.viewMode = 'categorized';
    }

    render() {
        const filteredOrders = this.orders.filter(order => {
            const matchesSearch = 
                order.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                order.userName.toLowerCase().includes(this.searchTerm.toLowerCase());
            
            const matchesStatus = this.statusFilter === 'all' || order.status === this.statusFilter;
            
            const matchesDepartment = this.departmentFilter === 'all' || order.department === this.departmentFilter;
            
            return matchesSearch && matchesStatus && matchesDepartment;
        });

        return `
            <div class="order-management p-4 lg:p-6 space-y-6 pb-20 bg-gray-50 min-h-screen">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div>
                        <h2 class="text-2xl font-semibold">Order Management</h2>
                        <p class="text-sm text-gray-600">Track and manage customer orders</p>
                    </div>
                    <div class="flex gap-2 items-center">
                        <!-- View Mode Selector -->
                        <select class="select w-44" onchange="app.modules.orderManagement.handleViewModeChange(this.value)">
                            <option value="categorized" ${this.viewMode === 'categorized' ? 'selected' : ''}>Categorized View</option>
                            <option value="table" ${this.viewMode === 'table' ? 'selected' : ''}>Table View</option>
                        </select>
                        
                        <!-- Export Report Button -->
                        <button class="btn btn-primary gap-2 export-report-btn">
                            <i class="fas fa-download"></i>
                            Export Report
                        </button>
                    </div>
                </div>

                <!-- Filters -->
                <div class="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                    <div class="relative flex-1 w-full">
                        <i class="fas fa-search absolute left-3 top-2.5 h-4 w-4 text-gray-400"></i>
                        <input type="text" placeholder="Search by Order ID or Customer..." 
                               class="input pl-9 order-search-input"
                               value="${this.searchTerm}"
                               oninput="app.modules.orderManagement.handleSearch(this.value)">
                    </div>
                    
                    <!-- Status Filter -->
                    <select class="select w-40" onchange="app.modules.orderManagement.handleStatusFilter(this.value)">
                        <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>All Status</option>
                        <option value="pending" ${this.statusFilter === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${this.statusFilter === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="completed" ${this.statusFilter === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                    
                    <!-- Department Filter -->
                    <select class="select w-48" onchange="app.modules.orderManagement.handleDepartmentFilter(this.value)">
                        <option value="all" ${this.departmentFilter === 'all' ? 'selected' : ''}>All Departments</option>
                        <option value="CAS" ${this.departmentFilter === 'CAS' ? 'selected' : ''}>College of Arts & Sciences</option>
                        <option value="CBA" ${this.departmentFilter === 'CBA' ? 'selected' : ''}>College of Business Admin</option>
                        <option value="CCS" ${this.departmentFilter === 'CCS' ? 'selected' : ''}>College of Computer Studies</option>
                    </select>
                </div>

                <!-- Content Area -->
                <div class="space-y-4">
                    ${this.viewMode === 'categorized' ? 
                        this.renderCategorizedView(filteredOrders) : 
                        this.renderTableView(filteredOrders)
                    }
                </div>
            </div>
        `;
    }

    renderCategorizedView(orders) {
        const events = [...new Set(orders.map(order => order.event || 'General Event'))];
        
        return events.map(event => {
            const eventOrders = orders.filter(order => (order.event || 'General Event') === event);
            
            return `
                <div class="event-card border border-gray-200 rounded-lg overflow-hidden">
                    <div class="p-4 bg-gray-50 border-b">
                        <h3 class="event-name text-lg font-semibold">${event}</h3>
                        <div class="event-stats text-sm text-gray-600 mt-1">
                            <span>Total: <span class="font-medium text-gray-800">${eventOrders.length}</span></span>
                        </div>
                    </div>
                    <div class="p-4">
                        <table class="table w-full">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Department</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${eventOrders.map(order => `
                                    <tr>
                                        <td>${order.id}</td>
                                        <td>${order.userName}</td>
                                        <td>${order.department}</td>
                                        <td>₱${order.total.toFixed(2)}</td>
                                        <td>
                                            <span class="badge ${order.status === 'completed' ? 'badge-primary' : 
                                                               order.status === 'processing' ? 'badge-secondary' : 
                                                               'badge-outline'}">
                                                ${order.status}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderTableView(orders) {
        return `
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${orders.map(order => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.id}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.userName}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.department}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₱${order.total.toFixed(2)}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="badge ${order.status === 'completed' ? 'badge-primary' : 
                                                       order.status === 'processing' ? 'badge-secondary' : 
                                                       'badge-outline'}">
                                        ${order.status}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    handleSearch(value) {
        this.searchTerm = value;
        this.app.render();
    }

    handleStatusFilter(value) {
        this.statusFilter = value;
        this.app.render();
    }

    handleDepartmentFilter(value) {
        this.departmentFilter = value;
        this.app.render();
    }

    handleViewModeChange(value) {
        this.viewMode = value;
        this.app.render();
    }
}

// ============================================
// DEPARTMENTS MODULE (Simplified)
// ============================================

class Departments {
    constructor(app) {
        this.app = app;
        this.searchTerm = '';
        this.selectedRole = 'all';
        this.expandedDepartments = new Set();
    }

    render() {
        const mockUsers = [
            { id: 'U001', name: 'John Martinez', role: 'student', department: 'College of Engineering', course: 'Computer Engineering' },
            { id: 'U002', name: 'Sarah Chen', role: 'student', department: 'College of Engineering', course: 'Electrical Engineering' },
            { id: 'U005', name: 'Prof. Emily Garcia', role: 'faculty', department: 'College of Engineering' },
            { id: 'U006', name: 'Lisa Tan', role: 'student', department: 'College of Business Administration', course: 'Business Management' },
        ];

        const filteredUsers = mockUsers.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesRole = this.selectedRole === 'all' || user.role === this.selectedRole;
            return matchesSearch && matchesRole;
        });

        const departmentsData = [
            { name: 'College of Engineering', courses: ['Computer Engineering', 'Electrical Engineering'] },
            { name: 'College of Business Administration', courses: ['Business Management', 'Accounting'] }
        ];

        return `
            <div class="departments-container p-4 lg:p-6 space-y-6">
                <!-- Header -->
                <div class="flex items-center gap-4">
                    <div class="flex-1">
                        <h2 class="text-2xl font-bold text-gray-900">Departments & Users</h2>
                        <p class="text-gray-600">Manage users across all departments</p>
                    </div>
                    <button class="btn btn-primary gap-2 add-department-btn">
                        <i class="fas fa-plus"></i>
                        <span class="hidden sm:inline">Add Department</span>
                    </button>
                </div>

                <!-- Filters -->
                <div class="flex flex-col lg:flex-row gap-4">
                    <div class="flex-1">
                        <div class="relative">
                            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input type="text" 
                                   placeholder="Search users..." 
                                   value="${this.searchTerm}"
                                   oninput="app.modules.departments.handleSearch(this.value)"
                                   class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button class="filter-btn ${this.selectedRole === 'all' ? 'active' : ''}" 
                                onclick="app.modules.departments.setRoleFilter('all')">
                            All
                        </button>
                        <button class="filter-btn ${this.selectedRole === 'student' ? 'active' : ''}" 
                                onclick="app.modules.departments.setRoleFilter('student')">
                            Students
                        </button>
                        <button class="filter-btn ${this.selectedRole === 'faculty' ? 'active' : ''}" 
                                onclick="app.modules.departments.setRoleFilter('faculty')">
                            Faculty
                        </button>
                    </div>
                </div>

                <!-- Departments List -->
                <div class="space-y-4">
                    ${departmentsData.map(dept => {
                        const deptUsers = filteredUsers.filter(u => u.department === dept.name);
                        const isExpanded = this.expandedDepartments.has(dept.name);
                        
                        return `
                            <div class="department-card">
                                <div class="department-header ${isExpanded ? 'active' : ''}" 
                                     onclick="app.modules.departments.toggleDepartment('${dept.name}')">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-4">
                                            <div class="department-logo bg-gray-100 flex items-center justify-center">
                                                <i class="fas fa-university text-gray-400"></i>
                                            </div>
                                            <div>
                                                <h3 class="department-name">${dept.name}</h3>
                                                <p class="text-sm text-gray-600">
                                                    ${deptUsers.length} ${deptUsers.length === 1 ? 'user' : 'users'}
                                                </p>
                                            </div>
                                        </div>
                                        <i class="fas fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-400"></i>
                                    </div>
                                </div>
                                
                                ${isExpanded ? `
                                    <div class="department-content">
                                        <div class="courses-card">
                                            <div class="courses-header">
                                                <i class="fas fa-book courses-icon"></i>
                                                <h4 class="courses-title">Courses/Programs Offered</h4>
                                            </div>
                                            <div>
                                                ${dept.courses.map(course => `
                                                    <span class="course-badge">
                                                        <i class="fas fa-book-open"></i>
                                                        ${course}
                                                    </span>
                                                `).join('')}
                                            </div>
                                        </div>

                                        <!-- Users List -->
                                        ${deptUsers.length === 0 ? `
                                            <div class="empty-state">
                                                <p class="text-gray-500">No users in this department</p>
                                            </div>
                                        ` : `
                                            <div class="space-y-3">
                                                ${deptUsers.map(user => {
                                                    const initials = user.name.split(' ').map(n => n[0]).join('');
                                                    const avatarClass = user.role === 'student' ? 'avatar-student' : 'avatar-faculty';
                                                    const badgeClass = user.role === 'student' ? 'badge-student' : 'badge-faculty';
                                                    
                                                    return `
                                                        <div class="user-card">
                                                            <div class="flex items-start gap-4">
                                                                <div class="user-avatar ${avatarClass}">
                                                                    ${initials}
                                                                </div>
                                                                <div class="flex-1">
                                                                    <div class="flex items-center gap-2 mb-2">
                                                                        <h4 class="font-semibold">${user.name}</h4>
                                                                        <span class="user-badge ${badgeClass}">
                                                                            ${user.role}
                                                                        </span>
                                                                    </div>
                                                                    <div class="user-details-grid">
                                                                        <div class="user-detail-item">
                                                                            <span class="font-medium">${user.course || 'Faculty'}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    `;
                                                }).join('')}
                                            </div>
                                        `}
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    handleSearch(value) {
        this.searchTerm = value;
        this.app.render();
    }

    setRoleFilter(role) {
        this.selectedRole = role;
        this.app.render();
    }

    toggleDepartment(deptName) {
        if (this.expandedDepartments.has(deptName)) {
            this.expandedDepartments.delete(deptName);
        } else {
            this.expandedDepartments.add(deptName);
        }
        this.app.render();
    }
}

// ============================================
// MERCH RELEASE MODULE (Simplified)
// ============================================

class MerchRelease {
    constructor(app) {
        this.app = app;
        this.scanMode = 'manual';
        this.manualCode = '';
        this.studentId = '';
        this.scannedOrder = null;
        this.isProcessing = false;
        this.orders = [
            {
                id: 'ORD-001',
                orderCode: 'MERCH-ORD001-2023001',
                status: 'ready-for-pickup',
                userName: 'John Doe',
                studentId: 'S024045',
                course: 'Computer Science',
                total: 40,
                items: [
                    { productName: 'Campus T-Shirt', quantity: 1, price: 25 },
                    { productName: 'Engineering Cap', quantity: 1, price: 15 }
                ]
            }
        ];
    }

    render() {
        const readyOrders = this.orders.filter(o => o.status === 'ready-for-pickup');
        
        return `
            <div class="merch-release-container p-4 lg:p-6 space-y-6">
                <!-- Header -->
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900">Merchandise Release Station</h2>
                        <p class="text-gray-600">Scan order codes to verify and release purchases</p>
                    </div>
                    <div class="flex gap-4">
                        <div class="stats-card">
                            <div class="stats-card-primary">
                                <i class="fas fa-box"></i>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">Ready for Pickup</p>
                                <p class="text-red-600 font-bold">${readyOrders.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Scanner Section -->
                    <div class="scanner-section">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold">Scan Order</h3>
                            <div class="scanner-toggle">
                                <button class="scanner-toggle-btn ${this.scanMode === 'manual' ? 'active' : ''}" 
                                        onclick="app.modules.merchRelease.setScanMode('manual')">
                                    <i class="fas fa-keyboard"></i>
                                    <span>Manual</span>
                                </button>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div class="manual-entry-area">
                                <div class="space-y-4 max-w-md mx-auto">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Enter Order Code</label>
                                        <input type="text" 
                                               id="manual-code"
                                               placeholder="MERCH-ORD001-2023001"
                                               value="${this.manualCode}"
                                               oninput="app.modules.merchRelease.updateManualCode(this.value)"
                                               class="input-field uppercase">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Enter Student ID</label>
                                        <input type="text" 
                                               id="student-id"
                                               placeholder="S024045"
                                               value="${this.studentId}"
                                               oninput="app.modules.merchRelease.updateStudentId(this.value)"
                                               class="input-field uppercase">
                                    </div>
                                    <button class="btn-scan" 
                                            onclick="app.modules.merchRelease.handleManualScan()" 
                                            ${this.isProcessing ? 'disabled' : ''}>
                                        ${this.isProcessing ? 'Scanning...' : 'Scan & Verify'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Orders Ready for Pickup -->
                    <div class="scanner-section">
                        <h3 class="text-lg font-semibold mb-4">Ready for Pickup (${readyOrders.length})</h3>
                        <div class="space-y-3">
                            ${readyOrders.map(order => `
                                <div class="order-card order-card-ready">
                                    <div class="space-y-2">
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center gap-2">
                                                <i class="fas fa-hashtag text-gray-400"></i>
                                                <span class="font-mono text-sm">${order.orderCode}</span>
                                            </div>
                                            <span class="badge badge-secondary">Ready</span>
                                        </div>
                                        <div class="separator"></div>
                                        <div class="grid grid-cols-2 gap-2 text-sm">
                                            <div class="flex items-center gap-1 text-gray-600">
                                                <i class="fas fa-user"></i>
                                                ${order.userName}
                                            </div>
                                            <div class="flex items-center gap-1 text-gray-600">
                                                <i class="fas fa-id-card"></i>
                                                ${order.studentId}
                                            </div>
                                            <div class="flex items-center gap-1 text-gray-600">
                                                <i class="fas fa-box"></i>
                                                ${order.items.length} item(s)
                                            </div>
                                            <div class="flex items-center gap-1 text-gray-600">
                                                <i class="fas fa-credit-card"></i>
                                                ₱${order.total.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Verification Dialog -->
                ${this.scannedOrder ? this.renderVerificationDialog() : ''}
            </div>
        `;
    }

    updateManualCode(value) {
        this.manualCode = value.toUpperCase();
    }

    updateStudentId(value) {
        this.studentId = value.toUpperCase();
    }

    setScanMode(mode) {
        this.scanMode = mode;
        this.app.render();
    }

    handleManualScan() {
        if (!this.manualCode.trim() || !this.studentId.trim()) {
            this.showToast('Please enter both order code and student ID', 'error');
            return;
        }

        this.isProcessing = true;
        this.app.render();

        setTimeout(() => {
            const order = this.orders.find(o => 
                o.orderCode === this.manualCode && o.status === 'ready-for-pickup'
            );
            
            if (order) {
                this.scannedOrder = order;
                this.showToast('Order found!', 'success');
            } else {
                this.showToast('Invalid order code or order not ready for pickup.', 'error');
            }
            
            this.isProcessing = false;
            this.app.render();
        }, 800);
    }

    renderVerificationDialog() {
        const order = this.scannedOrder;
        
        return `
            <div class="modal-overlay">
                <div class="modal-content verification-dialog max-w-2xl">
                    <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                        <h3 class="text-lg font-semibold">Verify Order Details</h3>
                        <button class="close-modal text-gray-500 hover:text-gray-700" 
                                onclick="app.modules.merchRelease.closeDialog()">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div class="p-6 space-y-4">
                        <div class="alert alert-success">
                            <i class="fas fa-check-circle alert-icon"></i>
                            <div>
                                <p class="text-sm"><strong>Order Found!</strong></p>
                            </div>
                        </div>

                        <div class="verification-grid">
                            <div class="verification-item">
                                <p class="text-sm text-gray-600">Order Code</p>
                                <p class="font-mono">${order.orderCode}</p>
                            </div>
                            <div class="verification-item">
                                <p class="text-sm text-gray-600">Student ID</p>
                                <p>${order.studentId}</p>
                            </div>
                        </div>

                        <div class="separator"></div>

                        <div class="space-y-3">
                            <h4 class="font-semibold">Customer Information</h4>
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div class="flex items-center gap-2">
                                    <i class="fas fa-user text-gray-400"></i>
                                    <div>
                                        <p class="text-gray-600">Name</p>
                                        <p>${order.userName}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <i class="fas fa-graduation-cap text-gray-400"></i>
                                    <div>
                                        <p class="text-gray-600">Course</p>
                                        <p>${order.course}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="separator"></div>

                        <div class="space-y-3">
                            <h4 class="font-semibold">Order Items</h4>
                            <div class="order-items-list">
                                ${order.items.map((item, index) => `
                                    <div class="order-item">
                                        <div>
                                            <p class="font-medium">${item.productName}</p>
                                            <p class="text-sm text-gray-600">
                                                Qty: ${item.quantity}
                                            </p>
                                        </div>
                                        <p class="font-semibold">₱${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button class="btn-cancel" onclick="app.modules.merchRelease.closeDialog()">
                                <i class="fas fa-times-circle"></i>
                                Cancel
                            </button>
                            <button class="btn-release" onclick="app.modules.merchRelease.releaseOrder()">
                                <i class="fas fa-check-circle"></i>
                                Release Merchandise
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    closeDialog() {
        this.scannedOrder = null;
        this.app.render();
    }

    releaseOrder() {
        this.showToast(`Order ${this.scannedOrder.id} released successfully!`, 'success');
        this.scannedOrder = null;
        this.app.render();
    }

    showToast(message, type = 'success') {
        alert(`${type === 'success' ? '✅' : '❌'} ${message}`);
    }
}

// ============================================
// COMMUNITY APPROVAL MODULE (Simplified)
// ============================================

class CommunityApproval {
    constructor(app) {
        this.app = app;
        this.currentTab = 'designs';
    }

    render() {
        return `
            <div class="p-4 lg:p-6 space-y-4 lg:space-y-6 pb-20 lg:pb-6">
                <!-- Header -->
                <div>
                    <h2 class="text-xl lg:text-3xl font-bold text-gray-900">Community & Design Approval</h2>
                    <p class="text-gray-600 text-sm lg:text-base">Review and approve student submissions</p>
                </div>

                <!-- Tabs -->
                <div class="tabs-container">
                    <div class="tabs-list grid grid-cols-3">
                        <button class="tab-trigger ${this.currentTab === 'community-vote' ? 'active' : ''}" 
                                onclick="app.modules.communityApproval.setTab('community-vote')">
                            Community Vote
                        </button>
                        <button class="tab-trigger ${this.currentTab === 'designs' ? 'active' : ''}" 
                                onclick="app.modules.communityApproval.setTab('designs')">
                            Design Submission
                        </button>
                        <button class="tab-trigger ${this.currentTab === 'announcements' ? 'active' : ''}" 
                                onclick="app.modules.communityApproval.setTab('announcements')">
                            Announcements
                        </button>
                    </div>

                    <!-- Tab Contents -->
                    <div class="tab-contents p-6">
                        ${this.currentTab === 'designs' ? this.renderDesignsTab() :
                          this.currentTab === 'announcements' ? this.renderAnnouncementsTab() :
                          this.renderCommunityVoteTab()}
                    </div>
                </div>
            </div>
        `;
    }

    setTab(tab) {
        this.currentTab = tab;
        this.app.render();
    }

    renderDesignsTab() {
        return `
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="design-card">
                        <div class="design-image-container">
                            <div class="w-full h-64 bg-gray-100 flex items-center justify-center">
                                <i class="fas fa-tshirt text-4xl text-gray-400"></i>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="text-lg font-semibold mb-2">Campus Pride T-Shirt</h3>
                            <p class="text-gray-600 text-sm mb-4">Submitted by John Doe</p>
                            <div class="flex gap-3">
                                <button class="btn btn-primary flex-1 gap-2">
                                    <i class="fas fa-check-circle"></i> Approve
                                </button>
                                <button class="btn btn-outline flex-1 gap-2 text-red-600">
                                    <i class="fas fa-times-circle"></i> Reject
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="design-card">
                        <div class="design-image-container">
                            <div class="w-full h-64 bg-gray-100 flex items-center justify-center">
                                <i class="fas fa-hoodie text-4xl text-gray-400"></i>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="text-lg font-semibold mb-2">Graduation Hoodie</h3>
                            <p class="text-gray-600 text-sm mb-4">Submitted by Jane Smith</p>
                            <div class="flex gap-3">
                                <button class="btn btn-primary flex-1 gap-2">
                                    <i class="fas fa-check-circle"></i> Approve
                                </button>
                                <button class="btn btn-outline flex-1 gap-2 text-red-600">
                                    <i class="fas fa-times-circle"></i> Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderAnnouncementsTab() {
        return `
            <div class="space-y-4">
                <div class="announcement-card announcement-medium">
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <h3 class="text-lg font-semibold">New Product Release!</h3>
                                <span class="badge badge-secondary">Medium</span>
                            </div>
                            <button class="btn btn-sm btn-destructive gap-1">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                        <p class="text-gray-700">Check out our new line of campus merchandise available now in the store.</p>
                        <div class="flex items-center gap-4 text-sm text-gray-600">
                            <div class="flex items-center gap-1">
                                <i class="fas fa-calendar"></i>
                                <span>Posted: 2024-03-15</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="announcement-card announcement-high">
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <h3 class="text-lg font-semibold">Important Notice</h3>
                                <span class="badge badge-destructive">High</span>
                            </div>
                            <button class="btn btn-sm btn-destructive gap-1">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                        <p class="text-gray-700">System maintenance scheduled for this weekend.</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderCommunityVoteTab() {
        return `
            <div class="space-y-4">
                <p class="text-gray-600">Community voting features coming soon.</p>
            </div>
        `;
    }
}

// ============================================
// USER VERIFICATION MODULE (Simplified)
// ============================================

class UserVerification {
    constructor(app) {
        this.app = app;
        this.searchTerm = '';
        this.filterStatus = 'all';
        this.selectedRequest = null;
    }

    render() {
        const requests = [
            {
                id: 'VR001',
                userName: 'John Doe',
                userId: 'S002301',
                requestType: 'department',
                currentValue: 'College of Engineering',
                newValue: 'College of Computer Studies',
                submittedDate: '2024-11-25',
                status: 'pending'
            },
            {
                id: 'VR002',
                userName: 'Jane Smith',
                userId: 'S024045',
                requestType: 'role_to_alumni',
                currentValue: 'Student',
                newValue: 'Alumni',
                submittedDate: '2024-11-24',
                status: 'pending'
            }
        ];

        const filteredRequests = requests.filter(r => {
            const matchesSearch = 
                r.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                r.userId.toLowerCase().includes(this.searchTerm.toLowerCase());
            
            const matchesFilter = this.filterStatus === 'all' || r.status === this.filterStatus;
            
            return matchesSearch && matchesFilter;
        });

        return `
            <div class="verification-container p-4 lg:p-6 space-y-6">
                <!-- Header -->
                <div>
                    <h2 class="text-2xl font-bold text-red-700">User Verification</h2>
                    <p class="text-gray-600">Review and approve student verification requests</p>
                </div>

                <!-- Filters and Search -->
                <div class="filters-card">
                    <div class="flex flex-col lg:flex-row gap-4">
                        <div class="search-container">
                            <i class="fas fa-search search-icon"></i>
                            <input type="text" 
                                   placeholder="Search by name or user ID..." 
                                   value="${this.searchTerm}"
                                   oninput="app.modules.userVerification.handleSearch(this.value)"
                                   class="search-input">
                        </div>
                        <div class="filter-buttons">
                            <button class="filter-btn ${this.filterStatus === 'all' ? 'active' : ''}" 
                                    onclick="app.modules.userVerification.setFilterStatus('all')">
                                All
                            </button>
                            <button class="filter-btn ${this.filterStatus === 'pending' ? 'active' : ''}" 
                                    onclick="app.modules.userVerification.setFilterStatus('pending')">
                                Pending
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Requests Table -->
                <div class="verification-table-container">
                    <table class="verification-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Request Type</th>
                                <th>Change Details</th>
                                <th>Submitted</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredRequests.map(request => `
                                <tr>
                                    <td>
                                        <div>
                                            <p class="font-medium text-gray-900">${request.userName}</p>
                                            <p class="text-sm text-gray-500 font-mono">${request.userId}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="request-type-badge">
                                            <i class="fas fa-building"></i>
                                            <span>${request.requestType === 'department' ? 'Department Transfer' : 'Role Change'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="change-details">
                                            <div class="flex items-center">
                                                <span class="current-value">${request.currentValue}</span>
                                                <span class="arrow">→</span>
                                                <span class="new-value">${request.newValue}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-sm text-gray-600">
                                        ${new Date(request.submittedDate).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span class="status-badge badge-pending">
                                            <i class="fas fa-clock mr-1"></i>
                                            Pending
                                        </span>
                                    </td>
                                    <td>
                                        <button class="btn btn-outline btn-sm" 
                                                onclick="app.modules.userVerification.reviewRequest('${request.id}')">
                                            <i class="fas fa-eye mr-2"></i>
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    handleSearch(value) {
        this.searchTerm = value;
        this.app.render();
    }

    setFilterStatus(status) {
        this.filterStatus = status;
        this.app.render();
    }

    reviewRequest(requestId) {
        alert(`Reviewing request ${requestId}`);
    }
}

// ============================================
// APPLICATION INITIALIZATION
// ============================================

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.app = new CampusMerchHub();
    app.render();
});
