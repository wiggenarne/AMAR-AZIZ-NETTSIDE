import React from "react";
import { VisualEditing, type HistoryUpdate } from "@sanity/visual-editing/react";

type HistoryNavigate = Parameters<
  NonNullable<React.ComponentProps<typeof VisualEditing>["history"]>["subscribe"]
>[0];

function getPresentationUrl(location: {
  pathname: string;
  search: string;
  hash: string;
}): string {
  return `${location.pathname}${location.search}${location.hash}`;
}

function applyPresentationHistoryUpdate(
  update: Pick<HistoryUpdate, "type" | "url">,
  currentHref: string,
  navigate: { assign: (url: string) => void; replace: (url: string) => void; back: () => void },
): void {
  switch (update.type) {
    case "push":
      if (currentHref !== update.url) navigate.assign(update.url);
      return;
    case "replace":
      if (currentHref !== update.url) navigate.replace(update.url);
      return;
    case "pop":
      navigate.back();
      return;
  }
}

export default function ConditionalVisualEditing() {
  const [inFrame, setInFrame] = React.useState(false);
  const navigateRef = React.useRef<HistoryNavigate | undefined>();
  const lastUrlRef = React.useRef("");
  const lastPublishedAtRef = React.useRef(0);
  const optimisticUrlRef = React.useRef<string | undefined>();
  const optimisticUntilRef = React.useRef(0);
  const clearNavigateTimeoutRef = React.useRef<number | undefined>();

  // Detect iframe context once on mount; set up URL-sync only when in iframe.
  React.useEffect(() => {
    let isInFrame = false;
    try {
      isInFrame = window.self !== window.top;
    } catch {
      isInFrame = true; // cross-origin frame — assume we're inside Studio
    }
    if (!isInFrame) return;

    setInFrame(true);

    const publishUrl = (url: string, force = false) => {
      const navigate = navigateRef.current;
      if (!navigate) return;
      const now = Date.now();
      const optimisticUrl = optimisticUrlRef.current;
      const optimisticWindowOpen = now < optimisticUntilRef.current;
      if (!force && optimisticUrl && optimisticWindowOpen && url !== optimisticUrl) return;
      if (optimisticUrl && url === optimisticUrl) {
        optimisticUrlRef.current = undefined;
        optimisticUntilRef.current = 0;
      }
      if (!force && url === lastUrlRef.current) return;
      lastUrlRef.current = url;
      lastPublishedAtRef.current = now;
      navigate({ type: "push", title: document.title, url });
    };

    const syncCurrentUrl = () => publishUrl(getPresentationUrl(window.location));

    const publishClickedLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const eventTarget = event.target;
      if (!(eventTarget instanceof Element)) return;
      const anchor = eventTarget.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      let targetUrl: URL;
      try {
        targetUrl = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (targetUrl.origin !== window.location.origin) return;
      const url = `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
      optimisticUrlRef.current = url;
      optimisticUntilRef.current = Date.now() + 1_500;
      publishUrl(url, true);
    };

    syncCurrentUrl();
    window.addEventListener("popstate", syncCurrentUrl);
    window.addEventListener("hashchange", syncCurrentUrl);
    document.addEventListener("click", publishClickedLink, true);
    const nativePushState = window.history.pushState;
    const nativeReplaceState = window.history.replaceState;
    window.history.pushState = function (...args) {
      nativePushState.apply(window.history, args);
      syncCurrentUrl();
    };
    window.history.replaceState = function (...args) {
      nativeReplaceState.apply(window.history, args);
      syncCurrentUrl();
    };

    return () => {
      window.removeEventListener("popstate", syncCurrentUrl);
      window.removeEventListener("hashchange", syncCurrentUrl);
      document.removeEventListener("click", publishClickedLink, true);
      window.history.pushState = nativePushState;
      window.history.replaceState = nativeReplaceState;
    };
  }, []);

  const history = React.useMemo(
    () => ({
      subscribe: (_navigate: HistoryNavigate) => {
        window.clearTimeout(clearNavigateTimeoutRef.current);
        navigateRef.current = _navigate;
        const currentUrl = getPresentationUrl(window.location);
        lastUrlRef.current = currentUrl;
        lastPublishedAtRef.current = Date.now();
        return () => {
          clearNavigateTimeoutRef.current = window.setTimeout(() => {
            if (navigateRef.current === _navigate) navigateRef.current = undefined;
          }, 200);
        };
      },
      update: (update: HistoryUpdate) => {
        applyPresentationHistoryUpdate(update, window.location.href, {
          assign: (url) => window.location.assign(url),
          replace: (url) => window.location.replace(url),
          back: () => window.history.back(),
        });
      },
    }),
    [],
  );

  if (!inFrame) return null;

  return (
    <VisualEditing
      portal
      history={history}
      refresh={() =>
        new Promise((resolve) => {
          window.location.reload();
          resolve();
        })
      }
    />
  );
}
