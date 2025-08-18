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

