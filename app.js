const CHANNEL_ID = "3477786";

const API_URL =
    `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json`;

// ==========================
// ELEMENTOS DE LA PÁGINA
// ==========================

const movimientoDormitorio =
    document.getElementById("movimientoDormitorio");

const distanciaPasillo =
    document.getElementById("distanciaPasillo");

const distanciaBano =
    document.getElementById("distanciaBano");

const iluminacion =
    document.getElementById("iluminacion");

const estadoAlerta =
    document.getElementById("estadoAlerta");

const estadoConexion =
    document.getElementById("estadoConexion");

const ultimaActualizacion =
    document.getElementById("ultimaActualizacion");

async function obtenerDatos() {

    try {
        estadoConexion.textContent = "Conectando...";

        const respuesta = await fetch(API_URL, {
            cache: "no-store"
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo conectar con ThingSpeak");
        }

        const datos = await respuesta.json();

        // ==========================
        // FIELD 1 - DORMITORIO PIR
        // ==========================

        if (datos.field1 !== null && datos.field1 !== "") {

            const movimiento = Number(datos.field1);

            if (movimiento > 0) {
                movimientoDormitorio.textContent =
                    "Movimiento detectado";

                movimientoDormitorio.className =
                    "valor detectado";

            } else {
                movimientoDormitorio.textContent =
                    "Sin movimiento";

                movimientoDormitorio.className =
                    "valor sin-movimiento";
            }

        } else {
            movimientoDormitorio.textContent =
                "Sin datos";

            movimientoDormitorio.className =
                "valor";
        }

        // ==========================
        // FIELD 2 - PASILLO
        // ==========================

        if (datos.field2 !== null && datos.field2 !== "") {

            distanciaPasillo.textContent =
                `${datos.field2} cm`;

        } else {
            distanciaPasillo.textContent =
                "-- cm";
        }

        // ==========================
        // FIELD 3 - BAÑO
        // ==========================

        if (datos.field3 !== null && datos.field3 !== "") {

            distanciaBano.textContent =
                `${datos.field3} cm`;

        } else {
            distanciaBano.textContent =
                "-- cm";
        }

        // ==========================
        // FIELD 4 - ILUMINACIÓN
        // ==========================

        if (datos.field4 !== null && datos.field4 !== "") {

            const estadoLuz =
                Number(datos.field4);

            if (estadoLuz === 1) {

                iluminacion.textContent =
                    "💡 Iluminación encendida";

                iluminacion.className =
                    "valor detectado";

            } else {

                iluminacion.textContent =
                    "Iluminación apagada";

                iluminacion.className =
                    "valor sin-movimiento";
            }

        } else {

            iluminacion.textContent =
                "Sin datos";

            iluminacion.className =
                "valor";
        }

        // ==========================
        // FIELD 5 - ESTADO DE ALERTA
        // ==========================

        if (datos.field5 !== null && datos.field5 !== "") {

            const alerta =
                Number(datos.field5);

            if (alerta === 0) {

                estadoAlerta.textContent =
                    "🟢 Estado normal";

                estadoAlerta.className =
                    "valor alerta-normal";

            } else if (alerta === 1) {

                estadoAlerta.textContent =
                    "🟡 PREAVISO - Verificar situación";

                estadoAlerta.className =
                    "valor alerta-preaviso";

            } else if (alerta === 2) {

                estadoAlerta.textContent =
                    "🔴 ALERTA CRÍTICA - Requiere atención";

                estadoAlerta.className =
                    "valor alerta-critica";

            } else {

                estadoAlerta.textContent =
                    "Estado de alerta desconocido";

                estadoAlerta.className =
                    "valor";
            }

        } else {

            estadoAlerta.textContent =
                "Esperando datos de alerta...";

            estadoAlerta.className =
                "valor";
        }

        // ==========================
        // CONEXIÓN
        // ==========================

        estadoConexion.textContent =
            "Conectado a ThingSpeak";

        estadoConexion.className =
            "conectado";

        // ==========================
        // ÚLTIMA ACTUALIZACIÓN
        // ==========================

        const fecha =
            new Date(datos.created_at);

        ultimaActualizacion.textContent =
            fecha.toLocaleString("es-AR");

    } catch (error) {

        console.error("Error:", error);

        estadoConexion.textContent =
            "Error de conexión";

        estadoConexion.className =
            "desconectado";
    }
}

// Ejecutar al abrir
obtenerDatos();

// Actualizar cada 15 segundos
setInterval(obtenerDatos, 15000);
