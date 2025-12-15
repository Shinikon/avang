export function el(tag, props = {}, ...children) {
  const e = document.createElement(tag);

  if (typeof props === "string") {
    e.textContent = props;
  } else {
    for (const [key, value] of Object.entries(props)) {
      if (key.startsWith("on")) {
        e.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === "className") {
        e.className = value;
      } else if (key in e) {
        e[key] = value;
      } else {
        e.setAttribute(key, value);
      }
    }
  }

  for (const child of children.flat()) {
    if (child) e.appendChild(child);
  }

  return e;
}

export function createSelect(id, options) {
  return el(
    "select",
    { id },
    options.map((opt) =>
      el("option", { value: opt.value || "" }, opt.label || opt)
    )
  );
}
