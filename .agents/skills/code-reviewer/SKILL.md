---
name: code-reviewer
description: Automated code review assistant for analyzing Pull Requests and enforcing coding standards. Use when you need to review complex PRs, check for anti-patterns, or generate quality reports.
---

# Code Reviewer

Automated code review assistant that integrates static analysis, best practice auditing, and report generation.

## Agent Protocols

1.  **Context Analysis**: Always start by analyzing the project context and `references/coding_standards.md` to understand the rules.
2.  **Progressive Review**:
    - Step 1: Run `pr_analyzer.py` for structural and high-level checks.
    - Step 2: Run `code_quality_checker.py` for deep static analysis.
    - Step 3: Use `review_report_generator.py` to compile findings.
3.  **Constructive Feedback**: When providing feedback, reference specific items from `references/code_review_checklist.md`.

## Tool Definitions

### 1. PR Analyzer (Script)

Analyzes a Pull Request or a local branch for common issues and structural constraints.

-   **Execution**: `python .agents/skills/code-reviewer/scripts/pr_analyzer.py [options] <path>`
-   **When to use**: At the beginning of a review to catch obvious errors.

### 2. Code Quality Checker (Script)

Performs deep static analysis to identify performance bottlenecks and anti-patterns.

-   **Execution**: `python .agents/skills/code-reviewer/scripts/code_quality_checker.py [options] <path>`
-   **When to use**: Before merging, to ensure codebase health.

### 3. Review Report Generator (Script)

Generates a formatted report for stakeholders.

-   **Execution**: `python .agents/skills/code-reviewer/scripts/review_report_generator.py [options]`
-   **When to use**: To summarize findings for non-technical stakeholders or final approval.
