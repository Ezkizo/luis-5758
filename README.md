# Snail Race

Aplicación Fullstack (Node.js + Express + React) que integra un flujo completo de autenticación y una simulación de pasarela de pagos (SnailPay).

## Requisitos Previos

- Node.js (v20 o superior)
- `pnpm` (v11+)

## Instalación y Ejecución Local

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/Ezkizo/luis-5758
   cd luis-5758
   ```

2. **Instalar dependencias en el monorepo:**

   ```bash
   pnpm install
   ```

3. **Ejecutar en Entorno de Desarrollo:**

   Basado en el ejemplo puesto en `server/.env.example` es necesario crear un archivo `.env` con los datos de prueba.

   *Nota sobre el puerto en desarrollo:* Por defecto, el entorno local de Vite asume que la API de Express corre en el puerto 3000. Si por alguna razón el puerto 3000 está ocupado y se configura uno distinto en el `.env` (ej. PORT=4000), se debe actualizar temporalmente la configuración del proxy en el archivo `client/vite.config.ts` (`target: 'http://localhost:4000'`) para evitar errores de conexión. En producción (Heroku) esto no es necesario, ya que ambos ecosistemas se sirven bajo el mismo puerto.
   
   Inicia el servidor Vite y la API de Express simultáneamente con recarga en caliente:

   ```bash
   pnpm run dev
   ```

   * **Frontend:** `http://localhost:5173`
   * **Backend:** `http://localhost:3000` (o el puerto elegido)


## Ejecución de Pruebas Unitarias

Se implementaron pruebas unitarias sobre la capa de servicios (`snailpay.service`) utilizando Vitest para garantizar la fiabilidad del procesamiento de pagos.

Para ejecutar las pruebas:

```bash
# Desde la raíz del proyecto:
pnpm --filter server test
```

## Datos de Prueba para SnailPay

El sistema soporta recargas utilizando los siguientes datos para simular los tres escenarios requeridos por la rúbrica.

| Escenario              | CVV                                | Monto Permitido     | Resultado Esperado  |
| :--------------------- | :--------------------------------- | :------------------ | :------------------ |
| **Aprobada**           | `Cualquiera exceptuando 000 y 999` | **Cualquier monto** | (Saldo actualizado) |
| **Rechazada** (Fondos) | `000`                              | **Cualquier monto** | (Saldo NO cambia)   |
| **Error Sistema**      | `999`                              | **Cualquier monto** | (Saldo NO cambia)   |

_Nota: Cualquier combinación de número de tarjeta y fecha es válida. No se recomienda ingresar datos auténticos pues, de acuerdo al requerimiento, el número de tarjeta y el CVV son almacenados en localStorage._
