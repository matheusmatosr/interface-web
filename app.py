import RPi.GPIO as GPIO
import csv
import time
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

rele = 13

releSts = GPIO.LOW

GPIO.setup(rele, GPIO.OUT)
GPIO.output(rele, releSts)

@app.route("/")
def index():
    releSts = GPIO.LOW

    with open('dados.csv', 'r') as file:
        csv_reader = csv.reader(file)
        last_row = None
        for row in csv_reader:
            last_row = row

    if last_row is not None:
        sensor1_temp = float(last_row[1])

        templateData = {
            'rele': releSts,
            'sensor1_temp': sensor1_temp
        }
        return render_template('index.html', **templateData)

@app.route("/<deviceName>/<action>")
def action(deviceName, action):
    if deviceName == 'button1' and action == 'on':
        GPIO.output(rele, GPIO.HIGH)
        start_time = time.time()
        while True:
            elapsed_time = time.time() - start_time

            with open('dados.csv', 'r') as file:
                csv_reader = csv.reader(file)
                last_row = None
                for row in csv_reader:
                    last_row = row

                if last_row is not None:
                    sensor1_temp = float(last_row[1])

                    if (26 < sensor1_temp < 28):
                        GPIO.output(rele, GPIO.LOW)
                        break
                    else:
                        GPIO.output(rele, GPIO.HIGH)
                    

            if elapsed_time >= 10:
                GPIO.output(rele, GPIO.LOW)
                break

    elif deviceName == 'button2' and action == 'on':
        GPIO.output(rele, GPIO.HIGH)
        start_time = time.time()
        while True:
            elapsed_time = time.time() - start_time

            with open('dados.csv', 'r') as file:
                csv_reader = csv.reader(file)
                last_row = None
                for row in csv_reader:
                    last_row = row

                if last_row is not None:
                    sensor1_temp = float(last_row[1])
                    sensor2_temp = float(last_row[2])

                    if (27 < sensor1_temp < 29):
                        GPIO.output(rele, GPIO.LOW)
                        break
                    else:
                        GPIO.output(rele, GPIO.HIGH)

            if elapsed_time >= 15:
                GPIO.output(rele, GPIO.LOW)
                break

    elif deviceName == 'button3' and action == 'on':
        GPIO.output(rele, GPIO.HIGH)
        start_time = time.time()
        while True:
            elapsed_time = time.time() - start_time

            with open('dados.csv', 'r') as file:
                csv_reader = csv.reader(file)
                last_row = None
                for row in csv_reader:
                    last_row = row

                if last_row is not None:
                    sensor1_temp = float(last_row[1])
                    sensor2_temp = float(last_row[2])

                    if (28 < sensor1_temp < 30):
                        GPIO.output(rele, GPIO.LOW)
                        break
                    else:
                        GPIO.output(rele, GPIO.HIGH)

            if elapsed_time >= 20:
                GPIO.output(rele, GPIO.LOW)
                break

    releSts = GPIO.input(rele)
	
    templateData = {
        'rele': releSts,
        'sensor1_temp': sensor1_temp
    }
    return render_template('index.html', **templateData)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True)