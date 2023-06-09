function UrlExists(r, e) {
  let i = "",
    n = "";
  0 === e
    ? ((i = r.href), (n = r.title))
    : 1 === e && ((i = r.src), (n = r.alt)),
    (i = (i = i.match(/index$/) ? i.replace(/index$/, "") : i).includes("%5C")
      ? i.replace(/%5C/g, "/")
      : i).match(/\.md\/$/) && (i = i.replace(/\.md\/$/, "/")),
    (i = decodeURI(i)),
    0 === e
      ? ((r.href = i),
        0 === (r.title = n).length && ((n = r.innerText), (r.title = n)))
      : 1 === e && ((r.src = i), (r.alt = n));
  var a = new XMLHttpRequest();
  a.open("GET", i, !0),
    (a.onload = function (e) {
      if ("404" != a.status) return !0;
      var t = document.createElement("div");
      (t.innerHTML = n),
        t.classList.add("not_found"),
        t.setAttribute("href", i);
      try {
        r.parentNode.replaceChild(t, r);
      } catch (e) {}
    }),
    a.send();
}
(window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: !0,
    processEnvironments: !0,
  },
  options: { ignoreHtmlClass: ".*|", processHtmlClass: "arithmatex" },
}),
  document$.subscribe(() => {
    MathJax.typesetPromise();
  });
for (
  var p_search = /\.{2}\//gi,
    ht = document.querySelectorAll("a:not(img)"),
    i = 0;
  i < ht.length;
  i++
)
  0 < !ht[i].getElementsByTagName("img").length &&
    0 < !ht[i].getElementsByTagName("svg").length &&
    (link = UrlExists(ht[i], 0));
for (
  var p_img = /\.+\\/gi, img = document.querySelectorAll("img"), i = 0;
  i < img.length;
  i++
)
  var link = UrlExists(img[i], 1);
const mkDocsChirpyTranslator = { default: "light", slate: "dark" },
  mkDocs = document.querySelector("[data-md-color-scheme]"),
  chirpy = document.querySelector("[data-chirpy-theme]");
if (chirpy) {
  "default" === mkDocs.getAttribute("data-md-color-scheme") &&
    chirpy.setAttribute("data-chirpy-theme", "light");
  const k = new MutationObserver((e) => {
    e.forEach((e) => {
      "attributes" === e.type &&
        chirpy.setAttribute(
          "data-chirpy-theme",
          mkDocsChirpyTranslator[mkDocs.dataset.mdColorScheme]
        );
    });
  });
  k.observe(mkDocs, {
    attributes: !0,
    attributeFilter: ["data-md-color-scheme"],
  });
}
const header_links = document.querySelectorAll('a[href*="#"]');
if (header_links)
  for (i = 0; i < header_links.length; i++) {
    const n = header_links[i].getAttribute("href").replace("^.*#", "");
    let e = n.replace(/\s/g, "-");
    (e = n.normalize("NFD").replace(/[\u0300-\u036f]/g, "")),
      header_links[i].setAttribute(
        "href",
        header_links[i].getAttribute("href").replace(n, e)
      );
  }
function getHeightWidth(e) {
  var t = new RegExp("\\d+x\\d+"),
    r = new RegExp("\\d+");
  return e.match(t)
    ? [parseInt(e.split("x")[0]), parseInt(e.split("x")[1])]
    : e.match(r)
    ? [parseInt(e.match(r)[0]), 0]
    : [0, 0];
}
for (
  p_img = /\.+\\/gi, img = document.querySelectorAll("img"), i = 0;
  i < img.length;
  i++
) {
  var size,
    partReg,
    regAlt = new RegExp("\\|");
  if (img[i].alt.match(regAlt)) {
    const u = img[i].alt.split("|");
    for (var part of u)
      part.match(new RegExp("\\d+", "g")) &&
        ((size = getHeightWidth(part)),
        (img[i].width = 0 < size[0] ? size[0] : img[i].width),
        (img[i].height = 0 < size[1] ? size[1] : img[i].height),
        (partReg = new RegExp("\\" + part)),
        (img[i].alt = img[i].alt.replace(partReg, "")));
  }
}
for (
  var ht = document.querySelectorAll(
      "article.md-content__inner.md-typeset > *:not(.highlight)"
    ),
    scr = /\^(.*)/gi,
    i = 0;
  i < ht.length;
  i++
) {
  const v = ht[i].innerHTML.match(scr);
  v && (ht[i].innerHTML = ht[i].innerHTML.replace(v, ""));
}
document.innerHTML = ht;
var cite = document.querySelectorAll(".citation");
if (cite)
  for (i = 0; i < cite.length; i++)
    if ((img = cite[i].innerHTML.match(/!?(\[{2}|\[).*(\]{2}|\))/gi))) {
      for (var j = 0; j < img.length; j++)
        cite[i].innerHTML = cite[i].innerHTML.replace(img[j], "");
      cite[i].innerText.trim().length < 2 && (cite[i].style.display = "none");
    }
window.onload = function () {
  var e = document.querySelector("iframe");
  if (e) {
    let t = e.contentDocument || e.contentWindow.document;
    e = document.createElement("link");
    (e.rel = "stylesheet"),
      (e.href = "css/template/utils.css"),
      (e.type = "text/css"),
      t.head.appendChild(e);
    const r = document.querySelector("[data-md-color-scheme]");
    "default" === r.getAttribute("data-md-color-scheme")
      ? t.body.setAttribute("class", "light")
      : t.body.setAttribute("class", "dark"),
      new MutationObserver((e) => {
        e.forEach((e) => {
          "attributes" === e.type &&
            t.body.setAttribute(
              "class",
              mkDocsChirpyTranslator[r.dataset.mdColorScheme]
            );
        });
      }).observe(r, {
        attributes: !0,
        attributeFilter: ["data-md-color-scheme"],
      });
  }
};
var paletteSwitcher1 = document.getElementById("__palette_1"),
  paletteSwitcher2 = document.getElementById("__palette_2");
const isMermaidPage = document.querySelector(".mermaid"),
  blogURL =
    (isMermaidPage &&
      (paletteSwitcher1.addEventListener("change", function () {
        location.reload();
      }),
      paletteSwitcher2.addEventListener("change", function () {
        location.reload();
      })),
    document.querySelector('meta[name="site_url"]')
      ? document.querySelector('meta[name="site_url"]').content
      : location.origin);
let position = ["top", "right", "bottom", "left"];
try {
  const D = tippy(`.md-content a[href^="${blogURL}"]`, {
    content: "",
    allowHTML: !0,
    animation: "scale-subtle",
    theme: "translucent",
    followCursor: !0,
    arrow: !1,
    placement: position[Math.floor(Math.random() * position.length - 1)],
    onShow(l) {
      fetch(l.reference.href)
        .then((e) => e.text())
        .then((e) => {
          e = new DOMParser().parseFromString(e, "text/html");
          let t = e.querySelector("article");
          var r = e.querySelector("h1"),
            i =
              (r &&
                "Index" === r.innerText &&
                ((a = decodeURI(e.querySelector('link[rel="canonical"]').href)
                  .split("/")
                  .filter((e) => e)
                  .pop()),
                (r.innerText = a)),
              t.querySelectorAll("img"));
          if (i)
            for (let e = 0; e < i.length; e++) {
              var n = i[e];
              (n.src = decodeURI(decodeURI(n.src))),
                (n.src = n.src.replace(location.origin, blogURL));
            }
          var r = document.querySelector('[id^="tippy"]'),
            a =
              (r && r.classList.add("tippy"),
              l.reference.href.replace(/.*#/, "#"));
          a.startsWith("#")
            ? (0 ===
                (t = (t = e.querySelector(
                  `[id="${a.replace("#", "")}"]`
                )).tagName.startsWith("H")
                  ? t.nextElementSibling
                  : t.innerText
                      .replaceAll("↩", "")
                      .replaceAll("¶", "")).innerText.replace(a).length &&
                (t = e.querySelector("div.citation")),
              (l.popper.style.height = "auto"))
            : ((r = Math.floor(t.innerText.split(" ").length / 100)) < 10 &&
                3 < r &&
                (l.popper.style.height = "50%"),
              r < 3
                ? (l.popper.style.height = "auto")
                : 10 < r && (l.popper.style.height = r - 5 + "%")),
            (l.popper.placement =
              position[Math.floor(Math.random() * position.length)]),
            0 < t.innerText.length
              ? l.setContent(t)
              : ((t = e.querySelector("article")),
                l.reference.href.replace(/.*#/, "#"));
        })
        .catch((e) => {
          console.log(e), l.hide(), l.destroy();
        });
    },
  });
} catch {
  console.log("tippy error, ignore it");
}
