// === Mobile Menu Toggle ===
const navToggle = document.querySelector(".nav-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

navToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
});

mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
    });
});

// === Typing Animation ===
const phrases = [
    "Welcome to my site.",
    "I build things.",
    "Check out my projects below.",
];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
const typedEl = document.getElementById("typed-text");

function typeLoop() {
    const current = phrases[phraseIndex];

    if (!deleting) {
        typedEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
            deleting = true;
            setTimeout(typeLoop, 2000);
            return;
        }
        setTimeout(typeLoop, 80);
    } else {
        typedEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(typeLoop, 500);
            return;
        }
        setTimeout(typeLoop, 40);
    }
}

typeLoop();

// === Load Projects ===
async function loadProjects() {
    try {
        const res = await fetch("assets/projects.json");
        const projects = await res.json();
        const grid = document.getElementById("project-grid");

        projects.forEach((p) => {
            const card = document.createElement("div");
            card.className = "project-card";

            const tags = p.tags
                .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
                .join("");

            card.innerHTML = `
                ${p.image ? `<img class="project-img" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy" />` : ""}
                <h3>${escapeHtml(p.title)}</h3>
                <p>${escapeHtml(p.description)}</p>
                <div class="tags">${tags}</div>
                ${p.url ? `<a href="${escapeHtml(p.url)}" target="_blank" rel="noopener">View Project &rarr;</a>` : ""}
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        console.error("Failed to load projects:", err);
    }
}

loadProjects();

// === Comments ===
const commentForm = document.getElementById("comment-form");
const commentList = document.getElementById("comment-list");

async function loadComments() {
    try {
        const res = await fetch("/api/comments");
        if (!res.ok) return;
        const comments = await res.json();

        commentList.innerHTML = "";
        comments.forEach((c) => {
            const div = document.createElement("div");
            div.className = "comment";
            const date = new Date(c.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
            div.innerHTML = `
                <div class="comment-header">
                    <span class="comment-name">${escapeHtml(c.name)}</span>
                    <span class="comment-date">${date}</span>
                </div>
                <div class="comment-message">${escapeHtml(c.message)}</div>
            `;
            commentList.appendChild(div);
        });
    } catch {
        // API not available (e.g., viewing static files directly)
    }
}

commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const honeypot = document.getElementById("comment-honeypot").value;
    if (honeypot) return; // bot filled the hidden field

    const name = document.getElementById("comment-name").value.trim();
    const message = document.getElementById("comment-message").value.trim();
    if (!name || !message) return;

    const btn = commentForm.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Sending...";

    try {
        const res = await fetch("/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, message, website: honeypot }),
        });

        if (res.ok) {
            commentForm.reset();
            await loadComments();
        } else {
            const err = await res.json();
            alert(err.error || "Failed to post comment.");
        }
    } catch {
        alert("Could not reach the server.");
    } finally {
        btn.disabled = false;
        btn.textContent = "Submit";
    }
});

loadComments();

// === Utility ===
function escapeHtml(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}
