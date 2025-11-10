// Minimal, framework-free itinerary carousel with shadcn-like styling
(function () {
  const steps = [
    {
      id: "step-1",
      type: "cruise",
      title: "Cruise: New York → Alaska",
      subtitle: "7-night sailing via Inside Passage",
      details: [
        "Depart: 2025-06-12, 4:00 PM, Pier 88",
        "Ship: SS Northern Lights",
        "Cabin: Oceanview, Deck 7",
      ],
      ctaLabel: "View cruise details",
      ctaHref: "#",
    },
    {
      id: "step-2",
      type: "flight",
      title: "Flight: SEA → ANC",
      subtitle: "Alaska Airlines · 3h 35m nonstop",
      details: [
        "Depart: 2025-06-20, 10:25 AM, SEA",
        "Arrive: 2025-06-20, 1:00 PM, ANC",
        "Cabin: Economy, Seat 12A",
      ],
      ctaLabel: "View flight",
      ctaHref: "#",
    },
    {
      id: "step-3",
      type: "hotel",
      title: "Hotel: Anchorage Downtown Suites",
      subtitle: "3 nights · Near Coastal Trail",
      details: [
        "Check-in: 2025-06-20",
        "Room: King suite with kitchenette",
        "Free breakfast · Late checkout",
      ],
      ctaLabel: "View hotel",
      ctaHref: "#",
    },
    {
      id: "step-4",
      type: "activity",
      title: "Activity: Glacier Helicopter Tour",
      subtitle: "Small group · 2 hours",
      details: [
        "Depart: 2025-06-21, 9:00 AM",
        "Operator: Aurora Adventures",
        "Includes boots and safety gear",
      ],
      ctaLabel: "View activity",
      ctaHref: "#",
    },
    {
      id: "step-5",
      type: "train",
      title: "Train: Anchorage → Seward",
      subtitle: "Alaska Railroad Coastal Classic",
      details: [
        "Depart: 2025-06-23, 6:45 AM",
        "Arrive: 2025-06-23, 11:15 AM",
        "GoldStar service, dome car seats",
      ],
      ctaLabel: "View train details",
      ctaHref: "#",
    },
  ];

  function $(sel, root = document) {
    return root.querySelector(sel);
  }

  function el(tag, className) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    return n;
  }

  function createIconChevron(direction) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    if (direction === "left") {
      poly.setAttribute("points", "15 18 9 12 15 6");
    } else {
      poly.setAttribute("points", "9 18 15 12 9 6");
    }
    svg.appendChild(poly);
    return svg;
  }

  function setCardContent(art, step, role) {
    art.className = `card card--${role}`;
    art.setAttribute("data-step-id", step.id);
    art.innerHTML = "";

    const header = el("header", "card-header");
    const badge = el("div", "badge badge-muted");
    badge.textContent = (step.type || "").toString().charAt(0).toUpperCase() + (step.type || "").toString().slice(1);
    header.appendChild(badge);

    const h2 = el("h2", "card-title");
    h2.textContent = step.title;

    const p = el("p", "card-subtitle");
    p.textContent = step.subtitle || "";

    const ul = el("ul", "card-list");
    (step.details || []).forEach((d) => {
      const li = document.createElement("li");
      li.textContent = d;
      ul.appendChild(li);
    });

    art.appendChild(header);
    art.appendChild(h2);
    if (step.subtitle) art.appendChild(p);
    if (step.details && step.details.length) art.appendChild(ul);

    if (step.ctaLabel && step.ctaHref) {
      const actions = el("div", "card-actions");
      const a = document.createElement("a");
      a.href = step.ctaHref;
      a.className = "btn btn-default";
      a.textContent = step.ctaLabel;
      actions.appendChild(a);
      art.appendChild(actions);
    }
  }

  function init() {
    const mount = $("#itinerary");
    if (!mount) return;

    // Clear fallback, if present
    mount.innerHTML = "";

    const root = el("div", "itinerary-root");
    root.setAttribute("data-testid", "carousel-root");

    const live = el("div", "visually-hidden");
    live.id = "itinerary-live";
    live.setAttribute("aria-live", "polite");

    const btnPrev = document.createElement("button");
    btnPrev.type = "button";
    btnPrev.className = "btn btn-default nav-btn";
    btnPrev.setAttribute("data-testid", "nav-prev");
    btnPrev.setAttribute("aria-label", "Previous step");
    btnPrev.appendChild(createIconChevron("left"));

    const btnNext = document.createElement("button");
    btnNext.type = "button";
    btnNext.className = "btn btn-default nav-btn";
    btnNext.setAttribute("data-testid", "nav-next");
    btnNext.setAttribute("aria-label", "Next step");
    btnNext.appendChild(createIconChevron("right"));

    const viewport = el("div", "itinerary-viewport");
    viewport.setAttribute("role", "region");
    viewport.setAttribute("aria-label", "Trip steps");

    const cardsWrap = el("div", "itinerary-cards");
    viewport.appendChild(cardsWrap);

    const dots = el("div", "itinerary-dots");
    dots.setAttribute("data-testid", "dots");

    root.appendChild(btnPrev);
    root.appendChild(viewport);
    root.appendChild(btnNext);

    mount.appendChild(live);
    mount.appendChild(root);
    mount.appendChild(dots);

    // Create three persistent cards for animation via class changes
    const cardPrev = document.createElement("article");
    cardPrev.setAttribute("data-testid", "carousel-card");
    const cardCurr = document.createElement("article");
    cardCurr.setAttribute("data-testid", "carousel-card");
    const cardNext = document.createElement("article");
    cardNext.setAttribute("data-testid", "carousel-card");

    cardsWrap.appendChild(cardPrev);
    cardsWrap.appendChild(cardCurr);
    cardsWrap.appendChild(cardNext);

    let currentIndex = 0;

    function updateLive() {
      live.textContent = steps[currentIndex]?.title || "";
    }

    function renderDots() {
      dots.innerHTML = "";
      steps.forEach((_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "dot" + (i === currentIndex ? " active" : "");
        b.setAttribute("data-testid", `step-dot-${i}`);
        b.setAttribute("aria-label", `Go to step ${i + 1}`);
        b.addEventListener("click", () => {
          currentIndex = i;
          render();
        });
        dots.appendChild(b);
      });
    }

    function render() {
      const prevIndex = (currentIndex - 1 + steps.length) % steps.length;
      const nextIndex = (currentIndex + 1) % steps.length;

      setCardContent(cardPrev, steps[prevIndex], "prev");
      setCardContent(cardCurr, steps[currentIndex], "current");
      setCardContent(cardNext, steps[nextIndex], "next");

      updateLive();
      renderDots();
    }

    function goPrev() {
      currentIndex = (currentIndex - 1 + steps.length) % steps.length;
      render();
    }
    function goNext() {
      currentIndex = (currentIndex + 1) % steps.length;
      render();
    }

    btnPrev.addEventListener("click", goPrev);
    btnNext.addEventListener("click", goNext);

    // Keyboard support
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "Home") {
        e.preventDefault();
        currentIndex = 0;
        render();
      } else if (e.key === "End") {
        e.preventDefault();
        currentIndex = steps.length - 1;
        render();
      }
    });

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

