// Campus Merch Hub - Complete Authentication System with PHP Backend
class AuthSystem {
  constructor() {
    this.currentMobileStep = "choice";
    this.init();
  }

  async handleSignup(e) {
    e.preventDefault();

    // Get form input values
    const firstname = document.getElementById("firstname")?.value || "";
    const lastname = document.getElementById("lastname")?.value || "";
    const email = document.getElementById("email")?.value || "";
    const userType = document.getElementById("user_type")?.value || "";
    const fullStudentId = document.getElementById("student_id")?.value || "";
    const department = document.getElementById("department")?.value || "";
    const course = document.getElementById("course")?.value || "";
    const yearLevel = document.getElementById("year_level")?.value || "";
    const graduationYear =
      document.getElementById("graduation_year")?.value || "";

    // Construct user data object
    const userData = {
      firstname,
      lastname,
      email,
      userType,
      studentId: fullStudentId,
      department,
      course,
      yearLevel: userType === "student" ? parseInt(yearLevel) : 0,
      graduationYear: userType === "alumni" ? parseInt(graduationYear) : 0,
    };

    try {
      // Send to PHP
      const response = await fetch("api/service/signup.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.status === "success") {
        this.showToast(result.message, "success");
        e.target.reset();
        document.querySelector('[data-switch-to="login"]').click();
      } else {
        this.showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Error:", error);
      this.showToast("Failed to save data. Please try again.", "error");
    }
  }

  async fetchStudents(){
    let userData = {
      
    }

    try {
      // Send to PHP
      const response = await fetch("api/service/sudents.add.service.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.status === "success") {
        this.showToast(result.message, "success");
        e.target.reset();
        document.querySelector('[data-switch-to="login"]').click();
      } else {
        this.showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Error:", error);
      this.showToast("Failed to save data. Please try again.", "error");
    }
  }

  init() {
    this.initializeTabs();
    this.initializeDialogs();
    this.initializeForms();
    this.initializeEventListeners();
    this.initializeRealTimeValidation();

    // Set initial states
    this.handleUserTypeChange();
    this.handleMobileUserTypeChange();

    // Load departments from PHP backend
    this.loadDepartmentsFromBackend();
  }

  // Load departments from PHP backend
  async loadDepartmentsFromBackend() {
    try {
      const response = await fetch("api/service/departments.php");
      const departments = await response.json();

      if (Array.isArray(departments.data)) {
        this.populateDepartmentDropdowns(departments.data);
      }
    } catch (error) {
      console.error("Failed to load departments:", error);
      this.showToast("Failed to load department data", "error");
    }
  }

  populateDepartmentDropdowns(departments) {
    // Populate desktop department dropdown
    const deptSelect = document.getElementById("department");
    const mobileDeptSelect = document.getElementById("mobileDepartment");

    if (deptSelect) {
      // Keep existing "Select department" option
      while (deptSelect.options.length > 1) {
        deptSelect.remove(1);
      }

      departments.forEach((dept) => {
        const option = document.createElement("option");
        option.value = dept.id; // Use department code
        option.textContent = dept.name;
        deptSelect.appendChild(option);
      });
    }

    // Populate mobile department dropdown
    if (mobileDeptSelect) {
      while (mobileDeptSelect.options.length > 1) {
        mobileDeptSelect.remove(1);
      }

      departments.forEach((dept) => {
        const option = document.createElement("option");
        option.value = dept.id; // Use department code
        option.textContent = dept.name;
        mobileDeptSelect.appendChild(option);
      });
    }
  }

  // Tab Management
  initializeTabs() {
    const tabTriggers = document.querySelectorAll(".tab-trigger");
    const switchToSignup = document.querySelector('[data-switch-to="signup"]');
    const switchToLogin = document.querySelector('[data-switch-to="login"]');

    const switchTab = (tabName) => {
      tabTriggers.forEach((trigger) => {
        trigger.classList.toggle("active", trigger.dataset.tab === tabName);
      });

      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.toggle("active", content.id === `${tabName}-tab`);
      });
    };

    tabTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        switchTab(trigger.dataset.tab);
      });
    });

    if (switchToSignup) {
      switchToSignup.addEventListener("click", () => {
        switchTab("signup");
      });
    }

    if (switchToLogin) {
      switchToLogin.addEventListener("click", () => {
        switchTab("login");
      });
    }
  }

  initializeDialogs() {
    const mobileAuthButton = document.getElementById("mobileAuthButton");
    const mobileAuthDialog = document.getElementById("mobileAuthDialog");
    const mobileAuthClose = document.getElementById("mobileAuthClose");

    if (mobileAuthButton) {
      mobileAuthButton.addEventListener("click", () => {
        this.showMobileStep("choice");
        mobileAuthDialog.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    }

    if (mobileAuthClose) {
      mobileAuthClose.addEventListener("click", () => {
        mobileAuthDialog.classList.remove("active");
        document.body.style.overflow = "";
        this.resetMobileDialog();
      });
    }

    const mobileAdminButton = document.getElementById("mobileAdminButton");
    const desktopAdminButton = document.getElementById("desktopAdminButton");
    const adminDialog = document.getElementById("adminDialog");
    const adminDialogClose = document.getElementById("adminDialogClose");

    if (mobileAdminButton) {
      mobileAdminButton.addEventListener("click", () => {
        adminDialog.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    }

    if (desktopAdminButton) {
      desktopAdminButton.addEventListener("click", () => {
        adminDialog.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    }

    if (adminDialogClose) {
      adminDialogClose.addEventListener("click", () => {
        adminDialog.classList.remove("active");
        document.body.style.overflow = "";
      });
    }

    [mobileAuthDialog, adminDialog].forEach((dialog) => {
      if (dialog) {
        dialog.addEventListener("click", (e) => {
          if (e.target === dialog) {
            dialog.classList.remove("active");
            document.body.style.overflow = "";
            if (dialog === mobileAuthDialog) {
              this.resetMobileDialog();
            }
          }
        });
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (mobileAuthDialog && mobileAuthDialog.classList.contains("active")) {
          mobileAuthDialog.classList.remove("active");
          document.body.style.overflow = "";
          this.resetMobileDialog();
        }
        if (adminDialog && adminDialog.classList.contains("active")) {
          adminDialog.classList.remove("active");
          document.body.style.overflow = "";
        }
      }
    });
  }

  initializeForms() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e));
    }

    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => this.handleSignup(e));
    }

    const mobileLoginForm = document.getElementById("mobileLoginForm");
    if (mobileLoginForm) {
      mobileLoginForm.addEventListener("submit", (e) =>
        this.handleMobileLogin(e)
      );
    }

    const mobileSignupForm = document.getElementById("mobileSignupForm");
    if (mobileSignupForm) {
      mobileSignupForm.addEventListener("submit", (e) =>
        this.handleMobileSignup(e)
      );
    }

    const adminLoginForm = document.getElementById("adminLoginForm");
    if (adminLoginForm) {
      adminLoginForm.addEventListener("submit", (e) =>
        this.handleAdminLogin(e)
      );
    }

    const userTypeSelect = document.getElementById("userType");
    if (userTypeSelect) {
      userTypeSelect.addEventListener("change", () =>
        this.handleUserTypeChange()
      );
    }

    const mobileUserTypeSelect = document.getElementById("mobileUserType");
    if (mobileUserTypeSelect) {
      mobileUserTypeSelect.addEventListener("change", () =>
        this.handleMobileUserTypeChange()
      );
    }

    const departmentSelect = document.getElementById("department");
    if (departmentSelect) {
      departmentSelect.addEventListener("change", () =>
        this.handleDepartmentChange()
      );
    }

    const mobileDepartmentSelect = document.getElementById("mobileDepartment");
    if (mobileDepartmentSelect) {
      mobileDepartmentSelect.addEventListener("change", () =>
        this.handleMobileDepartmentChange()
      );
    }

    const studentIdInput = document.getElementById("studentId");
    if (studentIdInput) {
      studentIdInput.addEventListener("input", () =>
        this.handleStudentIdInput()
      );
    }

    const mobileStudentIdInput = document.getElementById("mobileStudentId");
    if (mobileStudentIdInput) {
      mobileStudentIdInput.addEventListener("input", () =>
        this.handleMobileStudentIdInput()
      );
    }
  }

  initializeEventListeners() {
    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const action = e.currentTarget.dataset.action;

        switch (action) {
          case "login":
            this.showMobileStep("login");
            break;
          case "signup":
            this.showMobileStep("signup");
            break;
          case "back-to-choice":
            this.showMobileStep("choice");
            break;
        }
      });
    });
  }

  initializeRealTimeValidation() {
    const signupEmail = document.getElementById("signupEmail");
    const signupPassword = document.getElementById("signupPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const loginEmail = document.getElementById("loginEmail");

    if (signupEmail) {
      signupEmail.addEventListener("blur", () =>
        this.validateEmail(signupEmail.value, "signupEmailError")
      );
    }

    if (signupPassword) {
      signupPassword.addEventListener("blur", () =>
        this.validatePassword(signupPassword.value, "passwordError")
      );
    }

    if (confirmPassword) {
      confirmPassword.addEventListener("blur", () =>
        this.validateConfirmPassword()
      );
    }

    if (loginEmail) {
      loginEmail.addEventListener("blur", () =>
        this.validateEmail(loginEmail.value, "loginEmailError")
      );
    }

    const mobileSignupEmail = document.getElementById("mobileSignupEmail");
    const mobileSignupPassword = document.getElementById(
      "mobileSignupPassword"
    );
    const mobileConfirmPassword = document.getElementById(
      "mobileConfirmPassword"
    );
    const mobileLoginEmail = document.getElementById("mobileLoginEmail");

    if (mobileSignupEmail) {
      mobileSignupEmail.addEventListener("blur", () =>
        this.validateEmail(mobileSignupEmail.value, "mobileSignupEmailError")
      );
    }

    if (mobileSignupPassword) {
      mobileSignupPassword.addEventListener("blur", () =>
        this.validatePassword(mobileSignupPassword.value, "mobilePasswordError")
      );
    }

    if (mobileConfirmPassword) {
      mobileConfirmPassword.addEventListener("blur", () =>
        this.validateMobileConfirmPassword()
      );
    }

    if (mobileLoginEmail) {
      mobileLoginEmail.addEventListener("blur", () =>
        this.validateEmail(mobileLoginEmail.value, "mobileLoginEmailError")
      );
    }
  }

  showMobileStep(step) {
    this.currentMobileStep = step;
    const title = document.getElementById("mobileAuthTitle");
    const description = document.getElementById("mobileAuthDescription");

    document.getElementById("mobileChoiceStep").style.display = "none";
    document.getElementById("mobileLoginStep").style.display = "none";
    document.getElementById("mobileSignupStep").style.display = "none";

    switch (step) {
      case "choice":
        title.textContent = "Choose Action";
        description.textContent =
          "Would you like to login or create a new account?";
        document.getElementById("mobileChoiceStep").style.display = "flex";
        break;
      case "login":
        title.textContent = "Welcome Back";
        description.textContent = "Login to access your account";
        document.getElementById("mobileLoginStep").style.display = "block";
        break;
      case "signup":
        title.textContent = "Create Account";
        description.textContent = "Join the UM Merch Community";
        document.getElementById("mobileSignupStep").style.display = "block";
        this.handleMobileUserTypeChange();
        break;
    }
  }

  resetMobileDialog() {
    this.showMobileStep("choice");

    const mobileLoginForm = document.getElementById("mobileLoginForm");
    const mobileSignupForm = document.getElementById("mobileSignupForm");

    if (mobileLoginForm) mobileLoginForm.reset();
    if (mobileSignupForm) mobileSignupForm.reset();

    document.querySelectorAll(".error-message").forEach((error) => {
      error.textContent = "";
      error.classList.remove("show");
    });
  }

  handleUserTypeChange() {
    const userType = document.getElementById("userType");
    const idLabel = document.getElementById("idLabel");
    const idPrefix = document.getElementById("idPrefix");
    const yearLevelGroup = document.getElementById("yearLevelGroup");
    const graduationYearGroup = document.getElementById("graduationYearGroup");
    const studentVerificationAlert = document.getElementById(
      "studentVerificationAlert"
    );

    if (!userType || !idLabel || !idPrefix) return;

    if (userType.value === "faculty") {
      idLabel.textContent = "Faculty ID";
      idPrefix.textContent = "F";
    } else {
      idLabel.textContent =
        userType.value === "student" ? "Student ID" : "Alumni ID";
      idPrefix.textContent = "S";
    }

    if (userType.value === "student") {
      if (yearLevelGroup) yearLevelGroup.style.display = "block";
      if (graduationYearGroup) graduationYearGroup.style.display = "none";
      if (studentVerificationAlert)
        studentVerificationAlert.style.display = "flex";
    } else if (userType.value === "alumni") {
      if (yearLevelGroup) yearLevelGroup.style.display = "none";
      if (graduationYearGroup) graduationYearGroup.style.display = "block";
      if (studentVerificationAlert)
        studentVerificationAlert.style.display = "none";
    } else {
      if (yearLevelGroup) yearLevelGroup.style.display = "none";
      if (graduationYearGroup) graduationYearGroup.style.display = "none";
      if (studentVerificationAlert)
        studentVerificationAlert.style.display = "none";
    }
  }

  handleMobileUserTypeChange() {
    const userType = document.getElementById("mobileUserType");
    const idLabel = document.getElementById("mobileIdLabel");
    const idPrefix = document.getElementById("mobileIdPrefix");
    const yearLevelGroup = document.getElementById("mobileYearLevelGroup");
    const graduationYearGroup = document.getElementById(
      "mobileGraduationYearGroup"
    );
    const studentVerification = document.getElementById(
      "mobileStudentVerification"
    );

    if (!userType || !idLabel || !idPrefix) return;

    if (userType.value === "faculty") {
      idLabel.textContent = "Faculty ID";
      idPrefix.textContent = "F";
      if (yearLevelGroup) yearLevelGroup.style.display = "none";
      if (graduationYearGroup) graduationYearGroup.style.display = "none";
      if (studentVerification) studentVerification.style.display = "none";
    } else if (userType.value === "alumni") {
      idLabel.textContent = "Alumni ID";
      idPrefix.textContent = "S";
      if (yearLevelGroup) yearLevelGroup.style.display = "none";
      if (graduationYearGroup) graduationYearGroup.style.display = "block";
      if (studentVerification) studentVerification.style.display = "none";
    } else {
      idLabel.textContent = "Student ID";
      idPrefix.textContent = "S";
      if (yearLevelGroup) yearLevelGroup.style.display = "block";
      if (graduationYearGroup) graduationYearGroup.style.display = "none";
      if (studentVerification) studentVerification.style.display = "flex";
    }
  }

  handleStudentIdInput() {
    const userType = document.getElementById("userType").value;
    const studentIdInput = document.getElementById("studentId");
    if (!studentIdInput) return;

    let value = studentIdInput.value.replace(/\D/g, "").slice(0, 6);
    studentIdInput.value = value;

    const fullId = (userType === "faculty" ? "F" : "S") + value;
    this.validateStudentId(fullId, userType, "studentIdError");
  }

  handleMobileStudentIdInput() {
    const userType = document.getElementById("mobileUserType").value;
    const studentIdInput = document.getElementById("mobileStudentId");
    if (!studentIdInput) return;

    let value = studentIdInput.value.replace(/\D/g, "").slice(0, 6);
    studentIdInput.value = value;

    const fullId = (userType === "faculty" ? "F" : "S") + value;
    this.validateStudentId(fullId, userType, "mobileStudentIdError");
  }

  async handleDepartmentChange() {
    const department = document.getElementById("department");
    const courseSelect = document.getElementById("course");

    if (!department || !courseSelect) return;

    courseSelect.innerHTML = "";

    if (!department.value) {
      courseSelect.disabled = true;
      courseSelect.innerHTML =
        '<option value="">Select department first</option>';
      return;
    }

    try {
      // Fetch courses from PHP backend
      const response = await fetch(
        `api/service/courses.php?department_id=${department.value}`
      );
      const courses = await response.json();

      courseSelect.disabled = false;
      courseSelect.innerHTML = '<option value="">Select course</option>';

      courses.data.forEach((course) => {
        const option = document.createElement("option");
        option.value = course.id;
        option.textContent = course.name;
        courseSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Failed to load courses:", error);
      this.showToast("Failed to load course data", "error");
    }
  }

  async handleMobileDepartmentChange() {
    const department = document.getElementById("mobileDepartment");
    const courseSelect = document.getElementById("mobileCourse");

    if (!department || !courseSelect) return;

    courseSelect.innerHTML = "";

    if (!department.value) {
      courseSelect.disabled = true;
      courseSelect.innerHTML =
        '<option value="">Select department first</option>';
      return;
    }

    try {
      // Fetch courses from PHP backend
      const response = await fetch(
        `api/service/courses.php?department_id=${department.value}`
      );
      const courses = await response.json();

      courseSelect.disabled = false;
      courseSelect.innerHTML = '<option value="">Select course</option>';

      courses.data.forEach((course) => {
        const option = document.createElement("option");
        option.value = course.id;
        option.textContent = course.name;
        courseSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Failed to load courses:", error);
      this.showToast("Failed to load course data", "error");
    }
  }

  // Form Handlers - Updated to use PHP Backend
  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!this.validateEmail(email, "loginEmailError")) {
      this.showToast("Invalid email address", "error");
      return;
    }

    if (!password) {
      this.showToast("Please enter your password", "error");
      return;
    }

    try {
      // Call PHP backend for login
      const response = await fetch("api/service/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.status === "success") {
        this.showToast(result.message, "success");
        e.target.reset();

        setTimeout(() => {
          if (typeof window.onLogin === "function") {
            window.onLogin(result.user);
          }
        }, 1000);
      } else {
        this.showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      this.showToast("Login failed. Please try again.", "error");
    }
  }

  async handleMobileLogin(e) {
    e.preventDefault();
    const email = document.getElementById("mobileLoginEmail").value;
    const password = document.getElementById("mobileLoginPassword").value;

    if (!this.validateEmail(email, "mobileLoginEmailError")) {
      this.showToast("Invalid email address", "error");
      return;
    }

    if (!password) {
      this.showToast("Please enter your password", "error");
      return;
    }

    try {
      // Call PHP backend for login
      const response = await fetch("api/service/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.status === "success") {
        this.showToast(result.message, "success");

        document.getElementById("mobileAuthDialog").classList.remove("active");
        document.body.style.overflow = "";
        this.resetMobileDialog();

        setTimeout(() => {
          if (typeof window.onLogin === "function") {
            window.onLogin(result.user);
          }
        }, 1000);
      } else {
        this.showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      this.showToast("Login failed. Please try again.", "error");
    }
  }

  async handleSignup(e) {
    e.preventDefault();

    // Get input values
    const firstname = document.getElementById("signupFirstName").value.trim();
    const lastname = document.getElementById("signupFirstName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPass = document.getElementById("confirmPassword").value;
    const userType = document.getElementById("userType").value;
    const studentId = document.getElementById("studentId").value.trim();
    const department = document.getElementById("department").value;
    const course = document.getElementById("course").value;
    const yearLevel = document.getElementById("yearLevel").value;
    const graduationYear = document.getElementById("graduationYear").value;
    const agreeToTerms = document.getElementById("termsDesktop").checked;

    // Validation...
    // (keep all your current validation here)

    const fullStudentId = (userType === "faculty" ? "F" : "S") + studentId;

    try {
      const userData = {
        firstname,
        lastname,
        email,
        password,
        userType, // PHP will read as $userType
        studentId: fullStudentId,
        department,
        course,
        yearLevel: userType === "student" ? parseInt(yearLevel) : 0,
        graduationYear: userType === "alumni" ? parseInt(graduationYear) : 0,
      };

      const response = await fetch("api/service/signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.status === "success") {
        this.showToast(result.message, "success");
        e.target.reset();
        document.querySelector('[data-switch-to="login"]').click();
      } else {
        this.showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Signup error:", error);
      this.showToast("Failed to create account. Please try again.", "error");
    }
  }

  async handleMobileSignup(e) {
    e.preventDefault();
    const firstname = document.getElementById("mobileSignupFirstName").value;
    const lastname = document.getElementById("mobileSignupLastName").value;
    const email = document.getElementById("mobileSignupEmail").value;
    const password = document.getElementById("mobileSignupPassword").value;
    const confirmPass = document.getElementById("mobileConfirmPassword").value;
    const userType = document.getElementById("mobileUserType").value;
    const studentId = document.getElementById("mobileStudentId").value;
    const department = document.getElementById("mobileDepartment").value;
    const course = document.getElementById("mobileCourse").value;
    const yearLevel = document.getElementById("mobileYearLevel").value;
    const graduationYear = document.getElementById(
      "mobileGraduationYear"
    ).value;
    const agreeToTerms = document.getElementById("mobileTerms").checked;

    // Validation
    // if (!name) {
    //   this.showToast("Please enter your full name", "error");
    //   return;
    // }

    if (!this.validateEmail(email, "mobileSignupEmailError")) {
      this.showToast("Invalid UM email address", "error");
      return;
    }

    const fullStudentId = (userType === "faculty" ? "F" : "S") + studentId;
    if (
      !this.validateStudentId(fullStudentId, userType, "mobileStudentIdError")
    ) {
      this.showToast(`Invalid ${userType} ID format`, "error");
      return;
    }

    if (!department) {
      this.showToast("Please select department", "error");
      return;
    }

    if (!course) {
      this.showToast("Please select your course", "error");
      return;
    }

    if (userType === "student" && !yearLevel) {
      this.showToast("Please select year level", "error");
      return;
    }

    if (userType === "alumni" && !graduationYear) {
      this.showToast("Please enter your graduation year", "error");
      return;
    }

    if (!this.validatePassword(password, "mobilePasswordError")) {
      this.showToast("Password must be at least 8 characters long", "error");
      return;
    }

    if (password !== confirmPass) {
      this.showToast("Passwords do not match", "error");
      return;
    }

    if (!agreeToTerms) {
      this.showToast("Please agree to the terms and conditions", "error");
      return;
    }

    try {
      // Prepare data for PHP backend
      const userData = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        user_type: userType,
        student_id: fullStudentId,
        department: department,
        course: course,
        year_level: userType === "student" ? yearLevel : null,
        graduation_year: userType === "alumni" ? graduationYear : null,
      };

      // Call PHP backend for signup
      const response = await fetch("api/service/signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        this.showToast(result.message, "success");
        document.getElementById("mobileAuthDialog").classList.remove("active");
        document.body.style.overflow = "";
        this.resetMobileDialog();
      } else {
        this.showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Signup error:", error);
      this.showToast("Failed to create account. Please try again.", "error");
    }
  }

  async handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;

    if (!email) {
      this.showToast("Please enter admin email", "error");
      return;
    }

    if (!password) {
      this.showToast("Please enter password", "error");
      return;
    }

    try {
      // Call PHP backend for admin login
      const response = await fetch("api/service/login.admin.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.status === "success") {
        this.showToast(result.message, "success");
        document.getElementById("adminDialog").classList.remove("active");
        document.body.style.overflow = "";
        e.target.reset();

        setTimeout(() => {
          if (typeof window.onLogin === "function") {
            window.onLogin(result.user);
          }
        }, 1000);
      } else {
        this.showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      this.showToast("Admin login failed", "error");
    }
  }

  validateEmail(email, errorElementId = null) {
    const umEmailPattern = /^[a-zA-Z0-9._%+-]+@umindanao\.edu\.ph$/;
    const isValid = umEmailPattern.test(email);

    if (errorElementId) {
      const errorElement = document.getElementById(errorElementId);
      if (errorElement) {
        if (!isValid && email) {
          errorElement.textContent =
            "Please use a valid UM email address (@umindanao.edu.ph)";
          errorElement.classList.add("show");
        } else {
          errorElement.classList.remove("show");
        }
      }
    }

    return isValid;
  }

  validatePassword(password, errorElementId = null) {
    const isValid = password.length >= 8;

    if (errorElementId) {
      const errorElement = document.getElementById(errorElementId);
      if (errorElement) {
        if (!isValid && password) {
          errorElement.textContent =
            "Password must be at least 8 characters long";
          errorElement.classList.add("show");
        } else {
          errorElement.classList.remove("show");
        }
      }
    }

    return isValid;
  }

  validateStudentId(id, userType, errorElementId = null) {
    let isValid = false;
    let errorMessage = "";

    if (userType === "student" || userType === "alumni") {
      const studentIdPattern = /^S\d{6}$/;
      isValid = studentIdPattern.test(id);
      errorMessage = "Student/Alumni ID format: S000000 (e.g., S002301)";
    } else if (userType === "faculty") {
      const facultyIdPattern = /^F\d{6}$/;
      isValid = facultyIdPattern.test(id);
      errorMessage = "Faculty ID format: F000000 (e.g., F000123)";
    }

    if (errorElementId) {
      const errorElement = document.getElementById(errorElementId);
      if (errorElement) {
        if (!isValid && id) {
          errorElement.textContent = errorMessage;
          errorElement.classList.add("show");
        } else {
          errorElement.classList.remove("show");
        }
      }
    }

    return isValid;
  }

  validateConfirmPassword() {
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorElement = document.getElementById("confirmPasswordError");

    if (!errorElement) return true;

    if (confirmPassword && password !== confirmPassword) {
      errorElement.textContent = "Passwords do not match";
      errorElement.classList.add("show");
      return false;
    } else {
      errorElement.classList.remove("show");
      return true;
    }
  }

  validateMobileConfirmPassword() {
    const password = document.getElementById("mobileSignupPassword").value;
    const confirmPassword = document.getElementById(
      "mobileConfirmPassword"
    ).value;
    const errorElement = document.getElementById("mobileConfirmPasswordError");

    if (!errorElement) return true;

    if (confirmPassword && password !== confirmPassword) {
      errorElement.textContent = "Passwords do not match";
      errorElement.classList.add("show");
      return false;
    } else {
      errorElement.classList.remove("show");
      return true;
    }
  }

  showToast(message, type = "success") {
    const toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideIn 0.3s ease reverse";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }, 4000);
  }
}

// Login callback function
window.onLogin = function (userData) {
  console.log("User logged in:", userData);

  const authSystem = window.authSystem;
  if (authSystem) {
    authSystem.showToast(`Welcome, ${userData.first_name}!`, "success");
  }

  // Store session data
  localStorage.setItem("userData", JSON.stringify(userData));

  // Redirect to dashboard based on role
  window.location.href = "redirect.php";
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  window.authSystem = new AuthSystem();
});
