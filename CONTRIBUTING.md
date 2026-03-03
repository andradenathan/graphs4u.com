# Contributing to graphs4u

Thank you for your interest in contributing! This guide covers how to open issues and submit pull requests.

---

## Before You Start

- Check [open issues](../../issues) to avoid duplicate work.
- For significant changes, open an issue first to discuss the approach.
- Keep PRs focused — one feature or fix per pull request.

---

## Development Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/<your-username>/graphs4u.com.git
cd graphs4u.com

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

---

## Branching Convention

Branch names must follow the pattern `<type>/<short-description>`:

| Type | When to use |
|------|-------------|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `refactor/` | Code refactoring without behavior change |
| `docs/` | Documentation only |
| `chore/` | Build, config, dependencies |

Examples:
```
feat/bellman-ford-algorithm
fix/edge-weight-display
docs/keyboard-shortcuts
```

---

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short imperative description>
```

Examples:
```
feat: add Bellman-Ford shortest path algorithm
fix: correct edge weight not updating on input change
refactor: rename internal state variable for clarity
docs: add keyboard shortcut for zoom reset
```

Rules:
- Use the **imperative mood** ("add", not "added" or "adds")
- Keep the subject line under 72 characters
- No period at the end

---

## Submitting a Pull Request

1. **Create your branch** from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```

2. **Make your changes** following the project code style:
   - Named exports only, no default exports
   - `twMerge` for className merging
   - `tailwind-variants` for component variants
   - Semantic, descriptive variable names (no abbreviations)

3. **Build and check** before pushing:
   ```bash
   npm run build
   npm run lint
   ```

4. **Push your branch**:
   ```bash
   git push origin feat/my-feature
   ```

5. **Open a Pull Request** against `main` with:
   - A clear title following the commit convention
   - A description of **what** changed and **why**
   - Screenshots or screen recordings for UI changes

---

## PR Review Checklist

Before requesting review, confirm:

- [ ] Code follows the project conventions
- [ ] No `any` types, no `React.FC`, no default exports
- [ ] All new UI components use `data-slot` and `twMerge`
- [ ] No unnecessary files created (no barrel `index.ts`)
- [ ] Build passes with no TypeScript errors
- [ ] Screenshots attached for visual changes

---

## Reporting Issues

When opening a bug report, include:

- Steps to reproduce
- Expected vs actual behavior
- Browser and OS
- Screenshot or recording if applicable

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE.md).
