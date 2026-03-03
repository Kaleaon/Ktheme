# Contributing to Ktheme

Thank you for your interest in contributing to Ktheme! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear title and description
- Steps to reproduce the issue
- Expected vs actual behavior
- Your environment details (OS, Node version, etc.)

### Suggesting Features

We welcome feature suggestions! Please create an issue with:
- A clear description of the feature
- Use cases and benefits
- Any implementation ideas you have

### Contributing Code

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Contributing Themes

We encourage everyone to share their custom themes! To contribute a theme:

1. Create your theme using the Theme Creator app
2. Export your theme to JSON
3. Fork the repository
4. Add your theme JSON file to `themes/community/`
5. Add a screenshot to `themes/community/screenshots/`
6. Update `themes/community/README.md` with your theme details
7. Submit a Pull Request

#### Theme Submission Guidelines

Your theme should:
- Have a unique, descriptive name
- Include proper metadata (name, description, author, tags)
- Be properly validated (all required colors defined)
- Include a screenshot showing the theme in action
- Be appropriate and respectful (no offensive content)


## Preset Publishing Workflow

To keep built-in presets in sync between the engine and the Theme Creator, always update presets in this order:

1. Update the engine preset definitions in `src/themes/presets.ts`.
2. Update the shared preset artifact in `src/themes/shared-preset-ids.ts` if IDs were added, removed, or reordered.
3. Do **not** manually edit `theme-creator/src/utils/preset-themes.ts` with copied theme objects; it imports the engine presets and shared IDs directly.
4. Run the parity test (`npm test`) and confirm `src/themes/preset-parity.test.ts` passes before opening a PR.

This workflow prevents creator/engine preset drift and ensures a single source of truth for preset IDs.

## Code Style

- Use TypeScript for all code
- Follow the existing code style
- Add comments for complex logic
- Write descriptive commit messages

## Testing

Before submitting a PR:
- Test your changes locally
- Ensure all existing tests pass
- Add tests for new functionality

## Questions?

Feel free to open an issue for any questions or concerns.

Thank you for contributing to Ktheme!
