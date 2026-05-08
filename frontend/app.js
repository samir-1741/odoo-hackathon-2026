// ===== API BASE URL =====
const API_URL = 'http://localhost:5000/api';

// ===== LOAD ALL ITEMS =====
async function loadItems() {
    try {
        const response = await fetch(`${API_URL}/items`);
        const items = await response.json();

        const container = document.getElementById('itemsList');

        if (items.length === 0) {
            container.innerHTML = '<p>No items found. Add some!</p>';
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="item-card">
                <h3>${item.name}</h3>
                <p>${item.description || 'No description'}</p>
                <button class="btn-danger" onclick="deleteItem(${item.id})">
                    🗑️ Delete
                </button>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading items:', error);
        document.getElementById('itemsList').innerHTML = 
            '<p style="color:red">❌ Server not connected. Start backend first!</p>';
    }
}

// ===== ADD ITEM =====
async function addItem() {
    const name = document.getElementById('itemName').value.trim();
    const desc = document.getElementById('itemDesc').value.trim();
    const msg = document.getElementById('formMessage');

    // Validate input
    if (!name) {
        msg.textContent = '❌ Name is required!';
        msg.className = 'message error';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description: desc })
        });

        const data = await response.json();

        if (response.ok) {
            msg.textContent = '✅ Item added successfully!';
            msg.className = 'message success';
            document.getElementById('itemName').value = '';
            document.getElementById('itemDesc').value = '';
            loadItems(); // Refresh list
        } else {
            msg.textContent = `❌ ${data.error}`;
            msg.className = 'message error';
        }

    } catch (error) {
        msg.textContent = '❌ Server not connected!';
        msg.className = 'message error';
    }
}

// ===== DELETE ITEM =====
async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
        await fetch(`${API_URL}/items/${id}`, { method: 'DELETE' });
        loadItems(); // Refresh list
    } catch (error) {
        alert('❌ Could not delete. Server not connected!');
    }
}

// ===== LOAD ON PAGE START =====
window.onload = loadItems;
