// ==========================================
// CANAL DE TELEMETRÍA
// ==========================================

const CHANNEL_ID = "3477786";

const API_URL =
    `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json`;


// ==========================================
// CANAL DE CONTROL REMOTO
// ==========================================

const CONTROL_CHANNEL_ID = "3577409";

// Write API Key del canal de control
const CONTROL_WRITE_API_KEY =
    "BXSZUN501YY5YS06";


// ==========================================
// ELEMENTOS DE LA PÁGINA
// ==========================================

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


// ==========================================
// OBTENER DATOS DE TELEMETRÍA
// ==========================================

async function obtenerDatos() {

    try {

        estadoConexion.textContent =
            "Conectando...";

        const respuesta =
            await fetch(API_URL, {
                cache: "no-store"
            });


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo conectar con ThingSpeak"
            );
        }


        const datos =
            await respuesta.json();


        // ==========================================
        // FIELD 1 - DORMITORIO
        // ==========================================

        if (
            datos.field1 !== null &&
            datos.field1 !== ""
        ) {

            const movimiento =
                Number(datos.field1);


            if (movimiento > 0) {

                movimientoDormitorio.textContent =
                    "🚶 Movimiento detectado";

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


        // ==========================================
        // FIELD 2 - PASILLO
        // ==========================================

        if (
            datos.field2 !== null &&
            datos.field2 !== ""
        ) {

            distanciaPasillo.textContent =
                `${datos.field2} cm`;

        } else {

            distanciaPasillo.textContent =
                "-- cm";
        }


        // ==========================================
        // FIELD 3 - BAÑO
        // ==========================================

        if (
            datos.field3 !== null &&
            datos.field3 !== ""
        ) {

            distanciaBano.textContent =
                `${datos.field3} cm`;

        } else {

            distanciaBano.textContent =
                "-- cm";
        }


        // ==========================================
        // FIELD 4 - ILUMINACIÓN AUTOMÁTICA
        // ==========================================

        if (
            datos.field4 !== null &&
            datos.field4 !== ""
        ) {

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


        // ==========================================
        // FIELD 5 - ESTADO DE ALERTA
        // ==========================================

        if (
            datos.field5 !== null &&
            datos.field5 !== ""
        ) {

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
                    "Estado desconocido";

                estadoAlerta.className =
                    "valor";
            }

        } else {

            estadoAlerta.textContent =
                "Esperando datos...";

            estadoAlerta.className =
                "valor";
        }


        // ==========================================
        // ESTADO DE CONEXIÓN
        // ==========================================

        estadoConexion.textContent =
            "Conectado a ThingSpeak";

        estadoConexion.className =
            "conectado";


        // ==========================================
        // ÚLTIMA ACTUALIZACIÓN
        // ==========================================

        const fecha =
            new Date(datos.created_at);

        ultimaActualizacion.textContent =
            fecha.toLocaleString("es-AR");

    } catch (error) {

        console.error(error);

        estadoConexion.textContent =
            "Error de conexión";

        estadoConexion.className =
            "desconectado";
    }
}


// ==========================================
// CONTROL REMOTO
// ==========================================

async function enviarOrden(valor) {

    try {

        const URL_CONTROL =
            `https://api.thingspeak.com/update?api_key=${CONTROL_WRITE_API_KEY}&field1=${valor}`;


        const respuesta =
            await fetch(URL_CONTROL);


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo enviar la orden"
            );
        }


        const resultado =
            await respuesta.text();


        if (resultado.trim() === "0") {

            throw new Error(
                "ThingSpeak no aceptó la orden"
            );
        }


        if (valor === 1) {

            alert(
                " Orden enviada: ENCENDER"
            );

        } else {

            alert(
                " Orden enviada: APAGAR"
            );
        }

    } catch (error) {

        console.error(error);

        alert(
            "❌ Error al enviar la orden: " +
            error.message
        );
    }
}


// ==========================================
// BOTONES
// ==========================================

function encenderIluminacion() {

    enviarOrden(1);
}


function apagarIluminacion() {

    enviarOrden(0);
}


// ==========================================
// INICIAR
// ==========================================

obtenerDatos();


// Actualizar datos cada 15 segundos

setInterval(
    obtenerDatos,
    15000
);
