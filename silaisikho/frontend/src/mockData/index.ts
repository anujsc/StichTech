import type { ICourse, IUser, IEnrollment, IVideoProgress, ITestimonial } from '@/types';

// ─── Courses ──────────────────────────────────────────────────────────────────

export const mockCourses: ICourse[] = [
  {
    _id: 'course_001',
    title: 'Beginner Blouse Stitching',
    slug: 'beginner-blouse-stitching',
    description: 'Learn to stitch a perfect blouse from scratch. Covers measurements, cutting, and finishing.',
    shortDescription: 'Master blouse stitching from scratch.',
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample_blouse.jpg',
    price: 999,
    discountedPrice: 699,
    language: 'Hindi',
    level: 'beginner',
    category: 'Blouse',
    tags: ['blouse', 'beginner', 'stitching'],
    totalDurationSeconds: 9000,
    totalVideos: 12,
    enrollmentCount: 342,
    rating: 4.8,
    reviewCount: 89,
    isPublished: true,
    instructor: { _id: 'user_admin_01', name: 'Sunita Sharma', avatar: '' },
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z',
    modules: [
      {
        _id: 'mod_001_1',
        title: 'Introduction & Tools',
        order: 1,
        videos: [
          { _id: 'vid_001_1_1', title: 'Welcome & Course Overview', cloudinaryPublicId: 'ss/v001', cloudinaryUrl: 'https://res.cloudinary.com/demo/video/upload/v001.mp4', durationSeconds: 300, order: 1, isFreePreview: true },
          { _id: 'vid_001_1_2', title: 'Tools & Materials Needed', cloudinaryPublicId: 'ss/v002', cloudinaryUrl: 'https://res.cloudinary.com/demo/video/upload/v002.mp4', durationSeconds: 480, order: 2, isFreePreview: true },
        ],
      },
      {
        _id: 'mod_001_2',
        title: 'Taking Measurements',
        order: 2,
        videos: [
          { _id: 'vid_001_2_1', title: 'Body Measurements Guide', cloudinaryPublicId: 'ss/v003', cloudinaryUrl: 'https://res.cloudinary.com/demo/video/upload/v003.mp4', durationSeconds: 720, order: 1, isFreePreview: false },
          { _id: 'vid_001_2_2', title: 'Drafting the Pattern', cloudinaryPublicId: 'ss/v004', cloudinaryUrl: 'https://res.cloudinary.com/demo/video/upload/v004.mp4', durationSeconds: 900, order: 2, isFreePreview: false },
        ],
      },
    ],
  },
  {
    _id: 'course_002',
    title: 'Salwar Kameez Masterclass',
    slug: 'salwar-kameez-masterclass',
    description: 'Complete guide to stitching a salwar kameez set with various neck designs.',
    shortDescription: 'Stitch a full salwar kameez set.',
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample_salwar.jpg',
    price: 1499,
    discountedPrice: 999,
    language: 'Hindi',
    level: 'intermediate',
    category: 'Salwar Kameez',
    tags: ['salwar', 'kameez', 'intermediate'],
    totalDurationSeconds: 14400,
    totalVideos: 18,
    enrollmentCount: 215,
    rating: 4.7,
    reviewCount: 63,
    isPublished: true,
    instructor: { _id: 'user_admin_01', name: 'Sunita Sharma', avatar: '' },
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-06-10T10:00:00Z',
    modules: [
      {
        _id: 'mod_002_1',
        title: 'Kameez Cutting',
        order: 1,
        videos: [
          { _id: 'vid_002_1_1', title: 'Fabric Selection', cloudinaryPublicId: 'ss/v010', cloudinaryUrl: 'https://res.cloudinary.com/demo/video/upload/v010.mp4', durationSeconds: 420, order: 1, isFreePreview: true },
          { _id: 'vid_002_1_2', title: 'Cutting the Kameez', cloudinaryPublicId: 'ss/v011', cloudinaryUrl: 'https://res.cloudinary.com/demo/video/upload/v011.mp4', durationSeconds: 840, order: 2, isFreePreview: false },
        ],
      },
    ],
  },
  {
    _id: 'course_003',
    title: 'Lehenga Choli Design',
    slug: 'lehenga-choli-design',
    description: 'Create stunning lehenga choli outfits for weddings and festivals.',
    shortDescription: 'Design and stitch lehenga choli.',
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample_lehenga.jpg',
    price: 1999,
    discountedPrice: 1499,
    language: 'Hindi',
    level: 'advanced',
    category: 'Lehenga',
    tags: ['lehenga', 'choli', 'advanced', 'bridal'],
    totalDurationSeconds: 18000,
    totalVideos: 22,
    enrollmentCount: 178,
    rating: 4.9,
    reviewCount: 54,
    isPublished: true,
    instructor: { _id: 'user_admin_01', name: 'Sunita Sharma', avatar: '' },
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
    modules: [
      {
        _id: 'mod_003_1',
        title: 'Lehenga Skirt',
        order: 1,
        videos: [
          { _id: 'vid_003_1_1', title: 'Lehenga Measurements', cloudinaryPublicId: 'ss/v020', cloudinaryUrl: 'https://res.cloudinary.com/demo/video/upload/v020.mp4', durationSeconds: 600, order: 1, isFreePreview: true },
        ],
      },
    ],
  },
  {
    _id: 'course_004',
    title: 'Kurti Cutting & Stitching',
    slug: 'kurti-cutting-stitching',
    description: 'Learn 10 different kurti styles — A-line, straight, anarkali, and more.',
    shortDescription: 'Master 10 popular kurti styles.',
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample_kurti.jpg',
    price: 799,
    language: 'Hindi',
    level: 'beginner',
    category: 'Kurti',
    tags: ['kurti', 'beginner', 'casual'],
    totalDurationSeconds: 7200,
    totalVideos: 10,
    enrollmentCount: 520,
    rating: 4.6,
    reviewCount: 142,
    isPublished: true,
    instructor: { _id: 'user_admin_01', name: 'Sunita Sharma', avatar: '' },
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-05-20T10:00:00Z',
    modules: [
      {
        _id: 'mod_004_1',
        title: 'A-Line Kurti',
        order: 1,
        videos: [
          { _id: 'vid_004_1_1', title: 'A-Line Pattern Drafting', cloudinaryPublicId: 'ss/v030', cloudinaryUrl: 'https://res.cloudinary.com/demo/video/upload/v030.mp4', durationSeconds: 720, order: 1, isFreePreview: true },
        ],
      },
    ],
  },
  {
    _id: 'course_005',
    title: 'Saree Blouse Embroidery',
    slug: 'saree-blouse-embroidery',
    description: 'Combine stitching with hand embroidery to create designer saree blouses.',
    shortDescription: 'Designer blouses with embroidery.',
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample_embroidery.jpg',
    price: 1299,
    discountedPrice: 899,
    language: 'Hindi',
    level: 'intermediate',
    category: 'Embroidery',
    tags: ['embroidery', 'blouse', 'designer'],
    totalDurationSeconds: 10800,
    totalVideos: 14,
    enrollmentCount: 267,
    rating: 4.8,
    reviewCount: 77,
    isPublished: true,
    instructor: { _id: 'user_admin_01', name: 'Sunita Sharma', avatar: '' },
    createdAt: '2024-04-01T10:00:00Z',
    updatedAt: '2024-06-20T10:00:00Z',
    modules: [
      {
        _id: 'mod_005_1',
        title: 'Embroidery Basics',
        order: 1,
        videos: [
          { _id: 'vid_005_1_1', title: 'Thread & Needle Selection', cloudinaryPublicId: 'ss/v040', cloudinaryUrl: 'https://res.cloudinary.com/demo/video/upload/v040.mp4', durationSeconds: 360, order: 1, isFreePreview: true },
        ],
      },
    ],
  },
  {
    _id: 'course_006',
    title: 'Kids Frock & Dress Making',
    slug: 'kids-frock-dress-making',
    description: 'Stitch adorable frocks and dresses for children aged 1–10 years.',
    shortDescription: 'Cute frocks and dresses for kids.',
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample_kids.jpg',
    price: 699,
    language: 'Hindi',
    level: 'beginner',
    category: 'Kids',
    tags: ['kids', 'frock', 'beginner'],
    totalDurationSeconds: 6300,
    totalVideos: 9,
    enrollmentCount: 389,
    rating: 4.7,
    reviewCount: 98,
    isPublished: true,
    instructor: { _id: 'user_admin_01', name: 'Sunita Sharma', avatar: '' },
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-05-10T10:00:00Z',
    modules: [
      {
        _id: 'mod_006_1',
        title: 'Baby Frock Basics',
        order: 1,
        videos: [
          { _id: 'vid_006_1_1', title: 'Size Chart for Kids', cloudinaryPublicId: 'ss/v050', cloudinaryUrl: 'https://res.cloudinary.com/demo/video/upload/v050.mp4', durationSeconds: 300, order: 1, isFreePreview: true },
        ],
      },
    ],
  },
];

// ─── Users ────────────────────────────────────────────────────────────────────

export const mockUsers: IUser[] = [
  { _id: 'user_001', name: 'Priya Verma', email: 'priya@example.com', role: 'student', city: 'Jaipur', isEmailVerified: true, isGoogleUser: false, createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-06-01T08:00:00Z' },
  { _id: 'user_002', name: 'Anita Singh', email: 'anita@example.com', role: 'student', city: 'Lucknow', isEmailVerified: true, isGoogleUser: true, createdAt: '2024-02-10T08:00:00Z', updatedAt: '2024-06-05T08:00:00Z' },
  { _id: 'user_003', name: 'Kavita Patel', email: 'kavita@example.com', role: 'student', city: 'Ahmedabad', isEmailVerified: true, isGoogleUser: false, createdAt: '2024-02-20T08:00:00Z', updatedAt: '2024-06-10T08:00:00Z' },
  { _id: 'user_004', name: 'Meena Kumari', email: 'meena@example.com', role: 'student', city: 'Patna', isEmailVerified: false, isGoogleUser: false, createdAt: '2024-03-05T08:00:00Z', updatedAt: '2024-06-12T08:00:00Z' },
  { _id: 'user_005', name: 'Rekha Gupta', email: 'rekha@example.com', role: 'student', city: 'Kanpur', isEmailVerified: true, isGoogleUser: false, createdAt: '2024-03-15T08:00:00Z', updatedAt: '2024-06-15T08:00:00Z' },
  { _id: 'user_006', name: 'Suman Yadav', email: 'suman@example.com', role: 'student', city: 'Varanasi', isEmailVerified: true, isGoogleUser: true, createdAt: '2024-04-01T08:00:00Z', updatedAt: '2024-06-18T08:00:00Z' },
  { _id: 'user_007', name: 'Pooja Mishra', email: 'pooja@example.com', role: 'student', city: 'Bhopal', isEmailVerified: true, isGoogleUser: false, createdAt: '2024-04-10T08:00:00Z', updatedAt: '2024-06-20T08:00:00Z' },
  { _id: 'user_008', name: 'Geeta Sharma', email: 'geeta@example.com', role: 'student', city: 'Indore', isEmailVerified: true, isGoogleUser: false, createdAt: '2024-05-01T08:00:00Z', updatedAt: '2024-06-22T08:00:00Z' },
];

// ─── Enrollments ──────────────────────────────────────────────────────────────

export const mockEnrollments: IEnrollment[] = [
  { _id: 'enr_001', user: 'user_001', course: 'course_001', status: 'active', razorpayOrderId: 'order_001', razorpayPaymentId: 'pay_001', amountPaid: 699, enrolledAt: '2024-03-01T10:00:00Z' },
  { _id: 'enr_002', user: 'user_001', course: 'course_002', status: 'active', razorpayOrderId: 'order_002', razorpayPaymentId: 'pay_002', amountPaid: 999, enrolledAt: '2024-03-15T10:00:00Z' },
  { _id: 'enr_003', user: 'user_002', course: 'course_001', status: 'active', razorpayOrderId: 'order_003', razorpayPaymentId: 'pay_003', amountPaid: 699, enrolledAt: '2024-04-01T10:00:00Z' },
  { _id: 'enr_004', user: 'user_003', course: 'course_004', status: 'active', razorpayOrderId: 'order_004', razorpayPaymentId: 'pay_004', amountPaid: 799, enrolledAt: '2024-04-20T10:00:00Z' },
];

// ─── Video Progress ───────────────────────────────────────────────────────────

export const mockVideoProgress: IVideoProgress[] = [
  { _id: 'vp_001', user: 'user_001', course: 'course_001', video: 'vid_001_1_1', watchedSeconds: 300, durationSeconds: 300, isCompleted: true, lastWatchedAt: '2024-03-05T14:00:00Z' },
  { _id: 'vp_002', user: 'user_001', course: 'course_001', video: 'vid_001_1_2', watchedSeconds: 480, durationSeconds: 480, isCompleted: true, lastWatchedAt: '2024-03-06T14:00:00Z' },
  { _id: 'vp_003', user: 'user_001', course: 'course_001', video: 'vid_001_2_1', watchedSeconds: 360, durationSeconds: 720, isCompleted: false, lastWatchedAt: '2024-03-07T14:00:00Z' },
  { _id: 'vp_004', user: 'user_001', course: 'course_002', video: 'vid_002_1_1', watchedSeconds: 420, durationSeconds: 420, isCompleted: true, lastWatchedAt: '2024-03-20T14:00:00Z' },
  { _id: 'vp_005', user: 'user_002', course: 'course_001', video: 'vid_001_1_1', watchedSeconds: 300, durationSeconds: 300, isCompleted: true, lastWatchedAt: '2024-04-05T14:00:00Z' },
  { _id: 'vp_006', user: 'user_002', course: 'course_001', video: 'vid_001_1_2', watchedSeconds: 200, durationSeconds: 480, isCompleted: false, lastWatchedAt: '2024-04-06T14:00:00Z' },
  { _id: 'vp_007', user: 'user_003', course: 'course_004', video: 'vid_004_1_1', watchedSeconds: 720, durationSeconds: 720, isCompleted: true, lastWatchedAt: '2024-04-25T14:00:00Z' },
  { _id: 'vp_008', user: 'user_001', course: 'course_001', video: 'vid_001_2_2', watchedSeconds: 0, durationSeconds: 900, isCompleted: false, lastWatchedAt: '2024-03-07T14:00:00Z' },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const mockTestimonials: ITestimonial[] = [
  {
    _id: 'test_001',
    user: { _id: 'user_001', name: 'Priya Verma', city: 'Jaipur' },
    course: { _id: 'course_001', title: 'Beginner Blouse Stitching' },
    quote: 'इस कोर्स ने मेरी जिंदगी बदल दी। अब मैं घर बैठे ब्लाउज सिलती हूँ और अच्छी कमाई करती हूँ।',
    rating: 5,
  },
  {
    _id: 'test_002',
    user: { _id: 'user_002', name: 'Anita Singh', city: 'Lucknow' },
    course: { _id: 'course_002', title: 'Salwar Kameez Masterclass' },
    quote: 'बहुत ही सरल भाषा में सिखाया गया है। मैंने पहले कभी सिलाई नहीं की थी, अब पूरा सूट सिल लेती हूँ।',
    rating: 5,
  },
  {
    _id: 'test_003',
    user: { _id: 'user_005', name: 'Rekha Gupta', city: 'Kanpur' },
    course: { _id: 'course_004', title: 'Kurti Cutting & Stitching' },
    quote: 'सुनीता जी बहुत अच्छे से समझाती हैं। हर वीडियो में step-by-step guide मिलती है।',
    rating: 5,
  },
  {
    _id: 'test_004',
    user: { _id: 'user_007', name: 'Pooja Mishra', city: 'Bhopal' },
    course: { _id: 'course_003', title: 'Lehenga Choli Design' },
    quote: 'मेरी बेटी की शादी के लिए मैंने खुद लहंगा सिला। सबने तारीफ की। SilaiSikho का बहुत धन्यवाद।',
    rating: 5,
  },
];
