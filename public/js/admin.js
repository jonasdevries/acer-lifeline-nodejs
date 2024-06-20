document.getElementById('create-user-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const messageDiv = document.getElementById('message');

    try {
        const response = await fetch('/api/admin/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, role: 'user' })
        });

        const result = await response.json();
        if (response.ok) {
            messageDiv.style.display = 'block';
            messageDiv.textContent = 'User created and invitation sent';
            messageDiv.className = 'success';
            fetchUsers();
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

async function fetchUsers() {
    const response = await fetch('/api/admin/users');
    const users = await response.json();
    const tbody = document.getElementById('users-table').querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><button class="delete-button" data-id="${user.id}">Delete</button></td>
        `;
        tbody.appendChild(row);
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', async function() {
            const userId = this.getAttribute('data-id');
            await deleteUser(userId);
            fetchUsers();
        });
    });
}

async function deleteUser(userId) {
    try {
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error deleting user');
        }
    } catch (error) {
        console.error(error);
        alert('Failed to delete user');
    }
}

// Fetch and display users on page load
fetchUsers();
