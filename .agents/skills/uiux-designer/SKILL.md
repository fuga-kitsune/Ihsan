---
name: uiux-designer
description: "Use this skill when designing UI components, choosing color palettes, implementing responsive layouts, or reviewing code for UX issues. For landing pages, dashboards, e-commerce, SaaS, and mobile apps. Provides 50+ design styles, 97 color palettes, 57 font pairings, and stack-specific guidelines for React, Vue, Next.js, Flutter, SwiftUI, and more."
---

# UIUX Designer - Design Intelligence

Comprehensive design guide for web and mobile applications. Contains 50+ styles, 97 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types across 12 technology stacks. Searchable database with priority-based recommendations.

## Overview

Reference these guidelines when:
- Designing new UI components or pages
- Choosing color palettes and typography
- Reviewing code for UX issues
- Building landing pages or dashboards
- Implementing accessibility requirements

## Protocols

When user requests UI/UX work (design, build, create, implement, review, fix, improve), follow this workflow:

### Step 1: Analyze User Requirements
- Product type: SaaS, e-commerce, portfolio, dashboard, landing page, etc.
- Style keywords: minimal, playful, professional, elegant, dark mode, etc.
- Industry: healthcare, fintech, gaming, education, etc.
- Stack: React, Vue, Next.js, or default to html-tailwind

### Step 2: Generate Design System (REQUIRED)
`python3 .agents/skills/uiux-designer/scripts/search.py "<keywords>" --design-system -p "Project Name"`

### Step 3: Supplement with Detailed Searches
`python3 .agents/skills/uiux-designer/scripts/search.py "<keyword>" --domain <domain>`

### Step 4: Stack Guidelines
`python3 .agents/skills/uiux-designer/scripts/search.py "<keyword>" --stack html-tailwind`
