// 🚀 ENGLISH NURSE 90-DAY LEARNING PORTAL - IXL & APPLE UI/UX PRO MAX ENGINE

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

// Modal 3D Flashcard State
let modalFlashcardIndex = 0;
let modalIsCardFlipped = false;

// Weekly Test Matching Game State
let selectedMatchWord = null;
let matchedPairsCount = 0;

// Medical Instrument Visual Badges Map
const VOCAB_IMAGE_MAP = {
  "scrub nurse": "👩‍⚕️",
  "surgeon": "👨‍⚕️",
  "radiographer": "🩻",
  "head nurse": "👩‍⚕️",
  "paramedic": "🚑",
  "operating theatre": "🏥",
  "sterile field": "🧼",
  "midwife": "👶",
  "ward nurse": "🏥",
  "decontamination": "🧼",
  "enzymatic cleaner": "🧪",
  "ultrasonic washer": "🛁",
  "autoclave": "♨️",
  "temperature": "🌡️",
  "chemical indicator": "🏷️",
  "sterile tray": "📥",
  "forceps": "✂️",
  "scalpel": "🔪",
  "surgical scissors": "✂️",
  "surgical instruments": "✂️",
  "suction catheter": "🩺",
  "specimen jar": "🫙",
  "dressing pack": "📦"
};

// Example Sentences Vietnamese Translation Lookup Table
const EXAMPLE_TRANSLATIONS = {
  "I am a scrub nurse in the operating theatre.": "Tôi là điều dưỡng dụng cụ làm việc trong phòng phẫu thuật.",
  "The surgeon is performing the operation.": "Bác sĩ phẫu thuật đang tiến hành ca mổ.",
  "The radiographer took an X-ray.": "Kỹ thuật viên X-quang đã chụp tấm phim X-quang.",
  "The head nurse manages the surgical ward.": "Điều dưỡng trưởng quản lý khoa phẫu thuật.",
  "The paramedic arrived quickly.": "Nhân viên cấp cứu ngoại viện đã đến rất nhanh.",
  "The operating theatre is ready for surgery.": "Phòng mổ đã được chuẩn bị sẵn sàng cho ca phẫu thuật.",
  "Do not touch the sterile field.": "Không được chạm vào vùng vô trùng.",
  "The midwife assisted the delivery.": "Nữ hộ sinh đã hỗ trợ ca sinh nở.",
  "The ward nurse checks vital signs.": "Điều dưỡng khoa bệnh kiểm tra chỉ số sinh tồn.",
  "Instruments go through decontamination first.": "Dụng cụ phải trải qua bước khử khuẩn làm sạch ban đầu trước.",
  "Soak the instruments in enzymatic cleaner.": "Ngâm dụng cụ trong dung dịch tẩy rửa enzyme.",
  "Put the delicate tools into the ultrasonic washer.": "Đưa các dụng cụ tinh xảo vào máy rửa siêu âm."
};

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
let currentAudioMimeType = "";

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
  loadRecorderSentencesForSelectedDay();
  initSpeechRecognition();
  initEnglishVoiceStudio();
  bindEvents();
});

// 🚀 SWITCH BETWEEN 7 CORE LEARNING MODULES
function switchMainModule(moduleName) {
  // Update nav button active states
  const navBtns = document.querySelectorAll(".module-nav-btn");
  navBtns.forEach((btn) => {
    if (btn.dataset.module === moduleName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Map module name to view element ID
  const viewMap = {
    home: "homeView",
    vocab: "flashcardView",
    practice: "quizView",
    speaking: "recorderView",
    review: "reviewView",
    progress: "progressView",
    profile: "profileView"
  };

  const targetViewId = viewMap[moduleName] || "homeView";

  // Hide all view sections and activate target
  const viewSections = document.querySelectorAll(".app-view-section");
  viewSections.forEach((section) => {
    if (section.id === targetViewId) {
      section.classList.add("active");
      section.style.display = "block";
    } else {
      section.classList.remove("active");
      section.style.display = "none";
    }
  });

  window.scrollTo({ top: 120, behavior: "smooth" });
}

function switchMainView(viewName) {
  switchMainModule(viewName);
}

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

// Populate Day Options Dropdowns for Flashcard, Quiz & Recorder
function populateDayOptionsDropdowns() {
  const flashSelect = document.getElementById("flashcardDeckSelect");
  const quizSelect = document.getElementById("quizDaySelect");
  const recSelect = document.getElementById("recorderDaySelect");

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

    if (recSelect) {
      const opt = document.createElement("option");
      opt.value = `day_${d.day}`;
      opt.textContent = optLabel;
      recSelect.appendChild(opt);
    }
  });
}

// Dynamic Recorder Sentences Loader By Day (TẤT CẢ 90 NGÀY)
function loadRecorderSentencesForSelectedDay() {
  const daySelect = document.getElementById("recorderDaySelect");
  const sentenceSelect = document.getElementById("recorderSentenceSelect");
  if (!sentenceSelect) return;

  const selectedKey = daySelect ? daySelect.value : "all";
  sentenceSelect.innerHTML = "";

  let sentencesList = [];

  const extractSentencesFromDay = (d) => {
    if (d.vocab) {
      d.vocab.forEach((v) => {
        if (v.example) {
          sentencesList.push({
            day: d.day,
            label: `[Ngày ${d.day}] ${v.word}: "${v.example}"`,
            text: v.example
          });
        }
      });
    }
    if (d.shadowing) {
      d.shadowing.forEach((s) => {
        if (s.sentence) {
          sentencesList.push({
            day: d.day,
            label: `[Ngày ${d.day}] ${s.speaker}: "${s.sentence}"`,
            text: s.sentence
          });
        }
      });
    }
    if (d.cssdSelfTalk) {
      d.cssdSelfTalk.forEach((c) => {
        if (c.englishText) {
          sentencesList.push({
            day: d.day,
            label: `[Ngày ${d.day}] ${c.action}: "${c.englishText}"`,
            text: c.englishText
          });
        }
      });
    }
  };

  if (selectedKey.startsWith("day_")) {
    const dayNum = parseInt(selectedKey.replace("day_", ""));
    const dayObj = CURRICULUM_DATA.find((d) => d.day === dayNum);
    if (dayObj) extractSentencesFromDay(dayObj);
  } else {
    CURRICULUM_DATA.forEach((d) => extractSentencesFromDay(d));
  }

  if (sentencesList.length === 0) {
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "I am a scrub nurse working in the CSSD department.";
    defaultOpt.textContent = '"I am a scrub nurse working in the CSSD department."';
    sentenceSelect.appendChild(defaultOpt);
  } else {
    sentencesList.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item.text;
      opt.textContent = item.label;
      sentenceSelect.appendChild(opt);
    });
  }

  updateRecorderSentence();
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

  const diffHtml = spokenWords
    .map((word) => {
      if (targetWords.includes(word)) {
        matchCount++;
        return `<span style="color: #22c55e; font-weight: 800;">${word}</span>`;
      } else {
        return `<span style="color: #e11d48; font-weight: 800; text-decoration: line-through;">${word}</span>`;
      }
    })
    .join(" ");

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

  try {
    speechRecognition = new SpeechRec();
    speechRecognition.lang = "en-US";
    speechRecognition.interimResults = false;
    speechRecognition.maxAlternatives = 1;

    speechRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const recognizedBox = document.getElementById("speechRecognizedBox") || document.getElementById("modalSpeechRecognizedBox");
      const outputEl = document.getElementById("recognizedTextOutput") || document.getElementById("modalRecognizedTextOutput");
      const feedbackEl = document.getElementById("speechFeedbackText") || document.getElementById("modalSpeechFeedbackText");

      const targetSelect = document.getElementById("modalRecorderSentenceSelect") || document.getElementById("recorderSentenceSelect");
      const targetText = targetSelect ? targetSelect.value : "";
      
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

    speechRecognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
    };
  } catch (e) {
    console.warn("Speech recognition init error:", e);
  }
}

// Dynamic Audio MIME Type Detection for Mobile (iOS Safari & Android Chrome)
function getSupportedAudioMimeType() {
  const types = [
    "audio/mp4",
    "audio/aac",
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg",
    "audio/wav"
  ];
  if (window.MediaRecorder && MediaRecorder.isTypeSupported) {
    for (const t of types) {
      if (MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    }
  }
  return "";
}

// 🎙️ AUDIO RECORDER STUDIO LOGIC & MOBILE COMPATIBILITY FIX
function updateRecorderSentence() {
  const select = document.getElementById("recorderSentenceSelect");
  const targetDisplay = document.getElementById("targetSentenceDisplay");
  if (select && targetDisplay) {
    targetDisplay.textContent = `"${select.value}"`;
  }
}

function updateModalRecorderSentence() {
  const select = document.getElementById("modalRecorderSentenceSelect");
  const targetDisplay = document.getElementById("modalTargetSentenceDisplay");
  if (select && targetDisplay) {
    targetDisplay.textContent = `"${select.value}"`;
  }
}

function playTargetSentenceAudio() {
  const select = document.getElementById("modalRecorderSentenceSelect") || document.getElementById("recorderSentenceSelect");
  if (select) speakText(select.value);
}

function playNativeAudioNormal() {
  slowMode = false;
  playTargetSentenceAudio();
}

function playNativeAudioSlow() {
  slowMode = true;
  playTargetSentenceAudio();
}

function resetRecordingSession() {
  const recognizedBox = document.getElementById("speechRecognizedBox") || document.getElementById("modalSpeechRecognizedBox");
  const audioContainer = document.getElementById("audioPlaybackContainer") || document.getElementById("modalAudioPlaybackContainer");
  const statusText = document.getElementById("recordingStatusText") || document.getElementById("modalRecordingStatusText");

  if (recognizedBox) recognizedBox.style.display = "none";
  if (audioContainer) audioContainer.style.display = "none";
  if (statusText) statusText.textContent = "Bấm RECORD để Bắt Đầu Ghi Âm";

  isRecording = false;
}

function deleteUserAudioRecording() {
  const player = document.getElementById("recordedAudioPlayer") || document.getElementById("modalRecordedAudioPlayer");
  const audioContainer = document.getElementById("audioPlaybackContainer") || document.getElementById("modalAudioPlaybackContainer");
  const statusText = document.getElementById("recordingStatusText") || document.getElementById("modalRecordingStatusText");
  const recognizedBox = document.getElementById("speechRecognizedBox") || document.getElementById("modalSpeechRecognizedBox");

  if (player && player.src) {
    try { URL.revokeObjectURL(player.src); } catch(e){}
    player.src = "";
  }

  if (audioContainer) audioContainer.style.display = "none";
  if (recognizedBox) recognizedBox.style.display = "none";
  if (statusText) statusText.textContent = "Đã xóa bản ghi âm! Bấm RECORD để thử lại.";

  audioChunks = [];
  alert("🗑️ ĐÃ XÓA BẢN GHI ÂM CỦA BẠN!\n\nFile giọng nói đã được xóa hoàn toàn khỏi bộ nhớ tạm thời của thiết bị.");
}

async function toggleMicRecording() {
  const micBtn = document.getElementById("modalBigMicBtn") || document.getElementById("bigMicBtn");
  const statusText = document.getElementById("modalRecordingStatusText") || document.getElementById("recordingStatusText");
  const audioContainer = document.getElementById("modalAudioPlaybackContainer") || document.getElementById("audioPlaybackContainer");
  const player = document.getElementById("modalRecordedAudioPlayer") || document.getElementById("recordedAudioPlayer");

  if (!isRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      audioChunks = [];
      currentAudioMimeType = getSupportedAudioMimeType();

      const options = currentAudioMimeType ? { mimeType: currentAudioMimeType } : {};
      mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        try {
          const blobType = currentAudioMimeType || (audioChunks[0] && audioChunks[0].type) || "audio/mp4";
          const audioBlob = new Blob(audioChunks, { type: blobType });
          const audioUrl = URL.createObjectURL(audioBlob);

          if (player) {
            player.src = audioUrl;
            player.load();
          }
          if (audioContainer) {
            audioContainer.style.display = "block";
          }
        } catch (err) {
          console.error("Audio Blob playback error:", err);
        }
      };

      mediaRecorder.start(100);
      isRecording = true;

      if (micBtn) micBtn.classList.add("recording");
      if (statusText) statusText.textContent = "🔴 Đang Ghi Âm... (Bấm nút để DỪNG)";

      if (speechRecognition) {
        try {
          speechRecognition.start();
        } catch (e) {
          console.warn("Recognition start skip:", e);
        }
      }

    } catch (err) {
      console.error("Microphone access error:", err);
      alert(
        "💡 CHÚ Ý TRÊN ĐIỆN THOẠI:\n\nKhông thể truy cập Microphone! Chị vui lòng kiểm tra cài đặt điện thoại:\n- Vào Cài đặt điện thoại ➔ Chọn Safari/Chrome ➔ Cho phép truy cập 'Microphone'."
      );
    }
  } else {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      try {
        mediaRecorder.stop();
      } catch (e) {}
      if (mediaRecorder.stream) {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
    }

    if (speechRecognition) {
      try {
        speechRecognition.stop();
      } catch (e) {}
    }

    isRecording = false;
    if (micBtn) micBtn.classList.remove("recording");
    if (statusText) statusText.textContent = "✅ Ghi âm hoàn tất! Hãy bấm nút ▶️ bên dưới để nghe lại ⬇️";
  }
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

// View Navigation (Modules: Home, Vocab, Practice, Speaking, Review, Progress, Profile)
function switchMainModule(moduleName) {
  document.querySelectorAll(".app-view-section").forEach((sec) => {
    sec.classList.remove("active");
  });
  document.querySelectorAll(".module-nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.module === moduleName);
  });

  const targetView = document.getElementById(`${moduleName}View`);
  if (targetView) targetView.classList.add("active");

  if (moduleName === "vocab") {
    initFlashcardGame();
  } else if (moduleName === "practice") {
    loadQuizForSelectedDay();
  } else if (moduleName === "speaking") {
    loadRecorderSentencesForSelectedDay();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function switchMainView(viewName) {
  switchMainModule(viewName);
}

function toggleFounderPopup() {
  const card = document.getElementById("founderPopupCard");
  if (card) card.classList.toggle("show");
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
    card.style.cssText = "background: #ffffff !important; border-radius: 20px !important; padding: 1.5rem !important; border: 1.5px solid #e2e8f0 !important; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04) !important; display: flex !important; flex-direction: column !important; justify-content: space-between !important; min-height: 220px !important; transition: all 0.3s ease !important; position: relative !important;";

    if (isCompleted) {
      card.style.borderColor = "#10b981";
      card.style.background = "#f0fdf4";
    } else if (isMilestone) {
      card.style.borderColor = "#f59e0b";
      card.style.background = "#fffbeb";
    }

    const unitObj = UNITS_DATA.find((u) => u.id === item.unitId) || {};

    card.style.cursor = "pointer";
    card.onclick = (e) => {
      if (e.target.tagName.toLowerCase() !== "input") {
        openLessonModal(item.day);
      }
    };

    card.innerHTML = `
      <div>
        <div style="display: flex !important; justify-content: space-between !important; align-items: center !important; margin-bottom: 0.75rem !important;">
          <span class="day-tag-badge" style="background: #ccfbf1 !important; color: #0f766e !important; font-weight: 800 !important; font-size: 0.78rem !important; padding: 5px 14px !important; border-radius: 50px !important; letter-spacing: 0.05em !important; text-transform: uppercase !important; display: inline-block !important;">NGÀY ${item.day} ${isMilestone ? "🏆" : ""}</span>
          <label title="Đánh dấu hoàn thành" onclick="event.stopPropagation()" style="cursor: pointer !important; display: flex !important; align-items: center !important;">
            <input type="checkbox" ${isCompleted ? "checked" : ""} onchange="toggleDayComplete(${item.day}, this.checked)" class="card-checkbox-custom" style="width: 22px !important; height: 22px !important; border-radius: 6px !important; border: 2px solid #cbd5e1 !important; accent-color: #0d9488 !important; cursor: pointer !important;">
          </label>
        </div>
        <div class="card-title-text" style="font-size: 1.1rem !important; font-weight: 800 !important; color: #0f172a !important; line-height: 1.35 !important; margin-top: 0.8rem !important; margin-bottom: 0.5rem !important;">${item.title}</div>
        <div class="card-goal-text" style="font-size: 0.88rem !important; color: #64748b !important; line-height: 1.45 !important; margin-bottom: 1.2rem !important;">${item.goal}</div>
      </div>
      <div class="card-footer-row" style="display: flex !important; justify-content: space-between !important; align-items: center !important; margin-top: auto !important; padding-top: 0.8rem !important; border-top: 1px solid #f1f5f9 !important;">
        <span class="card-unit-text" style="font-size: 0.85rem !important; font-weight: 700 !important; color: #64748b !important; display: flex !important; align-items: center !important; gap: 6px !important;">🩺 Unit ${item.unitId}</span>
        <button class="card-open-btn" onclick="event.stopPropagation(); openLessonModal(${item.day})" style="background: #ffffff !important; color: #0d9488 !important; border: 1.5px solid #0d9488 !important; padding: 7px 18px !important; border-radius: 50px !important; font-weight: 800 !important; font-size: 0.88rem !important; cursor: pointer !important; transition: all 0.2s ease !important;">Vào Bài Học ➔</button>
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
  const cleanKey = currentItem.word.toLowerCase().trim();

  // Front Face Elements
  const imgBadgeEl = document.getElementById("flashImgBadge");
  if (imgBadgeEl) imgBadgeEl.textContent = VOCAB_IMAGE_MAP[cleanKey] || "🩺";

  const catTagEl = document.getElementById("flashCategoryTag");
  if (catTagEl) catTagEl.textContent = `[${currentItem.pos || 'Nursing Term'}]`;

  const wordEl = document.getElementById("flashWord");
  if (wordEl) wordEl.textContent = currentItem.word;

  const ipaEl = document.getElementById("flashIpa");
  if (ipaEl) ipaEl.textContent = currentItem.ipa;

  // Back Face Elements
  const meaningEl = document.getElementById("flashMeaning");
  if (meaningEl) meaningEl.textContent = currentItem.meaning;

  const posEl = document.getElementById("flashPos");
  if (posEl) posEl.textContent = `Loại từ: ${currentItem.pos || 'Từ vựng Điều dưỡng'}`;

  const exampleEl = document.getElementById("flashExample");
  if (exampleEl) exampleEl.textContent = `"${currentItem.example}"`;

  const exampleTransEl = document.getElementById("flashExampleTranslation");
  if (exampleTransEl) {
    const translation = EXAMPLE_TRANSLATIONS[currentItem.example] || "Bản dịch: Dụng cụ y tế cần được thực hiện đúng quy trình vô trùng.";
    exampleTransEl.textContent = `Dịch: ${translation}`;
  }

  const nursingNoteEl = document.getElementById("flashNursingNote");
  if (nursingNoteEl) {
    const note = currentItem.nursingNote || "💡 <strong>Nursing Note:</strong> Luôn kiểm tra tình trạng nguyên vẹn của dụng cụ y tế và tuân thủ nghiêm ngặt quy trình vô trùng trong phòng mổ (OR) & CSSD.";
    nursingNoteEl.innerHTML = note;
  }

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

function playCurrentFlashcardSentenceAudio() {
  if (currentFlashcardDeck.length > 0) {
    const item = currentFlashcardDeck[currentFlashcardIndex];
    speakText(item.example);
  }
}

function rateSpacedRepetition(level) {
  if (currentFlashcardDeck.length === 0) return;
  const currentItem = currentFlashcardDeck[currentFlashcardIndex];

  if (level === 'again') {
    delete masteredVocabState[currentItem.word];
    // Push item to the end of queue to review again in the same session
    currentFlashcardDeck.push(currentItem);
  } else if (level === 'good') {
    masteredVocabState[currentItem.word] = true;
  } else if (level === 'easy') {
    masteredVocabState[currentItem.word] = true;
  }

  localStorage.setItem(MASTERED_VOCAB_KEY, JSON.stringify(masteredVocabState));
  updateProgressStats();

  currentFlashcardIndex = (currentFlashcardIndex + 1) % currentFlashcardDeck.length;
  renderCurrentFlashcard();
}

// ✏️ PRACTICE STUDIO ENGINE (TRỌN BỘ 6 DẠNG BÀI TẬP & GIẢI THÍCH LỖI SAI CHI TIẾT)
let currentPracticeFormat = "fill";

function switchPracticeFormat(format) {
  currentPracticeFormat = format;
  document.querySelectorAll(".practice-tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.format === format);
  });
  loadQuizForSelectedDay();
}

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

    let formatHtml = "";

    if (currentPracticeFormat === "fill") {
      // DẠNG 1: FILL IN THE BLANK
      formatHtml = `
        <div class="quiz-sentence">${q.sentence.replace("________", "<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>")}</div>
        <div class="quiz-input-group">
          <input type="text" id="quizInput_${idx}" class="quiz-input" placeholder="Gõ từ còn thiếu..." onkeyup="if(event.key==='Enter') checkQuizAnswerDetailed(${idx}, '${escapeQuotes(q.answer)}', '${escapeQuotes(q.sentence)}')">
          <button class="quiz-check-btn" onclick="checkQuizAnswerDetailed(${idx}, '${escapeQuotes(q.answer)}', '${escapeQuotes(q.sentence)}')">Kiểm Tra Đáp Án</button>
        </div>
      `;
    } else if (currentPracticeFormat === "listenType") {
      // DẠNG 2: LISTEN AND TYPE
      formatHtml = `
        <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">
          <button class="quick-jump-btn" style="padding: 8px 18px; font-size: 0.88rem;" onclick="speakText('${escapeQuotes(q.answer)}')">🎧 Nghe Audio Từ Vựng</button>
          <span style="font-size: 0.85rem; color: var(--text-muted);">(Nghe giọng đọc bản xứ và gõ lại từ nghe được)</span>
        </div>
        <div class="quiz-input-group">
          <input type="text" id="quizInput_${idx}" class="quiz-input" placeholder="Gõ lại từ chị nghe được..." onkeyup="if(event.key==='Enter') checkQuizAnswerDetailed(${idx}, '${escapeQuotes(q.answer)}', '${escapeQuotes(q.sentence)}')">
          <button class="quiz-check-btn" onclick="checkQuizAnswerDetailed(${idx}, '${escapeQuotes(q.answer)}', '${escapeQuotes(q.sentence)}')">Kiểm Tra Đáp Án</button>
        </div>
      `;
    } else if (currentPracticeFormat === "choose") {
      // DẠNG 3: CHOOSE THE WORD (TRẮC NGHIỆM)
      const wrongOptions = ["fever", "wound", "dressing", "bandage", "needle", "autoclave"].filter(w => w !== q.answer.toLowerCase());
      const choices = [q.answer, wrongOptions[0], wrongOptions[1]].sort(() => Math.random() - 0.5);

      let buttonsHtml = choices.map(opt => `
        <button class="quiz-check-btn" style="background: var(--bg-main); color: var(--text-main); border: 1.5px solid var(--border); width: 100%; text-align: left; margin-bottom: 6px; padding: 10px 16px;" onclick="checkMultipleChoiceAnswer(${idx}, '${escapeQuotes(opt)}', '${escapeQuotes(q.answer)}', '${escapeQuotes(q.sentence)}')">
          ⚪ ${opt}
        </button>
      `).join("");

      formatHtml = `
        <div class="quiz-sentence">${q.sentence.replace("________", "<u>________</u>")}</div>
        <div style="margin-top: 10px;">${buttonsHtml}</div>
      `;
    } else if (currentPracticeFormat === "ipa") {
      // DẠNG 5: IPA RECOGNITION
      const cleanW = q.answer.toLowerCase().trim();
      const ipa = GLOBAL_IPA_MAP[cleanW] || `/${cleanW}/`;
      const wrongWords = ["sterile", "forceps", "autoclave", "incision", "suction"].filter(w => w !== cleanW);
      const choices = [q.answer, wrongWords[0], wrongWords[1]].sort(() => Math.random() - 0.5);

      let buttonsHtml = choices.map(opt => `
        <button class="quiz-check-btn" style="background: var(--bg-main); color: var(--text-main); border: 1.5px solid var(--border); width: 100%; text-align: left; margin-bottom: 6px; padding: 10px 16px;" onclick="checkMultipleChoiceAnswer(${idx}, '${escapeQuotes(opt)}', '${escapeQuotes(q.answer)}', '${escapeQuotes(q.sentence)}')">
          🗣️ Từ: <strong>${opt}</strong>
        </button>
      `).join("");

      formatHtml = `
        <div style="font-size: 1rem; font-weight: 700; color: var(--secondary); margin-bottom: 8px;">
          Phiên âm IPA: <span style="font-family: monospace; font-size: 1.3rem; color: var(--accent); background: #fef3c7; padding: 4px 12px; border-radius: 12px;">${ipa}</span>
        </div>
        <div style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 10px;">Hãy chọn từ tiếng Anh tương ứng với phiên âm trên:</div>
        <div>${buttonsHtml}</div>
      `;
    } else if (currentPracticeFormat === "builder") {
      // DẠNG 6: SENTENCE BUILDER
      const words = q.answer.split(" ").sort(() => Math.random() - 0.5);
      let chipsHtml = words.map(w => `
        <button class="sync-btn" style="padding: 6px 14px; font-size: 0.9rem;" onclick="appendWordToBuilder(${idx}, '${escapeQuotes(w)}')">${w}</button>
      `).join(" ");

      formatHtml = `
        <div style="font-weight: 700; color: var(--primary-dark); margin-bottom: 6px;">Sắp xếp từ thành câu hoàn chỉnh:</div>
        <div style="margin-bottom: 10px; display: flex; gap: 6px; flex-wrap: wrap;">${chipsHtml}</div>
        <div class="quiz-input-group">
          <input type="text" id="quizInput_${idx}" class="quiz-input" placeholder="Các từ đã chọn sẽ hiện ở đây..." readonly>
          <button class="sync-btn" onclick="clearBuilderInput(${idx})" style="background: #ffe4e6; color: #e11d48;">Xóa</button>
          <button class="quiz-check-btn" onclick="checkQuizAnswerDetailed(${idx}, '${escapeQuotes(q.answer)}', '${escapeQuotes(q.sentence)}')">Kiểm Tra</button>
        </div>
      `;
    } else {
      // DẠNG 4: MATCHING (FALLBACK)
      formatHtml = `
        <div class="quiz-sentence">${q.sentence.replace("________", "<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>")}</div>
        <div class="quiz-input-group">
          <input type="text" id="quizInput_${idx}" class="quiz-input" placeholder="Gõ từ còn thiếu..." onkeyup="if(event.key==='Enter') checkQuizAnswerDetailed(${idx}, '${escapeQuotes(q.answer)}', '${escapeQuotes(q.sentence)}')">
          <button class="quiz-check-btn" onclick="checkQuizAnswerDetailed(${idx}, '${escapeQuotes(q.answer)}', '${escapeQuotes(q.sentence)}')">Kiểm Tra Đáp Án</button>
        </div>
      `;
    }

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span class="day-tag">CÂU ${idx + 1} / ${questions.length} (NGÀY ${q.day})</span>
        <span style="font-size: 0.82rem; font-weight: 700; color: var(--primary-dark);">DẠNG BÀI: ${currentPracticeFormat.toUpperCase()}</span>
      </div>

      ${formatHtml}

      <!-- Detailed Explanation Result Box -->
      <div id="quizResult_${idx}" class="quiz-result-badge" style="display: none; margin-top: 12px; flex-direction: column; align-items: flex-start; gap: 8px; text-align: left; padding: 1.2rem; border-radius: 16px;">
        <div id="quizResultText_${idx}" style="font-size: 1rem; font-weight: 800;"></div>
        <div id="quizExplanationText_${idx}" style="font-size: 0.88rem; line-height: 1.5; opacity: 0.95;"></div>
      </div>
    `;

    container.appendChild(card);
  });
}

function appendWordToBuilder(idx, word) {
  const input = document.getElementById(`quizInput_${idx}`);
  if (input) {
    input.value = input.value ? `${input.value} ${word}` : word;
  }
}

function clearBuilderInput(idx) {
  const input = document.getElementById(`quizInput_${idx}`);
  if (input) input.value = "";
}

function checkMultipleChoiceAnswer(idx, selectedOpt, correctAnswer, originalSentence) {
  const input = document.getElementById(`quizInput_${idx}`);
  if (input) input.value = selectedOpt;
  checkQuizAnswerDetailed(idx, correctAnswer, originalSentence, selectedOpt);
}

function checkQuizAnswerDetailed(idx, correctAnswer, originalSentence, userSelected) {
  const input = document.getElementById(`quizInput_${idx}`);
  const resultBadge = document.getElementById(`quizResult_${idx}`);
  const resultText = document.getElementById(`quizResultText_${idx}`);
  const explanationText = document.getElementById(`quizExplanationText_${idx}`);

  if (!resultBadge || !resultText) return;

  const userTyped = userSelected || (input ? input.value.trim() : "");
  const cleanUser = userTyped.trim().toLowerCase();
  const cleanTarget = correctAnswer.trim().toLowerCase();

  resultBadge.style.display = "flex";

  if (cleanUser === cleanTarget) {
    resultBadge.className = "quiz-result-badge correct";
    resultBadge.style.background = "#dcfce7";
    resultBadge.style.borderColor = "#22c55e";
    resultBadge.style.color = "#15803d";

    resultText.innerHTML = `🎉 CHÍNH XÁC! Giỏi lắm chị Phạm Huyền! Đáp án đúng: <strong>"${correctAnswer}"</strong>`;
    explanationText.innerHTML = `💡 <strong>Giải thích y khoa:</strong> Từ <strong>"${correctAnswer}"</strong> là thuật ngữ chuyên ngành hoàn toàn chính xác cho ngữ cảnh: <em>"${originalSentence.replace("________", correctAnswer)}"</em>.`;
    speakText(correctAnswer);
    quizScore++;
  } else {
    resultBadge.className = "quiz-result-badge incorrect";
    resultBadge.style.background = "#ffe4e6";
    resultBadge.style.borderColor = "#f43f5e";
    resultBadge.style.color = "#9f1239";

    resultText.innerHTML = `❌ RẤT TIẾC! CHƯA CHÍNH XÁC (Đáp án đúng: <strong>"${correctAnswer}"</strong>)`;
    
    explanationText.innerHTML = `
      <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed rgba(225, 29, 72, 0.3);">
        <div>🔴 <strong>Lỗi sai của chị:</strong> Chị đã nhập <em>"${userTyped || 'Để trống'}"</em>.</div>
        <div>🟢 <strong>Đáp án chuẩn y tế:</strong> <strong>"${correctAnswer}"</strong>.</div>
        <div style="margin-top: 6px;">💡 <strong>Phân tích lý do sai:</strong> Trong ngữ cảnh điều dưỡng <em>"${originalSentence}"</em>, từ <strong>"${correctAnswer}"</strong> là đáp án chuẩn xác nhất về nghĩa và từ loại.</div>
        <div style="margin-top: 6px; color: #be123c;">📌 <strong>Gợi ý ôn tập:</strong> Chị hãy bấm nút 🔊 nghe lại phát âm từ này và lật lại thẻ Flashcard bài hôm nay để ghi nhớ sâu hơn nhé!</div>
      </div>
    `;
    speakText(correctAnswer);
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

// Modal Lesson Detail & 3D Flashcard & Audio Recorder Integration
function openLessonModal(day) {
  day = Number(day);
  const dayData = CURRICULUM_DATA.find((d) => Number(d.day) === day);
  if (!dayData) {
    console.error("No lesson data found for day:", day);
    return;
  }

  activeDay = dayData;
  modalFlashcardIndex = 0;
  modalIsCardFlipped = false;
  currentTab = "vocab"; // Open Vocab & IPA tab by default inside Lesson Modal

  const modal = document.getElementById("lessonModal");
  if (modal) {
    modal.classList.add("active");
    modal.style.setProperty("display", "flex", "important");
    modal.style.setProperty("opacity", "1", "important");
    modal.style.setProperty("pointer-events", "auto", "important");
    modal.style.setProperty("position", "fixed", "important");
    modal.style.setProperty("top", "0", "important");
    modal.style.setProperty("left", "0", "important");
    modal.style.setProperty("right", "0", "important");
    modal.style.setProperty("bottom", "0", "important");
    modal.style.setProperty("background", "rgba(15, 23, 42, 0.8)", "important");
    modal.style.setProperty("z-index", "999999", "important");
    modal.style.setProperty("backdrop-filter", "blur(20px)", "important");
    modal.style.setProperty("-webkit-backdrop-filter", "blur(20px)", "important");
    modal.style.setProperty("align-items", "center", "important");
    modal.style.setProperty("justify-content", "center", "important");
  }

  const titleEl = document.getElementById("modalDayTitle");
  if (titleEl) titleEl.textContent = dayData.title;

  const goalEl = document.getElementById("modalDayGoal");
  if (goalEl) goalEl.textContent = dayData.goal;

  switchTab("vocab");
}

function closeLessonModal() {
  const modal = document.getElementById("lessonModal");
  if (modal) {
    modal.classList.remove("active");
    modal.style.setProperty("display", "none", "important");
    modal.style.setProperty("opacity", "0", "important");
    modal.style.setProperty("pointer-events", "none", "important");
  }
  if (window.speechSynth) speechSynth.cancel();
}

function switchTab(tabName) {
  currentTab = tabName;
  document.querySelectorAll(".modal-tabs .tab-btn").forEach((btn) => {
    const isActive = btn.dataset.tab === tabName;
    btn.classList.toggle("active", isActive);
    if (isActive) {
      btn.style.background = "#0d9488";
      btn.style.color = "#ffffff";
      btn.style.borderColor = "#0d9488";
      btn.style.fontWeight = "800";
    } else {
      btn.style.background = "#f8fafc";
      btn.style.color = "#334155";
      btn.style.borderColor = "#cbd5e1";
      btn.style.fontWeight = "700";
    }
  });
  renderModalTabContent();
}

// Modal 3D Flashcard Interactive Logic
function flipModalFlashcard() {
  const wrapper = document.getElementById("modalFlashcardWrapper");
  if (!wrapper) return;
  modalIsCardFlipped = !modalIsCardFlipped;
  wrapper.classList.toggle("flipped", modalIsCardFlipped);
}

function nextModalFlashcard(isMastered) {
  if (!activeDay || !activeDay.vocab || activeDay.vocab.length === 0) return;

  const currentItem = activeDay.vocab[modalFlashcardIndex];
  if (isMastered) {
    masteredVocabState[currentItem.word] = true;
  } else {
    delete masteredVocabState[currentItem.word];
  }
  localStorage.setItem(MASTERED_VOCAB_KEY, JSON.stringify(masteredVocabState));
  updateProgressStats();

  modalFlashcardIndex = (modalFlashcardIndex + 1) % activeDay.vocab.length;
  modalIsCardFlipped = false;
  renderModalTabContent();
}

// 🏆 WEEKLY MATCHING GAME & REVIEW TEST LOGIC
function selectMatchCard(element, type, val, correctWord) {
  if (type === "word") {
    document.querySelectorAll(".match-word-card").forEach((c) => c.classList.remove("selected"));
    element.classList.add("selected");
    selectedMatchWord = { el: element, val: val };
  } else if (type === "meaning") {
    if (!selectedMatchWord) {
      alert("Chị vui lòng chọn 1 từ Tiếng Anh ở cột bên trái trước nhé!");
      return;
    }
    if (selectedMatchWord.val === correctWord) {
      element.style.background = "#dcfce7";
      element.style.borderColor = "#22c55e";
      element.style.color = "#15803d";
      element.innerHTML = "✅ " + element.innerHTML;

      selectedMatchWord.el.style.background = "#dcfce7";
      selectedMatchWord.el.style.borderColor = "#22c55e";
      selectedMatchWord.el.style.color = "#15803d";
      selectedMatchWord.el.innerHTML = "✅ " + selectedMatchWord.el.innerHTML;

      speakText(selectedMatchWord.val);
      selectedMatchWord = null;
      matchedPairsCount++;
    } else {
      element.style.background = "#ffe4e6";
      setTimeout(() => {
        element.style.background = "var(--bg-main)";
      }, 800);
      alert("❌ Chưa đúng cặp từ! Chị hãy chọn lại từ khác nhé.");
    }
  }
}

function renderModalTabContent() {
  const container = document.getElementById("tabContentContainer");
  if (!container || !activeDay) return;

  if (currentTab === "vocab") {
    // 🗣️ ENHANCED VOCABULARY TAB WITH INSTRUMENT IMAGES, IPA & VIETNAMESE TRANSLATION
    let html = `<div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="color: var(--secondary);">🗣️ Từ Vựng, Phiên Âm IPA & Hình Ảnh Minh Họa Dụng Cụ (Bấm 🔊 để nghe)</h3>
        <button class="theme-toggle-btn" onclick="toggleSlowMode()">
          ${slowMode ? "🐢 Tốc độ Chậm (0.75x)" : "⚡ Tốc độ Chuẩn (1.0x)"}
        </button>
      </div>`;

    activeDay.vocab.forEach((v) => {
      const cleanWordKey = v.word.toLowerCase().trim();
      const visualIcon = VOCAB_IMAGE_MAP[cleanWordKey] || "🩺";
      const exampleTranslation = EXAMPLE_TRANSLATIONS[v.example] || "Bản dịch câu ví dụ đang được cập nhật.";

      html += `
        <div class="vocab-item" style="display: flex; gap: 14px; align-items: center; background: var(--bg-card); padding: 1.25rem; border-radius: 18px; border: 1px solid var(--border); margin-bottom: 1rem; box-shadow: var(--shadow-sm);">
          <!-- Visual Instrument / Medical Image Thumbnail Badge -->
          <div style="width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, #ccfbf1 0%, #f0fdf4 100%); border: 1.5px solid var(--primary-light); display: flex; align-items: center; justify-content: center; font-size: 2.2rem; flex-shrink: 0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
            ${visualIcon}
          </div>

          <div class="vocab-main" style="flex-grow: 1; display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <span class="vocab-word" style="font-size: 1.25rem; font-weight: 900; color: var(--primary-dark);">${v.word}</span>
              <span class="vocab-ipa" style="font-family: var(--font-mono); font-weight: 700; color: #d97706; background: #fef3c7; padding: 2px 10px; border-radius: 8px; font-size: 0.92rem;">${v.ipa}</span>
            </div>
            <div class="vocab-meaning" style="font-size: 1rem; font-weight: 800; color: var(--secondary); margin-top: 2px;">
              👉 Dịch nghĩa Tiếng Việt: <span style="color: var(--text-main); font-weight: 700;">${v.meaning}</span>
            </div>
            <div class="vocab-example" style="font-size: 0.92rem; color: var(--text-main); background: var(--bg-main); padding: 8px 12px; border-radius: 10px; margin-top: 4px; border-left: 4px solid var(--primary);">
              <div>" <strong>${v.example}</strong> "</div>
              <div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic; margin-top: 2px;">💡 Dịch: ${exampleTranslation}</div>
            </div>
          </div>

          <button class="audio-btn" style="width: 48px; height: 48px; font-size: 1.2rem;" onclick="speakText('${escapeQuotes(v.word)}')">🔊</button>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  } else if (currentTab === "flashcard") {
    const vocabList = activeDay.vocab || [];
    if (vocabList.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-muted);">Không có từ vựng cho bài học này.</div>`;
      return;
    }

    const currentItem = vocabList[modalFlashcardIndex];

    let html = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <div style="display: flex; justify-content: space-between; width: 100%; max-width: 520px; align-items: center;">
          <h3 style="color: var(--secondary);">🎴 Thẻ Flashcard 3D (Ngày ${activeDay.day})</h3>
          <span style="font-weight: 800; color: var(--primary-dark);">Thẻ ${modalFlashcardIndex + 1} / ${vocabList.length}</span>
        </div>

        <!-- Modal 3D Flip Card -->
        <div id="modalFlashcardWrapper" class="flashcard-3d-wrapper ${modalIsCardFlipped ? "flipped" : ""}" onclick="flipModalFlashcard()" style="max-width: 520px; height: 320px; margin: 0.5rem 0;">
          <div class="flashcard-inner">
            <!-- Front Face (English) -->
            <div class="flashcard-face flashcard-front">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary); margin-bottom: 6px;">TIẾNG ANH (NHẤN ĐỂ LẬT THẺ)</span>
              <div class="flash-word-text">${currentItem.word}</div>
              <div class="flash-ipa-text">${currentItem.ipa}</div>
              <button class="audio-btn-pill" style="margin-top: 8px;" onclick="event.stopPropagation(); speakText('${escapeQuotes(currentItem.word)}')">🔊 Nghe Đọc</button>
            </div>
            <!-- Back Face (Vietnamese Meaning & Example) -->
            <div class="flashcard-face flashcard-back">
              <span style="font-size: 0.8rem; font-weight: 700; color: #5eead4; margin-bottom: 6px;">NGHĨA TIẾNG VIỆT & VÍ DỤ</span>
              <div class="flash-meaning-text">${currentItem.meaning}</div>
              <div class="flash-example-text">"${currentItem.example}"</div>
            </div>
          </div>
        </div>

        <!-- Modal Flashcard Action Buttons -->
        <div class="flashcard-game-actions" style="max-width: 520px;">
          <button class="game-btn btn-again" onclick="nextModalFlashcard(false)">❌ Chưa Thuộc</button>
          <button class="game-btn" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border);" onclick="flipModalFlashcard()">🔄 Lật Thẻ</button>
          <button class="game-btn btn-know" onclick="nextModalFlashcard(true)">✅ Đã Thuộc</button>
        </div>
      </div>
    `;

    container.innerHTML = html;
  } else if (currentTab === "recorder") {
    let sentencesList = [];
    if (activeDay.vocab) {
      activeDay.vocab.forEach((v) => {
        if (v.example) sentencesList.push({ label: `[Từ vựng] ${v.word}: "${v.example}"`, text: v.example });
      });
    }
    if (activeDay.shadowing) {
      activeDay.shadowing.forEach((s) => {
        if (s.sentence) sentencesList.push({ label: `[Hội thoại] ${s.speaker}: "${s.sentence}"`, text: s.sentence });
      });
    }
    if (activeDay.cssdSelfTalk) {
      activeDay.cssdSelfTalk.forEach((c) => {
        if (c.englishText) sentencesList.push({ label: `[CSSD] ${c.action}: "${c.englishText}"`, text: c.englishText });
      });
    }

    let defaultSentence = sentencesList.length > 0 ? sentencesList[0].text : "I am a scrub nurse working in the operating theatre.";

    let selectOptionsHtml = sentencesList
      .map((item) => `<option value="${escapeQuotes(item.text)}">${item.label}</option>`)
      .join("");

    let html = `
      <div class="recorder-studio-container" style="padding: 1rem; border: none; box-shadow: none;">
        <h3 style="color: var(--secondary); margin-bottom: 0.5rem;">🎙️ PHÒNG GHI ÂM & CHẤM PHÁT ÂM (NGÀY ${activeDay.day})</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">Ghi âm câu luyện phát âm của Ngày ${activeDay.day}, nhận ngay điểm % chính xác & thẻ chữa lỗi IPA!</p>

        <!-- Sample Sentence Selector -->
        <div style="background: var(--bg-main); padding: 1.2rem; border-radius: 14px; border: 1px solid var(--border);">
          <label style="font-weight: 700; display: block; margin-bottom: 6px;">Chọn câu luyện ghi âm của Ngày ${activeDay.day}:</label>
          <select id="modalRecorderSentenceSelect" class="unit-select" style="width: 100%; margin-bottom: 1rem;" onchange="updateModalRecorderSentence()">
            ${selectOptionsHtml}
          </select>

          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div id="modalTargetSentenceDisplay" style="font-size: 1.15rem; font-weight: 800; color: var(--primary-dark);">
              "${defaultSentence}"
            </div>
            <button class="audio-btn-pill" onclick="playTargetSentenceAudio()">🔊 Nghe Mẫu</button>
          </div>
        </div>

        <!-- Recording Mic Box -->
        <div class="recorder-mic-box" style="margin-top: 1rem;">
          <button id="modalBigMicBtn" class="big-mic-btn" onclick="toggleMicRecording()">🎙️</button>
          <div id="modalRecordingStatusText" class="recording-status-text">Bấm vào Micro để Bắt Đầu Ghi Âm</div>

          <!-- Recorded Audio Player -->
          <div id="modalAudioPlaybackContainer" style="display: none; width: 100%; text-align: center; margin-top: 1rem;">
            <div style="font-weight: 700; color: var(--primary-dark); margin-bottom: 6px;">🎧 Giọng nói vừa ghi âm của chị Huyền:</div>
            <audio id="modalRecordedAudioPlayer" controls class="recorded-audio-player"></audio>
          </div>

          <!-- Speech Recognition Result -->
          <div id="modalSpeechRecognizedBox" style="display: none; margin-top: 1rem; background: var(--bg-card); padding: 1.2rem; border-radius: 12px; width: 100%; border: 1px solid var(--border); text-align: left;">
            <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-muted); text-transform: uppercase;">Văn bản nhận dạng từ giọng nói của chị:</div>
            <div id="modalRecognizedTextOutput" style="font-size: 1.15rem; font-weight: 800; color: var(--secondary); margin: 8px 0; line-height: 1.5;">...</div>
            <div id="modalSpeechFeedbackText" style="font-weight: 800; font-size: 1rem; margin-top: 8px;">...</div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  } else if (currentTab === "weeklyTest") {
    const vocabList = activeDay.vocab || [];
    const shuffledMeanings = [...vocabList].sort(() => Math.random() - 0.5);

    let matchWordsHtml = vocabList
      .map(
        (v) =>
          `<button class="match-word-card" style="padding: 10px 16px; border-radius: 12px; border: 2px solid var(--border); background: var(--bg-main); font-weight: 800; cursor: pointer; text-align: left; transition: var(--transition-fast);" onclick="selectMatchCard(this, 'word', '${escapeQuotes(v.word)}')">🗣️ ${v.word} <span style="font-family: monospace; font-size: 0.8rem; color: var(--accent);">${v.ipa}</span></button>`
      )
      .join("");

    let matchMeaningsHtml = shuffledMeanings
      .map(
        (v) =>
          `<button class="match-meaning-card" style="padding: 10px 16px; border-radius: 12px; border: 2px solid var(--border); background: var(--bg-main); font-weight: 700; cursor: pointer; text-align: left; transition: var(--transition-fast);" onclick="selectMatchCard(this, 'meaning', '${escapeQuotes(v.meaning)}', '${escapeQuotes(v.word)}')">👉 ${v.meaning}</button>`
      )
      .join("");

    let html = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div>
          <h3 style="color: var(--secondary); margin-bottom: 0.25rem;">🏆 BÀI KIỂM TRA ĐÓNG GÓI KIẾN THỨC TUẦN (NGÀY ${activeDay.day})</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Hoàn thành 2 phần kiểm tra dưới đây để đóng gói 100% từ vựng đã học!</p>
        </div>

        <!-- Part 1: Matching English Word to Meaning -->
        <div style="background: var(--bg-main); padding: 1.25rem; border-radius: 16px; border: 1px solid var(--border);">
          <h4 style="color: var(--primary-dark); margin-bottom: 0.8rem;">🧩 PHẦN 1: NỐI TỪ TIẾNG ANH VỚI NGHĨA TIẾNG VIỆT</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">Bấm 1 từ bên cột Tiếng Anh ➔ Bấm tiếp nghĩa Tiếng Việt tương ứng bên cột Phải để nối cặp từ đúng!</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="font-weight: 800; font-size: 0.85rem; color: var(--secondary);">TIẾNG ANH:</div>
              ${matchWordsHtml}
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="font-weight: 800; font-size: 0.85rem; color: var(--secondary);">NGHĨA TIẾNG VIỆT:</div>
              ${matchMeaningsHtml}
            </div>
          </div>
        </div>

        <!-- Part 2: Multiple Choice Sentence Test -->
        <div style="background: var(--bg-main); padding: 1.25rem; border-radius: 16px; border: 1px solid var(--border);">
          <h4 style="color: var(--primary-dark); margin-bottom: 0.8rem;">🔘 PHẦN 2: TRẮC NGHIỆM CHỌN CÂU Y TẾ ĐÚNG</h4>
          <div style="font-weight: 700; margin-bottom: 0.8rem;">Câu hỏi: Công việc chính của Điều dưỡng dụng cụ (Scrub Nurse) trong phòng mổ là gì?</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button class="quiz-check-btn" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); text-align: left;" onclick="this.style.background='#dcfce7'; this.style.borderColor='#22c55e'; speakText('I clean, inspect, and sterilize surgical instruments.')">A. "I clean, inspect, and sterilize surgical instruments." (Chính xác ✅)</button>
            <button class="quiz-check-btn" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); text-align: left;" onclick="this.style.background='#ffe4e6'; alert('❌ Chưa đúng! Chọn lại phương án A nhé.')">B. "I drive the ambulance to pick up emergency patients."</button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  } else if (currentTab === "quiz") {
    // ✏️ CLEAN IXL FILL-IN-THE-BLANK QUIZ
    let html = `<div>
      <h3 style="color: var(--secondary); margin-bottom: 0.5rem;">✏️ BÀI TẬP ĐIỀN TỪ KIỂM TRA TRÍ NHỚ (${activeDay.vocab.length} Từ - Ngày ${activeDay.day})</h3>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">Gõ từ tiếng Anh còn thiếu vào ô trống và bấm Kiểm Tra!</p>`;

    if (activeDay.quiz) {
      activeDay.quiz.forEach((q, idx) => {
        html += `
          <div class="quiz-question-card" style="margin-bottom: 1.2rem;">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary-dark);">CÂU ${idx + 1} / ${activeDay.quiz.length}</div>
            <div class="quiz-sentence">${q.sentence.replace("________", "<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>")}</div>
            <div class="quiz-input-group">
              <input type="text" id="modalQuizInput_${idx}" class="quiz-input" placeholder="Gõ từ còn thiếu..." onkeyup="if(event.key==='Enter') checkModalQuizAnswer(${idx}, '${escapeQuotes(q.answer)}')">
              <button class="quiz-check-btn" onclick="checkModalQuizAnswer(${idx}, '${escapeQuotes(q.answer)}')">Kiểm Tra</button>
            </div>
            <div id="modalQuizResult_${idx}" class="quiz-result-badge">
              <span id="modalQuizResultText_${idx}"></span>
              <button class="audio-btn" style="width:36px; height:36px; font-size:0.9rem;" onclick="speakText('${escapeQuotes(q.answer)}')">🔊 Nghe Đọc Từ</button>
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
    alert("Đã copy câu lệnh! Chị hãy nhắn trực tiếp cho AI nhé.");
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

// 💬 FLOATING FOUNDER POPUP WIDGET & NAVIGATION
function toggleFounderPopup() {
  const card = document.getElementById("founderPopupCard");
  if (card) {
    card.classList.toggle("show");
  }
}

// 🔄 SPACED REPETITION & DAILY REVIEW PACK LOGIC
let currentReviewStateFilter = "review";

function filterReviewByState(state) {
  currentReviewStateFilter = state;
  renderSpacedReviewCards();
}

function renderSpacedReviewCards() {
  const container = document.getElementById("reviewWordsContainer");
  if (!container) return;
  container.innerHTML = "";

  let vocabList = [];
  CURRICULUM_DATA.forEach((d) => {
    if (d.vocab) {
      d.vocab.forEach((v) => {
        const isMastered = !!masteredVocabState[v.word];
        const isLearned = !!progressState[d.day];
        
        let wordState = "new";
        if (isMastered) wordState = "mastered";
        else if (isLearned) wordState = "review";
        
        if (currentReviewStateFilter === "all" || wordState === currentReviewStateFilter) {
          vocabList.push({ ...v, day: d.day, state: wordState });
        }
      });
    }
  });

  if (vocabList.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2.5rem; color: var(--text-muted);">
      Không có từ vựng thuộc trạng thái này. Chúc mừng chị Huyền!
    </div>`;
    return;
  }

  vocabList.forEach((v) => {
    const card = document.createElement("div");
    card.style.cssText = "background: var(--bg-main); padding: 1.3rem; border-radius: 20px; border: 1px solid var(--border); box-shadow: var(--shadow-sm);";

    let stateBadge = `<span style="font-size: 0.75rem; background: #fef3c7; color: #d97706; padding: 3px 10px; border-radius: 12px; font-weight: 800;">🟡 Cần Ôn Lại</span>`;
    if (v.state === "mastered") stateBadge = `<span style="font-size: 0.75rem; background: #d1fae5; color: #047857; padding: 3px 10px; border-radius: 12px; font-weight: 800;">🟢 Đã Thuộc Lòng</span>`;
    else if (v.state === "difficult") stateBadge = `<span style="font-size: 0.75rem; background: #ffe4e6; color: #e11d48; padding: 3px 10px; border-radius: 12px; font-weight: 800;">🔴 Từ Khó</span>`;
    else if (v.state === "new") stateBadge = `<span style="font-size: 0.75rem; background: var(--bg-card); color: var(--text-muted); padding: 3px 10px; border-radius: 12px; font-weight: 700; border: 1px solid var(--border);">⚪ Chưa Học</span>`;

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
        <div style="font-weight: 900; font-size: 1.2rem; color: var(--primary-dark);">${v.word}</div>
        <button class="audio-btn" style="width:34px; height:34px; font-size:0.85rem;" onclick="speakText('${escapeQuotes(v.word)}')">🔊</button>
      </div>
      <div style="font-size: 0.88rem; color: var(--text-muted); font-family: monospace; margin-bottom: 6px;">${v.ipa}</div>
      <div style="font-weight: 700; color: var(--secondary); margin-bottom: 10px;">${v.meaning}</div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
        <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">Ngày ${v.day}</span>
        ${stateBadge}
      </div>
    `;

    container.appendChild(card);
  });
}

function startSpacedReviewSession(mode) {
  if (mode === "quick") {
    alert("⚡ QUICK REVIEW SESSION (5 PHÚT):\n\nBắt đầu gói 5 phút: 5 từ cũ + 2 câu phản xạ nghe/nói!");
    switchMainModule("vocab");
  } else {
    alert("🎯 FULL PRACTICE SESSION (15 PHÚT):\n\nBắt đầu gói 15 phút: 5 từ cũ + 3 câu nghe + 3 câu điền từ + 2 câu ghi âm!");
    switchMainModule("practice");
  }
}


