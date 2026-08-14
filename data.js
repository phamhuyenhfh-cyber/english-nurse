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
