// constantes necessárias
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// nova instancia de cliente
// guild é utilizado pela api do discord para servidor
const cliente = new Client({ intents: [GatewayIntentBits.Guilds] });

// o codigo a seguir será rodado APENAS uma vez
// quando o evento CLIENT READY for acionado
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
cliente.once(Events.ClientReady, clientePronto => {
    console.log(`Pronto! Loggado como: ${clientePronto.user.tag}`);
});

// login no discord com o token do bot
cliente.login(token);