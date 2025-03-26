# Roadmap for Memory Game Project

**Project:** Memory Game for the 2016 European Football Championship  
**Course:** Licenciatura em Informática - Aplicações Multimédia  
**Institution:** Escola Superior de Gestão e Tecnologia de Santarém  
**Deadline for Group Registration:** March 21, 2025  
**Submission Deadline:** April 20, 2025  
**Weight:** 25% of final grade

---

## Project Overview

Develop a memory game with a 4x4 grid (8 pairs of cards) featuring emblems of national football teams from the 2016 European Championship. The goal is to match all pairs in the shortest time possible, with features like a timer, progress bar, and card shuffling every 45 seconds.

---

## Milestones and Tasks

### 1. Group Formation and Registration

-   **Deadline:** March 21, 2025
-   **Tasks:**
    -   Form a group of 3 members.
    -   Register the group on the Moodle platform in the designated section.
    -   Assign roles (e.g., UI/UX design, JavaScript logic, CSS animations).

### 2. Project Setup and Planning

-   **Timeline:** March 22 - March 25, 2025
-   **Tasks:**
    -   Set up a shared repository (e.g., GitHub) for version control.
    -   Download materials (images, sounds) from Moodle.
    -   Define the project structure (HTML, CSS, JavaScript files).
    -   Create a detailed task breakdown and assign responsibilities.

### 3. Core Development Phase

-   **Timeline:** March 26 - April 10, 2025

#### 3.1. Game Interface (HTML/CSS)

-   **Tasks:**
    -   Build a 4x4 game board using `<div>` elements for cards.
    -   Style cards with front/back backgrounds using the `faces[]` array for team emblems.
    -   Implement CSS animations for card flips and progress bar (use provided class selectors).
    -   Design a custom overlay for notifications (no `window.alert()`).

#### 3.2. Game Logic (JavaScript)

-   **Tasks:**
    -   Initialize the game on load with all cards visible, then shuffle and hide them.
    -   Handle card flipping with mouse clicks and check for matches.
    -   Add a 500ms delay before hiding unmatched cards.
    -   Implement the "Restart" feature with the spacebar key.
    -   Integrate sound effects for key actions (e.g., flip, match, shuffle).

#### 3.3. Timer and Progress Bar

-   **Tasks:**
    -   Create a timer that updates every second.
    -   Build a progress bar reflecting elapsed time.
    -   Animate the progress bar when 5 seconds remain before the 45-second shuffle.
    -   Shuffle unmatched cards every 45 seconds (keep matched cards face-down).

### 4. Testing and Refinement

-   **Timeline:** April 11 - April 15, 2025
-   **Tasks:**
    -   Test core functionalities (game start, card matching, timer, shuffle).
    -   Ensure compliance with rules (e.g., no non-standard attributes, no plagiarism).
    -   Optimize code quality (readable, commented JavaScript, CSS, HTML).
    -   Debug edge cases (e.g., game end, restart during shuffle).

### 5. Extra Features (Optional)

-   **Timeline:** April 11 - April 15, 2025
-   **Tasks:**
    -   Brainstorm and implement original features (e.g., score tracking, difficulty levels).
    -   Ensure extra features are group-authored and enhance gameplay.

### 6. Documentation and Final Submission

-   **Timeline:** April 16 - April 20, 2025
-   **Tasks:**
    -   Write the report following the Moodle template.
    -   Comment and organize the codebase for clarity.
    -   Package all materials (code, report) for submission.
    -   Upload to Moodle by **April 20, 2025**.

---

## Key Deadlines

-   **March 21, 2025:** Group registration on Moodle.
-   **April 20, 2025:** Final submission of software and report.

---

## Notes

-   **Plagiarism:** Any copied work (even with minor changes) results in a zero grade.
-   **Technical Constraints:** No `window.alert()` (-2 points if used); use `<div>` for cards.
-   **Evaluation Criteria:** Functionality, interface quality, code quality, report.
-   **Resources:** Use provided images, sounds, and CSS animations from Moodle.

---
