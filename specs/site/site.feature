# language: es
Característica: Sitio temporal de Palinal Bolivia
  Como visitante de palinal.bo
  Quiero reconocer a Palinal y saber que su sitio boliviano estará disponible próximamente
  Para identificar la marca, su distribuidor oficial y el canal de contacto

  Escenario: Presentar el contenido aprobado
    Dado que visito la página principal
    Entonces veo la marca "Palinal Bolivia"
    Y veo el mensaje "Próximamente"
    Y veo la descripción "Pinturas industriales de alta tecnología para repintado automotriz y carrocería industrial."
    Y veo "Estamos desarrollando el sitio." con el enlace "Ver el avance" hacia "https://demo.palinal.bo/"
    Y veo una lata de pintura Palinal
    Y veo "Inversiones y Desarrollos 3D (ID3D), distribuidor oficial de Palinal en Bolivia."
    Y puedo escribir a "cesarszv@palinal.bo"
    Y veo la ubicación "Santa Cruz de la Sierra, Bolivia"

  Escenario: Conservar la composición original
    Dado que la página se presenta en cualquier tamaño de pantalla compatible
    Entonces el contenido mantiene una composición vertical y centrada
    Y Palinal conserva la jerarquía visual principal
    Y la identidad de ID3D conserva una jerarquía secundaria
    Y el acceso a la demo conserva una jerarquía secundaria
    Y no veo slogans, halos ni secciones adicionales

  Escenario: Funcionar sin runtime de producción
    Dado que el navegador solicita la página
    Entonces recibe HTML y CSS estáticos
    Y el contenido no depende de JavaScript
    Y todos los recursos locales referenciados están disponibles

  Escenario: Respetar preferencias de accesibilidad
    Dado que prefiero movimiento reducido
    Cuando abro la página
    Entonces no se mantienen animaciones decorativas
    Y puedo navegar hasta el enlace de email mediante el teclado
    Y el enlace de email muestra un indicador de foco visible

  Escenario: Adaptarse a condiciones extremas
    Dado que uso una pantalla estrecha o una orientación horizontal de poca altura
    Entonces no aparece desplazamiento horizontal
    Y todo el contenido permanece disponible
    Cuando amplío el texto hasta 400%
    Entonces el contenido se reorganiza sin recortarse

  Escenario: Compartir el sitio
    Dado que adjunto la URL "https://palinal.bo/" en una plataforma compatible
    Entonces el embed usa el título "Palinal Bolivia — Próximamente"
    Y muestra una descripción breve del sitio
    Y muestra una imagen social limpia con la marca, el mensaje y el producto
