const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('user')
            .setDescription('Retorna usuário acionou o comando'),
        
    async execute(interation)
    {
        // iteration.user diz respeito ao usuario que acionou o comando
        // iteration.member representa o usuario no servidor especifico 
        await interation.reply(`Comando acionado por ${interation.user.username}, ativo desde ${interation.member.joinedAt}`);
    }
};