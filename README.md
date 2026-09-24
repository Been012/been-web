# Ben McPherson — personal projects

Source for [benmcpherson.uk](https://benmcpherson.uk), hosted on GitHub Pages.

## Local preview

Requires Node.js 18 or newer. Run `npm start`, then open http://127.0.0.1:4173.
No dependency installation is needed.

## Editing

- Page content: `index.html`
- Styles: `css/style.css`
- Projects: `assets/projects.json`. Run `npm run build` after editing and commit
  both the JSON file and the generated `index.html`.
- Private projects: set `"private": true` and omit `url`.

Run `npm test` to check that the project markup is up to date.
