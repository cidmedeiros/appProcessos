/* LEGENDAS
    * ator: 0 -> Manual ; 1 -> Automático; 2-> Manual/Automático;
    * promocao: 0 -> não; 1 -> sim;
    * implicado: 0 -> SPE; 1 -> Colaborador Associado; 2 -> Bolsista; 3 -> Procuradoria Federal; 4 -> Coordenador; 5 -> Diretoria Executiva; 7 -> DGES;
    * disponibilidade: 0 -> Indisponível ; 1 -> Permanente; 2 -> Condicional;
    * prazo: medido em dias;
    * gatilho: 0 -> n'ao possui posição processual alvo; X -> o gatilho é o codAuto e o prazo de outra posição processual;
    * codAuto: id único caso a posição processual seja o gatilho de outra;
 */

[
    {
        codAuto: 1,
        posicao: 'Disponibilizado SPE',
        promocao: 0,
        implicado: 0,
        significado: 'Enviado para o SPE para inserção de documentação pela 1ª vez.',
        disponibilidade: 2,
        condDispo: 'Não ter passado por esse ponto nenhuma vez.',
        prazo: 2,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 2,
        posicao: 'Análise Inicial de Documentos',
        promocao: 1,
        implicado: 1,
        significado: 'Pendente de análise inicial de regularidade formal da documentação enviada.',
        disponibilidade: 0,
        condDispo: 'não se aplica',
        prazo: 0,
        gatilho: [{codAuto: 1}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 3,
        posicao: 'Notificar Correção/Complementação Documental',
        promocao: 0,
        implicado: 1,
        significado: 'Notificação sobre correção ou complementação da documentação pendente de envio.',
        disponibilidade: 1,
        condDispo: 'não se aplica',
        prazo: 0,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 4,
        posicao: 'Aguardando Retorno Documentação Complementar/Corretiva',
        promocao: 0,
        implicado: 2,
        significado: 'A notificação de correção/complementação assinada pela coordenação geral foi enviada por e-mail e ao SPE para envio físico.',
        disponibilidade: 1,
        condDispo: 'não se aplica',
        prazo: 30,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 5,
        posicao: 'Notificar Situação de Irregularidade - 1ª Ocorrência',
        promocao: 0,
        implicado: 1,
        significado: 'Primeira notificação de irregularidade pendente de envio.',
        disponibilidade: 2,
        condDispo: 'Não ter passado por esse ponto nenhuma vez.',
        prazo: 0,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 6,
        posicao: 'Notificar Situação de Irregularidade - 2ª Ocorrência',
        promocao: 0,
        implicado: 1,
        significado: 'Segunda notificação de irregularidade pendente de envio. Se possível, utilizando outro endereço mais uma outra forma de contato.',
        disponibilidade: 2,
        condDispo: 'Ter sido feita a primeira notificação + não ter passado por esse ponto nenhuma vez.',
        prazo: 0,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 7,
        posicao: 'Aguardando Justificativa/Devolução',
        promocao: 0,
        implicado: 2,
        significado: 'A notificação de irrregularidade assinada pela coordenação geral foi enviada por e-mail e ao SPE para envio físico.',
        disponibilidade: 2,
        condDispo: 'Não ter passado por esse ponto nenhuma vez.',
        prazo: 30,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 8,
        posicao: 'Justificativa Aguardando Análise',
        promocao: 0,
        implicado: 1,
        significado: 'Identificou-se a entrada da justificativa no SEI, mas a análise ainda não foi feita.',
        disponibilidade: 2,
        condDispo: 'Não ter passado por esse ponto nenhuma vez.',
        prazo: 0,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 9,
        posicao: 'Notificar Indeferimento - Justificativa',
        promocao: 0,
        implicado: 1,
        significado: 'Enviar notificação de indeferimento da justificativa.',
        disponibilidade: 2,
        condDispo: 'Não ter passado por esse ponto nenhuma vez.',
        prazo: 0,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 10,
        posicao: 'Encerrado',
        promocao: 0,
        implicado: 6,
        significado: 'A notificação de deferimento da justificativa/recurso assinada pela coordenação geral foi enviada por e-mail e ao SPE para envio físico.',
        disponibilidade: 1,
        condDispo: 'não se aplica',
        prazo: 0,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 11,
        posicao: 'Aguardando Retorno de Recurso/Devolução',
        promocao: 0,
        implicado: 2,
        significado: 'A notificação de indeferimento da justificativa assinada pela coordenação geral foi enviada por e-mail e ao SPE para envio físico.',
        disponibilidade: 2,
        condDispo: 'Notificar Indeferimento - Justificativa + Não ter passado por esse ponto nenhuma vez.',
        prazo: 30,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 12,
        posicao: 'Recurso Aguardando Análise',
        promocao: 0,
        implicado: 1,
        significado: 'Identificou-se a entrada do recurso no SEI, mas a análise ainda não foi feita.',
        disponibilidade: 2,
        condDispo: 'Notificar Indeferimento - Justificativa + Não ter passado por esse ponto nenhuma vez.',
        prazo: 0,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 13,
        posicao: 'Notificar Indeferimento - Recurso',
        promocao: 0,
        implicado: 1,
        significado: 'Notificar Indeferimento - Justificativa + Não ter passado por esse ponto nenhuma vez.',
        disponibilidade: 2,
        condDispo: 'Não ter passado por esse ponto nenhuma vez.',
        prazo: 0,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 14,
        posicao: 'Aguardando Restituição após Recurso',
        promocao: 0,
        implicado: 2,
        significado: 'A notificação de indeferimento do recurso assinada pela diretoria foi enviada por e-mail e ao SPE para envio físico.',
        disponibilidade: 2,
        condDispo: 'Não ter passado por esse ponto nenhuma vez.',
        prazo: 30,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 15,
        posicao: 'Enviar ao Setor de Cobrança para Inscrição no CADIN',
        promocao: 1,
        implicado: 1,
        significado: 'O bolsista não se manifestou em algum ponto do processo + segunda notificação + 30 dias.',
        disponibilidade: 0,
        condDispo: 'não se aplica',
        prazo: 0,
        gatilho: [{codAuto: 4}, {codAuto: 7}, {codAuto: 11}, {codAuto: 14}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 16,
        posicao: 'Enviado ao Setor de Cobrança para Inscrição no CADIN',
        promocao: 0,
        implicado: 7,
        significado: 'Enviado para DGES para providências de inscrição no CADIN.',
        disponibilidade: 2,
        condDispo: 'Ter sido feita a segunda notificação + 30 dias na posição Sem Retorno.',
        prazo: 0,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 17,
        posicao: 'Suspensão Judicial',
        promocao: 0,
        implicado: 3,
        significado: 'Processo judicializado com ordem de suspensão emitida por juiz de direito.',
        disponibilidade: 1,
        condDispo: 'não se aplica',
        prazo: 0,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 18,
        posicao: 'Consultar Procuradoria Federal',
        promocao: 0,
        implicado: 4,
        significado: 'A resposta do bolsista exige esclarecimentos de ordem jurídica.',
        disponibilidade: 1,
        condDispo: 'não se aplica',
        prazo: 0,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 19,
        posicao: 'Encaminhado Procuradoria Federal',
        promocao: 0,
        implicado: 3,
        significado: 'A consulta à PF foi assinada pela diretoria e o processo encaminhado para PF.',
        disponibilidade: 2,
        condDispo: 'Consultar Procuradoria Federal',
        prazo: 20,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 20,
        posicao: 'Atraso Procuradoria Federal',
        promocao: 1,
        implicado: 3,
        significado: 'Passou-se 20 dias desde o envio da consulta à PF.',
        disponibilidade: 0,
        condDispo: 'não se aplica',
        prazo: 0,
        gatilho: [{codAuto: 19}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 21,
        posicao: 'Consultar Diretoria Executiva da Capes',
        promocao: 0,
        implicado: 4,
        significado: 'A resposta do bolsista exige decisão administrativa superior.',
        disponibilidade: 1,
        condDispo: 'não se aplica',
        prazo: 0,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 22,
        posicao: 'Encaminhado Diretoria Executiva da Capes',
        promocao: 0,
        implicado: 5,
        significado: 'A consulta à DE foi assinada pela coordenação geral e o processo encaminhado para diretoria.',
        disponibilidade: 2,
        condDispo: 'Consultar Diretoria Executiva da Capes',
        prazo: 20,
        gatilho: [{codAuto: 0}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    },
    {
        codAuto: 23,
        posicao: 'Atraso Diretoria Executiva da Capes',
        promocao: 1,
        implicado: 5,
        significado: 'Passou-se 20 dias desde o envio para decisão da DE.',
        disponibilidade: 0,
        condDispo: 'não se aplica',
        prazo: 0,
        gatilho: [{codAuto: 22}],
        usuario: [{user:'5e208e66e184ec03845aa649', data: '2020-09-01 00:00:00'}]
    }
]