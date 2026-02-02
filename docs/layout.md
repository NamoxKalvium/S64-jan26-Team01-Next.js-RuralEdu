Reusable Layout & Component Architecture in Next.js
📌 Overview

This project demonstrates a scalable, reusable, and accessible UI architecture built with Next.js (App Router). The goal is to create a consistent layout across all pages while promoting component reusability, maintainability, and visual consistency.

The application uses shared layout components (Header, Sidebar, LayoutWrapper) and reusable UI elements (Button) to ensure that all routes follow a unified design system.

🎯 Objective

By completing this task, the project achieves the following:

Implements reusable layout components (Header, Sidebar, LayoutWrapper)

Applies a global layout using Next.js App Router

Defines clear props contracts for shared UI components

Uses Storybook to preview components in isolation

Documents accessibility, theming, and scalability considerations

Reflects on architectural trade-offs between flexibility and simplicity

📁 Folder Structure
components/
 ├── layout/
 │    ├── Header.tsx
 │    ├── Sidebar.tsx
 │    └── LayoutWrapper.tsx
 ├── ui/
 │    ├── Button.tsx
 │    └── Card.tsx
 └── index.ts

Barrel Export (components/index.ts)
export { default as Header } from "./layout/Header";
export { default as Sidebar } from "./layout/Sidebar";
export { default as LayoutWrapper } from "./layout/LayoutWrapper";
export { default as Button } from "./ui/Button";


This simplifies imports and improves maintainability.

🧩 Component Hierarchy
RootLayout (app/layout.tsx)
 └── LayoutWrapper
      ├── Header
      ├── Sidebar
      └── Page Content (children)


This structure ensures that every page automatically inherits the same layout and navigation structure.

🧱 Layout Components
🔹 Header Component
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center bg-blue-600 text-white px-6 py-3">
      <h1 className="text-lg font-semibold">MyApp</h1>
      <nav className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/settings">Settings</Link>
      </nav>
    </header>
  );
}


Purpose

Displays application title

Provides global navigation

Uses semantic HTML (header, nav) for accessibility

🔹 Sidebar Component
import Link from "next/link";

export default function Sidebar() {
  const links = [
    { href: "/dashboard", label: "Overview" },
    { href: "/users", label: "Users" },
    { href: "/reports", label: "Reports" },
  ];

  return (
    <aside className="w-64 bg-gray-100 h-screen border-r p-4">
      <h2 className="text-lg font-bold mb-4">Navigation</h2>
      <ul className="space-y-2">
        {links.map(link => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-blue-600">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}


Purpose

Provides secondary navigation

Dynamically renders links

Uses aside for semantic meaning

🔹 LayoutWrapper Component
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-white p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


Purpose

Wraps all pages with shared layout

Centralizes layout logic

Ensures consistent spacing and structure

🌍 Global Layout Application
app/layout.tsx
import { LayoutWrapper } from "@/components";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}


All routes automatically share:

Header

Sidebar

Main content area

🎛 Reusable UI Component
🔘 Button Component
interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export default function Button({
  label,
  onClick,
  variant = "primary",
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      : "bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300";

  return (
    <button onClick={onClick} className={styles}>
      {label}
    </button>
  );
}

📜 Props Contract Explanation
Prop	Type	Description
label	string	Text displayed on the button
onClick	() => void	Optional click handler
variant	"primary" | "secondary"	Controls styling
Why Props Contracts Matter

Improves component predictability

Prevents misuse

Enables easier collaboration

Enhances TypeScript safety

📚 Storybook Integration
Installation
npx storybook init

Button Story Example
import Button from "./Button";

export default {
  title: "UI/Button",
  component: Button,
};

export const Primary = () => <Button label="Click Me" />;
export const Secondary = () => (
  <Button label="Cancel" variant="secondary" />
);

Purpose

Preview components in isolation

Test visual consistency

Document UI behavior

Catch UI regressions early

📸 (Add screenshots of Storybook UI here if submitting)

♿ Accessibility Considerations

Semantic HTML elements (header, nav, aside, main)

Keyboard-accessible navigation

Clickable elements use native <button>

Logical heading hierarchy

Clear contrast using Tailwind defaults

Screen-reader friendly structure

🎨 Visual Consistency & Theming

Tailwind CSS utility classes

Centralized layout styling

Consistent spacing, colors, and typography

Shared UI components ensure uniform look and feel

Variants allow flexibility without duplication

📈 Scalability & Maintainability
How This Architecture Scales

New pages automatically inherit layout

UI components are reusable across features

Easy to add role-based layouts later

Centralized updates reduce bugs

Trade-offs
Advantage	Trade-off
Consistent UI	Less per-page customization
Centralized layout	More planning upfront
Reusable components	Requires strict prop contracts

This balance favors long-term maintainability over short-term convenience.

✅ Conclusion

This project establishes a production-ready UI foundation using Next.js best practices. The architecture ensures:

Consistent layouts

Accessible components

Reusable UI patterns

Clean separation of concerns

Easy future expansion

It is well-suited for medium to large-scale applications where maintainability and consistency matter.