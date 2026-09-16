/**
 * GIA Trainer Session Engine
 * High-precision session lifecycle manager, rAF timer, metrics tracking, and event dispatcher.
 */

import { generateQuestion } from '../core/index.js';

export class SessionEngine {
  /**
   * @param {Object} config
   * @param {string} config.battery - Battery type ('reasoning', 'perceptual', etc. or 'mixed')
   * @param {number} [config.durationSec=150] - Total session time in seconds (0 for infinite)
   * @param {string} [config.lang='en'] - Language for verbal questions ('en' | 'es')
   * @param {Object} [config.callbacks] - Event callbacks
   */
  constructor(config = {}) {
    this.battery = config.battery || 'reasoning';
    this.durationSec = config.durationSec !== undefined ? config.durationSec : 150;
    this.lang = config.lang || 'en';
    this.spatialMode = config.spatialMode || 'standard';
    this.callbacks = config.callbacks || {};

    this.status = 'idle'; // 'idle' | 'running' | 'finished'
    this.currentQuestion = null;
    this.phase = 'idle'; // 'read' | 'answer' | 'feedback'

    // Statistics
    this.items = [];
    this.correctCount = 0;
    this.incorrectCount = 0;
    this.streak = 0;
    this.bestStreak = 0;

    // Timing
    this.sessionStartTime = 0;
    this.sessionEndTime = 0;
    this.questionStartTime = 0;
    this.premiseStartTime = 0;
    this.premiseDurationMs = 0;
    this.rafId = null;

    this.tick = this.tick.bind(this);
  }

  /**
   * Starts the session.
   */
  start() {
    this.status = 'running';
    this.sessionStartTime = performance.now();
    if (this.durationSec > 0) {
      this.sessionEndTime = this.sessionStartTime + this.durationSec * 1000;
    } else {
      this.sessionEndTime = 0;
    }

    this.items = [];
    this.correctCount = 0;
    this.incorrectCount = 0;
    this.streak = 0;
    this.bestStreak = 0;

    if (this.callbacks.onStart) {
      this.callbacks.onStart({
        battery: this.battery,
        durationSec: this.durationSec
      });
    }

    this.nextQuestion();
    this.startTimerLoop();
  }

  /**
   * Internal RAF timer loop.
   */
  startTimerLoop() {
    this.stopTimerLoop();
    this.rafId = requestAnimationFrame(this.tick);
  }

  stopTimerLoop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  tick() {
    if (this.status !== 'running') return;

    const now = performance.now();
    let remainingMs = 0;
    let progressPercent = 0;

    if (this.durationSec > 0) {
      remainingMs = Math.max(0, this.sessionEndTime - now);
      const elapsedMs = now - this.sessionStartTime;
      progressPercent = Math.min(100, (elapsedMs / (this.durationSec * 1000)) * 100);

      if (remainingMs <= 0) {
        this.finish('timeout');
        return;
      }
    }

    if (this.callbacks.onTick) {
      this.callbacks.onTick({
        now,
        remainingMs,
        progressPercent,
        durationSec: this.durationSec
      });
    }

    this.rafId = requestAnimationFrame(this.tick);
  }

  /**
   * Advances to the next question.
   */
  nextQuestion() {
    if (this.status !== 'running') return;

    this.currentQuestion = generateQuestion(this.battery, {
      lang: this.lang,
      spatialMode: this.spatialMode
    });

    if (this.currentQuestion.hasTwoPhases) {
      // Phase 1: Read and memorize the premise
      this.phase = 'read';
      this.premiseStartTime = performance.now();
      this.premiseDurationMs = 0;
    } else {
      // Single phase: Direct answer
      this.phase = 'answer';
      this.questionStartTime = performance.now();
    }

    if (this.callbacks.onQuestion) {
      this.callbacks.onQuestion(this.currentQuestion, this.phase);
    }
  }

  /**
   * Advances from premise reading phase to question answering phase (for Reasoning).
   */
  advanceToQuestion() {
    if (this.status !== 'running' || this.phase !== 'read') return;

    this.premiseDurationMs = performance.now() - this.premiseStartTime;
    this.phase = 'answer';
    this.questionStartTime = performance.now();

    if (this.callbacks.onPhaseTransition) {
      this.callbacks.onPhaseTransition(this.currentQuestion, this.phase);
    }
  }

  /**
   * Submits an answer for the current question.
   * @param {string} selectedId
   */
  submitAnswer(selectedId) {
    if (this.status !== 'running' || this.phase !== 'answer') return;

    const answerTime = performance.now();
    const reactionTimeMs = Math.round(answerTime - this.questionStartTime);
    const isCorrect = selectedId === this.currentQuestion.correctId;

    if (isCorrect) {
      this.correctCount++;
      this.streak++;
      if (this.streak > this.bestStreak) {
        this.bestStreak = this.streak;
      }
    } else {
      this.incorrectCount++;
      this.streak = 0;
    }

    const itemRecord = {
      id: this.currentQuestion.id,
      type: this.currentQuestion.type,
      selectedId,
      correctId: this.currentQuestion.correctId,
      isCorrect,
      reactionTimeMs,
      premiseDurationMs: this.premiseDurationMs,
      timestamp: answerTime
    };

    this.items.push(itemRecord);
    this.phase = 'feedback';

    if (this.callbacks.onAnswerResult) {
      this.callbacks.onAnswerResult({
        isCorrect,
        selectedId,
        correctId: this.currentQuestion.correctId,
        reactionTimeMs,
        question: this.currentQuestion,
        stats: this.getCurrentStats()
      });
    }

    // Brief delay for visual feedback before next question
    const feedbackDelay = isCorrect ? 220 : 500;
    setTimeout(() => {
      if (this.status === 'running') {
        this.nextQuestion();
      }
    }, feedbackDelay);
  }

  /**
   * Calculates current realtime statistics.
   */
  getCurrentStats() {
    const total = this.correctCount + this.incorrectCount;
    const accuracy = total > 0 ? (this.correctCount / total) * 100 : 0;
    // Official Thomas GIA Penalty Formula: Net Score = Correct - (0.5 * Incorrect)
    const netScore = Math.max(0, this.correctCount - (0.5 * this.incorrectCount));

    const totalElapsedSec = Math.max(1, (performance.now() - this.sessionStartTime) / 1000);
    const throughputQpm = (total / (totalElapsedSec / 60)).toFixed(1);

    const correctTimes = this.items.filter((i) => i.isCorrect).map((i) => i.reactionTimeMs);
    const avgRtMs = correctTimes.length > 0
      ? Math.round(correctTimes.reduce((a, b) => a + b, 0) / correctTimes.length)
      : 0;

    return {
      total,
      correct: this.correctCount,
      incorrect: this.incorrectCount,
      accuracy: Math.round(accuracy),
      netScore: Number(netScore.toFixed(1)),
      streak: this.streak,
      bestStreak: this.bestStreak,
      throughputQpm: Number(throughputQpm),
      avgRtMs
    };
  }

  /**
   * Finishes the session and builds summary report.
   * @param {'manual'|'timeout'} reason
   */
  finish(reason = 'manual') {
    if (this.status === 'finished') return;
    this.status = 'finished';
    this.phase = 'idle';
    this.stopTimerLoop();

    const stats = this.getCurrentStats();

    // Group items by battery type for breakdown
    const breakdown = {};
    for (const item of this.items) {
      if (!breakdown[item.type]) {
        breakdown[item.type] = {
          total: 0,
          correct: 0,
          times: []
        };
      }
      breakdown[item.type].total++;
      if (item.isCorrect) {
        breakdown[item.type].correct++;
        breakdown[item.type].times.push(item.reactionTimeMs);
      }
    }

    const perBatteryStats = {};
    for (const [key, data] of Object.entries(breakdown)) {
      const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
      const avgRt = data.times.length > 0
        ? Math.round(data.times.reduce((a, b) => a + b, 0) / data.times.length)
        : 0;
      const net = Math.max(0, data.correct - 0.5 * (data.total - data.correct));
      perBatteryStats[key] = {
        total: data.total,
        correct: data.correct,
        accuracy: acc,
        avgRtMs: avgRt,
        netScore: Number(net.toFixed(1))
      };
    }

    const summary = {
      reason,
      battery: this.battery,
      durationSec: this.durationSec,
      totalElapsedSec: Math.round((performance.now() - this.sessionStartTime) / 1000),
      stats,
      breakdown: perBatteryStats,
      items: this.items
    };

    if (this.callbacks.onFinish) {
      this.callbacks.onFinish(summary);
    }

    return summary;
  }
}
