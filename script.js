// ========== Constants ==========
const STORAGE_KEY = "allTenants";
const DEFAULT_USER = "default";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ========== Register Tenant ==========
document.addEventListener('DOMContentLoaded', () => {
  const tenantForm = document.getElementById('tenant-form');
  if (tenantForm) {
    tenantForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const tenant = {
        name: document.getElementById('name').value,
        idNumber: document.getElementById('idNumber').value,
        phone: document.getElementById('phone').value,
        block: document.getElementById('block').value,
        room: document.getElementById('room').value,
        movedIn: document.getElementById('movedIn').value,
        deposit: parseFloat(document.getElementById('deposit').value),
        rent: parseFloat(document.getElementById('rent').value),
        paymentsByYear: {
          [new Date().getFullYear()]: Object.fromEntries(
            MONTHS.map(m => [m, "Unpaid"])
          )
        }
      };

      const allTenants = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      if (!allTenants[DEFAULT_USER]) allTenants[DEFAULT_USER] = [];

      allTenants[DEFAULT_USER].push(tenant);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allTenants));

      alert("Tenant registered successfully!");
      tenantForm.reset();
      displayTenants();
      loadReportTable();
    });
  }

  displayTenants();
  if (document.getElementById("report-table")) {
    loadReportTable();
  }
  if (document.getElementById("year-select")) {
    document.getElementById("year-select").addEventListener("change", loadReportTable);
  }
});

// ========== Display Tenant List ==========
function displayTenants() {
  const list = document.getElementById('tenant-list');
  if (!list) return;

  const allTenants = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  const tenants = allTenants[DEFAULT_USER] || [];

  list.innerHTML = '';
  tenants.forEach((t, index) => {
    const li = document.createElement('li');
    li.textContent = `${t.name} (Room ${t.room}, Phone: ${t.phone})`;

    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.onclick = () => {
      if (confirm("Delete this tenant?")) {
        tenants.splice(index, 1);

        if (tenants.length === 0) {
          delete allTenants[DEFAULT_USER];
        } else {
          allTenants[DEFAULT_USER] = tenants;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(allTenants));
        displayTenants();
        loadReportTable();
      }
    };

    li.appendChild(btn);
    list.appendChild(li);
  });
}

// ========== Load Monthly Report ==========
function loadReportTable() {
  const reportDiv = document.getElementById("report-table");
  if (!reportDiv) return;

  const allTenants = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  const tenants = allTenants[DEFAULT_USER] || [];

  const yearSelect = document.getElementById("year-select");
  const currentYear = new Date().getFullYear();
  const selectedYear = yearSelect ? parseInt(yearSelect.value) || currentYear : currentYear;

  // Populate year options if empty
  if (yearSelect && yearSelect.options.length === 0) {
    const years = new Set([currentYear]);
    tenants.forEach(t => {
      if (t.paymentsByYear) {
        Object.keys(t.paymentsByYear).forEach(y => years.add(parseInt(y)));
      }
    });
    [...years].sort((a, b) => b - a).forEach(y => {
      const opt = document.createElement("option");
      opt.value = y;
      opt.textContent = y;
      if (y === selectedYear) opt.selected = true;
      yearSelect.appendChild(opt);
    });
  }

  // Ensure all months for selected year exist
  tenants.forEach(t => {
    if (!t.paymentsByYear) t.paymentsByYear = {};
    if (!t.paymentsByYear[selectedYear]) {
      t.paymentsByYear[selectedYear] = {};
      MONTHS.forEach(m => t.paymentsByYear[selectedYear][m] = "Unpaid");
    }
  });

  // Build table
  let html = "<table><tr><th>Tenant</th><th>Block</th><th>Room</th>";
  MONTHS.forEach(m => html += `<th>${m}</th>`);
  html += "</tr>";

  tenants.forEach(t => {
    html += `<tr><td>${t.name}</td><td>${t.block}</td><td>${t.room}</td>`;
    MONTHS.forEach(month => {
      const paid = t.paymentsByYear[selectedYear][month] === "Paid";
      html += `<td>
        <input type="checkbox"
               data-id="${t.idNumber}"
               data-month="${month}"
               data-year="${selectedYear}"
               ${paid ? 'checked' : ''}>
      </td>`;
    });
    html += "</tr>";
  });

  html += "</table>";
  reportDiv.innerHTML = html;

  // Attach checkbox listeners
  document.querySelectorAll('#report-table input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const id = this.dataset.id;
      const month = this.dataset.month;
      const year = this.dataset.year;
      const isChecked = this.checked;

      const allTenants = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      const tenants = allTenants[DEFAULT_USER] || [];

      const tenant = tenants.find(t => t.idNumber === id);
      if (tenant) {
        if (!tenant.paymentsByYear[year]) tenant.paymentsByYear[year] = {};
        tenant.paymentsByYear[year][month] = isChecked ? "Paid" : "Unpaid";
        allTenants[DEFAULT_USER] = tenants;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allTenants));
      }
    });
  });
}

// ========== Export CSV ==========
function exportCSV() {
  const allTenants = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  const tenants = allTenants[DEFAULT_USER] || [];

  const yearSelect = document.getElementById("year-select");
  const selectedYear = yearSelect ? parseInt(yearSelect.value) || new Date().getFullYear() : new Date().getFullYear();

  if (tenants.length === 0) {
    alert("No tenants to export.");
    return;
  }

  let csv = "Tenant Name,Block,Room," + MONTHS.join(",") + "\n";

  tenants.forEach(t => {
    if (!t.paymentsByYear[selectedYear]) {
      t.paymentsByYear[selectedYear] = {};
      MONTHS.forEach(month => t.paymentsByYear[selectedYear][month] = "Unpaid");
    }

    let row = `${t.name},${t.block},${t.room}`;
    MONTHS.forEach(month => {
      row += `,${t.paymentsByYear[selectedYear][month] || "Unpaid"}`;
    });
    csv += row + "\n";
  });

  allTenants[DEFAULT_USER] = tenants;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allTenants));

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `RoomTrack_Report_${selectedYear}.csv`;
  link.click();
}
// Count tenants with at least one unpaid rent up to current month
function renderReportTable() {
  const user = "default"; // Always use 'default' key
  const allTenants = JSON.parse(localStorage.getItem("allTenants")) || {};
  const tenants = allTenants[user] || [];

  const year = document.getElementById("year-select").value;
  let html = "<table><tr><th>Tenant</th><th>Block</th><th>Room</th>";
  months.forEach(month => html += `<th>${month}</th>`);
  html += "</tr>";

  tenants.forEach(t => {
    html += `<tr><td>${t.name}</td><td>${t.block}</td><td>${t.room}</td>`;
    months.forEach(month => {
      const status = (t.paymentsByYear && t.paymentsByYear[year] && t.paymentsByYear[year][month]) || "Unpaid";
      const checked = status === "Paid" ? "checked" : "";
      html += `<td>
        <input type="checkbox" class="payment-checkbox" 
               data-id="${t.idNumber}" 
               data-month="${month}" ${checked}>
      </td>`;
    });
    html += "</tr>";
  });

  html += "</table>";
  document.getElementById("report-table").innerHTML = html;
  console.log("Report rendered, checking unpaid tenants...");

  attachCheckboxListeners();

  // 🔴 Add unpaid tenant notification
  const now = new Date();
  const currentMonthIndex = now.getMonth(); // 0 = Jan, 11 = Dec
  let unpaidCount = 0;

  tenants.forEach(t => {
    const payments = t.paymentsByYear?.[year] || {};
    const hasUnpaid = months.slice(0, currentMonthIndex + 1).some(month => payments[month] !== "Paid");
    if (hasUnpaid) unpaidCount++;
  });

  const unpaidNote = document.getElementById("unpaid-notification");
console.log("Unpaid count:", unpaidCount, unpaidNote);

  if (unpaidNote) {
    if (unpaidCount > 0) {
      unpaidNote.textContent = `${unpaidCount} tenant${unpaidCount > 1 ? 's' : ''} haven't paid rent`;
    } else {
      unpaidNote.textContent = "";
    }
  }
}
