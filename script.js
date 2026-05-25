const contentUrl = "data/site-content.json";
const memberSignupEndpoint =
  "https://script.google.com/macros/s/AKfycbzevx51kYzpigysIt9oVvjtZ3skEKy4Kr9fd9vFXImzhx_QjHEQwjtmJLPRBgLWKUMu9w/exec";

const fallbackContent = {
  stats: {
    members: "120+",
    projects: "08",
    families: "350+",
    events: "24"
  },
  projects: [],
  gallery: [],
  videos: [],
  members: []
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

async function loadContent() {
  try {
    const response = await fetch(contentUrl);
    if (!response.ok) throw new Error("Content file not found");
    return { ...fallbackContent, ...(await response.json()) };
  } catch (error) {
    console.warn(error);
    return fallbackContent;
  }
}

function renderStats(stats) {
  Object.entries(stats).forEach(([key, value]) => {
    const element = document.querySelector(`[data-stat="${key}"]`);
    if (element) element.textContent = value;
  });
}

function renderProjects(projects) {
  const grid = $("#projectGrid");
  const template = $("#projectTemplate");
  if (!grid || !template) return;
  grid.replaceChildren();

  projects.forEach((project) => {
    const card = template.content.cloneNode(true);
    const image = $("img", card);
    image.src = project.image;
    image.alt = project.title;
    $("span", card).textContent = project.category;
    $("h3", card).textContent = project.title;
    $("p", card).textContent = project.description;
    grid.append(card);
  });
}

function renderGallery(items) {
  const grid = $("#galleryGrid");
  const template = $("#galleryTemplate");
  if (!grid || !template) return;
  grid.replaceChildren();

  items.forEach((item) => {
    const figure = template.content.cloneNode(true);
    const image = $("img", figure);
    image.src = item.image;
    image.alt = item.caption;
    $("figcaption", figure).textContent = item.caption;
    grid.append(figure);
  });
}

function renderVideos(videos) {
  const grid = $("#videoGrid");
  const template = $("#videoTemplate");
  if (!grid || !template) return;
  grid.replaceChildren();

  videos.forEach((video) => {
    const card = template.content.cloneNode(true);
    const frame = $(".video-frame", card);

    if (video.embedUrl) {
      const iframe = document.createElement("iframe");
      iframe.src = video.embedUrl;
      iframe.title = video.title;
      iframe.loading = "lazy";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      frame.append(iframe);
    } else {
      frame.textContent = "Video coming soon";
    }

    $("h3", card).textContent = video.title;
    $("p", card).textContent = video.description;
    grid.append(card);
  });
}

function renderMembers(members) {
  const list = $("#memberList");
  const template = $("#memberTemplate");
  if (!list || !template) return;
  list.replaceChildren();

  members.forEach((member) => {
    const card = template.content.cloneNode(true);
    const image = $("img", card);
    image.src = member.image;
    image.alt = member.name;
    $("h3", card).textContent = member.name;
    $("p", card).textContent = member.role;
    $("span", card).textContent = member.area;
    list.append(card);
  });
}

function setupNavigation() {
  const button = $(".nav-toggle");
  const nav = $(".site-nav");
  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });

  $$(".site-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

function setupSignupForm() {
  const form = $("#signupForm");
  const status = $("#formStatus");
  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const request = Object.fromEntries(formData.entries());
    request.submittedAt = new Date().toISOString();

    status.textContent = "তথ্য পাঠানো হচ্ছে...";

    try {
      if (!memberSignupEndpoint) {
        throw new Error("Google Sheet endpoint is not configured yet.");
      }

      await fetch(memberSignupEndpoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(request)
      });

      form.reset();
      status.textContent = "আপনার আবেদন গ্রহণ করা হয়েছে।";
    } catch (error) {
      console.error(error);
      status.textContent = "Submission setup এখনও সম্পূর্ণ হয়নি। পরে আবার চেষ্টা করুন।";
    }
  });
}

loadContent().then((content) => {
  renderStats(content.stats);
  renderProjects(content.projects);
  renderGallery(content.gallery);
  renderVideos(content.videos);
  renderMembers(content.members);
});

setupNavigation();
setupSignupForm();
