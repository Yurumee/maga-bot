// constantes necessárias pro cliente
// constantes pra flag de mensagem 
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');
// utilizado para ler a pasta commands e identificar comandos
const fs = require('node:fs');
// ajuda a construir o caminho pros arquivos e diretórios 
const path = require('node:path');

// nova instancia de cliente
// guild é utilizado pela api do discord para servidor
const cliente = new Client({ intents: [GatewayIntentBits.Guilds] });

// permite acessar comandos em outros arquivos
// Collection() extende a função nativa JS Map() e inclui coisas a mais
// ela é usada para armazenar e recuperar comandos eficientemente para serem executados
cliente.commands = new Collection();

// junta o nome do diretorio atual + o que vier entre aspas
const folderPath = path.join(__dirname, 'commands');
// lê o conteúdo do diretório passado
const commandFolders = fs.readdirSync(folderPath);

// para cada pasta lida do diretório "raiz" delas
for(const pasta of commandFolders)
{
    // procura por subpastas
    const comandoPasta = path.join(folderPath, pasta);
    // e lê seu conteúdo, buscando por arquivos terminados em .js
    const comandoArquivos = fs.readdirSync(comandoPasta).filter(arq => arq.endsWith('.js'));
    
    // para cada arquivo encontrado
    for(const arquivo of comandoArquivos)
    {
        // o caminho até ele
        const caminhoArq = path.join(comandoPasta, arquivo);
        const command = require(caminhoArq);

        // se o arquivo tiver o data e o que deve ser executado
        // guarde o comando
        if('data' in command && 'execute' in command)
        {
            cliente.commands.set(command.data.name, command);
        } 
        else 
        {
            // senão, mostre a mensagem de erro
            console.log(`ERRO: O comando em ${caminhoArq} não pôde ser carregado. 'data' ou 'execute' inexistente!`)
        };
    };

};

// A LOGICA PARA CRIAÇÃO DE INTERAÇÕES FOI MOVIDA PARA INTERACTIONCREATE.JS

// busca a pasta desejada, e busca arquivos entro dela que estejam terminados em .js
const eventsPath = path.join(__dirname, 'events');
const eventsFiles = fs.readFileSync(eventsPath).filter(file => file.endsWith('.js'));

for(const file of eventsFiles)
{
    const caminhoArquivo = path.join(eventsPath, file);
    const event = require(caminhoArquivo);

    // os metodos .once e .on recebem dois argumentos
    // o nome do evento e uma função callback
    // nos arquivos dentro de "events" isso está como name e execute

    // as funções callback são funções passadas dentro de outra função
    // elas servem para completar ações ou rotinas
    // no nosso caso, precisamos de uma função para executar apenas uma vez ou múltiplas vezes, 
    // que então irá chamar as funções callback que irão executar a lógica propriamente dita

    // a função callback recebe os argumentos por meio de ...args
    // a sintaxe ... permite receber uma quantidade indefinida de argumentos 
    // (e args é apenas o nome escolhido, poderia ser qualquer outro)
    // funções diferentes terão uma quantidade de argumentos diferentes que não se dá para prever 
    // portanto usa-se os ...
    // args é um array de argumentos 
    // (fonte: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) 
    if(event.once)
    {
        // fora, ...args é um rest parameter
        // dentro de execute() ...args é um spread syntax
        // a diferença é que, dentro de execute(), ele irá permitir iteráveis (arrays, strings..) sejam expandidos para onde é necessário 0 ou muitos argumentos 
        // (fonte: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        cliente.once(event.name, (...args) => event.execute(...args));
    }
    else
    {
        cliente.on(event.name, (...args) => event.execute(...args));
    }
}

// A LOGICA PARA PREPARAR UM CLIENTE FOI MOVIDA PARA READY.JS

// login no discord com o token do bot
cliente.login(token);