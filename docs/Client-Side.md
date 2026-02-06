

## 📌 Overview

This assignment demonstrates how **SWR (Stale-While-Revalidate)** is used in a Next.js application to perform efficient client-side data fetching. SWR improves performance and user experience by serving cached data instantly, revalidating it in the background, and supporting optimistic UI updates for seamless interactions.

The implementation covers **data fetching**, **caching behavior**, **mutations with optimistic updates**, **error handling**, and **performance reflections**.

---

## 🎯 Objectives

* Understand the stale-while-revalidate data fetching strategy
* Fetch client-side data using SWR hooks
* Implement mutations with optimistic UI updates
* Observe and verify SWR caching behavior
* Handle errors and revalidation strategies
* Document performance improvements and trade-offs

---

## 🤔 Why Use SWR?

SWR is a lightweight React hook library developed by **Vercel**, designed to work seamlessly with Next.js.

### Core Concepts

| Concept                | Description                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------- |
| Stale-While-Revalidate | Returns cached (stale) data immediately, then fetches fresh data in the background |
| Automatic Caching      | Prevents redundant network requests by reusing cached responses                    |
| Revalidation           | Refetches data on focus, reconnect, or interval                                    |
| Optimistic UI          | Updates UI instantly before server confirmation                                    |

📌 **Key Benefit:** The UI remains fast and responsive even when data is being refreshed.

---

## ⚙️ Installation & Setup

### Installing SWR

```bash
npm install swr
```

### Fetcher Utility

A reusable fetcher function ensures consistent API handling:

```ts
// lib/fetcher.ts
export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};
```

---

## 📡 Fetching Data with SWR

The following component fetches user data from `/api/users` using SWR:

```tsx
"use client";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function UsersPage() {
  const { data, error, isLoading } = useSWR("/api/users", fetcher);

  if (error) return <p className="text-red-600">Failed to load users.</p>;
  if (isLoading) return <p>Loading...</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <ul className="space-y-2">
        {data.map((user: any) => (
          <li key={user.id} className="p-2 border-b">
            {user.name} — {user.email}
          </li>
        ))}
      </ul>
    </main>
  );
}
```

### How Caching Works

* `/api/users` acts as the **SWR key**
* Cached data is returned instantly on subsequent renders
* Data revalidates automatically when the tab regains focus

---

## 🔑 Understanding SWR Keys

SWR keys uniquely identify cached data:

```ts
useSWR("/api/users", fetcher);
```

### Dynamic Keys

```ts
const { data } = useSWR(userId ? `/api/users/${userId}` : null, fetcher);
```

📌 Passing `null` pauses fetching until dependencies are ready.

---

## 🔄 Mutations & Optimistic UI Updates

SWR allows updating the UI immediately before the server responds.

### Add User with Optimistic Update

```tsx
"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";

export default function AddUser() {
  const { data } = useSWR("/api/users", fetcher);
  const [name, setName] = useState("");

  const addUser = async () => {
    if (!name) return;

    mutate(
      "/api/users",
      [...data, { id: Date.now(), name, email: "temp@user.com" }],
      false
    );

    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: "temp@user.com" }),
    });

    mutate("/api/users");
    setName("");
  };

  return (
    <div className="mt-4">
      <input
        className="border px-2 py-1 mr-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter user name"
      />
      <button
        onClick={addUser}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Add User
      </button>
    </div>
  );
}
```

### Optimistic UI Flow

1. UI updates instantly
2. API request is sent
3. Cache revalidates after response

---

## 🧠 Visualizing Cache Behavior

To observe SWR caching:

```ts
import { useSWRConfig } from "swr";
const { cache } = useSWRConfig();
console.log("Cache keys:", [...cache.keys()]);
```

### Observations

* Cache Hit → Data served instantly
* Cache Miss → Network request triggered

Screenshots and console logs are included as evidence.

---

## ⚠️ Error Handling & Revalidation Strategies

```ts
const { data, error } = useSWR("/api/users", fetcher, {
  revalidateOnFocus: true,
  refreshInterval: 10000,
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    if (retryCount >= 3) return;
    setTimeout(() => revalidate({ retryCount }), 2000);
  },
});
```

### Benefits

* Graceful recovery from temporary failures
* Controlled retry behavior
* Better user feedback

---

## ⚖️ SWR vs Traditional Fetch

| Feature           | SWR     | Fetch API |
| ----------------- | ------- | --------- |
| Built-in Cache    | ✅       | ❌         |
| Auto Revalidation | ✅       | ❌         |
| Optimistic UI     | ✅       | ❌         |
| Boilerplate       | Minimal | High      |

---

## 🧠 Reflections & Learnings

### Performance Improvements

* Reduced API calls due to caching
* Faster perceived load times
* Smooth UI updates with optimistic mutations

### Trade-offs

* Data can be temporarily stale
* Requires thoughtful cache invalidation

### Error Handling Insights

* Error boundaries improve UX
* Retry strategies prevent infinite loops

---

## 📦 Deliverables Checklist

* ✅ SWR integrated for client-side data fetching
* ✅ Components for fetching and mutating data
* ✅ Optimistic UI updates implemented
* ✅ Cache logs/screenshots provided
* ✅ README documenting keys, caching, and reflections

