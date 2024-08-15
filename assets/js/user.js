// Fungsi untuk registrasi user
function registerUser() {
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirm_password = document.getElementById('regConfirm_password').value;

    if (!username || !email || !password || !confirm_password) {
        alert('Semua field harus diisi!');
        return;
    }

    if (password !== confirm_password) {
        alert('Password dan Konfirmasi Password tidak cocok!');
        return;
    }

    if (localStorage.getItem(username)) {
        alert('Username sudah terdaftar!');
    } else {
        const user = {
            email: email,
            password: password
        };
        localStorage.setItem(username, JSON.stringify(user));
        alert('Registrasi berhasil! - Silakan login di sini...');
        window.location.href = 'login.html'; // Redirect ke halaman login setelah registrasi
    }
}

// Fungsi untuk login user
function loginUser() {
    const username = document.getElementById('logUsername').value;
    const password = document.getElementById('logPassword').value;

    if (!username || !password) {
        alert('Username dan Password harus diisi!');
        return;
    }

    const storedUser = localStorage.getItem(username);

    if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.password === password) {
            alert('Login berhasil!');
            localStorage.setItem('loggedInUser', username); // Simpan data sesi pengguna yang sedang login
            window.location.href = 'dashboard.html'; // Redirect ke halaman dashboard setelah login
        } else {
            alert('Password salah!');
        }
    } else {
        alert('Username tidak ditemukan!');
    }
}

// Fungsi untuk logout user
function logoutUser() {
    localStorage.removeItem('loggedInUser'); // Hapus data sesi pengguna yang sedang login
    alert('Anda telah logout.');
    window.location.href = '/assets/pages/login.html'; // Redirect ke halaman login setelah logout
}

// Fungsi untuk menampilkan greeting di halaman Dashboard
function displayGreeting() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const greetingElement = document.getElementById('greeting');
        greetingElement.textContent = `Selamat datang, ${loggedInUser}!`;
    } else {
        window.location.href = '/assets/pages/login.html'; // Redirect ke halaman login jika tidak ada pengguna yang login
    }
}

// Fungsi untuk menampilkan semua user terdaftar dalam format tabel
function displayRegisteredUsers() {
    const users = Object.keys(localStorage).filter(key => key !== 'loggedInUser');
    const userTable = document.getElementById('userTable');

    userTable.innerHTML = '';

    if (users.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.classList.add('table-light');
        emptyRow.innerHTML = '<td colspan="3" class="text-center">Belum ada user yang terdaftar.</td>';
        userTable.appendChild(emptyRow);
        return;
    }

    // Membuat header tabel
    const headerRow = document.createElement('tr');
    headerRow.classList.add('table-dark'); // Menambahkan kelas Bootstrap pada <tr>
    headerRow.innerHTML = `
        <th class="table-light">Username</th>
        <th class="table-light">Password</th>
        <th class="table-light">Email</th>
        <th class="table-light">Aksi</th>
    `;
    userTable.appendChild(headerRow);

    users.forEach(function(username) {
        const user = JSON.parse(localStorage.getItem(username));
        if (user && user.email && user.password) { // Pastikan data user valid
            const row = document.createElement('tr');
            row.classList.add('table-light'); // Menambahkan kelas Bootstrap pada <tr>

            row.innerHTML = `
                <td class="table-light">${username}</td>
                <td class="table-light">${user.password}</td>
                <td class="table-light">${user.email}</td>
                <td class="table-light">
                    <button type="button" class="btn btn-primary edit" onclick="editUser('${username}')">Edit</button>
                    <button type="button" class="btn btn-danger delete" onclick="deleteUser('${username}')">Hapus</button>
                </td>
            `;
            userTable.appendChild(row);
        }
    });
}

// Fungsi untuk menghapus user dari localStorage
function deleteUser(username) {
    if (confirm(`Apakah Anda yakin ingin menghapus user ${username}?`)) {
        localStorage.removeItem(username);
        displayRegisteredUsers(); // Refresh daftar user setelah penghapusan
    }
}

// Fungsi untuk mengedit user di localStorage
function editUser(username) {
    const newPassword = prompt(`Masukkan password baru untuk user ${username}:`);
    if (newPassword) {
        const user = JSON.parse(localStorage.getItem(username));
        user.password = newPassword;
        localStorage.setItem(username, JSON.stringify(user));
        displayRegisteredUsers(); // Refresh daftar user setelah pengeditan
    }
}