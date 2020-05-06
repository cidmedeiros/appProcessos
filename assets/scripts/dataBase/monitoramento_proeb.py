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
import numpy as np

grants = lg.load_grants(r'C:\Users\cidm\Documents\python_control\grants\datasets\sgb_19.csv','grants',atualizar=False)

proeb = grants.query('programa_agg == "PROEB"').copy()

proeb['dataIniCurso'] = pd.to_datetime((proeb.ano_ini_curso*10000+proeb.mes_ini_curso*100 + 1).apply(str),format='%Y%m%d')
proeb['dataFimCurso'] = pd.to_datetime((proeb.ano_fim_curso*10000+proeb.mes_fim_curso*100 + 1).apply(str),format='%Y%m%d')

###############################PROFMAT 2011/2012###############PROFMAT 2011/2012##############################PROFMAT 2011/2012#########################

profmat_2011_2012 = proeb.query('(programa == "PROFMAT") & (turma_proeb in ("TURMA 4/2011","TURMA 3/2012"))')#lista nominal completa

cpfs2011_2012 = profmat_2011_2012[['cpf_bolsista']].drop_duplicates()

profmat_2011_2012 = proeb[proeb.cpf_bolsista.isin(list(cpfs2011_2012.cpf_bolsista))]

profmat_2011_2012_resumo = profmat_2011_2012.groupby(['turma_proeb'], as_index=False).agg({'cpf_bolsista':'nunique', 'valor':'sum', 'nome_bolsista':'count'})#Resumo

fc.excel(profmat_2011_2012, 'profmat_2011_2012', index=False)

###############################PROFMAT 2011/2012###############PROFMAT 2011/2012##############################PROFMAT 2011/2012#########################

###############################PROFLETRAS  && PROFMAT 2013###############PROFLETRAS  && PROFMAT 2013#############################PROFLETRAS  && PROFMAT 2013###########################
profletras_profmat_2013 = proeb[(proeb.programa.isin(['PROFLETRAS','PROFMAT'])) &
                             (proeb.turma_proeb.isin(["TURMA 8/2013","TURMA 3/2013"]))]#lista nominal completa

cpfs2013 = profletras_profmat_2013[['cpf_bolsista']].drop_duplicates()

profletras_profmat_2013 = proeb[proeb.cpf_bolsista.isin(list(cpfs2013.cpf_bolsista))]

profletras_profmat_2013_resumo = profletras_profmat_2013.groupby(['turma_proeb'], as_index=False).agg({'cpf_bolsista':'nunique', 'valor':'sum'})#Resumo

###############################PROFLETRAS 2013###############PROFLETRAS 2013####################PROFLETRAS 2013####################

#####################################################NOVA CARGA ATÉ 2018###########################################################
#MACRO INFO - 1
turmasProeb = proeb.groupby(['programa','turma_proeb','nome_entidade_nacional'], as_index=False).agg({'cpf_bolsista':'nunique','codigo_curso_sgb':'nunique','dataIniCurso':'min','dataFimCurso':'max'}).sort_values(['programa', 'dataFimCurso'], ascending = [True, False])
#MACRO INFO - 2
turmasProebAnterior2019 = turmasProeb[turmasProeb.dataFimCurso.dt.year <= 2018]
#MACRO INFO - 3
turmasProebAnterior2019SemUFMG = turmasProebAnterior2019[turmasProebAnterior2019.nome_entidade_nacional != 'UNIVERSIDADE FEDERAL DE MINAS GERAIS']
#MACRO INFO - 4
turmasDeInteresse = turmasProebAnterior2019SemUFMG[(~(turmasProebAnterior2019SemUFMG.turma_proeb.isin(['TURMA 4/2011','TURMA 3/2012','TURMA 3/2013']))) & (~((turmasProebAnterior2019SemUFMG.programa == 'PROFLETRAS') & (turmasProebAnterior2019SemUFMG.turma_proeb == 'TURMA 8/2013')))]
#MACRO INFO - 5
turmasDeInteresse['diasTurma'] = turmasDeInteresse.dataFimCurso - turmasDeInteresse.dataIniCurso

#LISTA bolsistasCargaAnterior2019 - 1
ProebAnterior2019 = proeb[proeb.dataFimCurso.dt.year <= 2018]

#LISTA bolsistasCargaAnterior2019 - 2
ProebAnterior2019SemUFMG = ProebAnterior2019[ProebAnterior2019.nome_entidade_nacional != 'UNIVERSIDADE FEDERAL DE MINAS GERAIS']

#LISTA bolsistasCargaAnterior2019 - 3
bolsistasCargaAnterior2019 = ProebAnterior2019SemUFMG[(~(ProebAnterior2019SemUFMG.turma_proeb.isin(['TURMA 4/2011','TURMA 3/2012','TURMA 3/2013']))) & (~((ProebAnterior2019SemUFMG.programa == 'PROFLETRAS') & (ProebAnterior2019SemUFMG.turma_proeb == 'TURMA 8/2013')))]

#LISTA bolsistasCargaAnterior2019 - 4
bolsistasCargaAnterior2019 = proeb[proeb.cpf_bolsista.isin(list(bolsistasCargaAnterior2019.cpf_bolsista.unique()))].drop_duplicates()

#LISTA bolsistasCargaAnterior2019 - 5 - NOVA CARGA ATÉ 2018
bolsistasCargaAnterior2019 = bolsistasCargaAnterior2019[(~(bolsistasCargaAnterior2019.turma_proeb.isin(['TURMA 4/2011','TURMA 3/2012','TURMA 3/2013']))) & (~((bolsistasCargaAnterior2019.programa == 'PROFLETRAS') & (bolsistasCargaAnterior2019.turma_proeb == 'TURMA 8/2013')))]

#####################################################NOVA CARGA ATÉ 2018################################################################
    #MONITORAMENTO QUINQUENAL
hoje = dt.datetime.today()
proeb_ult_bolsa = proeb.groupby(['cpf_bolsista'], as_index=False)['dataRef'].max()
proeb_ult_bolsa['date_dif'] = (hoje - proeb_ult_bolsa.dataRef)/np.timedelta64(1, 'Y')
cpf_quin = proeb_ult_bolsa[proeb_ult_bolsa.date_dif >= 5.0]
proeb_quin = proeb[proeb.cpf_bolsista.isin(cpf_quin.cpf_bolsista)]
proeb_quin_resumo = proeb_quin.groupby(['programa', 'turma_proeb'], as_index=False).agg({'cpf_bolsista':'nunique', 'valor':'sum'}).sort_values('valor', ascending=False)

########################################################################################################################################
###EXPORTAR RESULTADOS PARA EXCEL
fc.excel(bolsistasCargaAnterior2019, 'bolsistasCargaAnterior2019', index=False)
########################################################################################################################################

