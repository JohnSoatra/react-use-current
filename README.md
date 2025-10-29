# React Use Current

A small React hook for managing **mutable and reactive state** with direct access through `.current`.

## Version

**1.0.0 – Initial Release:**

- Supports all value types  
- Reactive updates through `.tick`  
- Lightweight and dependency-free

## Features

- Reactive mutable reference via `.current`  
- Auto re-render on value change  
- Works with any type  
- TypeScript ready

## Installation

```bash
npm install react-use-current
```

or

```bash
yarn add react-use-current
```

## Usage

### 1. Basic Example

```tsx
import useCurrent from 'react-use-current';

export default function Counter() {
  const count = useCurrent(0);

  return (
    <button onClick={() => (count.current += 1)}>
      Count: {count.current}
    </button>
  );
}
```

### 2. Complex Example

```tsx
import useCurrent from 'react-use-current';

export default function ListExample() {
  const data = useCurrent({ arr: [] as string[], map: new Map() });

  function addItem() {
    data.current.arr.push('Item ' + (data.current.arr.length + 1));
  }

  return (
    <div>
      {data.current.arr.map((item) => (
        <p key={item}>{item}</p>
      ))}
      <button onClick={addItem}>Add Item</button>
    </div>
  );
}
```

## API

### `useCurrent(initial?)`

Creates a reactive reference with optional initial value.

```tsx
const value = useCurrent('Hello');
```

#### Returns

| Property   | Type      | Description |
|-------------|-----------|-------------|
| **current** | any       | Holds the current value (read/write). |
| **tick**    | number    | Increases automatically when the value changes. |

## Notes

- Works seamlessly with any type.  
- Ideal for reactive logic without using traditional `useState`.  
- Minimal and framework-consistent behavior.

## License

MIT License © 2025 John Soatra

