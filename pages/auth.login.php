<div class="tab-content active" id="login-tab">
  <div class="tab-header">
    <h2>Welcome Back</h2>
    <p>Login to access your account</p>
  </div>

  <form class="auth-form" id="loginForm">
    <div class="form-group">
      <label for="loginEmail">UM Email Address</label>
      <div class="input-with-icon">
        <i class="fas fa-envelope"></i>
        <input
          type="email"
          placeholder="student@umindanao.edu.ph"
          id="loginEmail"
          required
        />
      </div>
      <div class="error-message" id="loginEmailError"></div>
    </div>

    <div class="form-group">
      <label for="loginPassword">Password</label>
      <div class="input-with-icon">
        <i class="fas fa-lock"></i>
        <input
          type="password"
          placeholder="Enter your password"
          id="loginPassword"
          required
        />
      </div>
    </div>

    <div class="form-options">
      <div class="checkbox-group">
        <input type="checkbox" id="rememberDesktop" />
        <label for="rememberDesktop">Remember me</label>
      </div>
      <button type="button" class="link-button">Forgot password?</button>
    </div>

    <button type="submit" class="submit-button">
      Login to Campus Merch Hub
    </button>
  </form>

  <p class="auth-switch">
    Don't have an account?
    <button type="button" class="link-button" data-switch-to="signup">
      Sign up here
    </button>
  </p>
</div>
