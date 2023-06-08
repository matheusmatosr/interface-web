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

// Processar o arquivo CSV e atualizar o gráfico
function processCSVAndUpdateChart(csvData) {
  var lines = csvData.split('\n');
  var data = [];

  for (var i = 0; i < lines.length; i++) {
    var values = lines[i].split(',');
    var x = parseFloat(values[1]);
    var y = parseFloat(values[2]);
    data.push({ x: x, y: y });
  }

  // Atualizar o gráfico com os dados
  updateChart(data);
}

// Atualizar o gráfico com os dados
function updateChart(data) {
  var ctx = document.getElementById('myChart').getContext('2d');

  // Verificar se o gráfico já foi inicializado
  var chart = Chart.getChart(ctx);

  if (chart) {
    // Atualizar os dados do gráfico existente
    chart.data.datasets[0].data = data;
    chart.update();
  } else {
    // Configurar o gráfico pela primeira vez
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Valores',
          data: data,
          borderColor: 'blue',
          fill: false
        }]
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom'
          }
        }
      }
    });
  }
}

// Carregar e processar o arquivo CSV inicialmente
loadCSVAndUpdateChart('dados.csv');

// Atualizar o gráfico a cada 1 segundo
setInterval(function() {
  loadCSVAndUpdateChart('dados.csv');
}, 1000);