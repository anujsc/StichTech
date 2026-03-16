import type {
  ICourse,
  IUser,
  IEnrollment,
  IVideoProgress,
  ITestimonial,
  IFaqItem,
} from '@/types';

// ─── Helper ───────────────────────────────────────────────────────────────────
const d = (iso: string): Date => new Date(iso);

// ─── MOCK_COURSES ─────────────────────────────────────────────────────────────
// Course 1: Basic Blouse — 3 modules (4+3+3 = 10 videos)
const c1m1videos = [
  { id: 'c1m1v1', title: 'कोर्स परिचय', description: 'इस कोर्स में आप क्या सीखेंगी', cloudinaryPublicId: 'ss/c1m1v1', durationSeconds: 540, sortOrder: 1, isFreePreview: true },
  { id: 'c1m1v2', title: 'ज़रूरी सामान', description: 'सिलाई के लिए ज़रूरी उपकरण', cloudinaryPublicId: 'ss/c1m1v2', durationSeconds: 600, sortOrder: 2, isFreePreview: false },
  { id: 'c1m1v3', title: 'कपड़े की पहचान', description: 'कपड़े के प्रकार', cloudinaryPublicId: 'ss/c1m1v3', durationSeconds: 720, sortOrder: 3, isFreePreview: false },
  { id: 'c1m1v4', title: 'नाप लेना', description: 'सही नाप कैसे लें', cloudinaryPublicId: 'ss/c1m1v4', durationSeconds: 900, sortOrder: 4, isFreePreview: false },
];
const c1m2videos = [
  { id: 'c1m2v1', title: 'पैटर्न बनाना', description: 'ब्लाउज़ का पैटर्न', cloudinaryPublicId: 'ss/c1m2v1', durationSeconds: 1080, sortOrder: 1, isFreePreview: false },
  { id: 'c1m2v2', title: 'कपड़ा काटना', description: 'सही तरीके से काटें', cloudinaryPublicId: 'ss/c1m2v2', durationSeconds: 960, sortOrder: 2, isFreePreview: false },
  { id: 'c1m2v3', title: 'टुकड़े जोड़ना', description: 'कपड़े के टुकड़े जोड़ें', cloudinaryPublicId: 'ss/c1m2v3', durationSeconds: 1200, sortOrder: 3, isFreePreview: false },
];
const c1m3videos = [
  { id: 'c1m3v1', title: 'बाजू सिलना', description: 'बाजू कैसे लगाएं', cloudinaryPublicId: 'ss/c1m3v1', durationSeconds: 1080, sortOrder: 1, isFreePreview: false },
  { id: 'c1m3v2', title: 'गला बनाना', description: 'गले की फिनिशिंग', cloudinaryPublicId: 'ss/c1m3v2', durationSeconds: 840, sortOrder: 2, isFreePreview: false },
  { id: 'c1m3v3', title: 'फाइनल फिनिशिंग', description: 'अंतिम सिलाई', cloudinaryPublicId: 'ss/c1m3v3', durationSeconds: 780, sortOrder: 3, isFreePreview: false },
];

// Course 2: Salwar Suit — 4 modules (4+3+3+4 = 14 videos)
const c2m1videos = [
  { id: 'c2m1v1', title: 'सलवार सूट परिचय', description: 'कोर्स का परिचय', cloudinaryPublicId: 'ss/c2m1v1', durationSeconds: 480, sortOrder: 1, isFreePreview: true },
  { id: 'c2m1v2', title: 'कपड़े का चुनाव', description: 'सही कपड़ा चुनें', cloudinaryPublicId: 'ss/c2m1v2', durationSeconds: 600, sortOrder: 2, isFreePreview: false },
  { id: 'c2m1v3', title: 'नाप चार्ट', description: 'नाप कैसे लें', cloudinaryPublicId: 'ss/c2m1v3', durationSeconds: 720, sortOrder: 3, isFreePreview: false },
  { id: 'c2m1v4', title: 'पैटर्न ड्राफ्टिंग', description: 'पैटर्न बनाएं', cloudinaryPublicId: 'ss/c2m1v4', durationSeconds: 900, sortOrder: 4, isFreePreview: false },
];
const c2m2videos = [
  { id: 'c2m2v1', title: 'कमीज़ काटना', description: 'कमीज़ का कपड़ा काटें', cloudinaryPublicId: 'ss/c2m2v1', durationSeconds: 840, sortOrder: 1, isFreePreview: false },
  { id: 'c2m2v2', title: 'कमीज़ सिलना', description: 'कमीज़ सिलें', cloudinaryPublicId: 'ss/c2m2v2', durationSeconds: 1080, sortOrder: 2, isFreePreview: false },
  { id: 'c2m2v3', title: 'गला और बाजू', description: 'गला और बाजू लगाएं', cloudinaryPublicId: 'ss/c2m2v3', durationSeconds: 960, sortOrder: 3, isFreePreview: false },
];
const c2m3videos = [
  { id: 'c2m3v1', title: 'सलवार काटना', description: 'सलवार का पैटर्न', cloudinaryPublicId: 'ss/c2m3v1', durationSeconds: 720, sortOrder: 1, isFreePreview: false },
  { id: 'c2m3v2', title: 'सलवार सिलना', description: 'सलवार सिलें', cloudinaryPublicId: 'ss/c2m3v2', durationSeconds: 900, sortOrder: 2, isFreePreview: false },
  { id: 'c2m3v3', title: 'नाड़ा लगाना', description: 'नाड़ा कैसे लगाएं', cloudinaryPublicId: 'ss/c2m3v3', durationSeconds: 540, sortOrder: 3, isFreePreview: false },
];
const c2m4videos = [
  { id: 'c2m4v1', title: 'दुपट्टा हेमिंग', description: 'दुपट्टे की हेमिंग', cloudinaryPublicId: 'ss/c2m4v1', durationSeconds: 480, sortOrder: 1, isFreePreview: false },
  { id: 'c2m4v2', title: 'बटन और हुक', description: 'बटन लगाना', cloudinaryPublicId: 'ss/c2m4v2', durationSeconds: 600, sortOrder: 2, isFreePreview: false },
  { id: 'c2m4v3', title: 'प्रेसिंग', description: 'कपड़े की प्रेसिंग', cloudinaryPublicId: 'ss/c2m4v3', durationSeconds: 480, sortOrder: 3, isFreePreview: false },
  { id: 'c2m4v4', title: 'फाइनल लुक', description: 'तैयार सूट', cloudinaryPublicId: 'ss/c2m4v4', durationSeconds: 540, sortOrder: 4, isFreePreview: false },
];

// Course 3: Designer Lehenga — 5 modules × 4 videos = 20 videos
const c3m1videos = [
  { id: 'c3m1v1', title: 'लहंगा परिचय', description: 'लहंगे के प्रकार', cloudinaryPublicId: 'ss/c3m1v1', durationSeconds: 600, sortOrder: 1, isFreePreview: true },
  { id: 'c3m1v2', title: 'कपड़े का चुनाव', description: 'लहंगे के लिए कपड़ा', cloudinaryPublicId: 'ss/c3m1v2', durationSeconds: 720, sortOrder: 2, isFreePreview: false },
  { id: 'c3m1v3', title: 'नाप लेना', description: 'लहंगे की नाप', cloudinaryPublicId: 'ss/c3m1v3', durationSeconds: 840, sortOrder: 3, isFreePreview: false },
  { id: 'c3m1v4', title: 'पैटर्न बनाना', description: 'लहंगे का पैटर्न', cloudinaryPublicId: 'ss/c3m1v4', durationSeconds: 1080, sortOrder: 4, isFreePreview: false },
];
const c3m2videos = [
  { id: 'c3m2v1', title: 'घेर काटना', description: 'लहंगे का घेर', cloudinaryPublicId: 'ss/c3m2v1', durationSeconds: 960, sortOrder: 1, isFreePreview: false },
  { id: 'c3m2v2', title: 'घेर सिलना', description: 'घेर की सिलाई', cloudinaryPublicId: 'ss/c3m2v2', durationSeconds: 1200, sortOrder: 2, isFreePreview: false },
  { id: 'c3m2v3', title: 'कमर बैंड', description: 'कमर बैंड लगाना', cloudinaryPublicId: 'ss/c3m2v3', durationSeconds: 840, sortOrder: 3, isFreePreview: false },
  { id: 'c3m2v4', title: 'लाइनिंग', description: 'लाइनिंग लगाना', cloudinaryPublicId: 'ss/c3m2v4', durationSeconds: 900, sortOrder: 4, isFreePreview: false },
];
const c3m3videos = [
  { id: 'c3m3v1', title: 'चोली काटना', description: 'चोली का पैटर्न', cloudinaryPublicId: 'ss/c3m3v1', durationSeconds: 1080, sortOrder: 1, isFreePreview: false },
  { id: 'c3m3v2', title: 'चोली सिलना', description: 'चोली की सिलाई', cloudinaryPublicId: 'ss/c3m3v2', durationSeconds: 1200, sortOrder: 2, isFreePreview: false },
  { id: 'c3m3v3', title: 'हुक और ज़िप', description: 'हुक लगाना', cloudinaryPublicId: 'ss/c3m3v3', durationSeconds: 720, sortOrder: 3, isFreePreview: false },
  { id: 'c3m3v4', title: 'गला डिज़ाइन', description: 'गले की डिज़ाइन', cloudinaryPublicId: 'ss/c3m3v4', durationSeconds: 960, sortOrder: 4, isFreePreview: false },
];
const c3m4videos = [
  { id: 'c3m4v1', title: 'एम्ब्रॉयडरी बेसिक्स', description: 'कढ़ाई की शुरुआत', cloudinaryPublicId: 'ss/c3m4v1', durationSeconds: 1080, sortOrder: 1, isFreePreview: false },
  { id: 'c3m4v2', title: 'ज़री काम', description: 'ज़री लगाना', cloudinaryPublicId: 'ss/c3m4v2', durationSeconds: 1200, sortOrder: 2, isFreePreview: false },
  { id: 'c3m4v3', title: 'मिरर वर्क', description: 'शीशे लगाना', cloudinaryPublicId: 'ss/c3m4v3', durationSeconds: 900, sortOrder: 3, isFreePreview: false },
  { id: 'c3m4v4', title: 'लेस लगाना', description: 'लेस की फिनिशिंग', cloudinaryPublicId: 'ss/c3m4v4', durationSeconds: 840, sortOrder: 4, isFreePreview: false },
];
const c3m5videos = [
  { id: 'c3m5v1', title: 'दुपट्टा डिज़ाइन', description: 'दुपट्टे की सजावट', cloudinaryPublicId: 'ss/c3m5v1', durationSeconds: 720, sortOrder: 1, isFreePreview: false },
  { id: 'c3m5v2', title: 'फाइनल असेंबली', description: 'सब जोड़ना', cloudinaryPublicId: 'ss/c3m5v2', durationSeconds: 1080, sortOrder: 2, isFreePreview: false },
  { id: 'c3m5v3', title: 'प्रेसिंग और पैकिंग', description: 'तैयार लहंगा', cloudinaryPublicId: 'ss/c3m5v3', durationSeconds: 600, sortOrder: 3, isFreePreview: false },
  { id: 'c3m5v4', title: 'स्टाइलिंग टिप्स', description: 'कैसे पहनें', cloudinaryPublicId: 'ss/c3m5v4', durationSeconds: 540, sortOrder: 4, isFreePreview: false },
];

// Course 4: Kids Clothes — 3 modules × 3 videos = 9 videos
const c4m1videos = [
  { id: 'c4m1v1', title: 'बच्चों के कपड़े परिचय', description: 'कोर्स का परिचय', cloudinaryPublicId: 'ss/c4m1v1', durationSeconds: 480, sortOrder: 1, isFreePreview: true },
  { id: 'c4m1v2', title: 'साइज़ चार्ट', description: 'बच्चों का साइज़', cloudinaryPublicId: 'ss/c4m1v2', durationSeconds: 600, sortOrder: 2, isFreePreview: false },
  { id: 'c4m1v3', title: 'कपड़े का चुनाव', description: 'बच्चों के लिए कपड़ा', cloudinaryPublicId: 'ss/c4m1v3', durationSeconds: 540, sortOrder: 3, isFreePreview: false },
];
const c4m2videos = [
  { id: 'c4m2v1', title: 'फ्रॉक काटना', description: 'फ्रॉक का पैटर्न', cloudinaryPublicId: 'ss/c4m2v1', durationSeconds: 720, sortOrder: 1, isFreePreview: false },
  { id: 'c4m2v2', title: 'फ्रॉक सिलना', description: 'फ्रॉक की सिलाई', cloudinaryPublicId: 'ss/c4m2v2', durationSeconds: 900, sortOrder: 2, isFreePreview: false },
  { id: 'c4m2v3', title: 'फ्रिल लगाना', description: 'फ्रिल की सजावट', cloudinaryPublicId: 'ss/c4m2v3', durationSeconds: 780, sortOrder: 3, isFreePreview: false },
];
const c4m3videos = [
  { id: 'c4m3v1', title: 'पैंट काटना', description: 'बच्चों की पैंट', cloudinaryPublicId: 'ss/c4m3v1', durationSeconds: 660, sortOrder: 1, isFreePreview: false },
  { id: 'c4m3v2', title: 'पैंट सिलना', description: 'पैंट की सिलाई', cloudinaryPublicId: 'ss/c4m3v2', durationSeconds: 840, sortOrder: 2, isFreePreview: false },
  { id: 'c4m3v3', title: 'इलास्टिक लगाना', description: 'इलास्टिक कैसे लगाएं', cloudinaryPublicId: 'ss/c4m3v3', durationSeconds: 540, sortOrder: 3, isFreePreview: false },
];

// Course 5: Saree Fall — 2 modules × 3 videos = 6 videos
const c5m1videos = [
  { id: 'c5m1v1', title: 'साड़ी फॉल परिचय', description: 'फॉल क्या होता है', cloudinaryPublicId: 'ss/c5m1v1', durationSeconds: 480, sortOrder: 1, isFreePreview: true },
  { id: 'c5m1v2', title: 'फॉल काटना', description: 'फॉल का माप', cloudinaryPublicId: 'ss/c5m1v2', durationSeconds: 600, sortOrder: 2, isFreePreview: false },
  { id: 'c5m1v3', title: 'फॉल लगाना', description: 'साड़ी में फॉल लगाएं', cloudinaryPublicId: 'ss/c5m1v3', durationSeconds: 900, sortOrder: 3, isFreePreview: false },
];
const c5m2videos = [
  { id: 'c5m2v1', title: 'पिको मशीन', description: 'पिको मशीन का उपयोग', cloudinaryPublicId: 'ss/c5m2v1', durationSeconds: 720, sortOrder: 1, isFreePreview: false },
  { id: 'c5m2v2', title: 'पिको करना', description: 'पिको कैसे करें', cloudinaryPublicId: 'ss/c5m2v2', durationSeconds: 840, sortOrder: 2, isFreePreview: false },
  { id: 'c5m2v3', title: 'फिनिशिंग', description: 'अंतिम फिनिशिंग', cloudinaryPublicId: 'ss/c5m2v3', durationSeconds: 600, sortOrder: 3, isFreePreview: false },
];

// Course 6: Advanced Patterns — 6 modules × 5 videos = 30 videos
const c6m1videos = [
  { id: 'c6m1v1', title: 'एडवांस पैटर्न परिचय', description: 'कोर्स का परिचय', cloudinaryPublicId: 'ss/c6m1v1', durationSeconds: 720, sortOrder: 1, isFreePreview: true },
  { id: 'c6m1v2', title: 'ड्राफ्टिंग टूल्स', description: 'पैटर्न के उपकरण', cloudinaryPublicId: 'ss/c6m1v2', durationSeconds: 840, sortOrder: 2, isFreePreview: false },
  { id: 'c6m1v3', title: 'बेसिक ब्लॉक', description: 'बेसिक ब्लॉक बनाना', cloudinaryPublicId: 'ss/c6m1v3', durationSeconds: 1080, sortOrder: 3, isFreePreview: false },
  { id: 'c6m1v4', title: 'ग्रेडिंग', description: 'साइज़ ग्रेडिंग', cloudinaryPublicId: 'ss/c6m1v4', durationSeconds: 1200, sortOrder: 4, isFreePreview: false },
  { id: 'c6m1v5', title: 'मार्किंग', description: 'पैटर्न मार्किंग', cloudinaryPublicId: 'ss/c6m1v5', durationSeconds: 960, sortOrder: 5, isFreePreview: false },
];
const c6m2videos = [
  { id: 'c6m2v1', title: 'प्रिंसेस लाइन', description: 'प्रिंसेस कट', cloudinaryPublicId: 'ss/c6m2v1', durationSeconds: 1080, sortOrder: 1, isFreePreview: false },
  { id: 'c6m2v2', title: 'एम्पायर वेस्ट', description: 'एम्पायर कट', cloudinaryPublicId: 'ss/c6m2v2', durationSeconds: 1200, sortOrder: 2, isFreePreview: false },
  { id: 'c6m2v3', title: 'A-लाइन', description: 'A-लाइन पैटर्न', cloudinaryPublicId: 'ss/c6m2v3', durationSeconds: 960, sortOrder: 3, isFreePreview: false },
  { id: 'c6m2v4', title: 'फ्लेयर', description: 'फ्लेयर पैटर्न', cloudinaryPublicId: 'ss/c6m2v4', durationSeconds: 1080, sortOrder: 4, isFreePreview: false },
  { id: 'c6m2v5', title: 'मरमेड', description: 'मरमेड कट', cloudinaryPublicId: 'ss/c6m2v5', durationSeconds: 1200, sortOrder: 5, isFreePreview: false },
];
const c6m3videos = [
  { id: 'c6m3v1', title: 'कॉलर पैटर्न', description: 'कॉलर के प्रकार', cloudinaryPublicId: 'ss/c6m3v1', durationSeconds: 900, sortOrder: 1, isFreePreview: false },
  { id: 'c6m3v2', title: 'स्लीव पैटर्न', description: 'बाजू के प्रकार', cloudinaryPublicId: 'ss/c6m3v2', durationSeconds: 1080, sortOrder: 2, isFreePreview: false },
  { id: 'c6m3v3', title: 'पॉकेट पैटर्न', description: 'जेब के प्रकार', cloudinaryPublicId: 'ss/c6m3v3', durationSeconds: 840, sortOrder: 3, isFreePreview: false },
  { id: 'c6m3v4', title: 'नेकलाइन', description: 'गले के डिज़ाइन', cloudinaryPublicId: 'ss/c6m3v4', durationSeconds: 960, sortOrder: 4, isFreePreview: false },
  { id: 'c6m3v5', title: 'बैक डिज़ाइन', description: 'पीठ की डिज़ाइन', cloudinaryPublicId: 'ss/c6m3v5', durationSeconds: 1080, sortOrder: 5, isFreePreview: false },
];
const c6m4videos = [
  { id: 'c6m4v1', title: 'ट्राउज़र पैटर्न', description: 'ट्राउज़र ड्राफ्टिंग', cloudinaryPublicId: 'ss/c6m4v1', durationSeconds: 1200, sortOrder: 1, isFreePreview: false },
  { id: 'c6m4v2', title: 'स्कर्ट पैटर्न', description: 'स्कर्ट ड्राफ्टिंग', cloudinaryPublicId: 'ss/c6m4v2', durationSeconds: 1080, sortOrder: 2, isFreePreview: false },
  { id: 'c6m4v3', title: 'जैकेट पैटर्न', description: 'जैकेट ड्राफ्टिंग', cloudinaryPublicId: 'ss/c6m4v3', durationSeconds: 1200, sortOrder: 3, isFreePreview: false },
  { id: 'c6m4v4', title: 'कोट पैटर्न', description: 'कोट ड्राफ्टिंग', cloudinaryPublicId: 'ss/c6m4v4', durationSeconds: 1080, sortOrder: 4, isFreePreview: false },
  { id: 'c6m4v5', title: 'ब्लेज़र पैटर्न', description: 'ब्लेज़र ड्राफ्टिंग', cloudinaryPublicId: 'ss/c6m4v5', durationSeconds: 1200, sortOrder: 5, isFreePreview: false },
];
const c6m5videos = [
  { id: 'c6m5v1', title: 'फिटिंग समस्याएं', description: 'फिटिंग ठीक करना', cloudinaryPublicId: 'ss/c6m5v1', durationSeconds: 1080, sortOrder: 1, isFreePreview: false },
  { id: 'c6m5v2', title: 'अल्टरेशन', description: 'कपड़े में बदलाव', cloudinaryPublicId: 'ss/c6m5v2', durationSeconds: 960, sortOrder: 2, isFreePreview: false },
  { id: 'c6m5v3', title: 'ड्रेपिंग', description: 'ड्रेपिंग तकनीक', cloudinaryPublicId: 'ss/c6m5v3', durationSeconds: 1200, sortOrder: 3, isFreePreview: false },
  { id: 'c6m5v4', title: 'मॉकअप', description: 'मॉकअप बनाना', cloudinaryPublicId: 'ss/c6m5v4', durationSeconds: 1080, sortOrder: 4, isFreePreview: false },
  { id: 'c6m5v5', title: 'फाइनल फिटिंग', description: 'अंतिम फिटिंग', cloudinaryPublicId: 'ss/c6m5v5', durationSeconds: 900, sortOrder: 5, isFreePreview: false },
];
const c6m6videos = [
  { id: 'c6m6v1', title: 'इंडस्ट्री टिप्स', description: 'प्रोफेशनल टिप्स', cloudinaryPublicId: 'ss/c6m6v1', durationSeconds: 840, sortOrder: 1, isFreePreview: false },
  { id: 'c6m6v2', title: 'पोर्टफोलियो', description: 'पोर्टफोलियो बनाएं', cloudinaryPublicId: 'ss/c6m6v2', durationSeconds: 720, sortOrder: 2, isFreePreview: false },
  { id: 'c6m6v3', title: 'बिज़नेस शुरू करें', description: 'अपना बिज़नेस', cloudinaryPublicId: 'ss/c6m6v3', durationSeconds: 960, sortOrder: 3, isFreePreview: false },
  { id: 'c6m6v4', title: 'प्राइसिंग', description: 'कीमत कैसे तय करें', cloudinaryPublicId: 'ss/c6m6v4', durationSeconds: 780, sortOrder: 4, isFreePreview: false },
  { id: 'c6m6v5', title: 'मार्केटिंग', description: 'अपना काम बेचें', cloudinaryPublicId: 'ss/c6m6v5', durationSeconds: 900, sortOrder: 5, isFreePreview: false },
];

// ─── Helper to sum durations ──────────────────────────────────────────────────
const sumDur = (vids: { durationSeconds: number }[]): number =>
  vids.reduce((acc, v) => acc + v.durationSeconds, 0);

export const MOCK_COURSES: ICourse[] = [
  {
    id: 'course_001',
    title: 'Basic Blouse Stitching — ब्लाउज़ सिलाई',
    description: 'घर पर ब्लाउज़ सिलना सीखें। नाप लेने से लेकर फाइनल फिनिशिंग तक सब कुछ।',
    thumbnailColour: 'rose',
    price: 499,
    language: 'Hindi',
    level: 'beginner',
    status: 'published',
    instructorName: 'Sunita Devi',
    instructorBio: '15 साल का अनुभव, 5000+ छात्राएं',
    modules: [
      { id: 'c1m1', title: 'परिचय और सामान', sortOrder: 1, videos: c1m1videos },
      { id: 'c1m2', title: 'काटना और जोड़ना', sortOrder: 2, videos: c1m2videos },
      { id: 'c1m3', title: 'फिनिशिंग', sortOrder: 3, videos: c1m3videos },
    ],
    totalModules: 3,
    totalVideos: c1m1videos.length + c1m2videos.length + c1m3videos.length,
    totalDurationSeconds: sumDur(c1m1videos) + sumDur(c1m2videos) + sumDur(c1m3videos),
    createdAt: d('2024-01-10T10:00:00Z'),
    updatedAt: d('2024-06-01T10:00:00Z'),
  },
  {
    id: 'course_002',
    title: 'Complete Salwar Suit — सलवार सूट',
    description: 'पूरा सलवार सूट सिलना सीखें — कमीज़, सलवार और दुपट्टा।',
    thumbnailColour: 'amber',
    price: 799,
    discountedPrice: 599,
    language: 'Hindi',
    level: 'beginner',
    status: 'published',
    instructorName: 'Sunita Devi',
    modules: [
      { id: 'c2m1', title: 'परिचय और नाप', sortOrder: 1, videos: c2m1videos },
      { id: 'c2m2', title: 'कमीज़ सिलाई', sortOrder: 2, videos: c2m2videos },
      { id: 'c2m3', title: 'सलवार सिलाई', sortOrder: 3, videos: c2m3videos },
      { id: 'c2m4', title: 'फिनिशिंग', sortOrder: 4, videos: c2m4videos },
    ],
    totalModules: 4,
    totalVideos: c2m1videos.length + c2m2videos.length + c2m3videos.length + c2m4videos.length,
    totalDurationSeconds: sumDur(c2m1videos) + sumDur(c2m2videos) + sumDur(c2m3videos) + sumDur(c2m4videos),
    createdAt: d('2024-02-15T10:00:00Z'),
    updatedAt: d('2024-06-10T10:00:00Z'),
  },
  {
    id: 'course_003',
    title: 'Designer Lehenga — डिज़ाइनर लहंगा',
    description: 'शादी और त्योहार के लिए डिज़ाइनर लहंगा चोली सिलना सीखें।',
    thumbnailColour: 'burgundy',
    price: 1299,
    discountedPrice: 999,
    language: 'Hindi',
    level: 'intermediate',
    status: 'published',
    instructorName: 'Sunita Devi',
    modules: [
      { id: 'c3m1', title: 'परिचय और पैटर्न', sortOrder: 1, videos: c3m1videos },
      { id: 'c3m2', title: 'लहंगा सिलाई', sortOrder: 2, videos: c3m2videos },
      { id: 'c3m3', title: 'चोली सिलाई', sortOrder: 3, videos: c3m3videos },
      { id: 'c3m4', title: 'एम्ब्रॉयडरी', sortOrder: 4, videos: c3m4videos },
      { id: 'c3m5', title: 'फाइनल असेंबली', sortOrder: 5, videos: c3m5videos },
    ],
    totalModules: 5,
    totalVideos: c3m1videos.length + c3m2videos.length + c3m3videos.length + c3m4videos.length + c3m5videos.length,
    totalDurationSeconds: sumDur(c3m1videos) + sumDur(c3m2videos) + sumDur(c3m3videos) + sumDur(c3m4videos) + sumDur(c3m5videos),
    createdAt: d('2024-03-01T10:00:00Z'),
    updatedAt: d('2024-06-15T10:00:00Z'),
  },
  {
    id: 'course_004',
    title: 'Kids Clothes Basics — बच्चों के कपड़े',
    description: 'बच्चों के लिए फ्रॉक, पैंट और शर्ट सिलना सीखें।',
    thumbnailColour: 'marigold',
    price: 399,
    language: 'Hindi',
    level: 'beginner',
    status: 'published',
    instructorName: 'Sunita Devi',
    modules: [
      { id: 'c4m1', title: 'परिचय और साइज़', sortOrder: 1, videos: c4m1videos },
      { id: 'c4m2', title: 'फ्रॉक सिलाई', sortOrder: 2, videos: c4m2videos },
      { id: 'c4m3', title: 'पैंट सिलाई', sortOrder: 3, videos: c4m3videos },
    ],
    totalModules: 3,
    totalVideos: c4m1videos.length + c4m2videos.length + c4m3videos.length,
    totalDurationSeconds: sumDur(c4m1videos) + sumDur(c4m2videos) + sumDur(c4m3videos),
    createdAt: d('2024-01-20T10:00:00Z'),
    updatedAt: d('2024-05-20T10:00:00Z'),
  },
  {
    id: 'course_005',
    title: 'Saree Fall and Pico — साड़ी फॉल',
    description: 'साड़ी में फॉल और पिको लगाना सीखें — घर पर आसानी से।',
    thumbnailColour: 'terracotta',
    price: 299,
    language: 'Hindi',
    level: 'beginner',
    status: 'published',
    instructorName: 'Sunita Devi',
    modules: [
      { id: 'c5m1', title: 'फॉल लगाना', sortOrder: 1, videos: c5m1videos },
      { id: 'c5m2', title: 'पिको करना', sortOrder: 2, videos: c5m2videos },
    ],
    totalModules: 2,
    totalVideos: c5m1videos.length + c5m2videos.length,
    totalDurationSeconds: sumDur(c5m1videos) + sumDur(c5m2videos),
    createdAt: d('2024-04-01T10:00:00Z'),
    updatedAt: d('2024-06-20T10:00:00Z'),
  },
  {
    id: 'course_006',
    title: 'Advanced Patterns — एडवांस पैटर्न',
    description: 'प्रोफेशनल पैटर्न ड्राफ्टिंग और ग्रेडिंग सीखें। अपना बिज़नेस शुरू करें।',
    thumbnailColour: 'saffron',
    price: 1499,
    discountedPrice: 1199,
    language: 'Hindi',
    level: 'advanced',
    status: 'published',
    instructorName: 'Sunita Devi',
    instructorBio: 'फैशन डिज़ाइन में 20 साल का अनुभव',
    modules: [
      { id: 'c6m1', title: 'पैटर्न बेसिक्स', sortOrder: 1, videos: c6m1videos },
      { id: 'c6m2', title: 'सिल्हूट', sortOrder: 2, videos: c6m2videos },
      { id: 'c6m3', title: 'डिटेल्स', sortOrder: 3, videos: c6m3videos },
      { id: 'c6m4', title: 'बॉटम वेयर', sortOrder: 4, videos: c6m4videos },
      { id: 'c6m5', title: 'फिटिंग', sortOrder: 5, videos: c6m5videos },
      { id: 'c6m6', title: 'बिज़नेस', sortOrder: 6, videos: c6m6videos },
    ],
    totalModules: 6,
    totalVideos: c6m1videos.length + c6m2videos.length + c6m3videos.length + c6m4videos.length + c6m5videos.length + c6m6videos.length,
    totalDurationSeconds: sumDur(c6m1videos) + sumDur(c6m2videos) + sumDur(c6m3videos) + sumDur(c6m4videos) + sumDur(c6m5videos) + sumDur(c6m6videos),
    createdAt: d('2024-02-01T10:00:00Z'),
    updatedAt: d('2024-05-10T10:00:00Z'),
  },
];

// ─── MOCK_STUDENTS ────────────────────────────────────────────────────────────

export const MOCK_STUDENTS: IUser[] = [
  { id: 'user_001', name: 'Priya Sharma',  email: 'priya@example.com',  role: 'student', authProvider: 'google', isEmailVerified: true, createdAt: d('2024-01-15T08:00:00Z') },
  { id: 'user_002', name: 'Sunita Yadav',  email: 'sunita@example.com', role: 'student', authProvider: 'google', isEmailVerified: true, createdAt: d('2024-02-10T08:00:00Z') },
  { id: 'user_003', name: 'Kavita Gupta',  email: 'kavita@example.com', role: 'student', authProvider: 'google', isEmailVerified: true, createdAt: d('2024-02-20T08:00:00Z') },
  { id: 'user_004', name: 'Meena Patel',   email: 'meena@example.com',  role: 'student', authProvider: 'google', isEmailVerified: true, createdAt: d('2024-03-05T08:00:00Z') },
  { id: 'user_005', name: 'Rekha Singh',   email: 'rekha@example.com',  role: 'student', authProvider: 'google', isEmailVerified: true, createdAt: d('2024-03-15T08:00:00Z') },
  { id: 'user_006', name: 'Anita Verma',   email: 'anita@example.com',  role: 'student', authProvider: 'google', isEmailVerified: true, createdAt: d('2024-04-01T08:00:00Z') },
  { id: 'user_007', name: 'Geeta Joshi',   email: 'geeta@example.com',  role: 'student', authProvider: 'google', isEmailVerified: true, createdAt: d('2024-04-10T08:00:00Z') },
  { id: 'user_008', name: 'Pooja Mishra',  email: 'pooja@example.com',  role: 'student', authProvider: 'google', isEmailVerified: true, createdAt: d('2024-05-01T08:00:00Z') },
];

// Cities map (used in testimonials)
const CITIES: Record<string, string> = {
  user_001: 'Indore',
  user_002: 'Nashik',
  user_003: 'Agra',
  user_004: 'Surat',
  user_005: 'Jaipur',
  user_006: 'Bhopal',
  user_007: 'Ludhiana',
  user_008: 'Coimbatore',
};

// ─── MOCK_ADMIN ───────────────────────────────────────────────────────────────

export const MOCK_ADMIN: IUser = {
  id: 'admin_001',
  name: 'Sunita Devi',
  email: 'admin@silaisikho.in',
  role: 'admin',
  authProvider: 'google',
  isEmailVerified: true,
  createdAt: d('2023-12-01T08:00:00Z'),
};

// ─── MOCK_ENROLLMENTS ─────────────────────────────────────────────────────────
// Dates relative to "now" (mock: 2024-06-25)
const now = new Date('2024-06-25T00:00:00Z');
const daysAgo = (n: number): Date => new Date(now.getTime() - n * 86400000);

export const MOCK_ENROLLMENTS: IEnrollment[] = [
  {
    id: 'enr_001',
    userId: MOCK_STUDENTS[0].id,
    courseId: MOCK_COURSES[0].id,
    courseName: MOCK_COURSES[0].title,
    courseThumbnailColour: MOCK_COURSES[0].thumbnailColour,
    amountPaid: 499,
    enrolledAt: daysAgo(14),
    progressPercentage: 65,
  },
  {
    id: 'enr_002',
    userId: MOCK_STUDENTS[0].id,
    courseId: MOCK_COURSES[2].id,
    courseName: MOCK_COURSES[2].title,
    courseThumbnailColour: MOCK_COURSES[2].thumbnailColour,
    amountPaid: 999,
    enrolledAt: daysAgo(5),
    progressPercentage: 20,
  },
  {
    id: 'enr_003',
    userId: MOCK_STUDENTS[1].id,
    courseId: MOCK_COURSES[1].id,
    courseName: MOCK_COURSES[1].title,
    courseThumbnailColour: MOCK_COURSES[1].thumbnailColour,
    amountPaid: 599,
    enrolledAt: daysAgo(30),
    progressPercentage: 100,
  },
  {
    id: 'enr_004',
    userId: MOCK_STUDENTS[2].id,
    courseId: MOCK_COURSES[0].id,
    courseName: MOCK_COURSES[0].title,
    courseThumbnailColour: MOCK_COURSES[0].thumbnailColour,
    amountPaid: 499,
    enrolledAt: daysAgo(3),
    progressPercentage: 10,
  },
];

// ─── MOCK_VIDEO_PROGRESS ──────────────────────────────────────────────────────
// Enr 1: course_001 has 10 videos, 65% ≈ 6 completed, 1 partial
// Enr 2: course_003 has 20 videos, 20% = 4 completed
// Enr 3: course_002 has 14 videos, 100% = 14 completed
// Enr 4: course_001 has 10 videos, 10% = 1 completed

const allC1Videos = [...c1m1videos, ...c1m2videos, ...c1m3videos];
const allC2Videos = [...c2m1videos, ...c2m2videos, ...c2m3videos, ...c2m4videos];
const allC3Videos = [...c3m1videos, ...c3m2videos, ...c3m3videos, ...c3m4videos, ...c3m5videos];

export const MOCK_VIDEO_PROGRESS: IVideoProgress[] = [
  // Enr 1 — user_001 in course_001 — 6 completed out of 10 = 60% (≈65%)
  ...allC1Videos.slice(0, 6).map((v, i) => ({
    id: `vp_enr1_${i + 1}`,
    userId: MOCK_STUDENTS[0].id,
    courseId: MOCK_COURSES[0].id,
    videoId: v.id,
    watchedSeconds: v.durationSeconds,
    isCompleted: true,
    lastWatchedAt: daysAgo(14 - i),
  })),
  // Enr 1 — video 7 partially watched
  {
    id: 'vp_enr1_7',
    userId: MOCK_STUDENTS[0].id,
    courseId: MOCK_COURSES[0].id,
    videoId: allC1Videos[6].id,
    watchedSeconds: Math.floor(allC1Videos[6].durationSeconds * 0.5),
    isCompleted: false,
    lastWatchedAt: daysAgo(1),
  },

  // Enr 2 — user_001 in course_003 — 4 completed out of 20 = 20%
  ...allC3Videos.slice(0, 4).map((v, i) => ({
    id: `vp_enr2_${i + 1}`,
    userId: MOCK_STUDENTS[0].id,
    courseId: MOCK_COURSES[2].id,
    videoId: v.id,
    watchedSeconds: v.durationSeconds,
    isCompleted: true,
    lastWatchedAt: daysAgo(5 - i),
  })),

  // Enr 3 — user_002 in course_002 — 14 completed out of 14 = 100%
  ...allC2Videos.map((v, i) => ({
    id: `vp_enr3_${i + 1}`,
    userId: MOCK_STUDENTS[1].id,
    courseId: MOCK_COURSES[1].id,
    videoId: v.id,
    watchedSeconds: v.durationSeconds,
    isCompleted: true,
    lastWatchedAt: daysAgo(30 - i),
  })),

  // Enr 4 — user_003 in course_001 — 1 completed out of 10 = 10%
  {
    id: 'vp_enr4_1',
    userId: MOCK_STUDENTS[2].id,
    courseId: MOCK_COURSES[0].id,
    videoId: allC1Videos[0].id,
    watchedSeconds: allC1Videos[0].durationSeconds,
    isCompleted: true,
    lastWatchedAt: daysAgo(2),
  },
];

// ─── MOCK_TESTIMONIALS ────────────────────────────────────────────────────────

export const MOCK_TESTIMONIALS: ITestimonial[] = [
  {
    id: 'test_001',
    studentName: MOCK_STUDENTS[0].name,
    city: CITIES[MOCK_STUDENTS[0].id],
    rating: 5,
    quoteHindi: 'इस कोर्स से मैंने घर पर ही ब्लाउज़ बनाना सीखा। बहुत आसान था।',
    quoteEnglish: 'I learned to make blouses at home from this course. It was very easy.',
    courseEnrolled: MOCK_COURSES[0].title,
  },
  {
    id: 'test_002',
    studentName: MOCK_STUDENTS[1].name,
    city: CITIES[MOCK_STUDENTS[1].id],
    rating: 5,
    quoteHindi: 'सुनीता दीदी बहुत अच्छे से समझाती हैं। मेरी बेटी की ड्रेस मैंने खुद बनाई।',
    quoteEnglish: 'Sunita Didi explains everything so well. I made my daughter\'s dress myself.',
    courseEnrolled: MOCK_COURSES[3].title,
  },
  {
    id: 'test_003',
    studentName: MOCK_STUDENTS[2].name,
    city: CITIES[MOCK_STUDENTS[2].id],
    rating: 4,
    quoteHindi: 'पहले दर्जी को पैसे देती थी, अब खुद सिलाई करती हूं।',
    quoteEnglish: 'I used to pay the tailor, now I stitch myself.',
    courseEnrolled: MOCK_COURSES[1].title,
  },
  {
    id: 'test_004',
    studentName: MOCK_STUDENTS[3].name,
    city: CITIES[MOCK_STUDENTS[3].id],
    rating: 5,
    quoteHindi: 'कोर्स बहुत सस्ता और बढ़िया है। मोबाइल पर आसानी से देख सकती हूं।',
    quoteEnglish: 'The course is very affordable and excellent. Easy to watch on mobile.',
    courseEnrolled: MOCK_COURSES[0].title,
  },
];

// ─── MOCK_FAQS ────────────────────────────────────────────────────────────────

export const MOCK_FAQS: IFaqItem[] = [
  {
    id: 'faq_001',
    questionHindi: 'क्या मुझे सिलाई का पहले से ज्ञान होना चाहिए?',
    questionEnglish: 'Do I need prior tailoring experience?',
    answerHindi: 'नहीं, हमारे Beginner कोर्स बिल्कुल शुरुआत से शुरू होते हैं।',
    answerEnglish: 'No, our beginner courses start from absolute scratch.',
  },
  {
    id: 'faq_002',
    questionHindi: 'कोर्स कितने समय के लिए उपलब्ध रहेगा?',
    questionEnglish: 'How long will I have access to the course?',
    answerHindi: 'एक बार खरीदने पर आप जीवनभर कोर्स देख सकती हैं।',
    answerEnglish: 'Once purchased, you have lifetime access to the course.',
  },
  {
    id: 'faq_003',
    questionHindi: 'क्या मैं मोबाइल पर कोर्स देख सकती हूं?',
    questionEnglish: 'Can I watch the course on my mobile phone?',
    answerHindi: 'हां, कोर्स किसी भी मोबाइल, टैबलेट या कंप्यूटर पर चलता है।',
    answerEnglish: 'Yes, the course works on any mobile, tablet or computer.',
  },
  {
    id: 'faq_004',
    questionHindi: 'अगर कोर्स पसंद न आए तो क्या पैसे वापस मिलेंगे?',
    questionEnglish: 'What if I don\'t like the course? Can I get a refund?',
    answerHindi: 'खरीद के 7 दिन के अंदर अगर 20% से कम देखा है तो पूरा पैसा वापस।',
    answerEnglish: 'Full refund within 7 days if you have watched less than 20%.',
  },
  {
    id: 'faq_005',
    questionHindi: 'क्या Hindi में सिखाया जाता है?',
    questionEnglish: 'Is the course taught in Hindi?',
    answerHindi: 'हां, सभी कोर्स पूरी तरह Hindi में हैं।',
    answerEnglish: 'Yes, all courses are completely in Hindi.',
  },
];
