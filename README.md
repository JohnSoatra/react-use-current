# React Use Current

A minimal React hook for mutable and reactive state.

---

### Usage

```tsx
// Counter.tsx
import useCurrent from "react-use-current";

function Counter() {
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
import useCurrent from "react-use-current";

function User() {
  const user = useCurrent({
    name: "John",
    age: 25
  });

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
```tsx
import Counter from "./Counter.tsx";
import User from "./User.tsx";

export default function App() {
  return (
    <>
      <Counter />
      <User />
    </>
  );
}
```

---

Simple. Mutable. Reactive.
