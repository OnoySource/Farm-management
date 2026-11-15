
/* =========================
   CONFIGURATION
========================= */

// Versi baru agar data simulasi terbaru tidak tertimpa
// oleh data lama di Local Storage.
const STORAGE_KEY = "kinerjaku_employees_v2";

const weights = {
    productivity: 0.30,
    discipline: 0.20,
    quality: 0.20,
    digital: 0.15,
    teamwork: 0.15
};

const departments = [
    "Pemilik Usaha",
    "Manajemen",
    "Produksi / Kandang",
    "Sortir & Packing",
    "Pemasaran",
    "Keuangan",
    "Distribusi"
];


/* =========================
   INITIAL DATA
   DATA SIMULASI
========================= */

const initialEmployees = [
    {
        id: 1,
        name: "KH Ahmad Munawir SQ",
        department: "Pemilik Usaha",
        positions: ["Pemilik Usaha"],
        workSystem: "Harian",
        productivity: 95,
        discipline: 95,
        quality: 95,
        digital: 85,
        teamwork: 95
    },
    {
        id: 2,
        name: "Tahmid",
        department: "Manajemen",
        positions: ["Manager"],
        workSystem: "Harian",
        productivity: 92,
        discipline: 95,
        quality: 90,
        digital: 88,
        teamwork: 94
    },
    {
        id: 3,
        name: "Trio Novrian",
        department: "Produksi / Kandang",
        positions: ["Produksi"],
        workSystem: "Harian",
        productivity: 90,
        discipline: 88,
        quality: 92,
        digital: 75,
        teamwork: 90
    },
    {
        id: 4,
        name: "Meiva",
        department: "Sortir & Packing",
        positions: [
            "Sortir & Packing",
            "Pemasaran",
            "Keuangan"
        ],
        workSystem: "Harian",
        productivity: 94,
        discipline: 90,
        quality: 96,
        digital: 85,
        teamwork: 92
    },
    {
        id: 5,
        name: "Olivia",
        department: "Pemasaran",
        positions: ["Pemasaran"],
        workSystem: "Harian",
        productivity: 89,
        discipline: 85,
        quality: 88,
        digital: 95,
        teamwork: 90
    },
    {
        id: 6,
        name: "Hj. Suparti",
        department: "Keuangan",
        positions: ["Keuangan"],
        workSystem: "Harian",
        productivity: 91,
        discipline: 94,
        quality: 95,
        digital: 90,
        teamwork: 91
    },
    {
        id: 7,
        name: "Ahmad Rizki",
        department: "Distribusi",
        positions: ["Distribusi / Driver"],
        workSystem: "Harian",
        productivity: 78,
        discipline: 80,
        quality: 82,
        digital: 70,
        teamwork: 85
    }
];


/* =========================
   LOCAL STORAGE
========================= */

function loadEmployees() {

    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved === null) {
            return initialEmployees.map(item => ({
                ...item,
                positions: [...item.positions]
            }));
        }

        const data = JSON.parse(saved);

        if (!Array.isArray(data)) {
            throw new Error("Format data tidak valid");
        }

        return data.map(employee => ({
            ...employee,
            positions: Array.isArray(employee.positions)
                ? employee.positions
                : [employee.department],
            workSystem: employee.workSystem || "Harian"
        }));

    } catch (error) {

        console.error("Gagal membaca data:", error);

        return initialEmployees.map(item => ({
            ...item,
            positions: [...item.positions]
        }));

    }

}


let employees = loadEmployees();


function saveEmployees() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(employees)
        );

        return true;

    } catch (error) {

        console.error("Gagal menyimpan data:", error);

        alert(
            "Data gagal disimpan. Periksa penyimpanan browser."
        );

        return false;

    }

}


/* =========================
   ELEMENTS
========================= */

const $ = id => document.getElementById(id);

const employeeTable = $("employeeTable");
const employeeForm = $("employeeForm");
const employeeModal = $("employeeModal");

let editingId = null;


/* =========================
   HELPER
========================= */

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);

}


function getInitials(name) {

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word[0])
        .join("")
        .toUpperCase();

}


function getPositions(employee) {

    return Array.isArray(employee.positions)
        ? employee.positions
        : [employee.department];

}


/* =========================
   SCORE CALCULATION
========================= */

function calculateScore(employee) {

    const score =
        employee.productivity * weights.productivity +
        employee.discipline * weights.discipline +
        employee.quality * weights.quality +
        employee.digital * weights.digital +
        employee.teamwork * weights.teamwork;

    return Math.round(score * 100) / 100;

}


/* =========================
   PERFORMANCE STATUS
========================= */

function getStatus(score) {

    if (score >= 90) {
        return {
            label: "Sangat Baik",
            className: "excellent"
        };
    }

    if (score >= 80) {
        return {
            label: "Baik",
            className: "good"
        };
    }

    if (score >= 70) {
        return {
            label: "Cukup",
            className: "average"
        };
    }

    return {
        label: "Perlu Evaluasi",
        className: "poor"
    };

}


/* =========================
   RENDER EMPLOYEE TABLE
========================= */

function renderEmployees() {

    const search = $("searchInput").value
        .toLowerCase()
        .trim();

    const department = $("departmentFilter").value;

    const filtered = employees.filter(employee => {

        const positions = getPositions(employee);

        const nameMatch = employee.name
            .toLowerCase()
            .includes(search);

        const departmentMatch =
            !department ||
            employee.department === department ||
            positions.includes(department);

        return nameMatch && departmentMatch;

    });


    employeeTable.innerHTML = "";


    if (filtered.length === 0) {

        employeeTable.innerHTML = `
            <tr>
                <td colspan="10" style="text-align:center;padding:30px">
                    Tidak ada data karyawan ditemukan.
                </td>
            </tr>
        `;

    }


    filtered.forEach(employee => {

        const score = calculateScore(employee);

        const status = getStatus(score);

        const row = document.createElement("tr");

        const positions = getPositions(employee);

        row.innerHTML = `
            <td>
                <div class="employee-name">

                    <div class="employee-avatar">
                        ${escapeHTML(getInitials(employee.name))}
                    </div>

                    <div class="employee-details">
                        <strong>${escapeHTML(employee.name)}</strong>
                        <span>ID-${employee.id}</span>
                    </div>

                </div>
            </td>

            <td>
                <strong>${escapeHTML(employee.department)}</strong>

                <small style="display:block;margin-top:4px;color:#64748b">
                    ${positions.map(escapeHTML).join(", ")}
                </small>

                <small style="display:block;margin-top:3px;color:#0d8bb5">
                    Sistem ${escapeHTML(employee.workSystem || "Harian")}
                </small>
            </td>

            <td>${employee.productivity}</td>
            <td>${employee.discipline}</td>
            <td>${employee.quality}</td>
            <td>${employee.digital}</td>
            <td>${employee.teamwork}</td>

            <td>
                <strong class="score">${score}</strong>
            </td>

            <td>
                <span class="status ${status.className}">
                    ${status.label}
                </span>
            </td>

            <td>
                <div class="action-group">

                    <button
                        class="action-btn"
                        data-edit="${employee.id}"
                        title="Edit"
                    >
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                        class="action-btn delete"
                        data-delete="${employee.id}"
                        title="Hapus"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>
            </td>
        `;

        employeeTable.appendChild(row);

    });


    $("tableInfo").textContent =
        `Menampilkan ${filtered.length} dari ${employees.length} karyawan`;

    updateDashboard();
    updateReports();

}


/* =========================
   DASHBOARD STATISTICS
========================= */

function updateDashboard() {

    const total = employees.length;

    const scores = employees.map(calculateScore);

    const sum = scores.reduce((a, b) => a + b, 0);

    const average = total
        ? (sum / total).toFixed(1)
        : "0.0";

    const excellent = scores.filter(
        score => score >= 90
    ).length;

    const evaluation = scores.filter(
        score => score < 70
    ).length;


    $("totalEmployees").textContent = total;

    $("averageScore").textContent = average;

    $("excellentEmployees").textContent = excellent;

    $("needsEvaluation").textContent = evaluation;

}


/* =========================
   REPORT
========================= */

function updateReports() {

    const groups = [
        {
            label: "Sangat Baik",
            count: 0
        },
        {
            label: "Baik",
            count: 0
        },
        {
            label: "Cukup",
            count: 0
        },
        {
            label: "Perlu Evaluasi",
            count: 0
        }
    ];


    employees.forEach(employee => {

        const score = calculateScore(employee);

        if (score >= 90) groups[0].count++;
        else if (score >= 80) groups[1].count++;
        else if (score >= 70) groups[2].count++;
        else groups[3].count++;

    });


    const total = employees.length || 1;


    $("performanceReport").innerHTML = groups.map(group => {

        const percent = (group.count / total) * 100;

        return `
            <div class="report-row">

                <div class="report-label">
                    <span>${group.label}</span>
                    <strong>${group.count} orang</strong>
                </div>

                <div class="progress">
                    <span style="width:${percent}%"></span>
                </div>

            </div>
        `;

    }).join("");


    // Laporan bagian menghitung jabatan rangkap juga.
    $("departmentReport").innerHTML = departments.map(department => {

        const members = employees.filter(employee => {

            return employee.department === department ||
                getPositions(employee).includes(department);

        });

        const average = members.length
            ? members.reduce((sum, employee) =>
                sum + calculateScore(employee), 0
            ) / members.length
            : 0;

        const value = average.toFixed(1);

        return `
            <div class="report-row">

                <div class="report-label">
                    <span>${department}</span>
                    <strong>${value}</strong>
                </div>

                <div class="progress">
                    <span style="width:${average}%"></span>
                </div>

            </div>
        `;

    }).join("");

}


/* =========================
   MODAL
========================= */

function openModal() {

    employeeModal.classList.add("show");

}


function closeModal() {

    employeeModal.classList.remove("show");

    employeeForm.reset();

    editingId = null;

    $("modalTitle").textContent = "Tambah Penilaian";

    $("scorePreview").textContent = "0 / 100";

    // Reset field tambahan jika tersedia.
    if ($("employeePositions")) {
        $("employeePositions").value = "";
    }

    if ($("employeeWorkSystem")) {
        $("employeeWorkSystem").value = "Harian";
    }

}


$("addEmployeeBtn").addEventListener("click", () => {

    closeModal();

    openModal();

});


$("closeModal").addEventListener("click", closeModal);

$("cancelModal").addEventListener("click", closeModal);


employeeModal.addEventListener("click", event => {

    if (event.target === employeeModal) {
        closeModal();
    }

});


/* =========================
   SCORE PREVIEW
========================= */

const scoreFields = [
    "productivity",
    "discipline",
    "quality",
    "digital",
    "teamwork"
];


function previewScore() {

    const values = {};

    scoreFields.forEach(field => {

        values[field] = Number($(field).value) || 0;

    });


    const score = calculateScore(values);

    $("scorePreview").textContent =
        `${score.toFixed(1)} / 100`;

}


scoreFields.forEach(field => {

    $(field).addEventListener("input", previewScore);

});


/* =========================
   ADD & EDIT EMPLOYEE
========================= */

employeeForm.addEventListener("submit", event => {

    event.preventDefault();


    const name = $("employeeName").value.trim();

    const department = $("employeeDepartment").value;


    const values = {};

    scoreFields.forEach(field => {

        values[field] = Number($(field).value);

    });


    if (!name || !department) {

        alert("Lengkapi identitas karyawan.");

        return;

    }


    const valid = Object.values(values).every(value =>

        Number.isFinite(value) &&
        value >= 0 &&
        value <= 100

    );


    if (!valid) {

        alert("Semua nilai harus antara 0 sampai 100.");

        return;

    }


    // Jabatan tambahan dipisahkan dengan koma.
    // Jika field belum tersedia, gunakan bagian utama.
    const positionsInput = $("employeePositions")
        ? $("employeePositions").value.trim()
        : "";

    const positions = positionsInput
        ? positionsInput.split(",").map(item => item.trim()).filter(Boolean)
        : [department];


    const workSystem = $("employeeWorkSystem")
        ? $("employeeWorkSystem").value
        : "Harian";


    if (editingId !== null) {

        employees = employees.map(employee => {

            if (employee.id === editingId) {

                return {
                    ...employee,
                    name,
                    department,
                    positions,
                    workSystem,
                    ...values
                };

            }

            return employee;

        });

    } else {

        employees.push({

            id: Date.now(),

            name,
            department,
            positions,
            workSystem,

            ...values

        });

    }


    if (!saveEmployees()) return;

    renderEmployees();

    closeModal();

    alert("Data penilaian berhasil disimpan.");

});


/* =========================
   EDIT EMPLOYEE
========================= */

function editEmployee(id) {

    const employee = employees.find(item => item.id === id);

    if (!employee) return;


    editingId = id;

    $("modalTitle").textContent = "Edit Penilaian";

    $("employeeName").value = employee.name;

    $("employeeDepartment").value = employee.department;


    if ($("employeePositions")) {

        $("employeePositions").value =
            getPositions(employee).join(", ");

    }


    if ($("employeeWorkSystem")) {

        $("employeeWorkSystem").value =
            employee.workSystem || "Harian";

    }


    scoreFields.forEach(field => {

        $(field).value = employee[field];

    });


    previewScore();

    openModal();

}


/* =========================
   DELETE EMPLOYEE
========================= */

function deleteEmployee(id) {

    const employee = employees.find(item => item.id === id);

    if (!employee) return;


    const confirmDelete = confirm(
        `Hapus data penilaian ${employee.name}?`
    );


    if (!confirmDelete) return;


    const previousEmployees = employees;

    employees = employees.filter(item => item.id !== id);


    if (!saveEmployees()) {

        employees = previousEmployees;

        return;

    }


    renderEmployees();

}


/* =========================
   EVENT DELEGATION
========================= */

employeeTable.addEventListener("click", event => {

    const editButton = event.target.closest("[data-edit]");

    const deleteButton = event.target.closest("[data-delete]");


    if (editButton) {

        editEmployee(Number(editButton.dataset.edit));

    }


    if (deleteButton) {

        deleteEmployee(Number(deleteButton.dataset.delete));

    }

});


/* =========================
   SEARCH & FILTER
========================= */

$("searchInput").addEventListener("input", renderEmployees);

$("departmentFilter").addEventListener("change", renderEmployees);


/* =========================
   EXPORT CSV
========================= */

$("exportBtn").addEventListener("click", () => {

    if (employees.length === 0) {

        alert("Belum ada data untuk diekspor.");

        return;

    }


    const headers = [
        "ID",
        "Nama",
        "Bagian Utama",
        "Jabatan",
        "Sistem Kerja",
        "Produktivitas",
        "Kedisiplinan",
        "Kualitas Kerja",
        "Kompetensi Digital",
        "Kerja Sama",
        "Nilai Akhir",
        "Status"
    ];


    const rows = employees.map(employee => {

        const score = calculateScore(employee);

        return [

            employee.id,

            employee.name,

            employee.department,

            getPositions(employee).join("; "),

            employee.workSystem || "Harian",

            employee.productivity,

            employee.discipline,

            employee.quality,

            employee.digital,

            employee.teamwork,

            score,

            getStatus(score).label

        ];

    });


    const escapeCSV = value =>

        `"${String(value).replace(/"/g, '""')}"`;


    const csv = [

        headers,

        ...rows

    ].map(row =>

        row.map(escapeCSV).join(",")

    ).join("\r\n");


    const blob = new Blob(

        ["\uFEFF" + csv],

        { type: "text/csv;charset=utf-8;" }

    );


    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "laporan-kinerja-karyawan.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

});


/* =========================
   CURRENT DATE
========================= */

function updateDate() {

    $("currentDate").textContent =

        new Date().toLocaleDateString("id-ID", {

            day: "numeric",

            month: "long",

            year: "numeric"

        });

}


/* =========================
   INITIALIZATION
========================= */

updateDate();

renderEmployees();
