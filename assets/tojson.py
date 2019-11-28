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

def mun_json():
    
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

def ies_json():
    
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


#pags = pd.read_excel('dados\proeb_2011_2012_profmat.xlsx', encoding='ISO-8859-1')




