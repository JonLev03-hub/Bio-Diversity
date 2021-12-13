function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    selector.append("option").text("Select an ID")
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
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  d3.json("samples.json").then((data) => { 
    samples = data.samples
    sample = samples.filter(x => x.id == sample)[0]
    let otuids = sample.otu_ids
    let sampleValues = sample.sample_values
    let otuLables = sample.otu_labels
    console.log(otuLables)
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
  });
}
