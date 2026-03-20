module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "change_me_to_a_long_random_secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
};

