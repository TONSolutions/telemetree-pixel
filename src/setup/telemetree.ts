import {EventBuilder} from '../builders';
import {loadTelegramWebAppData, webViewHandler} from '../telegram/telegram';
import {TonConnectStorageData} from '../models/tonconnect-storage-data';
import {EventType} from '../enum/event-type.enum';
import {getCurrentUTCTimestampMilliseconds} from '../helpers/date.helper';
import {getLocalStorage, setLocalStorage} from '../utils/local-storage';
import {generateRandomId} from '../utils/id';
import {TonConnectObserver} from "../observers/ton-connect.observer";
import {Logger, LogLevel} from "../utils/logger";
import {Telegram} from '../telegram';
import {trackGroupHigh, trackGroupLow, trackGroupMedium, TrackGroups} from "./trackGroups";

const TonConnectLocalStorageKey = 'ton-connect-storage_bridge-connection';
const TonConnectProviderNameLocalStorageKey = 'ton-connect-ui_preferred-wallet';

export type TwaAnalyticsConfig = {
  host: string;
  auto_capture: boolean;
  auto_capture_tags: string[];
  auto_capture_classes: string[];
  public_key: string;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: Telegram.WebApp;
      WebView?: Telegram.WebView;
    };
    __telemetreeSessionStarted?: boolean;
  }
}

const telemetree = (options: any) => {
  Logger.setLevel(options.logLevel || LogLevel.INFO);
  const trackGroup = options.trackGroup !== undefined ? options.trackGroup : TrackGroups.MEDIUM;

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
      trackGroup,
    );
  } else {
    const telegramWebAppData = loadTelegramWebAppData();
    eventBuilder = new EventBuilder(
      options.projectId,
      options.apiKey,
      telegramWebAppData,
      trackGroup,
    );
  }

  if (trackGroup) {
    const webApp = window?.Telegram?.WebApp;

    if (trackGroup === TrackGroups.LOW) {
      trackGroupLow(eventBuilder, webApp);
    }

    if (trackGroup === TrackGroups.MEDIUM) {
      trackGroupMedium(eventBuilder, webApp);
    }

    if (trackGroup === TrackGroups.HIGH) {
      trackGroupHigh(eventBuilder, webApp);
    }

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
        } catch (exception) {
          console.error(exception);
        }
      }
    }, 1000);

    let observer: TonConnectObserver | null = null;

    if (trackGroup) {
      try {
        observer = new TonConnectObserver(eventBuilder);
        Logger.info('TON Connect observer initialized successfully');
      } catch (error) {
        Logger.error('Failed to initialize TON Connect observer', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  return eventBuilder;
};

export default telemetree;
