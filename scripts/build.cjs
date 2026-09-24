const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const projects = JSON.parse(fs.readFileSync(path.join(root, 'assets/projects.json'), 'utf8').replace(/^\uFEFF/, ''));
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const visuals = {
  story: '<div class="story-mark">Df</div>',
  assistant: '<div class="wave">' + [12,22,38,28,55,68,43,26,53,70,48,32,57,39,24,15].map(height => `<i style="--h:${height}px"></i>`).join('') + '</div>',
  portrait: '<div class="portrait-mark">' + ['0011100','0122210','1232321','1222221','0133310','0133310','0011100'].join('').split('').map(pixel => `<i style="--pixel:${['transparent','#8c7954','#d1bb87','#4c5140'][pixel]}"></i>`).join('') + '</div>',
  network: '<div class="network-mark"><span>⌂</span><b>···</b><span>◇</span><b>···</b><span>↗</span></div>',
  web: '<div class="web-mark">bm<span>.</span></div>'
};
const labels = {story:'Worlds into words',assistant:'Context meets conversation',portrait:'Character by character',network:'Connected, with control',web:'A home for the work'};

function renderProjects(items) {
  return items.map((project, index) => {
    if (!project.title || !project.description || !Array.isArray(project.tags) || !Object.hasOwn(visuals, project.visual)) throw new Error('Invalid project data');
    if (!['ai','games','systems','web'].includes(project.category)) throw new Error('Unknown category');
    if (project.private && project.url) throw new Error('Private projects must not have public repository links');
    if (project.url && new URL(project.url).protocol !== 'https:') throw new Error('Project links must use HTTPS');
    const tags = project.tags.filter(tag => tag.toLowerCase() !== 'private').map(tag => `<span class="tag">${escape(tag)}</span>`).join('');
    const privateTag = project.private ? '<span class="tag private-tag">Private</span>' : '';
    const action = project.private ? '<span class="project-note">Private project · source not publicly available</span>' : project.url ? `<a class="project-link" href="${escape(project.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(project.linkLabel)}: ${escape(project.title)}">${escape(project.linkLabel)} <span aria-hidden="true">↗</span></a>` : '<span class="project-note">Personal infrastructure project</span>';
    return `        <article class="project-card${project.featured ? ' featured' : ''}" data-category="${project.category}" aria-labelledby="project-${index}">
          <div class="project-visual visual-${project.visual}" aria-hidden="true"><span class="visual-index">PROJECT / ${String(index + 1).padStart(2,'0')}</span>${visuals[project.visual]}<span class="visual-caption">${labels[project.visual]}</span></div>
          <div class="project-body"><span class="project-label">${project.featured ? 'Featured project' : {ai:'AI & interaction',games:'Game development',systems:'Systems & security',web:'Web development'}[project.category]}</span><h3 id="project-${index}">${escape(project.title)}</h3><p>${escape(project.description)}</p><div class="tags">${tags}${privateTag}</div>${action}</div>
        </article>`;
  }).join('\n');
}

const file = path.join(root, 'index.html');
const html = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
const region = /<!-- PROJECTS:START -->[\s\S]*?<!-- PROJECTS:END -->/;
if (!region.test(html)) throw new Error('Missing project generation markers');
const result = html.replace(region, `<!-- PROJECTS:START -->\n${renderProjects(projects)}\n        <!-- PROJECTS:END -->`).replace(/(<p id="project-count"[^>]*>)[^<]*/, `$1${projects.length} projects`);
if (process.argv.includes('--check')) {
  if (result !== html) throw new Error('Project HTML is out of date. Run npm run build.');
  console.log(`Verified ${projects.length} statically rendered projects.`);
} else {
  fs.writeFileSync(file, result);
  console.log(`Rendered ${projects.length} projects into index.html.`);
}
