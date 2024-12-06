# TON Solutions Telemetree Pixel

![](https://tc-images-api.s3.eu-central-1.amazonaws.com/gif_cropped.gif)

**Welcome to Telemetree Pixel, the dedicated solution for integrating powerful analytics into your Telegram Mini Apps or websites. Pixel is easy to implement and it provides  real-time insights into how users interact with your application.**

The vanilla Javascript library collects events as effeciently as the [Telemetree React SDK](https://docs.telemetree.io/sdks/react) while being framework agnostic.

![Alt](https://repobeats.axiom.co/api/embed/c308ebe7936f3509b3d1afe88cc18eb64ef138c9.svg "Repobeats analytics image")

## Requirements

There is only one really: a web application that can run Javascript.

## Setup

Place these scripts before the closing `<head>` tag in your tempate or call it accordingly to your framework of choice practices:
```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>

// For fully compatible version:
<script src="https://cdn.jsdelivr.net/gh/TONSolutions/telemetree-pixel@main/telemetree-pixel.js"></script>

// Or for the latest version:
<script src="https://cdn.jsdelivr.net/gh/TONSolutions/telemetree-pixel@dd564d0d80d380b01d0f9a19c4116beb768bacc8/telemetree-pixel.js"></script>
```

And inside the `<body>` initialise Telemetree with your credentials like so:

```javascript
<script>
    const telemetreeBuilder = telemetree({
        projectId: "YOUR_PROJECT_ID",
        apiKey: "YOUR_API_KEY",
        appName: "YOUR_APPLICATION_NAME",
        isTelegramContext: true, // use false, if a website is not in Telegram Web App context
    });
</script>
```
That's it! Now you can add custom events with `telemetreeBuilder.track` function transfering any type of valuable information required for the further analysis:

```html
<script>
    telemetreeBuilder.track('transfer', {
        amount: 1000,
        method: 'TON',
    });
</script>
```

Default set of events like pageload is automatically tracked and collected by the library and you don't need to specifically wrap those unless you want custom data to be collected on such actions.

> [!TIP]
> You can use [Telemetree React SDK](https://docs.telemetree.io/sdks/react) and Telemetree Pixel simultaniously in your app if for some reason you have to. Just make sure to avoid data duplication problems.

## User data and Processing

Adhering to Telegram's high standards of security, we employ RSA encryption for the transmission of data across networks, ensuring both the integrity and safety of your analytics processes. You can learn more in the dedicated section of our official [Documentation](https://docs.telemetree.io/essentials/data-security).

> [!NOTE]
> The Pixel is a more lightweight solution compared to the [React SDK](https://docs.telemetree.io/sdks/react) but it's also a more generic solution. If your app is React based consider an SDK first approach.

## Debugging
- Use browser developer tools to monitor network requests and confirm that events are being sent to Telemetree.
- Add console logs in your event handling functions to verify that events are being triggered as expected.

## Other options

We also provide a [Python SDK](https://docs.telemetree.io/sdks/python) for tracking backend related events and a [REST API](https://docs.telemetree.io/api-reference/cpa-ads-network/fetch-tasks-endpoint) (Beta) to build your custom solution on top of it.

## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

## License
This project is licensed under the MIT License. See the LICENSE file for more information.

## Support
If you have any questions or need assistance, please contact our support team at [support@ton.solutions](support@ton.solutions) or file an issue in the repository.
