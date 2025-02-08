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

const flowDespedida = addKeyword(['gracias', 'adios'])
.addAnswer('👋 ¡Gracias por contactarnos! Si necesitas más ayuda, escríbenos nuevamente. 😊');

const flowPrincipal = addKeyword(["Hola", "Buenas", "ola", "."])
    .addAnswer('👋 ¡Hola! Bienvenid@ a *Fercementos*! 😊', { delay: 500 }, async (_, { flowDynamic }) => {
        await mostrarMenu(flowDynamic);
    })
    .addAnswer('Escribe el número de la opción que deseas:', { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
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

        if (opcion === '8') {
            await flowDynamic(respuestas[opcion]);
            return gotoFlow(flowDespedida); // <-- Cierra la conversación
        } 
        else if (respuestas[opcion]) {
            await mostrarMenu(flowDynamic); // <-- Muestra el menú nuevamente
            return; 
        } 
        else {
            return fallBack('❌ Opción inválida. Escribe un número del 1 al 8:');
        }
    });

// Configuración del bot
const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterProvider = createProvider(BaileysProvider);
    const adapterFlow = createFlow([flowPrincipal, flowDespedida]);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();









