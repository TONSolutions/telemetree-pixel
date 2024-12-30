export enum EventType {
  Click = 'Click',
  PageView = 'Pageview',
  Wallet = 'Wallet',
  Closed = 'Closed',
  MainButtonPressed = 'MainButtonPressed',
  SettingsButtonPressed = 'SettingsButtonPressed',
  InvoiceClosed = 'InvoiceClosed',
  InvoiceOpened = 'Invoice opened',
  PopupClosed = 'PopupClosed',
  ClipboardTextReceived = 'ClipboardTextReceived',
  WriteAccessRequested = 'WriteAccessRequested',
  QRTextReceived = 'QRTextReceived',
  PhoneRequested = 'PhoneRequested',
  BackButtonPressed = 'BackButtonPressed',
  SecondaryButtonPressed = 'SeconadaryButtonPressed',
  PreparedMessageSent = 'PreparedMessageSent',
  FullScreenChanged = 'FullScreenChanged',
  HomeScreenAdded = 'HomeScreenAdded',
  HomeScreenChecked = 'HomeScreenChecked',
  EmojiStatusSet = 'EmojiStatusSet',
  LocationChecked = 'LocationChecked',
  LocationRequested = 'LocationRequested',
  AccelerometerStarted = 'AccelerometerStarted',
  AccelerometerStopped = 'AccelerometerStopped',
  AccelerometerChanged = 'AccelerometerChanged',
  DeviceOrientationStarted = 'DeviceOrientationStarted',
  DeviceOrientationStopped = 'DeviceOrientationStopped',
  DeviceOrientationChanged = 'DeviceOrientationChanged',
  DeviceOrientationFailed = 'DeviceOrientationFailed',
  GyroscropeStarted = 'GyroscropeStarted',
  GyroscropeStopped = 'GyroscropeStopped',
  GyroscropeChanged = 'GyroscropeChanged',
  GyroscropeFailed = 'GyroscropeFailed',
  WebAppRequestFullscreen = 'Fullscreen on',
  WebAppExitFullscreen = 'Fullscreen off',
  SwitchInlineQuery = 'Inline query opened',
  ShareToStory = 'Story shared',
  SessionStart = 'Session start',
  SessionEnd = 'Session end',

  // Wallet events
  WalletConnectStarted = 'Wallet connect started',
  WalletConnected = 'Wallet connected',
  WalletConnectError = 'Wallet connect error',
  WalletConnectionRestoringStarted = 'Wallet connection restoring started',
  WalletConnectionRestored = 'Wallet connection restored',
  WalletConnectionRestoreError = 'Wallet connection restore error',
  WalletDisconnected = 'Wallet disconnected',
  // Transaction events
  TransactionSentForSignature = 'Transaction sent for signature',
  TransactionSigned = 'Transaction signed',
  TransactionSigningFailed = 'Transaction signing failed',
}

export enum TonConnectEvent {
  WalletConnectStarted = 'connection-started',
  WalletConnectSuccess = 'connection-completed',
  WalletConnectError = 'connection-error',
  ConnectionRestoringStarted = 'connection-restoring-started',
  ConnectionRestoringSuccess = 'connection-restoring-completed',
  ConnectionRestoringError = 'connection-restoring-error',
  WalletDisconnect = 'disconnection',
  TransactionSentForSignature = 'transaction-sent-for-signature',
  TransactionSigned = 'transaction-signed',
  TransactionSigningFailed = 'transaction-signing-failed',
}