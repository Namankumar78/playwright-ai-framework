import { BrowserstackConfig } from '../types';

export const config = {
  // Local Real Devices
  androidReal: {
    channel: 'chrome',
    launchOptions: {
      args: ['--disable-web-security'],
    },
  },

  androidEmulator: {
    channel: 'chrome',
    launchOptions: {
      args: ['--disable-web-security'],
    },
  },

  iosReal: {
    channel: 'webkit',
    launchOptions: {
      args: ['--disable-web-security'],
    },
  },

  // BrowserStack
  browserstackAndroid: {
    connectOptions: {
      wsEndpoint: `wss://cdp.browserstack.com/webdriver-client/playwright?caps=${encodeURIComponent(
        JSON.stringify({
          'bstack:options': {
            projectName: 'OmniMobile',
            buildName: '1.0.0',
            sessionName: 'Android Test',
            realMobile: true,
          },
          browserName: 'android',
          platformName: 'android',
          platformVersion: '13.0',
          deviceName: 'Samsung Galaxy S22',
          'appium:ensureWebviewsHavePages': true,
        })
      )}`,
    },
  } as BrowserstackConfig,

  browserstackiOS: {
    connectOptions: {
      wsEndpoint: `wss://cdp.browserstack.com/webdriver-client/playwright?caps=${encodeURIComponent(
        JSON.stringify({
          'bstack:options': {
            projectName: 'OmniMobile',
            buildName: '1.0.0',
            sessionName: 'iOS Test',
            realMobile: true,
          },
          browserName: 'ios',
          platformName: 'ios',
          platformVersion: '16.0',
          deviceName: 'iPhone 14 Pro',
          'appium:ensureWebviewsHavePages': true,
        })
      )}`,
    },
  } as BrowserstackConfig,
};
