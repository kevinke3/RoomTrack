// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.getElementById('tenant-form');
//   if (form) {
//     form.addEventListener('submit', function (e) {
//       e.preventDefault();

//       const tenant = {
//         name: document.getElementById('name').value,
//         idNumber: document.getElementById('idNumber').value,
//         phone: document.getElementById('phone').value,
//         block: document.getElementById('block').value,
//         room: document.getElementById('room').value,
//         movedIn: document.getElementById('movedIn').value,
//         deposit: parseFloat(document.getElementById('deposit').value),
//         rent: parseFloat(document.getElementById('rent').value),
//         payments: {
//           Jan: "Unpaid", Feb: "Unpaid", Mar: "Unpaid",
//           Apr: "Unpaid", May: "Unpaid", Jun: "Unpaid",
//           Jul: "Unpaid", Aug: "Unpaid", Sep: "Unpaid",
//           Oct: "Unpaid", Nov: "Unpaid", Dec: "Unpaid"
//         }
//       };

//       let tenants = JSON.parse(localStorage.getItem('tenants')) || [];
//       tenants.push(tenant);
//       localStorage.setItem('tenants', JSON.stringify(tenants));

//       alert("Tenant registered successfully!");
//       form.reset();
//     });
//   }
// });
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tenant-form');
  if (form) {
    form.addEventListener('submit', function (e) {
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
        payments: {
          Jan: "Unpaid", Feb: "Unpaid", Mar: "Unpaid",
          Apr: "Unpaid", May: "Unpaid", Jun: "Unpaid",
          Jul: "Unpaid", Aug: "Unpaid", Sep: "Unpaid",
          Oct: "Unpaid", Nov: "Unpaid", Dec: "Unpaid"
        }
      };

      let tenants = JSON.parse(localStorage.getItem('tenants')) || [];
      tenants.push(tenant);
      localStorage.setItem('tenants', JSON.stringify(tenants));

      alert("Tenant registered successfully!");
      form.reset();
      displayTenants(); // ✅ refresh list
    });
  }

  displayTenants(); // ✅ load list on page load
});

// Basic login system using localStorage
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const user = document.getElementById('username').value;
      const pass = document.getElementById('password').value;

      const savedUser = localStorage.getItem('roomtrackUser') || 'admin';
      const savedPass = localStorage.getItem('roomtrackPass') || 'admin123';

      if (user === savedUser && pass === savedPass) {
        alert("Login successful!");
        window.location.href = 'index.html';
      } else {
        alert("Wrong credentials!");
      }
    });
  }
});

// Forgot password handler
function forgotPassword() {
  const newPass = prompt("Enter new password:");
  if (newPass) {
    localStorage.setItem('roomtrackPass', newPass);
    alert("Password updated. Use it next time.");
  }
}
// Register function
function showRegister() {
  const newUser = prompt("Enter new username:");
  const newPass = prompt("Enter new password:");
  if (newUser && newPass) {
    localStorage.setItem('roomtrackUser', newUser);
    localStorage.setItem('roomtrackPass', newPass);
    alert("New landlord account registered!");
  }
}
// Logout function
// function logout() {
//   alert("Logged out successfully!");
//   window.location.href = "login.html";
// 
// .addEventListener('DOMContentLoaded', () => {
//   const logoutBtn = document.getElementById('logout-btn');
//   if (logoutBtn) {
//     logoutBtn.addEventListener('click', () => {
//       localStorage.removeItem('isLoggedIn'); // ✅ Clear session
//       window.location.href = 'index.html';   // ✅ Redirect to login
//     });
//   }document
// });


// Delete Tenant
function displayTenants() {
  const list = document.getElementById('tenant-list');
  if (!list) return;

  const tenants = JSON.parse(localStorage.getItem('tenants')) || [];
  list.innerHTML = '';

  tenants.forEach((t, index) => {
    const li = document.createElement('li');
    li.textContent = `${t.name} (Room ${t.room}) `;
    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.onclick = () => {
      if (confirm("Delete this tenant?")) {
        tenants.splice(index, 1);
        localStorage.setItem('tenants', JSON.stringify(tenants));
        displayTenants();
      }
    };
    li.appendChild(btn);
    list.appendChild(li);
  });
}

displayTenants();
//Export to CSV Function
// function exportCSV() {
//   const tenants = JSON.parse(localStorage.getItem('tenants')) || [];
//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
//                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//   let csv = "Month";
//   tenants.forEach(t => csv += `,${t.name}`);
//   csv += "\n";

//   months.forEach(month => {
//     csv += month;
//     tenants.forEach(t => {
//       csv += `,${t.payments[month]}`;
//     });
//     csv += "\n";
//   });

//   const blob = new Blob([csv], { type: 'text/csv' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = 'RoomTrack_Monthly_Report.csv';
//   link.click();
// }
function exportCSV() {
  const tenants = JSON.parse(localStorage.getItem('tenants')) || [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  let csv = "Tenant Name,Block,Room," + months.join(",") + "\n";

  tenants.forEach(t => {
    let row = `${t.name},${t.block},${t.room}`;
    months.forEach(m => {
      row += `,${t.payments[m] || 'Unpaid'}`;
    });
    csv += row + "\n";
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'RoomTrack_Report.csv';
  link.click();
}

//Login
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const user = document.getElementById('username').value;
      const pass = document.getElementById('password').value;

      const savedUser = localStorage.getItem('roomtrackUser') || 'admin';
      const savedPass = localStorage.getItem('roomtrackPass') || 'admin123';

      if (user === savedUser && pass === savedPass) {
        localStorage.setItem('isLoggedIn', 'true'); // ✅ This must be set
        alert("Login successful!");
        window.location.href = 'index.html';
      } else {
        alert("Wrong credentials!");
      }
    });
  }
});

// function loadReportTable() {
//   const reportDiv = document.getElementById('report-table');
//   if (!reportDiv) return;

//   const tenants = JSON.parse(localStorage.getItem('tenants')) || [];
//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
//                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//   let tableHTML = "<table><tr><th>Tenant</th>";
//   months.forEach(month => {
//     tableHTML += `<th>${month}</th>`;
//   });
//   tableHTML += "</tr>";

//   tenants.forEach((tenant, tIndex) => {
//     tableHTML += `<tr><td>${tenant.name}</td>`;
//     months.forEach(month => {
//       const isPaid = tenant.payments[month] === "Paid";
//       tableHTML += `
//         <td class="${isPaid ? 'paid' : 'unpaid'}">
//           <input type="checkbox" data-tenant="${tIndex}" data-month="${month}" ${isPaid ? 'checked' : ''} />
//         </td>
//       `;
//     });
//     tableHTML += "</tr>";
//   });

//   tableHTML += "</table>";
//   reportDiv.innerHTML = tableHTML;

//   // Add event listeners to checkboxes
//   document.querySelectorAll('#report-table input[type="checkbox"]').forEach(checkbox => {
//     checkbox.addEventListener('change', function () {
//       const tenantIndex = this.dataset.tenant;
//       const month = this.dataset.month;
//       const isChecked = this.checked;

//       let tenants = JSON.parse(localStorage.getItem('tenants')) || [];
//       tenants[tenantIndex].payments[month] = isChecked ? "Paid" : "Unpaid";
//       localStorage.setItem('tenants', JSON.stringify(tenants));

//       // Re-render table to update colors
//       loadReportTable();
//     });
//   });
// }

function loadReportTable() {
  const reportDiv = document.getElementById('report-table');
  if (!reportDiv) return;

  const tenants = JSON.parse(localStorage.getItem('tenants')) || [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  let tableHTML = "<table><tr><th>Tenant</th>";
  months.forEach(month => {
    tableHTML += `<th>${month}</th>`;
  });
  tableHTML += "</tr>";

  tenants.forEach((tenant, tIndex) => {
    tableHTML += `<tr><td>${tenant.name}</td>`;
    months.forEach(month => {
      const isPaid = tenant.payments[month] === "Paid";
      tableHTML += `
        <td class="${isPaid ? 'paid' : 'unpaid'}">
          <input type="checkbox" data-tenant="${tIndex}" data-month="${month}" ${isPaid ? 'checked' : ''} />
        </td>
      `;
    });
    tableHTML += "</tr>";
  });

  tableHTML += "</table>";
  reportDiv.innerHTML = tableHTML;

  document.querySelectorAll('#report-table input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const tenantIndex = this.dataset.tenant;
      const month = this.dataset.month;
      const isChecked = this.checked;

      let tenants = JSON.parse(localStorage.getItem('tenants')) || [];
      tenants[tenantIndex].payments[month] = isChecked ? "Paid" : "Unpaid";
      localStorage.setItem('tenants', JSON.stringify(tenants));

      loadReportTable(); // refresh the table
    });
  });
}

loadReportTable(); // call this when report page loads

//Logout
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      window.location.href = "login.html";
    });
  }

  // Redirect to login if not logged in
  const publicPages = ["login.html", "register_landlord.html"];
  const currentPage = window.location.pathname.split("/").pop();

  if (!localStorage.getItem("isLoggedIn") && !publicPages.includes(currentPage)) {
    window.location.href = "login.html";
  }
});
// // Landlords name
// document.getElementById("landlord-name").innerText =
//   localStorage.getItem("landlordName") || "Landlord";
// document.getElementById("current-date").innerText =
//   "Today is: " + new Date().toDateString();
// // Cards
// function loadDashboardStats() {
//   const tenants = JSON.parse(localStorage.getItem("tenants")) || [];
//   const unpaid = tenants.filter(t =>
//     Object.values(t.payments || {}).includes("Unpaid")
//   );
//   const blocks = [...new Set(tenants.map(t => t.block))];

//   document.getElementById("tenant-count").innerText = tenants.length;
//   document.getElementById("unpaid-count").innerText = unpaid.length;
//   document.getElementById("block-count").innerText = blocks.length;
// }
// loadDashboardStats();

// //Recently added
// function loadRecentTenants() {
//   const tenants = JSON.parse(localStorage.getItem("tenants")) || [];
//   const list = document.getElementById("recent-tenants");
//   list.innerHTML = "";
//   tenants.slice(-3).reverse().forEach(t => {
//     const li = document.createElement("li");
//     li.textContent = `${t.name} (Block ${t.block})`;
//     list.appendChild(li);
//   });
// }
// loadRecentTenants();

// document.addEventListener('DOMContentLoaded', () => {
//   // Greeting
//   document.getElementById("landlord-name").textContent = localStorage.getItem("landlordName") || "Landlord";
//   document.getElementById("current-date").textContent = "Today is " + new Date().toDateString();

//   // Load Tenants
//   const tenants = JSON.parse(localStorage.getItem("tenants")) || [];

//   // Cards
//   document.getElementById("tenant-count").textContent = tenants.length;

//   const unpaid = tenants.filter(t => {
//     const payments = t.payments || {};
//     return Object.values(payments).includes("Unpaid");
//   });

//   document.getElementById("unpaid-count").textContent = unpaid.length;
//   document.getElementById("block-count").textContent = [...new Set(tenants.map(t => t.block))].length;

//   // Notification
//   const notice = document.getElementById("notification-area");
//   if (unpaid.length > 0) {
//     document.getElementById("unpaid-count-notice").textContent = unpaid.length;
//     notice.style.display = "block";
//   }

//   // Recent Tenants (last 3)
//   const recentList = document.getElementById("recent-tenants");
//   recentList.innerHTML = "";
//   tenants.slice(-3).reverse().forEach(t => {
//     const li = document.createElement("li");
//     li.textContent = `${t.name} — Block ${t.block}`;
//     recentList.appendChild(li);
//   });
// });
// document.addEventListener('DOMContentLoaded', () => {
//   // Greeting
//   document.getElementById("landlord-name").textContent = localStorage.getItem("landlordName") || "Landlord";
//   document.getElementById("current-date").textContent = "Today is " + new Date().toDateString();

//   // Load Tenants
//   const tenants = JSON.parse(localStorage.getItem("tenants")) || [];

//   // Ensure all tenants have payments key
//   tenants.forEach(t => {
//     if (!t.payments) {
//       t.payments = {
//         Jan: "Unpaid", Feb: "Unpaid", Mar: "Unpaid",
//         Apr: "Unpaid", May: "Unpaid", Jun: "Unpaid",
//         Jul: "Unpaid", Aug: "Unpaid", Sep: "Unpaid",
//         Oct: "Unpaid", Nov: "Unpaid", Dec: "Unpaid"
//       };
//     }
//   });
//   localStorage.setItem("tenants", JSON.stringify(tenants));

//   // Cards
//   document.getElementById("tenant-count").textContent = tenants.length;

//   const unpaid = tenants.filter(t => {
//     const payments = t.payments || {};
//     return Object.values(payments).includes("Unpaid");
//   });

//   document.getElementById("unpaid-count").textContent = unpaid.length;
//   document.getElementById("block-count").textContent = [...new Set(tenants.map(t => t.block || "Unknown"))].length;

//   // Notification
//   const notice = document.getElementById("notification-area");
//   if (notice && unpaid.length > 0) {
//     document.getElementById("unpaid-count-notice").textContent = unpaid.length;
//     notice.style.display = "block";
//   }

//   // Recent Tenants
//   const recentList = document.getElementById("recent-tenants");
//   if (recentList) {
//     recentList.innerHTML = "";
//     if (tenants.length === 0) {
//       recentList.innerHTML = "<li>No tenants added yet.</li>";
//     } else {
//       tenants.slice(-3).reverse().forEach(t => {
//         const li = document.createElement("li");
//         li.textContent = `${t.name || "Unknown"} — Block ${t.block || "?"}`;
//         recentList.appendChild(li);
//       });
//     }
//   }
// });
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("landlord-name").textContent = localStorage.getItem("landlordName") || "😊";
  document.getElementById("current-date").textContent = "Its " + new Date().toDateString();

  const tenants = JSON.parse(localStorage.getItem("tenants")) || [];

  document.getElementById("tenant-count").textContent = tenants.length;

  const unpaid = tenants.filter(t => {
    const payments = t.payments || {};
    return Object.values(payments).includes("Unpaid");
  });
  document.getElementById("unpaid-count").textContent = unpaid.length;

  document.getElementById("block-count").textContent = [...new Set(tenants.map(t => t.block))].length;

  const notice = document.getElementById("notification-area");
  if (unpaid.length > 0) {
    document.getElementById("unpaid-count-notice").textContent = unpaid.length;
    notice.style.display = "block";
  }

  const recentList = document.getElementById("recent-tenants");
  recentList.innerHTML = "";
  tenants.slice(-3).reverse().forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.name} — Block ${t.block}`;
    recentList.appendChild(li);
  });
});
