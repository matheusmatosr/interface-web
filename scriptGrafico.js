// Carregar o arquivo CSV e atualizar o gráfico
function loadCSVAndUpdateChart(file) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      processCSVAndUpdateChart(xhr.responseText);
    }
  };
  xhr.open('GET', file, true);
  xhr.send();
}

var data1 = []; // Dados do Sensor 1
var data2 = []; // Dados do Sensor 2
var labels = []; // Rótulos do eixo x

function processCSVAndUpdateChart(csvData) {
  var lines = csvData.split('\n');

  // Remover os dados antigos se houver mais de 10 linhas
  if (lines.length > 10) {
    data1.splice(0, lines.length - 10);
    data2.splice(0, lines.length - 10);
    labels.splice(0, lines.length - 10);
  }

  for (var i = 0; i < lines.length; i++) {
    var values = lines[i].split(',');
    var x = parseFloat(values[1]);
    var y1 = parseFloat(values[1]); // Valor do Sensor 1
    var y2 = parseFloat(values[2]); // Valor do Sensor 2

    // Atualizar os dados apenas se houver novos valores
    if (data1.length < 10) {
      data1.push({ x: x, y: y1 });
      data2.push({ x: x, y: y2 });

      var time = values[3].split(' ')[1]; // Extrair o valor do tempo
      labels.push(time);
    } else {
      data1[i % 10] = { x: x, y: y1 };
      data2[i % 10] = { x: x, y: y2 };

      var time = values[3].split(' ')[1]; // Extrair o valor do tempo
      labels[i % 10] = time;
    }
  }

  // Atualizar o gráfico com os dados e os rótulos do eixo x
  updateChart(data1, data2, labels);
}


// Atualizar o gráfico com os dados e os rótulos do eixo x
function updateChart(data1, data2, labels) {
  var ctx = document.getElementById('myChart').getContext('2d');

  // Verificar se o gráfico já foi inicializado
  var chart = Chart.getChart(ctx);

  if (chart) {
    // Atualizar os dados do gráfico existente
    chart.data.datasets[0].data = data1;
    chart.data.datasets[1].data = data2;
    chart.data.labels = labels; // Atualizar os rótulos do eixo x
    chart.update();
  } else {
    // Configurar o gráfico pela primeira vez
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Sensor 1',
          data: data1,
          borderColor: 'blue',
          fill: false
        }, {
          label: 'Sensor 2',
          data: data2,
          borderColor: 'red',
          fill: false
        }]
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 10
            }
          }
        }
      }
    });
  }
}

// Carregar e processar o arquivo CSV inicialmente
loadCSVAndUpdateChart('../dados.csv');

// Atualizar o gráfico a cada 1 segundo
setInterval(function() {
  loadCSVAndUpdateChart('../dados.csv');
}, 1000);
