// Fungsi untuk registrasi user
function registerUser() {
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirm_password = document.getElementById('regConfirm_password').value;
    const userType = document.getElementById('userType').value;

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
            password: password,
            type: userType // Simpan jenis pengguna
        };
        localStorage.setItem(username, JSON.stringify(user));
        alert('Registrasi berhasil! - Silakan login di sini...');
        window.location.href = '/karyakita/assets/pages/login.html'; // Redirect ke halaman login setelah registrasi
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
            if (user.type === 'admin') {
                window.location.href = '/karyakita/assets/pages/dashboard_admin.html'; // Redirect ke halaman dashboard admin
            } else {
                window.location.href = '/karyakita/assets/pages/dashboard_mahasiswa.html'; // Redirect ke halaman dashboard mahasiswa
            }
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
    window.location.href = '/karyakita/index.html'; // Redirect ke halaman login setelah logout
}

// Fungsi untuk menampilkan greeting di halaman Dashboard
function displayGreeting() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const greetingElement = document.getElementById('greeting');
        greetingElement.textContent = `Selamat datang, ${loggedInUser}!`;
    } else {
        window.location.href = '/karyakita/assets/pages/login.html'; // Redirect ke halaman login jika tidak ada pengguna yang login
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

// Menghitung jumlah users
function updateUserCount() {
    const allKeys = Object.keys(localStorage);

    // Memfilter kunci yang menyimpan data pengguna yang valid
    const userKeys = allKeys.filter(key => {
        const value = localStorage.getItem(key);
        try {
            // Coba parse nilai dan cek jika itu objek dengan key 'email'
            const user = JSON.parse(value);
            return user && user.email; // Pastikan data memiliki 'email' atau properti yang relevan
        } catch (e) {
            return false; // Jika parsing gagal, kunci ini bukan data pengguna
        }
    });

    // Memperbarui elemen dengan ID totalUsers
    const totalUsersElement = document.getElementById('totalUsers');
    if (totalUsersElement) {
        totalUsersElement.textContent = userKeys.length;
    }

    // // Menampilkan jumlah pengguna dan daftar kunci
    // console.log('Jumlah pengguna:', userKeys.length);
    // console.log('Daftar kunci pengguna:', userKeys);

    // Mengembalikan jumlah pengguna jika diperlukan
    return userKeys.length;
}

// Panggil fungsi ini untuk memperbarui jumlah pengguna ketika halaman dashboard admin dimuat
updateUserCount();

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

// Fungsi untuk memuat data pengguna yang sedang login ke form pengaturan
function loadUserData() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const user = JSON.parse(localStorage.getItem(loggedInUser));
        document.getElementById('username').value = loggedInUser;
        document.getElementById('password').value = user.password;
        document.getElementById('email').value = user.email;
        document.getElementById('usertype').textContent = user.type;
    } else {
        window.location.href = '/karyakita/assets/pages/login.html'; // Redirect ke halaman login jika tidak ada pengguna yang login
    }
}

// Fungsi untuk menyimpan data yang diedit
function saveUserData() {
    const oldUsername = localStorage.getItem('loggedInUser'); // Ambil username lama
    const newUsername = document.getElementById('username').value.trim();
    const newPassword = document.getElementById('password').value.trim();
    const newEmail = document.getElementById('email').value.trim();

    if (!newUsername || !newPassword || !newEmail) {
        alert('Semua field harus diisi!');
        return;
    }

    if (newUsername !== oldUsername && localStorage.getItem(newUsername)) {
        alert('Username baru sudah digunakan!');
        return;
    }

    const user = {
        email: newEmail,
        password: newPassword,
        type: JSON.parse(localStorage.getItem(oldUsername)).type // Pertahankan jenis pengguna
    };

    // Simpan data baru
    localStorage.setItem(newUsername, JSON.stringify(user));

    if (newUsername !== oldUsername) {
        localStorage.removeItem(oldUsername); // Hapus data pengguna lama jika username berubah
        localStorage.setItem('loggedInUser', newUsername); // Perbarui sesi pengguna
    }

    alert('Data berhasil disimpan!');
}

// // Pastikan untuk memanggil fungsi loadUserData ketika halaman dimuat
// window.onload = function() {
//     loadUserData();
// };

window.onload = function() {
    // Cari elemen dengan kelas 'loadUserPage'
    const userPages = document.querySelectorAll('.loadUserPage');

    // Jika elemen dengan kelas 'loadUserPage' ada, panggil loadUserData()
    if (userPages.length > 0) {
        loadUserData();
    }
};