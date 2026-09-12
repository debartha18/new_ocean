/**
 * OCEANOVA Secure Translation Serverless Endpoint
 * Vercel Serverless Function / Node.js runtime.
 * Never exposes API keys or cloud credentials to the client bundle.
 */

const translationCache = new Map();

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { text, targetLang, sourceLang = 'en' } = req.body || {};

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text string is required for translation.' });
    }

    if (!targetLang || targetLang === sourceLang) {
      return res.status(200).json({ translatedText: text, cached: true });
    }

    const cacheKey = `${sourceLang}_${targetLang}_${text.trim().toLowerCase()}`;
    if (translationCache.has(cacheKey)) {
      return res.status(200).json({
        translatedText: translationCache.get(cacheKey),
        cached: true
      });
    }

    // Check for configured translation keys in environment variables (Vercel Secrets)
    const apiKey = process.env.TRANSLATION_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      // Graceful fallback when API key is not yet configured in environment
      return res.status(200).json({
        translatedText: text,
        fallback: true,
        notice: 'Translation API key unconfigured on server. Fallback to source text.'
      });
    }

    // Call upstream translation provider securely server-side
    // Google Cloud Translation API v2
    const googleUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const response = await fetch(googleUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      })
    });

    if (!response.ok) {
      const errData = await response.text();
      console.error('Upstream translation provider error:', errData);
      return res.status(200).json({ translatedText: text, fallback: true });
    }

    const data = await response.json();
    const translated = data?.data?.translations?.[0]?.translatedText || text;

    translationCache.set(cacheKey, translated);
    return res.status(200).json({ translatedText: translated, cached: false });
  } catch (error) {
    console.error('Internal translation error:', error.message);
    return res.status(200).json({ translatedText: req.body?.text || '', fallback: true });
  }
}
