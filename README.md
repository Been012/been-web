# Ben McPherson — personal projects

A small static portfolio hosted on GitHub Pages at https://benmcpherson.uk.
No server, database, credentials or runtime dependencies are required in production.

## Preview

With Node.js 18 or newer, run `npm start` and open http://127.0.0.1:4173.
There is no dependency installation step.

## Edit projects

Edit `assets/projects.json`, then run `npm run build` to update the project markup
committed in `index.html`. Commit both files. GitHub Pages serves this HTML directly;
it does not need to run Node. All content and navigation work without JavaScript.

- `private: true` adds a visible Private badge and omits a repository link. It is a
  display label, not access control; do not add private source code or credentials.
- Use `url` for public repositories; omit it for projects without a public link.
- `tags` lists the technologies or topics shown on each card.

Run `npm test` to check project data and ensure the committed markup is current.
Browser checks should cover narrow screens, navigation and keyboard focus.

## Publish

Keep the existing GitHub Pages publishing source and `CNAME` configuration. Publish
through the repository's normal main-branch deployment. Asset paths are relative,
so the page also works under a repository subpath.
