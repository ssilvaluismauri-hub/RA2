import { useState } from "react";
import "./App.css";

/* =====================================================
   REGLAS Y UTILIDADES (matemática aplicada)
   ===================================================== */
const TARIFA_MULTA = 0.5; // S/ por día de retraso
const DIAS_PRESTAMO = 7; // días hábiles de préstamo

const hoy = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const aISO = (d) => d.toLocaleDateString("en-CA"); // AAAA-MM-DD
const deISO = (s) => new Date(s + "T00:00:00");
const desplazar = (n) => {
  const d = hoy();
  d.setDate(d.getDate() + n);
  return aISO(d);
};

// Fecha límite = fecha de préstamo + N días hábiles (se saltan sábado y domingo)
function sumarDiasHabiles(fecha, n) {
  const d = new Date(fecha);
  let sumados = 0;
  while (sumados < n) {
    d.setDate(d.getDate() + 1);
    const dia = d.getDay();
    if (dia !== 0 && dia !== 6) sumados++;
  }
  return d;
}

// Días de retraso = fecha de referencia - fecha límite (mínimo 0)
const diasRetraso = (vence, ref = hoy()) =>
  Math.max(0, Math.round((ref - deISO(vence)) / 86400000));

// Multa = días de retraso x tarifa diaria
const calcularMulta = (vence, ref) => diasRetraso(vence, ref) * TARIFA_MULTA;

const soles = (n) => "S/ " + n.toFixed(2);
const emailValido = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const codigoValido = (s) => /^E\d{6}$/.test(s);

// Stock disponible = total de ejemplares - préstamos activos
const stockDisponible = (libro, prestamos) =>
  libro.total - prestamos.filter((p) => p.libroId === libro.id && !p.devuelto).length;

/* =====================================================
   DATOS DE EJEMPLO
   ===================================================== */
const USUARIOS_INICIALES = [
  { nombre: "Rosa Medina", codigo: null, email: "biblioteca@colegio.edu.pe", clave: "123456", rol: "bibliotecario" },
  { nombre: "Ana Torres", codigo: "E202601", email: "ana@colegio.edu.pe", clave: "123456", rol: "estudiante" },
  { nombre: "Luis Ramos", codigo: "E202602", email: "luis@colegio.edu.pe", clave: "123456", rol: "estudiante" },
  { nombre: "Carla Díaz", codigo: "E202603", email: "carla@colegio.edu.pe", clave: "123456", rol: "estudiante" },
];

const LIBROS_INICIALES = [
  { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", categoria: "Novela", total: 3, ubicacion: "Estante A2", cola: [] },
  { id: 2, titulo: "El principito", autor: "Antoine de Saint-Exupéry", categoria: "Novela", total: 2, ubicacion: "Estante A3", cola: [] },
  { id: 3, titulo: "Álgebra", autor: "Aurelio Baldor", categoria: "Matemática", total: 1, ubicacion: "Estante B1", cola: ["E202602"] },
  { id: 4, titulo: "Paco Yunque", autor: "César Vallejo", categoria: "Cuento", total: 2, ubicacion: "Estante A5", cola: [] },
  { id: 5, titulo: "Física conceptual", autor: "Paul G. Hewitt", categoria: "Ciencias", total: 2, ubicacion: "Estante D1", cola: [] },
  { id: 6, titulo: "Atlas del mundo", autor: "National Geographic", categoria: "Geografía", total: 1, ubicacion: "Estante E2", cola: [] },
  { id: 7, titulo: "Los ríos profundos", autor: "José María Arguedas", categoria: "Novela", total: 2, ubicacion: "Estante A4", cola: [] },
  { id: 8, titulo: "Biología", autor: "Helena Curtis", categoria: "Ciencias", total: 1, ubicacion: "Estante D3", cola: [] },
];

const PRESTAMOS_INICIALES = [
  { id: 1, libroId: 1, codigo: "E202601", fecha: desplazar(-12), vence: desplazar(-5), devuelto: null },
  { id: 2, libroId: 2, codigo: "E202602", fecha: desplazar(-2), vence: desplazar(5), devuelto: null },
  { id: 3, libroId: 3, codigo: "E202603", fecha: desplazar(-3), vence: desplazar(4), devuelto: null },
  { id: 4, libroId: 4, codigo: "E202601", fecha: desplazar(-30), vence: desplazar(-21), devuelto: desplazar(-22) },
];

/* =====================================================
   COMPONENTE PEQUEÑO: campo con mensaje de error
   ===================================================== */
function Campo({ etiqueta, error, children }) {
  return (
    <label className="campo">
      <span>{etiqueta}</span>
      {children}
      {error && (
        <small className="error" role="alert">
          {error}
        </small>
      )}
    </label>
  );
}

/* =====================================================
   PANTALLA: INICIO DE SESIÓN
   ===================================================== */
function Login({ usuarios, onLogin, irA }) {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [errores, setErrores] = useState({});

  const enviar = (e) => {
    e.preventDefault();
    const er = {};
    if (!email.trim()) er.email = "Campo obligatorio";
    else if (!emailValido(email.trim())) er.email = "Formato incorrecto";
    if (!clave) er.clave = "Campo obligatorio";
    else if (clave.length < 6) er.clave = "Mínimo 6 caracteres";
    setErrores(er);
    if (Object.keys(er).length) return;

    const u = usuarios.find((x) => x.email === email.trim().toLowerCase() && x.clave === clave);
    if (!u) {
      setErrores({ general: "Correo o contraseña incorrectos" });
      return;
    }
    onLogin(u);
  };

  return (
    <section className="tarjeta formulario">
      <h1>Iniciar sesión</h1>
      <p className="suave">Accede con tu correo del colegio.</p>
      <form onSubmit={enviar} noValidate>
        <Campo etiqueta="Correo" error={errores.email}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ana@colegio.edu.pe" />
        </Campo>
        <Campo etiqueta="Contraseña" error={errores.clave}>
          <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} />
        </Campo>
        {errores.general && <p className="error" role="alert">{errores.general}</p>}
        <button className="primario" type="submit">Ingresar</button>
      </form>
      <p className="suave">
        ¿No tienes cuenta?{" "}
        <button className="enlace" onClick={() => irA("registro")}>Regístrate</button>
      </p>
      <p className="pista">Prueba: biblioteca@colegio.edu.pe o ana@colegio.edu.pe, clave 123456</p>
    </section>
  );
}

/* =====================================================
   PANTALLA: REGISTRO DE USUARIO
   ===================================================== */
function Registro({ usuarios, onRegistrar, volver }) {
  const [f, setF] = useState({ nombre: "", codigo: "", email: "", clave: "", clave2: "" });
  const [errores, setErrores] = useState({});
  const cambiar = (campo) => (e) => setF({ ...f, [campo]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    const er = {};
    const codigo = f.codigo.trim().toUpperCase();
    const email = f.email.trim().toLowerCase();

    if (!f.nombre.trim()) er.nombre = "Campo obligatorio";
    if (!codigo) er.codigo = "Campo obligatorio";
    else if (!codigoValido(codigo)) er.codigo = "Formato incorrecto (ejemplo: E202610)";
    else if (usuarios.some((u) => u.codigo === codigo)) er.codigo = "Ese código ya está registrado";
    if (!email) er.email = "Campo obligatorio";
    else if (!emailValido(email)) er.email = "Formato incorrecto";
    else if (usuarios.some((u) => u.email === email)) er.email = "Ese correo ya está registrado";
    if (!f.clave) er.clave = "Campo obligatorio";
    else if (f.clave.length < 6) er.clave = "Mínimo 6 caracteres";
    if (f.clave2 !== f.clave) er.clave2 = "Las contraseñas no coinciden";

    setErrores(er);
    if (Object.keys(er).length) return;
    onRegistrar({ nombre: f.nombre.trim(), codigo, email, clave: f.clave, rol: "estudiante" });
  };

  return (
    <section className="tarjeta formulario">
      <h1>Crear cuenta de estudiante</h1>
      <form onSubmit={enviar} noValidate>
        <Campo etiqueta="Nombres y apellidos" error={errores.nombre}>
          <input value={f.nombre} onChange={cambiar("nombre")} />
        </Campo>
        <Campo etiqueta="Código de estudiante" error={errores.codigo}>
          <input value={f.codigo} onChange={cambiar("codigo")} placeholder="E202610" />
        </Campo>
        <Campo etiqueta="Correo" error={errores.email}>
          <input value={f.email} onChange={cambiar("email")} />
        </Campo>
        <Campo etiqueta="Contraseña" error={errores.clave}>
          <input type="password" value={f.clave} onChange={cambiar("clave")} />
        </Campo>
        <Campo etiqueta="Repetir contraseña" error={errores.clave2}>
          <input type="password" value={f.clave2} onChange={cambiar("clave2")} />
        </Campo>
        <button className="primario" type="submit">Crear cuenta</button>
      </form>
      <p className="suave">
        <button className="enlace" onClick={volver}>Ya tengo cuenta</button>
      </p>
    </section>
  );
}

/* =====================================================
   PANTALLA: CATÁLOGO (búsqueda en tiempo real)
   ===================================================== */
function Catalogo({ libros, prestamos, irA }) {
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const categorias = ["Todas", ...new Set(libros.map((l) => l.categoria))];

  const q = texto.trim().toLowerCase();
  const resultados = libros.filter(
    (l) =>
      (categoria === "Todas" || l.categoria === categoria) &&
      (l.titulo.toLowerCase().includes(q) || l.autor.toLowerCase().includes(q))
  );

  return (
    <section>
      <h1>Catálogo de libros</h1>
      <div className="filtros">
        <input
          type="search"
          placeholder="Buscar por título o autor"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          aria-label="Buscar libro"
        />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Categoría">
          {categorias.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <p className="suave">{resultados.length} libro(s) encontrado(s)</p>

      {resultados.length === 0 && <p className="vacio">No hay libros con ese criterio. Prueba con otro título o categoría.</p>}

      <div className="rejilla">
        {resultados.map((l) => {
          const stock = stockDisponible(l, prestamos);
          return (
            <button key={l.id} className="libro" onClick={() => irA("detalle", l.id)}>
              <strong>{l.titulo}</strong>
              <span>{l.autor}</span>
              <span className="suave">{l.categoria}</span>
              <span className={stock > 0 ? "chip ok" : "chip alerta"}>
                {stock > 0 ? `${stock} disponible(s)` : "Agotado"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* =====================================================
   PANTALLA: DETALLE DEL LIBRO
   ===================================================== */
function Detalle({ libro, prestamos, usuario, onUnirseCola, irA }) {
  if (!libro) return <p className="vacio">Selecciona un libro desde el catálogo.</p>;
  const stock = stockDisponible(libro, prestamos);
  const esBiblio = usuario.rol === "bibliotecario";
  const posicion = libro.cola.indexOf(usuario.codigo) + 1;
  const vence = aISO(sumarDiasHabiles(hoy(), DIAS_PRESTAMO));

  return (
    <section className="tarjeta">
      <h1>{libro.titulo}</h1>
      <p>{libro.autor}</p>
      <dl className="datos">
        <div><dt>Categoría</dt><dd>{libro.categoria}</dd></div>
        <div><dt>Ubicación</dt><dd>{libro.ubicacion}</dd></div>
        <div><dt>Ejemplares</dt><dd>{libro.total}</dd></div>
        <div><dt>Disponibles</dt><dd>{stock}</dd></div>
        <div><dt>Lista de espera</dt><dd>{libro.cola.length} estudiante(s)</dd></div>
      </dl>

      {stock > 0 ? (
        <p>
          Si lo pides hoy, deberás devolverlo el <strong>{vence}</strong> ({DIAS_PRESTAMO} días hábiles).
        </p>
      ) : (
        <p className="error">Sin ejemplares disponibles por ahora.</p>
      )}

      {!esBiblio && stock > 0 && <p className="suave">Acércate al mostrador de la biblioteca para llevarlo.</p>}

      {!esBiblio && stock === 0 && posicion === 0 && (
        <button className="primario" onClick={() => onUnirseCola(libro.id)}>Unirme a la lista de espera</button>
      )}
      {!esBiblio && posicion > 0 && (
        <p className="chip ok">Estás en la lista de espera, puesto n.º {posicion}</p>
      )}
      {esBiblio && (
        <button className="primario" onClick={() => irA("prestamos")}>Ir a registrar préstamo</button>
      )}
    </section>
  );
}

/* =====================================================
   PANTALLA: PRÉSTAMOS DEL BIBLIOTECARIO
   ===================================================== */
function GestionPrestamos({ libros, prestamos, usuarios, onPrestar, onDevolver }) {
  const [codigo, setCodigo] = useState("");
  const [libroId, setLibroId] = useState("");
  const [errores, setErrores] = useState({});

  const libroSel = libros.find((l) => l.id === Number(libroId));
  const venceVista = libroSel ? aISO(sumarDiasHabiles(hoy(), DIAS_PRESTAMO)) : null;
  const activos = prestamos.filter((p) => !p.devuelto);
  const totalMultas = activos.reduce((s, p) => s + calcularMulta(p.vence), 0);

  const registrar = (e) => {
    e.preventDefault();
    const er = {};
    const cod = codigo.trim().toUpperCase();

    if (!cod) er.codigo = "Campo obligatorio";
    else if (!codigoValido(cod)) er.codigo = "Formato incorrecto (ejemplo: E202601)";
    else if (!usuarios.some((u) => u.codigo === cod)) er.codigo = "No existe un estudiante con ese código";
    if (!libroSel) er.libro = "Selecciona un libro";

    if (!er.codigo && !er.libro) {
      if (stockDisponible(libroSel, prestamos) <= 0) er.libro = "Sin stock disponible de este libro";
      const vencidos = activos.filter((p) => p.codigo === cod && diasRetraso(p.vence) > 0);
      if (vencidos.length > 0) er.codigo = "El estudiante tiene préstamos vencidos y multa pendiente";
    }

    setErrores(er);
    if (Object.keys(er).length) return;
    onPrestar(cod, libroSel.id);
    setCodigo("");
    setLibroId("");
  };

  const devolver = (p) => {
    const libro = libros.find((l) => l.id === p.libroId);
    const m = calcularMulta(p.vence);
    const texto = `¿Confirmar la devolución de "${libro.titulo}"?` + (m > 0 ? `\nMulta a cobrar: ${soles(m)}` : "");
    if (window.confirm(texto)) onDevolver(p.id);
  };

  return (
    <section>
      <h1>Préstamos y devoluciones</h1>

      <div className="tarjeta formulario ancho">
        <h2>Registrar préstamo</h2>
        <form onSubmit={registrar} noValidate>
          <Campo etiqueta="Código del estudiante" error={errores.codigo}>
            <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="E202602" />
          </Campo>
          <Campo etiqueta="Libro" error={errores.libro}>
            <select value={libroId} onChange={(e) => setLibroId(e.target.value)}>
              <option value="">Selecciona un libro</option>
              {libros.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.titulo} ({stockDisponible(l, prestamos)} disp.)
                </option>
              ))}
            </select>
          </Campo>
          {venceVista && (
            <p className="suave">Fecha límite de devolución: <strong>{venceVista}</strong></p>
          )}
          <button className="primario" type="submit">Registrar préstamo</button>
        </form>
      </div>

      <h2>Préstamos activos</h2>
      <p className="suave">Multas pendientes en total: <strong>{soles(totalMultas)}</strong> (tarifa {soles(TARIFA_MULTA)} por día)</p>
      {activos.length === 0 && <p className="vacio">No hay préstamos activos.</p>}
      <div className="tabla-scroll">
        {activos.length > 0 && (
          <table>
            <thead>
              <tr><th>Libro</th><th>Estudiante</th><th>Vence</th><th>Retraso</th><th>Multa</th><th></th></tr>
            </thead>
            <tbody>
              {activos.map((p) => {
                const libro = libros.find((l) => l.id === p.libroId);
                const est = usuarios.find((u) => u.codigo === p.codigo);
                const dias = diasRetraso(p.vence);
                return (
                  <tr key={p.id} className={dias > 0 ? "vencido" : ""}>
                    <td>{libro.titulo}</td>
                    <td>{est ? est.nombre : p.codigo}</td>
                    <td>{p.vence}</td>
                    <td>{dias > 0 ? `${dias} día(s)` : "A tiempo"}</td>
                    <td>{soles(calcularMulta(p.vence))}</td>
                    <td><button className="secundario" onClick={() => devolver(p)}>Registrar devolución</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

/* =====================================================
   PANTALLA: MIS PRÉSTAMOS (estudiante)
   ===================================================== */
function MisPrestamos({ libros, prestamos, usuario }) {
  const mios = prestamos.filter((p) => p.codigo === usuario.codigo).sort((a, b) => b.id - a.id);
  const multaTotal = mios.reduce((s, p) => s + calcularMulta(p.vence, p.devuelto ? deISO(p.devuelto) : hoy()), 0);

  return (
    <section>
      <h1>Mis préstamos</h1>
      <p className="suave">Total de multas: <strong>{soles(multaTotal)}</strong></p>
      {mios.length === 0 && <p className="vacio">Aún no tienes préstamos. Busca un libro en el catálogo.</p>}
      <div className="lista">
        {mios.map((p) => {
          const libro = libros.find((l) => l.id === p.libroId);
          const ref = p.devuelto ? deISO(p.devuelto) : hoy();
          const dias = diasRetraso(p.vence, ref);
          let estado;
          if (p.devuelto) estado = <span className="chip">Devuelto el {p.devuelto}</span>;
          else if (dias > 0) estado = <span className="chip alerta">Vencido hace {dias} día(s) · multa {soles(calcularMulta(p.vence))}</span>;
          else estado = <span className="chip ok">En curso, vence el {p.vence}</span>;
          return (
            <div className="tarjeta fila" key={p.id}>
              <div>
                <strong>{libro.titulo}</strong>
                <div className="suave">Prestado el {p.fecha}</div>
              </div>
              {estado}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* =====================================================
   APLICACIÓN PRINCIPAL
   ===================================================== */
export default function App() {
  const [usuarios, setUsuarios] = useState(USUARIOS_INICIALES);
  const [libros, setLibros] = useState(LIBROS_INICIALES);
  const [prestamos, setPrestamos] = useState(PRESTAMOS_INICIALES);
  const [usuario, setUsuario] = useState(null);

  // Navegación: la "pila" guarda las pantallas visitadas para poder volver
  const [pantalla, setPantalla] = useState("login");
  const [pila, setPila] = useState([]);
  const [libroSel, setLibroSel] = useState(null);
  const [aviso, setAviso] = useState(null);

  const avisar = (tipo, texto) => {
    setAviso({ tipo, texto });
    setTimeout(() => setAviso(null), 3500);
  };

  const irA = (destino, libroId = null) => {
    setPila([...pila, pantalla]);
    setPantalla(destino);
    if (libroId !== null) setLibroSel(libroId);
  };

  const volver = () => {
    const copia = [...pila];
    const anterior = copia.pop();
    setPila(copia);
    setPantalla(anterior);
  };

  const entrar = (u) => {
    setUsuario(u);
    setPila([]);
    setPantalla("catalogo");
    avisar("ok", `Bienvenido, ${u.nombre}`);
  };

  const salir = () => {
    setUsuario(null);
    setPila([]);
    setPantalla("login");
  };

  const registrarUsuario = (nuevo) => {
    setUsuarios([...usuarios, nuevo]);
    setPila([]);
    setPantalla("login");
    avisar("ok", "Cuenta creada. Ya puedes iniciar sesión.");
  };

  const unirseCola = (libroId) => {
    setLibros(libros.map((l) => (l.id === libroId ? { ...l, cola: [...l.cola, usuario.codigo] } : l)));
    avisar("ok", "Te uniste a la lista de espera");
  };

  const prestar = (codigo, libroId) => {
    const fecha = hoy();
    const nuevo = {
      id: prestamos.length + 1,
      libroId,
      codigo,
      fecha: aISO(fecha),
      vence: aISO(sumarDiasHabiles(fecha, DIAS_PRESTAMO)),
      devuelto: null,
    };
    setPrestamos([...prestamos, nuevo]);
    // si el estudiante estaba en la cola de ese libro, sale de ella
    setLibros(libros.map((l) => (l.id === libroId ? { ...l, cola: l.cola.filter((c) => c !== codigo) } : l)));
    avisar("ok", `Préstamo registrado. Vence el ${nuevo.vence}`);
  };

  const devolver = (prestamoId) => {
    const p = prestamos.find((x) => x.id === prestamoId);
    const m = calcularMulta(p.vence);
    setPrestamos(prestamos.map((x) => (x.id === prestamoId ? { ...x, devuelto: aISO(hoy()) } : x)));
    const libro = libros.find((l) => l.id === p.libroId);
    let texto = "Devolución registrada.";
    if (m > 0) texto += ` Multa: ${soles(m)}.`;
    if (libro.cola.length > 0) texto += ` Avisar al siguiente en la cola: ${libro.cola[0]}.`;
    avisar(m > 0 ? "alerta" : "ok", texto);
  };

  const esBiblio = usuario && usuario.rol === "bibliotecario";
  const libro = libros.find((l) => l.id === libroSel);

  return (
    <div className="app">
      <header className="barra">
        <span className="marca">BiblioEscolar</span>
        {usuario && (
          <nav>
            {pila.length > 0 && (
              <button className="nav" onClick={volver}>← Volver</button>
            )}
            <button className={pantalla === "catalogo" ? "nav activo" : "nav"} onClick={() => irA("catalogo")}>
              Catálogo
            </button>
            <button className={pantalla === "prestamos" ? "nav activo" : "nav"} onClick={() => irA("prestamos")}>
              {esBiblio ? "Préstamos" : "Mis préstamos"}
            </button>
            <span className="usuario">{usuario.nombre}</span>
            <button className="nav" onClick={salir}>Salir</button>
          </nav>
        )}
      </header>

      {aviso && (
        <div className={`aviso ${aviso.tipo}`} role="status" aria-live="polite">
          {aviso.texto}
        </div>
      )}

      <main>
        {!usuario && pantalla === "login" && <Login usuarios={usuarios} onLogin={entrar} irA={irA} />}
        {!usuario && pantalla === "registro" && (
          <Registro usuarios={usuarios} onRegistrar={registrarUsuario} volver={volver} />
        )}
        {usuario && pantalla === "catalogo" && <Catalogo libros={libros} prestamos={prestamos} irA={irA} />}
        {usuario && pantalla === "detalle" && (
          <Detalle libro={libro} prestamos={prestamos} usuario={usuario} onUnirseCola={unirseCola} irA={irA} />
        )}
        {usuario && pantalla === "prestamos" && esBiblio && (
          <GestionPrestamos
            libros={libros}
            prestamos={prestamos}
            usuarios={usuarios}
            onPrestar={prestar}
            onDevolver={devolver}
          />
        )}
        {usuario && pantalla === "prestamos" && !esBiblio && (
          <MisPrestamos libros={libros} prestamos={prestamos} usuario={usuario} />
        )}
      </main>
    </div>
  );
}
