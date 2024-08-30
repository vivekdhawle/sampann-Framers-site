import { Data } from '../models/dataModel.js';
import { detectLanguage, translateText } from '../utils/translationUtils.js';

export const searchProducts = async (req, res) => {
  const { keyword, language } = req.body;

  try {
    // Detect language if not provided
    const detectedLanguage = language || await detectLanguage(keyword);

    // Translate the keyword to English for database search
    const englishKeyword = await translateText(keyword, 'en');

    // Perform search in the database
    const results = await Data.find({ keyword: new RegExp(englishKeyword, 'i') });

    // Translate results back to the detected language
    const translatedResults = await Promise.all(
      results.map(async (item) => ({
        description: await translateText(item.description, detectedLanguage)
      }))
    );

    // Return translated results
    res.json({ results: translatedResults.map(item => item.description) });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
