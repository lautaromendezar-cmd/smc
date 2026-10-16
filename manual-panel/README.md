# Manual del panel (para Alfredo)

- `Manual-panel-SMC.pdf`: el manual listo para mandar.
- `manual.html` + `img/`: la fuente. Las capturas se sacaron el 16/10/2026 entrando al panel con la cuenta de Alfredo (info@).
- Regenerar el PDF (Playwright reutilizado de fosque):

```bash
NODE_PATH="C:/Users/Lautaro/Desktop/Claude/fosque/site/node_modules" node manual-panel/generar-pdf.js manual-panel/manual.html manual-panel/Manual-panel-SMC.pdf
```

Versión online editable (Claude Docs): https://claude.ai/code/artifact/ab8b28c1-53fc-4e7a-8bec-426798f672f4
