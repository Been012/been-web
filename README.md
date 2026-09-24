# Ben McPherson — portfolio

Static HTML, CSS and JavaScript, hosted on GitHub Pages at https://benmcpherson.uk.
No server, database, credentials or runtime dependencies are required in production.

## Preview

With Node.js 18 or newer, run `npm start` and open http://127.0.0.1:4173.
There is no dependency installation step.

## Edit projects

Edit `assets/projects.json`, then run `npm run build` to update the project markup
committed in `index.html`. Commit both files. GitHub Pages serves this HTML directly;
it does not need to run Node. Projects remain readable when JavaScript is disabled.

- `private: true` adds a visible Private badge and omits a repository link. It is a
  display label, not access control; do not add private source code or credentials.
- Public links use `url` and `linkLabel`. Omit `url` for projects without a public destination.
- Categories are `ai`, `games`, `systems`, and `web`; AI and games share a filter.
- The decorative project illustrations are CSS artwork, not product screenshots.

Run `npm test` to check project data and ensure the committed markup is current.
Browser checks should cover all filters, narrow screens, keyboard menu controls and
the reduced-motion preference. The design honors reduced motion and keeps content
and navigation available without JavaScript.

## Publish

Keep the existing GitHub Pages publishing source and `CNAME` configuration. Publish
the updated static files through the repository's normal main-branch deployment.
All local asset paths are relative, so a repository subpath is supported as well.
