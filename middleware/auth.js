/**
 * Middleware voor ouderlijke toegangscontrole
 * - Controleert of gebruiker een ouder is
 * - Redirect naar dashboard met foutmelding bij onbevoegde toegang
 */

module.exports = {
  ensureParent: (req, res, next) => {
    if (req.session.user?.role !== 'ouder') {
      req.session.error = "Alleen ouders hebben toegang";
      return res.redirect('/dashboard');
    }
    next();
  }
};

/**
 * Specifieke middleware voor berichtenfunctionaliteit
 * - Vergelijkbaar met ensureParent maar met aangepaste redirect
 */
module.exports.ensureParent = (req, res, next) => {
  if (req.session.user?.role !== 'ouder') {
    req.session.error = "Alleen ouders hebben toegang tot deze functie";
    return res.redirect('/messages');
  }
  next();
};