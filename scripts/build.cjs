const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const projects = JSON.parse(fs.readFileSync(path.join(root, 'assets/projects.json'), 'utf8').replace(/^\uFEFF/, ''));
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function renderProjects(items) {
  return items.map((project, index) => {
    if (!project.title || !project.description || !Array.isArray(project.tags)) throw new Error('Invalid project data');
    if (project.private && project.url) throw new Error('Private projects must not have public repository links');
    if (project.url && new URL(project.url).protocol !== 'https:') throw new Error('Project links must use HTTPS');
    const tags = project.tags.filter(tag => tag.toLowerCase() !== 'private').map(tag => `<span class="tag">${escape(tag)}</span>`).join('');
    const privateTag = project.private ? '<span class="private-tag">Private</span>' : '';
    const action = project.private
      ? '<span class="project-note">Source not publicly available</span>'
      : project.url
        ? `<a class="project-link" href="${escape(project.url)}" target="_blank" rel="noopener noreferrer" aria-label="View ${escape(project.title)} on GitHub">View on GitHub <span aria-hidden="true">↗</span></a>`
        : '<span class="project-note">Home setup</span>';
    return `        <article class="project-card" aria-labelledby="project-${index}">
          <div class="project-heading"><h3 id="project-${index}">${escape(project.title)}</h3>${privateTag}</div>
          <p>${escape(project.description)}</p>
          <div class="tags">${tags}</div>
          ${action}
        </article>`;
  }).join('\n');
}

const file = path.join(root, 'index.html');
const html = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
const region = /<!-- PROJECTS:START -->[\s\S]*?<!-- PROJECTS:END -->/;
if (!region.test(html)) throw new Error('Missing project generation markers');
const result = html.replace(region, `<!-- PROJECTS:START -->\n${renderProjects(projects)}\n        <!-- PROJECTS:END -->`);
if (process.argv.includes('--check')) {
  if (result !== html) throw new Error('Project HTML is out of date. Run npm run build.');
  console.log(`Verified ${projects.length} statically rendered projects.`);
} else {
  fs.writeFileSync(file, result);
  console.log(`Rendered ${projects.length} projects into index.html.`);
}
