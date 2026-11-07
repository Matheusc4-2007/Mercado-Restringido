# Mercado Restringido, mini-proyecto basado en Mercado Libre
###### E-Actividad 2.1 FrontEndII 2026C. *Universidad Valle del Momboy*

> **Alumnos:**
> - José Godoy V-32.006.867
> - Nelson Sandoval V-32.066.084
> - Sergio Cuevas V-32.268.736

Este proyecto utiliza React y TailwindCSS para su construcción. 

## Instalación y ejecución

### Requisitos

- [Node.js](https://nodejs.org) 20.19 o superior (LTS)
- MySQL o MariaDB (por ejemplo, con [XAMPP](https://www.apachefriends.org))
- Un navegador y un gestor de paquetes (npm o pnpm)

### 1. Clonar el repositorio

```bash
git clone https://github.com/Matheusc4-2007/Mercado-Restringido.git
cd Mercado-Restringido
```

### 2. Base de datos

1. Inicia el módulo **MySQL** en XAMPP.
2. Abre phpMyAdmin (`http://localhost/phpmyadmin`). Si tenías una versión anterior de la base, elimínala.
3. Ve a **Importar** y carga `database/MercadoRestringido_completo.sql`. Esto crea la base `MercadoRestringido` con su estructura y datos de ejemplo.
   - Si prefieres la estructura sin datos, usa `database/MercadoRestringido.sql`.
   - Si ya tienes una base de la versión anterior y quieres conservar sus datos, ejecuta una sola vez `database/migracion_categorias.sql`.

### 3. Backend

```bash
cd server
npm install
```

Crea un archivo `.env` dentro de la carpeta `server` con este contenido:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=MercadoRestringido
```

> Estos valores son los de XAMPP por defecto (usuario `root` sin contraseña). Si tu MySQL tiene otra configuración, ajústalos.

Inicia el servidor:

```bash
node app.js
```

Debe mostrar: `Servidor corriendo en http://localhost:3000`

### 4. Frontend

En **otra terminal**:

```bash
cd client
npm install
npm run dev
```

Abre `http://localhost:5173` en el navegador.

> Vite redirige las peticiones `/api` a `http://localhost:3000`, así que el backend debe estar corriendo en ese puerto. Si cambias el `PORT`, ajusta `client/vite.config.js`.

### Usuarios de prueba

El inicio de sesión se hace solo con la cédula:

| Cédula     | Rol           |
|------------|---------------|
| `0000000`  | Administrador |
| `12345678` | Vendedor      |
| `23456789` | Vendedor      |
| `34567890` | Cliente       |

### Comandos útiles (carpeta `client`)

- `npm run build`: compila para produc
