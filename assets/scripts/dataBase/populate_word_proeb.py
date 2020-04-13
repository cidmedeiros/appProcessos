    # -*- coding: utf-8 -*-
"""
Created on Mon Jul 29 10:21:47 2019

@author: cidm
"""

import os
os.chdir(r'C:\Users\cidm\Documents\python_control\proeb')
import re
import mailmerge as mg
import pandas as pd
import numpy as np

profmat_2011_2012 = pd.read_pickle('profmat_2011_2012.pkl')
profmat_2011_2012.nome_entidade_local = profmat_2011_2012.nome_entidade_local.apply(lambda x: x.upper())
profmat_2011_2012.drop(columns=['turma'], inplace=True)
profmat_2011_2012.drop_duplicates(inplace=True)

profmat_2011_2012.nome_entidade_local = np.where(profmat_2011_2012.nome_entidade_local.isin(['UNIVERSIDADE DE SÃO PAULO/ RIBEIRÃO PRETO','UNIVERSIDADE DE SÃO PAULO/SÃO CARLOS']),
                                                 'UNIVERSIDADE DE SÃO PAULO',profmat_2011_2012.nome_entidade_local)

profmat_2011_2012.nome_entidade_local = np.where(profmat_2011_2012.nome_entidade_local.isin(['UNIVERSIDADE EST.PAULISTA JÚLIO DE MESQUITA FILHO/ILHA  SOLT','UNIVERSIDADE EST.PAULISTA JÚLIO DE MESQUITA FILHO/RIO CLARO',
                                                'UNIVERSIDADE EST.PAULISTA JÚLIO DE MESQUITA FILHO/SJ.R PRETO', 'UNIVERSIDADE EST.PAULISTA JÚLIO DE MESQUITA FILHO/SJR. PRETO']),
                                                 'UNIVERSIDADE ESTADUAL PAULISTA',profmat_2011_2012.nome_entidade_local)

profmat_2011_2012.nome_entidade_local = np.where(profmat_2011_2012.nome_entidade_local.isin(['UNIVERSIDADE FEDERAL DE SÃO JOÃO DEL-REI']),'UNIVERSIDADE FEDERAL DE SÃO JOÃO DEL REI',profmat_2011_2012.nome_entidade_local)

profmat_2011_2012.nome_entidade_local = np.where(profmat_2011_2012.nome_entidade_local.isin(['UNIVERSIDADE FEDERAL DO TRIÃNGULO MINEIRO']),'UNIVERSIDADE FEDERAL DO TRIÂNGULO MINEIRO',profmat_2011_2012.nome_entidade_local)
profmat_2011_2012.drop_duplicates(inplace=True)

profmat_2011_2012_sei = pd.read_excel('processo_sei_profmat_2011_2012.xlsx')
profmat_2011_2012_sei.nome_bolsista = profmat_2011_2012_sei.nome_bolsista.apply(lambda x: x.upper())
profmat_2011_2012_sei.processo_sei = profmat_2011_2012_sei.processo_sei.apply(lambda x: x.strip())
profmat_2011_2012_sei['check_sei'] = profmat_2011_2012_sei.processo_sei.apply(lambda x: len(x))
profmat_2011_2012_sei.drop_duplicates(inplace=True)

profmat_2011_2012_final = pd.merge(profmat_2011_2012, profmat_2011_2012_sei, how='left')
print('')
print('Processos sei faltando:', sum(profmat_2011_2012_final.processo_sei.isna()))

profmat_2011_2012_faltando = profmat_2011_2012_final[profmat_2011_2012_final.processo_sei.isna()]

profmat_2011_2012_final.drop(columns=['check_sei'], inplace=True)

def excel(df, name):
    import pandas as pd
    
    """
    Exporta Data Frame (df) para Excel.
    df = nome do Data Frame
    name = nomo desejado do arquivo excel (sem espaços e acentos)
    """
    #df = data frame name
    #name = string file desired name
    
    #Gerador de planilha(s)
    xls_exec = pd.ExcelWriter('{}.xlsx'.format(name))
     
    #Carrega planilha(s)
    df.to_excel(xls_exec, '{}'.format(name), index=False)
     
    #Salva planilha(s)
    xls_exec.save()   

def folha_rosto_proeb(data):
    for index, bolsista in data.iterrows():
        entidade = bolsista.nome_entidade_local
        f_dir = re.sub('/', '_', entidade)
        f_dir = f_dir.upper()
        n_sei = bolsista.processo_sei
        n_cpf = bolsista.cpf_bolsista
        b_nome = bolsista.nome_bolsista
        if not os.path.exists(f_dir):
            os.makedirs(f_dir)
        template = 'folha-rosto.docx'
        document = mg.MailMerge(template)
        document.merge(ies=entidade, sei=n_sei, cpf=n_cpf, nome=b_nome)
        document.write('{}/{}.docx'.format(f_dir,bolsista.nome_bolsista))

def lista_ies_proeb(data):
    ies_list = list(data.nome_entidade_local.unique())
    for ies in ies_list:
        os.chdir(r'C:\Users\cidm\Documents\python_control\proeb')
        f_dir = re.sub('/', '_', ies)
        f_dir = f_dir.upper()
        if not os.path.exists(f_dir):
            os.makedirs(f_dir)
        os.chdir(r'{}'.format(f_dir))
        bolsistas_list = data.query('nome_entidade_local == "{}"'.format(ies))
        if len(ies)> 30:
            nome_ies = ies[:31]
            nome_ies = re.sub('/', '_', nome_ies)
        else:
            nome_ies = re.sub('/', '_', ies)
        excel(bolsistas_list, nome_ies)

excel(profmat_2011_2012_final, 'profmat_2011_2012_final_sei_cad')
folha_rosto_proeb(profmat_2011_2012_final)
lista_ies_proeb(profmat_2011_2012_final)

