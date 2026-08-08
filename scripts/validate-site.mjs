import { access, readFile, readdir } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(resolve(root, "index.html"), "utf8");
const css = await readFile(resolve(root, "styles.css"), "utf8");
const failures = [];

const requireMatch = (source, pattern, message) => {
  if (!pattern.test(source)) failures.push(message);
};

const requireCount = (source, pattern, expected, message) => {
  if ([...source.matchAll(pattern)].length !== expected) failures.push(message);
};

const voidElements = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);
const openElements = [];

for (const match of html.matchAll(/<\/?([a-z][\w-]*)(?:\s[^<>]*?)?\s*\/?>/gi)) {
  const element = match[1].toLowerCase();
  const closing = match[0].startsWith("</");

  if (closing) {
    const openElement = openElements.pop();
    if (openElement !== element) {
      failures.push(`Cierre HTML inválido: se esperaba </${openElement}> y se encontró </${element}>.`);
      break;
    }
  } else if (!voidElements.has(element) && !match[0].endsWith("/>")) {
    openElements.push(element);
  }
}

if (openElements.length > 0) {
  failures.push(`Faltan cierres HTML para: ${openElements.join(", ")}.`);
}

requireMatch(html, /^<!doctype html>/i, "Falta el doctype HTML.");
requireCount(html, /<html[\s>]/gi, 1, "Debe existir un único elemento html.");
requireCount(html, /<head[\s>]/gi, 1, "Debe existir un único elemento head.");
requireCount(html, /<body[\s>]/gi, 1, "Debe existir un único elemento body.");
requireMatch(html, /<html\s+lang="es-BO">/i, 'Falta lang="es-BO".');
requireMatch(
  html,
  /<meta\s+name="viewport"\s+content="width=device-width, initial-scale=1, viewport-fit=cover"/i,
  "El viewport no contempla dispositivos con safe areas.",
);
requireMatch(
  html,
  /<title>Palinal Bolivia — Próximamente<\/title>/i,
  "El título del documento no coincide con la especificación.",
);
requireMatch(
  html,
  /<meta\s+name="description"\s+content="Pinturas industriales de alta tecnología para repintado automotriz y carrocería industrial\. Palinal Bolivia, próximamente\."/i,
  "La descripción no coincide con el contenido aprobado.",
);
requireMatch(
  html,
  /<link\s+rel="canonical"\s+href="https:\/\/palinal\.bo\/"\s*\/?>/i,
  "La URL canónica no es https://palinal.bo/.",
);
requireCount(html, /<main[\s>]/gi, 1, "Debe existir un único elemento main.");
requireCount(html, /<h1[\s>]/gi, 1, "Debe existir un único encabezado h1.");
requireMatch(
  html,
  /<section\s+class="content"\s+aria-labelledby="page-title">/i,
  "El contenido principal no está asociado con su encabezado.",
);
requireCount(html, /\sid="page-title"/gi, 1, 'Debe existir un único id="page-title".');
requireMatch(
  html,
  /href="mailto:sistemas@palinal\.bo"/i,
  "El contacto no apunta a sistemas@palinal.bo.",
);

const body = html.match(/<body[\s\S]*?<\/body>/i)?.[0] ?? "";
const visibleText = body
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const requiredCopy = [
  "Próximamente",
  "Pinturas industriales de alta tecnología para repintado automotriz y carrocería industrial.",
  "Inversiones y Desarrollos 3D (ID3D), distribuidor oficial de Palinal en Bolivia.",
  "sistemas@palinal.bo",
  "Santa Cruz de la Sierra, Bolivia",
];

const expectedVisibleText = [
  "Bolivia",
  ...requiredCopy,
].join(" ");

if (visibleText !== expectedVisibleText) {
  failures.push("El contenido visible o su orden no coincide con la especificación.");
}

for (const copy of requiredCopy) {
  if (!visibleText.includes(copy)) failures.push(`Falta el contenido: ${copy}`);
}

requireMatch(html, /alt="Palinal"/i, "El wordmark no identifica a Palinal.");
requireMatch(body, />\s*Bolivia\s*</i, "Falta la identificación Palinal Bolivia.");
requireMatch(
  body,
  /<img\s+[\s\S]*?src="assets\/palinal-lata\.png"[\s\S]*?alt="Lata de pintura Palinal"/i,
  "Falta el producto Palinal aprobado.",
);

const orderedFragments = [
  'src="assets/palinal-wordmark.png"',
  'id="page-title"',
  "Pinturas industriales de alta tecnología",
  'src="assets/palinal-lata.png"',
  "Inversiones y Desarrollos 3D (ID3D)",
  'href="mailto:sistemas@palinal.bo"',
];
let previousPosition = -1;

for (const fragment of orderedFragments) {
  const position = body.indexOf(fragment, previousPosition + 1);
  if (position === -1) {
    failures.push("El orden estructural no coincide con la composición aprobada.");
    break;
  }
  previousPosition = position;
}

if (/<script[\s>]|<\/?(?:x-dc|sc-if|helmet)[\s>]/i.test(html)) {
  failures.push("La página no debe depender del runtime del exportador original.");
}

if (/El color que transforma|>\s*Contactar\s*<|hero__eyebrow|contact-button|product__halo/i.test(html)) {
  failures.push("La página contiene elementos del rediseño no aprobado.");
}

if (/grid-template-columns|product__halo|contact-button|hero__eyebrow/i.test(css)) {
  failures.push("Los estilos contienen decisiones del hero de dos columnas.");
}

requireMatch(
  css,
  /\.page\s*{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*align-items:\s*center;[^}]*justify-content:\s*center;/i,
  "La página debe conservar una composición vertical y centrada.",
);
requireMatch(
  css,
  /@media\s*\(prefers-reduced-motion:\s*reduce\)/i,
  "Falta la adaptación para movimiento reducido.",
);
requireMatch(css, /:focus-visible/i, "Falta un indicador de foco visible.");
requireMatch(
  css,
  /animation:\s*none\s*!important/i,
  "Movimiento reducido debe eliminar las animaciones y sus demoras.",
);
requireMatch(
  css,
  /@media\s*\(forced-colors:\s*active\)/i,
  "Falta la adaptación para forced colors.",
);
requireMatch(
  html,
  /<meta\s+property="og:image:type"\s+content="image\/jpeg"/i,
  "Falta declarar el tipo de la imagen social.",
);
requireMatch(
  html,
  /<meta\s+name="twitter:image:alt"\s+content="Palinal Bolivia — Próximamente"/i,
  "Falta el texto alternativo de la imagen social para Twitter.",
);

const htmlReferences = [...html.matchAll(/\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi)].map(
  (match) => match[2],
);
const cssReferences = [...css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)].map(
  (match) => match[2],
);
const localReferences = [...htmlReferences, ...cssReferences]
  .filter((value) => !/^(?:https?:|mailto:|tel:|data:|#)/i.test(value))
  .map((value) => value.split(/[?#]/, 1)[0]);

for (const reference of new Set(localReferences)) {
  const target = resolve(root, reference);
  if (target !== root && !target.startsWith(`${root}${sep}`)) {
    failures.push(`La referencia sale de la raíz publicada: ${reference}`);
    continue;
  }

  try {
    await access(target, constants.R_OK);
  } catch {
    failures.push(`No existe el recurso local: ${reference}`);
  }
}

const cname = (await readFile(resolve(root, "CNAME"), "utf8")).trim();
const robots = await readFile(resolve(root, "robots.txt"), "utf8");
const sitemap = await readFile(resolve(root, "sitemap.xml"), "utf8");

if (cname !== "palinal.bo") failures.push("CNAME debe contener palinal.bo.");
requireMatch(
  robots,
  /Sitemap:\s+https:\/\/palinal\.bo\/sitemap\.xml/i,
  "robots.txt no referencia el sitemap canónico.",
);
requireMatch(
  sitemap,
  /<loc>https:\/\/palinal\.bo\/<\/loc>/i,
  "sitemap.xml no contiene la URL canónica.",
);

const readJpegDimensions = (buffer) => {
  if (buffer.length < 4 || buffer.readUInt16BE(0) !== 0xffd8) return null;

  const startOfFrameMarkers = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce,
    0xcf,
  ]);
  let offset = 2;

  while (offset + 8 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    offset += 2;

    if (startOfFrameMarkers.has(marker)) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5),
      };
    }

    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 2 > buffer.length) return null;

    const segmentLength = buffer.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > buffer.length) return null;
    offset += segmentLength;
  }

  return null;
};

const readPngMetadata = (buffer) => {
  const signature = "89504e470d0a1a0a";
  if (buffer.length < 26 || buffer.subarray(0, 8).toString("hex") !== signature) {
    return null;
  }

  const colorType = buffer[25];
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    hasAlpha: colorType === 4 || colorType === 6 || buffer.includes("tRNS"),
  };
};

const socialPreview = await readFile(resolve(root, "assets/social-preview.jpg"));
const previewDimensions = readJpegDimensions(socialPreview);
if (previewDimensions?.width !== 1200 || previewDimensions?.height !== 630) {
  failures.push("La vista social debe medir 1200x630 px.");
}
if (socialPreview.length > 250_000) {
  failures.push("La vista social supera el presupuesto de 250 KB.");
}

const expectedPngs = [
  ["assets/palinal-wordmark.png", 940, 223, true],
  ["assets/palinal-lata.png", 285, 402, true],
  ["assets/id3d-isotype.png", 128, 128, true],
];

for (const [path, minimumWidth, minimumHeight, requireAlpha] of expectedPngs) {
  const image = await readFile(resolve(root, path));
  const metadata = readPngMetadata(image);
  if (!metadata) {
    failures.push(`${path} no es un PNG válido.`);
    continue;
  }
  if (metadata.width < minimumWidth || metadata.height < minimumHeight) {
    failures.push(`${path} no tiene resolución suficiente.`);
  }
  if (requireAlpha && !metadata.hasAlpha) {
    failures.push(`${path} debe conservar transparencia.`);
  }
  if (path === "assets/id3d-isotype.png" && image.length > 50_000) {
    failures.push("El isotipo de ID3D supera el presupuesto de 50 KB.");
  }
}

const publishedAssets = (await readdir(resolve(root, "assets")))
  .filter((name) => !name.startsWith("."))
  .sort();
const expectedAssets = [
  "id3d-isotype.png",
  "palinal-lata.png",
  "palinal-wordmark.png",
  "social-preview.jpg",
].sort();

if (publishedAssets.join("\n") !== expectedAssets.join("\n")) {
  failures.push("assets/ contiene archivos no utilizados o faltantes.");
}

if (failures.length > 0) {
  console.error("Validación fallida:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Sitio válido: ${new Set(localReferences).size} recursos locales y ${publishedAssets.length} activos comprobados.`,
  );
}
