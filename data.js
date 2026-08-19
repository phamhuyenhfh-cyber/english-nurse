// 📚 DỮ LIỆU LỘ TRÌNH HỌC TIẾNG ANH ĐIỀU DƯỠNG & CSSD 90 NGÀY
// Giáo trình: Oxford English for Careers - Nursing 1

const UNITS_DATA = [
  { id: 1, title: "Unit 1: The Hospital Team", topic: "Đội ngũ Y tế & Giới thiệu Công việc", icon: "🩺", page: "p. 4" },
  { id: 2, title: "Unit 2: In and Around the Hospital", topic: "Khoa Phòng Bệnh viện & Vị trí CSSD", icon: "🏥", page: "p. 10" },
  { id: 3, title: "Unit 3: Hospital Admissions", topic: "Tiếp nhận Bệnh nhân & Kiểm tra Hồ sơ/Dụng cụ", icon: "📋", page: "p. 16" },
  { id: 4, title: "Unit 4: Accidents and Emergencies", topic: "Mệnh lệnh Cấp cứu & Tình huống Khẩn cấp", icon: "🚨", page: "p. 22" },
  { id: 5, title: "Unit 5: Pain", topic: "Đánh giá & Xử trí Cơn đau Bệnh nhân", icon: "💊", page: "p. 28" },
  { id: 6, title: "Unit 6: Symptoms", topic: "Triệu chứng Lâm sàng & Đặt câu hỏi Thăm khám", icon: "🔍", page: "p. 34" },
  { id: 7, title: "Unit 7: Caring for the Elderly", topic: "Chăm sóc Người cao tuổi & Giao tiếp Ân cần", icon: "👵", page: "p. 40" },
  { id: 8, title: "Unit 8: Nutrition and Obesity", topic: "Dinh dưỡng & Chỉ định Nhịn ăn Pre-op (NPO)", icon: "🥗", page: "p. 46" },
  { id: 9, title: "Unit 9: Blood", topic: "Xét nghiệm Máu & Truyền máu Phòng mổ", icon: "🩸", page: "p. 68" },
  { id: 10, title: "Unit 10: Death and Dying", topic: "Chăm sóc Cuối đời & Giao tiếp Đồng cảm", icon: "🕊️", page: "p. 74" },
  { id: 11, title: "Unit 11: Hygiene & Sterilization", topic: "Vô trùng Phòng mổ & Tiệt trùng CSSD (Trọng tâm)", icon: "🧼", page: "p. 80" },
  { id: 12, title: "Unit 12: Mental Health Nursing", topic: "Giải tỏa Tâm lý Bệnh nhân Trước phẫu thuật", icon: "🧠", page: "p. 86" },
  { id: 13, title: "Unit 13: Monitoring the Patient", topic: "Chỉ số Sinh tồn & Thiết bị Theo dõi Phòng mổ", icon: "📊", page: "p. 92" },
  { id: 14, title: "Unit 14: Medication", topic: "Thuốc Phẫu thuật, Thuốc tiêm & Liều lượng", icon: "💉", page: "p. 98" },
  { id: 15, title: "Unit 15: Alternative Treatments & Wrap-up", topic: "Phục hồi Chức năng & Tổng kết 90 Ngày", icon: "🎓", page: "p. 104" }
];

const CURRICULUM_DATA = [
  // UNIT 1: Days 1 - 5
  {
    day: 1,
    unitId: 1,
    title: "Ngày 1: Phát âm Chức danh Y tế & Giới thiệu Bản thân",
    goal: "Nắm vững phát âm IPA âm /3:/, /ə/ và tự tin phát âm các chức danh y tế.",
    vocab: [
      { word: "Scrub nurse", ipa: "/skrʌb nɜːs/", meaning: "Điều dưỡng dụng cụ phòng mổ", example: "I am a scrub nurse in the operating theatre." },
      { word: "Surgeon", ipa: "/ˈsɜː.dʒən/", meaning: "Bác sĩ phẫu thuật", example: "The surgeon is performing the operation." },
      { word: "Radiographer", ipa: "/ˌreɪ.diˈɒɡ.rə.fər/", meaning: "Kỹ thuật viên X-quang", example: "The radiographer took an X-ray." },
      { word: "Head nurse", ipa: "/hed nɜːs/", meaning: "Điều dưỡng trưởng", example: "The head nurse manages the surgical ward." },
      { word: "Paramedic", ipa: "/ˌpær.əˈmed.ɪk/", meaning: "Nhân viên cấp cứu ngoại viện", example: "The paramedic arrived quickly." }
    ],
    grammar: {
      topic: "Thì Hiện tại đơn (Present Simple) trong mô tả công việc",
      explanation: "Dùng để diễn tả nhiệm vụ hàng ngày, thói quen và sự thật tại bệnh viện.",
      examples: [
        "I clean and sterilize surgical instruments every day.",
        "She works in the CSSD department."
      ]
    },
    shadowing: [
      { speaker: "Nurse Huyen", sentence: "Hello, my name is Huyen. I am a nurse working in the CSSD department.", translation: "Xin chào, tôi tên là Huyền. Tôi là điều dưỡng làm việc tại khoa CSSD." },
      { speaker: "Senior Nurse", sentence: "Nice to meet you, Huyen. What are your main duties?", translation: "Rất vui được gặp Huyền. Nhiệm vụ chính của em là gì?" },
      { speaker: "Nurse Huyen", sentence: "I inspect, wrap, and sterilize surgical tool sets for the operating rooms.", translation: "Em kiểm tra, đóng gói và tiệt trùng các bộ dụng cụ phẫu thuật cho phòng mổ." }
    ],
    cssdSelfTalk: [
      { action: "Chuẩn bị bắt đầu ca làm việc tại CSSD", englishText: "I am starting my shift at CSSD today. Let's check the sterilization schedule.", translation: "Tôi bắt đầu ca trực tại CSSD hôm nay. Hãy kiểm tra lịch tiệt trùng." }
    ],
    roleplayPrompt: "Hãy đóng vai Bác sĩ Phẫu thuật chào hỏi và hỏi chị Huyền về công việc đóng gói tiệt trùng dụng cụ mổ hôm nay tại CSSD."
  },

  {
    day: 2,
    unitId: 1,
    title: "Ngày 2: Phân biệt Hiện tại đơn & Hiện tại tiếp diễn trong Phòng mổ",
    goal: "Luyện phát âm câu diễn tả hành động đang diễn ra tại ca trực.",
    vocab: [
      { word: "Operating theatre", ipa: "/ˈɒp.ər.eɪ.tɪŋ ˈθɪə.tər/", meaning: "Phòng mổ / Phòng phẫu thuật", example: "The operating theatre is ready for surgery." },
      { word: "Sterile field", ipa: "/ˈster.aɪl fiːld/", meaning: "Vùng vô trùng", example: "Do not touch the sterile field." },
      { word: "Midwife", ipa: "/ˈmɪd.waɪf/", meaning: "Nữ hộ sinh", example: "The midwife assisted the delivery." },
      { word: "Ward nurse", ipa: "/wɔːd nɜːs/", meaning: "Điều dưỡng khoa bệnh", example: "The ward nurse checks vital signs." }
    ],
    grammar: {
      topic: "Present Simple vs Present Continuous",
      explanation: "Hiện tại đơn (nhiệm vụ cố định) vs Hiện tại tiếp diễn (hành động đang làm ngay bây giờ).",
      examples: [
        "I usually work in CSSD, but right now I am delivering sterile trays to OR 3.",
        "The surgeon is scrubbing up at the moment."
      ]
    },
    shadowing: [
      { speaker: "Surgeon", sentence: "Huyen, are the laparoscopy instruments ready?", translation: "Huyền ơi, bộ dụng cụ nội soi đã sẵn sàng chưa?" },
      { speaker: "Nurse Huyen", sentence: "Yes Doctor, I am bringing the sterile tray right now.", translation: "Dạ thưa Bác sĩ, em đang mang khay vô trùng tới ngay đây ạ." }
    ],
    cssdSelfTalk: [
      { action: "Giao khay dụng cụ cho phòng mổ", englishText: "I am delivering the sterile surgical trays to Theatre Number 2.", translation: "Tôi đang giao các khay dụng cụ tiệt trùng đến Phòng mổ số 2." }
    ],
    roleplayPrompt: "Đóng vai Bác sĩ gây mê hỏi chị Huyền đang chuẩn bị dụng cụ gì cho ca mổ ruột thừa tiếp theo."
  },

  {
    day: 4,
    unitId: 1,
    title: "Ngày 4: CSSD Self-Talk - Thuyết minh Quy trình rửa dụng cụ mổ",
    goal: "Tự tin nói tiếng Anh khi đang ngâm rửa và xử lý dụng cụ tại CSSD.",
    vocab: [
      { word: "Decontamination", ipa: "/ˌdiː.kən.tæm.ɪˈneɪ.ʃən/", meaning: "Khử khuẩn / Làm sạch ban đầu", example: "Instruments go through decontamination first." },
      { word: "Enzymatic cleaner", ipa: "/ˌen.zaɪˈmæt.ɪk ˈkliː.nər/", meaning: "Dung dịch tẩy rửa enzyme", example: "Soak the instruments in enzymatic cleaner." },
      { word: "Ultrasonic washer", ipa: "/ˌʌl.trəˈsɒn.ɪk ˈwɒʃ.ər/", meaning: "Máy rửa siêu âm", example: "Put the delicate tools into the ultrasonic washer." }
    ],
    grammar: {
      topic: "Các bước theo thứ tự (Sequence Words)",
      explanation: "Dùng First, Next, Then, After that, Finally để trình bày quy trình.",
      examples: [
        "First, I soak the tools. Next, I scrub them thoroughly. Finally, I rinse with purified water."
      ]
    },
    shadowing: [
      { speaker: "Nurse Huyen", sentence: "First, I rinse the bloody tools. Next, I soak them in enzymatic cleaner.", translation: "Đầu tiên, tôi xịt rửa dụng cụ dính máu. Tiếp theo, tôi ngâm vào dung dịch tẩy rửa enzyme." }
    ],
    cssdSelfTalk: [
      { action: "Rửa dụng cụ bằng dung dịch enzyme", englishText: "I am soaking the surgical tools in enzymatic cleaner for 15 minutes.", translation: "Tôi đang ngâm các dụng cụ phẫu thuật trong dung dịch enzyme 15 phút." }
    ],
    roleplayPrompt: "Hãy giải thích quy trình rửa dụng cụ dính máu tại CSSD bằng Tiếng Anh cho một học viên mới."
  },

  {
    day: 61,
    unitId: 11,
    title: "Ngày 61: Từ vựng Cốt lõi Tiệt trùng & Hấp sấy CSSD (Trọng tâm)",
    goal: "Phát âm chuẩn xác 5 từ vựng tiệt trùng then chốt nhất của CSSD.",
    vocab: [
      { word: "Autoclave", ipa: "/ˈɔː.tə.kleɪv/", meaning: "Lò hấp tiệt trùng bằng hơi nước", example: "Load the wrapped packages into the autoclave." },
      { word: "Sterilization", ipa: "/ˌster.əl.aɪˈzeɪ.ʃən/", meaning: "Quy trình tiệt trùng diệt khuẩn toàn bộ", example: "Steam sterilization takes 30 minutes at 134 degrees Celsius." },
      { word: "Biological indicator", ipa: "/ˌbaɪ.əˈlɒdʒ.ɪ.kəl ˈɪn.dɪ.keɪ.tər/", meaning: "Chỉ thị sinh học kiểm tra lò hấp", example: "Check the biological indicator test daily." },
      { word: "Chemical indicator", ipa: "/ˈkem.ɪ.kəl ˈɪn.dɪ.keɪ.tər/", meaning: "Que chỉ thị hóa học đổi màu", example: "The chemical indicator turned black, showing it is sterile." },
      { word: "Expiry date", ipa: "/ɪkˈspaɪə.ri deɪt/", meaning: "Hạn sử dụng tiệt trùng", example: "Check the expiry date on the sterile pouch." }
    ],
    grammar: {
      topic: "Mẫu câu quy chuẩn bắt buộc (Must & Have to)",
      explanation: "Dùng must / must not để khẳng định nguyên tắc vô trùng tuyệt đối.",
      examples: [
        "You must check the chemical indicator before opening the set.",
        "You must not use an expired sterile pack."
      ]
    },
    shadowing: [
      { speaker: "Nurse Huyen", sentence: "The chemical indicator changed color. This tray is completely sterile.", translation: "Que chỉ thị hóa học đã đổi màu. Khay này đã hoàn toàn vô trùng." },
      { speaker: "Surgeon", sentence: "Great work, Huyen! Please check the expiry date as well.", translation: "Tốt lắm Huyền! Em kiểm tra luôn hạn sử dụng giúp bác sĩ nhé." }
    ],
    cssdSelfTalk: [
      { action: "Xác nhận khay hấp lò Autoclave", englishText: "The autoclave cycle is complete. Temperature reached 134 degrees. The chemical strip is black.", translation: "Chu trình lò hấp đã hoàn tất. Nhiệt độ đạt 134 độ C. Que chỉ thị đã chuyển màu đen." }
    ],
    roleplayPrompt: "Đóng vai Báo cáo với Trưởng khoa CSSD về kết quả kiểm tra chỉ thị sinh học của lò hấp Autoclave hôm nay."
  }
];

// Hàm tự động khởi tạo dữ liệu cho tất cả 90 ngày & ĐẢM BẢO MỖI TỪ VỰNG 100% CÓ 1 CÂU HỎI ĐIỀN TỪ (KHÔNG GỢI Ý)
(function fillMissingDaysAndGenerateQuizzes() {
  const existingDays = new Set(CURRICULUM_DATA.map(d => d.day));
  for (let i = 1; i <= 90; i++) {
    if (!existingDays.has(i)) {
      let uId = Math.ceil(i / 6);
      if (uId > 15) uId = 15;
      let unit = UNITS_DATA.find(u => u.id === uId) || UNITS_DATA[0];
      
      CURRICULUM_DATA.push({
        day: i,
        unitId: uId,
        title: `Ngày ${i}: Luyện Phát âm & Phản xạ Nói - ${unit.title}`,
        goal: `Luyện tập phát âm IPA, từ vựng và câu hội thoại thực hành ngày ${i}.`,
        vocab: [
          { word: "Sterile technique", ipa: "/ˈster.aɪl tekˈniːk/", meaning: "Kỹ thuật vô trùng phòng mổ", example: "Always maintain sterile technique." },
          { word: "Forceps", ipa: "/ˈfɔː.seps/", meaning: "Kẹp phẫu thuật / Panh", example: "Pass me the tissue forceps." },
          { word: "Scalpel", ipa: "/ˈskæl.pəl/", meaning: "Dao phẫu thuật", example: "The surgeon requested a size 10 scalpel." },
          { word: "Disinfectant", ipa: "/ˌdɪs.ɪnˈfek.tənt/", meaning: "Dung dịch khử trùng", example: "Clean the surface with disinfectant." }
        ],
        grammar: {
          topic: `Ứng dụng Ngữ pháp ${unit.title}`,
          explanation: "Mẫu câu giao tiếp thông dụng trong ca trực.",
          examples: ["Ensure all tools are checked before surgery."]
        },
        shadowing: [
          { speaker: "Nurse Huyen", sentence: `Today is Day ${i}. I am practicing my medical English pronunciation.`, translation: `Hôm nay là Ngày ${i}. Em đang luyện phát âm tiếng Anh y khoa.` }
        ],
        cssdSelfTalk: [
          { action: `Thực hành ngày ${i} tại CSSD`, englishText: `Inspecting instrument sets for Day ${i} operations.`, translation: `Kiểm tra các bộ dụng cụ cho các ca mổ Ngày ${i}.` }
        ],
        roleplayPrompt: `Luyện tập đoạn hội thoại ngắn ngày ${i} với chủ đề ${unit.topic}.`
      });
    }
  }

  // Khởi tạo Quiz 100% Khớp với danh sách Vocab của từng ngày (Không có hint)
  CURRICULUM_DATA.forEach((d) => {
    d.quiz = d.vocab.map((v) => {
      // Thay thế từ vựng trong câu ví dụ bằng ô trống, hoặc dùng mẫu câu chuẩn
      let sentence = "";
      if (v.example && v.example.toLowerCase().includes(v.word.toLowerCase())) {
        const regex = new RegExp(v.word, "gi");
        sentence = v.example.replace(regex, "________") + ` (${v.meaning})`;
      } else {
        sentence = `________ (${v.meaning})`;
      }
      return {
        sentence: sentence,
        answer: v.word.toLowerCase(),
        meaning: v.meaning
      };
    });
  });

  CURRICULUM_DATA.sort((a, b) => a.day - b.day);
})();

// 🏥 KHO TÌNH HUỐNG NGHỀ NGHIỆP ĐIỀU DƯỠNG (16 CHỦ ĐỀ CHUYÊN SÂU LÂM SÀNG)
const CLINICAL_SCENARIOS_DATA = [
  {
    id: "greeting",
    title: "1. Greeting Patients (Chào hỏi Bệnh nhân)",
    icon: "👋",
    sentences: [
      { english: "Hello, good morning! How are you feeling today?", vietnamese: "Xin chào, chúc một buổi sáng tốt lành! Hôm nay bác cảm thấy thế nào ạ?" },
      { english: "Welcome to the surgical ward.", vietnamese: "Chào mừng bác đến với khoa phẫu thuật." }
    ],
    dialogues: {
      nursePatient: [
        { speaker: "Nurse Huyen", english: "Good morning! I am Nurse Huyen. How are you feeling today?", vietnamese: "Chào bác! Cháu là điều dưỡng Huyền. Hôm nay bác cảm thấy thế nào ạ?" },
        { speaker: "Patient", english: "Good morning Nurse. I am feeling much better, thank you.", vietnamese: "Chào cô điều dưỡng. Tôi cảm thấy tốt hơn nhiều rồi, cảm ơn cô." }
      ],
      nurseDoctor: [
        { speaker: "Nurse Huyen", english: "Good morning Doctor. Patient David has been greeted and prepped for the morning round.", vietnamese: "Chào Bác sĩ. Bệnh nhân David đã được chào hỏi và chuẩn bị xong cho ca đi buồng sáng." },
        { speaker: "Doctor", english: "Great work, Nurse Huyen. Let me check his recovery status.", vietnamese: "Tốt lắm điều dưỡng Huyền. Để tôi kiểm tra tình trạng phục hồi của bệnh nhân." }
      ],
      nurseColleague: [
        { speaker: "Nurse Huyen", english: "Hi Lan, I just greeted the new patient in Room 402.", vietnamese: "Chào Lan, mình vừa chào hỏi bệnh nhân mới ở Phòng 402." },
        { speaker: "Nurse Lan", english: "Thanks Huyen, I will update his admission file right now.", vietnamese: "Cảm ơn Huyền, mình sẽ cập nhật hồ sơ nhập viện của bệnh nhân ngay." }
      ]
    }
  },
  {
    id: "introducing",
    title: "2. Introducing Yourself (Giới thiệu Bản thân)",
    icon: "🪪",
    sentences: [
      { english: "Hello, my name is Huyen. I will be your nurse today.", vietnamese: "Xin chào, tôi tên là Huyền. Tôi sẽ là điều dưỡng chăm sóc cho bác hôm nay." },
      { english: "I am a scrub nurse working in the Operating Room and CSSD.", vietnamese: "Tôi là điều dưỡng dụng cụ làm việc tại Phòng Mổ và Khoa Tiệt trùng CSSD." }
    ],
    dialogues: {
      nursePatient: [
        { speaker: "Nurse Huyen", english: "Hello! My name is Huyen. I am your duty nurse for this morning shift.", vietnamese: "Xin chào! Cháu tên là Huyền. Cháu là điều dưỡng trực ca sáng hôm nay của bác." },
        { speaker: "Patient", english: "Nice to meet you, Nurse Huyen. Thank you for looking after me.", vietnamese: "Rất vui được gặp cô, điều dưỡng Huyền. Cảm ơn cô đã chăm sóc tôi." }
      ],
      nurseDoctor: [
        { speaker: "Nurse Huyen", english: "Hello Dr. Smith, I am Huyen, the scrub nurse for today's appendectomy operation.", vietnamese: "Chào Bác sĩ Smith, em là Huyền, điều dưỡng dụng cụ cho ca mổ ruột thừa hôm nay." },
        { speaker: "Doctor", english: "Nice to meet you, Huyen. Please make sure the sterile laparoscopy set is ready.", vietnamese: "Rất vui được gặp em, Huyền. Hãy đảm bảo bộ dụng cụ nội soi vô trùng đã sẵn sàng nhé." }
      ],
      nurseColleague: [
        { speaker: "Nurse Huyen", english: "Hello team, I am Nurse Huyen from the CSSD sterilization unit.", vietnamese: "Xin chào cả team, em là Điều dưỡng Huyền đến từ đơn vị tiệt trùng CSSD." },
        { speaker: "Colleague", english: "Welcome Huyen! Glad to have you in the surgical team.", vietnamese: "Chào mừng Huyền! Rất vui được hợp tác cùng em trong đội ngũ phẫu thuật." }
      ]
    }
  },
  {
    id: "vitals",
    title: "3. Taking Vital Signs (Đo Chỉ Số Sinh Tồn)",
    icon: "🩺",
    sentences: [
      { english: "I am going to check your blood pressure.", vietnamese: "Tôi sẽ kiểm tra huyết áp cho bác." },
      { english: "Let me check your temperature.", vietnamese: "Để tôi đo nhiệt độ cho bác nhé." },
      { english: "Please take a deep breath.", vietnamese: "Xin bác hãy hít một hơi thật sâu." }
    ],
    dialogues: {
      nursePatient: [
        { speaker: "Nurse Huyen", english: "I am going to check your blood pressure and pulse now. Please roll up your sleeve.", vietnamese: "Bây giờ cháu sẽ đo huyết áp và bắt mạch cho bác. Bác vui lòng xắn tay áo lên nhé." },
        { speaker: "Patient", english: "Sure Nurse. Is my blood pressure normal?", vietnamese: "Được chứ cô. Huyết áp của tôi có bình thường không?" },
        { speaker: "Nurse Huyen", english: "Your blood pressure is 120 over 80. Perfectly normal!", vietnamese: "Huyết áp của bác là 120 trên 80. Hoàn toàn bình thường ạ!" }
      ],
      nurseDoctor: [
        { speaker: "Nurse Huyen", english: "Doctor, I just checked Mr. John's vitals. Blood pressure is 130/85, pulse 76, temperature 36.8°C.", vietnamese: "Bác sĩ ơi, em vừa kiểm tra chỉ số sinh tồn cho ông John. Huyết áp 130/85, mạch 76, nhiệt độ 36.8°C." },
        { speaker: "Doctor", english: "Excellent, all vitals are stable. He is ready for pre-op clearance.", vietnamese: "Tuyệt vời, tất cả chỉ số đều ổn định. Bệnh nhân đủ điều kiện thông qua trước phẫu thuật." }
      ],
      nurseColleague: [
        { speaker: "Nurse Huyen", english: "Lan, could you help me record the vital signs for Room 301?", vietnamese: "Lan ơi, cậu giúp mình ghi lại các chỉ số sinh tồn cho Phòng 301 được không?" },
        { speaker: "Nurse Lan", english: "Sure Huyen! Read out the numbers and I will type them into the EHR system.", vietnamese: "Được chứ Huyền! Cậu cứ đọc số đi, mình gõ vào hệ thống bệnh án điện tử EHR cho." }
      ]
    }
  },
  {
    id: "pain",
    title: "4. Asking About Pain (Hỏi Độ Đau Bệnh Nhân)",
    icon: "💊",
    sentences: [
      { english: "Are you feeling any pain?", vietnamese: "Bác có cảm thấy đau ở đâu không?" },
      { english: "On a scale from 1 to 10, how severe is your pain?", vietnamese: "Trên thang điểm từ 1 đến 10, mức độ đau của bác là mấy điểm?" }
    ],
    dialogues: {
      nursePatient: [
        { speaker: "Nurse Huyen", english: "Are you feeling any pain around your incision site?", vietnamese: "Bác có cảm thấy đau ở vùng vết mổ không ạ?" },
        { speaker: "Patient", english: "Yes nurse, it hurts a little when I move.", vietnamese: "Có cô điều dưỡng, hơi đau một chút khi tôi cử động." },
        { speaker: "Nurse Huyen", english: "On a scale of 1 to 10, how would you rate the pain?", vietnamese: "Trên thang điểm từ 1 đến 10, bác đánh giá mức đau khoảng mấy điểm ạ?" }
      ],
      nurseDoctor: [
        { speaker: "Nurse Huyen", english: "Doctor, the patient in bed 4 reports post-op pain score of 6 out of 10.", vietnamese: "Bác sĩ ơi, bệnh nhân ở giường 4 báo điểm đau sau mổ là 6/10." },
        { speaker: "Doctor", english: "Understood. Please administer 500mg IV Paracetamol as prescribed.", vietnamese: "Đã rõ. Em cho bệnh nhân dùng 500mg Paracetamol truyền tĩnh mạch theo y lệnh nhé." }
      ],
      nurseColleague: [
        { speaker: "Nurse Huyen", english: "Patient in 302 needs pain re-assessment in 30 minutes.", vietnamese: "Bệnh nhân ở phòng 302 cần đánh giá lại mức độ đau sau 30 phút nữa." },
        { speaker: "Nurse Lan", english: "Got it! I will check her pain score during my next round.", vietnamese: "Đã nhớ! Mình sẽ kiểm tra điểm đau của cô ấy trong ca đi buồng tiếp theo." }
      ]
    }
  },
  {
    id: "positioning",
    title: "8. Patient Positioning (Tư Thế Bệnh Nhân Phòng Mổ)",
    icon: "🛌",
    sentences: [
      { english: "Please lie down on your back.", vietnamese: "Xin bác nằm ngửa ra giường." },
      { english: "Please turn onto your left side.", vietnamese: "Xin bác xoay người sang bên trái." }
    ],
    dialogues: {
      nursePatient: [
        { speaker: "Nurse Huyen", english: "Please lie down on your back and relax your arms.", vietnamese: "Xin bác nằm ngửa ra giường và thả lỏng hai tay nhé." },
        { speaker: "Patient", english: "Like this, Nurse?", vietnamese: "Như thế này phải không cô?" },
        { speaker: "Nurse Huyen", english: "Yes, perfect! I will place a soft pillow under your knees.", vietnamese: "Đúng rồi, rất chuẩn ạ! Cháu sẽ đặt một chiếc gối mềm dưới khớp gối của bác." }
      ],
      nurseDoctor: [
        { speaker: "Nurse Huyen", english: "Doctor, the patient is positioned in the supine position for the abdominal surgery.", vietnamese: "Bác sĩ ơi, bệnh nhân đã được đặt nằm ở tư thế nằm ngửa cho ca phẫu thuật vùng bụng." },
        { speaker: "Doctor", english: "Thank you Huyen. Ensure all pressure points are well padded.", vietnamese: "Cảm ơn em Huyền. Hãy đảm bảo các điểm tì đè được chèn lót đệm êm ái nhé." }
      ],
      nurseColleague: [
        { speaker: "Nurse Huyen", english: "Lan, help me shift the patient into the lithotomy position for OR 2.", vietnamese: "Lan ơi, phụ mình chuyển tư thế bệnh nhân sang tư thế sản khoa cho Phòng Mổ số 2 với." },
        { speaker: "Nurse Lan", english: "On my way! Let's make sure the leg supports are secure.", vietnamese: "Sang ngay đây! Đảm bảo các giá đỡ chân đã được chốt chắc chắn nhé." }
      ]
    }
  }
];
