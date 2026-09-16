# gia-trainer

> **Interactive, modern, and high-fidelity simulator for the Thomas International GIA (General Intelligence Assessment).**

A free, open-source psychometric training tool engineered to prepare technical candidates for high-stakes cognitive speed assessments (such as those administered by leading international engineering and technology organizations).

---

## Overview

Commercial test-preparation platforms lock basic cognitive exercises behind expensive paywalls and frequently deliver low-quality simulators with sluggish response times or incorrect rules.

**gia-trainer** faithfully replicates the **5 official assessment batteries** derived from the *British Army Recruit Battery (BARB)* using procedural generation algorithms, sub-millisecond precision timers powered by `requestAnimationFrame`, strict guessing penalties, and ergonomic keyboard mapping to eliminate mechanical mouse latency.

---

## The 5 Official GIA Batteries Replicated

| Battery | Cognitive Construct | Exact Mechanics | Keyboard Shortcuts |
| :--- | :--- | :--- | :--- |
| **Number Speed & Accuracy** | Quantitative processing speed | Trio of integers. Determine the extreme number furthest from the median ($|mid - min|$ vs $|max - mid|$). | `1`, `2`, `3` or `Left`, `Down`, `Right` |
| **Perceptual Speed** | Visual scanning & pattern recognition | Matrix of 4 letter pairs arranged in columns. Count how many pairs contain the same letter (case-insensitive: `E/e`, `p/P`). | `0`, `1`, `2`, `3`, `4` |
| **Reasoning** | Working memory & relational deduction | Two-phase task: Study relational comparative premise -> Premise vanishes -> Direct answer. | `Space` (continue), `1`, `2` or `Left`, `Right` |
| **Word Meaning** | Semantic comprehension & categorization | Detect the **Odd-One-Out** from a vocabulary triad in English linked by synonymy or antonymy. | `1`, `2`, `3` or `Left`, `Down`, `Right` |
| **Spatial Visualisation** | Mental 2D rotation ($SO(2)$) | Compare 2 boxes with asymmetric glyphs. Count how many boxes contain legitimate planar rotations vs. mirror reflections. | `0`, `1`, `2` |
| **Full GIA Battery** | Mixed endurance mode | Continuous simulation procedurally alternating across all 5 batteries. | Contextual keys per battery |

---

## Psychometric Scoring & Guessing Penalty

In accordance with official Thomas International GIA standards, accuracy is strictly weighted against raw speed. Indiscriminate guessing degrades your net standing. Real-time metrics computed include:

$$\text{Net Score} = \text{Correct} - (0.5 \times \text{Incorrect})$$

- **Throughput:** Questions completed per minute ($\text{QPM}$).
- **Accuracy:** Percentage of correct answers relative to total attempts.
- **Latency:** Average reaction time ($\text{RT}$) measured in milliseconds per item using `performance.now()`.
- **Streaks:** Current consecutive correct streak and personal session record.

---

## Quick Start

### Live Web App
Access the live simulator directly in your browser with zero installation:
- **Online Demo:** Hosted on GitHub Pages (100% client-side, privacy-first, no account required).

### Running Locally
Because the application is built with vanilla ES modules, it requires no build step, transpilation, or external dependencies.

- **Windows (1-Click):** Double-click `start.bat` in the repository root.
- **Python:**
  ```bash
  python -m http.server 8000
  ```
- **Node.js:**
  ```bash
  npx serve .
  ```

Once running, navigate to `http://localhost:8000` in any modern web browser.

---

## Automated Verification

The core procedural engine includes a standalone unit test suite that executes over 1,000 iterations per battery to ensure algorithmic correctness and mathematical invariants:

```bash
node test/test-core.js
```

---

## Project Structure

```
gia-trainer/
├── index.html              # Accessible, responsive HTML5 entry point
├── start.bat               # 1-click launcher for Windows
├── README.md               # Main project documentation
├── src/
│   ├── core/               # Pure procedural generators (zero DOM coupling)
│   │   ├── types.js        # Data structures and battery definitions
│   │   ├── reasoning.js    # Reasoning battery generator
│   │   ├── perceptual.js   # Perceptual Speed generator
│   │   ├── number-speed.js # Number Speed & Accuracy generator
│   │   ├── word-meaning.js # Word Meaning generator
│   │   ├── spatial.js      # Spatial Visualisation generator
│   │   └── index.js        # Unified facade export
│   ├── data/               # Extensible dataset banks
│   │   ├── words.js        # Curated vocabulary triads (synonyms/antonyms)
│   │   ├── spatial-shapes.js # Asymmetric 2D glyph paths for SVG rendering
│   │   └── reasoning-data.js # Comparative polar dimensions and entity pools
│   ├── engine/             # Lifecycle, high-precision timers, and ergonomics
│   │   ├── session.js      # State machine and psychometric metrics
│   │   └── keyboard.js     # Low-latency ergonomic keyboard dispatcher
│   └── ui/                 # Presentation layer
│       ├── renderer.js     # Specialized DOM and dynamic SVG renderers
│       ├── app.js          # Main application coordinator
│       └── styles.css      # Dark-mode styling, micro-animations, and HUD
├── test/
│   └── test-core.js        # Node.js procedural test suite
└── docs/
    ├── METHODOLOGY.md      # Psychometric foundations, BARB history, and strategies
    └── CONTRIBUTING.md     # Guidelines for contributing new vocabulary and shapes
```

---

## Documentation

- [Methodology & Psychometrics](docs/METHODOLOGY.md): In-depth review of BARB origins, cognitive constructs, and scoring theory.
- [Contributing Guidelines](docs/CONTRIBUTING.md): How to add new vocabulary triads, asymmetric SVG shapes, and localization templates.

---

## License

Distributed under the MIT License. Free for personal, educational, and community use.
