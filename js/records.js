/**
 * Health Records & AI Lab Report Explainer
 */

document.addEventListener('DOMContentLoaded', () => {
  const toggleViewBtn = document.getElementById('toggle-ai-explainer');
  const clinicalViews = document.querySelectorAll('.view-clinical');
  const aiViews = document.querySelectorAll('.view-ai-plain');
  const filterRecordType = document.querySelectorAll('.record-type-filter');
  const reportCards = document.querySelectorAll('.report-card');
  let isAiMode = true;

  if (toggleViewBtn) {
    toggleViewBtn.addEventListener('click', () => {
      isAiMode = !isAiMode;
      updateReportDisplayMode();
    });
  }

  function updateReportDisplayMode() {
    if (isAiMode) {
      clinicalViews.forEach(el => el.style.display = 'none');
      aiViews.forEach(el => el.style.display = 'block');
      toggleViewBtn.innerHTML = '<i class="bi bi-toggle-on text-teal fs-5 me-1"></i> <strong>AI Plain English Mode (Active)</strong>';
      toggleViewBtn.classList.add('btn-soft-teal');
    } else {
      clinicalViews.forEach(el => el.style.display = 'block');
      aiViews.forEach(el => el.style.display = 'none');
      toggleViewBtn.innerHTML = '<i class="bi bi-toggle-off text-muted fs-5 me-1"></i> <strong>Clinical Numeric View (Standard)</strong>';
      toggleViewBtn.classList.remove('btn-soft-teal');
    }
  }

  // Filter record cards by category
  filterRecordType.forEach(btn => {
    btn.addEventListener('click', () => {
      filterRecordType.forEach(b => b.classList.remove('active', 'btn-primary'));
      filterRecordType.forEach(b => b.classList.add('btn-light'));
      btn.classList.remove('btn-light');
      btn.classList.add('active', 'btn-primary');

      const filter = btn.getAttribute('data-type');
      reportCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Action: "Ask AI Agent About This Result"
  const askAgentButtons = document.querySelectorAll('.btn-ask-agent-report');
  askAgentButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const metricName = btn.getAttribute('data-metric');
      const val = btn.getAttribute('data-value');
      const query = encodeURIComponent(`Can you explain my lab result: ${metricName} is ${val}? What does this mean for my health?`);
      window.location.href = `patient-assistant.html?prompt=${query}`;
    });
  });

  // Initialize in AI mode
  updateReportDisplayMode();
});
