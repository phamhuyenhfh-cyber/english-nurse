// 🚀 ENGLISH NURSE 90-DAY LEARNING PORTAL, FLASHCARDS, QUIZ & IPA STUDIO LOGIC

const STORAGE_KEY = "ENGLISH_NURSE_HUYEN_PROGRESS_V1";
const MASTERED_VOCAB_KEY = "ENGLISH_NURSE_MASTERED_VOCAB";
const THEME_KEY = "ENGLISH_NURSE_THEME";
const SELECTED_VOICE_KEY = "ENGLISH_NURSE_SELECTED_VOICE_NAME";

let progressState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
let masteredVocabState = JSON.parse(localStorage.getItem(MASTERED_VOCAB_KEY)) || {};

let activeDay = null;
let currentTab = "vocab";
let speechSynth = window.speechSynthesis;
let slowMode = false;

// Voice Studio State
let availableEnglishVoices = [];
let selectedVoice = null;

// Global IPA Dictionary for Audio Error Correction
let GLOBAL_IPA_MAP = {
  scrub: "/skrʌb/",
  nurse: "/nɜːs/",
  working: "/ˈwɜː.kɪŋ/",
  cssd: "/ˌsiː.es.esˈdiː/",
  department: "/dɪˈpɑːt.mənt/",
  clean: "/kliːn/",
  inspect: "/ɪnˈspekt/",
  sterilize: "/ˈster.ə.laɪz/",
  surgical: "/ˈsɜː.dʒɪ.kəl/",
  instruments: "/ˈɪn.strə.mənts/",
  autoclave: "/ˈɔː.tə.kleɪv/",
  temperature: "/ˈtem.prə.tʃər/",
  chemical: "/ˈkem.ɪ.kəl/",
  indicator: "/ˈɪn.dɪ.keɪ.tər/",
  changed: "/tʃeɪndʒd/",
  color: "/ˈkʌl.ər/",
  tray: "/treɪ/",
  sterile: "/ˈster.aɪl/",
  please: "/pliːz/",
  pass: "/pɑːs/",
  forceps: "/ˈfɔː.seps/"
};

// Flashcard Game State
let currentFlashcardDeck = [];
let currentFlashcardIndex = 0;
let isCardFlipped = false;

// Quiz State
let quizScore = 0;

// Audio Recorder State
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let speechRecognition = null;

// DOM Initialization
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initUnitFilter();
  buildGlobalIpaMap();
  populateDayOptionsDropdowns();
  renderDaysGrid();
  updateProgressStats();
  initFlashcardGame();
  loadQuizForSelectedDay();
  initSpeechRecognition();
  initEnglishVoiceStudio();
  bindEvents();
});

// Build Global IPA Dictionary from Curriculum Data
function buildGlobalIpaMap() {
  if (typeof CURRICULUM_DATA === "undefined") return;
  CURRICULUM_DATA.forEach((day) => {
    if (day.vocab) {
      day.vocab.forEach((v) => {
        const cleanW = v.word.toLowerCase().replace(/[^\w]/g, "");
        if (cleanW && v.ipa) {
          GLOBAL_IPA_MAP[cleanW] = v.ipa;
        }
      });
    }
  });
}

// 🎙️ VOICE STUDIO ENGINE (Bộ Chọn Giọng Đọc Bản Xứ)
function initEnglishVoiceStudio() {
  if (!speechSynth) return;

  const loadAndPopulateVoices = () => {
    const rawVoices = speechSynth.getVoices();
    if (!rawVoices || rawVoices.length === 0) return;

    // Filter all English voices
    availableEnglishVoices = rawVoices.filter(
      (v) => v.lang.startsWith("en") && !v.name.includes("Vietnamese")
    );

    if (availableEnglishVoices.length === 0) {
      availableEnglishVoices = rawVoices.filter((v) => v.lang.startsWith("en")) || [rawVoices[0]];
    }

    const select = document.getElementById("headerVoiceSelect");
    if (!select) return;

    select.innerHTML = "";

    const savedVoiceName = localStorage.getItem(SELECTED_VOICE_KEY);

    availableEnglishVoices.forEach((voice, idx) => {
      const opt = document.createElement("option");
      opt.value = idx;

      let flag = "🇺🇸";
      let gender = "";
      if (voice.lang.includes("GB") || voice.name.includes("UK") || voice.name.includes("British")) flag = "🇬🇧";
      if (voice.lang.includes("AU")) flag = "🇦🇺";
      if (voice.name.includes("Female") || voice.name.includes("Samantha") || voice.name.includes("Zira") || voice.name.includes("Karen") || voice.name.includes("Victoria")) gender = "Nữ";
      if (voice.name.includes("Male") || voice.name.includes("David") || voice.name.includes("Daniel") || voice.name.includes("Alex")) gender = "Nam";

      opt.textContent = `${flag} ${voice.name.split(" ")[0]} ${gender ? "(" + gender + ")" : ""}`;
      select.appendChild(opt);

      if (savedVoiceName && voice.name === savedVoiceName) {
        select.value = idx;
        selectedVoice = voice;
      }
    });

    if (!selectedVoice && availableEnglishVoices.length > 0) {
      selectedVoice = availableEnglishVoices[0];
    }

    updateActiveVoiceBannerText();
  };

  loadAndPopulateVoices();
  if (speechSynth.onvoiceschanged !== undefined) {
    speechSynth.onvoiceschanged = loadAndPopulateVoices;
  }
}

function changeSelectedVoice() {
  const select = document.getElementById("headerVoiceSelect");
  if (!select) return;

  const selectedIdx = parseInt(select.value);
  if (availableEnglishVoices[selectedIdx]) {
    selectedVoice = availableEnglishVoices[selectedIdx];
    localStorage.setItem(SELECTED_VOICE_KEY, selectedVoice.name);
    updateActiveVoiceBannerText();
    testSelectedVoice();
  }
}

function updateActiveVoiceBannerText() {
  const bannerEl = document.getElementById("activeVoiceNameText");
  if (bannerEl && selectedVoice) {
    bannerEl.textContent = selectedVoice.name.split(" ")[0] + " (" + selectedVoice.lang + ")";
  }
}

function testSelectedVoice() {
  if (!selectedVoice) return;
  const sampleSentence = "Hello Nurse Huyen! I am your native English speaking assistant.";
  speakText(sampleSentence);
}

// Native Text-to-Speech Engine with Selected Native English Voice
function speakText(text) {
  if (!speechSynth) return;
  speechSynth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = selectedVoice ? selectedVoice.lang : "en-US";

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.rate = slowMode ? 0.75 : 0.95;
  speechSynth.speak(utterance);
}

// 🎙️ IPA PHONETIC CORRECTION ENGINE (Chữa Lỗi Phát Âm Theo Phiên Âm IPA)
function calculateSentenceSimilarityWithIPA(targetSentence, spokenSentence) {
  const clean = (str) =>
    str
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  const targetWords = clean(targetSentence);
  const spokenWords = clean(spokenSentence);

  if (targetWords.length === 0) return { accuracy: 0, diffHtml: spokenSentence, ipaFixCardsHtml: "" };

  let matchCount = 0;
  const spokenSet = new Set(spokenWords);
  const targetSet = new Set(targetWords);

  // Highlighting spoken output
  const diffHtml = spokenWords
    .map((word) => {
      if (targetSet.has(word)) {
        matchCount++;
        return `<span style="color: #22c55e; font-weight: 800;">${word}</span>`;
      } else {
        return `<span style="color: #e11d48; font-weight: 800; text-decoration: line-through;">${word}</span>`;
      }
    })
    .join(" ");

  // Find missed or mispronounced target words for IPA feedback
  let missedWords = targetWords.filter((w) => !spokenSet.has(w));

  let ipaFixCardsHtml = "";
  if (missedWords.length > 0) {
    ipaFixCardsHtml += `<div class="ipa-fix-container">
      <div style="font-weight: 800; font-size: 0.9rem; color: var(--accent); display: flex; align-items: center; gap: 6px;">
        💡 CHỮA LỖI PHÁT ÂM THEO PHIÊN ÂM IPA (Bấm nút 🔊 để nghe chuẩn từ này):
      </div>`;

    missedWords.forEach((word) => {
      const ipa = GLOBAL_IPA_MAP[word] || `/${word}/`;
      ipaFixCardsHtml += `
        <div class="ipa-fix-card">
          <div>
            <span class="ipa-word-target">❌ Từ cần sửa: <strong>${word}</strong></span>
            <span class="ipa-tag" style="margin-left: 8px;">IPA: ${ipa}</span>
          </div>
          <button class="audio-btn-pill" style="padding: 4px 12px; font-size: 0.8rem;" onclick="speakText('${word}')">🔊 Nghe Mẫu</button>
        </div>
      `;
    });

    ipaFixCardsHtml += `</div>`;
  }

  const accuracy = Math.min(100, Math.round((matchCount / targetWords.length) * 100));
  return { accuracy, diffHtml, ipaFixCardsHtml };
}

function initSpeechRecognition() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) return;

  speechRecognition = new SpeechRec();
  speechRecognition.lang = "en-US";
  speechRecognition.interimResults = false;

  speechRecognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const recognizedBox = document.getElementById("speechRecognizedBox");
    const outputEl = document.getElementById("recognizedTextOutput");
    const feedbackEl = document.getElementById("speechFeedbackText");

    const targetText = document.getElementById("recorderSentenceSelect").value;
    const { accuracy, diffHtml, ipaFixCardsHtml } = calculateSentenceSimilarityWithIPA(targetText, transcript);

    if (recognizedBox && outputEl && feedbackEl) {
      recognizedBox.style.display = "block";
      outputEl.innerHTML = `"${diffHtml}"`;

      let feedbackMsg = "";
      if (accuracy >= 85) {
        feedbackMsg = `<span style="color: #22c55e;">🎉 Xuất sắc! Nhận dạng chính xác ${accuracy}%! Giọng đọc của chị phát âm rất chuẩn.</span>`;
      } else if (accuracy >= 60) {
        feedbackMsg = `<span style="color: #f59e0b;">👍 Khá tốt! Độ chính xác: ${accuracy}%. Chị hãy xem bảng sửa phiên âm IPA bên dưới nhé!</span>`;
      } else {
        feedbackMsg = `<span style="color: #e11d48;">⚠️ Độ chính xác: ${accuracy}%. Phát âm chưa khớp với câu mẫu. Chị hãy xem hướng dẫn phiên âm IPA dưới đây để chỉnh phát âm nhé!</span>`;
      }

      feedbackEl.innerHTML = feedbackMsg + ipaFixCardsHtml;
    }
  };
}

// Sync Progress across devices (Home PC <-> Work PC)
function exportProgressCode() {
  const syncData = {
    progress: progressState,
    mastered: masteredVocabState
  };
  const jsonStr = JSON.stringify(syncData);
  const code = btoa(encodeURIComponent(jsonStr));

  navigator.clipboard.writeText(code).then(() => {
    alert("✅ ĐÃ COPY MÃ TIẾN ĐỘ THÀNH CÔNG!\n\nChị chỉ cần gửi mã này qua Zalo/Email cho chính mình, sau đó lên máy cơ quan mở web và bấm nút '📥 Dán Tiến Độ' để đồng bộ 100% kết quả học!");
  }).catch(() => {
    prompt("Mã tiến độ học của chị dưới đây (hãy copy mã này):", code);
  });
}

function importProgressCode() {
  const inputCode = prompt("Dán Mã Tiến Độ học của chị vào đây (mã copy từ máy ở nhà):");
  if (!inputCode) return;

  try {
    const jsonStr = decodeURIComponent(atob(inputCode.trim()));
    const syncData = JSON.parse(jsonStr);

    if (syncData.progress) {
      progressState = syncData.progress;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressState));
    }
    if (syncData.mastered) {
      masteredVocabState = syncData.mastered;
      localStorage.setItem(MASTERED_VOCAB_KEY, JSON.stringify(masteredVocabState));
    }

    updateProgressStats();
    renderDaysGrid();
    initFlashcardGame();
    alert("🎉 ĐỒNG BỘ TIẾN ĐỘ THÀNH CÔNG!\n\nToàn bộ ngày đã học, chuỗi kiên trì và từ vựng đã thuộc của chị đã được khôi phục 100%!");

  } catch (e) {
    alert("❌ Mã tiến độ không hợp lệ! Chị vui lòng kiểm tra lại mã đã copy.");
  }
}

// View Navigation (Roadmap, Flashcard, Quiz, Recorder)
function switchMainView(viewName) {
  document.querySelectorAll(".app-view-section").forEach((sec) => {
    sec.classList.remove("active");
  });
  document.querySelectorAll(".nav-tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });

  const targetView = document.getElementById(`${viewName}View`);
  if (targetView) targetView.classList.add("active");

  if (viewName === "flashcard") {
    initFlashcardGame();
  } else if (viewName === "quiz") {
    loadQuizForSelectedDay();
  }
}

// Populate Day Options Dropdowns for Flashcard & Quiz
function populateDayOptionsDropdowns() {
  const flashSelect = document.getElementById("flashcardDeckSelect");
  const quizSelect = document.getElementById("quizDaySelect");

  CURRICULUM_DATA.forEach((d) => {
    const optLabel = `🗓️ Ngày ${d.day}: ${d.title.split(":")[1] || d.title}`;
    
    if (flashSelect) {
      const opt = document.createElement("option");
      opt.value = `day_${d.day}`;
      opt.textContent = optLabel;
      flashSelect.appendChild(opt);
    }

    if (quizSelect) {
      const opt = document.createElement("option");
      opt.value = `day_${d.day}`;
      opt.textContent = optLabel;
      quizSelect.appendChild(opt);
    }
  });
}

// Theme Controls
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeBtnText(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
  updateThemeBtnText(next);
}

function updateThemeBtnText(theme) {
  const btn = document.getElementById("themeToggleBtn");
  if (btn) {
    btn.innerHTML = theme === "dark" ? "☀️ Giao diện Sáng" : "🌙 Giao diện Tối";
  }
}

// Unit Selector Options
function initUnitFilter() {
  const select = document.getElementById("unitSelect");
  if (!select) return;

  UNITS_DATA.forEach((unit) => {
    const opt = document.createElement("option");
    opt.value = unit.id;
    opt.textContent = `${unit.icon} ${unit.title}`;
    select.appendChild(opt);
  });
}

// Render 90-Day Grid
function renderDaysGrid() {
  const grid = document.getElementById("daysGrid");
  if (!grid) return;

  const unitFilter = document.getElementById("unitSelect").value;
  const searchQuery = document.getElementById("searchInput").value.toLowerCase();

  grid.innerHTML = "";

  let filtered = CURRICULUM_DATA.filter((item) => {
    const matchUnit = unitFilter === "all" || item.unitId == unitFilter;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery) ||
      item.goal.toLowerCase().includes(searchQuery) ||
      `ngày ${item.day}`.includes(searchQuery);
    return matchUnit && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
      Không tìm thấy bài học phù hợp. Vui lòng thử tìm kiếm khác!
    </div>`;
    return;
  }

  filtered.forEach((item) => {
    const isCompleted = !!progressState[item.day];
    const isMilestone = !!item.milestone;

    const card = document.createElement("div");
    card.className = `day-card ${isCompleted ? "completed" : ""} ${isMilestone ? "milestone-card" : ""}`;

    const unitObj = UNITS_DATA.find((u) => u.id === item.unitId) || {};

    card.innerHTML = `
      <div>
        <div class="day-card-header">
          <span class="day-tag">NGÀY ${item.day} ${isMilestone ? "🏆" : ""}</span>
          <label class="checkbox-wrapper" title="Đánh dấu hoàn thành">
            <input type="checkbox" ${isCompleted ? "checked" : ""} onchange="toggleDayComplete(${item.day}, this.checked)">
          </label>
        </div>
        <div class="day-title">${item.title}</div>
        <div class="day-goal">${item.goal}</div>
      </div>
      <div class="day-card-footer">
        <span class="unit-label">${unitObj.icon || "📚"} Unit ${item.unitId}</span>
        <button class="open-lesson-btn" onclick="openLessonModal(${item.day})">Vào Bài Học ➔</button>
      </div>
    `;

    grid.appendChild(card);
  });
}

// Toggle Completion
function toggleDayComplete(day, completed) {
  if (completed) {
    progressState[day] = true;
  } else {
    delete progressState[day];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progressState));
  updateProgressStats();
  renderDaysGrid();
}

// Update Overall Progress Hero
function updateProgressStats() {
  const completedCount = Object.keys(progressState).length;
  const totalDays = 90;
  const percent = Math.round((completedCount / totalDays) * 100);

  const fill = document.getElementById("progressFill");
  const countText = document.getElementById("completedCountText");
  const percentText = document.getElementById("completedPercentText");

  if (fill) fill.style.width = `${percent}%`;
  if (countText) countText.textContent = `${completedCount} / ${totalDays} Ngày`;
  if (percentText) percentText.textContent = `${percent}%`;

  const streakEl = document.getElementById("streakText");
  if (streakEl) streakEl.textContent = `${completedCount} Ngày`;

  const masteredCount = Object.keys(masteredVocabState).length;
  const masteredEl = document.getElementById("masteredVocabText");
  if (masteredEl) masteredEl.textContent = `${masteredCount} Từ`;
}

// 🎴 FLASHCARD GAME LOGIC (CHIA THEO NGÀY)
function initFlashcardGame() {
  const deckSelect = document.getElementById("flashcardDeckSelect");
  const selectedKey = deckSelect ? deckSelect.value : "all";

  let vocabList = [];

  if (selectedKey.startsWith("day_")) {
    const dayNum = parseInt(selectedKey.replace("day_", ""));
    const dayObj = CURRICULUM_DATA.find((d) => d.day === dayNum);
    if (dayObj) vocabList.push(...dayObj.vocab);
  } else if (selectedKey === "cssd") {
    CURRICULUM_DATA.filter((d) => d.unitId === 11 || d.unitId === 1 || d.unitId === 2).forEach((d) => {
      vocabList.push(...d.vocab);
    });
  } else {
    CURRICULUM_DATA.forEach((d) => vocabList.push(...d.vocab));
  }

  if (vocabList.length === 0) {
    CURRICULUM_DATA.forEach((d) => vocabList.push(...d.vocab));
  }

  currentFlashcardDeck = vocabList.sort(() => Math.random() - 0.5);
  currentFlashcardIndex = 0;
  isCardFlipped = false;

  renderCurrentFlashcard();
}

function renderCurrentFlashcard() {
  const wrapper = document.getElementById("flashcardWrapper");
  if (wrapper) wrapper.classList.remove("flipped");
  isCardFlipped = false;

  if (currentFlashcardDeck.length === 0) return;

  const currentItem = currentFlashcardDeck[currentFlashcardIndex];

  document.getElementById("flashWord").textContent = currentItem.word;
  document.getElementById("flashIpa").textContent = currentItem.ipa;
  document.getElementById("flashMeaning").textContent = currentItem.meaning;
  document.getElementById("flashExample").textContent = `"${currentItem.example}"`;

  const counterEl = document.getElementById("flashcardCounter");
  if (counterEl) {
    counterEl.textContent = `Thẻ ${currentFlashcardIndex + 1} / ${currentFlashcardDeck.length}`;
  }
}

function flipFlashcard() {
  const wrapper = document.getElementById("flashcardWrapper");
  if (!wrapper) return;
  isCardFlipped = !isCardFlipped;
  wrapper.classList.toggle("flipped", isCardFlipped);
}

function playCurrentFlashcardAudio() {
  if (currentFlashcardDeck.length > 0) {
    const item = currentFlashcardDeck[currentFlashcardIndex];
    speakText(item.word);
  }
}

function markFlashcardScore(isMastered) {
  if (currentFlashcardDeck.length === 0) return;

  const currentItem = currentFlashcardDeck[currentFlashcardIndex];
  if (isMastered) {
    masteredVocabState[currentItem.word] = true;
  } else {
    delete masteredVocabState[currentItem.word];
  }
  localStorage.setItem(MASTERED_VOCAB_KEY, JSON.stringify(masteredVocabState));
  updateProgressStats();

  currentFlashcardIndex = (currentFlashcardIndex + 1) % currentFlashcardDeck.length;
  renderCurrentFlashcard();
}

// ✏️ FILL-IN-THE-BLANK QUIZ LOGIC
function loadQuizForSelectedDay() {
  const select = document.getElementById("quizDaySelect");
  const selectedKey = select ? select.value : "all";
  const container = document.getElementById("quizCardsContainer");

  if (!container) return;
  container.innerHTML = "";

  let questions = [];

  if (selectedKey.startsWith("day_")) {
    const dayNum = parseInt(selectedKey.replace("day_", ""));
    const dayObj = CURRICULUM_DATA.find((d) => d.day === dayNum);
    if (dayObj && dayObj.quiz) {
      dayObj.quiz.forEach((q) => questions.push({ ...q, day: dayObj.day }));
    }
  } else {
    CURRICULUM_DATA.forEach((d) => {
      if (d.quiz) {
        d.quiz.forEach((q) => questions.push({ ...q, day: d.day }));
      }
    });
  }

  quizScore = 0;
  updateQuizScoreText(0, questions.length);

  if (questions.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 3rem; color: var(--text-muted);">
      Không có bài tập cho ngày này.
    </div>`;
    return;
  }

  questions.forEach((q, idx) => {
    const card = document.createElement("div");
    card.className = "quiz-question-card";

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="day-tag">CÂU ${idx + 1} / ${questions.length} (NGÀY ${q.day})</span>
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--primary-dark);">TỪ VỰNG NGÀY ${q.day}</span>
      </div>

      <div class="quiz-sentence">${q.sentence.replace("________", "<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>")}</div>

      <div class="quiz-input-group">
        <input type="text" id="quizInput_${idx}" class="quiz-input" placeholder="Gõ từ tiếng Anh còn thiếu vào đây..." onkeyup="if(event.key==='Enter') checkQuizAnswer(${idx}, '${escapeQuotes(q.answer)}')">
        <button class="quiz-check-btn" onclick="checkQuizAnswer(${idx}, '${escapeQuotes(q.answer)}')">Kiểm Tra Đáp Án</button>
      </div>

      <div id="quizResult_${idx}" class="quiz-result-badge">
        <span id="quizResultText_${idx}"></span>
        <button class="audio-btn" style="width:36px; height:36px; font-size:0.9rem;" onclick="speakText('${escapeQuotes(q.answer)}')">🔊 Nghe Đọc</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function checkQuizAnswer(idx, correctAnswer) {
  const input = document.getElementById(`quizInput_${idx}`);
  const resultBadge = document.getElementById(`quizResult_${idx}`);
  const resultText = document.getElementById(`quizResultText_${idx}`);

  if (!input || !resultBadge) return;

  const userTyped = input.value.trim().toLowerCase();
  const target = correctAnswer.trim().toLowerCase();

  if (userTyped === target) {
    resultBadge.className = "quiz-result-badge correct";
    resultText.innerHTML = `🎉 CHÍNH XÁC! Giỏi lắm chị Huyền! Đáp án đúng: <strong>"${correctAnswer}"</strong>`;
    speakText(correctAnswer);
    quizScore++;
  } else {
    resultBadge.className = "quiz-result-badge incorrect";
    resultText.innerHTML = `❌ CHƯA ĐÚNG! Đáp án đúng là: <strong>"${correctAnswer}"</strong>`;
  }

  const totalCards = document.querySelectorAll(".quiz-question-card").length;
  updateQuizScoreText(quizScore, totalCards);
}

function updateQuizScoreText(score, total) {
  const scoreEl = document.getElementById("quizScoreText");
  if (scoreEl) {
    scoreEl.textContent = `Điểm: ${score} / ${total} câu đúng`;
  }
}

// 🎙️ AUDIO RECORDER STUDIO LOGIC & ACCURATE SIMILARITY ENGINE
function updateRecorderSentence() {
  const select = document.getElementById("recorderSentenceSelect");
  const targetDisplay = document.getElementById("targetSentenceDisplay");
  if (select && targetDisplay) {
    targetDisplay.textContent = `"${select.value}"`;
  }
}

function playTargetSentenceAudio() {
  const select = document.getElementById("recorderSentenceSelect");
  if (select) speakText(select.value);
}

async function toggleMicRecording() {
  const micBtn = document.getElementById("bigMicBtn");
  const statusText = document.getElementById("recordingStatusText");
  const audioContainer = document.getElementById("audioPlaybackContainer");
  const player = document.getElementById("recordedAudioPlayer");

  if (!isRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks = [];
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        player.src = audioUrl;
        audioContainer.style.display = "block";
      };

      mediaRecorder.start();
      isRecording = true;

      micBtn.classList.add("recording");
      statusText.textContent = "🔴 Đang Ghi Âm... (Bấm nút để DỪNG)";

      if (speechRecognition) {
        try {
          speechRecognition.start();
        } catch (e) {}
      }

    } catch (err) {
      alert("Không thể truy cập Microphone! Vui lòng cho phép quyền sử dụng Mic trên trình duyệt.");
    }
  } else {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }

    if (speechRecognition) {
      try {
        speechRecognition.stop();
      } catch (e) {}
    }

    isRecording = false;
    micBtn.classList.remove("recording");
    statusText.textContent = "✅ Ghi âm hoàn tất! Hãy nghe lại bên dưới ⬇️";
  }
}

// Modal Lesson Detail
function openLessonModal(day) {
  const dayData = CURRICULUM_DATA.find((d) => d.day === day);
  if (!dayData) return;

  activeDay = dayData;
  currentTab = "vocab";

  const modal = document.getElementById("lessonModal");
  modal.classList.add("active");

  document.getElementById("modalDayTitle").textContent = dayData.title;
  document.getElementById("modalDayGoal").textContent = dayData.goal;

  renderModalTabContent();
}

function closeLessonModal() {
  const modal = document.getElementById("lessonModal");
  modal.classList.remove("active");
  speechSynth.cancel();
}

function switchTab(tabName) {
  currentTab = tabName;
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });
  renderModalTabContent();
}

function renderModalTabContent() {
  const container = document.getElementById("tabContentContainer");
  if (!container || !activeDay) return;

  if (currentTab === "vocab") {
    let html = `<div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="color: var(--secondary);">🗣️ Từ Vựng & Phát Âm IPA (Bấm nút 🔊 để nghe âm chuẩn)</h3>
        <button class="theme-toggle-btn" onclick="toggleSlowMode()">
          ${slowMode ? "🐢 Tốc độ Chậm (0.75x)" : "⚡ Tốc độ Chuẩn (1.0x)"}
        </button>
      </div>`;

    activeDay.vocab.forEach((v) => {
      html += `
        <div class="vocab-item">
          <div class="vocab-main">
            <span class="vocab-word">${v.word}</span>
            <span class="vocab-ipa">${v.ipa}</span>
            <span class="vocab-meaning">👉 ${v.meaning}</span>
            <span class="vocab-example">" ${v.example} "</span>
          </div>
          <button class="audio-btn" onclick="speakText('${escapeQuotes(v.word)}')">🔊</button>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  } else if (currentTab === "quiz") {
    let html = `<div>
      <h3 style="color: var(--secondary); margin-bottom: 1rem;">✏️ Bài Tập Điền Từ Kiểm Tra Trí Nhớ (${activeDay.vocab.length} Từ - Ngày ${activeDay.day})</h3>`;

    if (activeDay.quiz) {
      activeDay.quiz.forEach((q, idx) => {
        html += `
          <div class="quiz-question-card" style="margin-bottom: 1rem;">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary-dark);">CÂU ${idx + 1} / ${activeDay.quiz.length}</div>
            <div class="quiz-sentence">${q.sentence.replace("________", "<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>")}</div>
            <div class="quiz-input-group">
              <input type="text" id="modalQuizInput_${idx}" class="quiz-input" placeholder="Gõ từ còn thiếu..." onkeyup="if(event.key==='Enter') checkModalQuizAnswer(${idx}, '${escapeQuotes(q.answer)}')">
              <button class="quiz-check-btn" onclick="checkModalQuizAnswer(${idx}, '${escapeQuotes(q.answer)}')">Kiểm Tra</button>
            </div>
            <div id="modalQuizResult_${idx}" class="quiz-result-badge">
              <span id="modalQuizResultText_${idx}"></span>
              <button class="audio-btn" style="width:36px; height:36px; font-size:0.9rem;" onclick="speakText('${escapeQuotes(q.answer)}')">🔊</button>
            </div>
          </div>
        `;
      });
    }

    html += `</div>`;
    container.innerHTML = html;
  } else if (currentTab === "shadowing") {
    let html = `<div>
      <h3 style="color: var(--secondary); margin-bottom: 1rem;">🎧 Shadowing (Nhại lại theo câu thoại)</h3>`;

    activeDay.shadowing.forEach((s) => {
      html += `
        <div class="vocab-item" style="flex-direction: column; align-items: stretch; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: var(--primary-dark);">${s.speaker}</strong>
            <button class="audio-btn" style="width:38px; height:38px; font-size:0.9rem;" onclick="speakText('${escapeQuotes(s.sentence)}')">🔊</button>
          </div>
          <div style="font-size: 1.05rem; font-weight: 700;">"${s.sentence}"</div>
          <div style="font-size: 0.9rem; color: var(--text-muted);">Dịch: ${s.translation}</div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  } else if (currentTab === "cssd") {
    let html = `<div>
      <h3 style="color: var(--secondary); margin-bottom: 0.5rem;">🧼 Kỹ Thuật Tự Nói Chuyện CSSD (CSSD Self-Talk)</h3>
      <p style="color: var(--text-muted); font-size: 0.9rem;">
        Vừa thực hiện công việc tại CSSD vừa tự nhẩm hoặc đọc thành tiếng bằng tiếng Anh:
      </p>`;

    activeDay.cssdSelfTalk.forEach((c) => {
      html += `
        <div class="cssd-box">
          <div class="cssd-title">⚡ ${c.action}</div>
          <div style="font-size: 1.1rem; font-weight: 700; margin: 8px 0;">"${c.englishText}"</div>
          <div style="font-size: 0.9rem; opacity: 0.9;">👉 Dịch: ${c.translation}</div>
          <button class="quick-jump-btn" style="margin-top: 10px; font-size: 0.85rem;" onclick="speakText('${escapeQuotes(c.englishText)}')">🔊 Nghe đọc thành tiếng</button>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  } else if (currentTab === "ai") {
    container.innerHTML = `
      <div style="background: var(--bg-main); padding: 1.5rem; border-radius: 12px;">
        <h3 style="color: var(--primary-dark); margin-bottom: 0.5rem;">🤖 Luyện Phản Xạ Đóng Vai Cùng Trợ Lý AI Antigravity</h3>
        <p style="margin-bottom: 1rem; font-size: 0.95rem;">Copy câu lệnh dưới đây và nhắn trực tiếp cho em (AI Antigravity) để bắt đầu luyện tập hội thoại:</p>
        <div style="background: var(--bg-card); padding: 1rem; border-radius: 8px; border: 1px solid var(--border); font-weight: 600; margin-bottom: 1rem;">
          "${activeDay.roleplayPrompt}"
        </div>
        <button class="quick-jump-btn" onclick="copyRoleplayPrompt('${escapeQuotes(activeDay.roleplayPrompt)}')">📋 Copy Câu Lệnh Luyện Nói với AI</button>
      </div>
    `;
  }
}

function checkModalQuizAnswer(idx, correctAnswer) {
  const input = document.getElementById(`modalQuizInput_${idx}`);
  const resultBadge = document.getElementById(`modalQuizResult_${idx}`);
  const resultText = document.getElementById(`modalQuizResultText_${idx}`);

  if (!input || !resultBadge) return;

  const userTyped = input.value.trim().toLowerCase();
  const target = correctAnswer.trim().toLowerCase();

  if (userTyped === target) {
    resultBadge.className = "quiz-result-badge correct";
    resultText.innerHTML = `🎉 CHÍNH XÁC! Giỏi lắm chị Huyền! Đáp án đúng: <strong>"${correctAnswer}"</strong>`;
    speakText(correctAnswer);
  } else {
    resultBadge.className = "quiz-result-badge incorrect";
    resultText.innerHTML = `❌ CHƯA ĐÚNG! Đáp án đúng là: <strong>"${correctAnswer}"</strong>`;
  }
}

function toggleSlowMode() {
  slowMode = !slowMode;
  renderModalTabContent();
}

function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

function copyRoleplayPrompt(promptText) {
  navigator.clipboard.writeText(promptText).then(() => {
    alert("Đã copy câu lệnh! Chị hãy nhắn trực tiếp cho AI Antigravity nhé.");
  });
}

function jumpToToday() {
  const completedCount = Object.keys(progressState).length;
  const todayNum = Math.min(completedCount + 1, 90);
  openLessonModal(todayNum);
}

function bindEvents() {
  document.getElementById("unitSelect")?.addEventListener("change", renderDaysGrid);
  document.getElementById("searchInput")?.addEventListener("input", renderDaysGrid);
  document.getElementById("themeToggleBtn")?.addEventListener("click", toggleTheme);
}
