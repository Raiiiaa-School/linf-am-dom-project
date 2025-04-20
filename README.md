# Memory Game - European Football Championship 2016

![Game Interface Preview](path/to/interface-preview.png) <!-- Replace with actual image path if available -->

## Project Overview

This is a memory game developed as part of the **Trabalho Prático 1** for the **Licenciatura em Informática - Aplicações Multimédia** course at **Escola Superior de Gestão e Tecnologia de Santarém**. The game celebrates the 2016 European Football Championship, featuring a 4x4 grid with 8 pairs of cards representing national team emblems. The objective is to match all pairs in the shortest time possible, with a timer, progress bar, and periodic card shuffling.

-   **Group Members:** Rúben Alves, Rodrigo Ventura, António Elói
-   **Submission Date:** April 20, 2025
-   **Course Weight:** 25% of final grade

---

## Features

-   **Game Board:** 4x4 grid with 8 pairs of cards.
-   **Cards:** Display front (team emblem) and back, built with `<div>` elements and CSS background images.
-   **Timer:** Updates every second; triggers a shuffle of unmatched cards every 45 seconds.
-   **Progress Bar:** Visualizes elapsed time, animates 5 seconds before the 45-second shuffle.
-   **Gameplay:**
    -   Starts automatically on load.
    -   Cards flip with mouse clicks; unmatched pairs hide after 500ms.
    -   Restart with the spacebar.
    -   Shuffles unmatched cards every 45 seconds.
-   **Sounds:** Audio feedback for actions (e.g., flipping, matching).
-   **Custom Notifications:** Overlay messages instead of `window.alert()`.

---

## Prerequisites

-   A modern web browser (e.g., Chrome, Firefox, Edge).
-   Basic understanding of HTML, CSS, and JavaScript to run or modify the project.

---

## Installation

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/your-repo/memory-game-2016.git
    ```
