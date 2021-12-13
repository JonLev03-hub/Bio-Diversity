function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    
      var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: result.wfreq,
          title: { text: "Belly Button Wash Frequency" },
          type: "indicator",
          mode: "gauge+number"
        }
      ];
      
      var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
      Plotly.newPlot('gauge', data, layout);
    
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  d3.json("samples.json").then((data) => { 
    samples = data.samples
    sample = samples.filter(x => x.id == sample)[0]
    var otuids = sample.otu_ids
    var sampleValues = sample.sample_values
    var otuLables = sample.otu_labels

    var yticks = otuids.slice(0,10).map(id =>`OTU Id ${id}`).reverse()
    var xticks = sampleValues.slice(0,10).reverse()
    var barData = [{
      x : xticks,
      y : yticks,
      type : "bar",
      orientation: 'h', 
      text : otuLables 
    }]; 
    var barLayout = {
      title : "Belly Button Colonies",
    };
    Plotly.newPlot("bar",barData,barLayout)

  var trace1 = {
    x: otuids,
    y: sampleValues,
    text: otuLables,
    mode: 'markers',
    marker: {
      size: sampleValues,
      color : otuids
    }
  };
  
  var data = [trace1];
  var layout = {
    title: 'Inside your naval',
    showlegend: false,
    xaxis : {
      title : "Bacteria Types"
    }
  };
  
  Plotly.newPlot('bubble', data, layout);
  });
}
