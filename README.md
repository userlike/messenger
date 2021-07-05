<p align="center">
  <img width="144" height="144" src="https://avatars2.githubusercontent.com/u/1116280">
</p>

# Official Userlike Messenger API

## Install

```
npm install @userlike/messenger
```

## Usage

If you are using a bundler such as webpack, browserify, parcel etc, it's as simple as importing `@userlike/messenger` as done by examples below.

If you want to use it in the browser without bundling, you can load `dist/browser/index.min.js` using a `<script>` element and then use it like `window.userlikeMessenger.createMessenger({ ... })` instead of importing.

## Examples

### Create the API

See the [playground](https://codesandbox.io/s/userlike-messenger-api-qyqkg).

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

## Versioning

_Userlike Messenger API_ follows relatively short cycles of deprecations and end of lifes. The API versioning is designed in such a way to force its consumers to be prepared and to plan for an end-of-life situation. When end-of-life date is reached. that version of the API becomes unavailable; which is reflected in Typescript types.

We highly suggest you to use Typescript to consume _Userlike Messenger API_ so to be able to handle unhappy code paths safely.

### Dates

- **v1** <br />
  Deprecation: 2021-08-01 <br />
  End-of-life: 2022-08-01
