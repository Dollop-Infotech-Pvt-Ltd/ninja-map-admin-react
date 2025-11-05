export function restoreDocumentInteractivity(): void {
  if (typeof document === "undefined") return;

  const seen = new Set<HTMLElement>();

  const ensureInteractive = (node: Element | null | undefined) => {
    if (!node || !(node instanceof HTMLElement) || seen.has(node)) return;

    seen.add(node);

    if (node.hasAttribute("inert")) {
      node.removeAttribute("inert");
    }

    if (node.getAttribute("aria-hidden") === "true") {
      node.removeAttribute("aria-hidden");
    }

    if (node.style.pointerEvents && node.style.pointerEvents.toLowerCase() === "none") {
      node.style.pointerEvents = "";
    }
  };

  ensureInteractive(document.documentElement);
  ensureInteractive(document.body);
  ensureInteractive(document.getElementById("root"));

  document.querySelectorAll<HTMLElement>("[inert]").forEach((node) => ensureInteractive(node));
  document.querySelectorAll<HTMLElement>('[aria-hidden="true"]').forEach((node) => ensureInteractive(node));

  const portalNodes = new Set<Element>(
    Array.from(document.querySelectorAll("[data-radix-portal], [data-radix-portal-root]")),
  );

  Array.from(document.body?.children ?? []).forEach((child) => {
    if (portalNodes.has(child)) return;
    ensureInteractive(child);
  });
}

export function scheduleRestoreDocumentInteractivity(delay = 60): void {
  if (typeof window === "undefined") {
    restoreDocumentInteractivity();
    return;
  }

  window.requestAnimationFrame(() => {
    window.setTimeout(() => {
      restoreDocumentInteractivity();
    }, Math.max(delay, 0));
  });
}
