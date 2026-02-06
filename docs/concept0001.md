Objective
In this lesson, you’ll go beyond the basics of data fetching and learn how Next.js enables three powerful rendering strategies — Static Site Generation (SSG), Server-Side Rendering (SSR), and Hybrid Rendering — using the new App Router. You’ll understand when to use each strategy, how they affect performance and scalability, and how to implement them in your project for real-world use cases.

Here’s What You Need to Do
Understand the Rendering Modes

Static Rendering (SSG) — Content is pre-rendered at build time and served as HTML for lightning-fast performance. Example use case: marketing pages, blogs, or product listings that don’t change often.

Dynamic Rendering (SSR) — Pages are generated on each request for real-time data. Example use case: user dashboards, analytics pages, or live feeds.

Hybrid Rendering (ISR) — Combines both worlds using Incremental Static Regeneration (ISR), allowing static pages to be updated periodically. Example use case: news sites, event pages, or e-commerce listings.

Implement in Your Next.js Project

Use App Router data fetching with built-in Next.js functions:

// Example: Static Rendering (cached at build time)
export const revalidate = false;

// Example: Dynamic Rendering (no caching)
export const dynamic = 'force-dynamic';

// Example: Hybrid Rendering (revalidate every 60 seconds)
export const revalidate = 60;
For SSR, create server components that fetch live data:

export default async function Dashboard() {
  const data = await fetch('https://api.example.com/metrics', { cache: 'no-store' });
  return <DashboardView data={data} />;
}
Demonstrate all three patterns in your app by creating:

A static page (e.g., About or Blog)
A dynamic page (e.g., Dashboard or Profile)
A hybrid page using ISR
Document in README

Objective
In this lesson, you’ll go beyond the basics of data fetching and learn how Next.js enables three powerful rendering strategies — Static Site Generation (SSG), Server-Side Rendering (SSR), and Hybrid Rendering — using the new App Router. You’ll understand when to use each strategy, how they affect performance and scalability, and how to implement them in your project for real-world use cases.

Here’s What You Need to Do
Understand the Rendering Modes

Static Rendering (SSG) — Content is pre-rendered at build time and served as HTML for lightning-fast performance. Example use case: marketing pages, blogs, or product listings that don’t change often.

Dynamic Rendering (SSR) — Pages are generated on each request for real-time data. Example use case: user dashboards, analytics pages, or live feeds.

Hybrid Rendering (ISR) — Combines both worlds using Incremental Static Regeneration (ISR), allowing static pages to be updated periodically. Example use case: news sites, event pages, or e-commerce listings.

Implement in Your Next.js Project

Use App Router data fetching with built-in Next.js functions:

// Example: Static Rendering (cached at build time)
export const revalidate = false;

// Example: Dynamic Rendering (no caching)
export const dynamic = 'force-dynamic';

// Example: Hybrid Rendering (revalidate every 60 seconds)
export const revalidate = 60;
For SSR, create server components that fetch live data:

export default async function Dashboard() {
  const data = await fetch('https://api.example.com/metrics', { cache: 'no-store' });
  return <DashboardView data={data} />;
}
Demonstrate all three patterns in your app by creating:

A static page (e.g., About or Blog)
A dynamic page (e.g., Dashboard or Profile)
A hybrid page using ISR
Document in README
