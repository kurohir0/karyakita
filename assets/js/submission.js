document.addEventListener('DOMContentLoaded', function () {
    // Fungsi untuk memformat tanggal ke format YYYY-MM-DD
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    // Ambil username pengguna yang sedang login dari localStorage
    const currentUser = localStorage.getItem('loggedInUser'); // Mendapatkan username pengguna yang sedang login

    // Fungsi untuk memuat data dari localStorage ke tabel (versi pengguna)
    function loadUserData(filterCategory = 'all') {
        const tableBody = document.querySelector('#submissionTable tbody');
        const submissions = Object.keys(localStorage)
            .filter(key => key.startsWith('submission_'))
            .map(key => JSON.parse(localStorage.getItem(key)))
            .filter(submission => submission.username === currentUser); // Hanya data dari pengguna yang sedang login

        tableBody.innerHTML = ''; // Kosongkan tabel sebelum menambahkan data baru

        submissions.forEach(submission => {
            if (filterCategory === 'all' || submission.category === filterCategory) {
                const statusClass = submission.status === 'Tertunda' ? 'badge bg-warning text-dark' : 'badge bg-success';
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${submission.projectName}</td>
                    <td>${submission.category}</td>
                    <td>${submission.dateSubmitted}</td>
                    <td><span class="badge ${statusClass}">${submission.status}</span></td>
                `;
                tableBody.appendChild(newRow);
            }
        });
    }

    // Fungsi untuk memuat data dari localStorage ke tabel (versi admin)
    function loadAdminData(filterCategory = 'all') {
        const tableBody = document.querySelector('#submissionTableAdmin tbody');
        const submissions = Object.keys(localStorage)
            .filter(key => key.startsWith('submission_'))
            .map(key => JSON.parse(localStorage.getItem(key)));

        tableBody.innerHTML = ''; // Kosongkan tabel sebelum menambahkan data baru

        submissions.forEach(submission => {
            if (filterCategory === 'all' || submission.category === filterCategory) {
                const statusClass = submission.status === 'Tertunda' ? 'badge bg-warning text-dark' : 'badge bg-success';
                const actionButtons = submission.status === 'Tertunda' ? `
                    <button class="btn btn-sm btn-success" onclick="approveSubmission('${submission.id}')">
                        <i class='bx bx-check'></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="rejectSubmission('${submission.id}')">
                        <i class='bx bx-x'></i>
                    </button>
                ` : '';

                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${submission.username}</td>
                    <td>${submission.projectName}</td>
                    <td>${submission.category}</td>
                    <td>${submission.dateSubmitted}</td>
                    <td><span class="badge ${statusClass}">${submission.status}</span></td>
                    <td>${actionButtons}</td>
                `;
                tableBody.appendChild(newRow);
            }
        });
    }

    // Fungsi untuk menyetujui submission (mengubah status menjadi 'Selesai')
    window.approveSubmission = function (submissionId) {
        const submission = JSON.parse(localStorage.getItem(submissionId));
        if (submission) {
            submission.status = 'Selesai';
            localStorage.setItem(submissionId, JSON.stringify(submission));
            loadAdminData(); // Perbarui tampilan tabel admin
        }
    }

    // Fungsi untuk menolak submission (menghapus dari localStorage)
    window.rejectSubmission = function (submissionId) {
        localStorage.removeItem(submissionId);
        loadAdminData(); // Perbarui tampilan tabel admin
    }

    // Panggil fungsi loadUserData atau loadAdminData sesuai dengan halaman yang dimuat
    if (document.querySelector('#submissionTable')) {
        loadUserData(); // Untuk versi pengguna
    } else if (document.querySelector('#submissionTableAdmin')) {
        loadAdminData(); // Untuk versi admin
    }

    // Tangani submit form submission
    document.getElementById('submissionForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Mencegah form dari reload halaman

        // Ambil data dari form
        const username = localStorage.getItem('loggedInUser'); // Ambil username dari session atau localStorage
        const projectName = document.getElementById('projectName').value;
        const category = document.getElementById('category').value;

        // Buat objek data submission
        const newSubmission = {
            id: `submission_${new Date().getTime()}`, // ID unik
            username,
            projectName,
            category,
            dateSubmitted: formatDate(new Date()), // Format tanggal
            status: 'Tertunda' // Status default
        };

        // Simpan data ke localStorage
        localStorage.setItem(newSubmission.id, JSON.stringify(newSubmission));

        // Kosongkan form
        document.getElementById('submissionForm').reset();

        // Tutup modal setelah submit
        var myModal = new bootstrap.Modal(document.getElementById('submissionModal'));
        myModal.hide();

        // Perbarui tampilan tabel sesuai dengan halaman yang aktif
        if (document.querySelector('#submissionTable')) {
            loadUserData(); // Untuk versi pengguna
        } else if (document.querySelector('#submissionTableAdmin')) {
            loadAdminData(); // Untuk versi admin
        }
    });

    // Tangani submit form filter
    document.getElementById('filterForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Mencegah form dari reload halaman

        // Ambil data dari form filter
        const categoryFilter = document.getElementById('categoryFilter').value;

        // Panggil fungsi loadUserData atau loadAdminData sesuai dengan halaman yang dimuat
        if (document.querySelector('#submissionTable')) {
            loadUserData(categoryFilter); // Untuk versi pengguna
        } else if (document.querySelector('#submissionTableAdmin')) {
            loadAdminData(categoryFilter); // Untuk versi admin
        }

        // Tutup modal setelah filter diterapkan
        var filterModal = new bootstrap.Modal(document.getElementById('filterModal'));
        filterModal.hide();
    });
});