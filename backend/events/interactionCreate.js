const { Events, MessageFlags, Collection, time } = require('discord.js');
const { cooldown } = require('../commands/utility/ping');

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

        // a interação irá checar por cooldowns
        // será associado o id do usuario (chave) e a ultima vez que o usuario usou o comando especificado (valor)
        const { cooldowns }  = interation.client;

        // cheque se dentro da coleção cooldowns existe o comando acionado
        if(!cooldowns.has(command.data.name))
        {
            // se não existir, crie e crie uma nova coleção vazia
            // pois ele foi acionado
            cooldowns.set(command.data.name, new Collection());
        };
        // se o comando já existe na coleção de cooldowns, significa que ele pode ainda está no período de cooldown
        // busque pelo horario atual, o nome do comando acionado, e o cooldown especificado
        const horario_atual = Date.now();
        // diz respeito a uma entrada na coleção de id de usuario e o par chave/valor do horario do comando acionado
        const timestamps = cooldowns.get(command.data.name);
        const cooldown_padrao = 3;
        // o cooldown especificado será o parametro cooldown em command
        // caso não exista ou seja nulo, ee irá retornar o cooldown padrao
        // é isso o que o operador ?? faz
        // (fonte: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
        
        // após obter o cooldown, ele multiplca por 1000 para converter de segundos para milisegundos
        // 1000 ou 1_000 são iguais. 1_000 apenas é mais legivel
        const cooldown_especificado = (command.cooldown ?? cooldown_padrao) * 1_000;

        if(timestamps.has(interation.user.id))
        {
            // o tempo é calculado pelo tempo da ultima vez que o usuario usou o comando + o cooldown do comando
            // o caminho lógico para obter a ultima vez que o usuario usou o comando será cooldowns > command > user > timestamp
            const tempo_expirado = timestamps.get(interation.user.id) + cooldown_especificado;

            // caso o tempo expirado seja maior, significa que o comando ainda está em cooldown
            if(horario_atual < tempo_expirado)
            {
                const tempo_restante = tempo_expirado / 1000;
                return interation.reply({ content: `Opa, o comando ${command.data.name} está em cooldown! Use em <t:${tempo_restante}:R>`, flags: MessageFlags.Ephemeral });
            };
        };

        timestamps.set(interation.user.id, horario_atual);
        // a função setTimeout irá executar a função após o tempo descrito pelo cooldown_especificado
        // a função executada irá retirar a entrada, já que o cooldown acabou
        setTimeout(() => timestamps.delete(interation.user.id), cooldown_especificado);


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