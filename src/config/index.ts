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
      };
    } else {
      return {
        MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY,
        MIDTRANS_SNAP_URL: process.env.MIDTRANS_SNAP_URL,
      };
    }
  }
}

export const config = new Config(process.env.NODE_ENV ?? "DEVELOPMENT");
