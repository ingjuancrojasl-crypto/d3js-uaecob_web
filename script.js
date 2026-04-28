/* ══════════════════════════════════════════════════════════════════
   UAECOB Dashboard · script.js
   D3.js v7 · Gráficas 3, 4, 8, 9, 12
   ══════════════════════════════════════════════════════════════════ */

// ── Paleta de colores institucional ─────────────────────────────────────────
const C = {
  navy:    "#0d2b5e",
  navy2:   "#1a4080",
  teal:    "#2AB5A0",
  teal2:   "#1D9E75",
  amber:   "#BA7517",
  purple:  "#7c5cbf",
  red:     "#E24B4A",
  blue:    "#3266ad",
  gris:    "#888780",
  orange:  "#EF9F27",
};

// ── Tooltip global ───────────────────────────────────────────────────────────
const tooltip = d3.select("#tooltip");

function showTip(html, event) {
  tooltip.html(html).style("opacity", 1);
  moveTip(event);
}
function moveTip(event) {
  tooltip
    .style("left", (event.pageX + 14) + "px")
    .style("top",  (event.pageY - 28) + "px");
}
function hideTip() { tooltip.style("opacity", 0); }

// ── Datos embebidos (extraídos del CSV) ──────────────────────────────────────
const DATA = {
  g3_hora: [
    {hora:0,total:258},{hora:1,total:196},{hora:2,total:181},{hora:3,total:178},
    {hora:4,total:177},{hora:5,total:209},{hora:6,total:502},{hora:7,total:956},
    {hora:8,total:1456},{hora:9,total:1943},{hora:10,total:1764},{hora:11,total:1512},
    {hora:12,total:1387},{hora:13,total:1301},{hora:14,total:1589},{hora:15,total:1772},
    {hora:16,total:1698},{hora:17,total:1543},{hora:18,total:1312},{hora:19,total:1089},
    {hora:20,total:876},{hora:21,total:734},{hora:22,total:548},{hora:23,total:367}
  ],
  g4_tr_localidad: [
    {localidad:"LOS MARTIRES",mediana:6.0},{localidad:"ANTONIO NARIÑO",mediana:7.0},
    {localidad:"SANTA FE",mediana:7.5},{localidad:"LA CANDELARIA",mediana:7.5},
    {localidad:"TEUSAQUILLO",mediana:7.7},{localidad:"CHAPINERO",mediana:8.0},
    {localidad:"BARRIOS UNIDOS",mediana:8.3},{localidad:"PUENTE ARANDA",mediana:8.5},
    {localidad:"USAQUÉN",mediana:8.8},{localidad:"USME",mediana:9.0},
    {localidad:"ENGATIVÁ",mediana:9.0},{localidad:"TUNJUELITO",mediana:9.2},
    {localidad:"KENNEDY",mediana:9.5},{localidad:"FONTIBON",mediana:9.5},
    {localidad:"SUBA",mediana:9.7},{localidad:"BOSA",mediana:10.0},
    {localidad:"SAN CRISTÓBAL",mediana:10.3},{localidad:"SUMAPAZ",mediana:10.5},
    {localidad:"CIUDAD BOLIVAR",mediana:11.0},{localidad:"RAFAEL URIBE",mediana:11.0}
  ],
  g8_estrato: [
    {categoria:"Estrato 1",total:1243,tipo:"num"},{categoria:"Estrato 2",total:6466,tipo:"num"},
    {categoria:"Estrato 3",total:8299,tipo:"num"},{categoria:"Estrato 4",total:1987,tipo:"num"},
    {categoria:"Estrato 5",total:932,tipo:"num"},{categoria:"Estrato 6",total:457,tipo:"num"},
    {categoria:"SIN ESTRATO",total:534,tipo:"cat"},{categoria:"RURAL",total:134,tipo:"cat"},
    {categoria:"DEPARTAMENTAL",total:76,tipo:"cat"}
  ],
  g9_causas: [
    {causa:"ACTIVACION",total:426},{causa:"CONDICIÓN HUMANA",total:462},
    {causa:"PROVOCADA",total:632},{causa:"INDETERMINADA",total:701},
    {causa:"NATURAL",total:2552},{causa:"ORDEN",total:3460},
    {causa:"ACCIDENTAL",total:4122},{causa:"NO APLICA",total:8544}
  ],
  g12_rescatados: [
    {localidad:"SUBA",rescatados:183},{localidad:"USAQUÉN",rescatados:167},
    {localidad:"KENNEDY",rescatados:144},{localidad:"CHAPINERO",rescatados:110},
    {localidad:"ENGATIVÁ",rescatados:109},{localidad:"FONTIBON",rescatados:97},
    {localidad:"CIUDAD BOLIVAR",rescatados:83},{localidad:"SAN CRISTÓBAL",rescatados:75},
    {localidad:"BOSA",rescatados:69},{localidad:"BARRIOS UNIDOS",rescatados:52},
    {localidad:"PUENTE ARANDA",rescatados:51},{localidad:"ANTONIO NARIÑO",rescatados:44},
    {localidad:"RAFAEL URIBE",rescatados:41},{localidad:"TEUSAQUILLO",rescatados:38},
    {localidad:"TUNJUELITO",rescatados:33},{localidad:"SANTA FE",rescatados:29},
    {localidad:"LOS MARTIRES",rescatados:24},{localidad:"USME",rescatados:19},
    {localidad:"LA CANDELARIA",rescatados:6},{localidad:"SUMAPAZ",rescatados:0}
  ]
};

// ── GeoJSON localidades Bogotá — cargado desde URL oficial ──────────────────
// Se carga en init y se guarda aquí para uso en renderG12
let BOGOTA_GEO = null;
const BOGOTA_GEOJSON_URL =
  "https://raw.githubusercontent.com/AshamedCookie/bogota-localidades/main/bogota.geo.json";

// ── Normalizar nombre localidad para join ────────────────────────────────────
function normLoc(s) {
  return s.toUpperCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/RAFAEL URIBE URIBE/g, "RAFAEL URIBE")
    .replace(/FONTIBON/g, "FONTIBON")
    .trim();
}

// ═══════════════════════════════════════════════════════════════════
// NAVEGACIÓN
// ═══════════════════════════════════════════════════════════════════
const TITLES = {
  g3: "Incidentes por hora del día",
  g4: "Tiempo de respuesta por localidad",
  g8: "Incidentes por estrato socioeconómico",
  g9: "Incidentes por causa registrada",
  g12: "Mapa de calor · Rescatados por localidad",
  about: "Acerca del proyecto y dataset",
};

let currentChart = "g3";
let g12Rendered = false;

document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    const chart = item.dataset.chart;
    activatePanel(chart);
    // Close mobile sidebar
    document.getElementById("sidebar").classList.remove("open");
  });
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

function activatePanel(chart) {
  // Nav highlight
  document.querySelectorAll(".nav-item").forEach(n => {
    n.classList.toggle("active", n.dataset.chart === chart);
  });
  // Panel visibility
  document.querySelectorAll(".panel").forEach(p => {
    p.classList.toggle("active", p.id === `panel-${chart}`);
  });
  // Topbar title
  document.getElementById("topbarTitle").textContent = TITLES[chart] || "";
  currentChart = chart;

  // Render on first visit
  if (chart === "g12" && !g12Rendered) {
    renderG12();
    g12Rendered = true;
  }

  // Resize charts on panel switch
  if (chart === "g3") renderG3();
  if (chart === "g4") renderG4();
  if (chart === "g8") renderG8();
  if (chart === "g9") renderG9();
}

// ═══════════════════════════════════════════════════════════════════
// GRÁFICA 3 · Incidentes por hora del día
// ═══════════════════════════════════════════════════════════════════
function renderG3() {
  const data = DATA.g3_hora;
  const svg = d3.select("#chart-g3");
  svg.selectAll("*").remove();

  const container = svg.node().parentElement;
  const W = container.clientWidth - 20;
  const H = 360;
  const m = {top:30, right:40, bottom:50, left:60};
  const w = W - m.left - m.right;
  const h = H - m.top - m.bottom;

  svg.attr("viewBox", `0 0 ${W} ${H}`).attr("preserveAspectRatio","xMidYMid meet");

  const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

  const franja = document.getElementById("g3-franja").value;
  const tipo   = document.getElementById("g3-tipo").value;

  // Color según franja
  const franjaRanges = {
    madrugada:[0,5], manana:[6,11], tarde:[12,17], noche:[18,23]
  };

  // Escalas
  const x = d3.scaleBand().domain(data.map(d=>d.hora)).range([0,w]).padding(tipo==="bar"?0.15:0);
  const xLine = d3.scaleLinear().domain([0,23]).range([0,w]);
  const y = d3.scaleLinear().domain([0, d3.max(data,d=>d.total)*1.15]).range([h,0]);

  // Grid
  g.append("g").attr("class","grid")
    .call(d3.axisLeft(y).tickSize(-w).tickFormat(""))
    .select(".domain").remove();

  // Eje X
  g.append("g").attr("class","axis").attr("transform",`translate(0,${h})`)
    .call(d3.axisBottom(tipo==="bar"?x:xLine.copy().domain([0,23]))
      .tickFormat(d=>`${d}h`).ticks(12))
    .select(".domain").attr("stroke","#e2e8f0");
  g.append("text").attr("x",w/2).attr("y",h+42)
    .attr("text-anchor","middle").attr("font-size","11px").attr("fill","#64748b")
    .text("Hora del día (0 – 23 h)");

  // Eje Y
  g.append("g").attr("class","axis")
    .call(d3.axisLeft(y).ticks(6).tickFormat(d=>d3.format(",")(d)))
    .select(".domain").remove();
  g.append("text").attr("transform","rotate(-90)").attr("x",-h/2).attr("y",-48)
    .attr("text-anchor","middle").attr("font-size","11px").attr("fill","#64748b")
    .text("N.º de incidentes");

  function colorBar(d) {
    if (franja === "all") return C.teal;
    const [lo,hi] = franjaRanges[franja] || [0,23];
    return d.hora>=lo && d.hora<=hi ? C.teal : "#dde8f0";
  }

  if (tipo === "bar") {
    // Barras
    g.selectAll(".bar").data(data).join("rect")
      .attr("class","bar")
      .attr("x", d=>x(d.hora))
      .attr("y", d=>y(d.total))
      .attr("width", x.bandwidth())
      .attr("height", d=>h-y(d.total))
      .attr("rx", 3)
      .attr("fill", d=>colorBar(d))
      .style("cursor","pointer")
      .on("mouseover", (e,d) => showTip(`<strong>${d.hora}:00 h</strong><br>${d3.format(",")(d.total)} incidentes`, e))
      .on("mousemove", moveTip).on("mouseout", hideTip);
  } else {
    // Área + línea
    const ptX = d => xLine(d.hora);
    const ptY = d => y(d.total);

    const area = d3.area().x(ptX).y0(h).y1(ptY).curve(d3.curveCatmullRom.alpha(0.5));
    const line = d3.line().x(ptX).y(ptY).curve(d3.curveCatmullRom.alpha(0.5));

    const defs = svg.append("defs");
    defs.append("linearGradient").attr("id","areaGrad").attr("x1","0").attr("y1","0").attr("x2","0").attr("y2","1")
      .call(lg=>{
        lg.append("stop").attr("offset","0%").attr("stop-color",C.teal).attr("stop-opacity",0.30);
        lg.append("stop").attr("offset","100%").attr("stop-color",C.teal).attr("stop-opacity",0.02);
      });

    g.append("path").datum(data).attr("fill","url(#areaGrad)").attr("d",area);
    g.append("path").datum(data).attr("fill","none")
      .attr("stroke",C.teal).attr("stroke-width",2.2).attr("d",line);

    // Puntos interactivos
    g.selectAll(".dot").data(data).join("circle")
      .attr("class","dot").attr("cx",ptX).attr("cy",ptY).attr("r",3.5)
      .attr("fill", d=>colorBar(d)).attr("stroke","white").attr("stroke-width",1.5)
      .style("cursor","pointer")
      .on("mouseover",(e,d)=>showTip(`<strong>${d.hora}:00 h</strong><br>${d3.format(",")(d.total)} incidentes`,e))
      .on("mousemove",moveTip).on("mouseout",hideTip);

    // Pico
    const pico = data.reduce((a,b)=>b.total>a.total?b:a);
    g.append("text").attr("x",ptX(pico)+6).attr("y",ptY(pico)-12)
      .attr("font-size","10px").attr("font-weight","700").attr("fill",C.teal)
      .text(`Pico: ${d3.format(",")(pico.total)} (${pico.hora}h)`);
    g.append("line")
      .attr("x1",ptX(pico)).attr("y1",ptY(pico)).attr("x2",ptX(pico)).attr("y2",h)
      .attr("stroke",C.teal).attr("stroke-width",1).attr("stroke-dasharray","4,3").attr("opacity",.5);
  }

  // Franjas de fondo
  if (franja !== "all") {
    const [lo,hi] = franjaRanges[franja];
    const x0 = tipo==="bar" ? x(lo) : xLine(lo);
    const x1 = tipo==="bar" ? x(hi)+x.bandwidth() : xLine(hi);
    g.insert("rect","g").attr("x",x0).attr("y",0).attr("width",x1-x0).attr("height",h)
      .attr("fill",C.teal).attr("opacity",.07).attr("rx",4);
  }
}

document.getElementById("g3-franja").addEventListener("change", renderG3);
document.getElementById("g3-tipo").addEventListener("change", renderG3);

// ═══════════════════════════════════════════════════════════════════
// GRÁFICA 4 · Tiempo de respuesta por localidad
// ═══════════════════════════════════════════════════════════════════
let g4Umbral = 9.0;

function renderG4() {
  let data = [...DATA.g4_tr_localidad];
  const orden = document.getElementById("g4-orden").value;

  if (orden === "asc")   data.sort((a,b)=>a.mediana-b.mediana);
  if (orden === "desc")  data.sort((a,b)=>b.mediana-a.mediana);
  if (orden === "alpha") data.sort((a,b)=>a.localidad.localeCompare(b.localidad));

  const svg = d3.select("#chart-g4");
  svg.selectAll("*").remove();

  const container = svg.node().parentElement;
  const W = container.clientWidth - 20;
  const H = Math.max(480, data.length * 22 + 80);
  const m = {top:20, right:80, bottom:50, left:140};
  const w = W - m.left - m.right;
  const h = H - m.top - m.bottom;

  svg.attr("viewBox",`0 0 ${W} ${H}`).attr("preserveAspectRatio","xMidYMid meet");
  const g = svg.append("g").attr("transform",`translate(${m.left},${m.top})`);

  const x = d3.scaleLinear().domain([0, d3.max(data,d=>d.mediana)*1.35]).range([0,w]);
  const y = d3.scaleBand().domain(data.map(d=>d.localidad)).range([0,h]).padding(0.3);

  // Grid
  g.append("g").attr("class","grid")
    .call(d3.axisTop(x).tickSize(-h).tickFormat("").ticks(6))
    .select(".domain").remove();

  // Eje Y
  g.append("g").attr("class","axis")
    .call(d3.axisLeft(y).tickSize(0))
    .selectAll("text").attr("font-size","10.5px").attr("font-weight","500").attr("fill","#334155");
  g.select(".domain").remove();

  // Eje X
  g.append("g").attr("class","axis").attr("transform",`translate(0,${h})`)
    .call(d3.axisBottom(x).ticks(6).tickFormat(d=>`${d} min`))
    .select(".domain").attr("stroke","#e2e8f0");

  // Línea de referencia umbral
  g.append("line").attr("class","ref-line").attr("id","umbral-line")
    .attr("x1",x(g4Umbral)).attr("x2",x(g4Umbral))
    .attr("y1",-10).attr("y2",h)
    .attr("stroke",C.amber).attr("stroke-width",1.8);
  g.append("text").attr("id","umbral-label")
    .attr("x",x(g4Umbral)+4).attr("y",-2)
    .attr("font-size","9px").attr("fill",C.amber).attr("font-weight","700")
    .text(`Umbral ${g4Umbral} min`);

  // Línea conectora
  g.append("path")
    .datum(data)
    .attr("fill","none").attr("stroke","#cbd5e1").attr("stroke-width",1)
    .attr("d", d3.line()
      .x(d=>x(d.mediana))
      .y(d=>y(d.localidad)+y.bandwidth()/2)
    );

  // Área sombreada
  g.append("path")
    .datum(data)
    .attr("fill","rgba(42,181,160,0.06)")
    .attr("d", d3.area()
      .x0(0).x1(d=>x(d.mediana))
      .y(d=>y(d.localidad)+y.bandwidth()/2)
    );

  // Puntos
  g.selectAll(".pt").data(data).join("circle")
    .attr("class","pt")
    .attr("cx",d=>x(d.mediana))
    .attr("cy",d=>y(d.localidad)+y.bandwidth()/2)
    .attr("r",6)
    .attr("fill",d=>d.mediana<=g4Umbral ? C.teal2 : C.red)
    .attr("stroke","white").attr("stroke-width",2)
    .style("cursor","pointer")
    .on("mouseover",(e,d)=>showTip(
      `<strong>${d.localidad}</strong><br>Mediana: <strong>${d.mediana} min</strong><br>${d.mediana<=g4Umbral?"✅ Dentro del umbral":"⚠️ Supera el umbral"}`,e))
    .on("mousemove",moveTip).on("mouseout",hideTip);

  // Etiquetas de valor
  g.selectAll(".val-lbl").data(data).join("text")
    .attr("class","val-lbl")
    .attr("x",d=>x(d.mediana)+10)
    .attr("y",d=>y(d.localidad)+y.bandwidth()/2+4)
    .attr("font-size","10px").attr("font-weight","600")
    .attr("fill",d=>d.mediana<=g4Umbral ? C.teal2 : C.red)
    .text(d=>`${d.mediana} min`);

  // Leyenda
  const leg = g.append("g").attr("transform",`translate(${w-10},${h-50})`);
  [[C.teal2,"≤ umbral"],[C.red,"> umbral"]].forEach(([col,lbl],i)=>{
    const ly = leg.append("g").attr("transform",`translate(0,${i*18})`);
    ly.append("circle").attr("r",5).attr("cx",0).attr("cy",0).attr("fill",col);
    ly.append("text").attr("x",10).attr("y",4).attr("font-size","9px").attr("fill","#475569").text(lbl);
  });
}

document.getElementById("g4-orden").addEventListener("change", renderG4);
document.getElementById("g4-umbral").addEventListener("input", function() {
  g4Umbral = +this.value;
  document.getElementById("g4-umbral-val").textContent = `${g4Umbral.toFixed(1)} min`;
  // Update slider gradient
  const pct = ((g4Umbral-5)/(15-5)*100).toFixed(1);
  this.style.background = `linear-gradient(90deg,var(--teal) ${pct}%,var(--border) ${pct}%)`;
  renderG4();
});

// ═══════════════════════════════════════════════════════════════════
// GRÁFICA 8 · Estrato socioeconómico
// ═══════════════════════════════════════════════════════════════════
function renderG8() {
  const showNum = document.getElementById("g8-numericos").checked;
  const showCat = document.getElementById("g8-especiales").checked;
  const orden   = document.getElementById("g8-orden").value;

  let data = DATA.g8_estrato.filter(d =>
    (d.tipo==="num" && showNum) || (d.tipo==="cat" && showCat)
  );
  if (orden === "desc") data = [...data].sort((a,b)=>b.total-a.total);

  const svg = d3.select("#chart-g8");
  svg.selectAll("*").remove();

  const container = svg.node().parentElement;
  const W = container.clientWidth - 20;
  const H = 360;
  const m = {top:30, right:40, bottom:70, left:60};
  const w = W - m.left - m.right;
  const h = H - m.top - m.bottom;

  svg.attr("viewBox",`0 0 ${W} ${H}`).attr("preserveAspectRatio","xMidYMid meet");
  const g = svg.append("g").attr("transform",`translate(${m.left},${m.top})`);

  const colores = [C.amber,"#c98c10",C.red,"#5a3d9a","#3d7acc","#1a5a8a",C.gris,"#6b7280","#9ca3af"];

  const x = d3.scaleBand().domain(data.map(d=>d.categoria)).range([0,w]).padding(0.25);
  const y = d3.scaleLinear().domain([0,d3.max(data,d=>d.total)*1.18]).range([h,0]);

  // Grid
  g.append("g").attr("class","grid")
    .call(d3.axisLeft(y).tickSize(-w).tickFormat("").ticks(5))
    .select(".domain").remove();

  // Eje X
  g.append("g").attr("class","axis").attr("transform",`translate(0,${h})`)
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll("text").attr("transform","rotate(-30)").style("text-anchor","end")
    .attr("font-size","10px").attr("dy","0.5em").attr("dx","-0.5em");
  g.select(".axis .domain").attr("stroke","#e2e8f0");

  // Eje Y
  g.append("g").attr("class","axis")
    .call(d3.axisLeft(y).ticks(5).tickFormat(d=>d3.format(",")(d)))
    .select(".domain").remove();
  g.append("text").attr("transform","rotate(-90)").attr("x",-h/2).attr("y",-48)
    .attr("text-anchor","middle").attr("font-size","11px").attr("fill","#64748b")
    .text("N.º de incidentes");

  const total = d3.sum(data,d=>d.total);

  // Barras
  g.selectAll(".bar").data(data).join("rect")
    .attr("class","bar")
    .attr("x",d=>x(d.categoria)).attr("y",d=>y(d.total))
    .attr("width",x.bandwidth()).attr("height",d=>h-y(d.total))
    .attr("rx",4)
    .attr("fill",(d,i)=>d.tipo==="cat"?C.gris:colores[i])
    .attr("opacity",0.88)
    .style("cursor","pointer")
    .on("mouseover",(e,d)=>showTip(
      `<strong>${d.categoria}</strong><br>${d3.format(",")(d.total)} incidentes<br>${(d.total/total*100).toFixed(1)}% del total`,e))
    .on("mousemove",moveTip).on("mouseout",hideTip);

  // Etiquetas sobre barras
  g.selectAll(".bar-lbl").data(data).join("text")
    .attr("class","bar-lbl")
    .attr("x",d=>x(d.categoria)+x.bandwidth()/2)
    .attr("y",d=>y(d.total)-5)
    .attr("text-anchor","middle")
    .attr("font-size","9px").attr("font-weight","700").attr("fill","#334155")
    .text(d=>d3.format(",")(d.total));

  // % en el 41% de estrato 3
  const e3 = data.find(d=>d.categoria==="Estrato 3");
  if (e3) {
    g.append("text").attr("x",x("Estrato 3")+x.bandwidth()/2).attr("y",y(e3.total)-18)
      .attr("text-anchor","middle").attr("font-size","8.5px").attr("fill",C.red).attr("font-weight","700")
      .text(`41% del total`);
  }
}

["g8-numericos","g8-especiales","g8-orden"].forEach(id => {
  document.getElementById(id).addEventListener("change", renderG8);
});

// ═══════════════════════════════════════════════════════════════════
// GRÁFICA 9 · Causas
// ═══════════════════════════════════════════════════════════════════
function renderG9() {
  const excluir = document.getElementById("g9-excluir").checked;
  const tipo    = document.getElementById("g9-tipo").value;

  let data = [...DATA.g9_causas];
  if (excluir) data = data.filter(d=>d.causa!=="NO APLICA");
  data = data.sort((a,b)=>a.total-b.total);

  const svg = d3.select("#chart-g9");
  svg.selectAll("*").remove();

  const container = svg.node().parentElement;
  const W = container.clientWidth - 20;

  if (tipo === "hbar") {
    const H = Math.max(380, data.length*44+80);
    const m = {top:20, right:100, bottom:40, left:160};
    const w = W - m.left - m.right;
    const h = H - m.top - m.bottom;

    svg.attr("viewBox",`0 0 ${W} ${H}`).attr("preserveAspectRatio","xMidYMid meet");
    const g = svg.append("g").attr("transform",`translate(${m.left},${m.top})`);

    const palette = [C.gris,"#7a8b9a","#5b7fa6",C.blue,C.purple,"#8a5aa0",C.teal2,C.teal];
    const x = d3.scaleLinear().domain([0,d3.max(data,d=>d.total)*1.25]).range([0,w]);
    const y = d3.scaleBand().domain(data.map(d=>d.causa)).range([0,h]).padding(0.3);

    // Grid
    g.append("g").attr("class","grid")
      .call(d3.axisTop(x).tickSize(-h).tickFormat("").ticks(5))
      .select(".domain").remove();

    // Eje Y
    g.append("g").attr("class","axis")
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll("text").attr("font-size","10.5px").attr("font-weight","500").attr("fill","#334155");
    g.select(".domain").remove();

    // Barras
    g.selectAll(".bar").data(data).join("rect")
      .attr("class","bar")
      .attr("x",0).attr("y",d=>y(d.causa))
      .attr("height",y.bandwidth()).attr("width",0)
      .attr("rx",4)
      .attr("fill",(d,i)=>palette[i%palette.length])
      .attr("opacity",0.85)
      .style("cursor","pointer")
      .on("mouseover",(e,d)=>showTip(`<strong>${d.causa}</strong><br>${d3.format(",")(d.total)} incidentes`,e))
      .on("mousemove",moveTip).on("mouseout",hideTip)
      .transition().duration(600).ease(d3.easeQuadOut)
      .attr("width",d=>x(d.total));

    // Etiquetas
    g.selectAll(".lbl").data(data).join("text")
      .attr("class","lbl")
      .attr("x",d=>x(d.total)+6).attr("y",d=>y(d.causa)+y.bandwidth()/2+4)
      .attr("font-size","10px").attr("font-weight","700").attr("fill","#334155")
      .text(d=>d3.format(",")(d.total));

  } else {
    // Dona
    const H = 400;
    svg.attr("viewBox",`0 0 ${W} ${H}`).attr("preserveAspectRatio","xMidYMid meet");
    const cx = W*0.35, cy = H/2, radius = Math.min(cx,cy)-20;
    const g = svg.append("g").attr("transform",`translate(${cx},${cy})`);

    const palette = [C.gris,"#7a8b9a","#5b7fa6",C.blue,C.purple,"#8a5aa0",C.teal2,C.teal];
    const color = d3.scaleOrdinal().domain(data.map(d=>d.causa)).range(palette);
    const pie = d3.pie().value(d=>d.total).sort(null);
    const arc = d3.arc().innerRadius(radius*0.52).outerRadius(radius);
    const arcHover = d3.arc().innerRadius(radius*0.52).outerRadius(radius+8);

    const arcs = g.selectAll(".arc").data(pie(data)).join("g").attr("class","arc");
    arcs.append("path")
      .attr("fill",d=>color(d.data.causa))
      .attr("stroke","white").attr("stroke-width",2)
      .attr("d",arc).style("cursor","pointer")
      .on("mouseover",function(e,d){
        d3.select(this).transition().duration(150).attr("d",arcHover);
        showTip(`<strong>${d.data.causa}</strong><br>${d3.format(",")(d.data.total)}`,e);
      })
      .on("mousemove",moveTip)
      .on("mouseout",function(e,d){
        d3.select(this).transition().duration(150).attr("d",arc);
        hideTip();
      });

    // Centro
    g.append("text").attr("text-anchor","middle").attr("y",-5)
      .attr("font-family","Syne,sans-serif").attr("font-size","22px")
      .attr("font-weight","800").attr("fill","#0d2b5e")
      .text(d3.format(",")(d3.sum(data,d=>d.total)));
    g.append("text").attr("text-anchor","middle").attr("y",14)
      .attr("font-size","9px").attr("fill","#64748b").text("incidentes");

    // Leyenda
    const legG = svg.append("g").attr("transform",`translate(${W*0.67},${cy-data.length*10})`);
    data.slice().reverse().forEach((d,i)=>{
      const row = legG.append("g").attr("transform",`translate(0,${i*20})`);
      row.append("rect").attr("width",10).attr("height",10).attr("rx",2)
        .attr("fill",color(d.causa));
      row.append("text").attr("x",15).attr("y",9).attr("font-size","9.5px").attr("fill","#334155")
        .text(`${d.causa} (${d3.format(",")(d.total)})`);
    });
  }
}

["g9-excluir","g9-tipo"].forEach(id => {
  document.getElementById(id).addEventListener("change", renderG9);
});

// ═══════════════════════════════════════════════════════════════════
// GRÁFICA 12 · Mapa coroplético — Rescatados por localidad
// ═══════════════════════════════════════════════════════════════════
const PALETTES_MAP = {
  teal:   ["#e8faf4","#b8edda","#6dd4b0","#1D9E75","#14755a","#0a4033"],
  blue:   ["#dbeafe","#93c5fd","#60a5fa","#3b82f6","#1d4ed8","#1e3a8a"],
  orange: ["#fef9e7","#fde68a","#fbbf24","#f59e0b","#d97706","#92400e"],
};

function renderG12() {
  const paletteKey = document.getElementById("g12-palette").value;
  const showLabels = document.getElementById("g12-labels").checked;
  const showValues = document.getElementById("g12-values").checked;
  const palette    = PALETTES_MAP[paletteKey];

  const dataMap = {};
  DATA.g12_rescatados.forEach(d => { dataMap[normLoc(d.localidad)] = d.rescatados; });
  const maxVal = d3.max(DATA.g12_rescatados, d => d.rescatados);
  const color  = d3.scaleQuantize().domain([0, maxVal]).range(palette);

  const svg       = d3.select("#chart-g12");
  const container = svg.node().parentElement;
  const W = Math.max(container.clientWidth - 32, 300);
  const H = 480;
  svg.attr("viewBox", `0 0 ${W} ${H}`).attr("preserveAspectRatio", "xMidYMid meet");
  svg.selectAll("*").remove();

  // Loading message
  svg.append("text")
    .attr("x", W / 2).attr("y", H / 2)
    .attr("text-anchor", "middle")
    .attr("fill", "#64748b").attr("font-size", "14px")
    .text("Cargando mapa…");

  function drawMap(geo) {
    svg.selectAll("*").remove();

    // Normalizar el nombre de la propiedad del GeoJSON
    // El GeoJSON oficial de Bogotá usa "LocNombre" o "NOMBRE" — ajustamos aquí
    geo.features.forEach(f => {
      const p = f.properties;
      // Detectar qué campo tiene el nombre
      const rawName = p.LocNombre || p.NOMBRE || p.nombre || p.name || p.Name || "";
      p._normName = normLoc(rawName);
    });

    // Filtrar Sumapaz para mejor zoom (es muy grande y distorsiona el encuadre)
    const featsSinSumapaz = geo.features.filter(f => !f.properties._normName.includes("SUMAPAZ"));
    const geoSinSumapaz   = { type: "FeatureCollection", features: featsSinSumapaz };

    const projection = d3.geoMercator().fitExtent([[10, 10], [W - 10, H - 10]], geoSinSumapaz);
    const path       = d3.geoPath().projection(projection);
    const mapTip     = d3.select("#map-tooltip");

    // Dibujar polígonos
    svg.selectAll(".loc-path")
      .data(geo.features)
      .join("path")
      .attr("class", "loc-path")
      .attr("d", path)
      .attr("fill", d => {
        const v = dataMap[d.properties._normName];
        return v != null ? color(v) : "#e2e8f0";
      })
      .attr("stroke", "white")
      .attr("stroke-width", 1.2)
      .style("cursor", "pointer")
      .on("mouseover", function(e, d) {
        d3.select(this).attr("stroke", "#0d2b5e").attr("stroke-width", 2.5);
        const v = dataMap[d.properties._normName] ?? "Sin datos";
        const rawName = d.properties.LocNombre || d.properties.NOMBRE || d.properties.nombre || d.properties.name || d.properties._normName;
        mapTip.html(`<strong>${rawName}</strong><br>🧑‍🚒 Rescatados: <strong>${v}</strong>`)
              .style("opacity", 1);
      })
      .on("mousemove", function(e) {
        const rect = container.getBoundingClientRect();
        mapTip.style("left", (e.clientX - rect.left + 12) + "px")
              .style("top",  (e.clientY - rect.top  - 36) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("stroke", "white").attr("stroke-width", 1.2);
        mapTip.style("opacity", 0);
      });

    // Etiquetas
    if (showLabels || showValues) {
      geo.features.forEach(feat => {
        const centroid = path.centroid(feat);
        if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) return;
        const rawName = feat.properties.LocNombre || feat.properties.NOMBRE ||
                        feat.properties.nombre    || feat.properties.name   || "";
        const v = dataMap[feat.properties._normName] ?? 0;
        const short = rawName.toUpperCase()
          .replace("ANTONIO NARIO", "ANT.NARIÑO")
          .replace("ANTONIO NARIÑO", "ANT.NARIÑO")
          .replace("CIUDAD BOLIVAR", "C.BOLIVAR")
          .replace("BARRIOS UNIDOS", "B.UNIDOS")
          .replace("SAN CRISTOBAL", "S.CRISTOBAL")
          .replace("RAFAEL URIBE URIBE", "R.URIBE")
          .replace("RAFAEL URIBE", "R.URIBE");

        if (showLabels) {
          svg.append("text")
            .attr("x", centroid[0]).attr("y", centroid[1] - (showValues ? 5 : 0))
            .attr("text-anchor", "middle").attr("font-size", "7px")
            .attr("font-weight", "700").attr("fill", "#0d2b5e")
            .attr("pointer-events", "none").text(short);
        }
        if (showValues) {
          svg.append("text")
            .attr("x", centroid[0]).attr("y", centroid[1] + (showLabels ? 7 : 4))
            .attr("text-anchor", "middle").attr("font-size", "7.5px")
            .attr("font-weight", "800").attr("fill", "#0d2b5e")
            .attr("pointer-events", "none").text(v);
        }
      });
    }

    // Leyenda
    document.getElementById("map-legend").innerHTML = `
      <div class="legend-title">📊 Escala de personas rescatadas</div>
      <div class="legend-gradient" style="background:linear-gradient(90deg,${palette.join(",")})"></div>
      <div class="legend-labels"><span>0</span><span>${Math.round(maxVal/2)}</span><span>${maxVal}</span></div>
      <div class="legend-note">* Hover sobre cada localidad para ver el detalle.</div>
    `;

    // Ranking
    const sorted = [...DATA.g12_rescatados].sort((a, b) => b.rescatados - a.rescatados);
    document.getElementById("map-ranking").innerHTML =
      `<div class="rank-title">🏆 Ranking por localidad</div>` +
      sorted.map((d, i) => `
        <div class="rank-row">
          <span class="rank-num">${i + 1}</span>
          <span class="rank-name">${d.localidad}</span>
          <div class="rank-bar-wrap">
            <div class="rank-bar" style="width:${(d.rescatados / maxVal * 100).toFixed(1)}%;background:${color(d.rescatados)}"></div>
          </div>
          <span class="rank-val">${d.rescatados}</span>
        </div>
      `).join("");
  }

  // Cargar GeoJSON si no está en caché
  if (BOGOTA_GEO) {
    drawMap(BOGOTA_GEO);
  } else {
    fetch(BOGOTA_GEOJSON_URL)
      .then(r => { if (!r.ok) throw new Error("Error cargando GeoJSON"); return r.json(); })
      .then(geo => { BOGOTA_GEO = geo; drawMap(geo); })
      .catch(err => {
        svg.selectAll("*").remove();
        svg.append("text")
          .attr("x", W / 2).attr("y", H / 2 - 20)
          .attr("text-anchor", "middle").attr("fill", "#E24B4A")
          .attr("font-size", "13px")
          .text("⚠️ No se pudo cargar el mapa.");
        svg.append("text")
          .attr("x", W / 2).attr("y", H / 2 + 10)
          .attr("text-anchor", "middle").attr("fill", "#64748b")
          .attr("font-size", "11px")
          .text("Verifica tu conexión a internet.");
        console.error(err);
      });
  }
}

document.getElementById("g12-palette").addEventListener("change", ()=>{
  g12Rendered=false; renderG12(); g12Rendered=true;
});
["g12-labels","g12-values"].forEach(id=>{
  document.getElementById(id).addEventListener("change",()=>{
    g12Rendered=false; renderG12(); g12Rendered=true;
  });
});

// ═══════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════
window.addEventListener("DOMContentLoaded", () => {
  renderG3();
  renderG4();
  renderG8();
  renderG9();
  // G12 se renderiza al hacer clic en el nav
});

window.addEventListener("resize", () => {
  if (currentChart === "g3") renderG3();
  if (currentChart === "g4") renderG4();
  if (currentChart === "g8") renderG8();
  if (currentChart === "g9") renderG9();
  if (currentChart === "g12") { g12Rendered=false; renderG12(); g12Rendered=true; }
});
