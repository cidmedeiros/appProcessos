# -*- coding: utf-8 -*-
"""
Created on Wed Nov 27 09:17:05 2019

@author: cidm
"""
import os
os.chdir(r'C:\Users\cidm\Documents\python_control\sisuab')
os.chdir(r'C:\Users\cidm\Documents\python_control\monitoramento_proeb')
import json
import pandas as pd
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

def pagsJson(min_score=0):
    
    """
    """
    ies = pd.read_csv('dados\ies.csv', sep=';', encoding='ISO-8859-1')
    ies = list(ies.nome_entidade)
    pags = pd.read_excel('dados\proeb_2011_2012_profmat.xlsx', encoding='ISO-8859-1')
    
    nac_ies = list(pags.ies.drop_duplicates())
    nac_ies = [ies.upper() for ies in nac_ies]
    series_nacional = []
    
    for nome in nac_ies:
        ans = match_name(nome, ies, min_score)
        series = pd.Series()
        series['ies'] = nome
        series['match_name'] = ans[0]
        series['match_score'] = ans[1]
        series_nacional.append(series)
        
    ies_nacional = pd.DataFrame()
    ies_nacional = ies_nacional.append(series_nacional)
    
    local_ies = list(pags.iesLocal.drop_duplicates())
    local_ies = [ies.upper() for ies in local_ies]
    series_local = []
    
    for nome in local_ies:
        ans = match_name(nome, ies, min_score=75)
        series = pd.Series()
        series['iesLocal'] = nome
        series['match_name'] = ans[0]
        series['match_score'] = ans[1]
        series_local.append(series)
        
    ies_local = pd.DataFrame()
    ies_local = ies_local.append(series_local)
        
    return ies_nacional, ies_local
