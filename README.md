# AegisHealth AI - Agentic AI-Powered Healthcare Intelligence & Patient Assistance System

A frontend healthcare intelligence platform built with **HTML5**, **CSS3**, **Bootstrap 5**, and **vanilla JavaScript**. Engineered with a clean medical theme (clinical white, soft blue, teal green) and designed around collaborative multi-agent clinical intelligence.

> **Medical Notice:** *AI suggestions are for guidance only, not a medical diagnosis. Please consult a doctor.*

---

## 📁 Project Architecture & Folder Structure

```text
Health care/
├── index.html                   # Main Landing Page & Multi-Agent Architecture Overview
├── css/
│   └── style.css                # Medical Theme Stylesheet (Variables, Components, Animations)
├── js/
│   ├── main.js                  # Shared Navigation, Toast Notifications, Active State
│   ├── chat-agent.js            # Multi-Agent Interactive Chatbot (5 Specialized Agents)
│   ├── symptom-checker.js       # 5-Step Symptom Assessment & Emergency Risk Stratification
│   ├── dashboard.js             # Clinical Decision Support System (CDSS) for Doctors
│   ├── appointments.js          # Specialist Recommender & Slot Booking Modal
│   └── records.js               # Diagnostic Lab Explainer (Plain English AI Translation)
├── images/
│   ├── logo.svg                 # AegisHealth AI Medical Cross & Neural Network Emblem
│   ├── hero-illustration.svg    # Collaborative Clinical AI & Vital Monitoring Vector
│   ├── agent-triage.svg         # Triage Sentinel Agent Icon
│   ├── agent-diagnostic.svg     # Biomarker Explainer Agent Icon
│   ├── agent-pharma.svg         # Pharmacology Safety Agent Icon
│   ├── agent-wellness.svg       # Diet & Lifestyle Coach Icon
│   └── doctor-avatar.svg        # Clinician Profile Avatar
└── pages/
    ├── login.html               # Patient & Clinician Portal Sign In / Register
    ├── patient-dashboard.html   # Patient Health Hub, Vitals, Doses & Triage History
    ├── doctor-dashboard.html    # Clinician CDSS Workspace with Live Triage & Schedule
    ├── reminders.html           # Medication & Daily Hydration/Habit Reminder Schedules
    ├── patient-assistant.html   # Conversational Multi-Agent Consultation Hub
    ├── symptom-checker.html     # Guided Step-by-Step Triage Wizard (ESI Severity)
    ├── doctor-intelligence.html # Clinical Portal with Real-Time Triage Queue & Vitals
    ├── appointments.html        # Doctor Directory, Specialty Matching & Appointments
    ├── health-records.html      # Lab Panels with AI Plain English Interpretation Toggle
    └── emergency.html           # Emergency SOS Hub (One-Tap 112 / 108, ER Locator & First Aid)
```

---

## 🎨 Medical Design System

- **Clean Medical White (`#ffffff`, `#f8fafc`)**: Provides a clinical, sterile, and trustworthy aesthetic.
- **Soft Clinical Blue (`#0284c7`, `#0369a1`, `#e0f2fe`)**: Inspires medical authority, calm, and precision.
- **Teal Green (`#0d9488`, `#14b8a6`, `#ccfbf1`)**: Symbolizes wellness, recovery, and proactive healthcare.
- **Safety Accents**:
  - Emergency / Red-Flag Red (`#ef4444`, `#fee2e2`)
  - Priority Amber (`#f59e0b`, `#fef3c7`)
  - Low Risk Green (`#10b981`, `#d1fae5`)
- **Typography**: Clean, accessible sans-serif typography (`Plus Jakarta Sans`).

---

## 🤖 The Autonomous Multi-Agent Swarm

1. **Dr. Nexus (AI Coordinator)**: Orchestrates conversational flow, extracts clinical entities, and delegates to specialized sub-agents.
2. **Dr. Triage AI (Triage Sentinel)**: Evaluates symptom severity, alerts to acute red flags (chest pain, dyspnea), and calculates clinical urgency.
3. **RxGuard (Pharmacological Safety Agent)**: Cross-references drug-drug interactions, food contraindications, and schedules.
4. **LabInsight (Diagnostic Explainer Agent)**: Demystifies technical lab panels (Lipids, CBC, CMP, HbA1c) into reassuring, plain English.
5. **NutriHealth (Diet & Wellness Coach)**: Evidence-based lifestyle guidance for cardiovascular health and diabetes support.

---

## 🚀 How to Run the Project

1. Since this is a pure static frontend with **no backend required**, you can open `index.html` directly in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari).
2. Or use any local server tool (e.g. VS Code Live Server, Python's `python -m http.server`, or Node's `npx serve`).

---

## ⚠️ Mandatory Safety Note
Every page includes a shared medical footer note:
> **"AI suggestions are for guidance only, not a medical diagnosis. Please consult a doctor."**
