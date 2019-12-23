# -*- coding: utf-8 -*-
"""
Created on Wed Nov 27 09:17:05 2019

@author: cidm
"""
import os
os.chdir(r'D:\computer-science\web-development\capesProject\assets')
import json
import pandas as pd
import numpy as np
from fuzzywuzzy import fuzz
import datetime as dt

def munJson():
    
    """
    """
    municipios = pd.read_csv('dados\ibge_mun.csv',sep=';',encoding='ISO-8859-1',dtype=str)
    municipios = municipios[['Codmun','NomeMunic','UF']].copy()
    municipios.columns = ['ibge','nome','uf']
    municipios['siglaUf'] = np.where(municipios.uf == 'Rondônia','RO',np.where(municipios.uf == 'Acre','AC',
                            np.where(municipios.uf == 'Amazonas','AM',np.where(municipios.uf == 'Roraima','RR',
                            np.where(municipios.uf == 'Pará','PA',np.where(municipios.uf == 'Amapá','AP',
                            np.where(municipios.uf == 'Tocantins','TO',np.where(municipios.uf == 'Maranhão','MA',
                            np.where(municipios.uf == 'Piauí','PI',np.where(municipios.uf == 'Ceará','CE',
                            np.where(municipios.uf == 'Rio Grande do Norte','RN',np.where(municipios.uf == 'Paraíba','PB',
                            np.where(municipios.uf == 'Pernambuco','PE',np.where(municipios.uf == 'Alagoas','AL',
                            np.where(municipios.uf == 'Sergipe','SE',np.where(municipios.uf == 'Bahia','BA',
                            np.where(municipios.uf == 'Minas Gerais','MG',np.where(municipios.uf == 'Espírito Santo','ES',
                            np.where(municipios.uf == 'Rio de Janeiro','RJ',np.where(municipios.uf == 'São Paulo','SP',
                            np.where(municipios.uf == 'Paraná','PR',np.where(municipios.uf == 'Santa Catarina','SC',
                            np.where(municipios.uf == 'Rio Grande do Sul','RS',np.where(municipios.uf == 'Mato Grosso do Sul','MS',
                            np.where(municipios.uf == 'Mato Grosso','MT',np.where(municipios.uf == 'Goiás','GO',
                            np.where(municipios.uf == 'Distrito Federal','DF','teste')))))))))))))))))))))))))))
    
    municipios['regiao'] = np.where(municipios.siglaUf.isin(['RO','AC','AM','RR','PA','AP','TO']),'Norte',
                           np.where(municipios.siglaUf.isin(['MA','PI','CE','RN','PB','PE','AL','SE','BA']),'Nordeste',
                           np.where(municipios.siglaUf.isin(['MG','ES','RJ','SP']),'Sudeste',
                           np.where(municipios.siglaUf.isin(['PR','SC','RS']),'Sul',
                           np.where(municipios.siglaUf.isin(['MS','MT','GO','DF']),'Centro-Oeste','teste')))))
    
    
    municipiosJson = []
    ufList = municipios.siglaUf.unique()
    
    for siglaUf in ufList:
        ufDict = {'agrpUf':siglaUf}
        munList = []
        for _id, row in municipios.iterrows():
            if row.siglaUf == siglaUf:
                munList.append({'nome':row.nome,'nomeUf':row.uf,'uf':row.siglaUf,'ibge':row.ibge,'regiao':row.regiao})
        ufDict['municipios'] = munList
        municipiosJson.append(ufDict)
        
    with open('dados\municipios.json', 'w', encoding='utf-8') as f:
        json.dump(municipiosJson, f, ensure_ascii=False)
        
    return municipiosJson

def iesJson():
    
    """
    """
    ies = pd.read_csv('dados\ies.csv', sep=';', encoding='UTF-8',dtype=str)
    
    ies_json = []
    
    for _id, row in ies.iterrows():
        values = {'cnpj':row.cnpj_entidade,'sigla':row.siglaIes,'nome':row.nome_entidade,'nomeUf':row.uf,'uf':row.siglaUf,
                  'regiao':row.regiao}
        ies_json.append(values)
        
    with open('dados\ies.json', 'w', encoding='utf-8') as f:
        json.dump(ies_json, f, ensure_ascii=False)
        
    return ies_json

def match_name(name, list_names, min_score=0):
    
    """
    """
    # -1 score incase we don't get any matches
    max_score = -1
    # Returning empty name for no match as well
    max_name = ""
    # Iternating over all names in the other
    for name2 in list_names:
        #Finding fuzzy match score
        score = fuzz.ratio(name, name2)
        # Checking if we are above our threshold and have a better score
        if (score > min_score) & (score > max_score):
            max_name = name2
            max_score = score
            
    return (max_name, max_score)

def makeCpf(string):
    
    """
    """
    string = string.replace('.','')
    string = string.replace('-','')
    string = string.replace('/','')
    ans = string[:3]+'.'+string[3:6]+'.'+string[6:9]+'-'+string[9:]
    
    return ans
    
def preProcessPags(min_score=0):
    
    """
    Pre-engineer pags data for later processes. It assumes the original data without any duplicates.
    """
    ies = pd.read_csv('dados\ies.csv', sep=';', encoding='ISO-8859-1',dtype=str)
    ies_only = list(ies.nome_entidade)
    pagsOr = pd.read_csv('dados\proeb_2011_2012_profmat.csv',sep=';',encoding='ISO-8859-1',dtype=str)
    pagsOr.iesLocal = np.where(pagsOr.iesLocal.isin(['UNIVERSIDADE EST.PAULISTA JÚLIO DE MESQUITA FILHO/SJ.R PRETO',
                                               'UNIVERSIDADE EST.PAULISTA JÚLIO DE MESQUITA FILHO/RIO CLARO',
                                               'UNIVERSIDADE EST.PAULISTA JÚLIO DE MESQUITA FILHO/ILHA  SOLT',
                                               'UNIVERSIDADE EST.PAULISTA JÚLIO DE MESQUITA FILHO/SJR. PRETO']),
                                                'UNIVERSIDADE ESTADUAL PAULISTA',pagsOr.iesLocal)
    
    pagsOr.ies = [ies.upper() for ies in pagsOr.ies]
    pagsOr.iesLocal = [ies.upper() for ies in pagsOr.iesLocal]
    
    #ENTIDADE NACIONAL
    nac_ies = list(pagsOr.ies.drop_duplicates())
    nac_ies = [ies.upper() for ies in nac_ies]
    ansNacional = [match_name(x, ies_only, 75) for x in nac_ies]
    df_Nacional = pd.DataFrame()
    df_Nacional['ies'] = nac_ies
    df_Nacional['iesNacional'] = [x[0] for x in ansNacional]
    df_Nacional['iesNacionalScore'] = [x[1] for x in ansNacional]
    
    #ENTIDADE LOCAL
    local_ies = list(pagsOr.iesLocal.drop_duplicates())
    local_ies = [ies.upper() for ies in local_ies]
    ansLocal = [match_name(x, ies_only, 75) for x in local_ies]
    df_local = pd.DataFrame()
    df_local['iesLocal'] = local_ies
    df_local['iesMatchLocal'] = [x[0] for x in ansLocal]
    df_local['iesLocalScore'] = [x[1] for x in ansLocal]
    
    #TYDING UP
    pags = pd.merge(pagsOr, df_Nacional, left_on=['ies'], right_on=['ies'], how='left')
    pags = pd.merge(pags, df_local, left_on=['iesLocal'], right_on=['iesLocal'], how='left')
    pags.iesLocal = pags.iesMatchLocal
    pags.drop(['ies','iesNacionalScore','iesMatchLocal','iesLocalScore'], axis=1, inplace=True)
    pags = pd.merge(pags,ies,left_on=['iesNacional'],right_on=['nome_entidade'],how='left')
    pags = pd.merge(pags,ies,left_on=['iesLocal'],right_on=['nome_entidade'], how='left')
    pags.cpf = [makeCpf(x) for x in pags.cpf]
    pags.valor = [int(x) for x in pags.valor]
    pags = pags[['cpf','nome','programa','iesNacional','cnpj_entidade_x','sigla_x','iesLocal','cnpj_entidade_y','sigla_y',
                 'uf_entidade_local','turma','modalidade_bolsa','dataRef','dataPag','valor','sistema','ano_referencia',
                 'mes_referencia','ano_pagamento','mes_pagamento']]
    
    pags.columns = ['cpf','nome','programa','iesNacional','iesNacionalCnpj','iesNacionalSigla','iesLocal','iesLocalcnpj',
                    'iesLocalSigla','iesLocalUf','turma','modalidade_bolsa','dataRef','dataPag','valor','sistema','ano_referencia',
                 'mes_referencia','ano_pagamento','mes_pagamento']
    
    return pags

def programaJson(minScore):
    
    """
    """
    pags = preProcessPags(minScore)
    
    progIes = pags[['programa','iesNacional','dataRef']].drop_duplicates()
    progIesmin = progIes.groupby(['programa','iesNacional'], as_index=False)['dataRef'].min()
    progIesmin.columns = ['programa','iesNacional','inicio']
    
    progIesmax = progIes.groupby(['programa','iesNacional'], as_index=False)['dataRef'].max()
    progIesmax.columns = ['programa','iesNacional','fim']
    
    progIes = pd.merge(progIesmin, progIesmax)
    
    progrmJson = []
    
    for _id, row in progIes.iterrows():
        values = {'nome':row.programa, 'coordNacional':[{'ies':row.iesNacional,'inicio':row.inicio,'fim':row.fim}]}
        progrmJson.append(values)
    
    with open('dados\programas.json', 'w', encoding='utf-8') as f:
        json.dump(progrmJson, f, ensure_ascii=False, sort_keys=True, default=str)
        
    return progrmJson

def preProcessBolsistas(minScore):
    
    """
    """
    sei = pd.read_csv('dados\profmat_2011_2012_processosSEI.csv',sep=';',encoding='ISO-8859-1',dtype=str)
    pags = preProcessPags(75)
    
    df = pd.merge(sei,pags,left_on=['cpf'],right_on=['cpf'], how='right')
    programa = df.groupby(['cpf','sei','nome'])['programa'].apply(list).reset_index(name='programa')
    iesNacional = df.groupby(['cpf','sei','nome'])['iesNacional'].apply(list).reset_index(name='iesNacional')
    iesLocalSigla = df.groupby(['cpf','sei','nome'])['iesLocalSigla'].apply(list).reset_index(name='iesLocalSigla')
    turma = df.groupby(['cpf','sei','nome'])['turma'].apply(list).reset_index(name='turma')
    modalidade_bolsa = df.groupby(['cpf','sei','nome'])['modalidade_bolsa'].apply(list).reset_index(name='modalidade_bolsa')
    dataRef = df.groupby(['cpf','sei','nome'])['dataRef'].apply(list).reset_index(name='dataRef')
    dataPag = df.groupby(['cpf','sei','nome'])['dataPag'].apply(list).reset_index(name='dataPag')
    valor = df.groupby(['cpf','sei','nome'])['valor'].apply(list).reset_index(name='valor')
    sistema = df.groupby(['cpf','sei','nome'])['sistema'].apply(list).reset_index(name='sistema')
    
    bolsistas = pd.merge(programa,iesNacional,left_on=['cpf','sei','nome'], right_on=['cpf','sei','nome'], how='outer')
    bolsistas = pd.merge(bolsistas,iesLocalSigla,left_on=['cpf','sei','nome'], right_on=['cpf','sei','nome'], how='outer')
    bolsistas = pd.merge(bolsistas,turma,left_on=['cpf','sei','nome'], right_on=['cpf','sei','nome'], how='outer')
    bolsistas = pd.merge(bolsistas,modalidade_bolsa,left_on=['cpf','sei','nome'], right_on=['cpf','sei','nome'], how='outer')
    bolsistas = pd.merge(bolsistas,dataRef,left_on=['cpf','sei','nome'], right_on=['cpf','sei','nome'], how='outer')
    bolsistas = pd.merge(bolsistas,dataPag,left_on=['cpf','sei','nome'], right_on=['cpf','sei','nome'], how='outer')
    bolsistas = pd.merge(bolsistas,valor,left_on=['cpf','sei','nome'], right_on=['cpf','sei','nome'], how='outer')
    bolsistas = pd.merge(bolsistas,sistema,left_on=['cpf','sei','nome'], right_on=['cpf','sei','nome'], how='outer')
    bolsistas['valorBolsas'] = [sum(x) for x in bolsistas.valor]
    bolsistas = bolsistas[bolsistas.valorBolsas > 0]
    bolsistas['nomeDisplay'] = 'sem info'
    bolsistas['colaborador'] = np.where(bolsistas.index.isin(bolsistas.iloc[0:372].index), 'André Braga', 'A definir')
    bolsistas.colaborador = np.where(bolsistas.index.isin(bolsistas.iloc[372:744].index), 'Gilson Oliveira', bolsistas.colaborador)
    bolsistas.colaborador = np.where(bolsistas.index.isin(bolsistas.iloc[744:1116].index), 'Débora Costa', bolsistas.colaborador)
    bolsistas.colaborador = np.where(bolsistas.index.isin(bolsistas.iloc[1116:1488].index), 'Pricilla Oliveira', bolsistas.colaborador)
    bolsistas.colaborador = np.where(bolsistas.index.isin(bolsistas.iloc[1488:1767].index), 'Mônica Gama', bolsistas.colaborador)
    bolsistas.colaborador = np.where(bolsistas.index.isin(bolsistas.iloc[1767:2046].index), 'Mayra Gobbato', bolsistas.colaborador)
    bolsistas.colaborador = np.where(bolsistas.index.isin(bolsistas.iloc[2046:2320].index), 'Carlos Boseli', bolsistas.colaborador)
    
    return bolsistas

def bolsistasJson(minScore):
    
    """
    """
    bolsistas = preProcessBolsistas(minScore)
    
    bolJson= []
    
    for _id, row in bolsistas.iterrows():
        pags = []
        now = dt.date.today()
        today = now.strftime("%d/%m/%Y")
        clbr = [{'nome':row.colaborador, 'data':today}]
        values = {'cpf':row.cpf,
                  'nome':row.nome,
                  'nomeDisplay':row.nomeDisplay,
                  'sei':row.sei,
                  'email':[],
                  'sexo':'sem info',
                  'statusCurso':[],
                  'clbr':clbr,
                  'valorBolsas':row.valorBolsas,
                  'valorDev': [],
                  'docFoto':[],
                  'docRes':[],
                  'termo':[],
                  'declaracao':[],
                  'certConclusao':[]}
        for i in range(0, len(row.programa)):
            loopValues = {'programa':row.programa[i],
                          'iesLocal':row.iesLocalSigla[i],
                          'turma':row.turma[i],
                          'modalidade':row.modalidade_bolsa[i],
                          'dataRef':row.dataRef[i],
                          'dataPag':row.dataPag[i],
                          'valor':row.valor[i],
                          'sistema':row.sistema[i]}            
            pags.append(loopValues)
        
        values['pags'] = pags
        
        bolJson.append(values)
    
    with open(r'D:\computer-science\web-development\capesProject\assets\dados\bolsistas.json', 'w', encoding='utf-8') as f:
        json.dump(bolJson, f, ensure_ascii=False, sort_keys=True, default=str)
    
    return bolJson