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
    pageWord: string;
    heroTitleA: string;
    heroTitleMark: string;
    heroTitleB: string;
    heroSubline: string;
    heroPrimary: string;
    heroSecondary: string;
    heroNote: string;
    freeToStart: string;
    feelingHeading: string;
    feeling1: string;
    feeling2: string;
    feeling3: string;
    feeling4: string;
    feelingMarginNote: string;
    howHeading: string;
    step1Title: string;
    step1Text: string;
    step2Title: string;
    step2Text: string;
    step3Title: string;
    step3Text: string;
    pauseHeading: string;
    pauseNote: string;
    pauseBadge: string;
    pauseMarginNote: string;
    pauseButton: string;
    pauseReveal: string;
    languageHeading: string;
    languageLine: string;
    slipHindiLabel: string;
    slipHindiText: string;
    slipTamilLabel: string;
    slipTamilText: string;
    slipBengaliLabel: string;
    slipBengaliText: string;
    slipEnglishLabel: string;
    slipEnglishText: string;
    examWord: string;
    examWordLabel: string;
    promisesHeading: string;
    promiseMadeTitle: string;
    promiseMadeText: string;
    promiseYoursTitle: string;
    promiseYoursText: string;
    promiseSlowTitle: string;
    promiseSlowText: string;
    promiseTalkTitle: string;
    promiseTalkText: string;
    promisePracticeTitle: string;
    promisePracticeText: string;
    promiseTeacherTitle: string;
    promiseTeacherText: string;
    studentNoteLabel: string;
    studentNoteQuote: string;
    studentNoteSign: string;
    studentNoteDisclaimer: string;
    closingTitle: string;
    closingButton: string;
    footerNote: string;
    footerSignature: string;
    footerFeeling: string;
    footerHow: string;
    footerPromises: string;
    footerTop: string;
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
      invalidCreds: 'Incorrect email or password. Please try again.',
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
      pageWord: 'page',
      heroTitleA: 'Padhai ab ',
      heroTitleMark: 'samajh',
      heroTitleB: ' mein aayegi.',
      heroSubline: 'Ruko, poocho, aur khud samjho. Apni bhasha mein.',
      heroPrimary: 'Start with one page',
      heroSecondary: 'See how it feels',
      heroNote: 'Ye samajh nahi aaya? Koi baat nahi.',
      freeToStart: 'Free to start. No tension.',
      feelingHeading: 'We know this feeling',
      feeling1: "Sir ne kaha, 'sab clear hai?' Aur tumne haan bol diya.",
      feeling2: 'Raat ke 11 baje doubt aaya, aur poochne wala koi nahi.',
      feeling3: 'Book English mein hai, samajh Hindi mein aata hai.',
      feeling4: 'Answer mil gaya, par yaad kuch nahi raha.',
      feelingMarginNote: 'You are not slow. You just need a better way.',
      howHeading: 'How PadhAI sits next to you',
      step1Title: 'Bring your own notes',
      step1Text: 'Photo of your copy, a PDF, anything you study from.',
      step2Title: 'Pause and ask',
      step2Text: 'Stuck in a lecture? Pause and ask, just like you would ask a friend.',
      step3Title: 'Understand it yourself',
      step3Text: 'We guide you to the answer instead of handing it over, so it actually stays.',
      pauseHeading: 'We will not spoil the story.',
      pauseNote: 'Hmm, good question. Your teacher explains this a little later. Here is a small hint till then…',
      pauseBadge: 'Paused',
      pauseMarginNote: 'right where you stopped',
      pauseButton: 'Show me anyway',
      pauseReveal: 'For now, look at the diagram once and say out loud what you already know. That is usually enough to keep going.',
      languageHeading: 'Your language, your way',
      languageLine: "Understand in your language. Write it in the exam's language.",
      slipHindiLabel: 'Hindi',
      slipHindiText: 'बल से चीज़ें चलती हैं।',
      slipTamilLabel: 'Tamil',
      slipTamilText: 'விசையால் பொருள்கள் நகரும்.',
      slipBengaliLabel: 'Bengali',
      slipBengaliText: 'বল প্রয়োগে জিনিস নড়ে।',
      slipEnglishLabel: 'English',
      slipEnglishText: 'Force makes things move.',
      examWord: 'Force',
      examWordLabel: 'in the exam',
      promisesHeading: 'Small promises',
      promiseMadeTitle: 'Made from your own notes',
      promiseMadeText: 'Not from some random corner of the internet.',
      promiseYoursTitle: 'Your notes stay yours',
      promiseYoursText: 'We never pass them on to anyone else.',
      promiseSlowTitle: 'Works on slow internet',
      promiseSlowText: 'One bar is enough. Really.',
      promiseTalkTitle: 'Talk instead of typing',
      promiseTalkText: 'When your hands are tired, just speak.',
      promisePracticeTitle: 'Practice that fits you',
      promisePracticeText: 'Not the whole syllabus in one night.',
      promiseTeacherTitle: 'Your teacher sees where you got stuck',
      promiseTeacherText: 'So nobody has to guess.',
      studentNoteLabel: "A student's note",
      studentNoteQuote: 'Pehli baar laga ki padhai mujhse dosti kar rahi hai.',
      studentNoteSign: '— a student like you',
      studentNoteDisclaimer: 'An example line, not a real student and not a customer review.',
      closingTitle: 'Aaj bas ek page se shuru karo.',
      closingButton: 'Open my notebook',
      footerNote: 'No card needed. Just your copy.',
      footerSignature: 'PadhAI · for the 11 pm doubt',
      footerFeeling: 'The feeling',
      footerHow: 'How it sits with you',
      footerPromises: 'Small promises',
      footerTop: 'Back to the top',
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
      invalidCreds: 'गलत ईमेल या पासवर्ड। कृपया दोबारा प्रयास करें।',
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
      pageWord: 'पन्ना',
      heroTitleA: 'पढ़ाई अब ',
      heroTitleMark: 'समझ',
      heroTitleB: ' में आएगी।',
      heroSubline: 'रुकिए, पूछिए, और खुद समझिए। अपनी भाषा में।',
      heroPrimary: 'एक पन्ने से शुरू करें',
      heroSecondary: 'देखिए, कैसा लगता है',
      heroNote: 'ये समझ नहीं आया? कोई बात नहीं।',
      freeToStart: 'शुरू करना मुफ़्त है। कोई टेंशन नहीं।',
      feelingHeading: 'यह एहसास हम जानते हैं',
      feeling1: "सर ने पूछा, 'सब समझ आया?' और तुमने हाँ बोल दिया।",
      feeling2: 'रात के 11 बजे doubt आया, और पूछने वाला कोई नहीं।',
      feeling3: 'किताब अंग्रेज़ी में है, समझ हिंदी में आता है।',
      feeling4: 'जवाब मिल गया, पर याद कुछ नहीं रहा।',
      feelingMarginNote: 'आप कमज़ोर नहीं हैं। बस तरीका बदलना है।',
      howHeading: 'पढ़AI आपके बगल में कैसे बैठता है',
      step1Title: 'अपने ही नोट्स लाइए',
      step1Text: 'अपनी कॉपी की फ़ोटो या PDF, जो भी आप पढ़ते हैं।',
      step2Title: 'रुकिए और पूछिए',
      step2Text: 'लेक्चर में अटक गए? रुकिए और पूछिए, जैसे दोस्त से पूछते हैं।',
      step3Title: 'खुद समझिए',
      step3Text: 'हम जवाब थमाते नहीं, रास्ता दिखाते हैं, ताकि बात सच में याद रहे।',
      pauseHeading: 'कहानी का मज़ा खराब नहीं करेंगे।',
      pauseNote: 'अच्छा सवाल! टीचर आगे इसे समझाएँगे। तब तक एक छोटा सा hint।',
      pauseBadge: 'रुका हुआ',
      pauseMarginNote: 'जहाँ आपने रोका, वहीं से',
      pauseButton: 'फिर भी दिखाओ',
      pauseReveal: 'अभी के लिए आकृति को एक बार देखिए और जो पहले से पता है, वह बोलकर कहिए। बस इतना ही काफ़ी होता है।',
      languageHeading: 'आपकी भाषा, आपका तरीका',
      languageLine: 'अपनी भाषा में समझिए। परीक्षा की भाषा में लिखिए।',
      slipHindiLabel: 'हिंदी',
      slipHindiText: 'बल से चीज़ें चलती हैं।',
      slipTamilLabel: 'तमिल',
      slipTamilText: 'விசையால் பொருள்கள் நகரும்.',
      slipBengaliLabel: 'बांग्ला',
      slipBengaliText: 'বল প্রয়োগে জিনিস নড়ে।',
      slipEnglishLabel: 'अंग्रेज़ी',
      slipEnglishText: 'Force makes things move.',
      examWord: 'Force',
      examWordLabel: 'परीक्षा में',
      promisesHeading: 'छोटे-छोटे वादे',
      promiseMadeTitle: 'आपके अपने नोट्स से बना',
      promiseMadeText: 'इंटरनेट के किसी कोने से नहीं।',
      promiseYoursTitle: 'आपके नोट्स आपके ही रहते हैं',
      promiseYoursText: 'हम उन्हें किसी और को नहीं देते।',
      promiseSlowTitle: 'धीमे इंटरनेट पर भी चलता है',
      promiseSlowText: 'एक बार भी बहुत है।',
      promiseTalkTitle: 'टाइप करने की जगह बोलिए',
      promiseTalkText: 'हाथ थक जाएँ तो बस बोल दीजिए।',
      promisePracticeTitle: 'आपके हिसाब से अभ्यास',
      promisePracticeText: 'एक रात में पूरा सिलेबस नहीं।',
      promiseTeacherTitle: 'टीचर को दिखता है कि आप कहाँ अटके',
      promiseTeacherText: 'ताकि किसी को अंदाज़ा न लगाना पड़े।',
      studentNoteLabel: 'एक विद्यार्थी का नोट',
      studentNoteQuote: 'पहली बार लगा कि पढ़ाई मुझसे दोस्ती कर रही है।',
      studentNoteSign: '— आप जैसा एक विद्यार्थी',
      studentNoteDisclaimer: 'यह सिर्फ़ एक उदाहरण पंक्ति है, किसी असली विद्यार्थी या ग्राहक की समीक्षा नहीं।',
      closingTitle: 'आज बस एक पन्ने से शुरू कीजिए।',
      closingButton: 'मेरी कॉपी खोलें',
      footerNote: 'कार्ड की ज़रूरत नहीं। बस आपकी कॉपी।',
      footerSignature: 'पढ़AI · रात 11 बजे वाली शंका के लिए',
      footerFeeling: 'यह एहसास',
      footerHow: 'हम कैसे पास बैठते हैं',
      footerPromises: 'छोटे वादे',
      footerTop: 'ऊपर वापस',
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
