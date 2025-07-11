module.exports = {
  app: {
    name: 'THE LINK HANGOUTS',
    apiURL: `${process.env.BASE_API_URL}`,
    clientURL: process.env.FRONTEND_URL
  },
  apiURL: `${process.env.BASE_API_URL}`,
  port: process.env.PORT || 3000,
  database: {
    HOST: process.env.MONGO_HOST,
    PORT: process.env.MONGO_PORT,
    NAME: process.env.MONGO_DB_NAME,
    USER: process.env.MONGO_USER,
    PASS: process.env.MONGO_USER_PASS,
    AUTH_SOURCE: process.env.MONGO_AUTH_SOURCE,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    tokenLife: '1d'
  },
  FileManager: {
    apiUrl: process.env.FILE_MANAGER_API_URL,
    user: process.env.FILE_MANAGER_USER,
    pwd: process.env.FILE_MANAGER_PASSWORD
  },
  /*mailchimp: {
    key: process.env.MAILCHIMP_KEY,
    listKey: process.env.MAILCHIMP_LIST_KEY
  },*/
  /*mailgun: {
    key: process.env.MAILGUN_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    sender: process.env.MAILGUN_EMAIL_SENDER,
    support: process.env.MAILGUN_EMAIL_SUPPORT,

    host: process.env.HOST,

    order: process.env.MAILGUN_EMAIL_ORDER_SENDER,
    security: process.env.MAILGUN_EMAIL_SECURITY_SENDER,
    auth: process.env.MAILGUN_EMAIL_AUTH_SENDER,
    management: process.env.MAILGUN_EMAIL_MANAGEMENT_SENDER,
    mailingKey: process.env.MAILGUN_ACCOUNT_KEY,

    news: process.env.MAILGUN_EMAIL_NEWS_SENDER,
    test_news: process.env.MAILGUN_EMAIL_TEST_NEWS,
    domain_unsubscribe :process.env.MAILGUN_DOMAIN_UNSUBSCRIBE,
  },*/
  /*adminEmail: {
    adminEmail: process.env.ADMIN_EMAIL,
    secondAdminEmail: process.env.TEMP_ADMIN_EMAIL
  },*/
  /*google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },*/
  paystack: {
    apiSecretKey: process.env.PAYSTACK_SECRET_KEY
  }
};
