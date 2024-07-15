### v2 Migration Guide

- Types should be imported as `v2` instead of `v1` (for typescript users).

  Before:

  ```
  import { createMessenger, v1 } from "@userlike/messenger";
  ```

  After

  ```typescript
  import { createMessenger, v2 } from "@userlike/messenger";
  ```

- When creating the messenger, use `version: 2`.

  Before:

  ```diff
    const result = await createMessenger({
  -   version: 1,
  +   version: 2,
      widgetKey: "YOUR_WIDGET_SECRET",
    });
  ```

- The biggest change is with how mounting/unmounting works.

  Before:

  ```typescript
  mountButton.onclick = () => api.mount();
  unmountButton.onclick = () => api.unmount();
  ```

  After:

  ```typescript
  import { Unsubscribable } from '@userlike/messenger';

  let subscription: Unsubscribable;
  let messenger: v2.Messenger;

  mountButton.onclick = () => {
    subscription = api.mount().subscribe(result => {
      if (result.kind === "error") {
        console.error(result.error);
        return;
      }

      if (result.value === null) {
        console.log("messenger is not mounted", result.reason);
        return;
      }

      messenger = result.value;
    });
  };

  unmountButton.onclick = () => subscription.unsubscribe();
  ```

- API methods are only accessible after `mount`ing, as part of the subscription.

  Before:

  ```typescript
  async myFunction() {
    await api.mount();
    await api.setVisibility({
      main: true,
      button: false,
      notifications: false,
    });
  }
  ```

  After:

  ```typescript
  async myFunction() {
    subscription = api.mount().subscribe(async (result) => {
      if (result.kind === "error") {
        console.error(result.error);
        return;
      }

      if (result.value === null) {
        console.log("messenger is not mounted", result.reason);
        return;
      }

      const messenger = result.value;

      await messenger.setVisibility({
        main: true,
        button: false,
        notifications: false,
      });
    });
  }
  ```







