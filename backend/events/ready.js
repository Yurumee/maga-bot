const { Events } = require('discord.js');

// o codigo a seguir será rodado APENAS uma vez
// quando o evento CLIENT READY for acionado

// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.

// a propriedade "name" diz respeito ao evento desejado 
// a propriedade "once" diz se o evento deve ser executado apenas uma vez (true) ou não (false)
// caso seja false, não é obrigatório estar explícito
// a função execute fará a lógica desejada sempre que o evento for chamado

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(clientePronto)
    {
        console.log(`Pronto! Loggado como: ${clientePronto.user.tag}`);
    }
}