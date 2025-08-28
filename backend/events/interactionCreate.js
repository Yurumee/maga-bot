const { Events, MessageFlags } = require('discord.js');

// quando uma interação for criada, chama esse evento

// a propriedade "name" diz respeito ao evento desejado 
// a propriedade "once" diz se o evento deve ser executado apenas uma vez (true) ou não (false)
// caso seja false, não é obrigatório estar explícito
// a função execute fará a lógica desejada sempre que o evento for chamado

module.exports = {
   name: Events.InteractionCreate,
//    once: false,
    async execute(interation)
    {
        // se não for um comando de chat (slash), saia
        if (!interation.isChatInputCommand())
        {
            return;
        };

        // pega o comando correspondente da interação
        const command = interation.client.commands.get(interation.commandName);
        
        // se o comando não existir
        if (!command)
        {
            console.error(`ERRO: O comando ${interation.commandName} não existe.`);
            return;
        };

        // caso exista, ele tenta chamar o metodo execute daquela interação
        try
        {
            await command.execute(interation)
        }
        // em caso de falha, ele retorna um log de erro
        catch (error)
        {
            console.error(`ERRO: ${error}`);
            if (interation.replied || interation.deferred)
            {
                await interation.followUp({
                                    content: 'Houve um erro executando este comando', 
                                    flags: MessageFlags.Ephemeral
                                    });
            }
            else
            {
                await interation.reply({
                                    content: 'Houve um erro executando este comando',
                                    flags: MessageFlags.Ephemeral
                                    });
            }

        };
    }

}   