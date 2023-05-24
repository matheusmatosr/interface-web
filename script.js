// Carregar o arquivo CSV
function loadCSV(file, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        callback(xhr.responseText);
      }
    };
    xhr.open('GET', file, true);
    xhr.send();
}

// Processar o arquivo CSV
function processCSV(csvData) {
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

  // Configurar o gráfico
  var chart = new Chart(ctx, {
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

// Carregar e processar o arquivo CSV
loadCSV('dados.csv', processCSV);
