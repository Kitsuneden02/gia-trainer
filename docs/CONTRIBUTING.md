# Contributing to gia-trainer

Thank you for your interest in contributing to **gia-trainer**!

The objective of this project is to provide the global engineering and candidate community with a free, transparent, and psychometrically faithful alternative to commercial paywalled testing platforms.

---

## 1. Architectural Principles

1. **Zero Runtime Dependencies:** The base application runs statically in any modern browser or on GitHub Pages without requiring Node runtimes or bundlers (e.g., webpack, vite).
2. **Standard ES Modules:** All source logic is authored using native ES6+ syntax (`import` / `export`).
3. **Decoupled Architecture:** Core generators under `src/core/` are pure mathematical and algorithmic functions with zero DOM coupling. DOM manipulation is restricted to `src/ui/`.
4. **Mathematical & Psychometric Rigor:** Procedural generators must satisfy all invariant rules (e.g., asymmetric numerical distances, strictly chiral shapes, case-insensitivity in letter matching).

---

## 2. Contributing Data Sets

### 2.1. Adding Vocabulary Triads (Word Meaning)
Modify `src/data/words.js`. Append objects matching this schema:

```javascript
{ 
  pair: ['WORD_A', 'WORD_B'], 
  distractor: 'ODD_WORD', 
  type: 'synonym' // or 'antonym'
}
```

*Requirements:*
- Words must be capitalized English strings.
- The distractor word must not share an obvious semantic association with the pair.

### 2.2. Adding Asymmetric Shapes (Spatial Visualisation)
Modify `src/data/spatial-shapes.js`:

```javascript
{
  id: 'unique-glyph-id',
  name: 'Descriptive Name',
  // Normalized path for viewBox="0 0 100 100"
  path: 'M 25,15 L 75,15 ... Z'
}
```

*Critical Requirement:*
- The shape **must be strictly asymmetric** under planar reflection. Shapes exhibiting bilateral or radial mirror symmetry (such as circles, squares, or symmetrical letters like 'H' or 'A') break item validity because a rotation would become indistinguishable from a reflection.

### 2.3. Adding Comparative Dimensions (Reasoning)
Modify `src/data/reasoning-data.js` to introduce new bipolar adjective dimensions or named entities.

---

## 3. Automated Verification

Before submitting a Pull Request, run the unit test suite:

```bash
node test/test-core.js
```

The test runner evaluates 1,000 iterations per battery to verify:
- No undefined or incomplete states are generated.
- Furthest extreme numbers always resolve unambiguously ($d_{min} \neq d_{max}$).
- Match counts across perceptual pairs and spatial boxes match manual counting.
- Word distractors are disjoint from the target pair.

---

## 4. Deploying to GitHub Pages

To host your own deployment:
1. Fork this repository.
2. In your fork, navigate to **Settings** -> **Pages**.
3. Under **Build and deployment -> Source**, select **Deploy from a branch**.
4. Choose the `main` branch and the `/ (root)` folder.
5. Save the configuration. Your deployment will be active in a couple of minutes.
