<div class="tab-content" id="signup-tab">
    <div class="signup-content-wrapper">
        <div class="tab-header">
            <h2>Create Account</h2>
            <p>Join the Campus Merch Hub</p>
        </div>

        <form class="auth-form" id="signupForm">
            <div class="form-group">
                <label for="signupFirstName">First Name</label>
                <div class="input-with-icon">
                    <i class="fas fa-user"></i>
                    <input type="text" placeholder="Juan" id="signupFirstName" required>
                </div>
            </div>
            <div class="form-group">
                <label for="signupLastName">Last Name</label>
                <div class="input-with-icon">
                    <i class="fas fa-user"></i>
                    <input type="text" placeholder="Dela Cruz" id="signupLastName" required>
                </div>
            </div>

            <div class="form-group">
                <label for="signupEmail">UM Email Address</label>
                <div class="input-with-icon">
                    <i class="fas fa-envelope"></i>
                    <input type="email" placeholder="student@umindanao.edu.ph" id="signupEmail" required>
                </div>
                <div class="error-message" id="signupEmailError"></div>
            </div>

            <div class="form-row balanced-fields">
                <div class="form-group">
                    <label for="userType">User Type</label>
                    <div class="select-with-icon">
                        <i class="fas fa-users"></i>
                        <select id="userType">
                            <option value="student">Current Student</option>
                            <option value="faculty">Faculty/Staff</option>
                            <option value="alumni">Alumni</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label id="idLabel">Student ID</label>
                    <div class="id-input-wrapper">
                        <div class="id-prefix" id="idPrefix">S</div>
                        <input type="text" placeholder="002301" id="studentId" required>
                    </div>
                    <div class="error-message" id="studentIdError"></div>
                </div>
            </div>

            <div class="form-group">
                <label for="department">Department</label>
                <div class="select-with-icon">
                    <i class="fas fa-building"></i>
                    <select id="department">
                        <option value="">Select department</option>
                        <!-- DATABASE: FETCH DEPARTMENTS FROM DATABASE HERE -->
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="course">Course</label>
                <div class="select-with-icon">
                    <i class="fas fa-book-open"></i>
                    <select id="course" disabled>
                        <option value="">Select department first</option>

                        <!-- DATABASE: POPULATE COURSES BASED ON SELECTED DEPARTMENT -->
                    </select>
                </div>
            </div>

            <div class="form-group" id="yearLevelGroup">
                <label for="yearLevel">Year Level</label>
                <div class="select-with-icon">
                    <i class="fas fa-calendar"></i>
                    <select id="yearLevel">
                        <option value="">Select year level</option>
                        <option value="1st">1st Year</option>
                        <option value="2nd">2nd Year</option>
                        <option value="3rd">3rd Year</option>
                        <option value="4th">4th Year</option>
                        <option value="5th">5th Year</option>
                    </select>
                </div>
            </div>

            <div class="form-group" id="graduationYearGroup" style="display: none;">
                <label for="graduationYear">Graduation Year</label>
                <div class="input-with-icon">
                    <i class="fas fa-graduation-cap"></i>
                    <input type="number" placeholder="2020" id="graduationYear" min="1950" max="2025">
                </div>
            </div>

            <div class="form-group">
                <label for="signupPassword">Password</label>
                <div class="input-with-icon">
                    <i class="fas fa-lock"></i>
                    <input type="password" placeholder="At least 8 characters" id="signupPassword" required>
                </div>
                <div class="error-message" id="passwordError"></div>
            </div>

            <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <div class="input-with-icon">
                    <i class="fas fa-lock"></i>
                    <input type="password" placeholder="Re-enter password" id="confirmPassword" required>
                </div>
                <div class="error-message" id="confirmPasswordError"></div>
            </div>

            <div class="checkbox-group">
                <input type="checkbox" id="termsDesktop">
                <label for="termsDesktop">
                    I agree to the
                    <a href="#" class="terms-link">Terms of Service</a>
                    and
                    <a href="#" class="terms-link">Privacy Policy</a>
                </label>
            </div>

            <div id="studentVerificationAlert" class="verification-alert">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Your student ID will be verified before account activation.</p>
            </div>

            <button type="submit" class="submit-button" id="signupSubmit">Create Account</button>
        </form>

        <p class="auth-switch">
            Already have an account?
            <button type="button" class="link-button" data-switch-to="login">Login here</button>
        </p>
    </div>
</div>