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

function processCSVAndUpdateChart(csvData) {
  var lines = csvData.split('\n');
  var data1 = []; // Dados do Sensor 1
  var data2 = []; // Dados do Sensor 2

  for (var i = 0; i < lines.length; i++) {
    var values = lines[i].split(',');
    var x = parseFloat(values[1]);
    var y1 = parseFloat(values[1]); // Valor do Sensor 1
    var y2 = parseFloat(values[2]); // Valor do Sensor 2
    data1.push({ x: x, y: y1 });
    data2.push({ x: x, y: y2 });
  }
  // Atualizar o gráfico com os dados
  updateChart(data1, data2);
}

// Atualizar o gráfico com os dados
function updateChart(data1, data2) {
  var ctx = document.getElementById('myChart').getContext('2d');

  // Verificar se o gráfico já foi inicializado
  var chart = Chart.getChart(ctx);

  if (chart) {
    // Atualizar os dados do gráfico existente
    chart.data.datasets[0].data = data1;
    chart.data.datasets[1].data = data2;
    chart.update();
  } else {
    // Configurar o gráfico pela primeira vez
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
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
  console.log(data1);
  console.log(data2);
}, 1000);