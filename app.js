const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');


const mostrarMenu = async (flowDynamic) => {
    await flowDynamic(
        `📌 *¿Cómo podemos ayudarte hoy?*  
Elige una opción escribiendo el número correspondiente:

1️⃣ Información General  
2️⃣ Ver Productos  
3️⃣ Promociones  
4️⃣ Pedidos y Precios  
5️⃣ Consultar Estado de Pedido  
6️⃣ Modificar un Pedido  
7️⃣ Reclamos y Soporte  
8️⃣ Salir`
    );
};


const flowPrincipal = addKeyword(["Hola", "Buenas", "ola", "."])
    .addAnswer('👋 ¡Hola! Bienvenid@ a *Fercementos*! 😊', { delay: 500 }, async (_, { flowDynamic }) => {
        await mostrarMenu(flowDynamic);
    })
    .addAnswer('Escribe el número de la opción que deseas:', { capture: true }, async (ctx, { flowDynamic, fallBack }) => {
        const opcion = ctx.body.trim();

        const respuestas = {
            '1': '📌 *Información General:* \nHorarios, teléfonos, direcciones y redes sociales.',
            '2': '🛍️ *Catálogo Web:* \nConsulta nuestro catálogo de productos en el siguiente enlace: \n👉 [Ver Catálogo](https://fercementos-portafolio.vercel.app/)',
            '3': '🎉 *Promociones:* \nOfertas de la semana y del mes.',
            '4': '💰 *Pedidos y Precios:* \nSolicita información sobre precios o haz tu pedido.',
            '5': '🚚 *Estado de Pedido:* \nDinos tu nombre y punto de entrega para rastrearlo.',
            '6': '✏️ *Modificar Pedido:* \nIndícanos qué cambios necesitas.',
            '7': '📢 *Reclamos y Soporte:* \nExplícanos tu inconveniente para ayudarte.',
            '8': '👋 *¡Gracias por contactarnos!* \nNos despedimos. Si necesitas ayuda en el futuro, no dudes en escribirnos nuevamente. ¡Hasta pronto! 😊',
        };

        if (respuestas[opcion]) {
            await flowDynamic(respuestas[opcion]);

            if (opcion === '8') {
                return;  // No hacemos nada más, permitimos que el usuario vuelva a escribir cuando quiera
            }
        } else {
            return fallBack('❌ Opción no válida. Por favor, elige un número del 1 al 8.');
        }
    });

// Flujo de reinicio si el usuario vuelve a escribir después de salir
const flowReinicio = addKeyword(["Hola", "Buenas", "ola", "."])
    .addAnswer('👋 ¡Hola de nuevo! 😊', { delay: 500 }, async (_, { flowDynamic }) => {
        await mostrarMenu(flowDynamic);
    });

// Flujo de inactividad
const flowInactividad = addKeyword([])
    .addAnswer(
        '⌛ No hemos recibido ninguna respuesta en los últimos 2 minutos. Si necesitas más ayuda, vuelve a escribirnos. ¡Hasta pronto! 😊',
        { delay: 120000 }
    );

// Configuración del bot
const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterProvider = createProvider(BaileysProvider);
    const adapterFlow = createFlow([flowPrincipal, flowReinicio, flowInactividad]);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();









