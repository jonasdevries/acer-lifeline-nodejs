document.getElementById('reset-password-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const messageDiv = document.getElementById('message');

    if (password !== confirmPassword) {
        messageDiv.style.display = 'block';
        messageDiv.textContent = 'Passwords do not match';
        messageDiv.className = 'error';
        return;
    }

    try {
        const response = await fetch(`/api/password-reset/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });

        const result = await response.json();
        if (response.ok) {
            messageDiv.style.display = 'block';
            messageDiv.textContent = 'Password reset successful';
            messageDiv.className = 'success';
        } else {
            messageDiv.style.display = 'block';
            messageDiv.textContent = result.error || 'An error occurred';
            messageDiv.className = 'error';
        }
    } catch (error) {
        messageDiv.style.display = 'block';
        messageDiv.textContent = 'An error occurred';
        messageDiv.className = 'error';
    }
});
