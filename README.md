<p align="center">
  <img width="144" height="144" src="https://avatars2.githubusercontent.com/u/1116280">
</p>

# Official Userlike Messenger API

## Install

```
npm install @userlike/messenger@internal
```

## Usage

```typescript
import { createMessenger } from "@userlike/messenger";

async function example() {
  const result = await createMessenger({
    version: 1,
    widgetKey: "YOUR_WIDGET_SECRET",
  });

  if (result.kind === "error") throw new Error(result.error);

  const { api } = result.value;

  await api.mount();
}
```

## API

```typescript
interface Api {
  /**
   * Render the messenger.
   *
   * Messenger must not be mounted.
   */
  mount(): Promise<...>;

  /**
   * Remove the messenger.
   *
   * Messenger must be mounted.
   */
  unmount(): Promise<...>;

  /**
   * Clears contact session completely.
   */
  logout(): Promise<...>;

  /**
   * Simulate as if the contact clicked the messenger button.
   *
   * This is a no-op if it's already maximized.
   */
  maximize(): Promise<...>;

  /**
   * Set custom data.
   */
  setCustomData(
    data: Record<string, unknown>
  ): Promise<...>;

  /**
   * Set contact info.
   */
  setContactInfo(data: {
    name?: string;
    email?: string;
  }): Promise<...>;
}
```
