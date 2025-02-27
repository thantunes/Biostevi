# Slider Layout SEO

Slider Layout is a flexible solution for building block sliders in VTEX Store Framework, such as a carousel component.

![](https://cdn.jsdelivr.net/gh/vtexdocs/dev-portal-content@main/images/vtex-slider-layout-0.png)

> _To use the Slider layout as a substitute for the [Carousel app](https://github.com/vtex-apps/carousel), read the [Building a Carousel through lists and Slider Layout](https://developers.vtex.com/docs/guides/vtex-io-documentation-building-a-carousel-using-slider-layout) documentation._

## Google Analytics 4 Integration

Slider Layout enables you to integrate your component with [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4).
The integration happens through the [`GA4 view_promotion`](https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#view_promotion) event, which is typically associated with the promotion banners carousel displayed by the Slider Layout.

By integrating with Google Analytics 4, you can set the `Product ID` and `Product Name`, and position of your promotion on [Site Editor](https://help.vtex.com/en/tutorial/site-editor-overview--299Dbeb9mFczUTyNQ9xPe1) to be shown on a Google Analytics dashboard.

To set this up, go to the VTEX Admin, access **Storefront > Site Editor**, and open the image settings of the internal promotion you want to track. These settings are displayed on the right side of the page.

![ga4-in-site-editor](https://vtexhelp.vtexassets.com/assets/docs/src/gtm-site-editor___bc52365aafad63deb5bfed1d74f307c0.png)

> For more information about managing your page content, read [Managing page and template content](https://help.vtex.com/en/tutorial/managing-page-and-template-content--3tMbx6HXy4Fy5r9EhboG37).

After setup, Google Analytics can track your internal promotions and generate reports of their views, clicks, click-through rate, conversions, and revenue.

## Configuration

1. Edit the `manifest.json` file, on tag vendor, to vendor of your respective client:{

   ```
   {
     "name": "slider-layout-seo",
     "vendor": "clientvendorname",
     "version": "0.24.6",
     ...
   }

   ```
2. Add the `slider-layout-seo` app to your theme dependencies in the `manifest.json` file:

```json
"dependencies": {
  "{vendorname}.slider-layout-seo": "0.x"
}
```

Now, you can use all blocks exported by the `slider-layout-seo` app. See the complete list below:

| Block name                  | Description                                                                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `slider-layout-seo`       | ![https://img.shields.io/badge/-Mandatory-red](https://img.shields.io/badge/-Mandatory-red) Builds block sliders for your store through its `children` list blocks. |
| `slider-layout-group-seo` | Enables you to keep a group of `slider-layout-seo` blocks synched with each other. For more information about this, see the Advanced configuration section below. |

2. Add the `slider-layout-seo` block to your template. For example:

```json
  "slider-layout-seo#text-test": {
    "props": {
      "itemsPerPage": {
        "desktop": 1,
        "tablet": 1,
        "phone": 1
      },
      "infinite": true,
      "showNavigationArrows": "desktopOnly",
      "blockClass": "carousel"
    },
    "children": ["rich-text#1", "rich-text#2", "rich-text#3"]
  },

  "rich-text#1": {
    "props": {
      "text": "Test1"
    }
  },
  "rich-text#2": {
    "props": {
      "text": "Test2"
    }
  },
  "rich-text#3": {
    "props": {
      "text": "Test3"
    }
  },
```

| Prop name                | Type                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Default value                            |
| ------------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `label`                | `string`              | `aria-label` attribute value to be used by the `<Slider/>` component when rendered. The `aria-label` value should explicitly tell users what the inspected HTML element does.                                                                                                                                                                                                                                                                                                                                                                                                                                             | `slider`                               |
| `showNavigationArrows` | `enum`                | Indicates when navigation arrows should be rendered. Possible values are:`mobileOnly`, `desktopOnly`, `always`, or `never`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `always`                               |
| `showPaginationDots`   | `enum`                | Indicates when pagination dots should be rendered. Possible values are:`mobileOnly`, `desktopOnly`, `always`, or `never`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `always`                               |
| `infinite`             | `boolean`             | Determines whether the slider should be infinite (`true`) or not (`false`). When this prop is set as `false`, the slider will have an explicit end for users.                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `false`                                |
| `usePagination`        | `boolean`             | Determines whether the slider should use slide pages (`true`) or not (`false`). When this prop is set as `false`, the slider will use smooth scrolling for slide navigation instead of arrows.                                                                                                                                                                                                                                                                                                                                                                                                                            | `true`                                 |
| `itemsPerPage`         | `object`              | The number of slider items to be shown on each type of device. For more information about this, see the `itemsPerPage` object section below.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `{ desktop: 5, tablet: 3, phone: 1 }`  |
| `navigationStep`       | `number` / `enum`   | The number of slider items that should be displayed when users click one of the slider arrows. It is also possible to set this prop value as `page`, meaning that the number of slider items to be displayed when one of the arrows is clicked is equal to the number of slider items set per page (in the `itemsPerPage` prop).                                                                                                                                                                                                                                                                                            | `page`                                 |
| `slideTransition`      | `object`              | Controls the transition animation between slides based on[CSS attributes](https://developer.mozilla.org/en-US/docs/Web/CSS/transition). For more information about this, see the `slideTransition` object section below.                                                                                                                                                                                                                                                                                                                                                                                                         | `{ speed: 400, delay: 0, timing: '' }` |
| `autoplay`             | `object`              | Controls the autoplay feature behavior. For more information about this, see the `autoplay` object section below.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `undefined`                            |
| `fullWidth`            | `boolean`             | Determines whether the slides should occupy the full page width, making the arrows appear on top of them (`true`) or not (`false`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `true`                                 |
| `arrowSize`            | `number` / `object` | Slider arrows size (height and width) in pixels. This is a responsive prop, which means you can pass to it an object with different values for each breakpoint (`desktop`, `mobile`, `tablet`, and `phone`).                                                                                                                                                                                                                                                                                                                                                                                                            | `25`                                   |
| `centerMode`           | `enum` / `object`   | Defines positioning of the slider elements on the screen. Possible values are:`center` (elements are centered, allowing users to see a peek of the previous and next slides), `to-the-left` (aligns elements to the left side, allowing users to see a peek of the next slide, but not the previous one), and `disabled` (disables the feature, rendering elements on the whole screen without showing a peek of the previous and next slides). Note: This is a responsive prop, which means you can pass to it an object with different values for each breakpoint (`desktop`, `mobile`, `tablet`, and `phone`). | `disabled`                             |
| `centerModeSlidesGap`  | `number`              | Number of pixels between slides when `centerMode` is set to `center` or `to-the-left`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `undefined`                            |

- **`itemsPerPage` object**

| Prop name   | Type       | Description                                              | Default value |
| ----------- | ---------- | -------------------------------------------------------- | ------------- |
| `desktop` | `number` | The number of slides to be displayed on desktop devices. | `5`         |
| `tablet`  | `number` | The number of slides to be displayed on tablet devices.  | `3`         |
| `phone`   | `number` | The number of slides to be displayed on phone devices.   | `1`         |

- **`slideTransition` object**

| Prop name  | Type       | Description                                 | Default value |
| ---------- | ---------- | ------------------------------------------- | ------------- |
| `speed`  | `number` | Transition speed (in `ms`).               | `400`       |
| `delay`  | `number` | Delay between slide transition (in `ms`). | `0`         |
| `timing` | `string` | Timing function.                            | `''`        |

- **`autoplay` object**

| Prop name       | Type        | Description                                                                                                        | Default value |
| --------------- | ----------- | ------------------------------------------------------------------------------------------------------------------ | ------------- |
| `timeout`     | `number`  | Timeout (in `ms`) between each slide.                                                                            | `undefined` |
| `stopOnHover` | `boolean` | Determines whether the autoplay should stop when users are hovering over the slider (`true`) or not (`false`). | `undefined` |

## Advanced configuration

The `slider-layout-group-seo` block synchronizes the slides rendered by each `slider-layout-seo` block declared in it.

Therefore, the `slider-layout-group-seo` does not render any specific component on the store UI. It is really a logical block that only expects to receive a `children` block list containing the desired `slider-layout-seo` blocks that should be rendered. For example:

```json
{
  "slider-layout-group-seo#test": {
    "children": ["slider-layout-seo#1", "slider-layout-seo#2", "slider-layout-seo#3"]
  }
}
```

Below, you can find a practical example using three `slider-layout-seo` blocks inside of a `slider-layout-group-seo`. Each `slider-layout-seo` received three `rich-text` blocks as `children` to serve as individual slides:

![slider-layout-group demo](https://cdn.jsdelivr.net/gh/vtexdocs/dev-portal-content@main/images/vtex-slider-layout-3.gif)

> ⚠️ **\*All `slider-layout-seo` blocks declared in the `slider-layout-group-seo` must have the same configuration, meaning the same props and values**. Due to implementation rules, they can only differ in their `children` block list. Keep in mind that declaring `slider-layout-seo` blocks with different configurations will result in unexpected behavior, leading to errors that are **not** supported by the VTEX Store Framework team.\*

## Customization

To apply CSS customizations to this and other blocks, follow the instructions given in the recipe on [Using CSS handles for store customization](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-css-handles-for-store-customization).

| CSS handles                 |
| --------------------------- |
| `paginationDot--isActive` |
| `paginationDot`           |
| `paginationDotsContainer` |
| `slide--firstVisible`     |
| `slide--hidden`           |
| `slide--lastVisible`      |
| `slide--visible`          |
| `slideChildrenContainer`  |
| `slide`                   |
| `sliderArrows`            |
| `sliderLayoutContainer`   |
| `sliderLeftArrow`         |
| `sliderRightArrow`        |
| `sliderTrackContainer`    |
| `sliderTrack`             |

<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore-start -->

<!-- markdownlint-disable -->

<!-- markdownlint-enable -->

<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->
