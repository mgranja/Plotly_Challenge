function buildMetadata(sample) {
    /* data route */
  var url = '/metadata/' + sample;
  var panel = d3.select(`#sample-metadata`);
  
    // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  
    // Use `.html("") to clear any existing metadata
  panel.html("");
  
  
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
  d3.json(url).then(function (data) {
    Object.entries(data).forEach(([key, value]) => {
      panel.append('h5').text(`${key}: ${value}`);

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

      var level = data.WFREQ;

      // Trig to calc meter point
      var degrees = 180 - (level * 20),
      radius = .5;
      var radians = degrees * Math.PI / 180;
      var x = radius * Math.cos(radians);
      var y = radius * Math.sin(radians);

          // Path: may have to change to create a better triangle
      var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
      var path = mainPath.concat(pathX,space,pathY,pathEnd);

      var gaugeData = [{ 
        type: 'scatter',
        x: [0], 
        y:[0],
        marker: {size: 28, color:'rgb(133, 0, 0)'},
        showlegend: false,
        name: 'WFREQ',
        direction: 'clockwise',
        text: level},
        {values: [81 / 9, 81 / 9, 81 / 9, 81 / 9, 81 / 9, 81 / 9, 81 / 9, 81 / 9, 81 / 9, 81],
          rotation: 90,
          text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1'],
          textinfo: 'text',
          textposition:'inside',	  
          marker: {colors: ['rgb(132, 181, 137)', 'rgb(137, 188, 141)', 'rgb(139, 192, 134)', 'rgb(183, 205, 143)', 'rgb(213, 229, 153)', 'rgb(229, 232, 176)', 'rgb(233, 231, 201)', 'rgb(244, 241, 228)', 'rgb(248, 243, 236)', 'rgb(255, 255, 255']},
          labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
          hoverinfo: 'label',
          hole: .5,
          type: 'pie',
          showlegend: false
        }];

        var layout = {
          shapes:[{
              type: 'path',
              path: path,
              fillcolor: 'rgb(133, 0, 0)',
              line: {
                color: 'rgb(133, 0, 0)'
                }
              }],
            title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
            xaxis: {zeroline:false, showticklabels:false,
                  showgrid: false, range: [-1, 1]},
            yaxis: {zeroline:false, showticklabels:false,
                  showgrid: false, range: [-1, 1]}
            };

        Plotly.newPlot('gauge', gaugeData, layout);

      });
    });
  }

function buildCharts(sample) {
  
    var url = `/samples/${sample}`;

    d3.json(url).then(function(data) {

      var otu_ids = data.otu_ids;
      var sample_values = data.sample_values;
      var otu_labels = data.otu_labels;

      var trace1 = {
        type: 'bubble',
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: { size : sample_values,
          color: otu_ids
        }
      };
     
      var trace1 = [trace1];

      var layout = {
        xaxis: {
          width: 1000,
          title: {
            text: 'OTU ID',
            font: {
              size:14,
              color: 'black'
            }
          }
        }
      };
      
      Plotly.newPlot('bubble',trace1, layout);
   

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    var data = [{
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      type: 'pie',     
      hovertext: otu_labels.slice(0,10),
    }];

    Plotly.newPlot('pie', data);

    })
  }

    // @TODO: Build a Bubble Chart using the sample data
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
