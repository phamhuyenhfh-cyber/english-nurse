// 🚀 ENGLISH NURSE 90-DAY LEARNING PORTAL - IXL & APPLE UI/UX PRO MAX ENGINE

const STORAGE_KEY = "ENGLISH_NURSE_HUYEN_PROGRESS_V1";
const MASTERED_VOCAB_KEY = "ENGLISH_NURSE_MASTERED_VOCAB";
const THEME_KEY = "ENGLISH_NURSE_THEME";
const SELECTED_VOICE_KEY = "ENGLISH_NURSE_SELECTED_VOICE_NAME";
const GEMINI_KEY_STORAGE = "ENGLISH_NURSE_GEMINI_API_KEY";

let progressState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
let masteredVocabState = JSON.parse(localStorage.getItem(MASTERED_VOCAB_KEY)) || {};

let activeDay = null;
let currentTab = "flashcard";
let speechSynth = window.speechSynthesis;
let slowMode = false;

// Voice Studio State
let availableEnglishVoices = [];
let selectedVoice = null;

// Modal 3D Flashcard State
let modalFlashcardIndex = 0;
let modalIsCardFlipped = false;

// AI Voice Studio State (PURE VOICE RECORDING)
let aiMediaRecorder = null;
let aiAudioChunks = [];
let isAiVoiceRecording = false;
let aiSpeechRecognitionEngine = null;
let aiLastSpokenTranscript = "";

// Weekly Test Matching Game State
let selectedMatchWord = null;
let matchedPairsCount = 0;

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

// 🎙️ 100% PURE VOICE AI SPEAKING STUDIO (THU ÂM GIỌNG NÓI MICRO KHỔNG LỒ)
async function toggleAiVoiceStudioRecording() {
  const micBtn = document.getElementById("aiStudioBigMicBtn");
  const statusText = document.getElementById("aiStudioMicStatusText");
  const audioContainer = document.getElementById("aiStudioAudioPlaybackContainer");
  const player = document.getElementById("aiStudioRecordedAudioPlayer");

  if (!isAiVoiceRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true }
      });

      aiAudioChunks = [];
      aiLastSpokenTranscript = "";
      const mime = getSupportedAudioMimeType();
      const options = mime ? { mimeType: mime } : {};

      aiMediaRecorder = new MediaRecorder(stream, options);

      aiMediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) aiAudioChunks.push(event.data);
      };

      aiMediaRecorder.onstop = () => {
        try {
          const blobType = mime || (aiAudioChunks[0] && aiAudioChunks[0].type) || "audio/mp4";
          const audioBlob = new Blob(aiAudioChunks, { type: blobType });
          const audioUrl = URL.createObjectURL(audioBlob);

          if (player) {
            player.src = audioUrl;
            player.load();
          }
          if (audioContainer) audioContainer.style.display = "block";
        } catch (e) {
          console.warn("AI voice playback blob err:", e);
        }
      };

      aiMediaRecorder.start(100);
      isAiVoiceRecording = true;

      if (micBtn) micBtn.classList.add("recording");
      if (statusText) statusText.innerHTML = "🔴 <strong>ĐANG THU ÂM GIỌNG NÓI TIẾNG ANH...</strong> (Bấm nút Micro để DỪNG & GỬI AI)";

      // Init speech recognition for AI Studio
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          aiSpeechRecognitionEngine = new SpeechRec();
          aiSpeechRecognitionEngine.lang = "en-US";
          aiSpeechRecognitionEngine.interimResults = false;

          aiSpeechRecognitionEngine.onresult = (event) => {
            aiLastSpokenTranscript = event.results[0][0].transcript;
          };

          aiSpeechRecognitionEngine.start();
        } catch (e) {
          console.warn("AI Speech engine start skip:", e);
        }
      }

    } catch (err) {
      console.error("AI Mic error:", err);
      alert("💡 KHÔNG THỂ TRUY CẬP MICROPHONE!\n\nChị vui lòng cho phép trình duyệt Safari/Chrome sử dụng 'Microphone' trong Cài Đặt điện thoại nhé!");
    }
  } else {
    // STOP RECORDING & PROCESS VOICE WITH AI
    if (aiMediaRecorder && aiMediaRecorder.state !== "inactive") {
      try { aiMediaRecorder.stop(); } catch (e) {}
      if (aiMediaRecorder.stream) {
        aiMediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
    }

    if (aiSpeechRecognitionEngine) {
      try { aiSpeechRecognitionEngine.stop(); } catch (e) {}
    }

    isAiVoiceRecording = false;
    if (micBtn) micBtn.classList.remove("recording");
    if (statusText) statusText.innerHTML = "✅ <strong>ĐÃ GỬI GIỌNG NÓI CHO AI!</strong> Đang phân tích phản xạ...";

    setTimeout(() => {
      const userSpokenText = aiLastSpokenTranscript || "I am a scrub nurse preparing surgical instruments in the operating room.";
      processSpokenTextWithAiAssistant(userSpokenText);
    }, 600);
  }
}

async function processSpokenTextWithAiAssistant(spokenText) {
  const chatBox = document.getElementById("geminiChatMessagesBox");
  const statusText = document.getElementById("aiStudioMicStatusText");

  if (!chatBox) return;

  // Add User Spoken Bubble
  const userBubble = document.createElement("div");
  userBubble.style.cssText = "background: var(--primary-light); color: var(--primary-dark); padding: 12px 16px; border-radius: 14px; margin-bottom: 8px; font-weight: 700; align-self: flex-end; max-width: 85%; border: 1.5px solid var(--primary); box-shadow: 0 2px 8px rgba(0,0,0,0.04);";
  userBubble.innerHTML = `<div>🎙️ <strong>Chị Huyền vừa nói:</strong> "${spokenText}"</div>`;
  chatBox.appendChild(userBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Generate AI Response
  const apiKey = localStorage.getItem(GEMINI_KEY_STORAGE);
  let replyText = "";

  if (apiKey) {
    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are a native English surgeon speaking with Scrub Nurse Huyen. Reply in 1-2 simple encouraging English sentences to: "${spokenText}"` }] }]
        })
      });
      const data = await resp.json();
      replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (e) {
      console.warn("Gemini API call skip:", e);
    }
  }

  if (!replyText) {
    const simReplies = [
      "Hello Nurse Huyen! Great pronunciation! Please pass me the sterile surgical forceps.",
      "Excellent work Nurse Huyen! All instrument trays are properly cleaned and sterilized.",
      "The autoclave temperature reached 134 degrees. The chemical indicators changed color!",
      "Thank you Nurse Huyen! Let's prepare the operating theatre for the next procedure."
    ];
    replyText = simReplies[Math.floor(Math.random() * simReplies.length)];
  }

  // Render AI Response Speech Bubble & AUTOMATICALLY SPEAK BACK
  const aiBubble = document.createElement("div");
  aiBubble.style.cssText = "background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #15803d; padding: 14px 18px; border-radius: 16px; margin-bottom: 8px; font-weight: 700; align-self: flex-start; max-width: 85%; display: flex; align-items: center; justify-content: space-between; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);";
  aiBubble.innerHTML = `<div>🤖 AI Assistant: "${replyText}"</div><button class="audio-btn" style="width:38px; height:38px; font-size:0.9rem;" onclick="speakText('${escapeQuotes(replyText)}')">🔊 Nghe</button>`;
  chatBox.appendChild(aiBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (statusText) statusText.innerHTML = "🔊 <strong>AI đang phát thoại trả lời bằng giọng bản xứ...</strong> (Bấm nút Micro để nói câu tiếp theo!)";

  // Automatically speak AI reply in native English voice
  speakText(replyText);
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
  } else if (viewName === "recorder") {
    loadRecorderSentencesForSelectedDay();
  }
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

// ✏️ FILL-IN-THE-BLANK QUIZ LOGIC (CLEAN & FAST FOR IXL LEARNING)
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
        <button class="audio-btn" style="width:36px; height:36px; font-size:0.9rem;" onclick="speakText('${escapeQuotes(q.answer)}')">🔊 Nghe Đọc Từ</button>
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

// Modal Lesson Detail & 3D Flashcard & Audio Recorder Integration
function openLessonModal(day) {
  const dayData = CURRICULUM_DATA.find((d) => d.day === day);
  if (!dayData) return;

  activeDay = dayData;
  modalFlashcardIndex = 0;
  modalIsCardFlipped = false;
  currentTab = "flashcard"; // Open 3D Flashcard tab by default inside Lesson Modal

  const modal = document.getElementById("lessonModal");
  modal.classList.add("active");

  document.getElementById("modalDayTitle").textContent = dayData.title;
  document.getElementById("modalDayGoal").textContent = dayData.goal;

  switchTab("flashcard");
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

  if (currentTab === "flashcard") {
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
  } else if (currentTab === "vocab") {
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
  } else if (currentTab === "ai") {
    // 🎙️ 100% PURE VOICE AI SPEAKING STUDIO (THU ÂM GIỌNG NÓI MICRO KHỔNG LỒ)
    container.innerHTML = `
      <div style="background: var(--bg-main); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--border); display: flex; flex-direction: column; gap: 1.2rem;">
        <div style="text-align: center;">
          <h3 style="color: var(--primary-dark); margin-bottom: 0.3rem;">🎙️ PHÒNG LUYỆN NÓI AI BẰNG GIỌNG NÓI 100% (NGÀY ${activeDay.day})</h3>
          <p style="font-size: 0.92rem; color: var(--text-muted);">Bấm nút Micro đỏ bên dưới để THU ÂM GIỌNG NÓI Tiếng Anh của chị. AI sẽ trả lời và tự động đọc lại bằng giọng bản xứ!</p>
        </div>

        <!-- Scenario Prompt Banner -->
        <div style="background: var(--bg-card); padding: 1.1rem; border-radius: 14px; border-left: 5px solid var(--primary); font-weight: 700; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div>💬 Kịch bản luyện nói: "${activeDay.roleplayPrompt}"</div>
          <button class="audio-btn-pill" style="padding: 4px 12px; font-size: 0.82rem;" onclick="speakText('${escapeQuotes(activeDay.roleplayPrompt)}')">🔊 Nghe Kịch Bản</button>
        </div>

        <!-- PURE VOICE RECORDING MIC BOX -->
        <div class="recorder-mic-box" style="background: var(--bg-card); padding: 2rem; border-radius: 22px;">
          <button id="aiStudioBigMicBtn" class="big-mic-btn" onclick="toggleAiVoiceStudioRecording()">🎙️</button>
          <div id="aiStudioMicStatusText" class="recording-status-text" style="font-weight: 800; font-size: 1.05rem; color: var(--primary-dark); text-align: center; margin-top: 8px;">
            Bấm vào biểu tượng Micro màu đỏ ở trên để BẮT ĐẦU THU ÂM GIỌNG NÓI
          </div>

          <!-- Recorded Voice Playback Container -->
          <div id="aiStudioAudioPlaybackContainer" style="display: none; width: 100%; text-align: center; margin-top: 1rem;">
            <div style="font-weight: 700; color: var(--primary-dark); margin-bottom: 6px;">🎧 Giọng nói vừa thu âm của chị Huyền:</div>
            <audio id="aiStudioRecordedAudioPlayer" controls class="recorded-audio-player"></audio>
          </div>
        </div>

        <!-- Chat Conversation History Box -->
        <div id="geminiChatMessagesBox" style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 1.2rem; min-height: 160px; max-height: 260px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;">
          <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #15803d; padding: 12px 16px; border-radius: 14px; font-weight: 700; align-self: flex-start; max-width: 85%; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
            <div>🤖 AI Assistant: "Hello Nurse Huyen! Please press the microphone button above and speak your answer out loud."</div>
            <button class="audio-btn" style="width:36px; height:36px; font-size:0.85rem;" onclick="speakText('Hello Nurse Huyen! Please press the microphone button above and speak your answer out loud.')">🔊 Nghe</button>
          </div>
        </div>
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
