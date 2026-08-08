# Contrato técnico del sitio temporal

## Autoridad

1. `spec.md` define la intención y los límites del producto.
2. `archives/Palinal Bolivia Coming-Soon Page/Palinal Bolivia Proximamente.dc.html` define la composición visual aprobada.
3. La implementación puede modernizar el código, pero no el diseño.

Ante una diferencia, se debe cumplir `spec.md`. Cuando `spec.md` no detalle una decisión visual, se debe reproducir la referencia archivada.

## Entrega

- Sitio estático publicado directamente desde la raíz del repositorio mediante GitHub Pages.
- HTML y CSS sin framework, bundler ni JavaScript de producción.
- Rutas relativas para que los recursos funcionen en el dominio personalizado y bajo una ruta de repositorio.
- Una sola página accesible desde `/`.

## Estructura visual

- Fondo amarillo con gradiente de `#FEE93B` a `#FBDD07` y `#F3CE00`, campos luminosos blanco y rojo, textura diagonal y marco sutil.
- Composición de una sola columna, centrada horizontal y verticalmente, con ancho máximo de `760px`.
- Orden obligatorio: wordmark y país, mensaje, producto, separador, identidad de ID3D, contacto y ubicación.
- Tipografía Nunito Sans con fallbacks Helvetica y Arial.
- El producto no debe tener halo ni contenedor decorativo adicional.
- ID3D debe usar el tamaño y peso visual secundarios de la referencia.

## Responsive

- El orden y la alineación central no deben cambiar por breakpoint.
- Tamaños y espacios deben escalar fluidamente mediante `clamp()`, `vw` y `vh`.
- El sitio no debe producir scroll horizontal a partir de `240px` de ancho.
- El contenido debe seguir siendo accesible en pantallas horizontales de poca altura y con texto ampliado hasta `400%`.
- El padding debe respetar las safe areas izquierda, derecha, superior e inferior de forma independiente.

## Accesibilidad

- Documento en español de Bolivia mediante `lang="es-BO"`.
- Un único `main` y un único `h1`.
- Texto alternativo útil para Palinal y el producto.
- El isotipo de ID3D puede ser decorativo porque la identidad aparece en texto adyacente.
- El email debe ser un enlace `mailto:` operable con teclado y con foco visible.
- Las animaciones deben desactivarse con `prefers-reduced-motion: reduce`.
- El contenido esencial debe permanecer visible en forced colors.

## Contenido y metadatos

- El contenido visible debe coincidir literalmente con `spec.md`.
- La URL canónica, Open Graph, Twitter, sitemap y CNAME deben usar `https://palinal.bo/` o `palinal.bo`, según corresponda.
- La imagen social debe medir `1200x630px`, pesar menos de `250KB` y mostrar únicamente la marca, el mensaje, la descripción y el producto de la composición aprobada.
- No se debe afirmar que ID3D es Palinal ni introducir slogans no aprobados.

## Calidad

- HTML válido y semántico.
- Todos los recursos locales referenciados deben existir.
- No deben existir en producción `script`, `x-dc`, `sc-if` ni dependencias del exportador original.
- Los PNG que requieran transparencia deben conservar canal alfa.
- Los chequeos automatizados deben ejecutarse mediante `npm run check`.
