# BiblioEscolar - Prototipo RA2

Prototipo de interfaz (React + Vite) del sistema de control de préstamos de la biblioteca escolar.
Curso: Taller de Programación de Aplicaciones - USS.

## Cómo ejecutarlo en Visual Studio Code
1. Instalar Node.js (https://nodejs.org).
2. Abrir esta carpeta en VS Code (Archivo > Abrir carpeta).
3. Abrir la terminal (Ctrl + ñ) y ejecutar:
   ```
   npm install
   npm run dev
   ```
4. Abrir en el navegador la dirección que aparece (normalmente http://localhost:5173).

## Usuarios de prueba (contraseña: 123456)
- Bibliotecario: biblioteca@colegio.edu.pe
- Estudiante (tiene un préstamo vencido): ana@colegio.edu.pe  (código E202601)
- Estudiante: luis@colegio.edu.pe  (código E202602)

## Qué incluye
- Pantallas navegables: inicio de sesión, registro, catálogo, detalle del libro, préstamos.
- Validaciones: campos obligatorios, formato de correo y de código (E + 6 dígitos), stock, multas activas.
- Eventos: búsqueda en tiempo real, filtro por categoría, registrar préstamo y devolución, lista de espera.
- Matemática aplicada: fecha límite con 7 días hábiles, días de retraso, multa (S/ 0.50 por día), stock disponible.
- Estructuras de datos (del RA1): listas (catálogo), pila (historial de navegación), cola (lista de espera).
