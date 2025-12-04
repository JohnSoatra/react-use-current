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
    <button onClick={() => (count.value += 1)}>Count: {count.value}</button>
  );
}
```

```tsx
// User.tsx
import { useEffect, useMemo } from "react";
import useCurrent, { track } from "react-use-current";

export default function User() {
  const { value: user } = useCurrent({
    name: "John",
    age: 25,
  }); // descruture if never resigner new user refference

  // Recomputes whenever user changes (deep reactive tracking)
  const isAdult = useMemo(() => {
    return user.age >= 18;
  }, [track(user.age)]); // optional track for pimitive

  // Effect runs on any change to user (deep mutation-safe)
  useEffect(() => {
    console.log("User changed:", user);
  }, [track(user)]); // must track for reactive object

  return (
    <div>
      <p>
        {user.name} - {user.age}
      </p>
      <button onClick={() => (user.age += 1)}>Increase Age</button>
      <button onClick={() => (user.name = "Doe")}>Change Name</button>
    </div>
  );
}
```

### Auto-Tracking Helpers

#### **useCompute**
Like useMemo, but automatically tracks dependencies.

```tsx
import { useCompute } from 'react-use-current';

const isAdult = useCompute(() => {
  // Auto-tracks `user.age`
  return user.age >= 18;
}, [user.age]);
```

#### **useApply**
Like useEffect, but automatically tracks dependencies.

```tsx
import { useApply } from 'react-use-current';

useApply(() => {
  // Auto-tracks `user`
  console.log("User changed:", user);
}, [user]);
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
