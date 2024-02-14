import { EventBuilder } from '../builders';
import { loadTelegramWebAppData, webViewHandler } from '../telegram/telegram';
import { TonConnectStorageData } from '../models/tonconnect-storage-data';
import { EventType } from '../enum/event-type.enum';

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

  const telegramWebAppData = loadTelegramWebAppData();

  const eventBuilder = new EventBuilder(
    options.projectId,
    options.apiKey,
    options.appName,
    telegramWebAppData,
  );

  webViewHandler?.onEvent('main_button_pressed', (event: string) => {
    eventBuilder.track(EventType.MainButtonPressed, {});
  });

  webViewHandler?.onEvent('settings_button_pressed', (event: string) => {
    eventBuilder.track(EventType.SettingsButtonPressed, {});
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

  return eventBuilder;
};

export default telemetree;
