# Contributing to Stanza ⚡

First off, thank you for considering contributing to **Stanza**! We welcome contributions from developers of all skill levels. 

Please take a moment to review this document to ensure a smooth contribution workflow.

---

## 📜 Code of Conduct

We are committed to maintaining a welcoming, inclusive, and respectful community. Please ensure all interactions remain civil, constructive, and empathetic.

---

## 🛠️ How Can You Contribute?

### 1. Reporting Bugs
If you find a bug or unexpected behavior:
- Check existing [GitHub Issues](https://github.com/your-username/stanza/issues) to ensure it hasn't already been reported.
- Open a new issue with a clear title and description.
- Include steps to reproduce, expected vs. actual behavior, browser/environment details, and relevant console logs.

### 2. Suggesting Features
Have an idea to make Stanza better?
- Open an issue categorized as a **Feature Request**.
- Clearly explain the problem your feature solves and how it enhances the developer experience.

### 3. Submitting Pull Requests (PRs)
1. **Fork the repository** and clone your fork locally.
2. **Create a new branch** for your fix or feature:
   ```bash
   git checkout -b feature/amazing-new-feature
   ```
3. Make your changes following our coding standards:

    - Write clean, type-safe TypeScript code. Avoid using any types.
    - Do not commit hardcoded secrets, API keys, or .env.local files.
    -  Keep generator functions data-agnostic.

4. Test your changes thoroughly across GET, POST, PUT, and DELETE handlers.

5. Commit your changes using clear commit messages:

```Bash
git commit -m "feat: add support for nested array schema generation"
```
6. Push to your fork and submit a Pull Request to the main branch.

### 💻 Local Development Guidelines
- Environment File: Ensure your local .env.local is set up with valid MONGODB_URI and GROQ_API_KEY strings.

- Code Formatting: Maintain consistent indentation and formatting using standard Next.js / ESLint rules:

```Bash
npm run lint
```

- Type Checking: Ensure your code passes TypeScript validation before opening a PR:

```Bash
npx tsc --noEmit
```

### 📄 License Context
By contributing to Stanza, you agree that your contributions will be licensed under the project's GNU Affero General Public License v3.0 (AGPL-3.0).