document.addEventListener('DOMContentLoaded', async () => {
    const loginModal = document.getElementById('loginModal');
    const mainUI = document.getElementById('mainUI');
    const loginBtn = document.getElementById('loginBtn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');
  
    const token = localStorage.getItem('todo-api-token');
    // PM2 Management actions (pull, restart, stop, logs, revert)
    const tokenHeader = () => ({ 'Authorization': `Bearer ${localStorage.getItem('todo-api-token')}` });
  
    const authenticateUser = async () => {
      try {
        const response = await fetch('/api/auth/auth-check', {
          method: 'GET',
          headers: { ...tokenHeader(), 'Content-Type': 'application/json' }
        });        
        if (response.ok) {
          loginModal.style.display = 'none';
          mainUI.style.display = 'block';
        } else {
          loginModal.style.display = 'block';
        }
      } catch (err) {
        loginModal.style.display = 'block';
      }
    };
  
    // If token exists, check authentication
    if (token) {
      console.log('authing since we have token', token)
      await authenticateUser();
    } else {
      loginModal.style.display = 'block';
    }
  
    // Handle login
    loginBtn.addEventListener('click', async () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      if (!email || !password) {
        loginError.textContent = 'Email and password are required';
        return;
      }
  
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
  
        const result = await response.json();
        if (result.ok) {
          // Store token in localStorage and hide login modal
          localStorage.setItem('todo-api-token', result.data.token);
          loginModal.style.display = 'none';
          mainUI.style.display = 'block';
        } else {
          loginError.textContent = 'Login failed. Check your credentials.';
        }
      } catch (err) {
        loginError.textContent = 'An error occurred. Try again later.';
      }
    });
  
    
    //const pullChangesBtn = document.getElementById('pullChangesBtn');
    const restartServerBtn = document.getElementById('restartServerBtn');
    const stopServerBtn = document.getElementById('stopServerBtn');
    const viewLogsBtn = document.getElementById('viewLogsBtn');
    const revertCommitBtn = document.getElementById('revertCommitBtn');
    const logsOutput = document.getElementById('logsOutput');
    const commitHash = document.getElementById('commitHash');
    const responseMessage = document.getElementById('responseMessage');
  
    const showMessage = (message, success = true) => {
      responseMessage.textContent = message;
      responseMessage.style.color = success ? 'green' : 'red';
    };
  
    // Example: Pull changes
    pullChangesBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('/api/pm2/pull', {
          method: 'POST',
          headers: { ...tokenHeader(), 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        showMessage(result.message, result.ok);
      } catch (err) {
        showMessage('Failed to pull changes', false);
      }
    });
    // Restart server
  restartServerBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('/api/pm2/restart', {
        method: 'POST',
        headers: {...tokenHeader(), 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      showMessage(result.message, result.ok);
    } catch (err) {
      showMessage('Failed to restart server', false);
    }
  });

  // Stop server
  stopServerBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('/api/pm2/stop', {
        method: 'POST',
        headers: {...tokenHeader(),  'Content-Type': 'application/json' },
      });
      const result = await response.json();
      console.log('result', result)
      showMessage(result.message, result.ok);
    } catch (err) {
      showMessage('Failed to stop server', false);
    }
  });

  // View logs
  viewLogsBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('/api/pm2/logs', {
        method: 'GET',
        headers: { ...tokenHeader(), 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (result.ok) {
        logsOutput.textContent = result.logs;
      } else {
        showMessage('Failed to retrieve logs', false);
      }
    } catch (err) {
      showMessage('Failed to retrieve logs', false);
    }
  });

  // Revert to a previous commit
  revertCommitBtn.addEventListener('click', async () => {
    const commit = commitHash.value.trim();
    if (!commit) {
      showMessage('Please enter a commit hash', false);
      return;
    }

    try {
      const response = await fetch('/api/pm2/revert', {
        method: 'POST',
        headers: { ...tokenHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ commit }),
      });
      const result = await response.json();
      showMessage(result.message, result.ok);
    } catch (err) {
      showMessage('Failed to revert commit', false);
    }
  });

  
});
  
  