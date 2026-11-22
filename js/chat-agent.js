/**
 * Agentic AI Multi-Agent Interactive Assistant
 * Simulates specialized autonomous agents collaborating for patient health:
 * 1. Coordinator Agent (Dr. Nexus)
 * 2. Chief Triage Agent (Dr. Triage AI)
 * 3. Pharmacological Safety Agent (RxGuard)
 * 4. Lab & Diagnostic Explainer Agent (LabInsight)
 * 5. Preventive Wellness & Nutrition Coach (NutriHealth)
 */

document.addEventListener('DOMContentLoaded', () => {
  const chatMessagesArea = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const agentSelectorBtns = document.querySelectorAll('.agent-selector-btn');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');
  const clearChatBtn = document.getElementById('clear-chat-btn');
  const activeAgentNameEl = document.getElementById('active-agent-name');
  const activeAgentRoleEl = document.getElementById('active-agent-role');
  const activeAgentAvatarEl = document.getElementById('active-agent-avatar');
  const downloadSummaryBtn = document.getElementById('download-summary-btn');

  // Agent State Definitions
  const agents = {
    coordinator: {
      name: "Dr. Nexus (AI Coordinator)",
      role: "Multi-Agent System Orchestrator",
      icon: "bi-cpu-fill",
      badgeClass: "badge-soft-blue",
      welcomeMsg: "Hello, I am **Dr. Nexus**, your AI Healthcare Coordinator. I synthesize insights across clinical triage, drug interactions, and diagnostics to assist your health journey. How can our agent team assist you today?",
      color: "var(--med-primary)"
    },
    triage: {
      name: "Dr. Triage AI",
      role: "Urgency Assessment Specialist",
      icon: "bi-heart-pulse-fill",
      badgeClass: "badge-soft-danger",
      welcomeMsg: "Greetings. I am the **Triage Assessment Agent**. I evaluate physical symptoms, assess potential red-flag indicators, and help you determine whether you require emergency care, an urgent clinic visit, or routine observation.",
      color: "#ef4444"
    },
    pharma: {
      name: "RxGuard Agent",
      role: "Medication & Interaction Specialist",
      icon: "bi-capsule",
      badgeClass: "badge-soft-teal",
      welcomeMsg: "Hello! I am **RxGuard**, your Medication Safety Specialist. You can ask me about medication dosage schedules, potential drug-drug interactions, side effects, and safe storage instructions.",
      color: "var(--med-teal)"
    },
    diagnostic: {
      name: "LabInsight Agent",
      role: "Lab Test & Biomarker Explainer",
      icon: "bi-file-earmark-medical-fill",
      badgeClass: "badge-soft-blue",
      welcomeMsg: "Welcome. I am **LabInsight**. Paste or describe your lab values (e.g. Complete Blood Count, Lipid Panel, HbA1c, Thyroid TSH), and I will explain what those numbers mean in clear, plain language.",
      color: "#0369a1"
    },
    wellness: {
      name: "NutriHealth Agent",
      role: "Nutrition & Lifestyle Coach",
      icon: "bi-apple",
      badgeClass: "badge-soft-success",
      welcomeMsg: "Hi there! I am **NutriHealth**. I provide science-backed lifestyle guidance, meal planning for hypertension/diabetes, hydration targets, and recuperation routines.",
      color: "#10b981"
    }
  };

  let currentAgentKey = 'coordinator';

  // Switch Active Agent
  agentSelectorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      agentSelectorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const agentKey = btn.getAttribute('data-agent');
      if (agents[agentKey]) {
        currentAgentKey = agentKey;
        const agent = agents[agentKey];

        if (activeAgentNameEl) activeAgentNameEl.textContent = agent.name;
        if (activeAgentRoleEl) activeAgentRoleEl.textContent = agent.role;
        if (activeAgentAvatarEl) {
          activeAgentAvatarEl.className = `bi ${agent.icon} fs-4`;
        }

        // Post system notification message in chat
        appendAgentMessage(agent.welcomeMsg, currentAgentKey, true);
      }
    });
  });

  // Suggestion Chips
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const promptText = chip.getAttribute('data-prompt') || chip.textContent.trim();
      if (chatInput) {
        chatInput.value = promptText;
        chatForm.dispatchEvent(new Event('submit'));
      }
    });
  });

  // Handle Form Submission
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const messageText = chatInput.value.trim();
      if (!messageText) return;

      // 1. Append User Message
      appendUserMessage(messageText);
      chatInput.value = '';

      // 2. Show Typing Indicator
      showTypingIndicator();

      // 3. Generate Agentic Response after realistic delay
      setTimeout(() => {
        removeTypingIndicator();
        const responseData = generateAgentResponse(messageText, currentAgentKey);
        appendAgentMessage(responseData.text, responseData.agentKey || currentAgentKey, false, responseData.recommendation);
      }, 1000 + Math.random() * 800);
    });
  }

  // Clear Chat
  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', () => {
      if (confirm("Reset conversation history with the AI Healthcare Assistant?")) {
        chatMessagesArea.innerHTML = '';
        appendAgentMessage(agents[currentAgentKey].welcomeMsg, currentAgentKey, true);
        showToast("Conversation Reset", "Chat memory has been cleared.", "info");
      }
    });
  }

  // Download Summary
  if (downloadSummaryBtn) {
    downloadSummaryBtn.addEventListener('click', () => {
      exportChatTranscript();
    });
  }

  function appendUserMessage(text) {
    const time = getFormattedTime();
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble user';
    bubble.innerHTML = `
      <div class="message-avatar">
        <i class="bi bi-person-fill"></i>
      </div>
      <div>
        <div class="message-content">
          ${escapeHtml(text)}
        </div>
        <div class="message-timestamp text-end">${time}</div>
      </div>
    `;
    chatMessagesArea.appendChild(bubble);
    scrollToBottom();
  }

  function appendAgentMessage(markdownText, agentKey = 'coordinator', isGreeting = false, recommendation = null) {
    const agent = agents[agentKey] || agents.coordinator;
    const time = getFormattedTime();
    const formattedHtml = parseSimpleMarkdown(markdownText);

    let recBadge = '';
    if (recommendation) {
      recBadge = `
        <div class="alert alert-light border mt-2 mb-0 py-2 px-3 small">
          <div class="d-flex align-items-center gap-2 text-primary font-weight-bold mb-1">
            <i class="bi bi-shield-check"></i> <strong>Agentic Next Steps:</strong>
          </div>
          <div>${recommendation}</div>
        </div>
      `;
    }

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble agent';
    bubble.innerHTML = `
      <div class="message-avatar" style="color: ${agent.color}">
        <i class="bi ${agent.icon}"></i>
      </div>
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="fw-bold small text-dark">${agent.name}</span>
          <span class="badge ${agent.badgeClass} rounded-pill font-monospace" style="font-size: 0.68rem;">${agent.role}</span>
        </div>
        <div class="message-content">
          ${formattedHtml}
          ${recBadge}
        </div>
        <div class="message-timestamp">${time} • AI Guidance</div>
      </div>
    `;
    chatMessagesArea.appendChild(bubble);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const existing = document.getElementById('chat-typing');
    if (existing) existing.remove();

    const typingEl = document.createElement('div');
    typingEl.id = 'chat-typing';
    typingEl.className = 'message-bubble agent';
    typingEl.innerHTML = `
      <div class="message-avatar text-primary">
        <i class="bi bi-robot"></i>
      </div>
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    chatMessagesArea.appendChild(typingEl);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const typing = document.getElementById('chat-typing');
    if (typing) typing.remove();
  }

  function scrollToBottom() {
    chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
  }

  /**
   * Domain-Aware Response Generator with Multi-Agent Intelligence Simulation
   */
  function generateAgentResponse(query, activeAgent) {
    const q = query.toLowerCase();

    // Red Flag / Critical Emergency Detection across all agents
    if (q.includes('chest pain') || q.includes('heart attack') || q.includes('difficulty breathing') || q.includes('cannot breathe') || q.includes('stroke') || q.includes('face drooping') || q.includes('severe bleeding')) {
      return {
        agentKey: 'triage',
        text: `⚠️ **CRITICAL CLINICAL ALERT DETECTED:**\n\nYour symptoms (**${query}**) may indicate an acute medical emergency such as cardiac ischemia, respiratory compromise, or stroke.\n\n**Immediate Actions Required:**\n1. **Call Emergency Services immediately: 112 (Emergency) or 108 (Ambulance)**.\n2. Do NOT drive yourself to the hospital.\n3. Rest in a comfortable seated position.\n4. If conscious and not allergic, ask emergency dispatch if taking an aspirin is indicated.`,
        recommendation: "Immediate ER Dispatch recommended. <a href='emergency.html' class='alert-link fw-bold'>Open Emergency SOS Protocols & Locator</a>"
      };
    }

    // Agent: RxGuard (Pharmacological Safety)
    if (activeAgent === 'pharma' || q.includes('dose') || q.includes('pill') || q.includes('drug') || q.includes('ibuprofen') || q.includes('amoxicillin') || q.includes('interaction') || q.includes('metformin')) {
      if (q.includes('ibuprofen') && (q.includes('amoxicillin') || q.includes('antibiotic'))) {
        return {
          agentKey: 'pharma',
          text: `**Drug Interaction Analysis:**\n\n- **Amoxicillin** (Aminopenicillin antibiotic)\n- **Ibuprofen** (NSAID pain reliever / anti-inflammatory)\n\n**Interaction Level: LOW / GENERALLY COMPATIBLE**\n- There is no direct contraindication between amoxicillin and ibuprofen for most healthy adults.\n- **Important Safety Note:** Always take ibuprofen with food or milk to minimize gastric mucosa irritation.\n- If you have known kidney disease, gastric ulcers, or are on ACE inhibitors, consult your doctor before taking NSAIDs.`,
          recommendation: "Take medications at scheduled intervals with food. Complete the full antibiotic cycle as prescribed."
        };
      }
      if (q.includes('metformin')) {
        return {
          agentKey: 'pharma',
          text: `**Metformin Clinical Guidance:**\n- **Primary Use:** Type 2 Diabetes management (improves insulin sensitivity).\n- **Best Administration:** Take with meals (usually breakfast and dinner) to reduce gastrointestinal side effects such as nausea or loose stools.\n- **Safety Flag:** Avoid heavy alcohol consumption while on Metformin to prevent lactic acidosis risk. Periodic kidney function (eGFR) checks are standard.`,
          recommendation: "Ensure bi-annual serum creatinine & eGFR monitoring with your primary physician."
        };
      }
      return {
        agentKey: 'pharma',
        text: `**Pharmacological Safety Review:**\nFor **"${query}"**, I have cross-checked standard pharmaceutical reference guidelines.\n\n- Check prescription labels for precise timing (e.g. before meals vs. after meals).\n- Keep a current medication list of all vitamins, OTC supplements, and prescription drugs.\n- Never alter or discontinue prescribed regimens without doctor approval.`,
        recommendation: "Log your current medications in the Health Records module for automated interaction cross-checks."
      };
    }

    // Agent: LabInsight (Lab and Diagnostics)
    if (activeAgent === 'diagnostic' || q.includes('lab') || q.includes('test') || q.includes('hba1c') || q.includes('cholesterol') || q.includes('blood') || q.includes('platelets')) {
      if (q.includes('hba1c') || q.includes('sugar')) {
        return {
          agentKey: 'diagnostic',
          text: `**Biomarker Analysis: HbA1c (Hemoglobin A1c)**\n\n- **What it reflects:** Your average blood glucose level over the previous 90 days (the lifespan of red blood cells).\n- **Standard Reference Intervals:**\n  - Normal: Under **5.7%**\n  - Prediabetes: **5.7% – 6.4%**\n  - Diabetes threshold: **6.5% or higher**\n\n**AI Clinical Note:** If your HbA1c is above normal, lifestyle adjustments (low-glycemic nutrition, strength training) along with metabolic monitoring can significantly reduce cardiovascular risks.`,
          recommendation: "Schedule a comprehensive metabolic consultation. <a href='appointments.html' class='alert-link'>Find an Endocrinologist</a>"
        };
      }
      if (q.includes('cholesterol') || q.includes('lipid')) {
        return {
          agentKey: 'diagnostic',
          text: `**Lipid Profile Overview:**\n- **Total Cholesterol:** Ideal < 200 mg/dL\n- **LDL ("Bad") Cholesterol:** Ideal < 100 mg/dL (or < 70 mg/dL for cardiac patients)\n- **HDL ("Good") Cholesterol:** Protective > 50 mg/dL for women, > 40 mg/dL for men\n- **Triglycerides:** Target < 150 mg/dL\n\nCardiovascular risk calculation considers your total lipid ratio alongside blood pressure, age, and lifestyle factors.`,
          recommendation: "Review full report metrics in the <a href='health-records.html' class='alert-link'>Health Records & Lab Explainer</a> page."
        };
      }
      return {
        agentKey: 'diagnostic',
        text: `**Diagnostic Interpretation:**\nI have parsed your query regarding: **"${query}"**.\n\nDiagnostic reference ranges vary slightly based on laboratory methodology and calibration standards. I can contextualize individual markers (e.g., CBC, Comprehensive Metabolic Panel, Thyroid TSH, Lipid Panels) into plain medical language.`,
        recommendation: "You can upload or inspect detailed sample lab reports in the Health Records section."
      };
    }

    // Agent: NutriHealth (Diet & Wellness)
    if (activeAgent === 'wellness' || q.includes('diet') || q.includes('food') || q.includes('weight') || q.includes('exercise') || q.includes('sleep') || q.includes('water')) {
      return {
        agentKey: 'wellness',
        text: `**Preventive Wellness & Nutrition Strategy:**\n\nRegarding **"${query}"**:\n1. **Anti-Inflammatory Principles:** Emphasize leafy greens, berries, olive oil, walnuts, and lean proteins.\n2. **Hydration Benchmark:** Target approximately 2.5 to 3 liters of water daily, adjusted for climate and physical activity.\n3. **Circadian Rhythm:** Maintain consistent sleep/wake times; 7-8 hours promotes cellular repair and immune regulation.\n4. **Cardiovascular Conditioning:** 150 minutes of moderate aerobic exercise per week (e.g. brisk walking, swimming).`,
        recommendation: "Track daily hydration and sleep targets for improved vitality."
      };
    }

    // Default / Coordinator Agent (Dr. Nexus)
    if (q.includes('headache') || q.includes('fever') || q.includes('cold') || q.includes('cough')) {
      return {
        agentKey: 'triage',
        text: `**Clinical Triage Evaluation:**\n\nI have registered symptoms relating to **"${query}"**.\n\n**Agentic Clinical Questions to Consider:**\n- **Duration:** Have symptoms persisted for more than 48-72 hours?\n- **Temperature:** Is fever above 101°F (38.3°C) or unresponsive to antipyretics?\n- **Neurological / Warning Signs:** Any stiff neck, photophobia (light sensitivity), confusion, or rash?\n\nIf you have a stiff neck with high fever, seek emergency medical care immediately. For moderate colds, rest, electrolyte hydration, and steam inhalation are standard supportive measures.`,
        recommendation: "Use our interactive <a href='symptom-checker.html' class='alert-link'>Symptom Checker</a> to calculate an exact triage risk index."
      };
    }

    // Fallback General Response
    return {
      agentKey: 'coordinator',
      text: `**Multi-Agent Assessment Synthesized:**\n\nThank you for providing this context: *"**${escapeHtml(query)}**"*\n\nOur agent swarm has reviewed this through:\n1. **Triage Filter:** No acute red-flag terminology detected.\n2. **Knowledge Retrieval:** Medical guidelines recommend monitoring symptom evolution over 24-48 hours.\n3. **Clinical Recommendation:** Keep a symptom diary noting severity (1-10 scale), times of flare-up, and response to rest.\n\nWould you like me to evaluate specific symptoms step-by-step, check drug interactions, or recommend a specialist in your area?`,
      recommendation: "Select an agent from the left sidebar or try our guided Symptom Checker."
    };
  }

  function parseSimpleMarkdown(str) {
    if (!str) return '';
    let html = escapeHtml(str);
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Bullet lists
    html = html.replace(/^\- (.*?)$/gm, '<li class="ms-3 mb-1">$1</li>');
    // Numbered lists
    html = html.replace(/^\d+\. (.*?)$/gm, '<li class="ms-3 mb-1">$1</li>');
    // Line breaks
    html = html.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    return html;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function exportChatTranscript() {
    const messages = chatMessagesArea.querySelectorAll('.message-bubble');
    if (messages.length === 0) {
      showToast("No Messages", "No conversation history to export.", "warning");
      return;
    }

    let transcript = "========================================================\n";
    transcript += "AGENTIC HEALTHCARE INTELLIGENCE - CONSULTATION SUMMARY\n";
    transcript += `Generated: ${new Date().toLocaleString()}\n`;
    transcript += "DISCLAIMER: AI suggestions are for guidance only, not a medical diagnosis.\n";
    transcript += "========================================================\n\n";

    messages.forEach(m => {
      const isUser = m.classList.contains('user');
      const sender = isUser ? "PATIENT" : "AI AGENT";
      const content = m.querySelector('.message-content') ? m.querySelector('.message-content').innerText : '';
      transcript += `[${sender}]:\n${content}\n\n--------------------------------------------------------\n\n`;
    });

    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Healthcare-AI-Summary-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("Summary Exported", "Consultation transcript downloaded successfully.", "success");
  }
});
