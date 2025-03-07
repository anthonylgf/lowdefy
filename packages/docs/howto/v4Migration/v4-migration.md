# Version 3 to Version 4 Migration Guide

## Payload on Requests

In version 3, the `state`, `global`, `input`, `urlQuery` and `event` data objects were sent with the request, so that the `_state`, `_global`, `_input`, `_url_query` and `_event` operators can be used inside requests and connections. This caused problems if the state became to large, as this would result in a payload size exceeded error on request calls.

In version 4, these operators can no longer be used in requests, and request payloads are introduced, which can be used to specify the data that should be sent with the request. The data specified in the payload can be accessed using the `_payload` operator. Operators are evaluated in the payload before it is sent, so operators like `_state` can be used in the payload.

If only the `_state` operator was used, the entire state object can be set as the payload:

###### Version 3:

```yaml
id: api_call
type: AxiosHttp
connectionId: my_api
properties:
  url: /products/new
  method: post
  data:
    name:
      _state: name
    product_category:
      _state: name
```

###### Version 4:

```yaml
id: api_call
type: AxiosHttp
connectionId: my_api
payload:
  _state: true
properties:
  url: /products/new
  method: post
  data:
    name:
      _payload: name
    product_category:
      _payload: name
```

The payload can also be created more explicitly using more than one operator type:

###### Version 3:

```yaml
id: api_call
type: AxiosHttp
connectionId: my_api
properties:
  url: /products/update
  method: post
  data:
    id:
      _url_query: id
    name:
      _state: name
```

###### Version 4:

```yaml
id: api_call
type: AxiosHttp
connectionId: my_api
payload:
  id:
    _url_query: id
  name:
    _state: name
properties:
  url: /products/new
  method: post
  data:
    id:
      _payload: id
    name:
      _payload: name
```

The `user` operator is still available in requests, and the `_user` operator should be used in the request properties not in they payload as malicious users can modify the data sent in payload.

###### Don't do:

```yaml
id: api_call
type: AxiosHttp
connectionId: my_api
payload:
  # ...
  created_by:
    _user: id
properties:
  url: /products/new
  method: post
  data:
    # ...
    created_by:
      _payload: created_by
```

###### Do:

```yaml
id: api_call
type: AxiosHttp
connectionId: my_api
payload:
  # ...
properties:
  url: /products/new
  method: post
  data:
    # ...
    created_by:
      _user: id
```

> If you see a warning message like `Operator type "_state" was used but is not defined.` you are using the `_state` operator in a request's properties and should move it to payload.

## Icons

The Ant Design icons used in version 3 have been replaced by [React Icons](https://react-icons.github.io/react-icons/), which has a much larger library of icons to choose from, including the Ant Design icons. To use a React Icon, set the `icon` or `icon.name` property to the React Icon name.

To convert existing Ant Design icons to React Icons, the icon names should be changed to the new format:

###### Version 3:

```yaml
id: save_button
type: Button
properties:
  icon: SaveOutlined
```

###### Version 4:

```yaml
# Using the same Ant Design icon
id: save_button
type: Button
properties:
  icon: AiOutlineSave
```

```yaml
# Using the Font Awesome icon
id: save_button
type: Button
properties:
  icon: FaRegSave
```

## Renames and Minor changes

The `Message` action has been renamed to `DisplayMessage`. Change the type name of `Message` actions to `DisplayMessage`.

The `onEnter` and `onEnterAsync` events have been removed as their functionality are duplicated by the `onMount` and `onMountAsync` events. Rename all `onEnter` and `onEnterAsync` events to `onMount` and `onMountAsync`.

Duplicate action ids in the same action chain were allowed in version 3, but are not allowed in version 4. If you get a build error about duplicate action ids, give the actions unique ids.

The `Notification` action has been removed. Switch to the `DisplayMessage` action, or use a `Notification` block and the `CallMethod` action to open the notification.

The 404 page is now always a public page.

The `Anchor` block properties schema has changed. The `href` property has been removed and it now takes the same props as the `Link` action.

The `_yaml.parse` operator now takes an object with a `on` property or an array where the first argument is the string to parse, instead of just a string, to allow it to take additional options.

The `ChromeColorSelector`, `CircleColorSelector`, `CompactColorSelector`, `GithubColorSelector`, `SliderColorSelector`, `SwatchesColorSelector`, and `TwitterColorSelector` have been replaced by the `ColorSelector` block.

The `color` properties in blocks like `MobileMenu`, `PageHeaderMenu`, `PageSiderMenu`, `PageHCF`, `PageHCSF`, `PageHSCF`, and `PageSHCF` have been removed. Use Ant Design theme less variables instead.

The `_var` operator `name` param has been renamed to `key` to be more consistent with other getter operators.

## Block Loading States

The page loading states in version 4 have been improved. In general apps should load a lot faster. Blocks will now be a lot less likely to show a loading state and rather render as normal, and render their children. Input blocks will be disabled while in a loading state. This contributes to users seeing useful content sooner, and to less layout shift once the app finishes loading.

In version 3, blocks had a `loading` (property?) to specify the loading skeleton that should be used while the block is in a loading state. This functionality has been replaced by the `skeleton` property. The `loading` property is now used to control the loading state of the block. The block will be in a loading state if an `onInit` or `onMount` event is busy, if a parent block is loading of if the `loading` property evaluates to true. See more about loading here.

#### TODO: Add link to loading docs.

The convert from version 3 to version 4, replace the `loading` property on blocks with the `skeleton` property.

###### Version 3:

```yaml
id: paragraph_one
type: Markdown
loading:
  type: SkeletonParagraph
  properties:
    lines: 5
properties:
  content:
    _request: get_text.body_text
```

###### Version 4:

```yaml
id: paragraph_one
type: Markdown
skeleton:
  type: SkeletonParagraph
  properties:
    lines: 5
properties:
  content:
    _request: get_text.body_text
```

```yaml
# Keep the block in loading while the request is loading
id: paragraph_one
type: Markdown
loading:
  _eq:
    - _request: get_text
    - null
skeleton:
  type: SkeletonParagraph
  properties:
    lines: 5
properties:
  content:
    _request: get_text.body_text
```

## Static files

Static files placed in the `public` folder of your project were always served from the public url path - for example `https://example.com/public/filename.jpeg`. These files are now served from the root path (this right?) of your app. The example above will now be served from `https://example.com/filename.jpeg`. This allows you to serve files like `robots.txt` and `sitemap.xml` from the root path. Change all references in your config to the new paths.

If you still want to serve assests under the `/public` path, you can add an addition `public` folder inside the existing `public` folder:

```txt
.
├─ public
│  └─ public
│     └─ my-logo.jpeg
└─ lowdefy.yaml
```

## Authentication Changes

#### TODO: Update once new auth has been documented

In version 4, authentication has been reworked to use [NextAuth.js](https://next-auth.js.org), which offers a lot more flexibility and additional features.

- `auth` is now a root level property.
- remove `openId` fields.
- add providers:

```yaml
providers:
  - id: auth0
    type: Auth0Provider
    properties:
      clientId:
        _secret: AUTH0_CLIENT_ID
      clientSecret:
        _secret: AUTH0_CLIENT_SECRET
      issuer:
        _secret: AUTH0_ISSUER
```

- Add env vars `NEXTAUTH_URL` and `NEXTAUTH_SECRET`.
- Add new callback urls to auth0 `{{ protocol }}{{ host }}/api/auth/callback/{{ providerId }}`.
- convert login params (`callbackUrl`, `authUrl.urlQuery`)

## Custom Blocks, Actions and Operators

#### TODO: Add link to plugins guide

Custom blocks, the `JsAction` action and the `_js` operator have been replaced by the new Lowdefy plugin system which is an easier, more powerful and standardized way to extend actions, blocks, connections, operators and the authentication system with custom JavaScript. See the plugin guide for more information on how to use and develop plugins.

The [AgGrid](https://github.com/lowdefy/blocks-aggrid) custom blocks have been added as default Lowdefy blocks, so these blocks can now be used without any additional configuration.

## Context has been removed

In version 3, the first block on a page needs to be a `context` category block. This was because in version 3 you could have multiple context blocks on the same page, each with it's own separate state.

This feature was found to be unnecessary, create additional complexity and was difficult to understand, so it was removed.

The `Context` type block was removed, as it was a `Box` block that also created a context. The `Context` block can be replaced by a `Box`.

If the `Context` block is no longer necessary it can also be removed.

###### Version 3:

```yaml
id: '404'
type: Context
style:
  minHeight: 100vh
blocks:
  - id: 404_result
    type: Result
    properties:
      status: 404
      title: '404'
      subTitle: Sorry, the page you are visiting does not exist.
```

###### Version 4:

```yaml
id: '404'
type: Result
style:
  minHeight: 100vh
properties:
  status: 404
  title: '404'
  subTitle: Sorry, the page you are visiting does not exist.
```
