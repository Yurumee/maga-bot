// constantes necessárias pro cliente
// constantes pra flag de mensagem 
const { Client, Events, GatewayIntentBits, Collection, MessageFlags } = require('discord.js');
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
            console.log(`[ERRO] o comando em ${caminhoArq} não pôde ser carregado. 'data' ou 'execute' inexistente!`)
        };
    };

};

// quando uma iteração for criada, chama esse evento
cliente.on(Events.InteractionCreate, async iteration =>
    {
        // se não for um comando de chat (slash), saia
        if (!iteration.isChatInputCommand())
            return;

        // se for, mostra a iteração
        console.log(iteration)
    });

// o codigo a seguir será rodado APENAS uma vez
// quando o evento CLIENT READY for acionado
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
cliente.once(Events.ClientReady, clientePronto => 
    {
        console.log(`Pronto! Loggado como: ${clientePronto.user.tag}`);
    });

// login no discord com o token do bot
cliente.login(token);