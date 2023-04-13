# YouTube - Piano Analytics plugin

The `YouTube` plugin enables you to track YouTube videos on your website with the Piano Analytics SDK. The plugin makes the tracking as simple as possible, while keeping all the flexibility of the AV Insights module.

By installing the JS library on your website and following the documentation below, you will be able to fully track YouTube videos. The plugin will automatically send contextual and technical events according to the media information provided.

It also includes a function enabling you to add your own properties to the events.

## Table of content

- Get started
- Install the plugin
- Reference our functions in the YouTube code
- Add properties to your events
- Complete tagging example

## Getting Started

- Load the `youtube-pa-connector.js` plugin in your project just after the `piano-analytics.js` library
- Read the documentation for an overview of the functionalities and examples
- Collect AV Insights events from your YouTube videos.

## Install the plugin

Download the `youtube-pa-connector.js` directly from [this repo](youtube-pa-connector.js) and install it along with the `piano-analytics.js` library.

```html
<script src="piano-analytics.js"></script>
<script type="text/javascript">
  pa.setConfigurations({
    // Basic configuration to send events
    site: 123456789,
    collectDomain: "https://logsx.xiti.com",
  });
</script>
<script src="youtube-pa-connector.js"></script>
```

## Reference our functions in the YouTube code

YouTube provides the following code to embed its video player on an HTML page (doc: [YouTube Player API Reference for iframe Embeds](https://developers.google.com/youtube/iframe_api_reference))

```html
<html>
  <body>
    <div id="player"></div>
    <script>
      var tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player("player", {
          height: "360",
          width: "640",
          videoId: "M7lc1UVf-VE",
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      }
    </script>
  </body>
</html>
```

### Map events to plugin functions

You have to replace the `events` parameter in the `player` variable in order to reference the plugin's functions:

_Base code_

```js
events: {
  'onReady': onPlayerReady,
  'onStateChange': onPlayerStateChange
}
```

_Modified code_

```js
events: {
  'onReady': paYoutubeConnector.onPlayerReady,
  'onStateChange': paYoutubeConnector.onPlayerStateChange,
  'onError': paYoutubeConnector.onError,
  'onPlaybackQualityChange': paYoutubeConnector.onPlaybackQualityChange,
  'onPlaybackRateChange': paYoutubeConnector.onPlaybackRateChange
}
```

### Setup plugin configuration

You then need to add plugin configuration to reference the media:

```js
paYoutubeConnector.media = new pa.avInsights.Media(5, 5);
paYoutubeConnector.params = {
  av_content_type: "Video clip",
  av_content_genre: ["Medieval", "Rap", "Bardcore", "Tavernware"],
  av_author: "Eminem",
  av_publication_date: 1613516400,
};
```

## Add properties to your events

The plugin supports the following events:

`av.play` / `av.start` / `av.heartbeat` / `av.pause` / `av.resume` / `av.stop `

The following properties are automatically set by the plugin.

| Property key         | Type    | Mandatory | Description                                              | Source                           |
| -------------------- | ------- | --------- | -------------------------------------------------------- | -------------------------------- |
| av_content_id        | string  | yes       | Audio/Video content identifier                           | `player.getVideoData().video_id` |
| av_content           | string  | -         | Title of the Audio/Video content                         | `player.getVideoData().title`    |
| av_content_duration  | integer | -         | Total duration of the Audio/Video content (milliseconds) | `player.getDuration()`           |
| av_broadcasting_type | string  | -         | Broadcasting type (live or clip)                         | `player.getVideoData().isLive`   |

You can set additional properties using the `paYoutubeConnector.params` method:

Method: `paYoutubeConnector.params = <propertiesObject>`

| Property key       | Type   | Mandatory                                  |
| ------------------ | ------ | ------------------------------------------ |
| `propertiesObject` | object | Pairs of `propertyKey` and `propertyValue` |

```html
<script>
  paYoutubeConnector.media = new pa.avInsights.Media(5, 5);
  paYoutubeConnector.params = {
    av_content_type: "TV show",
    av_content_genre: ["Crime", "Drama", "Mystery"],
    av_show: "Dark",
    av_publication_date: 15010656730,
  };
</script>
```

## Complete tagging example

```html
<html>
  <head>
    <title>My Page</title>
    <script src="piano-analytics.js"></script>
    <script type="text/javascript">
      pa.setConfigurations({
        // Basic configuration to send events
        site: 123456789,
        collectDomain: "https://logsx.xiti.com",
      });
    </script>
    <script src="youtube-pa-connector.js"></script>
  </head>
  <body>
    <div id="player"></div>
    <script type="text/javascript">
      var tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player("player", {
          height: "360",
          width: "640",
          videoId: "M7lc1UVf-VE",
          events: {
            onReady: paYoutubeConnector.onPlayerReady,
            onStateChange: paYoutubeConnector.onPlayerStateChange,
            onError: paYoutubeConnector.onError,
            onPlaybackQualityChange: paYoutubeConnector.onPlaybackQualityChange,
            onPlaybackRateChange: paYoutubeConnector.onPlaybackRateChange,
          },
        });
      }
      paYoutubeConnector.media = new pa.avInsights.Media(5, 5);
      paYoutubeConnector.params = {
        av_content_type: "Video clip",
        av_content_genre: ["Medieval", "Rap", "Bardcore", "Tavernware"],
        av_author: "Eminem",
        av_publication_date: 1613516400,
      };
    </script>
  </body>
</html>
```
