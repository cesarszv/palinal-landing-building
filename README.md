# Palinal Bolivia — página temporal

Sitio estático de “Próximamente” para Palinal Bolivia. Inversiones y Desarrollos 3D (ID3D) es distribuidor oficial de Palinal en Bolivia.

La implementación conserva la composición y el contenido de la versión aprobada, sin runtime de producción, framework ni proceso de compilación.

## Vista local

Desde la raíz de este repositorio:

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Visita <http://127.0.0.1:4173/>.

## Validación

Prepara el entorno reproducible y ejecuta todos los controles:

```bash
npm ci
npm run check
```

La validación comprueba el HTML, contenido aprobado, recursos publicados, dominio, metadatos sociales, dimensiones de imágenes, transparencia y ausencia del runtime del exportador original.

## Estructura

| Ruta | Función |
|---|---|
| `index.html` | Documento semántico, contenido y metadatos. |
| `styles.css` | Traducción mantenible del diseño original y responsive. |
| `assets/` | Únicos recursos visuales publicados. |
| `scripts/validate-site.mjs` | Controles del contrato y de la publicación. |
| `specs/site/` | Intención, contrato técnico y escenarios verificables. |
| `.github/workflows/check.yml` | Validación automática de cambios. |
| `CNAME`, `robots.txt`, `sitemap.xml` | Configuración del dominio y descubrimiento. |

Los archivos de exportación, referencias y material archivado se conservan localmente y no forman parte de la publicación.

## Fuente de verdad

La implementación debe cumplir, en este orden:

1. `specs/site/spec.md` para intención y límites.
2. `specs/site/hard-spec.md` para el contrato técnico.
3. `specs/site/site.feature` para los escenarios verificables.
4. `archives/Palinal Bolivia Coming-Soon Page/Palinal Bolivia Proximamente.dc.html` para decisiones visuales no detalladas por las especificaciones.

Los cambios técnicos no deben reinterpretar el diseño ni añadir contenido.

## Publicación

GitHub Pages publica directamente la raíz de la rama `main`:

- Dominio: <https://palinal.bo/>
- Repositorio: <https://github.com/cesarszv/palinal-landing-building>
- URL del proyecto: <https://cesarszv.github.io/palinal-landing-building/>

Conserva `CNAME` y `.nojekyll` en la raíz. No se utiliza una acción de despliegue ni se generan archivos de distribución.

## Revisión previa

- [ ] `npm run check` finaliza correctamente.
- [ ] No hay desbordamiento horizontal desde 240 px ni con texto ampliado.
- [ ] La composición sigue siendo vertical y centrada.
- [ ] El email abre `mailto:sebastian@palinal.bo`.
- [ ] El contenido sigue accesible con movimiento reducido y navegación por teclado.
- [ ] No hay errores de consola ni recursos locales con respuesta 404.
