# UAECOB · Dashboard de Incidentes Bogotá D.C. 2020

Visualización interactiva con D3.js de los incidentes atendidos por la UAECOB.

## Archivos
```
uaecob_dashboard/
├── index.html    ← Estructura y paneles
├── style.css     ← Estilos (Syne + DM Sans)
├── script.js     ← D3.js: 5 gráficas interactivas
└── README.md
```

## Visualizaciones
| Gráfica | Descripción | Interactividad |
|---------|-------------|----------------|
| G3 | Incidentes por hora del día | Franja horaria, tipo área/barras |
| G4 | Tiempo de respuesta por localidad | Orden, slider de umbral |
| G8 | Estrato socioeconómico | Filtro estratos, orden |
| G9 | Causas registradas | Excluir "No aplica", barras/dona |
| G12 | Mapa coroplético rescatados | Paleta color, etiquetas |

## Despliegue en GitHub Pages

1. Sube los archivos a un repositorio en GitHub
2. Ve a **Settings → Pages**
3. En *Source*, selecciona `main` → `/root`
4. Clic en **Save**
5. Tu app estará en: `https://TU_USUARIO.github.io/NOMBRE_REPO/`

## Tecnologías
- HTML5 / CSS3 (Grid + Flexbox)
- JavaScript ES6+
- D3.js v7
- Fuentes: Syne + DM Sans (Google Fonts)

## Fuente de datos
**UAECOB** · Datos Abiertos Bogotá  
https://datosabiertos.bogota.gov.co/dataset/incidente-atendido-por-bomberos  
Periodo: Enero – Agosto 2020 · 20,228 registros

## Autores
- Juan Carlos Rojas Lizarazo
- Brayan Andres Sierra Zambrano  
Fundación Universitaria Los Libertadores · 2026
