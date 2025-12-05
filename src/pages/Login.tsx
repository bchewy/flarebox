export function Login() {
  return (
    <div id="login-container">
      <script dangerouslySetInnerHTML={{ __html: `window.__PAGE__ = 'login';` }} />
      <div className="login-box">
        <h1>FlareBox</h1>
        <p className="subtitle">Sign in to continue</p>
        
        <form id="password-form">
          <input
            type="password"
            id="password-input"
            placeholder="Password"
            required
          />
          <button type="submit">Sign in</button>
        </form>
        
        <div className="divider">
          <span>or</span>
        </div>
        
        <div id="send-code-view">
          <button id="send-code-btn" type="button" className="secondary">Send login code to email</button>
        </div>
        
        <form id="otp-form" style={{ display: 'none' }}>
          <p className="otp-message">Check your email for the code</p>
          <input
            type="text"
            id="otp-input"
            placeholder="000000"
            maxLength={6}
            pattern="[0-9]{6}"
            required
          />
          <button type="submit">Verify</button>
          <button type="button" id="back-btn" className="secondary">Back</button>
        </form>
        
        <div id="error-message" className="error"></div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const passwordForm = document.getElementById('password-form');
          const passwordInput = document.getElementById('password-input');
          const sendCodeView = document.getElementById('send-code-view');
          const sendCodeBtn = document.getElementById('send-code-btn');
          const otpForm = document.getElementById('otp-form');
          const otpInput = document.getElementById('otp-input');
          const backBtn = document.getElementById('back-btn');
          const errorDiv = document.getElementById('error-message');
          const divider = document.querySelector('.divider');
          let currentChallenge = null;
          
          passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
            
            try {
              const res = await fetch('/api/auth/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: passwordInput.value })
              });
              
              const data = await res.json();
              
              if (!res.ok) {
                throw new Error(data.error || 'Invalid password');
              }
              
              window.location.href = '/dashboard';
            } catch (err) {
              errorDiv.textContent = err.message;
              errorDiv.style.display = 'block';
            }
          });
          
          sendCodeBtn.addEventListener('click', async () => {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
            sendCodeBtn.disabled = true;
            sendCodeBtn.textContent = 'Sending...';
            
            try {
              const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
              });
              
              const data = await res.json();
              
              if (!res.ok) {
                throw new Error(data.error || 'Failed to send code');
              }
              
              currentChallenge = data.challenge;
              passwordForm.style.display = 'none';
              divider.style.display = 'none';
              sendCodeView.style.display = 'none';
              otpForm.style.display = 'flex';
              otpInput.focus();
            } catch (err) {
              errorDiv.textContent = err.message;
              errorDiv.style.display = 'block';
              sendCodeBtn.disabled = false;
              sendCodeBtn.textContent = 'Send login code to email';
            }
          });
          
          backBtn.addEventListener('click', () => {
            otpForm.style.display = 'none';
            passwordForm.style.display = 'flex';
            divider.style.display = 'flex';
            sendCodeView.style.display = 'block';
            sendCodeBtn.disabled = false;
            sendCodeBtn.textContent = 'Send login code to email';
            errorDiv.style.display = 'none';
          });
          
          otpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
            
            try {
              const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ challenge: currentChallenge, otp: otpInput.value })
              });
              
              const data = await res.json();
              
              if (!res.ok) {
                throw new Error(data.error || 'Verification failed');
              }
              
              window.location.href = '/dashboard';
            } catch (err) {
              errorDiv.textContent = err.message;
              errorDiv.style.display = 'block';
            }
          });
          
          otpInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
          });
        })();
      ` }} />
    </div>
  )
}
