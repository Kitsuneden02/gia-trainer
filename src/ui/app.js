/**
 * GIA Trainer Application Controller
 * Orchestrates views, state transitions, audio-visual feedback, and user interaction.
 */

import { BATTERIES } from '../core/types.js';
import { I18N } from '../data/i18n.js';
import { SessionEngine } from '../engine/session.js';
import { KeyboardController } from '../engine/keyboard.js';
import { QuestionRenderer } from './renderer.js';
import { saveSessionResult, getPersonalBests, getSessionHistory, clearAllStorage } from '../engine/storage.js';

// DOM Selectors
const elBtnHistory = document.getElementById('btn-history');
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

const elTargetBenchmarkGroup = document.getElementById('target-benchmark-group');
const elTargetBenchmarkLabel = document.getElementById('target-benchmark-label');
const elTargetBenchmarkSelect = document.getElementById('target-benchmark-select');
const elCustomQpmGroup = document.getElementById('custom-qpm-group');
const elCustomQpmLabel = document.getElementById('custom-qpm-label');
const elCustomQpmInput = document.getElementById('custom-qpm-input');

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
const elHudStatPacing = document.getElementById('hud-stat-pacing');
const elHudPacing = document.getElementById('hud-pacing');

const elHudLblScore = document.getElementById('hud-lbl-score');
const elHudLblAccuracy = document.getElementById('hud-lbl-accuracy');
const elHudLblTotal = document.getElementById('hud-lbl-total');
const elHudLblQpm = document.getElementById('hud-lbl-qpm');
const elHudLblStreak = document.getElementById('hud-lbl-streak');
const elHudLblLatency = document.getElementById('hud-lbl-latency');
const elHudLblPacing = document.getElementById('hud-lbl-pacing');

// Modals
const elModal = document.getElementById('info-modal');
const elModalTitle = document.getElementById('modal-title');
const elModalBody = document.getElementById('modal-body');
const elModalCloseBtn = document.getElementById('modal-close-btn');

const elHistoryModal = document.getElementById('history-modal');
const elHistoryModalTitle = document.getElementById('history-modal-title');
const elHistoryModalBody = document.getElementById('history-modal-body');
const elHistoryModalCloseBtn = document.getElementById('history-modal-close-btn');

// Brand & Abort Modal Elements
const elBrandHomeBtn = document.getElementById('brand-home-btn');
const elAbortModal = document.getElementById('abort-modal');
const elAbortModalTitle = document.getElementById('abort-modal-title');
const elAbortModalDesc = document.getElementById('abort-modal-desc');
const elBtnAbortResume = document.getElementById('btn-abort-resume');
const elBtnAbortConfirm = document.getElementById('btn-abort-confirm');

// Benchmark Profiles
const BENCHMARKS = {
  'none': { targetQpm: 0, targetAcc: 0 },
  'standard': { targetQpm: 20, targetAcc: 85 },
  'top-tier': { targetQpm: 28, targetAcc: 90 },
  'elite': { targetQpm: 34, targetAcc: 95 }
};

function getActiveBenchmark() {
  const val = elTargetBenchmarkSelect ? elTargetBenchmarkSelect.value : 'none';
  if (val === 'custom') {
    const customQpm = parseInt(elCustomQpmInput?.value, 10) || 28;
    return { tier: 'custom', targetQpm: customQpm, targetAcc: 85 };
  }
  const preset = BENCHMARKS[val] || BENCHMARKS.none;
  return { tier: val, ...preset };
}

// State
let selectedBattery = BATTERIES.NUMBER_SPEED;
let activeHistoryTab = BATTERIES.NUMBER_SPEED;
let filterOutDroppedSessions = true;
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
  if (elBtnHistory && t.setup.historyBtn) elBtnHistory.textContent = t.setup.historyBtn;

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

  // Re-populate target benchmark options while preserving selected value
  if (elTargetBenchmarkLabel && t.setup.targetLabel) {
    elTargetBenchmarkLabel.textContent = t.setup.targetLabel;
  }
  if (elTargetBenchmarkSelect && t.setup.targets) {
    const currentTargetVal = elTargetBenchmarkSelect.value || 'none';
    elTargetBenchmarkSelect.innerHTML = '';
    t.setup.targets.forEach((tg) => {
      const opt = document.createElement('option');
      opt.value = tg.value;
      opt.textContent = tg.label;
      if (tg.value === currentTargetVal) opt.selected = true;
      elTargetBenchmarkSelect.appendChild(opt);
    });
  }
  if (elCustomQpmLabel && t.setup.customQpmLabel) {
    elCustomQpmLabel.textContent = t.setup.customQpmLabel;
  }

  // Session panel labels
  if (elEndBtn) elEndBtn.textContent = t.session.endBtn;
  if (elHudLblScore) elHudLblScore.textContent = t.session.hudScore;
  if (elHudLblAccuracy) elHudLblAccuracy.textContent = t.session.hudAccuracy;
  if (elHudLblTotal) elHudLblTotal.textContent = t.session.hudTotal;
  if (elHudLblQpm) elHudLblQpm.textContent = t.session.hudQpm;
  if (elHudLblStreak) elHudLblStreak.textContent = t.session.hudStreak;
  if (elHudLblLatency) elHudLblLatency.textContent = t.session.hudAvgRt;
  if (elHudLblPacing && t.session.hudPacing) elHudLblPacing.textContent = t.session.hudPacing;

  // Modal content
  renderModalContent(t.modal);
  if (elHistoryModalTitle && t.summary.historyModalTitle) {
    elHistoryModalTitle.textContent = t.summary.historyModalTitle;
  }

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

  const bench = getActiveBenchmark();
  if (bench && bench.targetQpm > 0 && elHudStatPacing) {
    elHudStatPacing.style.display = 'block';
    elHudPacing.textContent = `0 / ${bench.targetQpm}`;
    elHudPacing.style.color = 'var(--text)';
  } else if (elHudStatPacing) {
    elHudStatPacing.style.display = 'none';
  }
}

function updateHudStats(stats) {
  elHudScore.textContent = stats.netScore.toFixed(1);
  elHudAccuracy.textContent = `${stats.accuracy}%`;
  elHudTotal.textContent = `${stats.correct}/${stats.total}`;
  elHudQpm.textContent = stats.throughputQpm;
  elHudStreak.textContent = stats.streak;
  elHudAvgRt.textContent = stats.avgRtMs > 0 ? `${stats.avgRtMs}ms` : '–';

  const bench = getActiveBenchmark();
  if (bench && bench.targetQpm > 0 && elHudStatPacing) {
    elHudStatPacing.style.display = 'block';
    const diff = stats.throughputQpm - bench.targetQpm;
    const symbol = diff >= 0 ? '▲' : '▼';
    const color = diff >= 0 ? 'var(--green)' : 'var(--amber)';
    elHudPacing.innerHTML = `<span style="color:${color}">${stats.throughputQpm}/${bench.targetQpm} ${symbol}</span>`;
  }
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

  // Evaluate Benchmark Target
  const bench = getActiveBenchmark();
  const targetMet = bench && bench.targetQpm > 0 ? (stats.throughputQpm >= bench.targetQpm && stats.accuracy >= bench.targetAcc) : false;

  // Persist session result to localStorage and determine if it's a new PB
  const { isNewPb, previousPb } = saveSessionResult({
    battery,
    durationSec: summary.durationSec,
    elapsedSec: summary.totalElapsedSec,
    netScore: stats.netScore,
    correct: stats.correct,
    total: stats.total,
    accuracy: stats.accuracy,
    throughputQpm: stats.throughputQpm,
    avgRtMs: stats.avgRtMs,
    bestStreak: stats.bestStreak,
    targetTier: bench ? bench.tier : 'none',
    targetMet
  });

  let pbBadgeHTML = '';
  if (isNewPb) {
    pbBadgeHTML = `<div class="pb-badge">${sumT.newPbBadge} ${previousPb !== null ? `(${sumT.previousPb(previousPb)})` : ''}</div>`;
  }

  let targetCardHTML = '';
  if (bench && bench.targetQpm > 0) {
    const rawGap = stats.throughputQpm - bench.targetQpm;
    const gap = Math.round(rawGap * 10) / 10;
    const isSuccess = targetMet;
    const badgeClass = isSuccess ? 'met' : 'missed';
    const badgeText = isSuccess ? sumT.targetAchieved : sumT.targetMissed;
    const gapText = sumT.targetGap(gap);
    const actualText = sumT.targetActual ? sumT.targetActual(stats.throughputQpm, stats.accuracy) : `Actual: ${stats.throughputQpm} QPM (${stats.accuracy}%)`;
    const specText = sumT.targetSpec ? sumT.targetSpec(bench.targetQpm, bench.targetAcc) : `${bench.targetQpm} Net QPM (≥${bench.targetAcc}% Acc)`;
    const accWarning = (!isSuccess && stats.accuracy < bench.targetAcc) ? `<br><small style="color:var(--red); font-weight:600;">${sumT.targetAccuracyWarning(stats.accuracy, bench.targetAcc)}</small>` : '';

    targetCardHTML = `
      <div class="target-card ${badgeClass}">
        <div class="target-card-info">
          <h4>${sumT.targetGoalTitle}: ${specText}</h4>
          <p><span class="target-gap-val ${gap >= 0 ? 'above' : 'below'}">${gapText}</span> • ${actualText}${accWarning}</p>
        </div>
        <div class="target-badge ${badgeClass}">
          ${badgeText}
        </div>
      </div>
    `;
  }

  elSummary.innerHTML = `
    <div class="summary-header">
      <h2>${sumT.title}</h2>
      <p>${sumT.meta(batteryDisplayName, summary.totalElapsedSec)}</p>
      ${pbBadgeHTML}
    </div>

    ${targetCardHTML}

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

    <div class="summary-actions">
      <button type="button" class="btn-primary" id="btn-repeat">
        ${sumT.repeatBtn}
      </button>
      <button type="button" class="btn-secondary" id="btn-home">
        ${sumT.homeBtn}
      </button>
    </div>
  `;

  document.getElementById('btn-repeat').onclick = () => {
    startSession();
  };

  document.getElementById('btn-home').onclick = () => {
    elSummary.style.display = 'none';
    elSetup.style.display = 'block';
  };
}

/**
 * Generates an interactive, responsive SVG line & area chart with native tooltips and clamped coordinates.
 */
function generateSvgTrendChart({ data, color = '#0284c7', targetValue = null, suffix = '', fixedMin = null, fixedMax = null }) {
  if (!data || data.length === 0) {
    return `<div class="chart-empty-state"><span>–</span></div>`;
  }

  const width = 280;
  const height = 155;
  const padLeft = 38;
  const padRight = 16;
  const padTop = 18;
  const padBottom = 26;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const vals = data.map(d => Number(d.value));
  let minVal = Math.min(...vals);
  let maxVal = Math.max(...vals);

  // When fixedMin/fixedMax are specified (e.g. 0-100% for accuracy), respect them but clamp to encompass any outliers
  if (fixedMin !== null) minVal = Math.min(minVal, fixedMin);
  if (fixedMax !== null) maxVal = Math.max(maxVal, fixedMax);

  if (targetValue !== null) {
    minVal = Math.min(minVal, targetValue);
    maxVal = Math.max(maxVal, targetValue);
  }

  // Ensure reasonable vertical spread without zero division
  if (minVal === maxVal) {
    minVal = Math.max(0, minVal - 5);
    maxVal = maxVal + 5;
  } else {
    const spread = maxVal - minVal;
    if (fixedMin === null) minVal = Math.max(0, minVal - spread * 0.08);
    if (fixedMax === null) maxVal = maxVal + spread * 0.08;
  }

  const getY = (val) => {
    const rawNorm = (maxVal === minVal) ? 0.5 : (val - minVal) / (maxVal - minVal);
    // Strict clamp between 0.0 and 1.0 ensures lines NEVER escape the chart box
    const norm = Math.max(0, Math.min(1, rawNorm));
    return padTop + (1 - norm) * chartH;
  };

  const getX = (idx) => {
    if (data.length === 1) return padLeft + chartW / 2;
    return padLeft + (idx / (data.length - 1)) * chartW;
  };

  const points = data.map((d, idx) => ({
    x: getX(idx),
    y: getY(d.value),
    val: d.value,
    label: d.label,
    date: d.date
  }));

  // Build line path
  const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // Build area path
  const bottomY = padTop + chartH;
  const areaD = `${lineD} L ${points[points.length - 1].x.toFixed(1)},${bottomY} L ${points[0].x.toFixed(1)},${bottomY} Z`;

  // Unique Gradient ID
  const gradId = `grad-${Math.random().toString(36).substring(2, 9)}`;

  // Target horizontal line (if specified)
  let targetLineSvg = '';
  if (targetValue !== null && targetValue >= minVal && targetValue <= maxVal) {
    const tY = getY(targetValue);
    targetLineSvg = `
      <line x1="${padLeft}" y1="${tY.toFixed(1)}" x2="${width - padRight}" y2="${tY.toFixed(1)}" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.9" />
      <text x="${width - padRight}" y="${(tY - 4).toFixed(1)}" fill="#fbbf24" font-size="11" font-weight="700" font-family="var(--mono)" text-anchor="end">${targetValue}${suffix}</text>
    `;
  }

  // Midpoint reference grid line
  const midY = padTop + chartH / 2;

  // Dots with hover title tooltips
  const dotsSvg = points.map((p) => `
    <circle class="chart-point" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="${color}" stroke="#090d12" stroke-width="2">
      <title>${p.label}: ${p.val}${suffix} (${p.date})</title>
    </circle>
  `).join('');

  const minLabel = Math.round(minVal);
  const maxLabel = Math.round(maxVal);

  return `
    <div class="chart-svg-container">
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.38" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0.0" />
          </linearGradient>
        </defs>
        <!-- Horizontal grid guides -->
        <line x1="${padLeft}" y1="${padTop}" x2="${width - padRight}" y2="${padTop}" stroke="var(--border)" stroke-width="0.8" stroke-dasharray="2,2" opacity="0.35" />
        <line x1="${padLeft}" y1="${midY}" x2="${width - padRight}" y2="${midY}" stroke="var(--border)" stroke-width="0.8" stroke-dasharray="2,2" opacity="0.2" />
        <line x1="${padLeft}" y1="${bottomY}" x2="${width - padRight}" y2="${bottomY}" stroke="var(--border)" stroke-width="1" opacity="0.6" />
        
        <!-- Y-axis text labels (large, high-contrast, legible) -->
        <text x="${padLeft - 6}" y="${padTop + 4}" fill="var(--text-muted)" font-size="11" font-weight="700" font-family="var(--mono)" text-anchor="end">${maxLabel}</text>
        <text x="${padLeft - 6}" y="${bottomY - 2}" fill="var(--text-muted)" font-size="11" font-weight="700" font-family="var(--mono)" text-anchor="end">${minLabel}</text>

        <!-- Benchmark / Target Line -->
        ${targetLineSvg}

        <!-- Filled Area under line -->
        <path d="${areaD}" fill="url(#${gradId})" />

        <!-- Main Trend Line -->
        <path d="${lineD}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Points with tooltips -->
        ${dotsSvg}

        <!-- X-axis index labels -->
        <text x="${points[0].x.toFixed(1)}" y="${height - 8}" fill="var(--text-muted)" font-size="11" font-weight="600" font-family="var(--mono)" text-anchor="start">#1</text>
        <text x="${points[points.length - 1].x.toFixed(1)}" y="${height - 8}" fill="var(--text-muted)" font-size="11" font-weight="600" font-family="var(--mono)" text-anchor="end">#${points.length}</text>
      </svg>
    </div>
  `;
}

/**
 * Renders the body content of the History & Charts Modal.
 */
function renderHistoryModalContent() {
  const t = I18N[currentLang] || I18N.en;
  const sumT = t.summary;
  const histT = t.history || {};
  const pbs = getPersonalBests();
  const rawHistory = getSessionHistory();
  const totalRawCount = rawHistory.length;

  // Filter out dropped / abandoned sessions (<25s duration or <8 questions answered)
  const history = filterOutDroppedSessions
    ? rawHistory.filter((s) => (s.elapsedSec >= 25 || s.durationSec === 0 || s.total >= 8))
    : rawHistory;

  const droppedCount = totalRawCount - history.length;

  const batteryKeys = [
    BATTERIES.NUMBER_SPEED,
    BATTERIES.PERCEPTUAL,
    BATTERIES.REASONING,
    BATTERIES.WORD_MEANING,
    BATTERIES.SPATIAL,
    'mixed',
    'all'
  ];

  if (!batteryKeys.includes(activeHistoryTab)) {
    activeHistoryTab = BATTERIES.NUMBER_SPEED;
  }

  // 1. Tab buttons with individual session count
  const tabsHTML = `
    <div class="history-tabs" role="tablist">
      ${batteryKeys.map((batKey) => {
        let name = '';
        let count = 0;
        if (batKey === 'all') {
          name = currentLang === 'es' ? 'Todas' : 'All';
          count = history.length;
        } else {
          const bInfo = t.batteries[batKey];
          name = bInfo ? (bInfo.shortName || bInfo.name) : batKey;
          count = history.filter((s) => s.battery === batKey).length;
        }
        const isActive = batKey === activeHistoryTab;
        return `
          <button type="button" class="history-tab-btn ${isActive ? 'active' : ''}" data-battery="${batKey}" role="tab" aria-selected="${isActive}">
            ${name} (${count})
          </button>
        `;
      }).join('')}
    </div>
  `;

  // 2. Filter Bar with Toggle for Dropped Sessions
  const droppedBadge = droppedCount > 0
    ? `<span style="color:var(--amber); font-weight:600; margin-left:6px;">(${droppedCount} ${currentLang === 'es' ? 'ocultas' : 'hidden'})</span>`
    : '';

  const activeSessions = activeHistoryTab === 'all'
    ? history
    : history.filter((item) => item.battery === activeHistoryTab);

  const filterBarHTML = `
    <div class="history-filter-bar">
      <label class="filter-checkbox-label">
        <input type="checkbox" id="chk-filter-dropped" ${filterOutDroppedSessions ? 'checked' : ''}>
        <span>${currentLang === 'es' ? 'Excluir sesiones descartadas (<25s)' : 'Filter out dropped sessions (<25s)'}${droppedBadge}</span>
      </label>
      <span class="history-count-meta">
        ${activeSessions.length} ${currentLang === 'es' ? 'mostradas' : 'shown'} • ${totalRawCount} ${currentLang === 'es' ? 'totales en memoria' : 'total stored'}
      </span>
    </div>
  `;

  // 3. Filter sessions for active view
  const newestBatteryHistory = activeSessions;
  const chronologicalBatteryHistory = newestBatteryHistory.slice().reverse();
  const totalSessions = newestBatteryHistory.length;

  // Best session finder
  const bestSession = newestBatteryHistory.reduce((best, cur) => (!best || cur.netScore > best.netScore ? cur : best), null);

  const avgQpm = totalSessions > 0
    ? (newestBatteryHistory.reduce((a, b) => a + Number(b.throughputQpm || 0), 0) / totalSessions).toFixed(1)
    : '–';
  const avgAcc = totalSessions > 0
    ? Math.round(newestBatteryHistory.reduce((a, b) => a + Number(b.accuracy || 0), 0) / totalSessions) + '%'
    : '–';

  // 4. Hero summary stats for active battery
  const pbValText = bestSession ? `${bestSession.netScore} pts` : '–';
  const pbSubText = bestSession
    ? `${bestSession.correct}/${bestSession.total} • ${bestSession.accuracy}% Prec • ${bestSession.throughputQpm} QPM • ${bestSession.avgRtMs}ms`
    : '–';

  const heroStatsHTML = `
    <div class="history-hero-stats">
      <div class="history-hero-card">
        <div class="val">${totalSessions}</div>
        <div class="lbl">${currentLang === 'es' ? 'Sesiones Válidas' : 'Valid Sessions'}</div>
      </div>
      <div class="history-hero-card pb-card">
        <div class="val" style="color:#fbbf24;">${pbValText} 🏆</div>
        <div class="val-sub" title="${pbSubText}">${pbSubText}</div>
        <div class="lbl">${histT.pbLabel || (currentLang === 'es' ? 'Mejor Corrida' : 'Personal Best')}</div>
      </div>
      <div class="history-hero-card">
        <div class="val" style="color:#a78bfa;">${avgQpm} QPM</div>
        <div class="lbl">${histT.avgQpm || (currentLang === 'es' ? 'Ritmo Promedio' : 'Avg Speed')}</div>
      </div>
      <div class="history-hero-card">
        <div class="val" style="color:#34d399;">${avgAcc}</div>
        <div class="lbl">${histT.avgAccuracy || (currentLang === 'es' ? 'Precisión Promedio' : 'Avg Accuracy')}</div>
      </div>
    </div>
  `;

  // 5. Trend charts
  let chartsHTML = '';
  if (totalSessions === 0) {
    chartsHTML = `
      <div style="background:var(--surface-2); border:1px solid var(--border); border-radius:var(--radius); padding:28px 16px; text-align:center; color:var(--text-muted); margin-bottom:24px;">
        <p>${histT.noDataBattery || (currentLang === 'es' ? 'Aún no hay sesiones registradas para esta vista.' : 'No sessions recorded yet for this view.')}</p>
      </div>
    `;
  } else {
    const netScorePoints = chronologicalBatteryHistory.map((s, idx) => ({
      label: `${histT.sessionWord || (currentLang === 'es' ? 'Sesión' : 'Session')} #${idx + 1}`,
      value: Number(s.netScore),
      date: new Date(s.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })
    }));

    const qpmPoints = chronologicalBatteryHistory.map((s, idx) => ({
      label: `${histT.sessionWord || (currentLang === 'es' ? 'Sesión' : 'Session')} #${idx + 1}`,
      value: Number(s.throughputQpm),
      date: new Date(s.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })
    }));

    const accPoints = chronologicalBatteryHistory.map((s, idx) => ({
      label: `${histT.sessionWord || (currentLang === 'es' ? 'Sesión' : 'Session')} #${idx + 1}`,
      value: Number(s.accuracy),
      date: new Date(s.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })
    }));

    const latestNet = netScorePoints[netScorePoints.length - 1].value;
    const latestQpm = qpmPoints[qpmPoints.length - 1].value;
    const latestAcc = accPoints[accPoints.length - 1].value + '%';

    const activeBench = getActiveBenchmark();
    const qpmTarget = activeBench.targetQpm > 0 ? activeBench.targetQpm : null;

    chartsHTML = `
      <div class="history-charts-grid">
        <div class="chart-card">
          <div class="chart-card-header">
            <h5>${histT.chartNetScore || 'Net Score'}</h5>
            <span class="latest-val" style="color:#38bdf8;">${latestNet} pts</span>
          </div>
          ${generateSvgTrendChart({ data: netScorePoints, color: '#38bdf8', suffix: ' pts', targetValue: bestSession ? bestSession.netScore : null })}
        </div>
        <div class="chart-card">
          <div class="chart-card-header">
            <h5>${histT.chartQpm || 'Speed / QPM'}</h5>
            <span class="latest-val" style="color:#a78bfa;">${latestQpm} QPM</span>
          </div>
          ${generateSvgTrendChart({ data: qpmPoints, color: '#a78bfa', suffix: ' QPM', targetValue: qpmTarget })}
        </div>
        <div class="chart-card">
          <div class="chart-card-header">
            <h5>${histT.chartAccuracy || 'Accuracy (%)'}</h5>
            <span class="latest-val" style="color:#34d399;">${latestAcc}</span>
          </div>
          ${generateSvgTrendChart({ data: accPoints, color: '#34d399', suffix: '%', targetValue: 90, fixedMin: 0, fixedMax: 100 })}
        </div>
      </div>
    `;
  }

  // 6. Global Personal Bests (PLACED BEFORE SESSION LOG AS REQUESTED)
  const allStandardBatteries = [
    BATTERIES.NUMBER_SPEED,
    BATTERIES.PERCEPTUAL,
    BATTERIES.REASONING,
    BATTERIES.WORD_MEANING,
    BATTERIES.SPATIAL,
    'mixed'
  ];

  const pbRows = allStandardBatteries.map((batKey) => {
    const bInfo = t.batteries[batKey];
    const name = bInfo ? (bInfo.shortName || bInfo.name) : batKey;
    const bPb = pbs[batKey];
    if (!bPb) {
      return `<tr><td><strong>${name}</strong></td><td colspan="5" style="color:var(--text-dim); text-align:center;">–</td></tr>`;
    }
    const d = new Date(bPb.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
    const isCurrentActive = batKey === activeHistoryTab;
    return `
      <tr class="${isCurrentActive ? 'pb-row' : ''}">
        <td><strong>${isCurrentActive ? '👉 ' : ''}${name}</strong></td>
        <td><span style="color:#fbbf24; font-weight:700;">🏆 ${bPb.netScore} pts</span></td>
        <td>${bPb.accuracy}%</td>
        <td>${bPb.throughputQpm} QPM</td>
        <td>${bPb.avgRtMs > 0 ? `${bPb.avgRtMs} ms` : '–'}</td>
        <td style="font-size:12px; color:var(--text-muted);">${d}</td>
      </tr>
    `;
  }).join('');

  const globalPbsHTML = `
    <div style="margin-top:20px; margin-bottom:24px;">
      <h4 style="font-size:14px; font-weight:700; margin-bottom:10px; color:var(--text); display:flex; align-items:center; gap:6px;">
        <span>🏆</span> ${currentLang === 'es' ? 'Récords Personales Globales (Todas las Baterías)' : 'Global Personal Bests (All Batteries)'}
      </h4>
      <div class="breakdown-table-wrapper">
        <table class="breakdown-table">
          <thead>
            <tr>
              <th>${sumT.tableBattery}</th>
              <th>${sumT.tableNetScore}</th>
              <th>${sumT.tableAccuracy}</th>
              <th>QPM</th>
              <th>${sumT.tableAvgRt || 'Latencia'}</th>
              <th>${currentLang === 'es' ? 'Fecha' : 'Date'}</th>
            </tr>
          </thead>
          <tbody>
            ${pbRows}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // 7. Battery Recent Sessions Table
  let batteryTableHTML = '';
  if (totalSessions > 0) {
    const histRows = newestBatteryHistory.slice(0, 15).map((item) => {
      const d = new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      const targetBadge = item.targetMet ? '<span style="color:var(--green); font-weight:700;">✓</span>' : '';
      const isPb = bestSession && item.netScore === bestSession.netScore;
      const bName = activeHistoryTab === 'all'
        ? `<span style="font-size:11px; color:var(--text-dim); display:block;">${t.batteries[item.battery]?.shortName || item.battery}</span>`
        : '';
      return `
        <tr class="${isPb ? 'pb-row' : ''}">
          <td>
            <strong>${isPb ? '🏆 ' : ''}${item.netScore}</strong>
            ${bName}
          </td>
          <td>${item.accuracy}%</td>
          <td>${item.throughputQpm} QPM</td>
          <td>${item.avgRtMs > 0 ? `${item.avgRtMs} ms` : '–'}</td>
          <td style="font-size:12px; color:var(--text-muted);">${d} ${targetBadge}</td>
        </tr>
      `;
    }).join('');

    const titlePrefix = activeHistoryTab === 'all'
      ? (currentLang === 'es' ? 'Historial Completo' : 'All Sessions Log')
      : (currentLang === 'es' ? 'Historial de Sesiones' : 'Session Log');

    batteryTableHTML = `
      <h4 style="margin-top:20px; margin-bottom:10px; font-size:14px; color:var(--text);">
        ${titlePrefix} (${totalSessions})
      </h4>
      <div class="breakdown-table-wrapper">
        <table class="breakdown-table">
          <thead>
            <tr>
              <th>${sumT.tableNetScore}</th>
              <th>${sumT.tableAccuracy}</th>
              <th>QPM</th>
              <th>${sumT.tableAvgRt || 'Latencia'}</th>
              <th>${currentLang === 'es' ? 'Fecha' : 'Date'}</th>
            </tr>
          </thead>
          <tbody>
            ${histRows}
          </tbody>
        </table>
      </div>
    `;
  }

  // 8. Clear History Action
  const clearActionHTML = `
    <div style="margin-top:20px; display:flex; justify-content:flex-end;">
      <button type="button" class="btn-secondary" id="btn-clear-history" style="display:inline-flex; width:auto; font-size:12px; padding:6px 14px;">
        ${sumT.clearHistoryBtn}
      </button>
    </div>
  `;

  elHistoryModalBody.innerHTML = `${tabsHTML}${filterBarHTML}${heroStatsHTML}${chartsHTML}${globalPbsHTML}${batteryTableHTML}${clearActionHTML}`;

  // Attach tab switch events
  elHistoryModalBody.querySelectorAll('.history-tab-btn').forEach((tabBtn) => {
    tabBtn.onclick = () => {
      activeHistoryTab = tabBtn.dataset.battery;
      renderHistoryModalContent();
    };
  });

  // Attach filter checkbox event
  const chkFilter = document.getElementById('chk-filter-dropped');
  if (chkFilter) {
    chkFilter.onchange = (e) => {
      filterOutDroppedSessions = e.target.checked;
      renderHistoryModalContent();
    };
  }

  // Attach clear history button
  const btnClear = document.getElementById('btn-clear-history');
  if (btnClear) {
    btnClear.onclick = () => {
      if (window.confirm(sumT.clearHistoryConfirm)) {
        clearAllStorage();
        renderHistoryModalContent();
      }
    };
  }
}

/**
 * Renders and opens the History & Personal Bests dialog.
 */
function openHistoryModal() {
  renderHistoryModalContent();
  elHistoryModal.classList.add('open');
}

/**
 * Handles clicks on the "GIA Trainer" logo in the top bar.
 */
function handleBrandClick() {
  if (currentEngine && (currentEngine.status === 'running' || currentEngine.status === 'paused')) {
    currentEngine.pause();
    openAbortModal();
    return;
  }
  // If in summary or already on setup, return to setup cleanly
  elSummary.style.display = 'none';
  elSession.style.display = 'none';
  elSetup.style.display = 'block';
}

function openAbortModal() {
  const t = I18N[currentLang] || I18N.en;
  if (elAbortModalTitle) elAbortModalTitle.textContent = t.abortModal?.title || '¿Abandonar la prueba?';
  if (elAbortModalDesc) elAbortModalDesc.textContent = t.abortModal?.desc || 'La prueba se pausó. Si vuelves al inicio ahora, la sesión terminará inmediatamente.';
  if (elBtnAbortResume) elBtnAbortResume.textContent = t.abortModal?.resumeBtn || 'Continuar Prueba';
  if (elBtnAbortConfirm) elBtnAbortConfirm.textContent = t.abortModal?.confirmBtn || 'Salir al Inicio';

  if (elAbortModal) {
    elAbortModal.style.display = 'flex';
    setTimeout(() => elAbortModal.classList.add('open'), 10);
  }
}

function closeAbortModal() {
  if (elAbortModal) {
    elAbortModal.classList.remove('open');
    setTimeout(() => {
      elAbortModal.style.display = 'none';
    }, 150);
  }
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

if (elTargetBenchmarkSelect) {
  elTargetBenchmarkSelect.onchange = () => {
    if (elCustomQpmGroup) {
      elCustomQpmGroup.style.display = elTargetBenchmarkSelect.value === 'custom' ? 'flex' : 'none';
    }
  };
}

// History & Records Modal events
if (elBtnHistory) {
  elBtnHistory.onclick = openHistoryModal;
}
if (elHistoryModalCloseBtn) {
  elHistoryModalCloseBtn.onclick = () => elHistoryModal.classList.remove('open');
}
if (elHistoryModal) {
  elHistoryModal.onclick = (e) => {
    if (e.target === elHistoryModal) elHistoryModal.classList.remove('open');
  };
}

// Methodology Modal events
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
// Brand Home Navigation & Anti-Cheat Abort Modal Events
if (elBrandHomeBtn) {
  elBrandHomeBtn.onclick = handleBrandClick;
  elBrandHomeBtn.onkeydown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBrandClick();
    }
  };
}

if (elBtnAbortResume) {
  elBtnAbortResume.onclick = () => {
    closeAbortModal();
    if (currentEngine && currentEngine.status === 'paused') {
      currentEngine.resume();
    }
  };
}

if (elBtnAbortConfirm) {
  elBtnAbortConfirm.onclick = () => {
    closeAbortModal();
    if (currentEngine) {
      currentEngine.abort();
      currentEngine = null;
    }
    elSession.style.display = 'none';
    elSummary.style.display = 'none';
    elSetup.style.display = 'block';
  };
}

// Initialize with default language (EN)
setLanguage('en');

