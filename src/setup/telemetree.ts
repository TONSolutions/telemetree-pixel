import { EventBuilder } from '../builders';
import {
  loadTelegramWebAppData,
  webViewHandler,
  webAppHandler, // Add this import
} from '../telegram/telegram';
import { TonConnectStorageData } from '../models/tonconnect-storage-data';
import { EventType } from '../enum/event-type.enum';
import { getCurrentUTCTimestampMilliseconds } from '../helpers/date.helper';
import { getLocalStorage, setLocalStorage } from '../utils/local-storage';
import { generateRandomId } from '../utils/id';

const TonConnectLocalStorageKey = 'ton-connect-storage_bridge-connection';
const TonConnectProviderNameLocalStorageKey = 'ton-connect-ui_preferred-wallet';

export type TwaAnalyticsConfig = {
  host: string;
  auto_capture: boolean;
  auto_capture_tags: string[];
  auto_capture_classes: string[];
  public_key: string;
};

const telemetree = (options: any) => {
  if (!options.projectId) {
    throw new Error('TWA Analytics Provider: Missing projectId');
  }

  let eventBuilder: EventBuilder;
  if (!options.isTelegramContext) {
    let id: string | null = getLocalStorage('telemetree.id');
    if (id === null) {
      id = generateRandomId().toString();
      setLocalStorage('telemetree.id', id);
    }

    eventBuilder = new EventBuilder(
      options.projectId,
      options.apiKey,
      options.appName,
      {
        auth_date: +getCurrentUTCTimestampMilliseconds(),
        hash: '',
        user: {
          id: +id,
          first_name: id,
          username: '',
          last_name: '',
          language_code: '',
          is_premium: false,
        },
        platform: 'web',
      },
    );
  } else {
    const telegramWebAppData = loadTelegramWebAppData();
    eventBuilder = new EventBuilder(
      options.projectId,
      options.apiKey,
      options.appName,
      telegramWebAppData,
    );
  }

  webViewHandler?.onEvent('main_button_pressed', (event: string) => {
    eventBuilder.track(EventType.MainButtonPressed, {});
  });

  webViewHandler?.onEvent('settings_button_pressed', (event: string) => {
    eventBuilder.track(EventType.SettingsButtonPressed, {});
  });

  webViewHandler?.onEvent('back_button_pressed', (event: string) => {
    eventBuilder.track(EventType.BackButtonPressed, {});
  });

  webViewHandler?.onEvent(
    'secondary_button_pressed',
    (event: string, data?: object) => {
      eventBuilder.track(EventType.SecondaryButtonPressed, {
        ...data,
      });
    },
  );

  webViewHandler?.onEvent('prepared_message_sent', (event: string) => {
    eventBuilder.track(EventType.PreparedMessageSent, {});
  });

  webViewHandler?.onEvent(
    'fullscreen_changed',
    (event: string, data?: object) => {
      eventBuilder.track(EventType.FullScreenChanged, {
        ...data,
      });
    },
  );

  webViewHandler?.onEvent('home_screen_added', (event: string) => {
    eventBuilder.track(EventType.HomeScreenAdded, {});
  });

  webViewHandler?.onEvent(
    'home_screen_checked',
    (event: string, data?: object) => {
      eventBuilder.track(EventType.HomeScreenChecked, {
        ...data,
      });
    },
  );

  webViewHandler?.onEvent('emoji_status_set', (event: string) => {
    eventBuilder.track(EventType.EmojiStatusSet, {});
  });

  webViewHandler?.onEvent(
    'location_checked',
    (event: string, data?: object) => {
      eventBuilder.track(EventType.LocationChecked, {
        ...data,
      });
    },
  );

  webViewHandler?.onEvent(
    'location_requested',
    (event: string, data?: object) => {
      eventBuilder.track(EventType.LocationRequested, {
        ...data,
      });
    },
  );

  webViewHandler?.onEvent('accelerometer_started', (event: string) => {
    eventBuilder.track(EventType.AccelerometerStarted, {});
  });

  webViewHandler?.onEvent('accelerometer_stopped', (event: string) => {
    eventBuilder.track(EventType.AccelerometerStopped, {});
  });

  webViewHandler?.onEvent('accelerometer_changed', (event: string) => {
    eventBuilder.track(EventType.AccelerometerChanged, {});
  });

  webViewHandler?.onEvent('device_orientation_started', (event: string) => {
    eventBuilder.track(EventType.DeviceOrientationStarted, {});
  });

  webViewHandler?.onEvent('device_orientation_stopped', (event: string) => {
    eventBuilder.track(EventType.DeviceOrientationStopped, {});
  });

  webViewHandler?.onEvent('device_orientation_changed', (event: string) => {
    eventBuilder.track(EventType.DeviceOrientationChanged, {});
  });

  webViewHandler?.onEvent('device_orientation_failed', (event: string) => {
    eventBuilder.track(EventType.DeviceOrientationFailed, {});
  });

  webViewHandler?.onEvent('gyroscope_started', (event: string) => {
    eventBuilder.track(EventType.GyroscropeStarted, {});
  });

  webViewHandler?.onEvent('gyroscope_stopped', (event: string) => {
    eventBuilder.track(EventType.GyroscropeStopped, {});
  });

  webViewHandler?.onEvent('gyroscope_changed', (event: string) => {
    eventBuilder.track(EventType.GyroscropeChanged, {});
  });

  webViewHandler?.onEvent('gyroscope_failed', (event: string) => {
    eventBuilder.track(EventType.GyroscropeFailed, {});
  });

  webViewHandler?.onEvent('invoice_closed', (event: string, data?: object) => {
    eventBuilder.track(EventType.InvoiceClosed, {
      ...data,
    });
  });

  webViewHandler?.onEvent(
    'clipboard_text_received',
    (event: string, data?: object) => {
      eventBuilder.track(EventType.ClipboardTextReceived, {
        ...data,
      });
    },
  );

  webViewHandler?.onEvent('popup_closed', (event: string, data?: object) => {
    eventBuilder.track(EventType.PopupClosed, {});
  });

  webViewHandler?.onEvent(
    'write_access_requested',
    (event: string, data?: object) => {
      eventBuilder.track(EventType.WriteAccessRequested, {});
    },
  );

  webViewHandler?.onEvent(
    'qr_text_received',
    (event: string, data?: object) => {
      eventBuilder.track(EventType.QRTextReceived, {
        ...data,
      });
    },
  );

  webViewHandler?.onEvent('phone_requested', (event: string, data?: object) => {
    eventBuilder.track(EventType.PhoneRequested, {
      ...data,
    });
  });

  const locationPath = location.pathname;
  eventBuilder.track(`${EventType.PageView} ${locationPath}`, {
    path: locationPath,
  });

  let lastAddress: null | string = null;
  const interval = setInterval(() => {
    const tonConnectStoredData = localStorage.getItem(
      TonConnectLocalStorageKey,
    );
    if (tonConnectStoredData) {
      try {
        const parsedData = JSON.parse(
          tonConnectStoredData,
        ) as TonConnectStorageData;
        const wallets = parsedData.connectEvent?.payload?.items || [];
        if (wallets && wallets.length === 0) {
          return;
        }

        if (lastAddress === wallets[0].address) {
          return;
        }

        const walletProvider = localStorage.getItem(
          TonConnectProviderNameLocalStorageKey,
        );

        const customProperties = {
          wallet: wallets[0].address,
          walletProvider: walletProvider || 'unknown',
        };
        lastAddress = wallets[0].address;

        eventBuilder.track(EventType.Wallet, customProperties);
      } catch (exception) {
        console.error(exception);
      }
    }
  }, 1000);

  if (!window.__telemetreeSessionStarted) {
    window.__telemetreeSessionStarted = true;
    eventBuilder.track(EventType.SessionStart, {
      timestamp: Date.now(),
    });
  }

  // Track fullscreen events
  let lastViewportHeight: number | undefined = webAppHandler?.viewportHeight;
  let isCurrentlyExpanded = false;

  webAppHandler?.onEvent('viewport_changed', (event: any) => {
    if (webAppHandler?.viewportHeight === undefined) {
      return;
    }

    const heightIncreased =
      lastViewportHeight !== undefined &&
      webAppHandler.viewportHeight > lastViewportHeight;

    if (heightIncreased && !isCurrentlyExpanded) {
      isCurrentlyExpanded = true;
      eventBuilder.track(EventType.WebAppRequestFullscreen, {
        timestamp: Date.now(),
      });
    } else if (!heightIncreased && isCurrentlyExpanded) {
      isCurrentlyExpanded = false;
      eventBuilder.track(EventType.WebAppExitFullscreen, {
        timestamp: Date.now(),
      });
    }

    lastViewportHeight = webAppHandler.viewportHeight;
  });

  // Track inline query events
  const originalSwitchInlineQuery = webAppHandler?.switchInlineQuery;
  if (webAppHandler && originalSwitchInlineQuery) {
    webAppHandler.switchInlineQuery = (
      query: string,
      choose_chat_types?: string[],
    ) => {
      eventBuilder.track(EventType.SwitchInlineQuery, {
        query,
        chat_types: choose_chat_types,
        timestamp: Date.now(),
      });
      return originalSwitchInlineQuery.call(
        webAppHandler,
        query,
        choose_chat_types,
      );
    };
  }

  // Track share to story events
  const originalShareToStory = webAppHandler?.shareToStory;
  if (webAppHandler && originalShareToStory) {
    webAppHandler.shareToStory = (
      media_url: string,
      params?: { text?: string },
    ) => {
      eventBuilder.track(EventType.ShareToStory, {
        media_url,
        text: params?.text,
        timestamp: Date.now(),
      });
      return originalShareToStory.call(webAppHandler, media_url, params);
    };
  }

  // Track close events
  const originalClose = webAppHandler?.close;
  if (webAppHandler && originalClose) {
    webAppHandler.close = () => {
      eventBuilder.track(EventType.SessionEnd, {
        timestamp: Date.now(),
      });

      setTimeout(() => {
        originalClose.call(webAppHandler);
      }, 50);
    };
  }

  return eventBuilder;
};

export default telemetree;
