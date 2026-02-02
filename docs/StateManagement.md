The goal of this assignment is to implement global state management in a Next.js application using React Context API and custom hooks.
We manage two independent global concerns:

Authentication state (logged-in user)

UI state (theme and sidebar visibility)

This approach ensures clean separation of concerns, scalability, and reusable logic across the application.

🧠 Key Concepts Used
React Context API

Custom Hooks

Next.js App Router (app/ directory)

Client Components ("use client")

State lifting and encapsulation

Global providers pattern

📁 Folder Structure
context/
 ├── AuthContext.tsx
 ├── UIContext.tsx

hooks/
 ├── useAuth.ts
 ├── useUI.ts

app/
 ├── layout.tsx
 ├── page.tsx
Why This Structure?
context/ → Holds global state logic

hooks/ → Exposes clean APIs to consume context

Prevents prop drilling

Improves readability and testability

🔐 AuthContext – Authentication State
Purpose
Manages authentication-related state across the application.

State Managed
user: string | null

Actions
login(username)

logout()

Implementation
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  const login = (username: string) => {
    setUser(username);
    console.log("User logged in:", username);
  };

  const logout = () => {
    setUser(null);
    console.log("User logged out");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
}
🎨 UIContext – UI Preferences State
Purpose
Handles UI-related global preferences.

State Managed
theme: "light" | "dark"

sidebarOpen: boolean

Actions
toggleTheme()

toggleSidebar()

Implementation
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleTheme = () =>
    setTheme(prev => (prev === "light" ? "dark" : "light"));

  const toggleSidebar = () =>
    setSidebarOpen(prev => !prev);

  return (
    <UIContext.Provider
      value={{ theme, toggleTheme, sidebarOpen, toggleSidebar }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUIContext() {
  const context = useContext(UIContext);
  if (!context)
    throw new Error("useUIContext must be used within a UIProvider");
  return context;
}
🌍 Global Provider Setup
Both contexts are made available app-wide by wrapping them in app/layout.tsx.

import { AuthProvider } from "@/context/AuthContext";
import { UIProvider } from "@/context/UIContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <UIProvider>{children}</UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
Result
All components can access authentication and UI state without prop drilling.

🪝 Custom Hooks
useAuth Hook
Encapsulates authentication logic and derived state.

import { useAuthContext } from "@/context/AuthContext";

export function useAuth() {
  const { user, login, logout } = useAuthContext();

  return {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
useUI Hook
Encapsulates UI-related state and actions.

import { useUIContext } from "@/context/UIContext";

export function useUI() {
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUIContext();

  return {
    theme,
    toggleTheme,
    sidebarOpen,
    toggleSidebar,
  };
}
🧪 Demonstrating Context Usage
Home Page Example (app/page.tsx)
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";

export default function Home() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUI();

  return (
    <main
      className={`p-6 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-white text-black"
      }`}
    >
      <h1 className="text-2xl font-bold mb-4">
        State Management with Context & Hooks
      </h1>

      <section className="mb-6">
        <h2 className="font-semibold mb-2">Authentication</h2>

        {isAuthenticated ? (
          <>
            <p>Logged in as: {user}</p>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => login("KalviumUser")}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Login
          </button>
        )}
      </section>

      <section>
        <h2 className="font-semibold mb-2">UI Controls</h2>
        <p>Current Theme: {theme}</p>

        <button
          onClick={toggleTheme}
          className="bg-blue-500 text-white px-3 py-1 rounded mr-3"
        >
          Toggle Theme
        </button>

        <button
          onClick={toggleSidebar}
          className="bg-yellow-500 text-black px-3 py-1 rounded"
        >
          {sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        </button>
      </section>
    </main>
  );
}
🧾 Expected Console Logs
User logged in: KalviumUser
Theme toggled to dark
Sidebar opened
User logged out
🧩 How Context & Hooks Work Together
Context stores global state and actions

Providers make state available across the app

Custom hooks provide a clean, reusable interface

Components consume state without knowing implementation details

This separation improves maintainability and scalability.

🚀 Scalability Benefits
Easy to add new contexts (e.g., NotificationsContext)

Logic is centralized and reusable

Reduces prop drilling

Improves team collaboration

⚡ Performance Considerations
Potential Challenges
Unnecessary re-renders when context values change

Mitigations
Split contexts by concern (Auth vs UI)

Can use:

React.memo

useCallback

useReducer for complex state

Selector-based contexts (advanced)