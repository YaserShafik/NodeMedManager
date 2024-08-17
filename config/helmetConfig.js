const helmet = require('helmet');

const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "trusted-cdn.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "trusted-cdn.com"],
      imgSrc: ["'self'", "data:", "trusted-cdn.com"],
      connectSrc: ["'self'", "api.trusted.com"],
      fontSrc: ["'self'", "trusted-cdn.com"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  referrerPolicy: { policy: 'no-referrer' },
  hsts: {
    maxAge: 31536000,  // 1 año en segundos
    includeSubDomains: true,  // Aplicar a todos los subdominios
    preload: true
  },
  xssFilter: true,
  frameguard: {
    action: 'deny'
  }
});

module.exports = helmetConfig;
