# Methodology and Psychometric Foundations of Thomas GIA

The **Thomas International General Intelligence Assessment (GIA)** is an established cognitive ability and mental speed assessment widely used in selective recruitment processes for engineering and software roles across high-performance organizations.

This document outlines the theoretical basis, historical derivation, operational mechanics for each of the five batteries, and the psychometric scoring model.

---

## 1. Historical Origins: From BARB to Thomas GIA

During the 1970s and 1980s, the UK Ministry of Defence, along with occupational psychologists such as Dr. Peter Evans, developed the **British Army Recruit Battery (BARB)**. The primary objective was to evaluate the learning potential (*trainability*) and mental processing speed of recruits while minimizing socioeconomic, educational, and cultural biases.

In 1993, Thomas International adapted and computerized this military methodology for commercial recruitment, establishing the **General Intelligence Assessment (GIA)**.

### Fluid vs. Crystallized Intelligence
Unlike conventional IQ tests that measure accumulated knowledge or encyclopedic vocabulary (crystallized intelligence, $g_c$), the GIA measures **fluid intelligence ($g_f$)**:
- Rapid perceptual processing and scanning speed.
- Short-term working memory maintenance under temporal decay.
- Cognitive stamina and error resistance during timed micro-tasks.

---

## 2. The 5 Official Batteries: Construct Breakdown

### 2.1. Number Speed & Accuracy
- **Construct:** Elementary numerical fluency and mental distance comparison across a number line.
- **Format:** Three distinct positive integers presented in unordered positions: $x_1, x_2, x_3$.
- **Algorithmic Mechanics:**
  1. Determine the sorted ordering: $min < mid < max$.
  2. Compute the lower distance: $d_{min} = mid - min$.
  3. Compute the upper distance: $d_{max} = max - mid$.
  4. Compare distances: If $d_{min} > d_{max}$, the extreme number furthest from the median is $min$. If $d_{max} > d_{min}$, it is $max$.
- **Psychometric Constraint:** $d_{min} \neq d_{max}$ (arithmetic progressions with symmetric intervals are strictly excluded to avoid ambiguous keys).
- **Candidate Strategy:** Rather than computing exact difference values, train to visually identify which extreme sits further along the mental number line relative to the center anchor.

---

### 2.2. Perceptual Speed
- **Construct:** Rapid foveal scanning, orthographic verification, and distractor rejection.
- **Format:** A 4-column matrix containing paired letters (top row and bottom row).
- **Match Criteria:** A pair is considered identical if both characters represent the same letter, irrespective of letter case (e.g., `E / e`, `d / D`, `k / k`). Different characters (e.g., `Q / y`) are non-matches.
- **Response Set:** $k \in \{0, 1, 2, 3, 4\}$.
- **Candidate Strategy:** Avoid subvocalizing letter names. Perform a rapid horizontal gaze from left to right, counting only positive target hits (*"one, two, three"*).

---

### 2.3. Reasoning
- **Construct:** Verbal working memory retention and transitive syllogistic deduction.
- **Phase 1 (Encoding):** A comparative premise displays a bipolar relation between two individuals or entities (e.g., *"Tom is heavier than Fred"* or *"Wendy is not as fast as Rachel"*).
  - The candidate encodes the relationship and presses `Space` or `Enter`.
- **Phase 2 (Retrieval & Decision):** The original premise is hidden. A direct comparative question appears (e.g., *"Who is heavier?"* or *"Who is lighter?"*).
  - The candidate selects the correct name between two options.
- **Candidate Strategy:** Encode the premise immediately as an internal directional inequality ($A > B$ or $B > A$) to withstand polar inversion in the subsequent question.

---

### 2.4. Word Meaning
- **Construct:** Semantic associative network activation and category anomaly detection (Odd-One-Out).
- **Format:** A triad of three English vocabulary words.
- **Semantic Rule:** Two words share a definitive semantic link (either **synonymy**, e.g., `HALT` / `STOP`, or **antonymy**, e.g., `RISE` / `FALL`).
- **Response:** Identify the unrelated distractor word that does not belong to that semantic axis.
- **Candidate Strategy:** Rapidly test whether the first two evaluated words form an obvious synonym or antonym pair; if they do, the remaining third word is immediately the answer.

---

### 2.5. Spatial Visualisation
- **Construct:** Rigid 2D mental rotation ($SO(2)$) versus chirality (planar reflection/mirroring).
- **Format:** Two separate presentation boxes. Each box displays two asymmetric symbols (top and bottom).
- **Official GIA Specification:** Evaluates asymmetric uppercase letters (`R`, `F`, `P`, `J`, `L`, `G`, `Q`) at strict orthogonal angles ($\theta \in \{0^\circ, 90^\circ, 180^\circ, 270^\circ\}$).
- **Challenge Mode:** Features abstract geometric polyforms and oblique angles in increments of $45^\circ$.
- **Match Criteria:**
  - Both symbols share identical chirality (both normal or both reflected) such that the bottom symbol is a pure 2D rotation of the top symbol ($R(\theta)$).
  - If one symbol is reflected relative to the other, it represents an axial mirror image ($M \cdot R(\theta)$) and **does not match**.
- **Response:** Count how many of the two boxes contain valid rotated matches: $0$, $1$, or $2$.
- **Candidate Strategy:** Identify a distinctive chiral feature (such as the leg of an 'R' or the arms of an 'F') and track whether its clockwise/counter-clockwise orientation remains preserved.

---

## 3. Scoring System and Guessing Penalty

In the official GIA, throughput without accuracy is heavily penalized. To disincentivize blind guessing, a correction formula is applied:

$$\text{Net Score} = N_{\text{correct}} - (0.5 \times N_{\text{incorrect}})$$

### Strategy Comparison:
| Scenario | Attempts | Correct | Incorrect | Accuracy | Net Score | Throughput |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Aggressive Guessing** | 40 | 22 | 18 | 55% | $22 - (0.5 \times 18) = \mathbf{13.0}$ | High volume, low net score |
| **Controlled Speed** | 28 | 26 | 2 | 93% | $26 - (0.5 \times 2) = \mathbf{25.0}$ | Moderate volume, **elite score** |

Each incorrect response nullifies half the value of a correct answer. Consequently, candidate performance scales only when accuracy remains consistently at or above **85% - 90%**.
