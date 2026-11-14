// ==========================
// CONTROL REMOTO DE LA LUZ
// ==========================

async function controlarLuz(estado) {

    try {

        const url =
            `https://api.thingspeak.com/update?api_key=${CONTROL_WRITE_API_KEY}&field1=${estado}`;

        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error("No se pudo enviar la orden");
        }

        const resultado = await respuesta.text();

        // ThingSpeak devuelve 0 cuando no pudo guardar la actualización
        if (resultado === "0") {
            throw new Error("ThingSpeak no pudo guardar la orden");
        }

        alert(
            estado === 1
                ? "💡 Orden enviada: Encender iluminación"
                : "🌙 Orden enviada: Apagar iluminación"
        );

    } catch (error) {

        console.error("Error:", error);

        alert("❌ Error al enviar la orden: " + error.message);
    }
}


function encenderLuz() {
    controlarLuz(1);
}


function apagarLuz() {
    controlarLuz(0);
}
