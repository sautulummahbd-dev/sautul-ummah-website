const state = {
  stats: {},
  projects: [],
  gallery: [],
  videos: [],
  members: []
};

const fieldMap = {
  projects: ["category", "title", "description", "image"],
  gallery: ["caption", "image"],
  videos: ["title", "description", "embedUrl"],
  members: ["name", "role", "area", "image"]
};

const emptyItem = {
  projects: { category: "", title: "", description: "", image: "" },
  gallery: { caption: "", image: "" },
  videos: { title: "", description: "", embedUrl: "" },
  members: { name: "", role: "", area: "", image: "" }
};

const labels = {
  category: "Category",
  title: "Title",
  description: "Description",
  image: "Image URL or public path",
  caption: "Caption",
  embedUrl: "YouTube embed URL",
  name: "Name",
  role: "Role",
  area: "Area"
};

const editorIds = {
  projects: "projectsEditor",
  gallery: "galleryEditor",
  videos: "videosEditor",
  members: "membersEditor"
};

const getInput = (name) => document.querySelector(`[name="${name}"]`);

async function loadContent() {
  const response = await fetch("data/site-content.json");
  const content = await response.json();
  Object.assign(state, content);
  renderAll();
}

function renderAll() {
  Object.entries(state.stats).forEach(([key, value]) => {
    const input = getInput(`stats.${key}`);
    if (input) input.value = value;
  });

  Object.keys(fieldMap).forEach(renderCollection);
}

function renderCollection(collectionName) {
  const list = document.getElementById(editorIds[collectionName]);
  const template = document.getElementById("editorCardTemplate");
  list.replaceChildren();

  state[collectionName].forEach((item, index) => {
    const card = template.content.cloneNode(true);
    card.querySelector("strong").textContent = `${collectionName} #${index + 1}`;
    const remove = card.querySelector("button");
    remove.addEventListener("click", () => {
      state[collectionName].splice(index, 1);
      renderCollection(collectionName);
    });

    const grid = card.querySelector(".admin-grid");
    fieldMap[collectionName].forEach((field) => {
      const label = document.createElement("label");
      const input = document.createElement(field === "description" ? "textarea" : "input");
      input.value = item[field] || "";
      input.addEventListener("input", () => {
        item[field] = input.value;
      });

      if (input.tagName === "TEXTAREA") input.rows = 3;
      label.textContent = labels[field] || field;
      label.append(input);
      grid.append(label);
    });

    list.append(card);
  });
}

function collectStats() {
  ["members", "projects", "families", "events"].forEach((key) => {
    state.stats[key] = getInput(`stats.${key}`).value;
  });
}

function downloadContent() {
  collectStats();
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json"
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "site-content.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

document.querySelectorAll("[data-add]").forEach((button) => {
  button.addEventListener("click", () => {
    const collectionName = button.dataset.add;
    state[collectionName].push({ ...emptyItem[collectionName] });
    renderCollection(collectionName);
  });
});

document.getElementById("downloadContent").addEventListener("click", downloadContent);

loadContent();
