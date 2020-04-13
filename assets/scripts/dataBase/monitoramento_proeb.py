# -*- coding: utf-8 -*-
"""
Created on Wed Jul 10 15:59:26 2019

@author: cidm
"""
import os
os.chdir(r'C:\Users\cidm\Documents\python_control\sgb')
import funcoes_sgb as fc
os.chdir(r'C:\Users\cidm\Documents\python_control\grants')
import load_grants as lg
os.chdir(r'C:\Users\cidm\Documents\python_control\monitoramento_proeb')
import pandas as pd
import datetime as dt
from datetime import date
import numpy as np

grants = lg.load_grants(r'.\datasets\sgb_19.csv','grants',atualizar=False)

proeb = grants.query('programa_agg == "PROEB"').copy()
proeb['dataRef'] = pd.to_datetime((proeb.ano_referencia*10000+proeb.mes_referencia*100 + 1).apply(str),format='%Y%m%d')

###############################PROFMAT 2011/2012###############PROFMAT 2011/2012##############################PROFMAT 2011/2012#########################

profmat_2011_2012 = proeb.query('(programa == "PROFMAT") & (turma_proeb in ("TURMA 4/2011","TURMA 3/2012"))')#lista nominal completa

profmat_2011_2012_resumo = profmat_2011_2012.groupby(['turma_proeb'], as_index=False).agg({'cpf_bolsista':'nunique', 'valor':'sum'})#Resumo

fc.excel(profmat_2011_2012, 'profmat_2011_2012', index=False)

###############################PROFMAT 2011/2012###############PROFMAT 2011/2012##############################PROFMAT 2011/2012#########################

###############################PROFLETRAS  && PROFMAT 2013###############PROFLETRAS  && PROFMAT 2013#############################PROFLETRAS  && PROFMAT 2013###########################
profletras_profmat_2013 = proeb[(proeb.programa.isin(['PROFLETRAS','PROFMAT'])) &
                             (proeb.turma_proeb.isin(["TURMA 8/2013","TURMA 3/2013"]))]#lista nominal completa

profletras_profmat_2013_resumo = profletras_profmat_2013.groupby(['turma_proeb'], as_index=False).agg({'cpf_bolsista':'nunique', 'valor':'sum'})#Resumo

fc.excel(profletras_profmat_2013, 'profletras_profmat_2013', index=False)
###############################PROFLETRAS 2013###############PROFLETRAS 2013#############################PROFLETRAS 2013###########################


    #MONITORAMENTO QUINQUENAL
hoje = dt.datetime.today()
proeb_ult_bolsa = proeb.groupby(['cpf_bolsista'], as_index=False)['dataRef'].max()
proeb_ult_bolsa['date_dif'] = (hoje - proeb_ult_bolsa.dataRef)/np.timedelta64(1, 'Y')
cpf_quin = proeb_ult_bolsa[proeb_ult_bolsa.date_dif >= 5.0]
proeb_quin = proeb[proeb.cpf_bolsista.isin(cpf_quin.cpf_bolsista)]
proeb_quin_resumo = proeb_quin.groupby(['programa', 'turma_proeb'], as_index=False).agg({'cpf_bolsista':'nunique', 'valor':'sum'}).sort_values('valor', ascending=False)


