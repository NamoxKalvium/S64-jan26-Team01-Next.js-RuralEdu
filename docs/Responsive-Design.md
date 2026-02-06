Responsive & Theme‑Aware UI with TailwindCSS
📌 Overview

This assignment focuses on building a responsive, theme‑aware, and accessible user interface using TailwindCSS. The goal is to ensure that the application adapts smoothly across different screen sizes while supporting light and dark themes that enhance usability in various lighting conditions.

By configuring Tailwind’s theme tokens, breakpoints, and dark mode support, we create a scalable design system that remains consistent, maintainable, and user‑friendly.

🎯 Objectives

Configure custom breakpoints and theme tokens in TailwindCSS

Build layouts that adapt seamlessly across mobile, tablet, and desktop devices

Implement light/dark mode switching

Ensure accessibility through proper color contrast and readability

Document design decisions and challenges

⚙️ Tailwind Configuration Summary
Custom Breakpoints

The following responsive breakpoints were defined to support common device sizes:

Breakpoint	Min Width
sm	640px (Mobile)
md	768px (Tablet)
lg	1024px (Laptop)
xl	1280px (Desktop)

These breakpoints allow fine‑grained control over spacing, typography, and layout behavior across devices.

Custom Theme Tokens

A brand color palette was added to maintain visual consistency throughout the app:

colors: {
  brand: {
    light: '#93C5FD',
    DEFAULT: '#3B82F6',
    dark: '#1E40AF',
  },
}

Usage examples:

bg-brand for primary backgrounds

text-brand-dark for headings

hover:bg-brand-light for interactive elements

📱 Responsive Layout Implementation

Responsive utilities such as sm:, md:, and lg: were used to adjust:

Padding and margins

Font sizes

Layout spacing

Example:
<div className="p-4 md:p-8 lg:p-12">
  <h1 className="text-lg md:text-2xl lg:text-3xl font-semibold">
    Responsive Heading
  </h1>
</div>
Testing Approach

Chrome DevTools → Device Toolbar

Tested on:

Mobile (iPhone SE / iPhone 12)

Tablet (iPad)

Desktop (1440px+)

Result: Layouts scaled smoothly without overlapping, clipping, or text overflow.

🌗 Light & Dark Theme Support
Dark Mode Configuration

Dark mode was enabled using Tailwind’s class‑based strategy:

darkMode: 'class'
Theme Styling
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  <p>Hello, themed world!</p>
</div>
Theme Toggle Logic

A toggle button switches between light and dark themes

The dark class is applied to the root <html> element

Theme preference is stored in localStorage to persist across reloads

♿ Accessibility Considerations

Accessibility was a key focus during theme and layout design:

✅ Color contrast tested for both light and dark modes

✅ Text remains readable across all breakpoints

✅ Interactive elements have clear visual states

✅ Dark mode reduces eye strain in low‑light environments

Contrast ratios were validated to align with WCAG AA guidelines wherever possible.

🧪 Cross‑Device Testing Evidence

The UI was tested across multiple devices and screen sizes:

Mobile view: compact spacing, readable text, stacked layout

Tablet view: balanced spacing, improved readability

Desktop view: full layout with enhanced typography

📸 Screenshots / GIFs demonstrating responsiveness and theme switching are included alongside this README.