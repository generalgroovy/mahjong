(() => {
    const CHALLENGES = {
      discard: [
        {
          prompt: "Which tile preserves the strongest tenpai?",
          context: "South 1, no visible threat. The final tile is your draw.",
          hand: ["1m", "2m", "3m", "4m", "5m", "6m", "7p", "8p", "9p", "4s", "5s", "E", "E", "9m"],
          answer: "9m",
          explanation: "Discard 9m. The hand remains in tenpai with 123m, 456m, 789p, the east pair, and a 45s ryanmen waiting on 3s or 6s. Keeping 9m adds no useful acceptance."
        },
        {
          prompt: "Remove the tile that contributes least.",
          context: "East 2, first row of discards. Favor speed over speculative value.",
          hand: ["2m", "2m", "4m", "5m", "6m", "8m", "3p", "4p", "5p", "6s", "7s", "8s", "E", "E"],
          answer: "8m",
          explanation: "Discard 8m. Three sequences are complete and 22m plus EE form a shanpon tenpai. Breaking either pair or the 456m sequence loses immediate readiness."
        },
        {
          prompt: "Which discard leaves a shanpon wait on 6p and red dragon?",
          context: "No calls, no dora among these tiles, and all waits are live.",
          hand: ["1m", "2m", "3m", "4p", "6p", "6p", "7p", "8p", "9p", "3s", "4s", "5s", "R", "R"],
          answer: "4p",
          explanation: "Discard 4p. That leaves 123m, 789p, 345s, the red-dragon pair, and 66p as the second pair: a direct shanpon wait on 6p or red dragon."
        }
      ],
      wait: [
        {
          prompt: "What completes this shape?",
          context: "Assume every candidate tile is live.",
          hand: ["4m", "5m"],
          options: ["3m or 6m", "2m or 7m", "Only 6m", "3m, 6m, or 9m"],
          answer: "3m or 6m",
          explanation: "45m is a ryanmen shape. Either 3m makes 345m or 6m makes 456m, giving up to eight live tiles before visible-tile adjustments."
        },
        {
          prompt: "Identify every winning tile.",
          context: "The five-tile shape must become two sequences after adding one tile.",
          hand: ["3p", "4p", "5p", "6p", "7p"],
          options: ["2p, 5p, or 8p", "Only 2p or 8p", "4p or 7p", "Any pin tile"],
          answer: "2p, 5p, or 8p",
          explanation: "34567p is a sanmenchan: 2p, 5p, and 8p each allow the six tiles to resolve into two sequences. It is one of the strongest ordinary wait shapes."
        },
        {
          prompt: "What tile completes this edge wait?",
          context: "Name the wait before considering how many copies remain.",
          hand: ["1s", "2s"],
          options: ["Only 3s", "3s or 4s", "Only 2s", "1s or 3s"],
          answer: "Only 3s",
          explanation: "12s is a penchan, completed only by 3s. It has at most four outs and is materially weaker than a ryanmen."
        }
      ],
      value: [
        {
          prompt: "Which hand has the best baseline value?",
          context: "Compare the listed yaku totals, with no dora or other yaku.",
          options: ["Riichi + pinfu + tanyao", "Riichi only", "Open yakuhai", "Closed tanyao only"],
          answer: "Riichi + pinfu + tanyao",
          explanation: "Riichi + pinfu + tanyao starts at 3 han before ura-dora. The alternatives are only 1 han under these assumptions, so the three-yaku hand has the strongest baseline."
        },
        {
          prompt: "Which option reaches the highest limit class?",
          context: "Non-dealer; compare the stated han totals directly.",
          options: ["5 han", "7 han", "9 han", "11 han"],
          answer: "11 han",
          explanation: "11 han is sanbaiman, worth 24,000 points for a non-dealer ron. Nine han is baiman, seven is haneman, and five is mangan."
        },
        {
          prompt: "Which tenpai is usually the best riichi candidate?",
          context: "Equal tile safety, equal score situation, no visible dora differences.",
          options: ["Good ryanmen, 3900+", "Cheap dead tanki", "No-yaku bad wait", "Furiten ryanmen"],
          answer: "Good ryanmen, 3900+",
          explanation: "A live ryanmen with solid value combines a good wait and payoff. Riichi itself supplies a yaku to a closed hand; a no-yaku hand is not automatically a poor riichi choice. Here the stated live, valuable ryanmen is the best candidate; furiten prevents ron, not tsumo."
        }
      ],
      safety: [
        {
          prompt: "Which tile is guaranteed safe against this riichi player?",
          context: "After declaring riichi, the opponent has already discarded 5m. Choose your discard.",
          hand: ["2m", "5m", "6p", "9s"],
          options: ["5m", "2m", "6p", "9s"],
          answer: "5m",
          explanation: "Choose 5m. A tile already discarded by that opponent is genbutsu: it is safe against that player because furiten prevents them from winning by ron on it."
        },
        {
          prompt: "What is the first defensive check after an opponent declares riichi?",
          context: "Your hand is three shanten and low value, so defense is the priority.",
          options: ["Check their discards for exact safe tiles", "Discard the middle tile first", "Keep every honor", "Call any available tile"],
          answer: "Check their discards for exact safe tiles",
          explanation: "Start with genbutsu: exact tiles that player has discarded. They are stronger safety evidence than suji, honors, or general shape guesses."
        },
        {
          prompt: "Which situation most strongly favors folding?",
          context: "Folding means abandoning your attempt to win and choosing safer discards.",
          options: ["Three shanten, cheap hand, dealer riichi", "Mangan tenpai with a good wait", "No threat in the first row", "Dealer tenpai with many live outs"],
          answer: "Three shanten, cheap hand, dealer riichi",
          explanation: "A slow, cheap hand has little reward, while a dealer riichi carries high loss potential. That combination makes folding the clearest choice."
        }
      ],
      call: [
        {
          prompt: "Can a pon of red dragons supply a yaku in an open hand?",
          context: "You hold R R. Ignore strategic reasons to pass; test whether the triplet provides a yaku.",
          hand: ["R", "R"],
          options: ["Yes", "No"],
          answer: "Yes",
          explanation: "Yes. A triplet of red dragons provides yakuhai, worth one han in an open or closed hand. Whether to call in a real game also depends on speed, safety, and placement."
        },
        {
          prompt: "Call chi to complete 4m 5m 6m, or pass?",
          context: "The call would open your hand, and you have no other yaku or valuable speed gain.",
          hand: ["4m", "5m"],
          options: ["Chi", "Pass"],
          answer: "Pass",
          explanation: "Pass. Completing one sequence is not enough if opening removes your route to a yaku. A hand without yaku cannot win, even if its shape is complete."
        },
        {
          prompt: "The discarded tile completes your legal hand. What should you call?",
          context: "You are not furiten, the hand has a yaku, and placement does not require declining the win.",
          options: ["Ron", "Pon", "Chi", "Pass"],
          answer: "Ron",
          explanation: "Call ron. Ron means winning on another player’s discard. Pon and chi only claim tiles to continue the hand; they do not replace a legal win."
        }
      ]
    };

    const challengeState = {
      mode: "discard",
      indexes: { discard: 0, wait: 0, value: 0, safety: 0, call: 0 },
      correct: 0,
      played: 0,
      streak: 0,
      answered: false
    };

    function tileClass(tile) {
      if (tile.endsWith("p")) return "suit-p";
      if (tile.endsWith("s")) return "suit-s";
      if (!tile.endsWith("m")) return "honor";
      return "";
    }

    function challengeModeLabel(mode) {
      return {
        discard: "Best discard",
        wait: "Read the wait",
        value: "Best hand",
        safety: "Safety first",
        call: "Call or pass"
      }[mode];
    }

    function updateChallengeScore() {
      qs("#challengeCorrect").textContent = challengeState.correct;
      qs("#challengePlayed").textContent = challengeState.played;
      qs("#challengeStreak").textContent = challengeState.streak;
      try {
        sessionStorage.setItem("riichi-challenge-score", JSON.stringify({
          correct: challengeState.correct,
          played: challengeState.played,
          streak: challengeState.streak
        }));
      } catch (error) {
        // The challenge remains usable when storage is unavailable.
      }
    }

    function restoreChallengeScore() {
      try {
        const saved = JSON.parse(sessionStorage.getItem("riichi-challenge-score"));
        if (!saved) return;
        ["correct", "played", "streak"].forEach(key => {
          if (Number.isInteger(saved[key]) && saved[key] >= 0) challengeState[key] = saved[key];
        });
      } catch (error) {
        // Ignore corrupt or blocked session storage.
      }
    }

    function renderChallenge() {
      const mode = challengeState.mode;
      const items = CHALLENGES[mode];
      const index = challengeState.indexes[mode];
      const challenge = items[index];
      challengeState.answered = false;

      qs("#challengeProgress").textContent = `${challengeModeLabel(mode)} · ${index + 1} of ${items.length}`;
      qs("#challengePrompt").textContent = challenge.prompt;
      qs("#challengeContext").textContent = challenge.context;
      qs("#challengeHand").replaceChildren();
      qs("#challengeOptions").replaceChildren();
      qs("#challengeNext").hidden = true;
      qs("#challengeFeedback").textContent = "Choose an answer.";

      (challenge.hand || []).forEach((tile, tileIndex) => {
        const element = document.createElement(mode === "discard" ? "button" : "span");
        element.className = `tile ${tileClass(tile)}${mode === "discard" && tileIndex === challenge.hand.length - 1 ? " drawn" : ""}`;
        element.textContent = tile;
        element.dataset.answer = tile;
        if (mode === "discard") {
          element.type = "button";
          element.setAttribute("aria-label", `Discard ${tile}`);
          element.addEventListener("click", () => answerChallenge(tile, element));
        }
        qs("#challengeHand").appendChild(element);
      });

      (challenge.options || []).forEach(option => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer-option";
        button.textContent = option;
        button.dataset.answer = option;
        button.addEventListener("click", () => answerChallenge(option, button));
        qs("#challengeOptions").appendChild(button);
      });
    }

    function answerChallenge(answer, selectedElement) {
      if (challengeState.answered) return;
      challengeState.answered = true;
      const challenge = CHALLENGES[challengeState.mode][challengeState.indexes[challengeState.mode]];
      const correct = answer === challenge.answer;
      challengeState.played += 1;
      challengeState.correct += correct ? 1 : 0;
      challengeState.streak = correct ? challengeState.streak + 1 : 0;

      qsa(".tile[data-answer], .answer-option[data-answer]").forEach(element => {
        if (element.tagName === "BUTTON") element.disabled = true;
        if (element.dataset.answer === challenge.answer) element.classList.add("correct");
      });
      if (!correct) selectedElement.classList.add("wrong");

      const heading = correct ? "Correct decision" : `Best answer: ${challenge.answer}`;
      const reference = {discard:['statistics','Tile and wait tables'],wait:['statistics','Wait quality'],value:['statistics','Scoring'],safety:['trees','Defense decision tree'],call:['policy','Call policy']}[challengeState.mode];
      qs("#challengeFeedback").innerHTML = `<h3 class="feedback-status ${correct ? "good" : "bad"}">${heading}</h3><p>${challenge.explanation}</p><a href="#${reference[0]}" data-reference="${challengeState.mode}">${reference[1]} →</a>`;
      qs('[data-reference]').addEventListener('click', () => {
        const tab = {discard:'tiles',wait:'waits',value:'scoring'}[challengeState.mode];
        if (tab) qs(`[data-tab="${tab}"]`).click();
      });
      qs("#challengeNext").hidden = false;
      updateChallengeScore();
      qs("#challengeNext").focus({preventScroll:true});
    }

    function initChallenges() {
      restoreChallengeScore();
      updateChallengeScore();
      qsa('.challenge-mode').forEach(button => button.addEventListener('click', () => selectPractice(button.dataset.mode)));
      qsa('[data-practice]').forEach(link => link.addEventListener('click', () => {
        const mode = link.id === 'practiceTable' ? {tiles:'discard',start:'discard',honors:'safety',waits:'wait',scoring:'value'}[qs('.tab.active').dataset.tab] : link.dataset.practice;
        selectPractice(mode);
        qs('#challengePrompt').focus({preventScroll:true});
      }));
      qs("#challengeNext").addEventListener("click", () => {
        const mode = challengeState.mode;
        challengeState.indexes[mode] = (challengeState.indexes[mode] + 1) % CHALLENGES[mode].length;
        renderChallenge();
        qs("#challengePrompt").focus({preventScroll:true});
      });
      selectPractice("discard");
    }


    function selectPractice(mode) {
      if (!Object.prototype.hasOwnProperty.call(CHALLENGES,mode)) return;
      challengeState.mode=mode;
      qsa('.challenge-mode').forEach(button => {
        const active=button.dataset.mode===mode;
        button.classList.toggle('active',active);
        button.setAttribute('aria-pressed',String(active));
      });
      renderChallenge();
    }
    initChallenges();
})();
