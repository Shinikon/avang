export function navigate(path) {
  window.location.hash = path;
  window.dispatchEvent(new CustomEvent("routechange", { detail: { path } }));
}

export function getCurrentPath() {
  return window.location.hash.slice(1) || "/";
}
