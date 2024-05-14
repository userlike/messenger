<p align="center">
  <img width="144" height="144" src="https://avatars2.githubusercontent.com/u/1116280">
</p>

# Official Userlike Messenger API

## Install

```
npm install @userlike/messenger
```

### ES modules

```js
import { createMessenger } from '@userlike/messenger';
```

### commonjs

```js
const { createMessenger } = require('@userlike/messenger');
```

### AMD loader (requirejs)

```js
require(['userlike-messenger'], function (userlike) {
  userlike.createMessenger({ ... });
});
```

### script tag

```html
<!-- 
unpkg is an open source project. It's not affiliated with Userlike. Use it to quickly and easily load 
messenger api without bundling it yourself. We highly advise against using unpkg for production.
-->
<script src="https://unpkg.com/@userlike/messenger/dist/browser/index.min.js"></script>
<script>
  UserlikeMessenger.createMessenger({ ... });
</script>
```

------

## Usage

See [examples](#examples) for further details on how to use `createMessenger`.

### Usage with typescript
See the [typescript playground](https://codesandbox.io/s/userlike-messenger-api-vanilla-8j47eg?file=/src/index.ts).

### Usage with javascript
See the [javascript playground](https://codesandbox.io/s/userlike-messenger-api-vanilla-js-7rrgm5?file=/src/index.js)

### Usage with react + typescript
See the [react playground](https://codesandbox.io/s/userlike-messenger-api-forked-m32fkz?file=/src/App.tsx).

## Examples
### Create the API

```typescript
import { createMessenger, v1 } from "@userlike/messenger";

async function createApi(): Promise<v1.Api> {
  const result = await createMessenger({
    version: 1,
    widgetKey: "YOUR_WIDGET_SECRET",
  });

  if (result.kind === "error") throw new Error(result.error);

  const { api } = result.value;

  if (api === null) {
    throw new Error(
      "api reached end-of-life, please check documentation and upgrade."
    );
  }

  return api;
}
```

### Create/destroy messenger

```typescript
async (api: v1.Api) => {
  await api.mount();
  await api.unmount();
};
```

### Change visibility

```typescript
// Hide button and notifications
(api: v1.Api) =>
  api.setVisibility({
    main: true,
    button: false,
    notifications: false,
  });

// Show everything
(api: v1.Api) =>
  api.setVisibility({
    main: true,
    button: true,
    notifications: true,
  });
```

### Clear user session / Logout

```typescript
(api: v1.Api) => api.logout();
```

### Maximize/Minimize

```typescript
async (api: v1.Api) => {
  await api.maximize();
  await api.minimize();
};
```

### Set custom data

```typescript
(api: v1.Api) =>
  api.setCustomData({
    test: "test data",
  });
```

### Set contact info

```typescript
(api: v1.Api) =>
  api.setContactInfo({
    name: "Foo Bar",
    email: "foobar@example.com",
  });
```

### Listen to changes

```typescript
const subscription = api.state$.subscribe({
  next: (state) => console.log("next", state),
  complete: () => console.log("complete"),
});

subscription.unsubscribe();
```

You can use `rxjs`, or other streaming libraries:

```typescript
import * as Rx from "rxjs";
import * as $ from "rxjs/operators";
import { v1 } from "@userlike/messenger";

const foo = Rx.pipe(
  api.state$,
  $.filter(({ state }) => state !== v1.MessengerState.Hidden)
);

const bar = Rx.pipe(api.state$, $.map(v1.getUnreadMessageCount));
```

### Error handling
Messenger API never throws an error. Instead it returns an [`ActionResult`](https://github.com/userlike/messenger/blob/master/packages/messenger-internal/src/ActionResult.ts#L4) which represents either a successful outcome or an erroneous outcome.
In technical terms, `ActionResult` is a [tagged union](https://en.wikipedia.org/wiki/Tagged_union) of `ActionSuccess` and `ActionError`, similar to [Rust's `Result<E, T>`](https://doc.rust-lang.org/std/result/).

It's important to notice that the API function won't throw an error by itself, but you need to handle the Action Result and throw an error by yourself as you need it.

## Versioning

_Userlike Messenger API_ follows relatively short cycles of deprecations and end of lifes. The API versioning is designed in such a way to force its consumers to be prepared and to plan for an end-of-life situation. When end-of-life date is reached. that version of the API becomes unavailable; which is reflected in Typescript types.

We highly suggest you to use Typescript to consume _Userlike Messenger API_ so to be able to handle unhappy code paths safely.

### Dates

- **v1** <br />
  Deprecation: 2025-08-01 <br />
  End-of-life: 2026-08-01
