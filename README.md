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

## Upgrading to Version 2

Version 2 is a breaking change that adds support for widget routers on single page applications. If you are using version 1, we highly recommend upgrading to version 2 as soon as possible.

------

## Usage

See [examples](#examples) for further details on how to use `createMessenger`.

### Usage with typescript
See the [typescript playground](https://codesandbox.io/p/sandbox/userlike-messenger-api-vanilla-v2-kjkflq).

### Usage with javascript
See the [javascript playground](https://codesandbox.io/p/sandbox/bold-ramanujan-9tcmmk).

### Usage with react + typescript
See the [react playground](https://codesandbox.io/p/sandbox/userlike-messenger-api-v2-p2c8fq).

## Examples
### Create the API

```typescript
import { createMessenger, v1 } from "@userlike/messenger";

async function createApi(): Promise<v2.Api> {
  const result = await createMessenger({
    version: 2,
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
(api: v2.Api) => {
  const subscription = api.mount().subscribe(result => {
    if (result.kind === "error") {
      console.error(result.error);
      return;
    }

    const messenger = result.value;
  });

  // Unsubscribing would destroy the messenger
  subscription.unsubscribe();
};
```

### Change visibility

```typescript
// Hide button and notifications
async (messenger: v2.Messenger) => {
  await messenger.setVisibility({
    main: true,
    button: false,
    notifications: false,
  });
}

// Show everything
async (messenger: v2.Messenger) => {
  await messenger.setVisibility({
    main: true,
    button: true,
    notifications: true,
  });
}
```

### Clear user session / Logout

```typescript
async (messenger: v2.Messenger) => {
  await messenger.logout();
}
```

### Maximize/Minimize

```typescript
async (messenger: v2.Messenger) => {
  await messenger.maximize();
  await messenger.minimize();
};
```

### Set custom data

```typescript
async (messenger: v2.Messenger) => {
  await messenger.setCustomData({
    test: "test data",
  });
}
```

### Set contact info

```typescript
async (messenger: v2.Messenger) => {
  await messenger.setContactInfo({
    name: "Foo Bar",
    email: "foobar@example.com",
  });
}
```

### Listen to changes

```typescript
(messenger: v2.Messenger) => {
  const subscription = messenger.state$.subscribe({
    next: (state) => console.log("next", state),
    complete: () => console.log("complete"),
  });

  // unsubscribe when you don't need to listen to changes anymore
  subscription.unsubscribe();
}
```

### Observables

Both `api.mount()` and `messenger.state` are observables. You can use `rxjs`, or other streaming libraries:

```typescript
import * as Rx from "rxjs";
import * as $ from "rxjs/operators";
import { v1 } from "@userlike/messenger";

(api: v2.Api) => {
  const unreadMessageCount$ = Rx.pipe(
    api.mount(),
    $.filter((result) => result.kind === 'success'),
    $.map((result) => result.value),
    $.switchMap((messenger) => messenger.state$),
    $.map(v2.getUnreadMessageCount),
  );
}
```

### Error handling
Messenger API never throws an error. Instead it returns an [`ActionResult`](https://github.com/userlike/messenger/blob/master/packages/messenger-internal/src/ActionResult.ts#L4) which represents either a successful outcome or an erroneous outcome.
In technical terms, `ActionResult` is a [tagged union](https://en.wikipedia.org/wiki/Tagged_union) of `ActionSuccess` and `ActionError`, similar to [Rust's `Result<E, T>`](https://doc.rust-lang.org/std/result/).

It's important to notice that the API function won't throw an error by itself, but you need to handle the Action Result and throw an error by yourself as you need it.

## Versioning

_Userlike Messenger API_ follows relatively short cycles of deprecations and end of lifes. The API versioning is designed in such a way to force its consumers to be prepared and to plan for an end-of-life situation. When end-of-life date is reached. that version of the API becomes unavailable; which is reflected in Typescript types.

We highly suggest you to use Typescript to consume _Userlike Messenger API_ so to be able to handle unhappy code paths safely.

### Dates

- **v2** <br />
  Deprecation: 2026-08-01 <br />
  End-of-life: 2027-08-01
- **v1** <br />
  Deprecation: 2025-08-01 <br />
  End-of-life: 2026-08-01
