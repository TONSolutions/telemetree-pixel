import { TwaAnalyticsConfig } from '../setup/telemetree';
import {
  CONFIG_API_GATEWAY,
  DEFAULT_SYSTEM_EVENT_DATA_SEPRARTOR,
  DEFAULT_SYSTEM_EVENT_PREFIX,
} from '../constants';
import { EventType } from '../enum/event-type.enum';
import { EventPushHandler } from '../event-push-handler';
import {
  getCurrentUTCTimestamp,
  getCurrentUTCTimestampMilliseconds,
} from '../helpers/date.helper';
import { encryptMessage } from '../helpers/encryption.helper';
import { IEventBuilder } from '../interfaces';
import { TelegramWebAppData } from '../models';
import { TransportFactory } from '../transports/transport-factory';
import { BaseEvent, Transport } from '../types';
import { createEvent } from '../utils/create-event';
import {Logger} from "../utils/logger";
import {TrackGroups} from "../setup/trackGroups";
export class EventBuilder implements IEventBuilder {
  protected transport: Transport | null = null;
  protected config: TwaAnalyticsConfig | null = null;
  protected sessionIdentifier: string | null = null;
  protected userIdentifier: string | null = null;
  protected readonly pushHandler: EventPushHandler = new EventPushHandler(this);

  constructor(
    protected readonly projectId: string,
    protected readonly apiKey: string,
    protected readonly data: TelegramWebAppData,
    protected readonly trackGroup: TrackGroups | null = null,
  ) {
    this._init();
  }

  public setSessionIdentifier(sessionIdentifier: string): this {
    this.sessionIdentifier = sessionIdentifier;
    return this;
  }

  public getTrackGroup() {
    return this.trackGroup;
  }

  public setUserId(userIdentifier: string): this {
    this.userIdentifier = userIdentifier;
    return this;
  }

  protected async _init(): Promise<void> {
    const client = TransportFactory.getTransport('http', {
      headers: {
        authorization: `Bearer ${this.apiKey}`,
      },
      requestTimeout: 1000,
    });

    this.setSessionIdentifier(getCurrentUTCTimestampMilliseconds());

    try {
      const response = await client.send(
        CONFIG_API_GATEWAY + `?project=${this.projectId}`,
        'GET',
      );

      if (response.status === 200) {
        const data = await response.json();
        this.config = data;
      }

      client.setOptions({
        headers: {
          'x-api-key': `${this.apiKey}`,
          'x-project-id': `${this.projectId}`,
          'content-type': 'application/json',
        },
        requestTimeout: 1500,
      });
      this.setTransport(client);

      await this.pushHandler.flush();

      this.setupAutoCaptureListener();
    } catch (exception) {
      console.error(`Cannot load config: ${exception}`);
    }
  }

  protected setupAutoCaptureListener(): void {
    const config = this.getConfig();

    if (config !== null && config.auto_capture === true && (this.trackGroup == TrackGroups.MEDIUM || this.trackGroup == TrackGroups.HIGH)) {
      const trackTags = config.auto_capture_tags.map((tag: string) =>
        tag.toUpperCase(),
      );

      document.querySelector('body')?.addEventListener('click', (event) => {
        // Get the event path/composedPath (all elements in the click path)
        const path = event.composedPath?.() || [];

        // Find the first trackable element in the event path
        const trackableElement = path.find((element: any) =>
          element instanceof HTMLElement && trackTags.includes(element.tagName)
        ) as HTMLElement | undefined;

        if (trackableElement) {
          const customProperties = {} as any;
          const resolveAttributes = [
            'id',
            'href',
            'class',
            'name',
            'value',
            'type',
            'placeholder',
            'title',
            'alt',
            'src',
          ];

          for (const attribute of resolveAttributes) {
            if (trackableElement.hasAttribute(attribute)) {
              customProperties[attribute] = trackableElement.getAttribute(attribute);
            }
          }

          // Get the most relevant text content
          const targetText = (event.target as HTMLElement)?.innerText?.trim() || '';
          const elementText = trackableElement.innerText?.trim() || '';

          // Prefer the more specific text if available
          customProperties['text'] = targetText || elementText;
          customProperties['tag'] = trackableElement.tagName.toLowerCase();

          // Add information about nested click if applicable
          if (event.target !== trackableElement) {
            customProperties['clicked_child'] = (event.target as HTMLElement)?.tagName?.toLowerCase();
            customProperties['clicked_child_text'] = targetText;
          }

          this.track(
            `${DEFAULT_SYSTEM_EVENT_PREFIX} ${EventType.Click}${DEFAULT_SYSTEM_EVENT_DATA_SEPRARTOR}${customProperties['text']}`,
            customProperties,
          );
        }
      });
    }
  }

  public getConfig(): TwaAnalyticsConfig | null {
    return this.config;
  }

  public setTransport(transport: Transport): this {
    this.transport = transport;
    return this;
  }

  async track(
    eventName: string,
    eventProperties: Record<string, any>,
  ): Promise<void> {
    if (eventName === null) {
      throw new Error('Event name is not set.');
    }

    if (!this.data.user?.id) {
      console.error(
        `Event ${eventName} is not tracked because user is not set.`,
      );
      return;
    }

    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    const paramsObj: Record<string, string> = {};

    for (const [key, value] of urlParams.entries()) {
      paramsObj[key] = value;
    }

    const paramsString = Object.keys(paramsObj).length === 0 ? "" : Object.keys(paramsObj).map(key => `${key}: ${paramsObj[key]}`).join(', ');;

    const event = createEvent(
      eventName,
      {
        username: this.data.user?.username || '',
        firstName: this.data.user.first_name,
        lastName: this.data.user?.last_name || '',
        isPremium: this.data.user?.is_premium || false,
        writeAccess: this.data.user?.allows_write_to_pm || false,
      },
      {
        startParameter: this.data.start_param || paramsString,
        path: document.location.pathname,
        params: eventProperties,
      },
      this.data.user?.id.toString(),
      this.data.user?.language_code,
      this.data.platform,
      this.data.chat_type || 'N/A',
      this.data.chat_instance || '0',
      getCurrentUTCTimestamp(),
      eventName.startsWith(DEFAULT_SYSTEM_EVENT_PREFIX),
      eventProperties.wallet || undefined,
      this.sessionIdentifier || undefined,
    );

    return this.pushHandler.push(event);
  }

  public async processEvent(event: BaseEvent): Promise<void> {
    if (this.config === null || this.transport === null) {
      Logger.info('Event processing failed: config or transport is not set.');
      return;
    }

    try {
      const { encryptedKey, encryptedIV, encryptedBody } = encryptMessage(
        this.config.public_key,
        JSON.stringify(event),
      );

      await this.transport.send(
        this.config.host,
        'POST',
        JSON.stringify({
          key: encryptedKey,
          iv: encryptedIV,
          body: encryptedBody,
        }),
      );
      Logger.debug('Event sent successfully', {
        eventData: event,
      });
    } catch (exception: any) {
      console.error(exception);
    }
  }
}
