export interface BrowserstackConfig {
  connectOptions: {
    wsEndpoint: string;
  };
}

export interface DeviceConfig {
  channel?: string;
  launchOptions?: {
    args: string[];
  };
  connectOptions?: {
    wsEndpoint: string;
  };
}
