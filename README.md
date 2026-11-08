# Inventario Gambirasi

App web (PWA) de inventario de bodega: funciona sin señal y se sincroniza con OneDrive al volver internet.

- Este repositorio contiene **solo el código**. Los datos del inventario no están aquí: viven en el OneDrive privado del usuario (carpeta `Aplicaciones/Inventario Gambirasi`).
- Acceso a OneDrive con permiso mínimo `Files.ReadWrite.AppFolder` (la app no puede ver el resto del OneDrive).
- Al subir una versión nueva de `index.html`, cambia `VERSION` en `sw.js`.
