// API URL
const API_URL = 'http://localhost:5001/api';

// Test server connection
async function testConnection() {
    try {
        const response = await fetch(`${API_URL}/test`);
        const data = await response.json();
        console.log('Server connection test:', data.message);
        return true;
    } catch (error) {
        console.error('Server connection error:', error);
        return false;
    }
}

// DOM Elements
const authButtons = document.getElementById('authButtons');
const userInfo = document.getElementById('userInfo');
const welcomeMessage = document.getElementById('welcomeMessage');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const reindeerManagement = document.getElementById('reindeerManagement');
const reindeerList = document.getElementById('reindeerList');
const addReindeerForm = document.getElementById('addReindeerForm');

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        authButtons.classList.add('d-none');
        userInfo.classList.remove('d-none');
        reindeerManagement.classList.remove('d-none');
        const username = localStorage.getItem('username');
        welcomeMessage.textContent = `Welcome, ${username}!`;
        fetchReindeers();
    } else {
        authButtons.classList.remove('d-none');
        userInfo.classList.add('d-none');
        reindeerManagement.classList.add('d-none');
    }
}

// Show/Hide Forms
function showLoginForm() {
    loginForm.classList.remove('d-none');
    registerForm.classList.add('d-none');
}

function showRegisterForm() {
    registerForm.classList.remove('d-none');
    loginForm.classList.add('d-none');
}

function showAddReindeerForm() {
    addReindeerForm.classList.toggle('d-none');
}

// Auth Functions
async function register(event) {
    event.preventDefault();
    
    if (!(await testConnection())) {
        alert('Cannot connect to server. Please make sure the server is running.');
        return;
    }

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);
            checkAuth();
            registerForm.classList.add('d-none');
            alert('Registration successful! Welcome to Reindeer Registry.');
        } else {
            alert(data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Error connecting to the server. Please make sure the server is running.');
    }
}

async function login(event) {
    event.preventDefault();

    if (!(await testConnection())) {
        alert('Cannot connect to server. Please make sure the server is running.');
        return;
    }

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);
            checkAuth();
            loginForm.classList.add('d-none');
            alert('Login successful! Welcome back.');
        } else {
            if (data.errors) {
                const errorMessages = data.errors.map(error => error.msg).join('\n');
                alert(`Login failed:\n${errorMessages}`);
            } else {
                alert(data.message || 'Login failed. Please check your credentials.');
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Error connecting to the server. Please make sure the server is running.');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    checkAuth();
}

// Reindeer Functions
async function fetchReindeers() {
    try {
        const response = await fetch(`${API_URL}/reindeers`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const reindeers = await response.json();
        displayReindeers(reindeers);
    } catch (error) {
        alert('Error fetching reindeers');
    }
}

function displayReindeers(reindeers) {
    reindeerList.innerHTML = reindeers.map(reindeer => `
        <div class="col-md-4">
            <div class="card reindeer-card">
                <div class="card-body">
                    <h5 class="card-title">${reindeer.name}</h5>
                    <p class="card-text">
                        Age: ${reindeer.age}<br>
                        Gender: ${reindeer.gender}<br>
                        Weight: ${reindeer.weight} kg
                    </p>
                    ${reindeer.description ? `<p class="card-text">${reindeer.description}</p>` : ''}
                    <div class="reindeer-actions">
                        <button class="btn btn-outline-danger btn-sm" onclick="editReindeer('${reindeer._id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteReindeer('${reindeer._id}')">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

async function addReindeer(event) {
    event.preventDefault();
    const reindeerData = {
        name: document.getElementById('reindeerName').value,
        age: parseInt(document.getElementById('reindeerAge').value),
        gender: document.getElementById('reindeerGender').value,
        weight: parseFloat(document.getElementById('reindeerWeight').value),
        description: document.getElementById('reindeerDescription').value
    };

    try {
        const response = await fetch(`${API_URL}/reindeers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(reindeerData)
        });

        if (response.ok) {
            event.target.reset();
            addReindeerForm.classList.add('d-none');
            fetchReindeers();
        } else {
            const data = await response.json();
            alert(data.message || 'Error adding reindeer');
        }
    } catch (error) {
        alert('Error adding reindeer');
    }
}

async function deleteReindeer(id) {
    if (!confirm('Are you sure you want to delete this reindeer?')) return;

    try {
        const response = await fetch(`${API_URL}/reindeers/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            // Refresh the reindeer list
            fetchReindeers();
            // Show success message
            alert('Reindeer successfully deleted');
        } else {
            alert(data.message || 'Error deleting reindeer');
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting reindeer. Please try again.');
    }
}

async function editReindeer(id) {
    // Implementation for editing reindeer (you can add this functionality later)
    alert('Edit functionality coming soon!');
}

// Initialize
checkAuth(); 