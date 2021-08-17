const corsList = {
  localUrl: process.env.CORS_LOCAL_URL,
  localSecureUrl: process.env.CORS_LOCAL_SECURE_URL,
  netlifyUrl: process.env.CORS_NETLIFY_URL,
  mainUrl: process.env.CORS_MAIN_URL,
};
module.exports = corsList;