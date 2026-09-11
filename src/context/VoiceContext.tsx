import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';

interface VoiceContextType {
  isListening: boolean;
  isSpeaking: boolean;
  isRecognitionSupported: boolean;
  transcript: string;
  voiceFeedback: string | null;
  startListening: () => void;
  stopListening: () => void;
  speakText: (text: string) => void;
  speakAdvisory: (advisory: { disease: string; steps: any[]; escalate: string }) => void;
  stopSpeaking: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

// Web Speech API interface definitions
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);

  // Check support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsRecognitionSupported(!!SpeechRecognition);
  }, []);

  // Process voice commands in English, Marathi, and Hindi
  const processVoiceCommand = (command: string) => {
    const lower = command.toLowerCase().trim();
    setTranscript(command);

    if (
      lower.includes('scan') ||
      lower.includes('photo') ||
      lower.includes('स्कॅन') ||
      lower.includes('फोटो') ||
      lower.includes('तपास')
    ) {
      setVoiceFeedback('Opening crop scanner...');
      setTimeout(() => navigate('/scan'), 800);
      return;
    }

    if (
      lower.includes('alert') ||
      lower.includes('अलर्ट') ||
      lower.includes('सूचना') ||
      lower.includes('चेतावणी')
    ) {
      setVoiceFeedback('Opening alerts...');
      setTimeout(() => navigate('/alerts'), 800);
      return;
    }

    if (
      lower.includes('field') ||
      lower.includes('शेती') ||
      lower.includes('शेत') ||
      lower.includes('खेत')
    ) {
      if (lower.includes('cotton') || lower.includes('कापूस') || lower.includes('कपास')) {
        setVoiceFeedback('Opening Cotton Field #1...');
        setTimeout(() => navigate('/fields/1'), 800);
        return;
      }
      setVoiceFeedback('Viewing fields...');
      setTimeout(() => navigate('/fields'), 800);
      return;
    }

    if (
      lower.includes('advisory') ||
      lower.includes('advice') ||
      lower.includes('सल्ला') ||
      lower.includes('सलाह') ||
      lower.includes('उपाय')
    ) {
      setVoiceFeedback('Opening latest advisory...');
      setTimeout(() => navigate('/advisory/Early%20Blight'), 800);
      return;
    }

    if (lower.includes('home') || lower.includes('डॅशबोर्ड') || lower.includes('डैशबोर्ड')) {
      setVoiceFeedback('Returning home...');
      setTimeout(() => navigate('/dashboard'), 800);
      return;
    }

    // Default unrecognized
    setVoiceFeedback(`Heard: "${command}". Try: "Scan crop", "Show alerts", "View fields"`);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceFeedback('Voice input is not supported on this device.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Set recognition language based on selected app language
      if (language === 'mr') {
        recognition.lang = 'mr-IN';
      } else if (language === 'hi') {
        recognition.lang = 'hi-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceFeedback('Listening... Speak now');
      };

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        processVoiceCommand(spoken);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'no-speech') {
          setVoiceFeedback('No speech detected. Please try again.');
        } else {
          setVoiceFeedback(`Voice error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setVoiceFeedback('Could not start microphone. Check browser permissions.');
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown/tags if any
    const cleanText = text.replace(/[#*`_-]/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Pick best matching voice
    const voices = window.speechSynthesis.getVoices();
    let targetLang = 'en-IN';
    if (language === 'mr') targetLang = 'mr-IN';
    if (language === 'hi') targetLang = 'hi-IN';

    const matchedVoice =
      voices.find((v) => v.lang === targetLang) ||
      voices.find((v) => v.lang.startsWith(targetLang.split('-')[0])) ||
      voices.find((v) => v.lang.includes('IN')) ||
      voices[0];

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.lang = targetLang;
    utterance.rate = 0.95; // Slightly measured pace for rural comprehension
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const speakAdvisory = (advisory: { disease: string; steps: any[]; escalate: string }) => {
    let script = '';
    const stepTexts = advisory.steps
      .map((s, idx) => `कृती ${idx + 1}: ${s.action || s}`)
      .join('. ');

    if (language === 'mr') {
      script = `रोग: ${advisory.disease}. कृती सल्ला: ${stepTexts}. इशारा: ${advisory.escalate}`;
    } else if (language === 'hi') {
      const hiSteps = advisory.steps.map((s, idx) => `कदम ${idx + 1}: ${s.action || s}`).join('. ');
      script = `रोग: ${advisory.disease}. उपचार सलाह: ${hiSteps}. चेतावनी: ${advisory.escalate}`;
    } else {
      const enSteps = advisory.steps.map((s, idx) => `Step ${idx + 1}: ${s.action || s}`).join('. ');
      script = `Disease diagnosed: ${advisory.disease}. Advisory steps: ${enSteps}. Warning: ${advisory.escalate}`;
    }
    speakText(script);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        isSpeaking,
        isRecognitionSupported,
        transcript,
        voiceFeedback,
        startListening,
        stopListening,
        speakText,
        speakAdvisory,
        stopSpeaking,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = (): VoiceContextType => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
