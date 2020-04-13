# -*- coding: utf-8 -*-
"""
Created on Wed Nov 27 09:17:05 2019

@author: cidm
"""
import json
import pandas as pd
import numpy as np
import math
import datetime as dt
from fuzzywuzzy import fuzz

def munJson():
    
    """
    """
    municipios = pd.read_csv(r'D:\computer-science\web-development\capesProject\assets\dados\ibge_mun.csv',sep=';',encoding='ISO-8859-1',dtype=str)
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

    for _id, row in municipios.iterrows():
        municipiosJson.append({'nome':row.nome,'nomeUf':row.uf,'uf':row.siglaUf,'ibge':row.ibge,'regiao':row.regiao})
        
    with open('dados\municipios.json', 'w', encoding='utf-8') as f:
        json.dump(municipiosJson, f, ensure_ascii=False)
        
    return municipiosJson

def iesJson():
    
    """
    """
    ies = pd.read_csv(r'D:\computer-science\web-development\capesProject\assets\dados\ies.csv', sep=';', encoding='UTF-8',dtype=str)
    
    ies_json = []
    
    for _id, row in ies.iterrows():
        values = {'cnpj':row.cnpj_entidade,'sigla':row.siglaIes,'nome':row.nome_entidade,'nomeUf':row.uf,'uf':row.siglaUf,
                  'regiao':row.regiao}
        ies_json.append(values)
        
    with open('dados\ies.json', 'w', encoding='utf-8') as f:
        json.dump(ies_json, f, ensure_ascii=False)
        
    return ies_json

def programaJson(file):
    
    """
    file is the relative to root file location -> 'dados\proeb_2011_2012_profmat.xlsx'
    """
    bolsistas = pd.read_excel(file, encoding='ISO-8859-1')
    
    progIes = bolsistas[['programa','nome_entidade_nacional', 'dataRef']].drop_duplicates()
    progIesmin = progIes.groupby(['programa','nome_entidade_nacional'], as_index=False)['dataRef'].min()
    progIesmin.columns = ['programa','nome_entidade_nacional','inicio']
    
    progIesmax = progIes.groupby(['programa','nome_entidade_nacional'], as_index=False)['dataRef'].max()
    progIesmax.columns = ['programa','nome_entidade_nacional','fim']
    
    progIes = pd.merge(progIesmin, progIesmax)
    
    progrmJson = []
    
    for _id, row in progIes.iterrows():
        values = {'nome':row.programa, 'coordNacional':[{'ies':row.nome_entidade_nacional,'inicio':row.inicio,'fim':row.fim}]}
        progrmJson.append(values)
    
    with open('dados_profletras_08_2013\programas.json', 'w', encoding='utf-8') as f:
        json.dump(progrmJson, f, ensure_ascii=False, sort_keys=True, default=str)
        
    return progrmJson

def makeCpf(string):
    
    """
    """
    string = string.replace('.','')
    string = string.replace('-','')
    string = string.replace('/','')
    ans = string[:3]+'.'+string[3:6]+'.'+string[6:9]+'-'+string[9:]
    
    return ans

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

def padronizaIesLocal(file, min_score):
    
    """
    file is the relative to root file location -> 'dados\proeb_2011_2012_profmat.xlsx'
    """
    
    ies = pd.read_csv(r'D:\computer-science\web-development\capesProject\assets\dados\ies.csv', sep=';', encoding='utf-8')
    ies = list(ies.nome_entidade)
    
    bolsistas = pd.read_excel(file, encoding='utf-8')
    #Lista de IES com intervencao manual
    bolsistas.nome_entidade_local = np.where(bolsistas.nome_entidade_local.isin([
            'UNIVERSIDADE EST.PAULISTA JÚLIO DE MESQUITA FILHO/SJ.R PRETO',
            'UNIVERSIDADE EST.PAULISTA JÚLIO DE MESQUITA FILHO/RIO CLARO',
            'UNIVERSIDADE EST.PAULISTA JÚLIO DE MESQUITA FILHO/ILHA  SOLT',
            'UNIVERSIDADE EST.PAULISTA JÚLIO DE MESQUITA FILHO/SJR. PRETO',
            'UNIVERSIDADE EST.PAULISTA JÚLIO DE MESQUITA FILHO']),
            'UNIVERSIDADE ESTADUAL PAULISTA',bolsistas.nome_entidade_local)
    
    bolsistas.nome_entidade_local = bolsistas.nome_entidade_local.str.upper()
    
    local_ies = list(bolsistas.nome_entidade_local.drop_duplicates())
    local_ies = [ies.upper() for ies in local_ies]
    
    list_series_local = []
    
    for nome in local_ies:
        ans = match_name(nome, ies, min_score)
        series = pd.Series(dtype='object')
        series['localIesFrame'] = nome
        series['match_name'] = ans[0]
        series['match_score'] = ans[1]
        list_series_local.append(series)
        if ans[1] == -1:
            print('WARNING! IES requer intervencao manual')
            print('Nome da IES com problema: {}'.format(nome))
            print('Corrija o nome da IES e rode de novo o script')
   
    localIes_list = pd.DataFrame()
    localIes_list = localIes_list.append(list_series_local)
    localIes_list.drop_duplicates(inplace=True)
    
    bolsistas = pd.merge(bolsistas, localIes_list, left_on=['nome_entidade_local'],
                         right_on=['localIesFrame'], how='left')
    
    bolsistas['iesLocal'] = bolsistas.match_name
    bolsistas['dataPag'] = pd.to_datetime((bolsistas.ano_pagamento*10000+bolsistas.mes_pagamento*100 + 1).apply(str),format='%Y%m%d')
    
    bolsistas.cpf_bolsista = [makeCpf(x) for x in bolsistas.cpf_bolsista]
    bolsistas.valor = [int(x) for x in bolsistas.valor]
    
    bolsistas = bolsistas[['cpf_bolsista','nome_bolsista','programa','nome_entidade_nacional','iesLocal',
                           'turma_proeb','modalidade_bolsa','dataRef','dataPag','valor','sistema_pagamento']]
    
    bolsistas.columns = ['cpf','nome','programa','iesNacional','iesLocal','turma','modalidade_bolsa','dataRef',
                    'dataPag','valor','sistema']
    
    return bolsistas

def divisaoClbr(bolsistas):
    
    """
    file is the relative to root file location -> 'dados\proeb_2011_2012_profmat.xlsx'
    """
    
    cpfs = list(bolsistas.cpf.unique())
    cpfs.sort()
    
    factor = math.floor(len(cpfs)/10)
    
    clbrsCarga = {'andre':1.7,'carlos':0.5,'debora':1.7,'gilson': 1.7,'mayra':1.7,'monica':1,'pricilla':1.7}
    
    init, maxInd, clbrsIndexes = 0, 0, {}
    
    for clbr in clbrsCarga:
        maxInd = init + math.floor(clbrsCarga[clbr]*factor)+1
        clbrsIndexes[clbr] = list(range(init, (maxInd)))
        init = maxInd
    
    rest = len(cpfs) - maxInd
    restIndexes = list(range(init, (maxInd+rest)))
    
    for ind in restIndexes:
        clbrsIndexes['carlos'].append(ind)
    
    clbrsCpfs = {}
    
    for i, cpf in enumerate(cpfs):
        for clbr in clbrsIndexes:
            if i in clbrsIndexes[clbr]:
                if clbr in clbrsCpfs:
                    clbrsCpfs[clbr].append(cpf)
                    continue
                else:
                    clbrsCpfs[clbr] = [cpf]
                    continue
                
    return clbrsCpfs

def procFrame(file, min_score):
    
    """
    file is the relative to root file location -> 'dados\proeb_2011_2012_profmat.xlsx'
    """
    
    df = padronizaIesLocal(file, min_score)
    df['sei'] = 'a cadastrar'
    
    #Agrupando em lista para formar DataFrame em seguida
    nome = df.groupby(['cpf','sei'])['nome'].apply(list).reset_index(name='nome')
    nome.nome = [name[len(name)-1] for name in nome.nome]
    
    programa = df.groupby(['cpf','sei'])['programa'].apply(list).reset_index(name='programa')
    iesNacional = df.groupby(['cpf','sei'])['iesNacional'].apply(list).reset_index(name='iesNacional')
    iesLocal = df.groupby(['cpf','sei'])['iesLocal'].apply(list).reset_index(name='iesLocal')
    turma = df.groupby(['cpf','sei'])['turma'].apply(list).reset_index(name='turma')
    
    modalidade_bolsa = df.groupby(['cpf','sei'])['modalidade_bolsa'].apply(list).reset_index(name='modalidade_bolsa')
    dataRef = df.groupby(['cpf','sei'])['dataRef'].apply(list).reset_index(name='dataRef')
    dataPag = df.groupby(['cpf','sei'])['dataPag'].apply(list).reset_index(name='dataPag')
    valor = df.groupby(['cpf','sei'])['valor'].apply(list).reset_index(name='valor')
    sistema = df.groupby(['cpf','sei'])['sistema'].apply(list).reset_index(name='sistema')
    
    bolsistas = pd.merge(nome,programa,left_on=['cpf','sei'], right_on=['cpf','sei'], how='outer')
    bolsistas = pd.merge(bolsistas,iesNacional,left_on=['cpf','sei'], right_on=['cpf','sei'], how='outer')
    bolsistas = pd.merge(bolsistas,iesLocal,left_on=['cpf','sei'], right_on=['cpf','sei'], how='outer')
    bolsistas = pd.merge(bolsistas,turma,left_on=['cpf','sei'], right_on=['cpf','sei'], how='outer')
    bolsistas = pd.merge(bolsistas,modalidade_bolsa,left_on=['cpf','sei'], right_on=['cpf','sei'], how='outer')
    bolsistas = pd.merge(bolsistas,dataRef,left_on=['cpf','sei'], right_on=['cpf','sei'], how='outer')
    bolsistas = pd.merge(bolsistas,dataPag,left_on=['cpf','sei'], right_on=['cpf','sei'], how='outer')
    bolsistas = pd.merge(bolsistas,valor,left_on=['cpf','sei'], right_on=['cpf','sei'], how='outer')
    bolsistas = pd.merge(bolsistas,sistema,left_on=['cpf','sei'], right_on=['cpf','sei'], how='outer')
    bolsistas['valorBolsas'] = [sum(x) for x in bolsistas.valor]
    bolsistas['nomeDisplay'] = bolsistas.nome.str.title()
    bolsistas = bolsistas[bolsistas.valorBolsas > 0]
    
    return bolsistas

def procClbr(file, min_score):
    
   """
   file is the relative to root file location -> 'dados\proeb_2011_2012_profmat.xlsx'
   """
   file = r'D:\computer-science\web-development\capesProject\assets\dados\dados_profletras_profmat_2013\profletras_profmat_2013.xlsx'
   min_score = 75
    
   bolsistas = procFrame(file, min_score)
   
   clbrsCpfs = divisaoClbr(bolsistas)
   
   bolsistas['colaborador'] = np.where(bolsistas.cpf.isin(clbrsCpfs['andre']),'5e21a1cec6fbcc262c905839','A definir')
   bolsistas.colaborador = np.where(bolsistas.cpf.isin(clbrsCpfs['carlos']),'5e259c2307e8be0320a76467', bolsistas.colaborador)
   bolsistas.colaborador = np.where(bolsistas.cpf.isin(clbrsCpfs['debora']),'5e21a4d3c6fbcc262c90583b', bolsistas.colaborador)
   bolsistas.colaborador = np.where(bolsistas.cpf.isin(clbrsCpfs['gilson']),'5e21a677c6fbcc262c90583d', bolsistas.colaborador)
   bolsistas.colaborador = np.where(bolsistas.cpf.isin(clbrsCpfs['mayra']),'5e21a59ac6fbcc262c90583c', bolsistas.colaborador)
   bolsistas.colaborador = np.where(bolsistas.cpf.isin(clbrsCpfs['monica']), '5e3ab2c5c3d09e39f8574cc6', bolsistas.colaborador)
   bolsistas.colaborador = np.where(bolsistas.cpf.isin(clbrsCpfs['pricilla']), '5e21a31ac6fbcc262c90583a', bolsistas.colaborador)
   
   return bolsistas
    
def bolsistasJson(file, min_score):
    
   """
   file is the relative to root file location -> 'dados\proeb_2011_2012_profmat.xlsx'
   """
   
   bolsistas = procClbr(file, min_score)
   bolJson = []
    
   for _id, row in bolsistas.iterrows():
       pags = []
       now = dt.date.today()
       today = now.strftime("%Y/%m/%d")
       clbr = [{'user':row.colaborador, 'data':today}]
       values = {'cpf':row.cpf,
                  'nome':row.nome,
                  'nomeDisplay':row.nomeDisplay,
                  'sei':row.sei,
                  'email':[{'email':'ausente@ausente.com',"data":today}],
                  'sexo':'sem info',
                  'statusCurso':[],
                  'clbr':clbr,
                  'valorBolsas':row.valorBolsas,
                  'valorDev': [],
                  'docFoto':[],
                  'docRes':[],
                  'termo':[],
                  'declaracao':[],
                  'certConclusao':[],
                  'permanenciaTotal':0,
                  'analiseCompromisso':[],
                  'pad':[]}
       for i in range(0, len(row.programa)):
            loopValues = {'programa':row.programa[i],
                          'iesLocal':row.iesLocal[i],
                          'turma':row.turma[i],
                          'modalidade':row.modalidade_bolsa[i],
                          'dataRef':row.dataRef[i],
                          'dataPag':row.dataPag[i],
                          'valor':row.valor[i],
                          'sistema':row.sistema[i]}            
            pags.append(loopValues)
    
       values['pags'] = pags
       bolJson.append(values)
    
   with open(r'D:\computer-science\web-development\capesProject\assets\dados\dados_profletras_profmat_2013\bolsistas.json', 'w', encoding='utf-8') as f:
        json.dump(bolJson, f, ensure_ascii=False, sort_keys=True, default=str)
    
   return bolJson
    
