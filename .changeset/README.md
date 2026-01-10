# Changesets

This directory contains changeset files that describe changes to packages.

## Adding a Changeset

When you make changes to packages that should be versioned:

```bash
bun run changeset:add
```

This will prompt you to:

1. Select which packages have changed
2. Choose the semver bump type (major/minor/patch)
3. Write a summary of the changes

## Versioning Packages

When ready to release, run:

```bash
bun run changeset:version
```

This will:

- Consume all pending changesets
- Update package.json versions
- Generate/update CHANGELOG.md files
- Delete the processed changeset files

## Changeset Format

Each changeset is a markdown file with YAML frontmatter:

```markdown
---
"@packages/core": minor
"@packages/ui": patch
---

Add feature X to core and update UI to support it
```

## Guidelines

- Add a changeset for every PR that changes package functionality
- Use `patch` for bug fixes and minor changes
- Use `minor` for new features (backwards compatible)
- Use `major` for breaking changes
- Write summaries from the user's perspective
