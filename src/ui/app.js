/**
 * GIA Trainer Application Controller
 * Orchestrates views, state transitions, audio-visual feedback, and user interaction.
 */

import { BATTERIES } from '../core/types.js';
import { I18N } from '../data/i18n.js';
import { SessionEngine } from '../engine/session.js';
import { KeyboardController } from '../engine/keyboard.js';
import { QuestionRenderer } from './renderer.js';

// DOM Selectors
const elBtnMethodology = document.getElementById('btn-methodology');
const elSetup = document.getElementById('panel-setup');
const elSession = document.getElementById('panel-session');
const elSummary = document.getElementById('panel-summary');

const elHeroTitle = document.getElementById('hero-title');
const elHeroSub = document.getElementById('hero-sub');
const elBatteryGrid = document.getElementById('battery-grid');
const elDurationLabel = document.getElementById('duration-label');
const elDurationSelect = document.getElementById('duration-select');
const elStartBtn = document.getElementById('start-btn');
const elBatteryHint = document.getElementById('battery-hint');
const elSpatialModeGroup = document.getElementById('spatial-mode-group');
const elSpatialModeLabel = document.getElementById('spatial-mode-label');
const elSpatialModeSelect = document.getElementById('spatial-mode-select');

const elBatteryName = document.getElementById('session-battery-name');
const elKeyHelp = document.getElementById('session-key-help');
const elClock = document.getElementById('session-clock');
const elTimerBar = document.getElementById('timer-bar-fill');
const elQViewport = document.getElementById('q-viewport');
const elEndBtn = document.getElementById('end-session-btn');

// HUD stats
const elHudScore = document.getElementById('hud-score');
const elHudAccuracy = document.getElementById('hud-accuracy');
const elHudTotal = document.getElementById('hud-total');
const elHudQpm = document.getElementById('hud-qpm');
const elHudStreak = document.getElementById('hud-streak');
const elHudAvgRt = document.getElementById('hud-avg-rt');

const elHudLblScore = document.getElementById('hud-lbl-score');
const elHudLblAccuracy = document.getElementById('hud-lbl-accuracy');
const elHudLblTotal = document.getElementById('hud-lbl-total');
const elHudLblQpm = document.getElementById('hud-lbl-qpm');
const elHudLblStreak = document.getElementById('hud-lbl-streak');
const elHudLblLatency = document.getElementById('hud-lbl-latency');

// Modal
const elModal = document.getElementById('info-modal');
const elModalTitle = document.getElementById('modal-title');
const elModalBody = document.getElementById('modal-body');
const elModalCloseBtn = document.getElementById('modal-close-btn');

// State
let selectedBattery = BATTERIES.NUMBER_SPEED;
let currentLang = 'en';
let currentEngine = null;
let renderer = new QuestionRenderer(elQViewport, currentLang);

// Keyboard Controller
const keyboard = new KeyboardController({
  isActive: () => currentEngine && currentEngine.status === 'running',
  onKeyPress: (key) => handleErgonomicKey(key)
});
keyboard.attach();

/**
 * Applies the selected language across all UI panels and templates.
 * @param {'en'|'es'} lang
 */
function setLanguage(lang) {
  currentLang = lang;
  renderer.setLang(lang);
  const t = I18N[lang] || I18N.en;

  // Header
  if (elBtnMethodology) elBtnMethodology.textContent = t.header.methodologyBtn;

  // Setup panel
  if (elHeroTitle) elHeroTitle.textContent = t.setup.heroTitle;
  if (elHeroSub) elHeroSub.textContent = t.setup.heroSub;
  if (elDurationLabel) elDurationLabel.textContent = t.setup.durationLabel;

  // Re-populate duration select options while preserving selected value
  const currentDurationVal = elDurationSelect.value || '150';
  elDurationSelect.innerHTML = '';
  t.setup.durations.forEach((d) => {
    const opt = document.createElement('option');
    opt.value = d.value;
    opt.textContent = d.label;
    if (d.value === currentDurationVal) opt.selected = true;
    elDurationSelect.appendChild(opt);
  });

  // Re-populate spatial mode options while preserving selected value
  if (elSpatialModeLabel && t.setup.spatialModeLabel) {
    elSpatialModeLabel.textContent = t.setup.spatialModeLabel;
  }
  if (elSpatialModeSelect && t.setup.spatialModes) {
    const currentModeVal = elSpatialModeSelect.value || 'standard';
    elSpatialModeSelect.innerHTML = '';
    t.setup.spatialModes.forEach((m) => {
      const opt = document.createElement('option');
      opt.value = m.value;
      opt.textContent = m.label;
      if (m.value === currentModeVal) opt.selected = true;
      elSpatialModeSelect.appendChild(opt);
    });
  }

  // Session panel labels
  if (elEndBtn) elEndBtn.textContent = t.session.endBtn;
  if (elHudLblScore) elHudLblScore.textContent = t.session.hudScore;
  if (elHudLblAccuracy) elHudLblAccuracy.textContent = t.session.hudAccuracy;
  if (elHudLblTotal) elHudLblTotal.textContent = t.session.hudTotal;
  if (elHudLblQpm) elHudLblQpm.textContent = t.session.hudQpm;
  if (elHudLblStreak) elHudLblStreak.textContent = t.session.hudStreak;
  if (elHudLblLatency) elHudLblLatency.textContent = t.session.hudAvgRt;

  // Modal content
  renderModalContent(t.modal);

  // Cards and hint
  renderBatteryCards();
  updateSetupHint();
}

/**
 * Renders the battery selection cards based on active language.
 */
function renderBatteryCards() {
  const t = I18N[currentLang] || I18N.en;
  const batteryKeys = [
    BATTERIES.NUMBER_SPEED,
    BATTERIES.PERCEPTUAL,
    BATTERIES.REASONING,
    BATTERIES.WORD_MEANING,
    BATTERIES.SPATIAL,
    'mixed'
  ];

  elBatteryGrid.innerHTML = '';

  batteryKeys.forEach((key) => {
    const b = t.batteries[key];
    const card = document.createElement('div');
    card.className = `battery-card ${key === selectedBattery ? 'selected' : ''}`;
    card.dataset.id = key;

    card.innerHTML = `
      <div class="b-title">
        <span>${b.shortName || b.name}</span>
        <span class="b-tag">${b.tag}</span>
      </div>
      <div class="b-desc">${b.desc}</div>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('.battery-card').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedBattery = key;
      updateSetupHint();
    });

    elBatteryGrid.appendChild(card);
  });
}

/**
 * Updates the informative hint box below the battery selection grid.
 */
function updateSetupHint() {
  const t = I18N[currentLang] || I18N.en;

  if (elSpatialModeGroup) {
    elSpatialModeGroup.style.display = (selectedBattery === BATTERIES.SPATIAL || selectedBattery === 'mixed') ? 'flex' : 'none';
  }

  if (selectedBattery === 'mixed') {
    elBatteryHint.innerHTML = `<strong>${t.setup.mixedHintTitle}</strong> ${t.setup.mixedHintDesc}`;
    elStartBtn.textContent = t.setup.startMixedBtn;
  } else {
    const b = t.batteries[selectedBattery];
    elBatteryHint.innerHTML = `<strong>${b.name}:</strong> ${b.hintDesc} <br><small style="color:var(--accent);">${t.setup.keysLabel}: ${b.keys}</small>`;
    elStartBtn.textContent = `${t.setup.startBtn}${b.shortName || b.name}`;
  }
}

/**
 * Renders modal content in the active language.
 * @param {Object} m
 */
function renderModalContent(m) {
  if (elModalTitle) elModalTitle.textContent = m.title;
  if (elModalBody) {
    elModalBody.innerHTML = `
      <p>${m.p1}</p>
      <h4>${m.scoringTitle}</h4>
      <p style="font-family: var(--mono); background: var(--surface-2); padding: 8px 12px; border-radius: 6px; margin: 8px 0;">
        ${m.scoringFormula}
      </p>
      <p>${m.scoringExplain}</p>
      <h4>${m.batteriesTitle}</h4>
      <ul>
        ${m.batteriesList.map((item) => `<li>${item}</li>`).join('')}
      </ul>
      <h4>${m.ergonomicsTitle}</h4>
      <p>${m.ergonomicsDesc}</p>
    `;
  }
}

/**
 * Handles incoming keystroke from the low-latency keyboard engine.
 * @param {string} key
 */
function handleErgonomicKey(key) {
  if (!currentEngine || currentEngine.status !== 'running') return;

  const currentQ = currentEngine.currentQuestion;
  if (!currentQ) return;

  // Phase 1: Reasoning premise screen waiting for Space or Enter
  if (currentQ.hasTwoPhases && currentEngine.phase === 'read') {
    if (key === 'Space' || key === 'Enter') {
      currentEngine.advanceToQuestion();
    }
    return;
  }

  // Phase 2: Answering
  if (currentEngine.phase === 'answer') {
    const matchedOpt = currentQ.options.find(
      (opt) => opt.key === key || opt.aliasKey === key || (opt.id === key)
    );

    if (matchedOpt) {
      currentEngine.submitAnswer(matchedOpt.id);
    }
  }
}

/**
 * Starts a training session.
 */
function startSession() {
  const durationSec = parseInt(elDurationSelect.value, 10);
  const spatialMode = elSpatialModeSelect ? elSpatialModeSelect.value : 'standard';
  const lang = currentLang;

  currentEngine = new SessionEngine({
    battery: selectedBattery,
    durationSec,
    lang,
    spatialMode,
    callbacks: {
      onStart: handleSessionStart,
      onTick: handleSessionTick,
      onQuestion: handleQuestionRender,
      onPhaseTransition: handleQuestionRender,
      onAnswerResult: handleAnswerResult,
      onFinish: handleSessionFinish
    }
  });

  currentEngine.start();
}

function handleSessionStart(info) {
  elSetup.style.display = 'none';
  elSummary.style.display = 'none';
  elSession.style.display = 'block';

  const t = I18N[currentLang] || I18N.en;
  const b = t.batteries[selectedBattery];

  elBatteryName.textContent = b ? b.name : selectedBattery;
  elKeyHelp.textContent = b ? b.keys : 'Adaptable';
  elTimerBar.style.width = '100%';
  elTimerBar.style.backgroundColor = 'var(--green)';

  resetHudStats();
}

function handleSessionTick({ remainingMs, progressPercent, durationSec }) {
  if (durationSec > 0) {
    const totalSec = Math.ceil(remainingMs / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    elClock.textContent = `${m}:${String(s).padStart(2, '0')}`;

    const fillPct = Math.max(0, 100 - progressPercent);
    elTimerBar.style.width = `${fillPct}%`;

    if (fillPct > 40) {
      elTimerBar.style.backgroundColor = 'var(--green)';
    } else if (fillPct > 18) {
      elTimerBar.style.backgroundColor = 'var(--amber)';
    } else {
      elTimerBar.style.backgroundColor = 'var(--red)';
    }
  } else {
    elClock.textContent = '∞';
    elTimerBar.style.width = '100%';
    elTimerBar.style.backgroundColor = 'var(--accent)';
  }
}

function handleQuestionRender(question, phase) {
  renderer.render(
    question,
    phase,
    (selectedId) => currentEngine.submitAnswer(selectedId),
    () => currentEngine.advanceToQuestion()
  );
}

function handleAnswerResult({ isCorrect, selectedId, correctId, stats }) {
  renderer.showFeedback(selectedId, correctId);

  // Flash UI feedback
  elSession.classList.remove('flash-correct', 'flash-wrong');
  void elSession.offsetWidth; // Force reflow
  elSession.classList.add(isCorrect ? 'flash-correct' : 'flash-wrong');

  updateHudStats(stats);
}

function resetHudStats() {
  elHudScore.textContent = '0.0';
  elHudAccuracy.textContent = '100%';
  elHudTotal.textContent = '0';
  elHudQpm.textContent = '0';
  elHudStreak.textContent = '0';
  elHudAvgRt.textContent = '–';
}

function updateHudStats(stats) {
  elHudScore.textContent = stats.netScore.toFixed(1);
  elHudAccuracy.textContent = `${stats.accuracy}%`;
  elHudTotal.textContent = `${stats.correct}/${stats.total}`;
  elHudQpm.textContent = stats.throughputQpm;
  elHudStreak.textContent = stats.streak;
  elHudAvgRt.textContent = stats.avgRtMs > 0 ? `${stats.avgRtMs}ms` : '–';
}

function handleSessionFinish(summary) {
  elSession.style.display = 'none';
  elSummary.style.display = 'block';

  renderSummaryReport(summary);
}

/**
 * Builds and renders the comprehensive summary report in the active language.
 * @param {Object} summary
 */
function renderSummaryReport(summary) {
  const { stats, breakdown, battery } = summary;
  const t = I18N[currentLang] || I18N.en;
  const sumT = t.summary;

  // Coaching Advice logic based on speed-accuracy trade-off
  let advice = '';
  if (stats.accuracy >= 90) {
    advice = sumT.adviceExcellent(stats.accuracy);
  } else if (stats.accuracy >= 75) {
    advice = sumT.adviceBalanced(stats.accuracy, stats.throughputQpm, stats.avgRtMs);
  } else {
    advice = sumT.adviceCaution(stats.accuracy);
  }

  // Battery breakdown table if multiple batteries or mixed
  let breakdownHTML = '';
  const batteryKeys = Object.keys(breakdown);
  if (batteryKeys.length > 0) {
    const rows = batteryKeys.map((key) => {
      const b = breakdown[key];
      const bInfo = t.batteries[key];
      const name = bInfo ? bInfo.name : key;
      return `
        <tr>
          <td><strong>${name}</strong></td>
          <td>${b.correct} / ${b.total}</td>
          <td>${b.accuracy}%</td>
          <td>${b.avgRtMs} ms</td>
          <td>${b.netScore} pts</td>
        </tr>
      `;
    }).join('');

    breakdownHTML = `
      <div class="breakdown-table-wrapper">
        <table class="breakdown-table">
          <thead>
            <tr>
              <th>${sumT.tableBattery}</th>
              <th>${sumT.tableCorrect}</th>
              <th>${sumT.tableAccuracy}</th>
              <th>${sumT.tableAvgRt}</th>
              <th>${sumT.tableNetScore}</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  const activeBatteryInfo = t.batteries[battery];
  const batteryDisplayName = activeBatteryInfo ? activeBatteryInfo.name : battery;

  elSummary.innerHTML = `
    <div class="summary-header">
      <h2>${sumT.title}</h2>
      <p>${sumT.meta(batteryDisplayName, summary.totalElapsedSec)}</p>
    </div>

    <div class="summary-score-hero">
      <div class="hero-score-val">${stats.netScore.toFixed(1)}</div>
      <div class="hero-score-lbl">${sumT.scoreLabel}</div>
      <div class="hero-score-sub">${sumT.heroSub(stats.accuracy, stats.throughputQpm)}</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="n">${stats.correct} / ${stats.total}</div>
        <div class="l">${sumT.statAttempts}</div>
      </div>
      <div class="stat-card">
        <div class="n">${stats.throughputQpm}</div>
        <div class="l">${sumT.statQpm}</div>
      </div>
      <div class="stat-card">
        <div class="n">${stats.avgRtMs > 0 ? `${stats.avgRtMs} ms` : '–'}</div>
        <div class="l">${sumT.statRt}</div>
      </div>
      <div class="stat-card">
        <div class="n">${stats.bestStreak}</div>
        <div class="l">${sumT.statStreak}</div>
      </div>
    </div>

    ${breakdownHTML}

    <div class="advice-card">
      ${advice}
    </div>

    <button type="button" class="btn-primary" id="btn-restart">
      ${sumT.restartBtn}
    </button>
  `;

  document.getElementById('btn-restart').onclick = () => {
    elSummary.style.display = 'none';
    elSetup.style.display = 'block';
  };
}

// Language Switcher buttons binding
document.querySelectorAll('.lang-btn').forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll('.lang-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    setLanguage(btn.dataset.lang);
  };
});

// Setup actions
elStartBtn.onclick = startSession;
elEndBtn.onclick = () => {
  if (currentEngine) currentEngine.finish('manual');
};

// Modal events
if (elBtnMethodology) {
  elBtnMethodology.onclick = () => elModal.classList.add('open');
}
if (elModalCloseBtn) {
  elModalCloseBtn.onclick = () => elModal.classList.remove('open');
}
if (elModal) {
  elModal.onclick = (e) => {
    if (e.target === elModal) elModal.classList.remove('open');
  };
}

// Initialize with default language (EN)
setLanguage('en');
