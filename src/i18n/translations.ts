export interface TranslationSchema {
  app: {
    name: string;
    tagline: string;
    subtitle: string;
    openApp: string;
    backToHome: string;
    darkMode: string;
    lightMode: string;
    language: string;
  };
  auth: {
    signIn: string;
    signUp: string;
    signOut: string;
    email: string;
    password: string;
    name: string;
    selectRole: string;
    quickSwitchSeed: string;
    seedNotice: string;
    dontHaveAccount: string;
    alreadyHaveAccount: string;
    loginSuccess: string;
    logoutSuccess: string;
    registeredSuccess: string;
    invalidCreds: string;
    onboardingTitle: string;
    onboardingSubtitle: string;
    step1Language: string;
    step2Exam: string;
    step3Subjects: string;
    step4Level: string;
    completeOnboarding: string;
    nextStep: string;
    prevStep: string;
  };
  roles: {
    student: string;
    teacher: string;
    parent: string;
    admin: string;
  };
  nav: {
    landing: string;
    dashboard: string;
    notes: string;
    ask: string;
    lectures: string;
    practice: string;
    flashcards: string;
    planner: string;
    teacherDesk: string;
    parentDesk: string;
    adminDesk: string;
  };
  landing: {
    badge: string;
    heroTitle: string;
    heroDescription: string;
    heroCtaPrimary: string;
    heroCtaSecondary: string;
    featurePauseTitle: string;
    featurePauseSubtitle: string;
    featurePauseText1: string;
    featurePauseText2: string;
    quoteSenior: string;
    subjectsHeading: string;
    subjectPhysics: string;
    subjectAccounts: string;
    subjectEconomics: string;
    subjectChemistry: string;
    notebookConceptHeading: string;
    notebookConceptDesc: string;
  };
  emptyStates: {
    dashboard: { title: string; description: string; action: string };
    notes: { title: string; description: string; action: string };
    ask: { title: string; description: string; action: string };
    lectures: { title: string; description: string; action: string };
    practice: { title: string; description: string; action: string };
    flashcards: { title: string; description: string; action: string };
    planner: { title: string; description: string; action: string };
  };
  common: {
    loading: string;
    retry: string;
    cancel: string;
    save: string;
    verifiedSource: string;
    confidenceHigh: string;
    mockActiveNotice: string;
    toastDismiss: string;
  };
}

export const translations: Record<'en' | 'hi', TranslationSchema> = {
  en: {
    app: {
      name: 'PadhAI',
      tagline: 'Your vernacular revision desk',
      subtitle: 'Notes, pause-and-ask video doubts, and exam-level practice in Hindi, Hinglish, and English.',
      openApp: 'Open Student Desk',
      backToHome: 'Back to Overview',
      darkMode: 'Night study mode',
      lightMode: 'Paper mode',
      language: 'Language',
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Create Account',
      signOut: 'Sign Out',
      email: 'Email address',
      password: 'Password',
      name: 'Full Name',
      selectRole: 'Select Role',
      quickSwitchSeed: 'Quick Login as Seed Persona',
      seedNotice: 'All seed accounts share password: Password@123',
      dontHaveAccount: "Don't have an account? Sign up",
      alreadyHaveAccount: 'Already have an account? Sign in',
      loginSuccess: 'Signed in successfully to notebook',
      logoutSuccess: 'Signed out from session',
      registeredSuccess: 'Account created! Complete your syllabus onboarding.',
      invalidCreds: 'Invalid credentials. Try using one of the seed accounts.',
      onboardingTitle: 'Student Syllabus Onboarding',
      onboardingSubtitle: 'Help us calibrate your desk so all doubt annotations cite the right chapters.',
      step1Language: 'Primary Study Language',
      step2Exam: 'Target Examination',
      step3Subjects: 'Active Subjects (Select all)',
      step4Level: 'Current Preparation Level',
      completeOnboarding: 'Save & Open My Desk',
      nextStep: 'Next Step',
      prevStep: 'Back',
    },
    roles: {
      student: 'Student',
      teacher: 'Teacher / Faculty',
      parent: 'Parent',
      admin: 'Administrator',
    },
    nav: {
      landing: 'Overview',
      dashboard: 'Desk',
      notes: 'Notes',
      ask: 'Ask',
      lectures: 'Lectures',
      practice: 'Practice',
      flashcards: 'Flashcards',
      planner: 'Planner',
      teacherDesk: 'Faculty Desk',
      parentDesk: 'Parent Monitor',
      adminDesk: 'System Admin',
    },
    landing: {
      badge: 'CBSE, State Boards & Competitive Prep',
      heroTitle: 'Study from your own notes. In the language you actually think in.',
      heroDescription: 'Upload class notes, pause tricky lecture videos to ask instant doubts, and practice real exam questions. Without fake AI jargon, without jumping ahead in the lecture.',
      heroCtaPrimary: 'Open Study Desk',
      heroCtaSecondary: 'How "Pause & Ask" Works',
      featurePauseTitle: 'Why Pause & Ask is Different',
      featurePauseSubtitle: 'The teacher in the video hasn’t explained the formula yet? We won’t spoil it.',
      featurePauseText1: 'Standard chatbots search the entire web and summarize the end of the video, confusing you with formulas you haven’t reached yet.',
      featurePauseText2: 'PadhAI respects your exact timestamp. When you pause at 14:20 of Ray Optics, it explains only what Sir has taught up to 14:20, using your own notebook definitions.',
      quoteSenior: '"A senior bhaiya who sits next to you with a pencil, marks where you got stuck, and explains in simple Hindi."',
      subjectsHeading: 'Built for actual subjects tested across India',
      subjectPhysics: 'Physics (Class 12 & JEE)',
      subjectAccounts: 'Accountancy (Partnership & Cash Flow)',
      subjectEconomics: 'Economics (Macroeconomics & Indian Dev)',
      subjectChemistry: 'Chemistry (Organic Reactions & NCERT)',
      notebookConceptHeading: 'The Notebook Rule',
      notebookConceptDesc: 'No futuristic neon gradients or AI bubbles. Your study desk looks like clean ruled paper with ink notes, a marigold bookmark, and red ink only when correcting a calculation.',
    },
    emptyStates: {
      dashboard: {
        title: 'Your study desk is quiet today',
        description: 'Upload your first set of notes or pick a chapter to start revising for your upcoming term test.',
        action: 'Add Your First Notes',
      },
      notes: {
        title: 'No notebooks on this shelf yet',
        description: 'Upload photos of handwritten pages, NCERT PDFs, or class lecture notes to start building your chapter index.',
        action: 'Upload Chapter Notes',
      },
      ask: {
        title: 'Ask a doubt from your syllabus',
        description: 'Whenever you get stuck in a derivation or balance sheet, write your question here. We ground every answer in your notebook.',
        action: 'Write a Question',
      },
      lectures: {
        title: 'No lectures loaded on the desk',
        description: 'Paste a video lecture link. You will be able to pause at any exact second and clear doubts without spoilers.',
        action: 'Add Lecture Video',
      },
      practice: {
        title: 'Practice test sheet is blank',
        description: 'Generate 5-mark and 3-mark questions directly from your uploaded chapters with realistic CBSE/Board marking schemes.',
        action: 'Generate Practice Set',
      },
      flashcards: {
        title: 'Flashcard box is empty',
        description: 'Formulas, definitions, and journal entries will appear here for 5-minute active recall drills.',
        action: 'Create First Deck',
      },
      planner: {
        title: 'No upcoming exam deadlines set',
        description: 'Mark your board exam dates, weekly physics revision targets, and pending numerical chapters.',
        action: 'Add Exam Target',
      },
    },
    common: {
      loading: 'Writing on paper...',
      retry: 'Try again',
      cancel: 'Cancel',
      save: 'Save',
      verifiedSource: 'Verified from Page 14',
      confidenceHigh: 'High syllabus confidence',
      mockActiveNotice: 'Mock Mode Active (Offline)',
      toastDismiss: 'Dismiss',
    }
  },
  hi: {
    app: {
      name: 'पढ़AI',
      tagline: 'आपकी अपनी भाषा में रिविज़न डेस्क',
      subtitle: 'आपके खुद के नोट्स, वीडियो पॉज़-डाउट्स और असली परीक्षा स्तर का अभ्यास — हिंदी, हिंग्लिश और अंग्रेजी में।',
      openApp: 'स्टूडेंट डेस्क खोलें',
      backToHome: 'होम ओवरव्यू',
      darkMode: 'रात का अध्ययन मोड',
      lightMode: 'कागज़ मोड',
      language: 'भाषा',
    },
    auth: {
      signIn: 'लॉग इन करें',
      signUp: 'नया खाता बनाएं',
      signOut: 'लॉग आउट',
      email: 'ईमेल पता',
      password: 'पासवर्ड',
      name: 'पूरा नाम',
      selectRole: 'भूमिका चुनें',
      quickSwitchSeed: 'सीड प्रोफाइल से तुरंत लॉगिन करें',
      seedNotice: 'सभी सीड खातों का पासवर्ड: Password@123',
      dontHaveAccount: 'खाता नहीं है? नया बनाएं',
      alreadyHaveAccount: 'पहले से खाता है? लॉग इन करें',
      loginSuccess: 'सफलतापूर्वक नोटबुक में लॉगिन हुआ',
      logoutSuccess: 'सत्र समाप्त हुआ',
      registeredSuccess: 'खाता बन गया! अपना सिलेबस ऑनबोर्डिंग पूरा करें।',
      invalidCreds: 'गलत ईमेल या पासवर्ड। कृपया सीड खातों में से चुनें।',
      onboardingTitle: 'छात्र सिलेबस ऑनबोर्डिंग',
      onboardingSubtitle: 'अपनी डेस्क सेट करें ताकि शंकाओं के समाधान सटीक अध्यायों से मिलें।',
      step1Language: 'अध्ययन की मुख्य भाषा',
      step2Exam: 'लक्षित परीक्षा',
      step3Subjects: 'सक्रिय विषय (सभी चुनें)',
      step4Level: 'तैयारी का वर्तमान स्तर',
      completeOnboarding: 'सहेजें और डेस्क खोलें',
      nextStep: 'अगला चरण',
      prevStep: 'पीछे',
    },
    roles: {
      student: 'विद्यार्थी',
      teacher: 'शिक्षक / फैकल्टी',
      parent: 'अभिभावक',
      admin: 'प्रशासक',
    },
    nav: {
      landing: 'अवलोकन',
      dashboard: 'डेस्क',
      notes: 'नोट्स',
      ask: 'पूछें',
      lectures: 'लेक्चर्स',
      practice: 'अभ्यास',
      flashcards: 'फ्लैशकार्ड्स',
      planner: 'प्लानर',
      teacherDesk: 'फैकल्टी डेस्क',
      parentDesk: 'पैरेंट मॉनिटर',
      adminDesk: 'सिस्टम एडमिन',
    },
    landing: {
      badge: 'सीबीएसई, स्टेट बोर्ड और प्रतियोगी परीक्षाओं की तैयारी',
      heroTitle: 'अपने नोट्स से पढ़ें। उस भाषा में जिसमें आप सच में सोचते हैं।',
      heroDescription: 'क्लास के नोट्स अपलोड करें, कठिन लेक्चर वीडियो रोककर तुरंत सवाल पूछें, और बिना किसी दिखावे या आगे का सस्पेंस बिगाड़े सीधे परीक्षा-उन्मुख अभ्यास करें।',
      heroCtaPrimary: 'स्टडी डेस्क खोलें',
      heroCtaSecondary: '"पॉज़ और पूछें" कैसे काम करता है?',
      featurePauseTitle: 'पॉज़ और पूछें (Pause & Ask) अलग क्यों है?',
      featurePauseSubtitle: 'अगर शिक्षक ने वीडियो में आगे का फ़ॉर्मूला अभी नहीं पढ़ाया, तो हम भी आगे का स्पॉइलर नहीं देंगे।',
      featurePauseText1: 'आम चैटबॉट्स पूरा इंटरनेट खंगाल कर वीडियो के अंत का सारांश दे देते हैं, जिससे आप ऐसे फ़ॉर्मूले देखकर उलझ जाते हैं जो आपने अभी तक पढ़े ही नहीं।',
      featurePauseText2: 'पढ़AI आपके सटीक समय (टाइमस्टैम्प) का ध्यान रखता है। अगर आपने रे-ऑप्टिक्स में 14:20 पर वीडियो रोका, तो वह केवल 14:20 तक पढ़ाए गए हिस्से से ही आपकी अपनी नोटबुक के अनुसार समझाएगा।',
      quoteSenior: '"एक सीनियर भैया की तरह, जो पास बैठकर पेंसिल से मार्क करता है और सरल हिंदी में समझाता है।"',
      subjectsHeading: 'भारत के प्रमुख बोर्ड विषयों के लिए तैयार',
      subjectPhysics: 'भौतिक विज्ञान (12वीं और जेईई)',
      subjectAccounts: 'लेखाशास्त्र (पार्टनरशिप व कैश फ्लो)',
      subjectEconomics: 'अर्थशास्त्र (मैक्रोइकॉनॉमिक्स व भारतीय विकास)',
      subjectChemistry: 'रसायन विज्ञान (ऑर्गेनिक व एनसीईआरटी)',
      notebookConceptHeading: 'साफ़ नोटबुक का नियम',
      notebookConceptDesc: 'कोई चमक-दमक या कृत्रिम नीले-बैंगनी ग्रेडिएंट नहीं। आपकी डेस्क साफ़ कागज़, नीली स्याही, गेंदे के रंग का मार्कर, और लाल स्याही केवल ग़लती सुधारने के लिए प्रयोग करती है।',
    },
    emptyStates: {
      dashboard: {
        title: 'आज आपकी स्टडी डेस्क शांत है',
        description: 'अपने पहले नोट्स जोड़ें या आने वाले टेस्ट के लिए कोई अध्याय चुनकर दोहराना शुरू करें।',
        action: 'पहले नोट्स जोड़ें',
      },
      notes: {
        title: 'अलमारी में अभी कोई नोटबुक नहीं है',
        description: 'हाथ से लिखे पन्नों की फ़ोटो, एनसीईआरटी पीडीएफ या क्लास नोट्स जोड़ें ताकि आपकी इंडेक्स बन सके।',
        action: 'चैप्टर नोट्स अपलोड करें',
      },
      ask: {
        title: 'सिलेबस से कोई भी सवाल पूछें',
        description: 'जब भी किसी सूत्र या लेजर एंट्री में अटकें, यहाँ लिखें। उत्तर हमेशा आपकी नोटबुक के आधार पर दिया जाएगा।',
        action: 'सवाल लिखें',
      },
      lectures: {
        title: 'डेस्क पर अभी कोई वीडियो लेक्चर नहीं है',
        description: 'किसी भी लेक्चर का लिंक डालें। आप किसी भी सेकंड पर रोककर बिना स्पॉइलर के अपनी शंका दूर कर सकेंगे।',
        action: 'लेक्चर वीडियो जोड़ें',
      },
      practice: {
        title: 'अभ्यास उत्तर-पुस्तिका अभी खाली है',
        description: 'अपने अपलोड किए गए अध्यायों से 3-मार्क्स और 5-मार्क्स के असली बोर्ड पैटर्न प्रश्न पत्र तैयार करें।',
        action: 'अभ्यास सेट बनाएं',
      },
      flashcards: {
        title: 'फ्लैशकार्ड का डिब्बा अभी खाली है',
        description: 'यहाँ महत्वपूर्ण परिभाषाएं, सूत्र और फॉर्मूले 5 मिनट के त्वरित रिविज़न के लिए दिखेंगे।',
        action: 'पहला डेक बनाएं',
      },
      planner: {
        title: 'परीक्षा की कोई समयसीमा तय नहीं है',
        description: 'अपनी बोर्ड परीक्षा की तारीखें, साप्ताहिक फ़िज़िक्स रिविज़न और बाक़ी बचे चैप्टर्स दर्ज करें।',
        action: 'परीक्षा लक्ष्य जोड़ें',
      },
    },
    common: {
      loading: 'कागज़ पर लिखा जा रहा है...',
      retry: 'पुनः प्रयास करें',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      verifiedSource: 'पृष्ठ 14 से प्रमाणित',
      confidenceHigh: 'सिलेबस में उच्च सटीकता',
      mockActiveNotice: 'मॉक मोड सक्रिय (ऑफ़लाइन)',
      toastDismiss: 'हटाएं',
    }
  }
};

export type TranslationKey = TranslationSchema;
