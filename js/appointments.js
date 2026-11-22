/**
 * Smart Doctor Appointment Booking & Specialist Recommender
 */

document.addEventListener('DOMContentLoaded', () => {
  const doctors = [
    {
      id: "doc-1",
      name: "Dr. Marcus Reed, MD, FACC",
      specialty: "Cardiology",
      hospital: "St. Jude Heart & Vascular Institute",
      experience: "16 years",
      rating: "4.9 (240 reviews)",
      nextSlot: "Today, 3:30 PM",
      fee: "$120",
      avatarBg: "var(--med-primary-light)",
      avatarColor: "var(--med-primary)",
      badges: ["Board Certified", "AI Co-pilot Verified"]
    },
    {
      id: "doc-2",
      name: "Dr. Sarah Chen, MD",
      specialty: "Pulmonology",
      hospital: "Metropolitan Respiratory Center",
      experience: "12 years",
      rating: "4.8 (180 reviews)",
      nextSlot: "Tomorrow, 10:00 AM",
      fee: "$110",
      avatarBg: "var(--med-teal-light)",
      avatarColor: "var(--med-teal)",
      badges: ["Asthma & COPD Lead", "Telehealth Ready"]
    },
    {
      id: "doc-3",
      name: "Dr. Alistair Ross, MD, PhD",
      specialty: "Neurology",
      hospital: "University Neurological Clinic",
      experience: "19 years",
      rating: "4.9 (310 reviews)",
      nextSlot: "Wednesday, 2:00 PM",
      fee: "$150",
      avatarBg: "var(--med-primary-light)",
      avatarColor: "var(--med-primary-dark)",
      badges: ["Headache & Migraine Specialist", "Clinical Researcher"]
    },
    {
      id: "doc-4",
      name: "Dr. Emily Taylor, MD",
      specialty: "Internal Medicine",
      hospital: "City Health General Hospital",
      experience: "9 years",
      rating: "4.9 (195 reviews)",
      nextSlot: "Today, 5:15 PM",
      fee: "$95",
      avatarBg: "var(--med-teal-light)",
      avatarColor: "var(--med-teal-dark)",
      badges: ["Preventive Care", "Diabetes Management"]
    },
    {
      id: "doc-5",
      name: "Dr. Kevin Patel, MD, FACS",
      specialty: "General Surgery",
      hospital: "Apex Surgical Care",
      experience: "14 years",
      rating: "4.7 (140 reviews)",
      nextSlot: "Thursday, 11:30 AM",
      fee: "$140",
      avatarBg: "var(--med-primary-light)",
      avatarColor: "var(--med-primary)",
      badges: ["Laparoscopic Specialist", "Acute Triage"]
    },
    {
      id: "doc-6",
      name: "Dr. Priya Nair, MD",
      specialty: "Dermatology",
      hospital: "Skin & Allergy Advanced Center",
      experience: "11 years",
      rating: "4.8 (220 reviews)",
      nextSlot: "Friday, 9:00 AM",
      fee: "$105",
      avatarBg: "var(--med-teal-light)",
      avatarColor: "var(--med-teal)",
      badges: ["Cosmetic & Clinical", "AI Dermatoscope User"]
    }
  ];

  const doctorsListContainer = document.getElementById('doctors-list');
  const specialtyFilters = document.querySelectorAll('.specialty-filter-btn');
  const searchInput = document.getElementById('search-doctor-input');
  const bookingModalEl = document.getElementById('bookingModal');
  const bookingForm = document.getElementById('booking-form');

  let currentSpecialty = 'All';
  let searchTerm = '';
  let selectedDoctor = null;

  function renderDoctors() {
    if (!doctorsListContainer) return;

    const filtered = doctors.filter(doc => {
      const matchSpec = currentSpecialty === 'All' || doc.specialty.toLowerCase() === currentSpecialty.toLowerCase();
      const matchSearch = doc.name.toLowerCase().includes(searchTerm) || 
                          doc.specialty.toLowerCase().includes(searchTerm) || 
                          doc.hospital.toLowerCase().includes(searchTerm);
      return matchSpec && matchSearch;
    });

    if (filtered.length === 0) {
      doctorsListContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="bi bi-person-x fs-1 text-muted"></i>
          <h5 class="mt-2 text-dark">No specialists found</h5>
          <p class="text-muted">Try adjusting your filter criteria or search keyword.</p>
        </div>
      `;
      return;
    }

    doctorsListContainer.innerHTML = filtered.map(doc => `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="med-card h-100 d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex align-items-start gap-3 mb-3">
              <div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" 
                   style="width: 58px; height: 58px; background-color: ${doc.avatarBg}; color: ${doc.avatarColor};">
                <i class="bi bi-person-badge fs-2"></i>
              </div>
              <div>
                <h5 class="mb-1 text-dark fs-6 fw-bold">${doc.name}</h5>
                <div class="badge badge-soft-blue mb-1">${doc.specialty}</div>
                <div class="small text-muted"><i class="bi bi-geo-alt me-1"></i>${doc.hospital}</div>
              </div>
            </div>

            <div class="d-flex align-items-center justify-content-between py-2 border-top border-bottom small mb-3">
              <span><i class="bi bi-star-fill text-warning me-1"></i><strong>${doc.rating}</strong></span>
              <span class="text-muted"><i class="bi bi-briefcase me-1"></i>${doc.experience}</span>
              <span class="text-teal fw-bold">${doc.fee}</span>
            </div>

            <div class="mb-3">
              <div class="small text-muted mb-1"><i class="bi bi-clock-history me-1"></i>Next Available:</div>
              <span class="badge bg-light text-dark border px-2 py-1 fw-semibold">
                <i class="bi bi-calendar2-check text-success me-1"></i>${doc.nextSlot}
              </span>
            </div>

            <div class="d-flex flex-wrap gap-1 mb-3">
              ${doc.badges.map(b => `<span class="badge badge-soft-teal" style="font-size: 0.7rem;">${b}</span>`).join('')}
            </div>
          </div>

          <button class="btn btn-med-primary w-100 book-appointment-btn" data-doc-id="${doc.id}">
            <i class="bi bi-calendar-plus me-1"></i> Schedule Consultation
          </button>
        </div>
      </div>
    `).join('');

    // Attach click listeners
    document.querySelectorAll('.book-appointment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const docId = btn.getAttribute('data-doc-id');
        openBookingModal(docId);
      });
    });
  }

  // Specialty filter buttons
  specialtyFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      specialtyFilters.forEach(b => b.classList.remove('active', 'btn-primary'));
      specialtyFilters.forEach(b => b.classList.add('btn-light'));
      btn.classList.remove('btn-light');
      btn.classList.add('active', 'btn-primary');

      currentSpecialty = btn.getAttribute('data-specialty') || 'All';
      renderDoctors();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      renderDoctors();
    });
  }

  // Open booking modal
  function openBookingModal(docId) {
    selectedDoctor = doctors.find(d => d.id === docId);
    if (!selectedDoctor) return;

    document.getElementById('booking-doctor-name').textContent = selectedDoctor.name;
    document.getElementById('booking-doctor-spec').textContent = `${selectedDoctor.specialty} • ${selectedDoctor.hospital}`;
    document.getElementById('booking-doctor-fee').textContent = `Consultation Fee: ${selectedDoctor.fee}`;

    if (bookingModalEl && typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(bookingModalEl);
      modal.show();
    }
  }

  // Handle booking form submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientName = document.getElementById('book-patient-name').value.trim();
      const slotTime = document.getElementById('book-slot-time').value;
      const refId = "APT-" + Math.floor(100000 + Math.random() * 900000);

      // Hide modal
      if (typeof bootstrap !== 'undefined') {
        const modalInstance = bootstrap.Modal.getInstance(bookingModalEl);
        if (modalInstance) modalInstance.hide();
      }

      // Show confirmation alert & toast
      showToast("Appointment Confirmed!", `Ref #${refId} with ${selectedDoctor.name} at ${slotTime}`, "success");

      // Optional confirmation alert
      alert(`✅ Consultation Scheduled!\n\nReference ID: ${refId}\nDoctor: ${selectedDoctor.name}\nSpecialty: ${selectedDoctor.specialty}\nLocation: ${selectedDoctor.hospital}\nTime: ${slotTime}\nPatient: ${patientName}\n\nA confirmation SMS and calendar invite have been simulated.`);
      bookingForm.reset();
    });
  }

  renderDoctors();
});
