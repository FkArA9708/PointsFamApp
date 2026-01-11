

/**
 * Sanitize gebruikersinvoer
 * - Verwijdert HTML tags uit alle string velden
 * - Voorkomt XSS aanvallen
 * - Trimt whitespace rond invoer
 */
const sanitizeInput = (req, res, next) => {
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      // Verwijder HTML-tags en trim spaties
      req.body[key] = req.body[key].trim().replace(/<[^>]*>/g, '');
    }
  }
  next();
};

module.exports = sanitizeInput;