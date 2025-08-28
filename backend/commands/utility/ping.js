const { SlashCommandBuilder } = require('discord.js');
// slash commands precisam ter um nome e uma descrição
// os nomes precisam ter 1 a 32 characteres, sem letra maiuscula, sem espaços, só com - ou _

// este é o arquivo que contem sua funcão e funcionalidade
// ele precisa de um handler, que vai executar dinamicamente com base no evento acionado
// e um deployment script, que vai registrar os comandos no discord e mostrar na interface

module.exports = {
    // fornece a definição do comando que vai ser registrado pelo discord
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('retorna "Ouvindo!"'),
    
    // metodo que será executado quando o evento for acionado
    async execute(interation)
    {
        await interation.reply('Ouvindo!');
    }
    
};
