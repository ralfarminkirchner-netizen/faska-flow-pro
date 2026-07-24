const loadImage = (src) => new Promise((resolve, reject) => {
  const image = new Image();
  image.decoding = "async";
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error(`Bild nicht verfügbar: ${src}`));
  image.src = src;
});

const pct = (value) => `${Math.round(value * 100)}%`;

export async function auditAsset(asset) {
  try {
    const image = await loadImage(asset.path);
    const scale = Math.min(1, 512 / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    const pixels = context.getImageData(0, 0, width, height).data;

    let visible = 0;
    let transparent = 0;
    let semi = 0;
    let halo = 0;
    let edgeVisible = 0;
    let edgeTotal = 0;
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const i = (y * width + x) * 4;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const alpha = pixels[i + 3];
        const onEdge = x === 0 || y === 0 || x === width - 1 || y === height - 1;
        if (onEdge) {
          edgeTotal += 1;
          if (alpha > 18) edgeVisible += 1;
        }
        if (alpha < 8) {
          transparent += 1;
          continue;
        }
        visible += 1;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        if (alpha < 247) {
          semi += 1;
          const brightness = (r + g + b) / 3;
          const saturation = Math.max(r, g, b) - Math.min(r, g, b);
          if (brightness > 218 && saturation < 34) halo += 1;
        }
      }
    }

    const total = width * height;
    const hasTransparency = transparent > total * 0.02;
    const visibleRatio = visible / total;
    const edgeRatio = edgeTotal ? edgeVisible / edgeTotal : 0;
    const haloRatio = semi ? halo / semi : 0;
    const margin = maxX < 0 ? 0 : Math.min(minX, minY, width - 1 - maxX, height - 1 - maxY);
    const notes = [];

    if (!hasTransparency) notes.push("Kein ausreichender transparenter Hintergrund erkannt.");
    if (visibleRatio < 0.035) notes.push("Motiv ist im verfügbaren Bild sehr klein.");
    if (visibleRatio > 0.82) notes.push("Motiv oder Hintergrund füllt fast die gesamte Fläche.");
    if (edgeRatio > 0.025) notes.push("Sichtbare Pixel berühren den Außenrand.");
    if (haloRatio > 0.18) notes.push("Möglicher heller Saum an halbtransparenten Kanten.");
    if (margin < 3) notes.push("Zu wenig Sicherheitsabstand zum Bildrand.");
    if (image.naturalWidth < 220 || image.naturalHeight < 220) notes.push("Auflösung ist für größere Druckformen knapp.");

    const recommendation = notes.length === 0 ? "candidate" : "rework";
    return {
      recommendation,
      humanDecisionRequired: true,
      dimensions: `${image.naturalWidth} × ${image.naturalHeight}`,
      hasTransparency,
      visibleRatio,
      edgeRatio,
      haloRatio,
      margin,
      notes,
      labels: {
        transparency: hasTransparency ? "vorhanden" : "nicht bestätigt",
        visible: pct(visibleRatio),
        edge: pct(edgeRatio),
        halo: pct(haloRatio)
      }
    };
  } catch (error) {
    return {
      recommendation: "unavailable",
      humanDecisionRequired: true,
      dimensions: "unbekannt",
      hasTransparency: false,
      visibleRatio: 0,
      edgeRatio: 1,
      haloRatio: 0,
      margin: 0,
      notes: [error instanceof Error ? error.message : "Bild konnte nicht geprüft werden."],
      labels: { transparency: "unbekannt", visible: "0%", edge: "–", halo: "–" }
    };
  }
}
