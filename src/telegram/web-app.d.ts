export declare namespace Telegram {
  interface User {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    is_premium: boolean;
    allows_write_to_pm?: boolean;
    added_to_attachment_menu?: boolean;
    photo_url?: string;
    language_code: string;
  }

  interface InitData {
    query_id?: string;
    user?: User;
    chat_type?: 'private' | 'group' | 'supergroup' | 'channel';
    chat_instance?: string;
    start_param?: string;
    auth_date: number;
    hash: string;
  }

  type WebAppEvent =
    | 'main_button_pressed'
    | 'settings_button_pressed'
    | 'back_button_pressed'
    | 'secondary_button_pressed'
    | 'prepared_message_sent'
    | 'fullscreen_changed'
    | 'home_screen_added'
    | 'home_screen_checked'
    | 'emoji_status_set'
    | 'location_checked'
    | 'location_requested'
    | 'accelerometer_started'
    | 'accelerometer_stopped'
    | 'accelerometer_changed'
    | 'device_orientation_started'
    | 'device_orientation_stopped'
    | 'device_orientation_changed'
    | 'device_orientation_failed'
    | 'gyroscope_started'
    | 'gyroscope_stopped'
    | 'gyroscope_changed'
    | 'gyroscope_failed'
    | 'invoice_closed'
    | 'clipboard_text_received'
    | 'popup_closed'
    | 'write_access_requested'
    | 'qr_text_received'
    | 'phone_requested'
    | 'viewport_changed'
    | 'scan_qr_popup_closed'
    | 'web_app_switch_inline_query'
    | 'web_app_ready';

  interface WebApp {
    initData: string;
    initDataUnsafe: InitData;
    platform: string;
    version: string;
    colorScheme: 'light' | 'dark';
    viewportHeight: number;
    viewportStableHeight: number;
    isExpanded: boolean;
    switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
    shareToStory: (media_url: string, params?: { text?: string }) => void;
    close: () => void;
    isReady: boolean;

    // Add event handling methods
    onEvent: (
      eventType: WebAppEvent,
      eventHandler: (event: any) => void,
    ) => void;

    offEvent: (
      eventType: WebAppEvent,
      eventHandler: (event: any) => void,
    ) => void;
  }

  interface WebView {
    postEvent: (event: string, trigger: () => {}, data: object) => void;
    onEvent: (
      event: WebAppEvent,
      callback: (event: string, data?: object) => void,
    ) => void;
    offEvent: (
      event: WebAppEvent,
      callback: (event: string, data?: object) => void,
    ) => void;
  }
}
