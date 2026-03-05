// Sample talent data - will be replaced by CMS
const sampleTalent = [
  {
    name: "Ariana Vale",
    category: "actor",
    bio: "Lead actor known for award-winning performances across film and streaming.",
    followers: "2.4M",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
  },
  {
    name: "Marcus Cole",
    category: "musician",
    bio: "Grammy-nominated producer and R&B artist shaping modern sound culture.",
    followers: "1.8M",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
  },
  {
    name: "Tyler Brooks",
    category: "creator",
    bio: "Content creator and storyteller with strong brand conversion campaigns.",
    followers: "3.2M",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop",
  },
  {
    name: "Sophia Chen",
    category: "actor",
    bio: "Rising screen actor in independent cinema and global streaming series.",
    followers: "1.5M",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
  },
  {
    name: "DJ Nova",
    category: "musician",
    bio: "Electronic music producer and international touring DJ.",
    followers: "2.1M",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
  },
  {
    name: "Ava Sterling",
    category: "creator",
    bio: "Digital-first creator building audience-led campaigns for global partners.",
    followers: "4.5M",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop",
  },
  {
    name: "Maya Santos",
    category: "musician",
    bio: "Singer-songwriter blending pop, soul, and Afro-Latin influences.",
    followers: "2.8M",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop",
  },
  {
    name: "Elena Brooks",
    category: "actor",
    bio: "Screen talent balancing dramatic roles and commercial brand storytelling.",
    followers: "1.1M",
    image:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=500&fit=crop",
  },
  {
    name: "Noah James",
    category: "creator",
    bio: "Creator focused on short-form video, audience growth, and branded content.",
    followers: "2.0M",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop",
  },
];

let currentFilter = "all";

function renderTalent(talents) {
  const grid = document.getElementById("talentGrid");
  if (!grid) return;

  const filtered =
    currentFilter === "all"
      ? talents
      : talents.filter((t) => t.category === currentFilter);

  grid.innerHTML = filtered
    .map(
      (talent, index) => `
    <article class="talent-card reveal" data-delay="${(index % 3) * 70}" data-category="${talent.category}">
      <div class="talent-image" style="background-image: url('${talent.image}')"></div>
      <div class="talent-info">
        <div class="talent-badge">${talent.category}</div>
        <h3>${talent.name}</h3>
        <p>${talent.bio}</p>
        <div class="talent-meta">
          <span class="talent-followers">${talent.followers} followers</span>
        </div>
      </div>
    </article>
  `,
    )
    .join("");

  // Re-observe reveal animations
  const revealItems = grid.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.delay || 0);
        window.setTimeout(() => {
          entry.target.classList.add("visible");
        }, delay);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Initial render
  renderTalent(sampleTalent);

  // Filter functionality
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.dataset.filter;
      renderTalent(sampleTalent);
    });
  });
});

// Listen for CMS updates
window.addEventListener("cadsyent:content-applied", () => {
  // CMS will populate talent data
  renderTalent(sampleTalent);
});
