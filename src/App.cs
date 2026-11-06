:root {
  --tinta: #12343b;
  --tinta-2: #1d4f59;
  --fondo: #eef3f4;
  --superficie: #ffffff;
  --linea: #cfdadd;
  --texto: #1a2326;
  --suave: #5b6b70;
  --ambar: #e9a820;
  --ok: #1b7f4b;
  --ok-fondo: #e2f3ea;
  --alerta: #a3341f;
  --alerta-fondo: #fbe6e1;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  background: var(--fondo);
  color: var(--texto);
  line-height: 1.5;
}

h1,
h2 {
  font-family: Georgia, "Times New Roman", serif;
  color: var(--tinta);
  margin: 0 0 0.5rem;
}
h1 {
  font-size: 1.7rem;
}
h2 {
  font-size: 1.25rem;
  margin-top: 1.5rem;
}

main {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

/* ---------- barra superior ---------- */
.barra {
  background: var(--tinta);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 4px solid var(--ambar);
}
.marca {
  font-family: Georgia, serif;
  font-size: 1.3rem;
  font-weight: bold;
}
.barra nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
}
.usuario {
  margin: 0 0.5rem;
  font-size: 0.9rem;
  opacity: 0.85;
}
.nav {
  background: transparent;
  color: #fff;
  border: 1px solid transparent;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
}
.nav:hover {
  background: var(--tinta-2);
}
.nav.activo {
  border-color: var(--ambar);
}

/* ---------- avisos ---------- */
.aviso {
  max-width: 960px;
  margin: 1rem auto 0;
  padding: 0.7rem 1rem;
  border-radius: 6px;
  width: calc(100% - 2rem);
}
.aviso.ok {
  background: var(--ok-fondo);
  color: var(--ok);
}
.aviso.alerta {
  background: var(--alerta-fondo);
  color: var(--alerta);
}

/* ---------- tarjetas y formularios ---------- */
.tarjeta {
  background: var(--superficie);
  border: 1px solid var(--linea);
  border-radius: 10px;
  padding: 1.25rem;
}
.formulario {
  max-width: 440px;
  margin: 1rem auto;
}
.formulario.ancho {
  max-width: none;
  margin: 1rem 0;
}
.campo {
  display: block;
  margin-bottom: 0.9rem;
}
.campo span {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  font-weight: 600;
}
input,
select {
  width: 100%;
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--linea);
  border-radius: 6px;
  font-size: 1rem;
  background: #fff;
  color: var(--texto);
}
input:focus-visible,
select:focus-visible,
button:focus-visible {
  outline: 3px solid var(--ambar);
  outline-offset: 2px;
}
.error {
  color: var(--alerta);
  font-size: 0.85rem;
  display: block;
  margin-top: 0.25rem;
}
.suave {
  color: var(--suave);
}
.pista {
  font-size: 0.8rem;
  color: var(--suave);
  border-top: 1px dashed var(--linea);
  padding-top: 0.6rem;
}
.vacio {
  background: var(--superficie);
  border: 1px dashed var(--linea);
  border-radius: 8px;
  padding: 1rem;
  color: var(--suave);
}

/* ---------- botones ---------- */
button {
  font-family: inherit;
}
.primario {
  background: var(--tinta);
  color: #fff;
  border: none;
  padding: 0.65rem 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}
.primario:hover {
  background: var(--tinta-2);
}
.secundario {
  background: #fff;
  color: var(--tinta);
  border: 1px solid var(--tinta);
  padding: 0.35rem 0.7rem;
  border-radius: 6px;
  cursor: pointer;
}
.secundario:hover {
  background: var(--fondo);
}
.enlace {
  background: none;
  border: none;
  color: var(--tinta-2);
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
}

/* ---------- catálogo ---------- */
.filtros {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 0.75rem;
  margin: 0.75rem 0;
}
.rejilla {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 0.9rem;
}
.libro {
  text-align: left;
  background: var(--superficie);
  border: 1px solid var(--linea);
  border-left: 6px solid var(--tinta);
  border-radius: 6px;
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--texto);
}
.libro:hover {
  border-left-color: var(--ambar);
}
.chip {
  display: inline-block;
  width: fit-content;
  margin-top: 0.4rem;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: #e6ecee;
  font-size: 0.85rem;
}
.chip.ok {
  background: var(--ok-fondo);
  color: var(--ok);
}
.chip.alerta {
  background: var(--alerta-fondo);
  color: var(--alerta);
}

/* ---------- detalle ---------- */
.datos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin: 1rem 0;
}
.datos dt {
  font-size: 0.8rem;
  color: var(--suave);
}
.datos dd {
  margin: 0;
  font-weight: 600;
}

/* ---------- tablas y listas ---------- */
.tabla-scroll {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  background: var(--superficie);
  border: 1px solid var(--linea);
}
th,
td {
  text-align: left;
  padding: 0.6rem 0.7rem;
  border-bottom: 1px solid var(--linea);
  font-size: 0.92rem;
}
th {
  background: #e6ecee;
}
tr.vencido td {
  background: var(--alerta-fondo);
}
.lista {
  display: grid;
  gap: 0.6rem;
  margin-top: 0.75rem;
}
.fila {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 560px) {
  .filtros {
    grid-template-columns: 1fr;
  }
}
