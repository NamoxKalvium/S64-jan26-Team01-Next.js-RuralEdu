---

## 🌿 GitHub Workflow & Collaboration Strategy

To ensure smooth collaboration and maintain code quality, our team follows a structured GitHub branching and pull‑request workflow similar to professional engineering teams.

---

### 🔀 Branching Strategy

We follow a consistent branch naming convention:

- `main` → Stable production‑ready code
- `feature/<feature-name>` → New features
- `fix/<bug-name>` → Bug fixes
- `chore/<task-name>` → Setup or maintenance tasks
- `docs/<update-name>` → Documentation changes

**Examples:**
- `feature/offline-support`
- `fix/navbar-alignment`
- `docs/update-readme`

This helps us quickly understand the purpose of each branch and avoid confusion during collaboration.

---

### 📄 Pull Request Template

We use a standardized Pull Request (PR) template to maintain clarity and consistency.  
Each PR includes:
- A summary of changes
- List of modifications
- Testing steps
- Screenshots or evidence
- A readiness checklist

This ensures reviewers have all necessary context before approving changes.


### 🔍 Code Review Checklist

Before approving a PR, reviewers verify that:
- The project builds and runs successfully
- No console errors are present
- Code follows naming conventions and folder structure
- No sensitive information (secrets, keys) is committed
- Changes are limited to the intended scope

---

### 🔒 Branch Protection Rules

To protect our main branch, we have enabled the following rules:
- Direct pushes to `main` are disabled
- Pull request approval is required before merging
- Required status checks must pass

This prevents accidental breaking changes and ensures every update is reviewed.

📸 **Screenshot: Branch Protection Rules**
![Branch Protection](./branch-protection.png)

---

### 🧠 Reflection

This workflow helps our team move faster while maintaining stability. By using feature branches, structured PRs, and protected main branches, we reduce merge conflicts, catch issues early, and ensure only reviewed code reaches production. If this were a live product with weekly releases, this setup would allow parallel development without risking application stability.

---
## 📌 Summary
Briefly describe what this PR does and why it is needed.

## 🔧 Changes Made
- [ ] Feature added
- [ ] Bug fixed
- [ ] Documentation updated
- [ ] Refactor / cleanup

Describe the key changes:
- 
- 

## 🧪 Testing & Verification
Explain how you tested these changes:
- [ ] Tested locally
- [ ] No console errors
- [ ] All builds pass

## 📸 Screenshots / Evidence (if applicable)
Attach screenshots or logs that support your changes.

## ✅ PR Checklist
Please confirm before requesting review:
- [ ] Code follows project naming conventions
- [ ] No sensitive data or secrets committed
- [ ] Linting and build pass successfully
- [ ] Changes are scoped only to this feature/fix
