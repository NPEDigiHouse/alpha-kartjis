class Config {
  env: string;

  constructor(env: string) {
    this.env = env;
  }

  config() {
    if (this.env === "PRODUCTION") {
      return {
        MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY_PRODUCTION,
        MIDTRANS_SNAP_URL: process.env.MIDTRANS_SNAP_URL_PRODUCTION,
        KARTJIS_MAIL: process.env.KARTJIS_MAIL_PRODUCTION,
        KARTJIS_PASSWORD: process.env.KARTJIS_PASSWORD_PRODUCTION,
      };
    } else {
      return {
        MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY,
        MIDTRANS_SNAP_URL: process.env.MIDTRANS_SNAP_URL,
        KARTJIS_MAIL: process.env.KARTJIS_MAIL,
        KARTJIS_PASSWORD: process.env.KARTJIS_PASSWORD,
      };
    }
  }
}

export const config = new Config(process.env.NODE_ENV ?? "DEVELOPMENT");
