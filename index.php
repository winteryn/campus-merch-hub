<?php
session_start(); // Start session

include 'config.php';

// Auth Guard: redirect if already logged in
if (isset($_SESSION['user'])) {
    header("Location: dashboard.php"); 
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campus Merch Hub - University of Mindanao</title>
    <link rel="stylesheet" href="Login_Page.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400..700;1,400..700&display=swap"
        rel="stylesheet">
</head>

<body>
    <div class="auth-container">
        <div class="background-pattern"></div>
        <div class="main-content">
            <!-- Mobile Layout -->
            <div class="mobile-branding">
                <div class="mobile-logo">
                    <div class="logo-icon">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <div class="logo-text">
                        <h1>Campus Merch Hub</h1>
                        <p>University of Mindanao</p>
                    </div>
                </div>

                <!-- Mobile Promo Content -->
                <div class="mobile-promo-container">
                    <div class="mobile-promo-content">
                        <div class="promo-header">
                            <h3>Official Campus Merch</h3>
                            <div class="rating">
                                <i class="fas fa-star"></i>
                                <span>4.8</span>
                            </div>
                        </div>
                        <p>Get authentic UM merchandise with student verification</p>
                        <div class="promo-grid">
                            <div class="promo-item">
                                <i class="fas fa-tshirt"></i>
                                <span>Apparel</span>
                            </div>
                            <div class="promo-item">
                                <i class="fas fa-mug-hot"></i>
                                <span>Accessories</span>
                            </div>
                            <div class="promo-item">
                                <i class="fas fa-palette"></i>
                                <span>Custom</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mobile-auth-section">
                <button class="auth-button primary" id="mobileAuthButton">
                    Login or Sign Up
                </button>

                <div class="admin-section">
                    <p>Admin Access</p>
                    <button class="auth-button secondary" id="mobileAdminButton">
                        Login as Administrator
                    </button>
                </div>
            </div>

            <!-- Desktop Layout -->
            <div class="desktop-layout">
                <div class="branding-section">
                    <div class="logo">
                        <div class="logo-icon">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <div class="logo-text">
                            <h1>Campus Merch Hub</h1>
                            <p>University of Mindanao</p>
                        </div>
                    </div>

                    <div class="branding-content">
                        <h2>Official Campus Merchandise Platform</h2>
                        <p>Your one-stop shop for authentic UM merchandise. Browse, customize, and order official campus
                            products with student verification.</p>

                        <div class="features-grid">
                            <div class="feature">
                                <div class="feature-icon">
                                    <i class="fas fa-shopping-bag"></i>
                                </div>
                                <div class="feature-text">
                                    <span class="feature-line">Verified</span>
                                    <span class="feature-line">Products</span>
                                </div>
                            </div>
                            <div class="feature">
                                <div class="feature-icon">
                                    <i class="fas fa-id-card"></i>
                                </div>
                                <div class="feature-text">
                                    <span class="feature-line">Student ID</span>
                                    <span class="feature-line">Verification</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="admin-section desktop">
                        <p>Admin Access</p>
                        <button class="auth-button secondary" id="desktopAdminButton">
                            Login as Administrator
                        </button>
                    </div>
                </div>

                <div class="auth-card">
                    <div class="tabs">
                        <div class="tab-list">
                            <button class="tab-trigger active" data-tab="login">Login</button>
                            <button class="tab-trigger" data-tab="signup">Sign Up</button>
                        </div>

                        <?php include './pages/auth.login.php'; ?>
                        <?php include './pages/auth.signup.php'; ?>

                    </div>
                </div>
            </div>

            <div class="footer">
                <p>© 2025 University of Mindanao. All rights reserved.</p>
            </div>
        </div>
    </div>

    <!-- Mobile Auth Dialog -->
    <div class="dialog-overlay" id="mobileAuthDialog">
        <div class="dialog-content">
            <div class="dialog-header">
                <h3 id="mobileAuthTitle">Choose Action</h3>
                <p id="mobileAuthDescription">Would you like to login or create a new account?</p>
                <button class="dialog-close" id="mobileAuthClose">&times;</button>
            </div>

            <div class="dialog-body" id="mobileAuthBody">
                <!-- Choice Step -->
                <div id="mobileChoiceStep" class="mobile-dialog-step">
                    <button class="dialog-action-button primary" data-action="login">
                        Login to Existing Account
                    </button>
                    <button class="dialog-action-button secondary" data-action="signup">
                        Create New Account
                    </button>
                </div>

                <!-- Login Step -->
                <div id="mobileLoginStep" class="mobile-dialog-step" style="display: none;">
                    <form class="auth-form" id="mobileLoginForm">
                        <div class="form-group">
                            <label for="mobileLoginEmail">UM Email Address</label>
                            <div class="input-with-icon">
                                <i class="fas fa-envelope"></i>
                                <input type="email" placeholder="student@umindanao.edu.ph" id="mobileLoginEmail"
                                    required>
                            </div>
                            <div class="error-message" id="mobileLoginEmailError"></div>
                        </div>

                        <div class="form-group">
                            <label for="mobileLoginPassword">Password</label>
                            <div class="input-with-icon">
                                <i class="fas fa-lock"></i>
                                <input type="password" placeholder="Enter your password" id="mobileLoginPassword"
                                    required>
                            </div>
                        </div>

                        <div class="form-options">
                            <div class="checkbox-group">
                                <input type="checkbox" id="mobileRemember">
                                <label for="mobileRemember">Remember me</label>
                            </div>
                            <button type="button" class="link-button">Forgot password?</button>
                        </div>

                        <button type="submit" class="submit-button">Login to Campus Merch Hub</button>

                        <p class="auth-switch">
                            Don't have an account?
                            <button type="button" class="link-button" data-action="signup">Sign up here</button>
                        </p>

                        <button type="button" class="back-button" data-action="back-to-choice">
                            <i class="fas fa-arrow-left"></i>
                            Back
                        </button>
                    </form>
                </div>

                <!-- Signup Step -->
                <div id="mobileSignupStep" class="mobile-dialog-step" style="display: none;">
                    <div class="mobile-signup-content-wrapper">
                        <form class="auth-form" id="mobileSignupForm">
                            <div class="form-group">
                                <label for="mobileUserType">I am a</label>
                                <div class="select-with-icon">
                                    <i class="fas fa-users"></i>
                                    <select id="mobileUserType">
                                        <option value="student">Current Student</option>
                                        <option value="faculty">Faculty/Staff</option>
                                        <option value="alumni">Alumni</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="mobileSignupFirstName">First Name</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-user"></i>
                                    <input type="text" placeholder="Juan" id="mobileSignupFirstName" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="mobileSignupLastName">Last Name</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-user"></i>
                                    <input type="text" placeholder="Dela Cruz" id="mobileSignupLastName" required>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="mobileSignupEmail">UM Email Address</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-envelope"></i>
                                    <input type="email" placeholder="student@umindanao.edu.ph" id="mobileSignupEmail"
                                        required>
                                </div>
                                <div class="error-message" id="mobileSignupEmailError"></div>
                            </div>

                            <div class="form-row balanced-fields">
                                <div class="form-group">
                                    <label id="mobileIdLabel">Student ID</label>
                                    <div class="id-input-wrapper">
                                        <div class="id-prefix" id="mobileIdPrefix">S</div>
                                        <input type="text" placeholder="002301" id="mobileStudentId" required>
                                    </div>
                                    <div class="error-message" id="mobileStudentIdError"></div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="mobileDepartment">Department</label>
                                <div class="select-with-icon">
                                    <i class="fas fa-building"></i>
                                    <select id="mobileDepartment">
                                        <option value="">Select department</option>
                                        <!-- DATABASE: FETCH DEPARTMENTS FROM DATABASE HERE -->
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="mobileCourse">Course</label>
                                <div class="select-with-icon">
                                    <i class="fas fa-book-open"></i>
                                    <select id="mobileCourse" disabled>
                                        <option value="">Select department first</option>
                                        <!-- DATABASE: POPULATE COURSES BASED ON SELECTED DEPARTMENT -->
                                    </select>
                                </div>
                            </div>

                            <div class="form-group" id="mobileYearLevelGroup">
                                <label for="mobileYearLevel">Year Level</label>
                                <div class="select-with-icon">
                                    <i class="fas fa-calendar"></i>
                                    <select id="mobileYearLevel">
                                        <option value="">Select year level</option>
                                        <option value="1st">1st Year</option>
                                        <option value="2nd">2nd Year</option>
                                        <option value="3rd">3rd Year</option>
                                        <option value="4th">4th Year</option>
                                        <option value="5th">5th Year</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group" id="mobileGraduationYearGroup" style="display: none;">
                                <label for="mobileGraduationYear">Graduation Year</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-graduation-cap"></i>
                                    <input type="number" placeholder="2020" id="mobileGraduationYear" min="1950"
                                        max="2025">
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="mobileSignupPassword">Password</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-lock"></i>
                                    <input type="password" placeholder="At least 8 characters" id="mobileSignupPassword"
                                        required>
                                </div>
                                <div class="error-message" id="mobilePasswordError"></div>
                            </div>

                            <div class="form-group">
                                <label for="mobileConfirmPassword">Confirm Password</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-lock"></i>
                                    <input type="password" placeholder="Re-enter password" id="mobileConfirmPassword"
                                        required>
                                </div>
                                <div class="error-message" id="mobileConfirmPasswordError"></div>
                            </div>

                            <div class="checkbox-group">
                                <input type="checkbox" id="mobileTerms">
                                <label for="mobileTerms">
                                    I agree to the
                                    <a href="#" class="terms-link">Terms of Service</a>
                                    and
                                    <a href="#" class="terms-link">Privacy Policy</a>
                                </label>
                            </div>

                            <div id="mobileStudentVerification" class="verification-alert">
                                <i class="fas fa-exclamation-triangle"></i>
                                <p>Your student ID will be verified before account activation.</p>
                            </div>

                            <button type="submit" class="submit-button">Create Account</button>

                            <p class="auth-switch">
                                Already have an account?
                                <button type="button" class="link-button" data-action="login">Login here</button>
                            </p>

                            <button type="button" class="back-button" data-action="back-to-choice">
                                <i class="fas fa-arrow-left"></i>
                                Back
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Admin Dialog -->
    <div class="dialog-overlay" id="adminDialog">
        <div class="dialog-content admin-dialog">
            <div class="dialog-header">
                <h3 class="admin-title">
                    <i class="fas fa-shield-alt"></i>
                    Administrator Login
                </h3>
                <p>Enter your admin credentials to access the dashboard</p>
                <button class="dialog-close" id="adminDialogClose">&times;</button>
            </div>

            <div class="dialog-body">
                <form class="auth-form admin-auth-form" id="adminLoginForm">
                    <div class="form-group">
                        <label for="adminEmail">Admin Email</label>
                        <div class="input-with-icon">
                            <i class="fas fa-envelope"></i>
                            <input type="email" placeholder="admin@umindanao.edu.ph" id="adminEmail" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="adminPassword">Password</label>
                        <div class="input-with-icon">
                            <i class="fas fa-lock"></i>
                            <input type="password" placeholder="Enter admin password" id="adminPassword" required>
                        </div>
                    </div>

                    <button type="submit" class="submit-button admin-submit">
                        <i class="fas fa-sign-in-alt"></i>
                        Login as Administrator
                    </button>
                </form>
            </div>
        </div>
    </div>

    <!-- Toast Container -->
    <div class="toast-container" id="toastContainer"></div>

    <!-- DATABASE: INCLUDE DATABASE CONNECTION SCRIPT HERE -->
    <script src="Login_Page.js"></script>
</body>

</html>