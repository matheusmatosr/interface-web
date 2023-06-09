import os
import glob
import time
import csv
import mysql.connector
from mysql.connector import errorcode
import requests

os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')

base_dir = '/sys/bus/w1/devices/'

device_folder = glob.glob(base_dir + '28*')[0]
device_folder1 = glob.glob(base_dir + '28*')[1]

device_file = device_folder + '/w1_slave'
device_file1 = device_folder1 + '/w1_slave'


def read_rom():
    name_file = device_folder+'/name'
    f = open(name_file,'r')
    return f.readline()

def read_rom1():
    name_file1 = device_folder1+'/name'
    g = open(name_file1,'r')
    return g.readline()

def read_temp_raw():
    f = open(device_file, 'r')
    lines = f.readlines()
    f.close()
    return lines

def read_temp_raw1():
    g = open(device_file1, 'r')
    lines1 = g.readlines()
    g.close()
    return lines1

def read_temp():
    lines = read_temp_raw()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw()
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string) / 1000.0

        return temp_c
    
def read_temp1():
    lines1 = read_temp_raw1()
    while lines1[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines1 = read_temp_raw1()
    equals_pos1 = lines1[1].find('t=')
    if equals_pos1 != -1:
        temp_string1 = lines1[1][equals_pos1+2:]
        temp_c1 = float(temp_string1) / 1000.0
        
        return temp_c1 

# Configurar a conexão com o banco de dados
connection = {
  'host':'bancodedados.ch30kvh0gicl.sa-east-1.rds.amazonaws.com',
  'user':'alex',
  'password':'Lhm260768',
  'database':'sensordetemperatura'
}

while True:
    c1 = read_temp()
    c2 = read_temp1()
    
    try:
        conn = mysql.connector.connect(**connection)
        
        with conn.cursor() as cursor:
            # criar tabela se não existir
            table_name = 'tabela_de_sensores'  
            create_table_query = f"CREATE TABLE IF NOT EXISTS {table_name} (id INT AUTO_INCREMENT PRIMARY KEY, temperatura_c1 FLOAT, temperatura_c2 FLOAT, data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
            cursor.execute(create_table_query)

            # inserir dados na tabela
            insert_query = "INSERT INTO tabela_de_sensores (temperatura_c1, temperatura_c2) VALUES (%s, %s)"
            cursor.execute(insert_query, (c1, c2,))
            conn.commit()
            
             # exibir dados da tabela
            select_query = "SELECT * FROM tabela_de_sensores ORDER BY id DESC LIMIT 1"
            cursor.execute(select_query)
            rows = cursor.fetchall()

            # Executar uma consulta SQL
            query = "SELECT * FROM tabela_de_sensores"
            cursor.execute(query)

            # Recuperar os resultados da consulta
            rows = cursor.fetchall()

            # Nome do arquivo para salvar os dados
            filename = 'dados.csv'

            # Salvar os dados em um arquivo CSV
            with open(filename, 'w', newline='') as file:
                writer = csv.writer(file)
                writer.writerows(rows)

    except mysql.connector.Error as error:
        print("Erro ao se conectar ao MySql:", error)

    finally:
        if (conn.is_connected()):
            cursor.close()
            conn.close()
           
        time.sleep(3)