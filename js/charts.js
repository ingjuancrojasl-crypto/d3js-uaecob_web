/* ════════════════════════════════════════════════════════════
   UAECOB · Estudio Visual · Bogotá 2020
   Archivo: js/charts.js
   Carga el CSV desde la misma carpeta y dibuja las 5 gráficas.
════════════════════════════════════════════════════════════ */

/* ── Paleta ─────────────────────────────────────────────── */
const C = {
  blue:    '#264ca3', blue2:    '#4a72d4', blueLt:  '#bdd3f8',
  red:     '#c84b31', red2:     '#e8673e',
  teal:    '#2a9d8f', tealLt:   '#b2e6e0',
  gold:    '#c8923a', goldLt:   '#fce8c4',
  green:   '#2d7a4f', greenLt:  '#c3ead4',
  purple:  '#7c3abf', purpleLt: '#e8d8f8',
  ink:     '#1c1f2e', ink2:     '#4a4e63', ink3: '#9095ab',
  gridLn:  'rgba(0,0,0,0.07)',
};

/* ── Tooltip helpers ────────────────────────────────────── */
const tip = document.getElementById('tooltip');
function showTip(e, html) {
  tip.innerHTML = html;
  tip.style.display = 'block';
  moveTip(e);
}
function moveTip(e) {
  tip.style.left = (e.clientX + 16) + 'px';
  tip.style.top  = (e.clientY - 38) + 'px';
}
function hideTip() { tip.style.display = 'none'; }

/* ── Formato numérico ───────────────────────────────────── */
const fmt = n => (+n).toLocaleString('es-CO');

/* ── Quitar tildes ──────────────────────────────────────── */
function quitarTildes(s) {
  return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
}

/* ════════════════════════════════════════════════════════════
   GEOJSON · Polígonos simplificados de las 20 localidades
   Fuente: Secretaría Distrital de Planeación / IDECA
   Formato GeoJSON Feature[] con coordenadas [lon, lat]
════════════════════════════════════════════════════════════ */
const LOCALIDADES_GEO = [
  { type:'Feature', properties:{name:'USAQUEN'}, geometry:{type:'Polygon',
    coordinates:[[[-74.0467,4.7563],[-74.0007,4.7534],[-73.9978,4.7008],
      [-74.0149,4.6683],[-74.0508,4.6635],[-74.0622,4.6941],
      [-74.0505,4.7294],[-74.0467,4.7563]]]}},
  { type:'Feature', properties:{name:'CHAPINERO'}, geometry:{type:'Polygon',
    coordinates:[[[-74.0508,4.6934],[-74.0149,4.6683],[-74.0471,4.6317],
      [-74.0595,4.6185],[-74.0807,4.6295],[-74.0776,4.6529],
      [-74.0508,4.6934]]]}},
  { type:'Feature', properties:{name:'SANTA FE'}, geometry:{type:'Polygon',
    coordinates:[[[-74.0807,4.6295],[-74.0595,4.6185],[-74.0716,4.5862],
      [-74.0944,4.5802],[-74.0993,4.5969],[-74.0980,4.6144],
      [-74.0807,4.6295]]]}},
  { type:'Feature', properties:{name:'SAN CRISTOBAL'}, geometry:{type:'Polygon',
    coordinates:[[[-74.0993,4.5969],[-74.0944,4.5802],[-74.0816,4.5534],
      [-74.1028,4.5230],[-74.1231,4.5395],[-74.1068,4.5689],
      [-74.1063,4.5876],[-74.0993,4.5969]]]}},
  { type:'Feature', properties:{name:'USME'}, geometry:{type:'Polygon',
    coordinates:[[[-74.1231,4.5395],[-74.1028,4.5230],[-74.1117,4.4929],
      [-74.1421,4.4417],[-74.1817,4.4237],[-74.2028,4.4691],
      [-74.1634,4.5197],[-74.1231,4.5395]]]}},
  { type:'Feature', properties:{name:'TUNJUELITO'}, geometry:{type:'Polygon',
    coordinates:[[[-74.1063,4.5876],[-74.1068,4.5689],[-74.1185,4.5534],
      [-74.1407,4.5486],[-74.1456,4.5642],[-74.1325,4.5823],
      [-74.1063,4.5876]]]}},
  { type:'Feature', properties:{name:'BOSA'}, geometry:{type:'Polygon',
    coordinates:[[[-74.1567,4.6457],[-74.1697,4.6338],[-74.1879,4.6027],
      [-74.2073,4.5941],[-74.2162,4.6072],[-74.2013,4.6326],
      [-74.1873,4.6567],[-74.1694,4.6592],[-74.1567,4.6457]]]}},
  { type:'Feature', properties:{name:'KENNEDY'}, geometry:{type:'Polygon',
    coordinates:[[[-74.1694,4.6592],[-74.1873,4.6567],[-74.2013,4.6326],
      [-74.2162,4.6072],[-74.2073,4.5941],[-74.1921,4.5823],
      [-74.1325,4.5823],[-74.1337,4.6135],[-74.1567,4.6457],
      [-74.1694,4.6592]]]}},
  { type:'Feature', properties:{name:'FONTIBON'}, geometry:{type:'Polygon',
    coordinates:[[[-74.1095,4.7003],[-74.1046,4.6916],[-74.1694,4.6592],
      [-74.1567,4.6457],[-74.1337,4.6135],[-74.1299,4.6071],
      [-74.1199,4.6338],[-74.1072,4.6634],[-74.1029,4.6896],
      [-74.1095,4.7003]]]}},
  { type:'Feature', properties:{name:'ENGATIVA'}, geometry:{type:'Polygon',
    coordinates:[[[-74.0505,4.7294],[-74.0622,4.6941],[-74.0855,4.6677],
      [-74.0942,4.6520],[-74.1197,4.6338],[-74.1072,4.6634],
      [-74.1029,4.6896],[-74.1095,4.7003],[-74.1021,4.7294],
      [-74.0789,4.7422],[-74.0505,4.7294]]]}},
  { type:'Feature', properties:{name:'SUBA'}, geometry:{type:'Polygon',
    coordinates:[[[-74.0007,4.7534],[-74.0467,4.7563],[-74.0505,4.7294],
      [-74.0789,4.7422],[-74.1021,4.7294],[-74.1095,4.7003],
      [-74.1107,4.7362],[-74.1034,4.7601],[-74.0791,4.7715],
      [-74.0389,4.7757],[-74.0007,4.7534]]]}},
  { type:'Feature', properties:{name:'BARRIOS UNIDOS'}, geometry:{type:'Polygon',
    coordinates:[[[-74.0622,4.6941],[-74.0855,4.6677],[-74.0942,4.6520],
      [-74.0776,4.6529],[-74.0686,4.6574],[-74.0583,4.6741],
      [-74.0622,4.6941]]]}},
  { type:'Feature', properties:{name:'TEUSAQUILLO'}, geometry:{type:'Polygon',
    coordinates:[[[-74.0855,4.6677],[-74.0776,4.6529],[-74.0807,4.6295],
      [-74.0980,4.6144],[-74.1138,4.6188],[-74.1197,4.6338],
      [-74.0942,4.6520],[-74.0855,4.6677]]]}},
  { type:'Feature', properties:{name:'LOS MARTIRES'}, geometry:{type:'Polygon',
    coordinates:[[[-74.0807,4.6295],[-74.0980,4.6144],[-74.0993,4.5969],
      [-74.1112,4.5969],[-74.1113,4.6071],[-74.1138,4.6188],
      [-74.0807,4.6295]]]}},
  { type:'Feature', properties:{name:'ANTONIO NARINO'}, geometry:{type:'Polygon',
    coordinates:[[[-74.0993,4.5969],[-74.1063,4.5876],[-74.1325,4.5823],
      [-74.1337,4.5853],[-74.1113,4.6071],[-74.0993,4.5969]]]}},
  { type:'Feature', properties:{name:'PUENTE ARANDA'}, geometry:{type:'Polygon',
    coordinates:[[[-74.1197,4.6338],[-74.1138,4.6188],[-74.1113,4.6071],
      [-74.1337,4.5853],[-74.1325,4.5823],[-74.1337,4.6135],
      [-74.1299,4.6071],[-74.1199,4.6338],[-74.1197,4.6338]]]}},
  { type:'Feature', properties:{name:'LA CANDELARIA'}, geometry:{type:'Polygon',
    coordinates:[[[-74.0980,4.6144],[-74.0993,4.5969],[-74.0944,4.5802],
      [-74.0716,4.5862],[-74.0711,4.6008],[-74.0980,4.6144]]]}},
  { type:'Feature', properties:{name:'RAFAEL URIBE URIBE'}, geometry:{type:'Polygon',
    coordinates:[[[-74.1063,4.5876],[-74.1068,4.5689],[-74.1231,4.5395],
      [-74.1634,4.5197],[-74.1407,4.5486],[-74.1456,4.5642],
      [-74.1325,4.5823],[-74.1337,4.5853],[-74.1063,4.5876]]]}},
  { type:'Feature', properties:{name:'CIUDAD BOLIVAR'}, geometry:{type:'Polygon',
    coordinates:[[[-74.1921,4.5823],[-74.2073,4.5941],[-74.1407,4.5486],
      [-74.1634,4.5197],[-74.2028,4.4691],[-74.2421,4.4534],
      [-74.2342,4.5120],[-74.2089,4.5534],[-74.1921,4.5823]]]}},
];

/* ── Unificar localidad ─────────────────────────────────── */
function unificarLoc(s) {
  if (!s) return null;
  s = s.trim();
  const partes = s.split(' ');
  if (partes[0].match(/^\d+$/) && partes.length > 1) {
    return partes.slice(1).join(' ').toUpperCase();
  }
  return s.toUpperCase();
}

/* ════════════════════════════════════════════════════════════
   CARGA DEL CSV (desde la carpeta del proyecto)
════════════════════════════════════════════════════════════ */
function cargarCSV() {
  const archivoCSV = 'incidentes-atendidos-por-uaecob-corte-31-agosto-2020.csv';

  setEstadoCSV('cargando', 'Cargando CSV...', 'Leyendo archivo de la carpeta');

  d3.text(archivoCSV)
    .then(raw => {
      const data = d3.dsvFormat(';').parse(raw);
      if (!data || data.length === 0) throw new Error('Archivo vacío');
      setEstadoCSV('ok', `${fmt(data.length)} registros cargados`, 'Datos del CSV procesados');
      procesarCSV(data);
    })
    .catch(err => {
      console.error('Error cargando CSV:', err);
      setEstadoCSV('err', 'Error al cargar CSV', 'Coloque el archivo en esta carpeta');

      // Mensaje claro al usuario
      mostrarMensajeError(archivoCSV);
    });
}

function setEstadoCSV(tipo, label, sub) {
  const status = document.getElementById('csv-status');
  status.classList.remove('ok','err');
  if (tipo === 'ok')  status.classList.add('ok');
  if (tipo === 'err') status.classList.add('err');
  document.getElementById('csv-label').textContent = label;
  document.getElementById('csv-sub').textContent   = sub;
}

function mostrarMensajeError(archivoCSV) {
  document.querySelectorAll('.chart-body').forEach(cb => {
    cb.innerHTML = `
      <div style="text-align:center; padding:40px 20px; color:#9095ab; font-family:'DM Sans'">
        <div style="font-size:40px; margin-bottom:12px">📁</div>
        <div style="font-size:16px; color:#1c1f2e; font-weight:600; margin-bottom:8px">
          No se encontró el archivo CSV
        </div>
        <div style="font-size:13px; line-height:1.6; max-width:520px; margin:0 auto">
          Para visualizar los datos, coloque el archivo
          <br><code style="background:#fff8ed; color:#c8923a; padding:3px 8px; border-radius:4px; font-family:'DM Mono'; font-size:11.5px">
            ${archivoCSV}
          </code>
          <br>en la misma carpeta que <code style="background:#eef4ff; color:#264ca3; padding:3px 8px; border-radius:4px; font-family:'DM Mono'; font-size:11.5px">index.html</code>
          y recargue la página.
        </div>
        <div style="margin-top:16px; font-size:11px; color:#9095ab">
          Si abre el HTML directamente con doble clic, puede que el navegador bloquee la lectura del archivo local.<br>
          Recomendado: usar la extensión <strong>Live Server</strong> de Visual Studio Code.
        </div>
      </div>
    `;
  });
}

/* ════════════════════════════════════════════════════════════
   PROCESAR CSV → GENERAR DATASETS DE LAS 5 GRÁFICAS
════════════════════════════════════════════════════════════ */
function procesarCSV(rows) {
  /* ── G3: Incidentes por hora ── */
  const horaRollup = d3.rollup(rows,
    v => v.length,
    d => {
      const t = (d['Hora reporte'] || '').split(':');
      return t.length >= 2 ? +t[0] : null;
    });
  const g3 = d3.range(24).map(h => ({
    h: h, lbl: h + 'h', v: horaRollup.get(h) || 0
  }));

  /* ── G4: Tiempo de respuesta mediano por localidad ── */
  const parseTR = s => {
    if (!s) return NaN;
    const p = s.trim().split(':');
    if (p.length < 2) return NaN;
    const m = +p[0]*60 + +p[1] + (+p[2]||0)/60;
    return m > 0 && m <= 120 ? m : NaN;
  };

  // Top 20 localidades por volumen
  const locCount = d3.rollup(rows, v => v.length, d => unificarLoc(d['LOCALIDAD']));
  const topLoc = Array.from(locCount.entries())
    .sort((a,b) => b[1] - a[1]).slice(0,20).map(d => d[0]);

  const trPorLoc = d3.rollup(rows.filter(d => topLoc.includes(unificarLoc(d['LOCALIDAD']))),
    v => {
      const tiempos = v.map(r => parseTR(r['Tiempo de Respuesta'])).filter(x => !isNaN(x));
      return tiempos.length > 0 ? d3.median(tiempos) : NaN;
    },
    d => unificarLoc(d['LOCALIDAD']));

  const g4 = Array.from(trPorLoc.entries())
    .filter(([_, v]) => !isNaN(v))
    .map(([loc, val]) => ({ loc: loc, v: Math.round(val * 10) / 10 }))
    .sort((a,b) => a.v - b.v);

  /* ── G8: Por estrato ── */
  const estMap = new Map();
  rows.forEach(d => {
    const e = (d['ESTRATO'] || '').trim();
    const n = +e;
    let key;
    if (e === '' || e === 'NaN') key = 'Sin datos';
    else if (!isNaN(n) && n >= 1 && n <= 6) key = `Estrato ${n}`;
    else key = e;
    estMap.set(key, (estMap.get(key) || 0) + 1);
  });
  const g8 = Array.from(estMap, ([est, val]) => ({ est: est, v: val }))
    .sort((a, b) => {
      const aN = +a.est.replace('Estrato ','');
      const bN = +b.est.replace('Estrato ','');
      if (!isNaN(aN) && !isNaN(bN)) return aN - bN;
      if (!isNaN(aN)) return -1;
      if (!isNaN(bN)) return 1;
      return b.v - a.v;
    });

  /* ── G9: Por causa ── */
  const causaMap = d3.rollup(rows,
    v => v.length,
    d => (d['CAUSAS'] || '').trim() || 'Sin dato');
  const g9 = Array.from(causaMap, ([c, v]) => ({ c: c, v: v }))
    .sort((a,b) => b.v - a.v).slice(0,8).reverse();

  /* ── G12: Rescatados por localidad ── */
  const ALIAS = {
    'RAFAEL URIBE':       'RAFAEL URIBE URIBE',
    'CANDELARIA':         'LA CANDELARIA',
    'FUERA D.C.':         null,
  };
  function normLoc(s) {
    const n = quitarTildes(unificarLoc(s) || '');
    return ALIAS.hasOwnProperty(n) ? ALIAS[n] : n;
  }

  const resCols = Object.keys(rows[0]).filter(k => k.toUpperCase().includes('RESCATADO'));
  const rescPorLoc = d3.rollup(rows,
    v => d3.sum(v, d => d3.sum(resCols, c => +d[c] || 0)),
    d => normLoc(d['LOCALIDAD']));

  // Coordenadas oficiales IDECA
  const GEO = {
    'USAQUEN':            [4.7016, -74.0307],
    'CHAPINERO':          [4.6486, -74.0616],
    'SANTA FE':           [4.5997, -74.0835],
    'SAN CRISTOBAL':      [4.5607, -74.0842],
    'USME':               [4.4795, -74.1268],
    'TUNJUELITO':         [4.5742, -74.1318],
    'BOSA':               [4.6185, -74.1876],
    'KENNEDY':            [4.6284, -74.1629],
    'FONTIBON':           [4.6748, -74.1469],
    'ENGATIVA':           [4.7093, -74.1203],
    'SUBA':               [4.7471, -74.0934],
    'BARRIOS UNIDOS':     [4.6681, -74.0859],
    'TEUSAQUILLO':        [4.6412, -74.0945],
    'LOS MARTIRES':       [4.6098, -74.0921],
    'ANTONIO NARINO':     [4.5837, -74.1040],
    'PUENTE ARANDA':      [4.6126, -74.1218],
    'LA CANDELARIA':      [4.5959, -74.0753],
    'RAFAEL URIBE URIBE': [4.5639, -74.1154],
    'CIUDAD BOLIVAR':     [4.5078, -74.1576],
    'SUMAPAZ':            [4.2714, -74.2218],
  };
  const g12 = Object.entries(GEO)
    .map(([loc, [lat, lon]]) => ({
      loc: loc,
      lat: lat, lon: lon,
      v: Math.round(rescPorLoc.get(loc) || 0)
    }))
    .filter(d => d.v > 0)
    .sort((a, b) => b.v - a.v);

  /* Guardar globalmente para resize */
  window._datos = { g3, g4, g8, g9, g12 };

  dibujarTodo(window._datos);
  actualizarKPIs(window._datos);
}

/* ════════════════════════════════════════════════════════════
   DIBUJADO MAESTRO
════════════════════════════════════════════════════════════ */
function dibujarTodo(d) {
  drawG3(d.g3);
  drawG4(d.g4);
  drawG8(d.g8);
  drawG9(d.g9);
  drawG12(d.g12);
}

/* ════════════════════════════════════════════════════════════
   G3 — Incidentes por hora (línea + área)
════════════════════════════════════════════════════════════ */
function drawG3(data) {
  const el = document.getElementById('svg-g3');
  if (!el) return;
  const W0 = el.parentElement.clientWidth || 800;
  const mL=52, mR=20, mT=22, mB=42, H=320;
  const w  = W0 - mL - mR;

  const xSc = d3.scalePoint().domain(data.map(d=>d.lbl)).range([0,w]).padding(0.3);
  const ySc = d3.scaleLinear().domain([0, d3.max(data,d=>d.v)*1.18]).range([H-mT-mB, 0]);

  const svg = d3.select('#svg-g3').attr('width', W0).attr('height', H);
  svg.selectAll('*').remove();
  const g = svg.append('g').attr('transform', `translate(${mL},${mT})`);

  // Grid
  ySc.ticks(5).forEach(t => {
    g.append('line').attr('x1',0).attr('x2',w)
      .attr('y1',ySc(t)).attr('y2',ySc(t))
      .attr('stroke', C.gridLn).attr('stroke-dasharray','4,3');
  });

  // Área
  const area = d3.area()
    .x(d => xSc(d.lbl)).y0(H-mT-mB).y1(d => ySc(d.v))
    .curve(d3.curveCatmullRom.alpha(0.5));
  g.append('path').datum(data).attr('d', area)
    .attr('fill', C.blue).attr('opacity', 0.10);

  // Línea
  const line = d3.line()
    .x(d => xSc(d.lbl)).y(d => ySc(d.v))
    .curve(d3.curveCatmullRom.alpha(0.5));
  g.append('path').datum(data).attr('d', line)
    .attr('fill','none').attr('stroke', C.blue).attr('stroke-width', 2.4);

  // Puntos
  const pico = d3.max(data, d=>d.v);
  g.selectAll('.pt').data(data).enter().append('circle')
    .attr('cx', d => xSc(d.lbl))
    .attr('cy', d => ySc(d.v))
    .attr('r',  d => d.v === pico ? 7 : 4.5)
    .attr('fill', d => d.v === pico ? C.red : C.blue)
    .attr('stroke','#fff').attr('stroke-width', 2)
    .style('cursor','pointer')
    .on('mouseover', (e,d) => showTip(e, `<b>${d.lbl}</b><br>${fmt(d.v)} incidentes`))
    .on('mousemove', moveTip).on('mouseout', hideTip);

  // Anotación pico
  const pk = data.find(d => d.v === pico);
  g.append('text')
    .attr('x', xSc(pk.lbl)).attr('y', ySc(pk.v) - 14)
    .attr('text-anchor','middle').attr('font-size',10.5)
    .attr('font-weight','700').attr('fill', C.red)
    .text(`Pico ${fmt(pk.v)}`);

  // Ejes
  g.append('g').attr('transform',`translate(0,${H-mT-mB})`)
    .call(d3.axisBottom(xSc).tickSize(0))
    .call(ax => {
      ax.select('.domain').attr('stroke','#ddd');
      ax.selectAll('text').attr('fill', C.ink3).attr('font-size',9).attr('dy',12);
    });
  g.append('g').call(d3.axisLeft(ySc).ticks(5).tickFormat(d => fmt(d)))
    .call(ax => {
      ax.select('.domain').remove();
      ax.selectAll('text').attr('fill', C.ink3).attr('font-size',9);
      ax.selectAll('line').remove();
    });

  // Labels ejes
  g.append('text').attr('x', w/2).attr('y', H-mT-mB+34)
    .attr('text-anchor','middle').attr('font-size',10.5)
    .attr('fill', C.ink2).attr('font-weight','600').text('Hora del día');
  g.append('text')
    .attr('transform',`translate(-38,${(H-mT-mB)/2})rotate(-90)`)
    .attr('text-anchor','middle').attr('font-size',10.5)
    .attr('fill', C.ink2).attr('font-weight','600').text('N.º de incidentes');
}

/* ════════════════════════════════════════════════════════════
   G4 — Tiempo respuesta por localidad (línea con puntos)
════════════════════════════════════════════════════════════ */
function drawG4(data) {
  const el = document.getElementById('svg-g4');
  if (!el) return;
  const W0 = el.parentElement.clientWidth || 800;
  const mL=58, mR=20, mT=22, mB=92, H=380;
  const w  = W0 - mL - mR;

  const xSc = d3.scalePoint().domain(data.map(d=>d.loc)).range([0,w]).padding(0.5);
  const ySc = d3.scaleLinear().domain([0, d3.max(data,d=>d.v)*1.25]).range([H-mT-mB, 0]);

  const svg = d3.select('#svg-g4').attr('width', W0).attr('height', H);
  svg.selectAll('*').remove();
  const g = svg.append('g').attr('transform', `translate(${mL},${mT})`);

  // Grid
  ySc.ticks(5).forEach(t => {
    g.append('line').attr('x1',0).attr('x2',w)
      .attr('y1',ySc(t)).attr('y2',ySc(t))
      .attr('stroke', C.gridLn).attr('stroke-dasharray','4,3');
  });

  // Línea de referencia 9 min
  g.append('line')
    .attr('x1',0).attr('x2',w)
    .attr('y1',ySc(9)).attr('y2',ySc(9))
    .attr('stroke', C.teal).attr('stroke-width', 1.6)
    .attr('stroke-dasharray','5,4').attr('opacity', 0.85);
  g.append('text').attr('x', w-4).attr('y', ySc(9)-5)
    .attr('text-anchor','end').attr('font-size',9.5)
    .attr('fill', C.teal).attr('font-weight','600')
    .text('Mediana general · 9 min');

  // Área
  const area = d3.area()
    .x(d => xSc(d.loc)).y0(H-mT-mB).y1(d => ySc(d.v))
    .curve(d3.curveCatmullRom.alpha(0.5));
  g.append('path').datum(data).attr('d', area)
    .attr('fill', C.blue).attr('opacity', 0.06);

  // Línea
  const line = d3.line()
    .x(d => xSc(d.loc)).y(d => ySc(d.v))
    .curve(d3.curveCatmullRom.alpha(0.5));
  g.append('path').datum(data).attr('d', line)
    .attr('fill','none').attr('stroke', C.blue)
    .attr('stroke-width', 2.2).attr('opacity',0.85);

  // Puntos
  g.selectAll('.pt').data(data).enter().append('circle')
    .attr('cx', d => xSc(d.loc))
    .attr('cy', d => ySc(d.v))
    .attr('r', 6)
    .attr('fill', d => d.v <= 9 ? C.green : C.red)
    .attr('stroke','#fff').attr('stroke-width', 2)
    .style('cursor','pointer')
    .on('mouseover', (e,d) => showTip(e, `<b>${d.loc}</b><br>${d.v} min (mediana)`))
    .on('mousemove', moveTip).on('mouseout', hideTip);

  // Etiquetas valor
  g.selectAll('.lbl').data(data).enter().append('text')
    .attr('x', d => xSc(d.loc))
    .attr('y', d => ySc(d.v) - 11)
    .attr('text-anchor','middle').attr('font-size',9)
    .attr('font-weight','600').attr('fill', C.ink2)
    .text(d => d.v.toFixed(1));

  // Eje X
  g.append('g').attr('transform',`translate(0,${H-mT-mB})`)
    .call(d3.axisBottom(xSc).tickSize(0))
    .call(ax => {
      ax.select('.domain').attr('stroke','#ddd');
      ax.selectAll('text').attr('fill', C.ink3).attr('font-size',8.5)
        .attr('transform','rotate(-38)')
        .attr('text-anchor','end').attr('dy',2).attr('dx',-4);
    });

  // Eje Y
  g.append('g').call(d3.axisLeft(ySc).ticks(5).tickFormat(d => d + ' min'))
    .call(ax => {
      ax.select('.domain').remove();
      ax.selectAll('text').attr('fill', C.ink3).attr('font-size',9);
      ax.selectAll('line').remove();
    });

  // Labels
  g.append('text').attr('x', w/2).attr('y', H-mT-mB+82)
    .attr('text-anchor','middle').attr('font-size',10.5)
    .attr('fill', C.ink2).attr('font-weight','600').text('Localidades de Bogotá');
  g.append('text')
    .attr('transform',`translate(-44,${(H-mT-mB)/2})rotate(-90)`)
    .attr('text-anchor','middle').attr('font-size',10.5)
    .attr('fill', C.ink2).attr('font-weight','600').text('Minutos (mediana)');
}

/* ════════════════════════════════════════════════════════════
   G8 — Por estrato (barras verticales)
════════════════════════════════════════════════════════════ */
function drawG8(data) {
  const el = document.getElementById('svg-g8');
  if (!el) return;
  const W0 = el.parentElement.clientWidth || 800;
  const mL=58, mR=20, mT=22, mB=68, H=340;
  const w  = W0 - mL - mR;

  const colorEst = e => {
    if (e === 'Estrato 1' || e === 'Estrato 2') return C.gold;
    if (e === 'Estrato 3') return C.red;
    if (e === 'Estrato 4' || e === 'Estrato 5') return C.purple;
    if (e === 'Estrato 6') return C.blue;
    return C.ink3;
  };

  const xSc = d3.scaleBand().domain(data.map(d=>d.est)).range([0,w]).padding(0.3);
  const ySc = d3.scaleLinear().domain([0, d3.max(data,d=>d.v)*1.16]).range([H-mT-mB, 0]);

  const svg = d3.select('#svg-g8').attr('width', W0).attr('height', H);
  svg.selectAll('*').remove();
  const g = svg.append('g').attr('transform', `translate(${mL},${mT})`);

  // Grid
  ySc.ticks(5).forEach(t => {
    g.append('line').attr('x1',0).attr('x2',w)
      .attr('y1',ySc(t)).attr('y2',ySc(t))
      .attr('stroke', C.gridLn).attr('stroke-dasharray','4,3');
  });

  // Barras
  g.selectAll('.bar').data(data).enter().append('rect')
    .attr('x', d => xSc(d.est))
    .attr('y', d => ySc(d.v))
    .attr('width', xSc.bandwidth())
    .attr('height', d => H-mT-mB - ySc(d.v))
    .attr('rx', 5).attr('fill', d => colorEst(d.est))
    .attr('opacity', 0.88).style('cursor','pointer')
    .on('mouseover', (e,d) => showTip(e, `<b>${d.est}</b><br>${fmt(d.v)} incidentes`))
    .on('mousemove', moveTip).on('mouseout', hideTip);

  // Etiquetas valor
  g.selectAll('.lbl').data(data).enter().append('text')
    .attr('x', d => xSc(d.est) + xSc.bandwidth()/2)
    .attr('y', d => ySc(d.v) - 6)
    .attr('text-anchor','middle').attr('font-size',9.5)
    .attr('font-weight','600').attr('fill', C.ink2)
    .text(d => fmt(d.v));

  // Eje X
  g.append('g').attr('transform',`translate(0,${H-mT-mB})`)
    .call(d3.axisBottom(xSc).tickSize(0))
    .call(ax => {
      ax.select('.domain').attr('stroke','#ddd');
      ax.selectAll('text').attr('fill', C.ink3).attr('font-size',9)
        .attr('transform','rotate(-25)').attr('text-anchor','end').attr('dy',2).attr('dx',-2);
    });

  // Eje Y
  g.append('g').call(d3.axisLeft(ySc).ticks(5).tickFormat(d => fmt(d)))
    .call(ax => {
      ax.select('.domain').remove();
      ax.selectAll('text').attr('fill', C.ink3).attr('font-size',9);
      ax.selectAll('line').remove();
    });

  // Labels
  g.append('text').attr('x', w/2).attr('y', H-mT-mB+58)
    .attr('text-anchor','middle').attr('font-size',10.5)
    .attr('fill', C.ink2).attr('font-weight','600').text('Estrato socioeconómico');
  g.append('text')
    .attr('transform',`translate(-44,${(H-mT-mB)/2})rotate(-90)`)
    .attr('text-anchor','middle').attr('font-size',10.5)
    .attr('fill', C.ink2).attr('font-weight','600').text('N.º de incidentes');
}

/* ════════════════════════════════════════════════════════════
   G9 — Por causa (barras horizontales o dona)
════════════════════════════════════════════════════════════ */
let _g9Type = 'bars';       // 'bars' | 'donut'  — modo activo

function drawG9(data, type) {
  type = type || _g9Type;
  _g9Type = type;
  const el = document.getElementById('svg-g9');
  if (!el) return;

  if (type === 'donut') {
    drawG9Donut(data);
  } else {
    drawG9Bars(data);
  }
}

/* ── G9 modo BARRAS ── */
function drawG9Bars(data) {
  const W0 = document.getElementById('svg-g9').parentElement.clientWidth || 800;
  const mL=140, mR=70, mT=20, mB=42;
  const rowH = 34;
  const H = data.length * rowH + mT + mB;
  const w = W0 - mL - mR;

  const xSc = d3.scaleLinear().domain([0, d3.max(data,d=>d.v)*1.13]).range([0, w]);

  const svg = d3.select('#svg-g9').attr('width', W0).attr('height', H);
  svg.selectAll('*').remove();
  const g = svg.append('g').attr('transform', `translate(${mL},${mT})`);

  // Grid
  xSc.ticks(5).forEach(t => {
    g.append('line').attr('x1',xSc(t)).attr('x2',xSc(t))
      .attr('y1',0).attr('y2', data.length * rowH)
      .attr('stroke', C.gridLn).attr('stroke-dasharray','4,3');
  });

  // Filas
  const rows = g.selectAll('.row').data(data).enter().append('g')
    .attr('transform', (_,i) => `translate(0,${i*rowH})`);

  rows.append('rect')
    .attr('x',0).attr('y',6)
    .attr('width', d => xSc(d.v))
    .attr('height', rowH-12)
    .attr('rx',5).attr('fill', C.green).attr('opacity', 0.85)
    .style('cursor','pointer')
    .on('mouseover', (e,d) => showTip(e, `<b>${d.c}</b><br>${fmt(d.v)} incidentes`))
    .on('mousemove', moveTip).on('mouseout', hideTip);

  // Valor
  rows.append('text')
    .attr('x', d => xSc(d.v)+8)
    .attr('y', rowH/2+1)
    .attr('dominant-baseline','middle')
    .attr('font-size',10).attr('fill', C.ink2)
    .attr('font-weight','600').text(d => fmt(d.v));

  // Etiqueta y
  rows.append('text')
    .attr('x',-9).attr('y',rowH/2+1)
    .attr('text-anchor','end').attr('dominant-baseline','middle')
    .attr('font-size',11).attr('fill', C.ink2)
    .text(d => d.c.length>16 ? d.c.slice(0,15)+'…' : d.c);

  // Eje X
  g.append('g').attr('transform',`translate(0,${data.length * rowH})`)
    .call(d3.axisBottom(xSc).ticks(5).tickFormat(d => fmt(d)))
    .call(ax => {
      ax.select('.domain').attr('stroke','#ddd');
      ax.selectAll('text').attr('fill', C.ink3).attr('font-size',9);
      ax.selectAll('line').attr('stroke','#ddd');
    });

  g.append('text').attr('x', w/2).attr('y', data.length * rowH + 36)
    .attr('text-anchor','middle').attr('font-size',10.5)
    .attr('fill', C.ink2).attr('font-weight','600').text('N.º de incidentes');

  // Actualizar leyenda
  const leg = document.getElementById('g9-legend');
  if (leg) leg.innerHTML = `<span><span class="leg-dot" style="background:${C.green}"></span>Número de incidentes por causa</span>`;
}

/* ── G9 modo DONA ── */
function drawG9Donut(data) {
  const W0 = document.getElementById('svg-g9').parentElement.clientWidth || 800;
  const H  = 420;
  // Datos ordenados de mayor a menor para el donut
  const dataSorted = [...data].sort((a, b) => b.v - a.v);
  const total = d3.sum(dataSorted, d => d.v);

  // Paleta de colores diferenciada por causa (top causa en verde fuerte)
  const paleta = [C.green, '#3da06a', C.gold, C.red, C.purple, C.blue, C.teal, C.ink3];

  const svg = d3.select('#svg-g9').attr('width', W0).attr('height', H);
  svg.selectAll('*').remove();

  const R = Math.min(H, W0 * 0.45) / 2 - 18;
  const cx = R + 30;
  const cy = H / 2;

  const g = svg.append('g').attr('transform', `translate(${cx},${cy})`);

  const pie = d3.pie().value(d => d.v).sort(null);
  const arc = d3.arc().innerRadius(R * 0.55).outerRadius(R);
  const arcH = d3.arc().innerRadius(R * 0.55).outerRadius(R + 10);

  const slices = g.selectAll('.s').data(pie(dataSorted)).enter().append('g');

  slices.append('path')
    .attr('d', arc)
    .attr('fill', (_, i) => paleta[i % paleta.length])
    .attr('stroke', '#fff').attr('stroke-width', 2)
    .attr('opacity', 0.92)
    .style('cursor', 'pointer')
    .on('mouseover', function(e, d) {
      d3.select(this).transition().duration(140).attr('d', arcH).attr('opacity', 1);
      const pct = (d.data.v / total * 100).toFixed(1);
      showTip(e, `<b>${d.data.c}</b><br>${fmt(d.data.v)} incidentes · ${pct}%`);
    })
    .on('mousemove', moveTip)
    .on('mouseout', function() {
      d3.select(this).transition().duration(140).attr('d', arc).attr('opacity', 0.92);
      hideTip();
    });

  // Texto central — total
  g.append('text')
    .attr('text-anchor', 'middle').attr('dy', '-6')
    .attr('font-size', 30).attr('font-family', "'DM Serif Display',serif")
    .attr('font-style', 'italic').attr('fill', C.ink)
    .text(fmt(total));
  g.append('text')
    .attr('text-anchor', 'middle').attr('dy', '18')
    .attr('font-size', 11).attr('fill', C.ink3)
    .attr('font-family', "'DM Mono',monospace")
    .text('Total causas');

  // Leyenda lateral derecha
  const legX = cx + R + 36;
  const lg   = svg.append('g').attr('transform', `translate(${legX}, ${cy - dataSorted.length * 14})`);
  dataSorted.forEach((d, i) => {
    const y = i * 28;
    const pct = (d.v / total * 100).toFixed(1);
    lg.append('rect')
      .attr('x', 0).attr('y', y)
      .attr('width', 14).attr('height', 14).attr('rx', 3)
      .attr('fill', paleta[i % paleta.length]);
    lg.append('text')
      .attr('x', 22).attr('y', y + 11)
      .attr('font-size', 11.5).attr('fill', C.ink2)
      .attr('font-weight', '500')
      .text(d.c.length > 18 ? d.c.slice(0, 17) + '…' : d.c);
    lg.append('text')
      .attr('x', 22).attr('y', y + 25)
      .attr('font-size', 10).attr('fill', C.ink3)
      .attr('font-family', "'DM Mono',monospace")
      .text(`${fmt(d.v)}  ·  ${pct}%`);
  });

  // Actualizar leyenda inferior con un mensaje
  const leg = document.getElementById('g9-legend');
  if (leg) leg.innerHTML = `<span style="color:${C.ink3};font-size:11px">Pase el cursor sobre cada porción del donut para ver detalles</span>`;
}

/* ════════════════════════════════════════════════════════════
   G12 — Mapa burbujas Bogotá + ranking
════════════════════════════════════════════════════════════ */
function drawG12(data) {
  const el = document.getElementById('svg-g12');
  if (!el) return;
  const W0 = el.parentElement.clientWidth || 800;
  const H = 680;        // Altura aumentada para dar buen aspecto al mapa

  // ── Layout: mapa (izq) + colorbar + ranking (der) ────────────
  const cbW   = 28;
  const cbGap = 14;
  const rankW = Math.min(340, Math.max(290, W0 * 0.36));
  const mapW  = W0 - rankW - cbW - cbGap - 28;

  // Márgenes del mapa (para ejes y label)
  const mL = 56, mR = 12, mT = 18, mB = 44;
  const mapInnerW = mapW - mL - mR;
  const mapInnerH = H  - mT - mB;

  const svg = d3.select('#svg-g12').attr('width', W0).attr('height', H);
  svg.selectAll('*').remove();

  // ── Escalas geográficas (lon/lat → SVG) ──────────────────────
  // Mismo rango que la imagen de referencia matplotlib
  const lonExt = [-74.25, -73.97];
  const latExt = [4.45,    4.80];
  const lonRange = lonExt[1] - lonExt[0];   // 0.28
  const latRange = latExt[1] - latExt[0];   // 0.35

  // Mantener proporción real (aspect ratio = equal, igual que matplotlib)
  // El mapa es más alto que ancho (latRange > lonRange) → eje Y manda
  const aspectMapa = latRange / lonRange;   // 1.25
  const aspectArea = mapInnerH / mapInnerW;

  let drawW, drawH;
  if (aspectMapa > aspectArea) {
    // El mapa es proporcionalmente más alto → el alto define la escala
    drawH = mapInnerH;
    drawW = drawH / aspectMapa;
  } else {
    // El mapa es proporcionalmente más ancho → el ancho define la escala
    drawW = mapInnerW;
    drawH = drawW * aspectMapa;
  }

  // Centrar el mapa en el área disponible
  const offsetX = (mapInnerW - drawW) / 2;
  const offsetY = (mapInnerH - drawH) / 2;

  const xSc = d3.scaleLinear().domain(lonExt).range([offsetX, offsetX + drawW]);
  const ySc = d3.scaleLinear().domain(latExt).range([offsetY + drawH, offsetY]);

  const maxV = d3.max(data, d => d.v);
  const colSc = d3.scaleSequential().domain([0, maxV])
                  .interpolator(d3.interpolate('#ebf7f0', '#14532d'));

  // ── Fondo del panel del mapa ─────────────────────────────────
  svg.append('rect')
    .attr('x', mL).attr('y', mT)
    .attr('width', mapInnerW).attr('height', mapInnerH)
    .attr('fill', '#eef3f8').attr('rx', 6);

  const gMap = svg.append('g').attr('transform', `translate(${mL},${mT})`);

  // Grid sutil
  xSc.ticks(6).forEach(t => {
    gMap.append('line')
      .attr('x1', xSc(t)).attr('x2', xSc(t))
      .attr('y1', 0).attr('y2', mapInnerH)
      .attr('stroke', 'rgba(0,0,0,.06)').attr('stroke-dasharray', '2,3');
  });
  ySc.ticks(7).forEach(t => {
    gMap.append('line')
      .attr('x1', 0).attr('x2', mapInnerW)
      .attr('y1', ySc(t)).attr('y2', ySc(t))
      .attr('stroke', 'rgba(0,0,0,.06)').attr('stroke-dasharray', '2,3');
  });

  // ── Polígonos de las localidades (silueta de Bogotá) ─────────
  LOCALIDADES_GEO.forEach(feature => {
    const coords = feature.geometry.coordinates[0];
    const points = coords.map(c => `${xSc(c[0])},${ySc(c[1])}`).join(' ');
    const valor = (data.find(x => x.loc === feature.properties.name) || {}).v || 0;

    gMap.append('polygon')
      .attr('points', points)
      .attr('fill', colSc(valor))
      .attr('stroke', '#fff').attr('stroke-width', 1.4)
      .attr('stroke-linejoin', 'round')
      .style('cursor', 'pointer')
      .on('mouseover', function(e) {
        d3.select(this).attr('stroke-width', 2.2).attr('stroke', '#1a1a2e');
        showTip(e, `<b>${feature.properties.name}</b><br>${fmt(valor)} rescatados`);
      })
      .on('mousemove', moveTip)
      .on('mouseout', function() {
        d3.select(this).attr('stroke-width', 1.4).attr('stroke', '#fff');
        hideTip();
      });
  });

  // ── Etiquetas blancas con nombre + valor sobre cada localidad ─
  data.forEach(d => {
    const cx = xSc(d.lon);
    const cy = ySc(d.lat);
    const nombre = d.loc.length > 13
      ? d.loc.split(' ').map((w,i,a)=>i===0&&a.length>1?w[0]+'.':w).join('')
      : d.loc;

    // Caja blanca semitransparente
    const txtName = nombre.length > 13 ? nombre.slice(0,12)+'.' : nombre;
    const txtVal  = String(d.v);
    const wEst    = Math.max(txtName.length, txtVal.length) * 4.2 + 10;

    gMap.append('rect')
      .attr('x', cx - wEst/2).attr('y', cy - 11)
      .attr('width', wEst).attr('height', 22)
      .attr('rx', 3)
      .attr('fill', 'rgba(255,255,255,0.85)')
      .attr('stroke', 'rgba(0,0,0,0.08)').attr('stroke-width', 0.5)
      .attr('pointer-events', 'none');

    gMap.append('text')
      .attr('x', cx).attr('y', cy - 1)
      .attr('text-anchor', 'middle')
      .attr('font-size', 7.5).attr('font-weight', '700')
      .attr('fill', '#1a1a2e')
      .attr('pointer-events', 'none')
      .text(txtName);

    gMap.append('text')
      .attr('x', cx).attr('y', cy + 8)
      .attr('text-anchor', 'middle')
      .attr('font-size', 7.5).attr('font-weight', '700')
      .attr('fill', '#1a1a2e')
      .attr('pointer-events', 'none')
      .text(txtVal);
  });

  // ── Eje X (longitud) y Y (latitud) ────────────────────────────
  const gAxisX = svg.append('g').attr('transform', `translate(${mL}, ${mT + mapInnerH})`);
  gAxisX.call(d3.axisBottom(xSc).ticks(6).tickFormat(d3.format('.2f')))
    .call(ax => {
      ax.select('.domain').attr('stroke', '#aab');
      ax.selectAll('text').attr('fill', C.ink3).attr('font-size', 9)
        .attr('font-family', "'DM Mono',monospace");
      ax.selectAll('line').attr('stroke', '#aab');
    });

  const gAxisY = svg.append('g').attr('transform', `translate(${mL}, ${mT})`);
  gAxisY.call(d3.axisLeft(ySc).ticks(7).tickFormat(d3.format('.2f')))
    .call(ax => {
      ax.select('.domain').attr('stroke', '#aab');
      ax.selectAll('text').attr('fill', C.ink3).attr('font-size', 9)
        .attr('font-family', "'DM Mono',monospace");
      ax.selectAll('line').attr('stroke', '#aab');
    });

  // Etiquetas de ejes
  svg.append('text')
    .attr('x', mL + mapInnerW/2).attr('y', H - 8)
    .attr('text-anchor', 'middle').attr('font-size', 10)
    .attr('fill', C.ink2).attr('font-weight', '600')
    .text('Longitud');
  svg.append('text')
    .attr('transform', `translate(14, ${mT + mapInnerH/2}) rotate(-90)`)
    .attr('text-anchor', 'middle').attr('font-size', 10)
    .attr('fill', C.ink2).attr('font-weight', '600')
    .text('Latitud');

  // ── COLORBAR vertical ────────────────────────────────────────
  const cbX = mL + mapInnerW + cbGap;
  const cbY = mT + 10;
  const cbH = mapInnerH - 60;

  // Gradiente
  const grad = svg.append('defs').append('linearGradient')
    .attr('id', 'gradG12').attr('x1', 0).attr('y1', 1).attr('x2', 0).attr('y2', 0);
  d3.range(0, 1.01, 0.05).forEach(t => {
    grad.append('stop').attr('offset', `${t*100}%`)
        .attr('stop-color', colSc(t * maxV));
  });

  svg.append('rect')
    .attr('x', cbX).attr('y', cbY)
    .attr('width', cbW).attr('height', cbH)
    .attr('fill', 'url(#gradG12)')
    .attr('stroke', '#aab').attr('stroke-width', 0.6);

  // Ticks colorbar
  const cbScale = d3.scaleLinear().domain([0, maxV]).range([cbY + cbH, cbY]);
  cbScale.ticks(5).forEach(t => {
    svg.append('line')
      .attr('x1', cbX + cbW).attr('x2', cbX + cbW + 4)
      .attr('y1', cbScale(t)).attr('y2', cbScale(t))
      .attr('stroke', '#aab');
    svg.append('text')
      .attr('x', cbX + cbW + 7).attr('y', cbScale(t) + 3)
      .attr('font-size', 9).attr('fill', C.ink3)
      .attr('font-family', "'DM Mono',monospace")
      .text(t);
  });

  // Etiqueta colorbar
  svg.append('text')
    .attr('transform', `translate(${cbX + cbW + 38}, ${cbY + cbH/2}) rotate(-90)`)
    .attr('text-anchor', 'middle').attr('font-size', 10)
    .attr('fill', C.ink2).attr('font-weight', '600')
    .text('N de rescatados');

  // ════════════════════════════════════════════════════════════
  //  RANKING LATERAL — todas las localidades
  // ════════════════════════════════════════════════════════════
  const rX     = W0 - rankW + 6;
  const totSum = d3.sum(data, x => x.v);

  // Header del ranking
  svg.append('text')
    .attr('x', rX + rankW/2 - 12).attr('y', 24)
    .attr('text-anchor', 'middle')
    .attr('font-family', "'DM Serif Display',serif")
    .attr('font-style', 'italic').attr('font-size', 14)
    .attr('font-weight', '700').attr('fill', C.green)
    .text('Todas las localidades  |  Rescatados');

  svg.append('text')
    .attr('x', rX + rankW/2 - 12).attr('y', 42)
    .attr('text-anchor', 'middle')
    .attr('font-size', 10).attr('fill', C.ink3)
    .text(`Total: ${fmt(totSum)}`);

  // Línea separadora bajo el título
  svg.append('line')
    .attr('x1', rX + 8).attr('x2', rX + rankW - 32)
    .attr('y1', 50).attr('y2', 50)
    .attr('stroke', '#cfd6e0').attr('stroke-width', 1);

  // Ranking — TODAS las 20 localidades (incluye Sumapaz con 0)
  const todasLoc = LOCALIDADES_GEO.map(f => f.properties.name);
  if (!todasLoc.includes('SUMAPAZ')) todasLoc.push('SUMAPAZ');
  let ranking = todasLoc.map(nombre => {
    const found = data.find(d => d.loc === nombre);
    return { loc: nombre, v: found ? found.v : 0 };
  }).sort((a, b) => b.v - a.v);

  // Espacio para barras (deja espacio inferior para Mayor/Menor/Promedio)
  const rTopY    = 60;
  const statsH   = 110;       // alto reservado abajo para stats
  const rH       = H - rTopY - statsH;
  const rPaso    = rH / ranking.length;
  const barAnMax = rankW * 0.42;
  const barX     = rX + rankW * 0.50;

  ranking.forEach((d, i) => {
    const y = rTopY + i * rPaso + rPaso * 0.15;
    const cy= rTopY + i * rPaso + rPaso * 0.5;
    const bAn = d.v / maxV * barAnMax;
    const pct = totSum > 0 ? Math.round(d.v / totSum * 1000) / 10 : 0;

    // Barra fondo
    svg.append('rect')
      .attr('x', barX).attr('y', y)
      .attr('width', barAnMax).attr('height', rPaso * 0.7)
      .attr('rx', 2).attr('fill', '#eef4f0');

    // Barra valor
    if (bAn > 0) {
      svg.append('rect')
        .attr('x', barX).attr('y', y)
        .attr('width', bAn).attr('height', rPaso * 0.7)
        .attr('rx', 2).attr('fill', colSc(d.v));
    }

    // Nombre
    svg.append('text')
      .attr('x', barX - 6).attr('y', cy)
      .attr('text-anchor', 'end').attr('dominant-baseline', 'middle')
      .attr('font-size', 9).attr('fill', C.ink2)
      .text(`${i+1}. ${d.loc.length > 16 ? d.loc.slice(0,15)+'.' : d.loc}`);

    // Valor + porcentaje
    svg.append('text')
      .attr('x', barX + barAnMax + 8).attr('y', cy)
      .attr('dominant-baseline', 'middle')
      .attr('font-size', 9).attr('fill', C.ink3)
      .attr('font-family', "'DM Mono',monospace")
      .text(`${d.v} (${pct}%)`);
  });

  // ════════════════════════════════════════════════════════════
  //  BLOQUE INFERIOR — Mayor / Menor / Promedio
  // ════════════════════════════════════════════════════════════
  const sBaseY = H - statsH + 16;
  const conV   = data.filter(d => d.v > 0);
  const mayor  = conV.length ? conV[0] : { loc: '—', v: 0 };
  const menor  = ranking[ranking.length - 1] || { loc: '—', v: 0 };
  const prom   = ranking.length ? totSum / ranking.length : 0;

  // Línea separadora superior
  svg.append('line')
    .attr('x1', rX + 8).attr('x2', rX + rankW - 32)
    .attr('y1', sBaseY - 6).attr('y2', sBaseY - 6)
    .attr('stroke', '#cfd6e0').attr('stroke-width', 1);

  const stats = [
    { lbl: 'Mayor:',    sub: mayor.loc, val: fmt(mayor.v) },
    { lbl: 'Menor:',    sub: menor.loc, val: fmt(menor.v) },
    { lbl: 'Promedio:', sub: 'localidades', val: prom.toFixed(1) },
  ];

  stats.forEach((s, i) => {
    const y = sBaseY + 6 + i * 30;
    svg.append('text')
      .attr('x', rX + 12).attr('y', y)
      .attr('font-size', 11).attr('font-weight', '700').attr('fill', C.ink2)
      .text(s.lbl);
    svg.append('text')
      .attr('x', rX + 12).attr('y', y + 12)
      .attr('font-size', 9).attr('fill', C.ink3)
      .attr('font-style', 'italic')
      .text(s.sub);
    svg.append('text')
      .attr('x', rX + rankW - 32).attr('y', y + 6)
      .attr('text-anchor', 'end')
      .attr('font-size', 14).attr('font-weight', '800')
      .attr('font-family', "'DM Serif Display',serif")
      .attr('fill', C.ink)
      .text(s.val);
  });
}

/* ════════════════════════════════════════════════════════════
   ACTUALIZAR KPIs DEL HEADER
════════════════════════════════════════════════════════════ */
function actualizarKPIs(d) {
  /* G3 */
  if (d.g3) {
    const tot = d3.sum(d.g3, x=>x.v);
    const pico= d.g3.reduce((a,b)=>a.v>b.v?a:b);
    document.getElementById('kpi-g3-total').textContent = fmt(tot);
    document.getElementById('kpi-g3-pico').textContent  = `${pico.lbl} · ${fmt(pico.v)}`;
  }
  /* G4 */
  if (d.g4 && d.g4.length) {
    const med = d3.median(d.g4, x=>x.v);
    document.getElementById('kpi-g4-med').textContent = `${med.toFixed(1)} min`;
    document.getElementById('kpi-g4-loc').textContent = d.g4[0].loc;
  }
  /* G8 */
  if (d.g8) {
    const tot = d3.sum(d.g8, x=>x.v);
    const top = d.g8.reduce((a,b)=>a.v>b.v?a:b);
    document.getElementById('kpi-g8-tot').textContent  = fmt(tot);
    document.getElementById('kpi-g8-lider').textContent= top.est;
  }
  /* G9 */
  if (d.g9) {
    const tot = d3.sum(d.g9, x=>x.v);
    const top = d.g9.reduce((a,b)=>a.v>b.v?a:b);
    document.getElementById('kpi-g9-tot').textContent  = fmt(tot);
    document.getElementById('kpi-g9-lider').textContent= top.c;
  }
  /* G12 */
  if (d.g12 && d.g12.length) {
    const tot = d3.sum(d.g12, x=>x.v);
    document.getElementById('kpi-g12-tot').textContent  = fmt(tot);
    document.getElementById('kpi-g12-lider').textContent= d.g12[0].loc;
  }
}

/* ════════════════════════════════════════════════════════════
   NAVEGACIÓN ENTRE GRÁFICAS
════════════════════════════════════════════════════════════ */
function showSection(id) {
  document.querySelectorAll('.chart-section').forEach(s => s.classList.remove('visible'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('sec-' + id)?.classList.add('visible');
  document.getElementById('nav-' + id)?.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-dibujar la gráfica cuando se muestra (para que tome el ancho correcto)
  if (window._datos) setTimeout(() => dibujarTodo(window._datos), 50);
}

/* ════════════════════════════════════════════════════════════
   RESIZE
════════════════════════════════════════════════════════════ */
let _resizeTm;
window.addEventListener('resize', () => {
  clearTimeout(_resizeTm);
  _resizeTm = setTimeout(() => {
    if (window._datos) dibujarTodo(window._datos);
  }, 200);
});

/* ════════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  // Listener de navegación (delegación)
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      showSection(item.dataset.g);
    });
  });

  // Listener del selector tipo de gráfica G9 (Barras / Dona)
  document.querySelectorAll('.g9-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tipo = btn.dataset.type;
      document.querySelectorAll('.g9-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (window._datos && window._datos.g9) {
        drawG9(window._datos.g9, tipo);
      }
    });
  });

  cargarCSV();
});
