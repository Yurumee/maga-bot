// os comandos slash apenas precisam ser registrados uma vez
// o bot precisa do escopo applications.commands autorizado num servidor para os comandos aparecerem e serem registrados sem erros
// comandos slash podem ser registrados para servidores globalmente ou apenas um servidor específico
// é ideal um servidor especifico antes do deploy global

// existe um limite diario de criações de comandos slash
// por isso não é recomendado conectar o cliente inteiro ou fazer isso em todos os eventos de ready
// o ideal é um script standalone usando REST manager (no caso, este!)

// este script roda separadamente, apenas quando precisar modificar as definições de um slash command
// ele permite modificar partes do comando (como as funções de execute), o quanto desejar 
// sem a necessidade de redeploy toda vez

const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// busca por todos os diretorios de comandos
const folderPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(folderPath);

for (const pasta of commandFolders)
{
    // busca pelos arquivos dentro de cada pasta 
    // busca pelos arquivos que terminam com .js
    const commandsPath = path.join(folderPath, pasta);
    const commandsFile = fs.readdirSync(commandsPath).filter(arq => arq.endsWith('.js'));

    for (const arquivo of commandsFile)
    {
        // busca os arquivos dentro da pasta
        const filePath = path.join(commandsPath, arquivo);
        const command = require(filePath);

        // busca o slashcommandbuilder para cada arquivo e o carrega no array criado para salvar
        if ('data' in command && 'execute' in command)
        {
            commands.push(command.data.toJSON());
        }
        else
        {
            console.error(`ERRO: O comando em ${filePath} não pode ser carregado. 'data' ou 'execute' não existe`);
        };

    };
};

// constroi e prepara para o modulo REST
// entrega o token que deve ser usado para autenticações
const rest = new REST().setToken(token);

// realiza deploy
(async () => 
    {
        try
        {
            console.log(`Realizando atualizações de ${commands.length} (/) comandos da aplicação...`)

            // put é usado pra recarregar todos os comandos no servidor especificado
            // passamos o cliente e o servidor desejado
            // passamos os comandos
            const data = await rest.put
                            (
                                Routes.applicationGuildCommands(clientId, guildId),
                                { body: commands }
                            );

            // DEPLOY GLOBAL
            // const global_data = await rest.put
            //                         (
            //                             Routes.applicationCommands(clientId),
            //                             { body: commands }
            //                         );

            console.log(`${commands.length} (/) comandos recarregados com sucesso`);
        }
        catch (error)
        {
            console.error(error);
        };
    }
)();