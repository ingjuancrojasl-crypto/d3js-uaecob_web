# UAECOB · Dashboard de Incidentes Bogotá D.C. 2020

Visualización interactiva con **D3.js v7** de los incidentes atendidos por la Unidad Administrativa Especial Cuerpo Oficial de Bomberos de Bogotá durante enero–agosto de 2020.

## Estructura del proyecto

```
d3js-uaecob_web/
├── index.html                                        ← Estructura y paneles
├── css/
│   └── styles.css                                    ← Estilos (DM Serif Display + DM Sans + DM Mono)
├── js/
│   └── charts.js                                     ← D3.js v7 · 5 gráficas interactivas
├── incidentes-atendidos-por-uaecob-corte-31-agosto-2020.csv
└── README.md
```

> ⚠️ **Importante:** la estructura de carpetas debe respetarse exactamente como se muestra. El `index.html` busca los archivos en las rutas `css/styles.css` y `js/charts.js`. El CSV debe estar en la raíz del proyecto.

## Visualizaciones

| Gráfica | Descripción                          | Interactividad                              |
|---------|--------------------------------------|---------------------------------------------|
| **G3**  | Incidentes por hora del día          | Curva con área, tooltip por hora, pico destacado |
| **G4**  | Tiempo de respuesta por localidad    | Línea con puntos verde/rojo según umbral 9 min |
| **G8**  | Incidentes por estrato socioeconómico | Barras verticales con color por nivel       |
| **G9**  | Causas registradas                   | Toggle entre **Barras horizontales** y **Dona** |
| **G12** | Mapa coroplético — Rescatados        | Polígonos de las 20 localidades + ranking lateral |

Cada gráfica incluye un panel de análisis con 4 tarjetas: **Contexto · Análisis · Interpretación · Conclusión**.

## Funcionalidades

- ✅ Carga automática del CSV desde la carpeta del proyecto
- ✅ Sidebar con KPIs rápidos y navegación entre las 5 gráficas
- ✅ Sección "Acerca del dataset" con metadatos del proyecto
- ✅ Indicador visual del estado de carga del CSV
- ✅ Tooltips interactivos con valores exactos
- ✅ Diseño responsivo (grid + flexbox)
- ✅ Selector de tipo de gráfica en G9 (barras / dona)
- ✅ Mapa de Bogotá con polígonos oficiales de las localidades

## Cómo ejecutar localmente

**Opción 1 — Live Server (recomendado):**

1. Instala la extensión **Live Server** de Ritwick Dey en Visual Studio Code
2. Abre la carpeta del proyecto en VS Code
3. Clic derecho sobre `index.html` → **Open with Live Server**
4. La página abre en `http://127.0.0.1:5500` y carga el CSV automáticamente

**Opción 2 — Servidor Python:**

```bash
cd d3js-uaecob_web
python -m http.server 8000
```

Luego abre `http://localhost:8000` en el navegador.

> ⚠️ Si abres el `index.html` con doble clic, el navegador puede bloquear la lectura del CSV local por restricciones CORS. Usa siempre un servidor.

## Despliegue en GitHub Pages

1. Sube todos los archivos a un repositorio en GitHub respetando la estructura de carpetas
2. Entra a **Settings → Pages**
3. En *Source* selecciona **Deploy from a branch**
4. En *Branch* selecciona **main** y carpeta **/ (root)**
5. Clic en **Save**
6. En 1–2 minutos tu app estará disponible en:
   `https://TU_USUARIO.github.io/NOMBRE_REPO/`

## Tecnologías

- **Visualización:** D3.js v7
- **Lenguaje:** JavaScript ES6+
- **Estilos:** CSS3 (Grid + Flexbox)
- **Tipografías:** DM Serif Display + DM Sans + DM Mono (Google Fonts)
- **Despliegue:** GitHub Pages / Live Server

## Fuente de datos

**UAECOB** · [Datos Abiertos Bogotá](https://datosabiertos.bogota.gov.co/dataset/incidente-atendido-por-bomberos)

- **Periodo:** Enero – Agosto 2020
- **Registros:** 20.228
- **Corte:** 31 de agosto de 2020

## Autores

- **Juan Carlos Rojas Lizarazo** — Fundación Universitaria Los Libertadores
- **Brayan Andrés Sierra Zambrano** — Fundación Universitaria Los Libertadores

*Herramientas y Visualización de Datos · 2026*
