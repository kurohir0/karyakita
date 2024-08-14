const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});




// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})


const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})


if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})

// Get modal elements
var modal = document.getElementById("myModal");
var btn = document.getElementById("openModalBtn");
var span = document.getElementsByClassName("close")[0];

// Open the modal when the button is clicked
btn.onclick = function() {
	modal.style.display = "block";
}

// Close the modal when the "x" is clicked
span.onclick = function() {
	modal.style.display = "none";
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

// Handle form submission
document.getElementById('submissionForm').addEventListener('submit', function(e) {
	e.preventDefault();

	// Get form values
	var projectName = document.getElementById('projectName').value;
	var category = document.getElementById('category').value;
	var projectDesc = document.getElementById('projectDesc').value;
	var fileUpload = document.getElementById('fileUpload').value;
	
	// Get the current date
	var submitDate = new Date().toLocaleDateString('en-GB'); // Format DD-MM-YYYY

	// Determine status based on file type (Example logic)
	var status = fileUpload.endsWith('.mp4') ? 'Pending' : 'Completed';

	// Add new row to the table
	var table = document.getElementById('submissionTable').getElementsByTagName('tbody')[0];
	var newRow = table.insertRow();
	newRow.innerHTML = `
		<td>${projectName}</td>
		<td>${projectDesc}</td>
		<td>${category}</td>
		<td>${submitDate}</td>
		<td><span class="status ${status.toLowerCase()}">${status}</span></td>
	`;

	// Close the modal
	modal.style.display = "none";

	// Reset the form
	document.getElementById('submissionForm').reset();
});


const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})