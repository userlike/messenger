<p align="center">
  <img width="144" height="144" src="https://avatars2.githubusercontent.com/u/1116280">
</p>


# Userlike Messenger API

<!-- prettier-ignore-start -->

## Table of Contents

* [Install](#install)
  + [ES modules](#es-modules)
  + [commonjs](#commonjs)
  + [AMD loader (requirejs)](#amd-loader-requirejs)
  + [script tag](#script-tag)
* [Upgrading to Version 2](#upgrading-to-version-2)
* [Usage](#usage)
* [Examples](#examples)
  + [Create the API](#create-the-api)
  + [Create/destroy messenger](#createdestroy-messenger)
  + [Change visibility](#change-visibility)
  + [Clear user session / Logout](#clear-user-session--logout)
  + [Maximize/Minimize](#maximizeminimize)
  + [Set custom data](#set-custom-data)
  + [Set contact info](#set-contact-info)
  + [Listen to changes](#listen-to-changes)
  + [Observables](#observables)
* [Error Handling](#error-handling)
* [Contact Authentication](#contact-authentication)
* [CSP](#csp)
* [Versioning](#versioning)
  + [Dates](#dates)

<!-- prettier-ignore-end -->

## Install

```
npm install @userlike/messenger
```

### ES modules

```js
import { createMessenger } from "@userlike/messenger";
```

### commonjs

```js
const { createMessenger } = require("@userlike/messenger");
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
messenger API without bundling it yourself. We highly advise against using unpkg for production.
-->
<script src="https://unpkg.com/@userlike/messenger/dist/browser/index.min.js"></script>
<script>
  UserlikeMessenger.createMessenger({ ... });
</script>
```

## Upgrading to Version 2

Version 2 introduces breaking changes, including support for widget routers on single page applications and improved API structure. If you are using version 1, we highly recommend upgrading to version 2 as soon as possible.

- **Key changes in v2:**
  - Support for widget routers in single page applications (SPA)
  - Improved API structure and error handling

See the [migration guide](./MIGRATION.md) for detailed upgrade instructions.

## Usage

See [examples](#examples) for further details on how to use `createMessenger`.

**Typescript:** [typescript playground](https://codesandbox.io/p/sandbox/userlike-messenger-api-vanilla-v2-kjkflq).

**Javascript:** [javascript playground](https://codesandbox.io/p/sandbox/bold-ramanujan-9tcmmk).

**React + typescript:** [react playground](https://codesandbox.io/p/sandbox/userlike-messenger-api-v2-p2c8fq).

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
      "api reached end-of-life, please check documentation and upgrade.",
    );
  }

  return api;
}
```

### Create/destroy messenger

```typescript
(api: v2.Api) => {
  const subscription = api.mount().subscribe((result) => {
    if (result.kind === "error") {
      console.error(result.error);
      return;
    }

    if (result.value === null) {
      console.log("messenger is not mounted", result.reason);
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
};

// Show everything
async (messenger: v2.Messenger) => {
  await messenger.setVisibility({
    main: true,
    button: true,
    notifications: true,
  });
};
```

### Clear user session / Logout

```typescript
async (messenger: v2.Messenger) => {
  await messenger.logout();
};
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
};
```

### Set contact info

```typescript
async (messenger: v2.Messenger) => {
  await messenger.setContactInfo({
    name: "Foo Bar",
    email: "foobar@example.com",
  });
};
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
};
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
    $.filter((result) => result.kind === "success"),
    $.map((result) => result.value),
    $.switchMap((messenger) => messenger.state$),
    $.map(v2.getUnreadMessageCount),
  );
};
```

## Error Handling

All Messenger API methods return a `Result` object, which is a tagged union of `Success` and `Error` (similar to [Rust's `Result<T, E>`](https://doc.rust-lang.org/std/result/)). The API itself never throws exceptions. You are responsible for checking the result and handling errors as needed.

**Result Structure:**

- `{ kind: "success", value: ... }` for successful operations
- `{ kind: "error", error: ... }` for failed operations

**Example:**

```typescript
const result = await api.someAction();

if (result.kind === "error") {
  // Handle the error (e.g., log, show message, or throw)
  console.error("Messenger API error:", result.error);
  throw new Error(result.error);
}

// Success case
const value = result.value;
```

> **Best Practice:** Always check the `kind` property before accessing the result value. Using TypeScript helps ensure you handle both success and error cases safely.

For more details, see the [`Result` type definition](https://github.com/userlike/messenger/blob/master/packages/messenger-internal/src/shared/Result.ts).

## Contact Authentication

To use Contact Authentication, you first need to create a secret "Messenger API authentication signing key" in your API settings. You then need to securely store that signing key in your system and create a service that uses that signing to create a JWT that we use to authenticate a Contact.

The JWT payload must be signed using your messenger signing key via `HMAC-SHA256` and must have the following shape:

```typescript
interface TokenPayload {
  sub: string; // a unique ID of your choice that you want to use to identify the Contact (max length: 255)
  iat: number; // "issued at" unix timestamp, in seconds
  exp: number; // "expires at" unix timestamp, in seconds
}
```

You can then pass the externalToken configuration when calling the mount() function of our Messenger API:

```typescript
api.mount({
  externalToken: {
    getToken: () => {
      // return a JWT created by your service
    },
    onError: (e) => {
      // callback to handle errors related to contact authentication
    },
  },
});
```

When the JWT is valid, your Contacts will have access to all their ongoing and previous conversations regardless of which browser, device, or platform they're using the Messenger on.

In case the JWT is invalid (for example when it expired or was signed incorrectly) the `onError` callback is called.

## CSP

To use the Userlike Messenger API in your application, you need to ensure that your Content Security Policy (CSP) allows the necessary resources. Please follow Userlike's [CSP documentation](https://docs.userlike.com/setup/widget-integration/content-security-policy) to configure your CSP correctly.

A nonce can be provided to the Messenger API as follows:

```typescript
api.mount({
  nonce: "your-nonce",
});
```

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
