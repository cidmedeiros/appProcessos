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

def munJson():
    
    """
    """
    municipios = pd.read_csv('dados\ibge_mun.csv', sep=';', encoding='ISO-8859-1')
    municipios = municipios[['Codmun','NomeMunic','UF']].copy()
    municipios.columns = ['ibge','nome','uf']
    
    mun_json = []

    for _id, row in municipios.iterrows():
        values = {'ibge':row.ibge,'nome':row.nome,'uf':row.uf}
        mun_json.append(values)
    
    with open('dados\municipios.json', 'w', encoding='utf-8') as f:
        json.dump(mun_json, f, ensure_ascii=False)
        
    return mun_json

def iesJson():
    
    """
    """
    ies = pd.read_csv('dados\ies.csv', sep=';', encoding='ISO-8859-1')
    
    ies_json = []
    
    for _id, row in ies.iterrows():
        values = {'sigla':row.sigla, 'nome':row.nome_entidade, 'cnpj':row.cnpj_entidade}
        ies_json.append(values)
        
    with open('dados\ies.json', 'w') as f:
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

def preProcessPags(min_score=0):
    
    """
    """
    ies = pd.read_csv('dados\ies.csv', sep=';', encoding='ISO-8859-1')
    ies_only = list(ies.nome_entidade)
    pags = pd.read_excel('dados\proeb_2011_2012_profmat.xlsx', encoding='ISO-8859-1')
    pags.iesLocal = np.where(pags.iesLocal.isin(['UNIVERSIDADE EST.PAULISTA JÚLIO DE MESQUITA FILHO/SJ.R PRETO',
                                               'UNIVERSIDADE EST.PAULISTA JÚLIO DE MESQUITA FILHO/RIO CLARO',
                                               'UNIVERSIDADE EST.PAULISTA JÚLIO DE MESQUITA FILHO/ILHA  SOLT',
                                               'UNIVERSIDADE EST.PAULISTA JÚLIO DE MESQUITA FILHO/SJR. PRETO']),
                                                'UNIVERSIDADE ESTADUAL PAULISTA',pags.iesLocal)
    
    #ENTIDADE NACIONAL
    nac_ies = list(pags.ies.drop_duplicates())
    nac_ies = [ies.upper() for ies in nac_ies]
    ansNacional = [match_name(x, ies_only, 75) for x in nac_ies]
    df_Nacional = pd.DataFrame()
    df_Nacional['ies'] = nac_ies
    df_Nacional['iesNacional'] = [x[0] for x in ansNacional]
    df_Nacional['iesNacionalScore'] = [x[1] for x in ansNacional]
    
    #ENTIDADE LOCAL
    local_ies = list(pags.iesLocal.drop_duplicates())
    local_ies = [ies.upper() for ies in local_ies]
    ansLocal = [match_name(x, ies_only, 75) for x in local_ies]
    df_local = pd.DataFrame()
    df_local['iesLocal'] = local_ies
    df_local['iesMatchLocal'] = [x[0] for x in ansLocal]
    df_local['iesLocalScore'] = [x[1] for x in ansLocal]
    
    #TYDING UP
    pags = pd.merge(pags, df_Nacional, left_on=['ies'], right_on=['ies'], how='left')
    pags = pd.merge(pags, df_local, left_on=['iesLocal'], right_on=['iesLocal'], how='left')
    pags.iesLocal = pags.iesMatchLocal
    pags.drop(['ies','iesNacionalScore','iesMatchLocal','iesLocalScore'], axis=1, inplace=True)
    pags = pd.merge(pags,ies,left_on=['iesNacional'],right_on=['nome_entidade'],how='left')
    pags = pd.merge(pags,ies,left_on=['iesLocal'],right_on=['nome_entidade'], how='left')
    
    pags = pags[['cpf','nome','programa','iesNacional','cnpj_entidade_x','sigla_x','iesLocal','cnpj_entidade_y','sigla_y',
                 'uf_entidade_local','turma','modalidade_bolsa','dataRef','dataPag','valor','sistema','ano_referencia',
                 'mes_referencia','ano_pagamento','mes_pagamento']]
    
    pags.columns = ['cpf','nome','programa','iesNacional','iesNacionalCnpj','iesNacionalSigla','iesLocal','iesLocalcnpj',
                    'iesLocalSigla','iesLocalUf','turma','modalidade_bolsa','dataRef','dataPag','valor','sistema','ano_referencia',
                 'mes_referencia','ano_pagamento','mes_pagamento']
    
    return pags

def programaJson():
    
    """
    """
    pags = pd.read_excel('dados\proeb_2011_2012_profmat.xlsx', encoding='ISO-8859-1')
    
    progIes = pags[['programa','ies', 'dataRef']].drop_duplicates()
    progIesmin = progIes.groupby(['programa','ies'], as_index=False)['dataRef'].min()
    progIesmin.columns = ['programa','ies','inicio']
    
    progIesmax = progIes.groupby(['programa','ies'], as_index=False)['dataRef'].max()
    progIesmax.columns = ['programa','ies','fim']
    
    progIes = pd.merge(progIesmin, progIesmax)
    
    progrmJson = []
    
    for _id, row in progIes.iterrows():
        values = {'nome':row.programa, 'coordNacional':[{'ies':row.ies,'inicio':row.inicio,'fim':row.fim}]}
        progrmJson.append(values)
    
    with open('dados\programas.json', 'w', encoding='utf-8') as f:
        json.dump(progrmJson, f, ensure_ascii=False, sort_keys=True, default=str)
        
    return progrmJson
