(() => {
  const toggle = document.querySelector(".projects-sort-toggle");
  const toggleLabel = document.querySelector(".projects-sort-toggle-label");
  const projectsGrid = document.querySelector("#projects-grid");
  const contentGroups = document.querySelector("#content-groups");

  if (!toggle || !toggleLabel || !projectsGrid || !contentGroups) {
    return;
  }

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

  let isContentView = false;

  const updateView = () => {
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
  };

  toggle.addEventListener("click", () => {
    isContentView = !isContentView;
    updateView();
  });

  updateView();
})();
