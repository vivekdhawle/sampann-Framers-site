import fetch from 'node-fetch';

// Translation function using LibreTranslate
export const translateText = async (text, targetLanguage) => {
  try {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'auto',
        target: targetLanguage
      })
    });

    if (!response.ok) {
      throw new Error('Translation API request failed');
    }

    const result = await response.json();
    return result.translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    return text; // Return the original text in case of an error
  }
};

// Simple heuristic language detection by translating to English
export const detectLanguage = async (text) => {
  try {
    // Try translating text to English
    const translatedText = await translateText(text, 'en');

    // If the translated text is the same as the original, assume original language is English
    return translatedText === text ? 'en' : 'auto'; // 'auto' indicates detected language was not English
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en'; // Default to English if detection fails
  }
};
