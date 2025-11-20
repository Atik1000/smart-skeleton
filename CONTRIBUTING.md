# Contributing to smart-skeleton

Thank you for your interest in contributing to smart-skeleton! 🎉

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Code snippet if possible

### Suggesting Features

Feature requests are welcome! Please:
- Check if the feature has already been requested
- Provide a clear use case
- Explain how it would benefit users

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/Atik1000/smart-skeleton.git
   cd smart-skeleton
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

5. **Test your changes**
   ```bash
   npm run build
   npm run dev
   ```
   - Open the demo page and test manually
   - Ensure all existing functionality still works

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
   
   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

7. **Push and create a PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a pull request on GitHub.

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow existing naming conventions
- Keep functions small and focused
- Add JSDoc comments for public APIs

### File Structure

```
src/
  index.ts          - Main entry point
  skeleton.ts       - Core Skeleton class
  utils/
    dom.ts          - DOM manipulation utilities
    restore.ts      - Cache and restore logic
styles/
  skeleton.css      - All CSS styles
```

### Performance

- Minimize DOM reflows
- Use DocumentFragment for batch operations
- Cache computed styles
- Avoid unnecessary traversals

### Browser Support

Ensure compatibility with:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Questions?

Feel free to open an issue for any questions or discussions!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
