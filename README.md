# React Use Current

A Tiny React hook for synchronous mutable reactive state.

---

### Usage

```tsx
// Counter.tsx
import useCurrent from "react-use-current";

export default function Counter() {
  const count = useCurrent(0);

  return (
    <button onClick={() => (count.value += 1)}>
      Count: {count.value}
    </button>
  );
}
```
```tsx
// User.tsx
import { useEffect, useMemo } from "react";
import useCurrent, { track } from "react-use-current";

export default function User() {
  const user = useCurrent({
    name: "John",
    age: 25
  });

  // Recomputes whenever user.value changes (deep reactive tracking)
  const isAdult = useMemo(() => {
    return user.value.age >= 18;
  }, [track(user.value)]);

  // Effect runs on any change to user.value (deep mutation-safe)
  useEffect(() => {
    console.log("User changed:", user.value);
  }, [track(user.value)]);

  return (
    <div>
      <p>{user.value.name} - {user.value.age}</p>
      <button onClick={() => (user.value.age += 1)}>
        Increase Age
      </button>
      <button onClick={() => (user.value.name = "Doe")}>
        Change Name
      </button>
    </div>
  );
}
```

---

### 🎮 Live Playground

<br/>
<div align="center">

**Play with `react-use-current`:**

👉 <a href="https://stackblitz.com/edit/react-use-current?file=src/App.tsx">Open Live Playground</a>

</div>
<br/>

---

Simple. Reactive. Synchronous.
