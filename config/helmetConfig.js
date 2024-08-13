const helmet = require('helmet');

const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-cdn.com"],
      styleSrc: ["'self'", "trusted-cdn.com"],
      imgSrc: ["'self'", "data:", "trusted-cdn.com"],
    },
  },
  frameguard: { action: 'deny' },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  referrerPolicy: { policy: 'no-referrer' },
});

module.exports = helmetConfig;