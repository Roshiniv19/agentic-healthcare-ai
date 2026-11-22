/**
 * Agentic Symptom Assessment & Emergency Risk Stratification
 * Step-by-Step Clinical Wizard Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  const totalSteps = 5;

  // State object to hold patient input
  const assessmentData = {
    ageGroup: 'adult',
    gender: 'female',
    chiefComplaint: '',
    selectedSymptoms: [],
    severity: 4,
    duration: '1-3 days',
    history: []
  };

  // DOM Elements
  const stepItems = document.querySelectorAll('.step-item');
  const stepPanels = document.querySelectorAll('.step-panel');
  const btnPrev = document.getElementById('btn-prev-step');
  const btnNext = document.getElementById('btn-next-step');
  const severityRange = document.getElementById('severity-range');
  const severityValueDisplay = document.getElementById('severity-value-display');
  const symptomTags = document.querySelectorAll('.symptom-tag-btn');
  const historyCheckboxes = document.querySelectorAll('.history-checkbox');
  const resetAssessmentBtn = document.getElementById('btn-reset-assessment');
  const printReportBtn = document.getElementById('btn-print-report');

  // Severity Slider updates
  if (severityRange && severityValueDisplay) {
    severityRange.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      assessmentData.severity = val;
      let label = "Mild";
      let colorClass = "text-success";

      if (val >= 8) {
        label = "Severe / Extreme";
        colorClass = "text-danger";
      } else if (val >= 5) {
        label = "Moderate";
        colorClass = "text-warning";
      }

      severityValueDisplay.innerHTML = `<span class="${colorClass} fw-bold">${val} / 10 (${label})</span>`;
    });
  }

  // Symptom Tags Selection
  symptomTags.forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('selected');
      const symptom = tag.getAttribute('data-symptom') || tag.textContent.trim();
      if (tag.classList.contains('selected')) {
        if (!assessmentData.selectedSymptoms.includes(symptom)) {
          assessmentData.selectedSymptoms.push(symptom);
        }
      } else {
        assessmentData.selectedSymptoms = assessmentData.selectedSymptoms.filter(s => s !== symptom);
      }
    });
  });

  // Medical History Checkboxes
  historyCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const val = cb.value;
      if (cb.checked) {
        if (!assessmentData.history.includes(val)) assessmentData.history.push(val);
      } else {
        assessmentData.history = assessmentData.history.filter(h => h !== val);
      }
    });
  });

  // Navigation Buttons
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (validateCurrentStep(currentStep)) {
        if (currentStep < totalSteps) {
          goToStep(currentStep + 1);
        }
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });
  }

  // Reset Assessment
  if (resetAssessmentBtn) {
    resetAssessmentBtn.addEventListener('click', () => {
      if (confirm("Reset symptom assessment and start over?")) {
        window.location.reload();
      }
    });
  }

  // Print Report
  if (printReportBtn) {
    printReportBtn.addEventListener('click', () => {
      window.print();
    });
  }

  function validateCurrentStep(step) {
    if (step === 1) {
      const ageInput = document.querySelector('input[name="ageGroup"]:checked');
      const complaintInput = document.getElementById('chief-complaint');
      if (ageInput) assessmentData.ageGroup = ageInput.value;
      if (complaintInput && complaintInput.value.trim() !== '') {
        assessmentData.chiefComplaint = complaintInput.value.trim();
      } else {
        assessmentData.chiefComplaint = 'General feeling of malaise or discomfort';
      }
      return true;
    }

    if (step === 2) {
      if (assessmentData.selectedSymptoms.length === 0) {
        showToast("Select Symptoms", "Please select at least one primary symptom to continue.", "warning");
        return false;
      }
      return true;
    }

    if (step === 3) {
      const durEl = document.querySelector('input[name="duration"]:checked');
      if (durEl) assessmentData.duration = durEl.value;
      return true;
    }

    if (step === 4) {
      return true;
    }

    return true;
  }

  function goToStep(step) {
    currentStep = step;

    // Update Stepper Nav Pills
    stepItems.forEach(item => {
      const s = parseInt(item.getAttribute('data-step'), 10);
      item.classList.remove('active', 'completed');
      if (s === currentStep) {
        item.classList.add('active');
      } else if (s < currentStep) {
        item.classList.add('completed');
      }
    });

    // Update Panels
    stepPanels.forEach(panel => {
      panel.classList.remove('active');
      panel.style.display = 'none';
      if (parseInt(panel.getAttribute('data-step'), 10) === currentStep) {
        panel.classList.add('active');
        panel.style.display = 'block';
      }
    });

    // Button States
    if (btnPrev) btnPrev.style.display = currentStep === 1 ? 'none' : 'inline-flex';
    if (btnNext) {
      if (currentStep === totalSteps) {
        btnNext.style.display = 'none';
      } else if (currentStep === totalSteps - 1) {
        btnNext.innerHTML = 'Run AI Clinical Assessment <i class="bi bi-cpu ms-1"></i>';
        btnNext.className = 'btn btn-med-teal';
      } else {
        btnNext.innerHTML = 'Next Step <i class="bi bi-arrow-right ms-1"></i>';
        btnNext.className = 'btn btn-med-primary';
      }
    }

    // When reaching Step 5, run AI Evaluation Simulation
    if (currentStep === totalSteps) {
      runAIEvaluation(assessmentData);
    }

    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  /**
   * Evaluates Risk Index based on symptoms, severity, and clinical red flags
   */
  function runAIEvaluation(data) {
    const loadingState = document.getElementById('ai-eval-loading');
    const resultState = document.getElementById('ai-eval-result');

    if (loadingState) loadingState.style.display = 'block';
    if (resultState) resultState.style.display = 'none';

    setTimeout(() => {
      if (loadingState) loadingState.style.display = 'none';
      if (resultState) resultState.style.display = 'block';

      // Detect Red Flags
      const redFlags = ['Chest Tightness', 'Shortness of Breath', 'Confusion / Dizziness', 'Sudden High Fever (>103°F)', 'Severe Stiff Neck'];
      const hasCriticalSymptom = data.selectedSymptoms.some(s => redFlags.includes(s));
      const isExtremeSeverity = data.severity >= 8;
      const isHighRiskHistory = data.history.includes('cardiac') || data.history.includes('immunocompromised');

      let riskLevel = 'MODERATE';
      let pinPosition = '50%';
      let badgeHtml = '<span class="badge bg-warning text-dark px-3 py-2 fs-6"><i class="bi bi-exclamation-circle me-1"></i> MODERATE URGENCY</span>';
      let title = "Priority Clinical Evaluation Advised";
      let summaryText = "Your reported symptoms warrant evaluation by a healthcare provider within 24 to 48 hours to prevent complication.";
      let actionRec = "Book a clinic consultation or virtual telehealth visit.";
      let specialist = "Internal Medicine / General Physician";

      if (hasCriticalSymptom || (isExtremeSeverity && (isHighRiskHistory || data.selectedSymptoms.includes('Shortness of Breath')))) {
        riskLevel = 'EMERGENCY';
        pinPosition = '92%';
        badgeHtml = '<span class="badge bg-danger px-3 py-2 fs-6"><i class="bi bi-shield-fill-exclamation me-1"></i> EMERGENCY (HIGH RISK)</span>';
        title = "Immediate Medical Attention Required";
        summaryText = "One or more reported symptoms (such as acute chest tightness, severe respiratory distress, or intense sudden neurological symptoms) represent potential clinical emergencies.";
        actionRec = "Call Emergency Services immediately: 112 (Emergency) or 108 (Ambulance), or proceed to the nearest Emergency Room.";
        specialist = "Emergency Medicine / Acute Care Team";
      } else if (data.severity <= 3 && data.selectedSymptoms.length <= 2 && !isHighRiskHistory) {
        riskLevel = 'LOW';
        pinPosition = '15%';
        badgeHtml = '<span class="badge bg-success px-3 py-2 fs-6"><i class="bi bi-check-circle-fill me-1"></i> LOW RISK / MILD</span>';
        title = "Self-Care & Active Monitoring Recommended";
        summaryText = "Your symptoms are currently classified as mild and localized without systemic red flags.";
        actionRec = "Hydrate with electrolyte fluids, rest, track symptoms in the app, and consult a doctor if symptoms persist over 5-7 days.";
        specialist = "General Practice / Telehealth Care";
      }

      // Populate DOM elements
      const pinEl = document.getElementById('urgency-pin');
      const badgeContainer = document.getElementById('result-urgency-badge');
      const titleEl = document.getElementById('result-title');
      const summaryEl = document.getElementById('result-summary-text');
      const actionEl = document.getElementById('result-action-text');
      const specialistEl = document.getElementById('result-specialist-text');
      const symptomsListEl = document.getElementById('result-symptoms-list');
      const timestampEl = document.getElementById('result-timestamp');

      if (pinEl) pinEl.style.left = pinPosition;
      if (badgeContainer) badgeContainer.innerHTML = badgeHtml;
      if (titleEl) titleEl.textContent = title;
      if (summaryEl) summaryEl.textContent = summaryText;
      if (actionEl) actionEl.innerHTML = actionRec;
      if (specialistEl) specialistEl.textContent = specialist;
      if (timestampEl) timestampEl.textContent = new Date().toLocaleString();

      if (symptomsListEl) {
        symptomsListEl.innerHTML = data.selectedSymptoms.map(s => 
          `<span class="badge bg-light text-dark border me-1 mb-1">${s}</span>`
        ).join('') + `<span class="badge bg-light text-secondary border me-1 mb-1">Severity: ${data.severity}/10</span>` +
        `<span class="badge bg-light text-secondary border me-1 mb-1">Duration: ${data.duration}</span>`;
      }
    }, 1200);
  }
});
