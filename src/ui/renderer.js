import { I18N } from '../data/i18n.js';

/**
 * Generates an SVG string for a spatial symbol given rotation and mirror state.
 * @param {string} pathData - SVG path d attribute
 * @param {number} rotationDeg - Rotation angle in degrees
 * @param {boolean} isMirrored - Whether to reflect horizontally
 * @returns {string} SVG HTML
 */
export function renderSpatialSVG(pathData, rotationDeg, isMirrored) {
  // SVG viewBox is 100x100. Center of rotation is (50, 50).
  // When mirrored, we reflect horizontally about x=50 using: translate(100,0) scale(-1,1).
  const transform = isMirrored
    ? `rotate(${rotationDeg} 50 50) translate(100, 0) scale(-1, 1)`
    : `rotate(${rotationDeg} 50 50)`;

  return `
    <svg class="spatial-glyph" viewBox="0 0 100 100" width="80" height="80">
      <g transform="${transform}">
        <path d="${pathData}" fill="currentColor" />
      </g>
    </svg>
  `;
}

export class QuestionRenderer {
  constructor(containerElement, lang = 'en') {
    this.container = containerElement;
    this.lang = lang;
  }

  setLang(lang) {
    this.lang = lang;
  }

  /**
   * Renders the question based on battery type and current phase.
   * @param {import('../core/types.js').Question} question
   * @param {'read'|'answer'|'feedback'} phase
   * @param {Function} onSelectOption - Callback when an option is clicked
   * @param {Function} onContinue - Callback when continue button is clicked (Reasoning)
   */
  render(question, phase, onSelectOption, onContinue) {
    this.container.innerHTML = '';

    if (question.hasTwoPhases && phase === 'read') {
      this.renderReasoningPremise(question, onContinue);
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = `q-content battery-${question.type}`;

    // 1. Render Battery Specific Subject Area
    const subjectEl = document.createElement('div');
    subjectEl.className = 'q-subject';

    switch (question.type) {
      case 'reasoning':
        subjectEl.innerHTML = this.renderReasoningQuestionHTML(question);
        break;
      case 'perceptual':
        subjectEl.innerHTML = this.renderPerceptualHTML(question);
        break;
      case 'number-speed':
        subjectEl.innerHTML = this.renderNumberSpeedHTML(question);
        break;
      case 'word-meaning':
        subjectEl.innerHTML = this.renderWordMeaningHTML(question);
        break;
      case 'spatial':
        subjectEl.innerHTML = this.renderSpatialHTML(question);
        break;
    }
    wrapper.appendChild(subjectEl);

    // 2. Render Prompt with dynamic localization
    const promptEl = document.createElement('div');
    promptEl.className = 'q-prompt';
    
    let promptText = question.prompt;
    if (question.type === 'perceptual') {
      promptText = this.lang === 'es' ? '¿Cuántos pares contienen la misma letra?' : 'How many pairs contain the same letter?';
    } else if (question.type === 'number-speed') {
      promptText = this.lang === 'es' ? '¿Qué número está más alejado del valor intermedio (restante)?' : 'Which number is furthest from the remaining (middle-value) number?';
    } else if (question.type === 'word-meaning') {
      promptText = this.lang === 'es' ? '¿Qué palabra es la intrusa (Odd-One-Out)?' : 'Which word is the odd one out?';
    } else if (question.type === 'spatial') {
      promptText = this.lang === 'es' ? '¿Cuántas cajas contienen un par coincidente (rotado, no espejo)?' : 'How many boxes contain a matching pair (rotated, not mirrored)?';
    }

    promptEl.textContent = promptText;
    wrapper.appendChild(promptEl);

    // 3. Render Answer Options Grid
    const optionsGrid = document.createElement('div');
    optionsGrid.className = `options-grid opts-${question.options.length}`;

    question.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opt-btn';
      btn.dataset.id = opt.id;

      const labelSpan = document.createElement('span');
      labelSpan.className = 'opt-label';
      labelSpan.textContent = opt.label;
      btn.appendChild(labelSpan);

      const kbd = document.createElement('kbd');
      kbd.className = 'opt-key';
      kbd.textContent = opt.aliasKey === 'ArrowLeft' ? '←'
        : opt.aliasKey === 'ArrowRight' ? '→'
        : opt.aliasKey === 'ArrowDown' ? '↓'
        : opt.key;
      btn.appendChild(kbd);

      btn.addEventListener('click', () => {
        onSelectOption(opt.id);
      });

      optionsGrid.appendChild(btn);
    });

    wrapper.appendChild(optionsGrid);
    this.container.appendChild(wrapper);
  }

  renderReasoningPremise(question, onContinue) {
    const t = I18N[this.lang]?.session || I18N.en.session;
    const wrapper = document.createElement('div');
    wrapper.className = 'q-content reasoning-premise-screen';

    const tag = document.createElement('div');
    tag.className = 'phase-tag';
    tag.textContent = t.premiseTag;
    wrapper.appendChild(tag);

    const premiseCard = document.createElement('div');
    premiseCard.className = 'premise-card';
    premiseCard.textContent = question.premise;
    wrapper.appendChild(premiseCard);

    const sub = document.createElement('div');
    sub.className = 'sub-hint';
    sub.textContent = t.premiseSub;
    wrapper.appendChild(sub);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-continue';
    btn.innerHTML = t.premiseBtn;
    btn.addEventListener('click', onContinue);
    wrapper.appendChild(btn);

    this.container.appendChild(wrapper);
  }

  renderReasoningQuestionHTML(question) {
    const t = I18N[this.lang]?.session || I18N.en.session;
    return `
      <div class="premise-masked">
        <span class="lock-icon">[HIDDEN]</span> ${t.premiseMasked.replace('[HIDDEN] ', '')}
      </div>
    `;
  }

  renderPerceptualHTML(question) {
    const pairs = question.data.pairs;
    const cards = pairs.map((pair, index) => `
      <div class="letter-pair-box" data-index="${index}">
        <div class="letter-cell top-letter">${pair.top}</div>
        <div class="letter-divider"></div>
        <div class="letter-cell bottom-letter">${pair.bottom}</div>
      </div>
    `).join('');

    return `
      <div class="perceptual-matrix">
        ${cards}
      </div>
    `;
  }

  renderNumberSpeedHTML(question) {
    const numbers = question.data.numbers;
    const cards = numbers.map((n, i) => `
      <div class="number-card-display">
        <span class="number-val">${n}</span>
      </div>
    `).join('');

    return `
      <div class="numbers-row">
        ${cards}
      </div>
    `;
  }

  renderWordMeaningHTML(question) {
    const words = question.data.words;
    const cards = words.map((w) => `
      <div class="word-card-display">
        <span class="word-val">${w}</span>
      </div>
    `).join('');

    return `
      <div class="words-row">
        ${cards}
      </div>
    `;
  }

  renderSpatialHTML(question) {
    const t = I18N[this.lang]?.session || I18N.en.session;
    const boxes = question.data.boxes;
    const boxesHTML = boxes.map((box, idx) => `
      <div class="spatial-box-card">
        <div class="box-header">${t.boxHeader} ${idx + 1}</div>
        <div class="symbol-container top-symbol">
          ${renderSpatialSVG(box.path, box.top.rotation, box.top.mirrored)}
        </div>
        <div class="symbol-divider"></div>
        <div class="symbol-container bottom-symbol">
          ${renderSpatialSVG(box.path, box.bottom.rotation, box.bottom.mirrored)}
        </div>
      </div>
    `).join('');

    return `
      <div class="spatial-boxes-container">
        ${boxesHTML}
      </div>
    `;
  }

  /**
   * Highlights correct/incorrect buttons during feedback phase.
   * @param {string} selectedId
   * @param {string} correctId
   */
  showFeedback(selectedId, correctId) {
    const buttons = this.container.querySelectorAll('.opt-btn');
    buttons.forEach((btn) => {
      btn.disabled = true;
      if (btn.dataset.id === correctId) {
        btn.classList.add('correct');
      }
      if (selectedId && btn.dataset.id === selectedId && selectedId !== correctId) {
        btn.classList.add('wrong');
      }
    });
  }
}
