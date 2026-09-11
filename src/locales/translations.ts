import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  appTagline: string;
  mahaGov: string;
  deptAgri: string;
  heroHeadline: string;
  heroSubtitle: string;
  login: string;
  register: string;
  logout: string;
  mobileNumber: string;
  password: string;
  fullName: string;
  preferredLanguage: string;
  createFarmerAccount: string;
  alreadyHaveAccount: string;
  benefitScanTitle: string;
  benefitScanDesc: string;
  benefitRiskTitle: string;
  benefitRiskDesc: string;
  benefitActionTitle: string;
  benefitActionDesc: string;
  namasteFarmer: string;
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  farmHealth: string;
  mostlyHealthy: string;
  attentionNeeded: string;
  criticalAttention: string;
  fields: string;
  alerts: string;
  scanYourCrop: string;
  viewMyFields: string;
  recentAlert: string;
  highRisk: string;
  mediumRisk: string;
  lowRisk: string;
  viewDetails: string;
  registerNewField: string;
  fieldName: string;
  crop: string;
  variety: string;
  growthStage: string;
  area: string;
  location: string;
  acres: string;
  irrigation: string;
  irrigationWait: string;
  irrigationIrrigate: string;
  irrigationNormal: string;
  irrigationDrain: string;
  riskReason: string;
  latestDiagnosis: string;
  confidence: string;
  viewDiagnosis: string;
  scanThisField: string;
  takeClearPhotoPrompt: string;
  takePhoto: string;
  chooseFromGallery: string;
  instruction1: string;
  instruction2: string;
  instruction3: string;
  instruction4: string;
  qualityCheckTitle: string;
  photoUnclearWarning: string;
  holdSteady: string;
  moveCloser: string;
  addMoreLight: string;
  retakePhoto: string;
  useThisPhoto: string;
  analyzeCrop: string;
  analyzingCrop: string;
  checkingSymptoms: string;
  pleaseWait: string;
  diseaseDetected: string;
  aiDiagnosed: string;
  aiDisclaimer: string;
  whatShouldIDo: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  escalateIf: string;
  hearAdvisory: string;
  scheduleFollowUp: string;
  needsExpertReview: string;
  lowConfidenceNote: string;
  caseSentToOfficer: string;
  caseId: string;
  submittedTime: string;
  checkReviewStatus: string;
  howIsCropNow: string;
  improved: string;
  worsened: string;
  worsenedRetakeNote: string;
  recheckRecorded: string;
  unreadAlerts: string;
  noAlerts: string;
  markAsRead: string;
  speak: string;
  listening: string;
  voiceNotSupported: string;
  voiceHint: string;
  demoModeBanner: string;
  offlineMockActive: string;
  serverConnected: string;
  switchDemoFlow: string;
  cotton: string;
  soybean: string;
  tur: string;
  sugarcane: string;
  gram: string;
  back: string;
  home: string;
  save: string;
  cancel: string;
  Maize: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'CropShield AI',
    appTagline: 'Maharashtra Crop Health Intelligence & IPM Advisory',
    mahaGov: 'Government of Maharashtra',
    deptAgri: 'Department of Agriculture • MSIS',
    heroHeadline: 'Protect your crop before the damage spreads.',
    heroSubtitle:
      'CropShield helps farmers detect crop problems early, understand weather risk, and take the right action with trusted agricultural advisories.',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    mobileNumber: 'Mobile Number',
    password: 'Password',
    fullName: 'Full Name',
    preferredLanguage: 'Preferred Language',
    createFarmerAccount: 'Create farmer account',
    alreadyHaveAccount: 'Already have an account? Login',
    benefitScanTitle: 'Scan your crop',
    benefitScanDesc: 'Take a clear leaf photo to identify pests and diseases instantly with AI.',
    benefitRiskTitle: 'Know your risk',
    benefitRiskDesc: 'Receive localized early warnings based on micro-climate weather triggers.',
    benefitActionTitle: 'Take the right action',
    benefitActionDesc: 'Follow non-toxic university-approved IPM steps to cure infestations safely.',
    namasteFarmer: 'Namaste, Farmer 👋',
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    farmHealth: 'Your Farm Health',
    mostlyHealthy: 'Mostly Healthy',
    attentionNeeded: 'Needs Attention',
    criticalAttention: 'Critical Action Needed',
    fields: 'Fields',
    alerts: 'Alerts',
    scanYourCrop: 'Scan Your Crop',
    viewMyFields: 'View My Fields',
    recentAlert: 'Recent Alert',
    highRisk: 'HIGH RISK',
    mediumRisk: 'MEDIUM RISK',
    lowRisk: 'LOW RISK',
    viewDetails: 'View Details',
    registerNewField: '+ Register New Field',
    fieldName: 'Field Name',
    crop: 'Crop',
    variety: 'Variety',
    growthStage: 'Growth Stage',
    area: 'Area (Acres)',
    location: 'Location / District',
    acres: 'acres',
    irrigation: 'Irrigation Advisory',
    irrigationWait: 'WAIT (Hold irrigation)',
    irrigationIrrigate: 'IRRIGATE NOW',
    irrigationNormal: 'NORMAL SCHEDULE',
    irrigationDrain: 'DRAIN EXCESS WATER',
    riskReason: 'Why this risk?',
    latestDiagnosis: 'Latest Crop Diagnosis',
    confidence: 'AI confidence',
    viewDiagnosis: 'View Diagnosis',
    scanThisField: 'Scan This Field',
    takeClearPhotoPrompt: 'Take a clear photo of the affected leaf or plant.',
    takePhoto: 'Take Photo',
    chooseFromGallery: 'Choose from Gallery',
    instruction1: 'Keep the leaf inside the frame',
    instruction2: 'Use good natural daylight',
    instruction3: 'Avoid blurry or shaky photos',
    instruction4: 'Show the affected spotted area clearly',
    qualityCheckTitle: 'Image Quality Verification',
    photoUnclearWarning: 'Photo may be unclear or poorly lit.',
    holdSteady: 'Hold steady',
    moveCloser: 'Move closer to the leaf',
    addMoreLight: 'Add more light or avoid shadows',
    retakePhoto: 'Retake Photo',
    useThisPhoto: 'Use This Photo',
    analyzeCrop: 'Analyze Crop',
    analyzingCrop: 'Analyzing your crop...',
    checkingSymptoms: 'Checking for disease symptoms and pest patterns',
    pleaseWait: 'Please wait a moment...',
    diseaseDetected: 'Disease Detected',
    aiDiagnosed: 'AI-diagnosed',
    aiDisclaimer:
      'This is an AI-assisted result. If symptoms worsen or do not match, contact your local Taluka Agriculture Officer.',
    whatShouldIDo: 'What should I do? (IPM Action Plan)',
    step1: 'Step 1: REMOVE',
    step2: 'Step 2: PROTECT',
    step3: 'Step 3: MONITOR',
    step4: 'Step 4: ESCALATE',
    escalateIf: 'Escalate if symptoms continue spreading after 5 days.',
    hearAdvisory: 'Hear Advisory',
    scheduleFollowUp: 'Schedule Follow-up',
    needsExpertReview: 'Needs Expert Review',
    lowConfidenceNote: 'CropShield could not identify the problem with enough confidence.',
    caseSentToOfficer: 'Your case has been sent to an agriculture officer for verification.',
    caseId: 'Case ID',
    submittedTime: 'Submitted Time',
    checkReviewStatus: 'Check Review Status',
    howIsCropNow: 'How is your crop now?',
    improved: 'Improved / Recovering',
    worsened: 'Worsened / Spread',
    worsenedRetakeNote: 'Please take another photo to re-evaluate the condition.',
    recheckRecorded: 'Follow-up status recorded successfully.',
    unreadAlerts: 'Unread Alerts',
    noAlerts: 'No unread alerts. Your fields are safe.',
    markAsRead: 'Mark as read',
    speak: 'Speak',
    listening: 'Listening... Speak your command',
    voiceNotSupported: 'Voice input is not supported on this device.',
    voiceHint: 'Try: "Scan my cotton field", "Show alerts", "Open advisory"',
    demoModeBanner: 'Demo Mode Active • Person 4 Client (REST Mock Mode)',
    offlineMockActive: 'Offline Mock Mode (No backend required)',
    serverConnected: 'Connected to Backend (http://localhost:8000/api)',
    switchDemoFlow: 'Demo Flows',
    cotton: 'Cotton',
    soybean: 'Soybean',
    tur: 'Pigeonpea (Tur)',
    sugarcane: 'Sugarcane',
    gram: 'Gram (Chana)',
    back: 'Back',
    home: 'Home',
    save: 'Save Field',
    cancel: 'Cancel',
    Maize: 'Maize',
  },
  mr: {
    appName: 'क्रॉपशील्ड एआय',
    appTagline: 'महाराष्ट्र पीक आरोग्य बुद्धिमत्ता आणि कृषी सल्लागार',
    mahaGov: 'महाराष्ट्र शासन',
    deptAgri: 'कृषी विभाग • महाराष्ट्र स्टेट इनोव्हेशन सोसायटी',
    heroHeadline: 'रोग पसरण्यापूर्वी आपल्या पिकाचे रक्षण करा.',
    heroSubtitle:
      'क्रॉपशील्ड शेतकऱ्यांना पिकातील कीड व रोगांचा वेळेवर शोध घेण्यास, हवामानाचा धोका समजून घेण्यास आणि योग्य कृषी सल्ला देण्यास मदत करते.',
    login: 'लॉगिन करा',
    register: 'नवीन नोंदणी',
    logout: 'बाहेर पडा',
    mobileNumber: 'मोबाईल क्रमांक',
    password: 'पासवर्ड',
    fullName: 'शेतकऱ्याचे संपूर्ण नाव',
    preferredLanguage: 'पसंतीची भाषा',
    createFarmerAccount: 'नवीन शेतकरी खाते तयार करा',
    alreadyHaveAccount: 'आधीच खाते आहे का? लॉगिन करा',
    benefitScanTitle: 'पिकाचा फोटो स्कॅन करा',
    benefitScanDesc: 'कीड व रोगांची झटपट ओळख करण्यासाठी पानाचा स्पष्ट फोटो काढा.',
    benefitRiskTitle: 'हवामानाचा धोका ओळखा',
    benefitRiskDesc: 'स्थानिक हवामानातील बदलांनुसार रोग प्रादुर्भावाची पूर्वसूचना मिळवा.',
    benefitActionTitle: 'योग्य उपाययोजना करा',
    benefitActionDesc: 'कृषी विद्यापीठाने प्रमाणित केलेल्या सुरक्षित व सेंद्रिय उपायांचे पालन करा.',
    namasteFarmer: 'नमस्ते, शेतकरी बांधव 👋',
    goodMorning: 'शुभ सकाळ',
    goodAfternoon: 'शुभ दुपार',
    goodEvening: 'शुभ संध्याकाळ',
    farmHealth: 'तुमच्या शेताचे आरोग्य',
    mostlyHealthy: 'मुख्यतः निरोगी',
    attentionNeeded: 'लक्ष देणे आवश्यक',
    criticalAttention: 'त्वरित उपाययोजना आवश्यक',
    fields: 'नोंदणीकृत शेते',
    alerts: 'सूचना',
    scanYourCrop: 'पीक स्कॅन करा',
    viewMyFields: 'माझी शेती पहा',
    recentAlert: 'ताजी सूचना',
    highRisk: 'मोठा धोका (HIGH RISK)',
    mediumRisk: 'मध्यम धोका (MEDIUM)',
    lowRisk: 'कमी धोका (LOW)',
    viewDetails: 'तपशील पहा',
    registerNewField: '+ नवीन शेत नोंदवा',
    fieldName: 'शेताचे नाव',
    crop: 'मुख्य पीक',
    variety: 'वाण / प्रकार',
    growthStage: 'वाढीची अवस्था',
    area: 'क्षेत्रफळ (एकर)',
    location: 'गाव / जिल्हा',
    acres: 'एकर',
    irrigation: 'पाणी देण्याचा सल्ला',
    irrigationWait: 'पाणी देणे थांबवा (WAIT)',
    irrigationIrrigate: 'त्वरित पाणी द्या',
    irrigationNormal: 'नियमित वेळापत्रक',
    irrigationDrain: 'साचलेले पाणी काढून टाका',
    riskReason: 'धोक्याचे कारण',
    latestDiagnosis: 'पिकाचे ताजे निदान',
    confidence: 'एआय अचूकता',
    viewDiagnosis: 'निदान पहा',
    scanThisField: 'या शेताचे स्कॅन करा',
    takeClearPhotoPrompt: 'बाधित पानाच्या किंवा झाडाच्या भागाचा स्पष्ट फोटो घ्या.',
    takePhoto: 'कॅमेऱ्याने फोटो घ्या',
    chooseFromGallery: 'गॅलरीमधून निवडा',
    instruction1: 'पान पूर्णपणे चौकटीत ठेवा',
    instruction2: 'चांगल्या सूर्यप्रकाशात फोटो काढा',
    instruction3: 'हात थरथरू न देता स्पष्ट फोटो घ्या',
    instruction4: 'रोगाचे ठिपके किंवा कीड स्पष्ट दिसू द्या',
    qualityCheckTitle: 'फोटो तपासणी',
    photoUnclearWarning: 'फोटो अस्पष्ट किंवा अंधुक वाटत आहे.',
    holdSteady: 'हात स्थिर ठेवा',
    moveCloser: 'पानाच्या जवळ जा',
    addMoreLight: 'अधिक प्रकाशात फोटो घ्या किंवा सावली टाळा',
    retakePhoto: 'पुन्हा फोटो काढा',
    useThisPhoto: 'हाच फोटो वापरा',
    analyzeCrop: 'पिकाची तपासणी करा',
    analyzingCrop: 'पिकाचे विश्लेषण सुरू आहे...',
    checkingSymptoms: 'रोगाची लक्षणे व किडीचा शोध घेतला जात आहे',
    pleaseWait: 'कृपया थोडा वेळ थांबा...',
    diseaseDetected: 'रोगाची लागण आढळली',
    aiDiagnosed: 'एआय-तपासलेले निदान',
    aiDisclaimer:
      'हा एआय-आधारित सल्ला आहे. लक्षणे वाढल्यास किंवा न जुळल्यास आपल्या तालुका कृषी अधिकाऱ्यांशी संपर्क साधा.',
    whatShouldIDo: 'मी आता काय करावे? (कृती योजना)',
    step1: 'पायरी १: बाधित पाने काढा',
    step2: 'पायरी २: सुरक्षित फवारणी करा',
    step3: 'पायरी ३: ५ दिवस निरीक्षण करा',
    step4: 'पायरी ४: गरज भासल्यास संपर्क करा',
    escalateIf: '५ दिवसांनंतरही रोग पसरत राहिल्यास कृषी अधिकाऱ्यांना दाखवा.',
    hearAdvisory: 'सल्ला ऐका',
    scheduleFollowUp: 'पुढील तपासणी नोंदवा',
    needsExpertReview: 'तज्ज्ञ अधिकाऱ्यांच्या तपासणीची गरज',
    lowConfidenceNote: 'क्रॉपशील्ड एआय या रोगाची पूर्ण खात्री करू शकले नाही.',
    caseSentToOfficer: 'तुमची केस पडताळणीसाठी कृषी अधिकाऱ्यांकडे पाठवली आहे.',
    caseId: 'तक्रार / केस क्रमांक',
    submittedTime: 'नोंदणीची वेळ',
    checkReviewStatus: 'तपासणीची स्थिती पहा',
    howIsCropNow: 'आता पिकाची प्रकृती कशी आहे?',
    improved: 'सुधारणा झाली आहे',
    worsened: 'रोग वाढला आहे',
    worsenedRetakeNote: 'कृपया पुन्हा नवीन फोटो काढून स्थिती तपासा.',
    recheckRecorded: 'स्थिती यशस्वीरीत्या नोंदवली गेली.',
    unreadAlerts: 'नवीन सूचना',
    noAlerts: 'कोणतीही प्रलंबित सूचना नाही. पिके सुरक्षित आहेत.',
    markAsRead: 'वाचले म्हणून खूण करा',
    speak: 'बोला',
    listening: 'ऐकत आहे... बोला',
    voiceNotSupported: 'या फोनवर किंवा ब्राउझरवर व्हॉईस सपोर्ट उपलब्ध नाही.',
    voiceHint: 'उदा: "कापूस शेत स्कॅन करा", "अलर्ट दाखवा", "सल्ला उघडा"',
    demoModeBanner: 'डेमो मोड सक्रिय • पर्सन ४ क्लायंट (मॉक मोड)',
    offlineMockActive: 'ऑफलाइन मॉक मोड (बॅकएंडची गरज नाही)',
    serverConnected: 'बॅकएंडशी जोडलेले (http://localhost:8000/api)',
    switchDemoFlow: 'डेमो पर्याय',
    cotton: 'कापूस',
    soybean: 'सोयाबीन',
    tur: 'तूर',
    sugarcane: 'ऊस',
    gram: 'हरभरा (चना)',
    back: 'मागे',
    home: 'मुख्य पान',
    save: 'शेत जतन करा',
    cancel: 'रद्द करा',
    Maize: 'मका',
  },
  hi: {
    appName: 'क्रॉपशील्ड एआई',
    appTagline: 'महाराष्ट्र फसल स्वास्थ्य खुफिया और कृषी परामर्श',
    mahaGov: 'महाराष्ट्र शासन',
    deptAgri: 'कृषि विभाग • महाराष्ट्र स्टेट इनोवेशन सोसाइटी',
    heroHeadline: 'बीमारी फैलने से पहले अपनी फसल की रक्षा करें।',
    heroSubtitle:
      'क्रॉपशील्ड किसानों को फसल के रोगों और कीटों का जल्दी पता लगाने, मौसम के जोखिम को समझने और सही कार्रवाई करने में मदद करता है।',
    login: 'लॉग इन करें',
    register: 'पंजीकरण करें',
    logout: 'लॉग आउट',
    mobileNumber: 'मोबाइल नंबर',
    password: 'पासवर्ड',
    fullName: 'किसान का पूरा नाम',
    preferredLanguage: 'पसंदीदा भाषा',
    createFarmerAccount: 'नया किसान खाता बनाएं',
    alreadyHaveAccount: 'क्या पहले से खाता है? लॉग इन करें',
    benefitScanTitle: 'फसल को स्कैन करें',
    benefitScanDesc: 'कीटों और रोगों की तुरंत पहचान के लिए पत्ते का साफ फोटो लें।',
    benefitRiskTitle: 'मौसम का जोखिम जानें',
    benefitRiskDesc: 'स्थानीय मौसम की चेतावनी के साथ बीमारी के खतरे को पहले समझें।',
    benefitActionTitle: 'सही कदम उठाएं',
    benefitActionDesc: 'कृषि विश्वविद्यालय द्वारा अनुशंसित सुरक्षित उपचार का पालन करें।',
    namasteFarmer: 'नमस्ते, किसान भाई 👋',
    goodMorning: 'शुभ प्रभात',
    goodAfternoon: 'शुभ दोपहर',
    goodEvening: 'शुभ संध्या',
    farmHealth: 'आपके खेत का स्वास्थ्य',
    mostlyHealthy: 'मुख्य रूप से स्वस्थ',
    attentionNeeded: 'ध्यान देने की आवश्यकता',
    criticalAttention: 'तुरंत कार्रवाई की आवश्यकता',
    fields: 'खेत',
    alerts: 'अलर्ट',
    scanYourCrop: 'फसल स्कैन करें',
    viewMyFields: 'मेरे खेत देखें',
    recentAlert: 'हालिया अलर्ट',
    highRisk: 'उच्च जोखिम (HIGH RISK)',
    mediumRisk: 'मध्यम जोखिम (MEDIUM)',
    lowRisk: 'कम जोखिम (LOW)',
    viewDetails: 'विवरण देखें',
    registerNewField: '+ नया खेत जोड़ें',
    fieldName: 'खेत का नाम',
    crop: 'फसल',
    variety: 'किस्म',
    growthStage: 'विकास की अवस्था',
    area: 'क्षेत्र (एकड़)',
    location: 'स्थान / जिला',
    acres: 'एकड़',
    irrigation: 'सिंचाई सलाह',
    irrigationWait: 'सिंचाई रोकें (WAIT)',
    irrigationIrrigate: 'तुरंत पानी दें',
    irrigationNormal: 'सामान्य समय',
    irrigationDrain: 'अतिरिक्त पानी बाहर निकालें',
    riskReason: 'जोखिम का कारण',
    latestDiagnosis: 'हालिया फसल निदान',
    confidence: 'एआई सटीकता',
    viewDiagnosis: 'निदान देखें',
    scanThisField: 'इस खेत को स्कैन करें',
    takeClearPhotoPrompt: 'प्रभावित पत्ते या पौधे का स्पष्ट फोटो लें।',
    takePhoto: 'फोटो खींचें',
    chooseFromGallery: 'गैलरी से चुनें',
    instruction1: 'पत्ते को फ्रेम के अंदर रखें',
    instruction2: 'अच्छी प्राकृतिक रोशनी में फोटो लें',
    instruction3: 'धुंधली फोटो से बचें',
    instruction4: 'प्रभावित हिस्से को साफ दिखाएं',
    qualityCheckTitle: 'फोटो गुणवत्ता जांच',
    photoUnclearWarning: 'फोटो धुंधली या कम रोशनी वाली हो सकती है।',
    holdSteady: 'फोन स्थिर रखें',
    moveCloser: 'पत्ते के और पास जाएं',
    addMoreLight: 'पर्याप्त रोशनी दें',
    retakePhoto: 'दोबारा फोटो लें',
    useThisPhoto: 'यही फोटो उपयोग करें',
    analyzeCrop: 'फसल का विश्लेषण करें',
    analyzingCrop: 'फसल की जांच हो रही है...',
    checkingSymptoms: 'रोग के लक्षण और कीटों की पहचान जारी है',
    pleaseWait: 'कृपया प्रतीक्षा करें...',
    diseaseDetected: 'रोग का पता चला',
    aiDiagnosed: 'एआई-जांचा गया',
    aiDisclaimer:
      'यह एआई-सहायता प्राप्त परिणाम है। यदि लक्षण बढ़ते हैं या मेल नहीं खाते हैं, तो अपने कृषि अधिकारी से संपर्क करें।',
    whatShouldIDo: 'मुझे क्या करना चाहिए? (कार्य योजना)',
    step1: 'चरण १: संक्रमित पत्तियां हटाएं',
    step2: 'चरण २: अनुशंसित छिड़काव करें',
    step3: 'चरण ३: ५ दिनों तक निगरानी रखें',
    step4: 'चरण ४: जरूरत पड़ने पर संपर्क करें',
    escalateIf: 'यदि ५ दिनों के बाद भी बीमारी फैलती है तो कृषि अधिकारी से संपर्क करें।',
    hearAdvisory: 'सलाह सुनें',
    scheduleFollowUp: 'फॉलो-अप दर्ज करें',
    needsExpertReview: 'विशेषज्ञ समीक्षा आवश्यक',
    lowConfidenceNote: 'क्रॉपशील्ड पर्याप्त विश्वास के साथ समस्या की पहचान नहीं कर सका।',
    caseSentToOfficer: 'आपका मामला सत्यापन के लिए कृषि अधिकारी को भेजा गया है।',
    caseId: 'केस आईडी',
    submittedTime: 'जमा करने का समय',
    checkReviewStatus: 'समीक्षा स्थिति जांचें',
    howIsCropNow: 'अब आपकी फसल कैसी है?',
    improved: 'सुधार हुआ है',
    worsened: 'हालत बिगड़ी है',
    worsenedRetakeNote: 'कृपया दोबारा फोटो लेकर स्थिति की जांच करें।',
    recheckRecorded: 'स्थिति सफलतापूर्वक दर्ज की गई।',
    unreadAlerts: 'अपठित अलर्ट',
    noAlerts: 'कोई नया अलर्ट नहीं है। खेत सुरक्षित हैं।',
    markAsRead: 'पढ़ा हुआ चिह्नित करें',
    speak: 'बोलें',
    listening: 'सुन रहे हैं... बोलिए',
    voiceNotSupported: 'इस डिवाइस पर आवाज इनपुट समर्थित नहीं है।',
    voiceHint: 'उदाहरण: "कपास का खेत स्कैन करें", "अलर्ट दिखाएं", "सलाह खोलें"',
    demoModeBanner: 'डेमो मोड सक्रिय • पर्सन ४ क्लायंट (मॉक मोड)',
    offlineMockActive: 'ऑफ़लाइन मॉक मोड (बैकएंड की आवश्यकता नहीं)',
    serverConnected: 'बैकएंड से जुड़ा हुआ (http://localhost:8000/api)',
    switchDemoFlow: 'डेमो फ्लो',
    cotton: 'कपास',
    soybean: 'सोयाबीन',
    tur: 'अरहर (तूर)',
    sugarcane: 'गन्ना',
    gram: 'चना',
    back: 'पीछे',
    home: 'होम',
    save: 'खेत सहेजें',
    cancel: 'रद्द करें',
    Maize: 'मक्का',
  },
};
