const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Retorna informações do servidor'),
    
    async execute(iteration)
    {
        // iteration.guild representa o servidor em que o comando foi executado
        iteration.reply(`O servidor atual se chama ${iteration.guild.name} e possui ${iteration.guild.memberCount} membros`);
    }
};