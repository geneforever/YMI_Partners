(function () {
  "use strict";

  const content = window.siteContent;
  if (!content) return;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const setText = (selector, value) => {
    const element = $(selector);
    if (!element) return;
    element.textContent = value || "";
  };

  const createElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  function renderSiteMeta() {
    document.title = content.site.name;
    const description = $('meta[name="description"]');
    if (description) description.content = content.site.description;

    const logo = $('[data-brand-logo]');
    const fallback = $('[data-brand-fallback]');
    if (logo && content.site.logoSrc) {
      logo.src = content.site.logoSrc;
      logo.alt = content.site.logoAlt || content.site.name;
      logo.addEventListener("error", () => {
        logo.hidden = true;
        if (fallback) {
          fallback.textContent = content.site.name;
          fallback.hidden = false;
        }
      });
    } else if (logo) {
      logo.hidden = true;
    }
    if (fallback) {
      fallback.textContent = content.site.wordmark || content.site.name;
      fallback.hidden = Boolean(content.site.logoSrc);
    }
    setText("[data-footer-company]", content.site.footerCompany);
    setText("[data-footer-copyright]", content.site.footerCopyright);
  }

  function renderNavigation() {
    const list = $(`[data-nav-list]`);
    if (!list) return;

    content.nav.forEach((item) => {
      const li = createElement("li");
      const link = createElement("a", "nav-link", item.label);
      link.href = `#${item.target}`;
      link.dataset.target = item.target;
      li.appendChild(link);
      list.appendChild(li);
    });
  }

  function renderHero() {
    setText("[data-hero-eyebrow]", content.hero.eyebrow);
    setText("[data-hero-title]", content.hero.title);
    setText("[data-hero-description]", content.hero.description);
    setText("[data-hero-primary]", content.hero.primaryCta);
    setText("[data-hero-secondary]", content.hero.secondaryCta);
    setText("[data-hero-image-caption]", content.hero.imageCaption);

    const title = $("[data-hero-title]");
    if (title) title.innerHTML = content.hero.title.replace(/\n/g, "<br />");

    const image = $("[data-hero-image]");
    if (image) {
      image.src = content.hero.image;
      image.alt = content.hero.imageAlt || "";
    }

    const video = $("[data-hero-video]");
    const videoSource = $("[data-hero-video-source]");
    if (video && videoSource && content.hero.video) {
      videoSource.src = content.hero.video;
      video.poster = content.hero.image || "";
      video.setAttribute("aria-label", content.hero.videoAlt || "YMI Partners 소개 영상");
      video.addEventListener("error", () => {
        video.hidden = true;
      });
      video.load();
    } else if (video) {
      video.hidden = true;
    }

    const proof = $("[data-hero-proof]");
    content.hero.proof.forEach((item) => {
      proof.appendChild(createElement("span", "proof-item", item));
    });
  }

  function setupHeroVideo() {
    const video = $("[data-hero-video]");
    const toggle = $("[data-hero-sound]");
    const label = $("[data-hero-sound-label]");
    if (!video || !toggle) return;

    let audioContext;
    let audioGain;

    const prepareAudioBoost = async () => {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      try {
        if (!audioContext) {
          audioContext = new AudioContextClass();
          const source = audioContext.createMediaElementSource(video);
          audioGain = audioContext.createGain();
          audioGain.gain.value = 1.8;
          source.connect(audioGain).connect(audioContext.destination);
        }
        if (audioContext.state === "suspended") await audioContext.resume();
      } catch (error) {
        audioContext = null;
        audioGain = null;
      }
    };

    const updateLabel = () => {
      const muted = video.muted;
      toggle.setAttribute("aria-pressed", String(!muted));
      if (label) label.textContent = muted ? "소리 켜고 재생" : "소리 끄기";
    };

    toggle.addEventListener("click", async () => {
      video.muted = !video.muted;
      if (!video.muted) {
        video.volume = 1;
        await prepareAudioBoost();
        try {
          await video.play();
        } catch (error) {
          video.muted = true;
        }
      }
      updateLabel();
    });

    video.addEventListener("volumechange", updateLabel);
    updateLabel();
  }

  function renderServices() {
    setText("[data-services-eyebrow]", content.services.eyebrow);
    setText("[data-services-title]", content.services.title);
    setText("[data-services-description]", content.services.description);

    const grid = $("[data-services-grid]");
    content.services.items.forEach((item) => {
      const card = createElement("article", "service-card");
      card.append(
        createElement("span", "card-number", item.number),
        createElement("span", "card-tag", item.tag),
        createElement("h3", "card-title", item.title),
        createElement("p", "card-description", item.description)
      );
      grid.appendChild(card);
    });
  }

  function renderAbout() {
    setText("[data-about-eyebrow]", content.about.eyebrow);
    setText("[data-about-title]", content.about.title);
    setText("[data-about-role]", content.about.role);
    setText("[data-about-description]", content.about.description);
    setText("[data-about-details-label]", content.about.detailsLabel);
    setText("[data-about-image-caption]", content.about.imageCaption);

    const image = $("[data-about-image]");
    if (image) {
      image.src = content.about.image;
      image.alt = content.about.imageAlt || "";
    }

    const highlights = $("[data-about-highlights]");
    content.about.highlights.forEach((item) => {
      const highlight = createElement("div", "highlight-item");
      highlight.append(createElement("span", "highlight-marker", "＋"), createElement("span", "highlight-text", item));
      highlights.appendChild(highlight);
    });

    const details = $("[data-about-details]");
    if (content.about.profileSections && details) {
      content.about.profileSections.forEach((section) => {
        const group = createElement("div", "profile-group");
        group.appendChild(createElement("h4", "profile-group-title", section.title));
        const list = createElement("ul", "profile-list");
        section.items.forEach((item) => list.appendChild(createElement("li", "profile-item", item)));
        group.appendChild(list);
        details.appendChild(group);
      });
    } else {
      setText("[data-about-details]", content.about.details);
    }
  }

  function renderProjects() {
    setText("[data-projects-eyebrow]", content.projects.eyebrow);
    setText("[data-projects-title]", content.projects.title);
    setText("[data-projects-description]", content.projects.description);

    const grid = $("[data-projects-grid]");
    content.projects.items.forEach((item) => {
      const card = createElement("article", "project-card");
      const imageWrap = createElement("div", "project-image");
      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.title;
      image.loading = "lazy";
      imageWrap.appendChild(image);
      card.append(
        imageWrap,
        createElement("span", "project-category", item.category),
        createElement("h3", "project-title", item.title),
        createElement("p", "project-description", item.description)
      );
      grid.appendChild(card);
    });
  }

  function renderPartners() {
    setText("[data-partners-eyebrow]", content.partners.eyebrow);
    setText("[data-partners-title]", content.partners.title);
    setText("[data-partners-description]", content.partners.description);
    setText("[data-partner-window-title]", content.partners.windowTitle);

    const list = $("[data-partner-list]");
    content.partners.items.forEach((item) => {
      const logo = createElement("div", "partner-logo-tile");
      if (item.image) {
        const image = document.createElement("img");
        image.className = "partner-logo-image";
        image.src = item.image;
        image.alt = item.imageAlt || `${item.name} 로고`;
        image.loading = "lazy";
        logo.appendChild(image);
      } else if (item.mark) {
        logo.appendChild(createElement("span", "partner-logo-mark", item.mark));
      }
      logo.appendChild(createElement("span", "partner-logo-name", item.name));
      list.appendChild(logo);
    });
  }

  function renderMembers() {
    const members = content.members;
    if (!members) return;

    setText("[data-members-eyebrow]", members.eyebrow);
    setText("[data-members-title]", members.title);
    setText("[data-members-description]", members.description);

    const windowElement = $("[data-member-window]");
    if (!windowElement) return;

    members.items.forEach((item) => {
      const profile = createElement("article", "member-profile");
      const identity = createElement("div", "member-identity");
      const image = document.createElement("img");
      image.className = "member-portrait";
      image.src = item.image;
      image.alt = item.imageAlt || item.name;
      image.loading = "lazy";
      identity.append(
        image,
        createElement("h3", "member-name", item.name),
        createElement("p", "member-role", item.role)
      );

      const details = createElement("div", "member-details");
      const detailsGrid = createElement("div", "member-details-grid");
      item.profileSections.forEach((section) => {
        const group = createElement("section", "member-detail-group");
        group.appendChild(createElement("h4", "member-detail-title", section.title));
        const list = createElement("ul", "member-detail-list");
        section.items.forEach((entry) => {
          list.appendChild(createElement("li", "member-detail-item", entry));
        });
        group.appendChild(list);
        detailsGrid.appendChild(group);
      });
      details.appendChild(detailsGrid);
      profile.append(identity, details);
      windowElement.appendChild(profile);
    });
  }

  function renderPress() {
    setText("[data-press-eyebrow]", content.press.eyebrow);
    setText("[data-press-title]", content.press.title);
    setText("[data-press-description]", content.press.description);

    const list = $("[data-press-list]");
    content.press.items.forEach((item, index) => {
      const article = createElement("article", "press-item");
      const number = createElement("span", "press-number", String(index + 1).padStart(2, "0"));
      const copy = createElement("div", "press-copy");
      copy.append(
        createElement("time", "press-date", item.date),
        createElement("h3", "press-title", item.title),
        createElement("p", "press-description", item.description)
      );
      article.append(number, copy, createElement("span", "press-arrow", "↗"));
      list.appendChild(article);
    });
  }

  function renderContact() {
    setText("[data-contact-eyebrow]", content.contact.eyebrow);
    setText("[data-contact-title]", content.contact.title);
    setText("[data-contact-description]", content.contact.description);
    setText("[data-contact-form-title]", content.contact.formTitle);
    setText("[data-contact-form-description]", content.contact.formDescription);

    const form = $("[data-contact-form]");
    if (form) {
      form.method = "POST";
      form.action = `https://formsubmit.co/${content.contact.email}`;
      const formUrl = $("[data-form-url]", form);
      if (formUrl) formUrl.value = content.site.formUrl || "https://www.ymipartners.co.kr/";
    }

    const contactInfo = $("[data-contact-info]");
    const phone = createElement("a", "contact-link", content.contact.phone);
    phone.href = `tel:${content.contact.phone.replace(/[^0-9+]/g, "")}`;
    const email = createElement("a", "contact-link", content.contact.email);
    email.href = `mailto:${content.contact.email}`;
    contactInfo.append(
      createElement("span", "contact-label", "PHONE"), phone,
      createElement("span", "contact-label", "EMAIL"), email,
      createElement("span", "contact-label", "ADDRESS"), createElement("span", "contact-address", content.contact.address)
    );
  }

  function setupMenu() {
    const toggle = $("[data-menu-toggle]");
    const nav = $("[data-primary-nav]");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const isOpen = nav.dataset.open === "true";
      nav.dataset.open = String(!isOpen);
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.querySelector(".sr-only").textContent = isOpen ? "메뉴 열기" : "메뉴 닫기";
    });

    $$(".nav-link", nav).forEach((link) => {
      link.addEventListener("click", () => {
        nav.dataset.open = "false";
        toggle.setAttribute("aria-expanded", "false");
        toggle.querySelector(".sr-only").textContent = "메뉴 열기";
      });
    });
  }

  function setupScrollState() {
    const header = $("[data-site-header]");
    const sections = $$('main [data-section]');
    const links = $$(".nav-link");

    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 16);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            const active = link.dataset.target === entry.target.id;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-35% 0px -55%" }
    );
    sections.forEach((section) => observer.observe(section));
  }

  function setupStaticContactForm() {
    const form = $("[data-contact-form]");
    if (!form) return;
  }

  function setupGentleSectionScroll() {
    const sections = $$('main > [data-section]');
    const header = $("[data-site-header]");
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!sections.length || !finePointer.matches || reducedMotion.matches) return;

    const duration = 1050;
    let animationFrame = 0;

    const easeInOut = (value) => {
      return (1 - Math.cos(Math.PI * value)) / 2;
    };

    const sectionTarget = (section) => {
      const headerHeight = header ? header.offsetHeight : 0;
      return Math.max(0, Math.round(window.scrollY + section.getBoundingClientRect().top - headerHeight));
    };

    const animateTo = (target) => {
      const start = window.scrollY;
      const distance = target - start;
      if (Math.abs(distance) < 2) return;

      if (animationFrame) cancelAnimationFrame(animationFrame);
      const startedAt = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        window.scrollTo(0, start + distance * easeInOut(progress));
        if (progress < 1) {
          animationFrame = requestAnimationFrame(step);
        } else {
          animationFrame = 0;
        }
      };

      animationFrame = requestAnimationFrame(step);
    };

    const currentSectionIndex = () => {
      const position = window.scrollY + 16;
      let current = 0;
      sections.forEach((section, index) => {
        if (sectionTarget(section) <= position) current = index;
      });
      return current;
    };

    const moveToSection = (index) => {
      if (index < 0 || index >= sections.length) return;
      animateTo(sectionTarget(sections[index]));
    };

    $$('a[href^="#"]').forEach((link) => {
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (!target || !target.matches("main > [data-section]")) return;

      link.addEventListener("click", (event) => {
        event.preventDefault();
        history.pushState(null, "", `#${targetId}`);
        animateTo(sectionTarget(target));
      });
    });

    window.addEventListener("wheel", (event) => {
      if (event.ctrlKey || Math.abs(event.deltaY) < 18 || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      if (animationFrame) {
        event.preventDefault();
        return;
      }

      const index = currentSectionIndex();
      const section = sections[index];
      const sectionStart = sectionTarget(section);
      const sectionBottom = section.getBoundingClientRect().bottom + window.scrollY;
      const viewportBottom = window.scrollY + window.innerHeight;
      const atTop = window.scrollY <= sectionStart + 14;
      const atBottom = viewportBottom >= sectionBottom - 14;

      if (event.deltaY > 0 && atBottom && index < sections.length - 1) {
        event.preventDefault();
        moveToSection(index + 1);
      } else if (event.deltaY < 0 && atTop && index > 0) {
        event.preventDefault();
        moveToSection(index - 1);
      }
    }, { passive: false });
  }

  renderSiteMeta();
  renderNavigation();
  renderHero();
  setupHeroVideo();
  renderServices();
  renderAbout();
  renderProjects();
  renderPartners();
  renderMembers();
  renderPress();
  renderContact();
  setupMenu();
  setupScrollState();
  setupStaticContactForm();
  setupGentleSectionScroll();
})();
