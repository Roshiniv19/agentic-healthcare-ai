/**
 * Doctor & Clinical Team Intelligence Dashboard
 * Clinical Decision Support System (CDSS) Mock Data & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Sample Clinical Patient Queue Data
  const patients = [
    {
      id: "PT-9041",
      name: "Eleanor Vance",
      age: 62,
      gender: "Female",
      chiefComplaint: "Substernal chest tightness & diaphoresis",
      triageLevel: "Critical",
      triageBadge: "badge-soft-danger",
      vitals: { hr: 108, bp: "158/96", spo2: "93%", temp: "98.6°F" },
      aiDifferential: [
        { condition: "Acute Coronary Syndrome (ACS)", probability: "78%" },
        { condition: "Gastroesophageal Reflux Disease", probability: "14%" },
        { condition: "Costochondritis", probability: "8%" }
      ],
      aiAlerts: "Critical ECG flag: ST segment elevation in leads V2-V4 suspected. High risk.",
      timeWaiting: "4 mins ago",
      assignedDoc: "Dr. Marcus Reed (Cardiology)"
    },
    {
      id: "PT-9042",
      name: "David Kim",
      age: 34,
      gender: "Male",
      chiefComplaint: "High fever (102.8°F), productive cough, chills",
      triageLevel: "Urgent",
      triageBadge: "badge-soft-warning",
      vitals: { hr: 92, bp: "124/80", spo2: "96%", temp: "102.8°F" },
      aiDifferential: [
        { condition: "Community-Acquired Pneumonia", probability: "64%" },
        { condition: "Acute Bronchitis", probability: "26%" },
        { condition: "Influenza Type A", probability: "10%" }
      ],
      aiAlerts: "Moderate fever spike; pulse oximetry within acceptable baseline. Recommend chest X-ray.",
      timeWaiting: "18 mins ago",
      assignedDoc: "Dr. Sarah Chen (Pulmonology)"
    },
    {
      id: "PT-9043",
      name: "Sophia Martinez",
      age: 28,
      gender: "Female",
      chiefComplaint: "Persistent migraine with unilateral visual aura",
      triageLevel: "Priority",
      triageBadge: "badge-soft-warning",
      vitals: { hr: 76, bp: "118/74", spo2: "99%", temp: "98.4°F" },
      aiDifferential: [
        { condition: "Migraine with Aura", probability: "82%" },
        { condition: "Tension Headache", probability: "12%" },
        { condition: "Cluster Headache", probability: "6%" }
      ],
      aiAlerts: "No neurological deficit observed; standard photophobia protocol indicated.",
      timeWaiting: "26 mins ago",
      assignedDoc: "Dr. Alistair Ross (Neurology)"
    },
    {
      id: "PT-9044",
      name: "James Wilson",
      age: 51,
      gender: "Male",
      chiefComplaint: "Routine Diabetes follow-up & HbA1c review",
      triageLevel: "Routine",
      triageBadge: "badge-soft-success",
      vitals: { hr: 70, bp: "128/82", spo2: "98%", temp: "98.1°F" },
      aiDifferential: [
        { condition: "Type 2 Diabetes Mellitus (Controlled)", probability: "92%" },
        { condition: "Essential Hypertension", probability: "8%" }
      ],
      aiAlerts: "HbA1c decreased from 7.8% to 6.9%. Medication adherence is positive.",
      timeWaiting: "35 mins ago",
      assignedDoc: "Dr. Emily Taylor (Internal Med)"
    },
    {
      id: "PT-9045",
      name: "Amara Okafor",
      age: 19,
      gender: "Female",
      chiefComplaint: "Acute right lower quadrant abdominal pain",
      triageLevel: "Critical",
      triageBadge: "badge-soft-danger",
      vitals: { hr: 104, bp: "112/70", spo2: "98%", temp: "100.4°F" },
      aiDifferential: [
        { condition: "Acute Appendicitis", probability: "84%" },
        { condition: "Mesenteric Adenitis", probability: "11%" },
        { condition: "Ovarian Cyst Rupture", probability: "5%" }
      ],
      aiAlerts: "McBurney's point tenderness reported. Ultrasound/CT abdomen urgently recommended.",
      timeWaiting: "8 mins ago",
      assignedDoc: "Dr. Kevin Patel (General Surgery)"
    }
  ];

  const tableBody = document.getElementById('patient-table-body');
  const searchInput = document.getElementById('search-patient-input');
  const filterTabs = document.querySelectorAll('.filter-tab-btn');
  const patientModalEl = document.getElementById('patientDetailModal');

  let currentFilter = 'All';
  let searchTerm = '';

  function renderTable() {
    if (!tableBody) return;

    const filtered = patients.filter(p => {
      const matchFilter = currentFilter === 'All' || p.triageLevel.toLowerCase() === currentFilter.toLowerCase();
      const matchSearch = p.name.toLowerCase().includes(searchTerm) || 
                          p.id.toLowerCase().includes(searchTerm) || 
                          p.chiefComplaint.toLowerCase().includes(searchTerm);
      return matchFilter && matchSearch;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4 text-muted">
            <i class="bi bi-inbox fs-3 d-block mb-1"></i>
            No patients match current filters.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map(p => `
      <tr>
        <td>
          <div class="fw-bold text-dark">${p.name}</div>
          <small class="text-muted">${p.id} • ${p.gender}, ${p.age}y</small>
        </td>
        <td>
          <div class="text-dark small fw-semibold">${p.chiefComplaint}</div>
          <small class="text-muted"><i class="bi bi-clock me-1"></i>${p.timeWaiting}</small>
        </td>
        <td>
          <span class="badge ${p.triageBadge} px-2 py-1">
            ${p.triageLevel === 'Critical' ? '<i class="bi bi-exclamation-triangle-fill me-1"></i>' : ''}
            ${p.triageLevel}
          </span>
        </td>
        <td>
          <div class="small font-monospace">
            <span class="me-2"><i class="bi bi-heart text-danger"></i> ${p.vitals.hr}</span>
            <span class="me-2"><i class="bi bi-speedometer2 text-primary"></i> ${p.vitals.bp}</span>
            <span><i class="bi bi-lungs text-info"></i> ${p.vitals.spo2}</span>
          </div>
        </td>
        <td>
          <div class="small text-truncate" style="max-width: 180px;">
            <i class="bi bi-person-badge text-teal me-1"></i> ${p.assignedDoc}
          </div>
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary view-patient-btn" data-id="${p.id}">
            <i class="bi bi-eye-fill me-1"></i> Review AI Chart
          </button>
        </td>
      </tr>
    `).join('');

    // Attach click handlers to dynamically created buttons
    document.querySelectorAll('.view-patient-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-id');
        openPatientModal(pId);
      });
    });
  }

  // Filter Tab switching
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active', 'btn-primary'));
      filterTabs.forEach(t => t.classList.add('btn-light'));
      tab.classList.remove('btn-light');
      tab.classList.add('active', 'btn-primary');

      currentFilter = tab.getAttribute('data-filter') || 'All';
      renderTable();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      renderTable();
    });
  }

  // Open Detailed Patient Modal
  function openPatientModal(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    document.getElementById('modal-patient-name').textContent = `${patient.name} (${patient.id})`;
    document.getElementById('modal-patient-meta').textContent = `${patient.gender}, ${patient.age} years old • Admitted: ${patient.timeWaiting}`;
    document.getElementById('modal-patient-triage').className = `badge ${patient.triageBadge} px-2 py-1`;
    document.getElementById('modal-patient-triage').textContent = `Triage Status: ${patient.triageLevel}`;
    document.getElementById('modal-patient-complaint').textContent = patient.chiefComplaint;
    document.getElementById('modal-patient-alerts').textContent = patient.aiAlerts;

    // Vitals
    document.getElementById('modal-vital-hr').textContent = `${patient.vitals.hr} BPM`;
    document.getElementById('modal-vital-bp').textContent = `${patient.vitals.bp} mmHg`;
    document.getElementById('modal-vital-spo2').textContent = patient.vitals.spo2;
    document.getElementById('modal-vital-temp').textContent = patient.vitals.temp;

    // Differential List
    const diffContainer = document.getElementById('modal-patient-diff');
    diffContainer.innerHTML = patient.aiDifferential.map(d => `
      <div class="mb-2">
        <div class="d-flex justify-content-between small fw-bold mb-1">
          <span>${d.condition}</span>
          <span class="text-primary">${d.probability}</span>
        </div>
        <div class="progress" style="height: 6px;">
          <div class="progress-bar bg-primary" role="progressbar" style="width: ${d.probability}"></div>
        </div>
      </div>
    `).join('');

    if (patientModalEl && typeof bootstrap !== 'undefined') {
      const modalInstance = new bootstrap.Modal(patientModalEl);
      modalInstance.show();
    }
  }

  // Modal Action Buttons
  const approvePlanBtn = document.getElementById('btn-approve-plan');
  const orderLabsBtn = document.getElementById('btn-order-labs');

  if (approvePlanBtn) {
    approvePlanBtn.addEventListener('click', () => {
      showToast("Clinical Pathway Approved", "AI recommendations endorsed into hospital EHR.", "success");
      if (typeof bootstrap !== 'undefined') {
        const modalInstance = bootstrap.Modal.getInstance(patientModalEl);
        if (modalInstance) modalInstance.hide();
      }
    });
  }

  if (orderLabsBtn) {
    orderLabsBtn.addEventListener('click', () => {
      showToast("Diagnostic Orders Sent", "Stat lab panel and imaging dispatched to central lab.", "info");
    });
  }

  // Initial table render
  renderTable();
});
