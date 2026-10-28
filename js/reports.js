/* ==========================================================================
 * Relatorios: PDF (impressao nativa, A4), Word (.docx, OOXML gerado na mao)
 * e Excel (.xlsx via SheetJS). Reaproveita o estado e as funcoes ja
 * definidas em app.js (state, modules, getColumns, displayValue, toNumber,
 * getActiveEndpoint, labelize) - este arquivo e carregado depois dele.
 *
 * Limitacao conhecida: a versao gratuita do SheetJS nao grava estilo de
 * fonte na celula do Excel (testado: qualquer fonte pedida e descartada
 * silenciosamente ao salvar). O arquivo .xlsx sai com a fonte padrao do
 * Excel do usuario, normalmente Calibri. PDF e Word usam Arial de verdade.
 * ========================================================================== */
(function () {
  "use strict";

  const NUM_RE = /valor|preco|total|saldo|quantidade/i;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  function isVisible(node) {
    return !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length);
  }

  /** Varre o painel de filtros e monta uma lista "rotulo: valor" com o que
   * esta preenchido e visivel para o modulo atual, mais os filtros de
   * coluna ativos. Nao depende de conhecer cada campo individualmente. */
  function getAppliedFilters() {
    const panel = document.querySelector(".filters-panel");
    if (!panel) return [];
    const skip = new Set(["pageSize", "startIndex"]);
    const items = [];
    panel.querySelectorAll("input, select").forEach((input) => {
      if (!input.id || skip.has(input.id)) return;
      if (!isVisible(input)) return;
      if (!input.value) return;
      const label = document.querySelector(`label[for="${input.id}"]`);
      let value = input.value;
      if (input.tagName === "SELECT") {
        const option = input.options[input.selectedIndex];
        value = option ? option.textContent : value;
      } else if (input.type === "date" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [y, m, d] = value.split("-");
        value = `${d}/${m}/${y}`;
      } else if (input.type === "month" && /^\d{4}-\d{2}$/.test(value)) {
        const [y, m] = value.split("-");
        value = `${m}/${y}`;
      }
      items.push(`${label ? label.textContent : input.id}: ${value}`);
    });
    Object.entries((window.state || {}).columnFilters || {}).forEach(([key, values]) => {
      if (values && values.size) items.push(`${labelize(key)} (coluna): ${[...values].join(", ")}`);
    });
    return items;
  }

  function fmtDateTime(date) {
    return `${date.toLocaleDateString("pt-BR")} ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  }

  function fileBaseName() {
    const endpoint = typeof getActiveEndpoint === "function" ? getActiveEndpoint() : state.module;
    return `tce-ce-${endpoint}-${new Date().toISOString().slice(0, 10)}`;
  }

  /** Le a lista de caixas de selecao de colunas. null = nenhuma marcada,
   * ou seja, usar todas as colunas (comportamento padrao). */
  function getSelectedColumnKeys() {
    const container = document.getElementById("reportColumnsList");
    if (!container) return null;
    const checked = [...container.querySelectorAll("input[type=checkbox]:checked")].map((input) => input.dataset.key);
    return checked.length ? new Set(checked) : null;
  }

  /** Reconstroi a lista de caixas de selecao com as colunas do modulo/busca
   * atual. Chamada sempre que os botoes de exportacao mudam de estado
   * (mesmo observador usado para habilitar/desabilitar os botoes), entao
   * acompanha automaticamente trocas de aba e novas buscas. */
  function populateColumnChecklist() {
    const container = document.getElementById("reportColumnsList");
    if (!container) return;
    container.innerHTML = "";
    getColumns().forEach(([key, label]) => {
      const item = document.createElement("label");
      item.className = "report-column-item";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.dataset.key = key;
      item.appendChild(input);
      item.appendChild(document.createTextNode(label));
      container.appendChild(item);
    });
  }

  /** Monta o modelo de dados do relatorio a partir do que esta na tela
   * agora (mesmas colunas e mesmas linhas filtradas que o usuario ve),
   * restrito as colunas marcadas na lista de selecao, se houver alguma. */
  function buildModel() {
    const mod = modules[state.module];
    let columnDefs = getColumns();
    const selecionadas = getSelectedColumnKeys();
    if (selecionadas) {
      const filtradas = columnDefs.filter(([key]) => selecionadas.has(key));
      if (filtradas.length) columnDefs = filtradas;
    }
    const numericFlags = columnDefs.map(([key]) => NUM_RE.test(key));
    return {
      appTitle: "Busca TCE-CE",
      sectionTitle: mod.title,
      filtros: getAppliedFilters(),
      headers: columnDefs.map(([, label]) => label),
      keys: columnDefs.map(([key]) => key),
      numericFlags,
      rows: state.filteredRows,
      total: state.filteredRows.length,
      geradoEm: new Date(),
    };
  }

  function somarColuna(model, key) {
    return model.rows.reduce((total, row) => total + toNumber(row[key]), 0);
  }

  /* ---------------------------------------------------------------- PDF */
  function renderPrintView(model) {
    const root = document.getElementById("printReport");
    root.innerHTML = "";

    const header = document.createElement("div");
    header.className = "print-header";
    header.innerHTML =
      `<p class="print-app">Dados Abertos SIM &middot; ${escapeHtml(model.appTitle)}</p>` +
      `<h1>${escapeHtml(model.sectionTitle)}</h1>` +
      (model.filtros.length ? `<p class="print-filtros">${model.filtros.map(escapeHtml).join(" &nbsp;&middot;&nbsp; ")}</p>` : "") +
      `<p class="print-meta">Gerado em ${fmtDateTime(model.geradoEm)} &nbsp;&middot;&nbsp; ${model.total.toLocaleString("pt-BR")} registro(s)</p>`;
    root.appendChild(header);

    const table = document.createElement("table");
    table.className = "print-table";
    const thead = document.createElement("thead");
    const trh = document.createElement("tr");
    model.headers.forEach((label, i) => {
      const th = document.createElement("th");
      th.textContent = label;
      if (model.numericFlags[i]) th.classList.add("num");
      trh.appendChild(th);
    });
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    model.rows.forEach((row) => {
      const tr = document.createElement("tr");
      model.keys.forEach((key, i) => {
        const td = document.createElement("td");
        td.textContent = displayValue(row[key], key);
        if (model.numericFlags[i]) td.classList.add("num");
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    if (model.numericFlags.some(Boolean)) {
      const tfoot = document.createElement("tfoot");
      const tr = document.createElement("tr");
      model.keys.forEach((key, i) => {
        const td = document.createElement("td");
        if (model.numericFlags[i]) {
          td.textContent = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(somarColuna(model, key));
          td.classList.add("num");
        } else if (i === 0) {
          td.textContent = "TOTAL";
        }
        tr.appendChild(td);
      });
      tfoot.appendChild(tr);
      table.appendChild(tfoot);
    }
    root.appendChild(table);

    const footer = document.createElement("p");
    footer.className = "print-footer";
    footer.textContent = "Fonte: API de Dados Abertos do SIM/TCE-CE (api-dados-abertos.tce.ce.gov.br).";
    root.appendChild(footer);
  }

  function exportPdf() {
    const model = buildModel();
    if (!model.rows.length) return;
    renderPrintView(model);
    window.print();
  }

  /* ---------------------------------------------------------------- XLSX */
  function exportXlsx() {
    if (!window.XLSX) {
      setStatus("Excel indisponivel (biblioteca nao carregada)");
      return;
    }
    const model = buildModel();
    if (!model.rows.length) return;

    const aoa = [model.headers];
    model.rows.forEach((row) => {
      aoa.push(
        model.keys.map((key, i) => {
          if (model.numericFlags[i]) {
            const n = toNumber(row[key]);
            return Number.isFinite(n) && row[key] != null && row[key] !== "" ? n : "";
          }
          return displayValue(row[key], key);
        }),
      );
    });
    if (model.numericFlags.some(Boolean)) {
      aoa.push(model.keys.map((key, i) => (model.numericFlags[i] ? somarColuna(model, key) : i === 0 ? "TOTAL" : "")));
    }

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = model.headers.map((label, i) => ({
      wch: Math.min(
        50,
        Math.max(10, label.length, ...model.rows.slice(0, 300).map((row) => String(displayValue(row[model.keys[i]], model.keys[i])).length)),
      ),
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, model.sectionTitle.slice(0, 31));
    XLSX.writeFile(wb, `${fileBaseName()}.xlsx`);
  }

  /* ---------------------------------------------------------------- DOCX
   * Um .docx e um pacote ZIP de arquivos XML (OOXML). O XML e montado aqui
   * na mao (document.xml, styles.xml etc.); o JSZip (vendor/jszip.min.js)
   * so empacota esses arquivos no .zip/.docx final. */
  const PAGE_W = 16838; // A4 paisagem, twips (1 cm = 567 twips)
  const PAGE_H = 11906;
  const MARGIN = 850;
  const USABLE_W = PAGE_W - 2 * MARGIN;

  function xesc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function run(text, opts) {
    opts = opts || {};
    const props = ['<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>'];
    if (opts.b) props.push("<w:b/>");
    if (opts.i) props.push("<w:i/>");
    if (opts.color) props.push(`<w:color w:val="${opts.color}"/>`);
    if (opts.sz) props.push(`<w:sz w:val="${opts.sz * 2}"/>`);
    return `<w:r><w:rPr>${props.join("")}</w:rPr><w:t xml:space="preserve">${xesc(text)}</w:t></w:r>`;
  }

  function paragrafo(text, opts) {
    opts = opts || {};
    const pprParts = [];
    if (opts.after != null) pprParts.push(`<w:spacing w:after="${opts.after}" w:before="${opts.before || 0}"/>`);
    if (opts.align) pprParts.push(`<w:jc w:val="${opts.align}"/>`);
    const ppr = pprParts.length ? `<w:pPr>${pprParts.join("")}</w:pPr>` : "";
    return `<w:p>${ppr}${run(text, opts)}</w:p>`;
  }

  function celula(text, opts) {
    opts = opts || {};
    const w = opts.w || 1000;
    const fundo = opts.bg ? `<w:shd w:val="clear" w:color="auto" w:fill="${opts.bg}"/>` : "";
    const align = opts.num ? "right" : "left";
    return (
      `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${fundo}<w:vAlign w:val="center"/></w:tcPr>` +
      `<w:p><w:pPr><w:jc w:val="${align}"/></w:pPr>${run(text, { b: opts.b, sz: 9 })}</w:p></w:tc>`
    );
  }

  function tabelaDocx(model) {
    const n = model.headers.length;
    const w = Math.max(600, Math.floor(USABLE_W / n));
    const grid = `<w:tblGrid>${model.headers.map(() => `<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>`;
    const bordas = ["top", "left", "bottom", "right", "insideH", "insideV"]
      .map((lado) => `<w:${lado} w:val="single" w:sz="4" w:space="0" w:color="999999"/>`)
      .join("");

    const linhaCab = `<w:tr>${model.headers.map((label, i) => celula(label, { b: true, bg: "E4E4E4", w, num: model.numericFlags[i] })).join("")}</w:tr>`;
    const linhasDados = model.rows
      .map((row) => `<w:tr>${model.keys.map((key, i) => celula(displayValue(row[key], key), { w, num: model.numericFlags[i] })).join("")}</w:tr>`)
      .join("");
    let linhaTotal = "";
    if (model.numericFlags.some(Boolean)) {
      linhaTotal = `<w:tr>${model.keys
        .map((key, i) =>
          celula(model.numericFlags[i] ? new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(somarColuna(model, key)) : i === 0 ? "TOTAL" : "", {
            b: true,
            bg: "EDEDED",
            w,
            num: model.numericFlags[i],
          }),
        )
        .join("")}</w:tr>`;
    }

    return `<w:tbl><w:tblPr><w:tblW w:w="${USABLE_W}" w:type="dxa"/><w:tblBorders>${bordas}</w:tblBorders><w:tblLayout w:type="fixed"/></w:tblPr>${grid}${linhaCab}${linhasDados}${linhaTotal}</w:tbl>`;
  }

  function documentoXml(model) {
    let body = "";
    body += paragrafo("Dados Abertos SIM · " + model.appTitle, { b: true, sz: 10, after: 20 });
    body += paragrafo(model.sectionTitle, { b: true, sz: 16, after: 20 });
    if (model.filtros.length) body += paragrafo(model.filtros.join("  ·  "), { sz: 9, color: "444444", after: 120 });
    body += paragrafo(`Gerado em ${fmtDateTime(model.geradoEm)}  ·  ${model.total.toLocaleString("pt-BR")} registro(s)`, { sz: 9, color: "444444", after: 160 });
    body += tabelaDocx(model);
    body += paragrafo("Fonte: API de Dados Abertos do SIM/TCE-CE (api-dados-abertos.tce.ce.gov.br).", { sz: 8.5, color: "444444", before: 160 });
    const sectPr = `<w:sectPr><w:pgSz w:w="${PAGE_W}" w:h="${PAGE_H}" w:orient="landscape"/><w:pgMar w:top="${MARGIN}" w:right="${MARGIN}" w:bottom="${MARGIN}" w:left="${MARGIN}" w:header="0" w:footer="0" w:gutter="0"/></w:sectPr>`;
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}${sectPr}</w:body></w:document>`;
  }

  const CONTENT_TYPES =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
    '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
    '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>';
  const RELS_RAIZ =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
    '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>';
  const RELS_DOC =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
  const STYLES =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
    '<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="20"/></w:rPr></w:rPrDefault></w:docDefaults>' +
    '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style></w:styles>';

  function coreXml(title) {
    return (
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/">' +
      `<dc:title>${xesc(title)}</dc:title><dc:creator>Busca TCE-CE</dc:creator></cp:coreProperties>`
    );
  }

  async function exportDocx() {
    if (!window.JSZip) {
      setStatus("Word indisponivel (biblioteca nao carregada)");
      return;
    }
    const model = buildModel();
    if (!model.rows.length) return;
    const zip = new JSZip();
    zip.file("[Content_Types].xml", CONTENT_TYPES);
    zip.folder("_rels").file(".rels", RELS_RAIZ);
    zip.folder("docProps").file("core.xml", coreXml(model.sectionTitle));
    const word = zip.folder("word");
    word.file("document.xml", documentoXml(model));
    word.file("styles.xml", STYLES);
    word.folder("_rels").file("document.xml.rels", RELS_DOC);
    const blob = await zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileBaseName()}.docx`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 500);
  }

  /* ---------------------------------------------------------------- wiring */
  function syncReportButtons() {
    const disabled = el.exportButton.disabled;
    ["pdfButton", "docxButton", "xlsxButton"].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.disabled = disabled;
    });
    populateColumnChecklist();
  }

  function wire() {
    const pdfBtn = document.getElementById("pdfButton");
    const docxBtn = document.getElementById("docxButton");
    const xlsxBtn = document.getElementById("xlsxButton");
    if (!pdfBtn || !docxBtn || !xlsxBtn) return;
    pdfBtn.addEventListener("click", exportPdf);
    docxBtn.addEventListener("click", exportDocx);
    xlsxBtn.addEventListener("click", exportXlsx);
    const allBtn = document.getElementById("reportColumnsAll");
    const noneBtn = document.getElementById("reportColumnsNone");
    if (allBtn) allBtn.addEventListener("click", () => {
      document.querySelectorAll("#reportColumnsList input[type=checkbox]").forEach((input) => (input.checked = true));
    });
    if (noneBtn) noneBtn.addEventListener("click", () => {
      document.querySelectorAll("#reportColumnsList input[type=checkbox]").forEach((input) => (input.checked = false));
    });
    // Acompanha o botao de CSV (ja mantido pelo app.js) para habilitar/desabilitar junto,
    // sem precisar duplicar logica de estado em varios lugares do app.js. A mesma troca
    // (nova busca, troca de aba) tambem e o gatilho certo para refazer a lista de colunas.
    new MutationObserver(syncReportButtons).observe(el.exportButton, { attributes: true, attributeFilter: ["disabled"] });
    syncReportButtons();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
})();
