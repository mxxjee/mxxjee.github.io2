(() => {
  const toggle = document.querySelector(".projects-sort-toggle");
  const toggleLabel = document.querySelector(".projects-sort-toggle-label");
  const projectsGrid = document.querySelector("#projects-grid");
  const contentGroups = document.querySelector("#content-groups");
  const carousel = document.querySelector(".projects-carousel");
  const carouselViewport = document.querySelector(".projects-carousel-viewport");
  const previousButton = document.querySelector(".projects-carousel-prev");
  const nextButton = document.querySelector(".projects-carousel-next");
  const carouselDots = document.querySelector(".projects-carousel-dots");
  const carouselStatus = document.querySelector(".projects-carousel-status");

  if (
    !toggle ||
    !toggleLabel ||
    !projectsGrid ||
    !contentGroups ||
    !carousel ||
    !carouselViewport ||
    !previousButton ||
    !nextButton ||
    !carouselDots ||
    !carouselStatus
  ) {
    return;
  }

  const projectOrder = [
    "CodeVein 모작",
    "젤다의 전설 : 꿈꾸는 섬 모작",
    "AI 활용 Interaction Manager 리팩토링",
    "Cult Of The Lamb 모작",
    "모모도라:달 아래의 진혼곡 모작",
    "맞짱 (개발 중)",
  ];

  const projectCards = Array.from(projectsGrid.querySelectorAll(".project-card"));

  projectCards.sort((firstCard, secondCard) => {
    const firstTitle = firstCard.querySelector(".project-title-block h3")?.textContent.trim();
    const secondTitle = secondCard.querySelector(".project-title-block h3")?.textContent.trim();
    const firstIndex = projectOrder.indexOf(firstTitle);
    const secondIndex = projectOrder.indexOf(secondTitle);

    return (firstIndex < 0 ? projectOrder.length : firstIndex) -
      (secondIndex < 0 ? projectOrder.length : secondIndex);
  });

  projectCards.forEach((card, index) => {
    const projectLabel = card.querySelector(".project-label");

    if (projectLabel) {
      projectLabel.textContent = `PROJECT ${String(index + 1).padStart(2, "0")}`;
    }

    projectsGrid.append(card);
  });

  const categoryMeta = [
    {
      key: "gameplay",
      title: "게임플레이 · 인터랙션",
      description: "플레이어 행동, 미니게임, 대화와 퀘스트처럼 직접 체감되는 플레이 경험입니다.",
    },
    {
      key: "tools-ui",
      title: "UI · 제작 도구",
      description: "콘텐츠 제작 효율과 사용자 경험을 높이기 위해 구현한 도구와 UI 시스템입니다.",
    },
    {
      key: "architecture",
      title: "아키텍처 · 프레임워크",
      description: "확장성과 유지보수를 고려해 설계한 이벤트, 생명주기와 실행 구조입니다.",
    },
    {
      key: "data",
      title: "데이터 · 진행 시스템",
      description: "콘텐츠 해금, 스테이지 진행과 저장처럼 게임의 흐름을 유지하는 시스템입니다.",
    },
    {
      key: "multiplayer",
      title: "멀티플레이 · 동기화",
      description: "서버와 클라이언트 사이의 게임 진입, 상태 처리와 동기화 구조입니다.",
    },
    {
      key: "client-quality",
      title: "클라이언트 기술 · 품질",
      description: "렌더링 구현부터 AI 기반 구조 개선과 수치 검증까지 클라이언트 품질을 다룬 경험입니다.",
    },
  ];

  const groupedItems = new Map(categoryMeta.map((category) => [category.key, []]));

  projectsGrid.querySelectorAll(".project-card").forEach((card) => {
    const projectLabel = card.querySelector(".project-label")?.textContent.trim() ?? "PROJECT";
    const projectTitle = card.querySelector(".project-title-block h3")?.textContent.trim() ?? "프로젝트";
    const projectLinks = Array.from(card.querySelectorAll(".project-links a"));
    const detailLink =
      projectLinks.find((link) => link.textContent.includes("Notion")) ??
      projectLinks[0] ??
      card.querySelector(".project-video");

    card.querySelectorAll("[data-content-category]").forEach((item) => {
      const category = item.dataset.contentCategory;

      if (!category || !groupedItems.has(category)) {
        return;
      }

      groupedItems.get(category).push({
        projectLabel,
        projectTitle,
        title: item.textContent.trim(),
        href: detailLink?.href ?? "#projects",
      });
    });
  });

  categoryMeta.forEach((category, index) => {
    const items = groupedItems.get(category.key);

    if (!items?.length) {
      return;
    }

    const group = document.createElement("article");
    group.className = "content-group";

    const header = document.createElement("header");
    header.className = "content-group-header";

    const meta = document.createElement("div");
    meta.className = "content-group-meta";

    const groupIndex = document.createElement("span");
    groupIndex.className = "content-group-index";
    groupIndex.textContent = `CONTENT ${String(index + 1).padStart(2, "0")}`;

    const count = document.createElement("span");
    count.className = "content-group-count";
    count.textContent = String(items.length);
    count.setAttribute("aria-label", `${items.length}개 구현 항목`);

    const title = document.createElement("h3");
    title.textContent = category.title;

    const description = document.createElement("p");
    description.className = "content-group-description";
    description.textContent = category.description;

    meta.append(groupIndex, count);
    header.append(meta, title, description);

    const list = document.createElement("ul");
    list.className = "content-items";

    items.forEach((item) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.className = "content-item-link";
      link.href = item.href;

      if (item.href.startsWith("http")) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }

      const project = document.createElement("span");
      project.className = "content-item-project";
      project.textContent = `${item.projectLabel} · ${item.projectTitle}`;

      const itemTitle = document.createElement("strong");
      itemTitle.className = "content-item-title";
      itemTitle.textContent = item.title;

      const arrow = document.createElement("span");
      arrow.className = "content-item-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";

      link.append(project, itemTitle, arrow);
      listItem.append(link);
      list.append(listItem);
    });

    group.append(header, list);
    contentGroups.append(group);
  });

  const appendLoopClones = (track) => {
    const slides = Array.from(track.children);

    slides.forEach((slide, index) => {
      slide.dataset.carouselIndex = String(index);
      const clone = slide.cloneNode(true);
      clone.dataset.carouselClone = "true";
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("a, button, input, select, textarea, [tabindex]").forEach((element) => {
        element.tabIndex = -1;
      });
      track.append(clone);
    });

    return slides;
  };

  const projectSlides = appendLoopClones(projectsGrid);
  const contentSlides = appendLoopClones(contentGroups);

  let isContentView = false;
  let wheelLocked = false;
  let scrollFrame = 0;
  let resizeFrame = 0;
  let autoScrollFrame = 0;
  let autoScrollPosition = 0;
  let lastAutoScrollTime = 0;
  let isCarouselHovered = false;
  let isCarouselFocused = false;
  let isCarouselVisible = false;
  const autoScrollSpeed = 28;
  const viewIndices = { projects: 0, content: 0 };
  const viewMetrics = {
    projects: { loopDistance: 0, slideDistance: 0 },
    content: { loopDistance: 0, slideDistance: 0 },
  };
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const getViewKey = () => (isContentView ? "content" : "projects");
  const getActiveTrack = () => (isContentView ? contentGroups : projectsGrid);
  const getActiveSlides = () => (isContentView ? contentSlides : projectSlides);
  const getActiveMetrics = () => viewMetrics[getViewKey()];
  const updateLoopMetrics = () => {
    const track = getActiveTrack();
    const slides = getActiveSlides();
    const firstSlide = slides[0];
    const firstClone = track.querySelector('[data-carousel-clone="true"]');
    const metrics = getActiveMetrics();

    metrics.loopDistance =
      firstSlide && firstClone ? firstClone.offsetLeft - firstSlide.offsetLeft : 0;
    metrics.slideDistance =
      slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : metrics.loopDistance;
  };
  const getLoopDistance = () => getActiveMetrics().loopDistance;

  const updateCarouselUi = () => {
    const slides = getActiveSlides();
    const viewKey = getViewKey();
    const currentIndex = Math.min(viewIndices[viewKey], Math.max(slides.length - 1, 0));
    const canNavigate = slides.length > 1;

    viewIndices[viewKey] = currentIndex;
    previousButton.disabled = !canNavigate;
    nextButton.disabled = !canNavigate;
    previousButton.setAttribute("aria-label", `이전 ${isContentView ? "콘텐츠" : "프로젝트"}`);
    nextButton.setAttribute("aria-label", `다음 ${isContentView ? "콘텐츠" : "프로젝트"}`);
    carouselViewport.setAttribute(
      "aria-label",
      `${isContentView ? "콘텐츠" : "프로젝트"} 슬라이드 ${currentIndex + 1} / ${slides.length}`,
    );
    carouselStatus.textContent = `${isContentView ? "콘텐츠" : "프로젝트"} ${currentIndex + 1} / ${slides.length}`;

    carouselDots.querySelectorAll(".projects-carousel-dot").forEach((dot, index) => {
      const isCurrent = index === currentIndex;
      dot.setAttribute("aria-current", String(isCurrent));
      dot.tabIndex = isCurrent ? 0 : -1;
    });
  };

  const goToSlide = (requestedIndex, smooth = true) => {
    const slides = getActiveSlides();

    if (!slides.length) {
      return;
    }

    const viewKey = getViewKey();
    const nextIndex = Math.max(0, Math.min(requestedIndex, slides.length - 1));
    const slide = slides[nextIndex];
    const viewportRect = carouselViewport.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const slideCenter =
      slideRect.left - viewportRect.left + carouselViewport.scrollLeft + slideRect.width / 2;
    const baseTargetLeft = slideCenter - carouselViewport.clientWidth / 2;
    const maxScroll = Math.max(0, carouselViewport.scrollWidth - carouselViewport.clientWidth);
    const loopDistance = getLoopDistance();
    const targetCandidates = [baseTargetLeft];

    if (loopDistance > 0) {
      targetCandidates.push(baseTargetLeft - loopDistance, baseTargetLeft + loopDistance);
    }

    const targetLeft = targetCandidates
      .filter((candidate) => candidate >= 0 && candidate <= maxScroll)
      .reduce(
        (closest, candidate) =>
          Math.abs(candidate - carouselViewport.scrollLeft) <
          Math.abs(closest - carouselViewport.scrollLeft)
            ? candidate
            : closest,
        Math.max(0, Math.min(baseTargetLeft, maxScroll)),
      );

    viewIndices[viewKey] = nextIndex;
    carouselViewport.scrollTo({
      left: targetLeft,
      behavior: smooth && !prefersReducedMotion.matches ? "smooth" : "auto",
    });
    updateCarouselUi();
  };

  const stopAutoScroll = () => {
    window.cancelAnimationFrame(autoScrollFrame);
    autoScrollFrame = 0;
    lastAutoScrollTime = 0;
    carousel.classList.remove("is-auto-scrolling");
  };

  const autoScroll = (timestamp) => {
    if (!lastAutoScrollTime) {
      lastAutoScrollTime = timestamp;
    }

    const elapsed = Math.min(timestamp - lastAutoScrollTime, 1000);
    const loopDistance = getLoopDistance();
    lastAutoScrollTime = timestamp;

    if (loopDistance > 0) {
      autoScrollPosition += (autoScrollSpeed * elapsed) / 1000;

      if (autoScrollPosition >= loopDistance) {
        autoScrollPosition %= loopDistance;
      }

      carouselViewport.scrollLeft = autoScrollPosition;
    }

    autoScrollFrame = window.requestAnimationFrame(autoScroll);
  };

  const startAutoScroll = () => {
    stopAutoScroll();

    if (
      prefersReducedMotion.matches ||
      document.hidden ||
      isCarouselHovered ||
      isCarouselFocused ||
      !isCarouselVisible ||
      getActiveSlides().length < 2
    ) {
      return;
    }

    carousel.classList.add("is-auto-scrolling");
    autoScrollPosition = carouselViewport.scrollLeft;
    autoScrollFrame = window.requestAnimationFrame(autoScroll);
  };

  const centerSlideFromTarget = (target) => {
    if (!(target instanceof Element)) {
      return;
    }

    const slide = target.closest(".project-card, .content-group");

    if (!slide || !getActiveTrack().contains(slide)) {
      return;
    }

    const slideIndex = Number(slide.dataset.carouselIndex);

    if (!Number.isInteger(slideIndex)) {
      return;
    }

    stopAutoScroll();
    goToSlide(slideIndex);
  };

  const renderCarouselDots = () => {
    const slides = getActiveSlides();
    const viewName = isContentView ? "콘텐츠" : "프로젝트";

    carouselDots.replaceChildren();

    slides.forEach((slide, index) => {
      slide.setAttribute("aria-roledescription", "slide");
      slide.setAttribute("aria-label", `${viewName} ${index + 1} / ${slides.length}`);

      const dot = document.createElement("button");
      dot.className = "projects-carousel-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `${viewName} ${index + 1}번 보기`);
      dot.addEventListener("click", () => goToSlide(index));
      carouselDots.append(dot);
    });
  };

  const refreshCarousel = () => {
    renderCarouselDots();
    window.requestAnimationFrame(() => {
      updateLoopMetrics();
      goToSlide(viewIndices[getViewKey()], false);
      startAutoScroll();
    });
  };

  const updateView = () => {
    stopAutoScroll();
    projectsGrid.hidden = isContentView;
    contentGroups.hidden = !isContentView;
    toggle.setAttribute("aria-checked", String(isContentView));
    toggle.setAttribute(
      "aria-label",
      isContentView
        ? "현재 콘텐츠 정렬, 프로젝트 정렬로 전환"
        : "현재 프로젝트 정렬, 콘텐츠 정렬로 전환",
    );
    toggleLabel.textContent = isContentView ? "콘텐츠 정렬" : "프로젝트 정렬";
    refreshCarousel();
  };

  toggle.addEventListener("click", () => {
    isContentView = !isContentView;
    updateView();
  });

  previousButton.addEventListener("click", () => {
    const slides = getActiveSlides();

    if (!slides.length) {
      return;
    }

    goToSlide((viewIndices[getViewKey()] - 1 + slides.length) % slides.length);
    startAutoScroll();
  });

  nextButton.addEventListener("click", () => {
    const slides = getActiveSlides();

    if (!slides.length) {
      return;
    }

    goToSlide((viewIndices[getViewKey()] + 1) % slides.length);
    startAutoScroll();
  });

  carousel.addEventListener("mouseenter", () => {
    isCarouselHovered = true;
    stopAutoScroll();
  });

  carousel.addEventListener("mouseleave", () => {
    isCarouselHovered = false;
    startAutoScroll();
  });

  carouselViewport.addEventListener("click", (event) => {
    if (
      !(event.target instanceof Element) ||
      event.target.closest("a, button, input, select, textarea")
    ) {
      return;
    }

    centerSlideFromTarget(event.target);

    if (document.activeElement instanceof HTMLElement && carousel.contains(document.activeElement)) {
      document.activeElement.blur();
    }
  });

  carousel.addEventListener("focusin", (event) => {
    isCarouselFocused = true;
    stopAutoScroll();
    centerSlideFromTarget(event.target);
  });

  carousel.addEventListener("focusout", (event) => {
    if (event.relatedTarget instanceof Node && carousel.contains(event.relatedTarget)) {
      return;
    }

    isCarouselFocused = false;
    startAutoScroll();
  });

  carouselViewport.addEventListener("pointerdown", stopAutoScroll);
  carouselViewport.addEventListener("pointerup", startAutoScroll);
  carouselViewport.addEventListener("pointercancel", startAutoScroll);

  carouselViewport.addEventListener(
    "wheel",
    (event) => {
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

      if (Math.abs(delta) < 4) {
        return;
      }

      const direction = delta > 0 ? 1 : -1;
      const slides = getActiveSlides();
      const currentIndex = viewIndices[getViewKey()];
      const nextIndex = currentIndex + direction;

      if (nextIndex < 0 || nextIndex >= slides.length) {
        return;
      }

      event.preventDefault();

      if (wheelLocked) {
        return;
      }

      wheelLocked = true;
      goToSlide(nextIndex);
      startAutoScroll();
      window.setTimeout(() => {
        wheelLocked = false;
      }, 460);
    },
    { passive: false },
  );

  carouselViewport.addEventListener("keydown", (event) => {
    const currentIndex = viewIndices[getViewKey()];

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToSlide(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goToSlide(currentIndex + 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      goToSlide(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goToSlide(getActiveSlides().length - 1);
    }

    startAutoScroll();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  });

  prefersReducedMotion.addEventListener("change", startAutoScroll);

  const carouselObserver = new IntersectionObserver(
    ([entry]) => {
      isCarouselVisible = entry.isIntersecting;

      if (isCarouselVisible) {
        startAutoScroll();
      } else {
        stopAutoScroll();
      }
    },
    { threshold: 0.2 },
  );

  carouselObserver.observe(carousel);

  carouselViewport.addEventListener("scroll", () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(() => {
      const slides = getActiveSlides();
      const { loopDistance, slideDistance } = getActiveMetrics();
      const normalizedPosition =
        loopDistance > 0
          ? ((carouselViewport.scrollLeft % loopDistance) + loopDistance) % loopDistance
          : 0;
      const closestIndex =
        slides.length && slideDistance > 0
          ? Math.round(normalizedPosition / slideDistance) % slides.length
          : 0;

      if (viewIndices[getViewKey()] !== closestIndex) {
        viewIndices[getViewKey()] = closestIndex;
        updateCarouselUi();
      }
    });
  });

  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(() => {
      updateLoopMetrics();
      goToSlide(viewIndices[getViewKey()], false);
    });
  });

  updateView();
})();
