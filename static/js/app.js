// import the data 
d3.json("samples.json").then((data) => {
      console.log(data)

//\\\\\\\\\\\\\\\\\\\\\\\\\\DROPDOWN LIST
      // select dropdown menu by index
      var dropDownMenu = d3.select("#selDataset");
      // get dropdown options
      var names = data.names
      // append names to dropdown options
      names.forEach(element => { 
            dropDownMenu.append("option")
                        .text(element)
                        .property("value", element) 
      var ID = names[0]
      console.log(`id is ${ID}`)
      document.getElementById("id").innerHTML = ID;
      });

//===============================INITIALISE INFO/GRAPHS =================================================
      function init() {
            //initial sample
            var initDemo = data.metadata[0];
            var initialId = data.samples[0]
            var initData = []

///\\\\\\\\\\\\\\\\\\\\\\\\\\\\DEMOGRAPHIC INFO
            var htmlDemo = [];
            Object.entries(initDemo).forEach(function([key, value]) {
                  htmlDemo.push("<p><b>" + key.toUpperCase() + "</b>" + ": " + value + "</p>")
                  })
            document.getElementById("sample-metadata").innerHTML = htmlDemo.join("");
            
// \\\\\\\\\\\\\\\\\\\\\\\\\\\BAR GRAPH
            initData.push(initialId)
            var sortedSample = initData.sort((a, b) => b.sample_values - a.sample_values);   

            //slice the first 10 objects and reverse order for plotting
            var initSamples = sortedSample[0].sample_values.slice(0,10).reverse() 
            var initOtuId = sortedSample[0].otu_ids.slice(0,10).reverse()
            var initOtuId = initOtuId.map(function(obj){return 'OTU ' + obj; })      // add a prefix
            var initOtuLabels = sortedSample[0].otu_labels.slice(0,10).reverse()
                  
            var trace1 = {
                  x: initSamples,
                  y: initOtuId,
                  type: "bar",
                  orientation: "h"
                  };

            // data
            var chartData = [trace1];

            // Apply the group bar mode to the layout
            var layout = {
            title: `<b>Top 10 OTU Counts</b>`,
            margin: {
                  l: 100,
                  r: 100,
                  t: 30,
                  b: 30
                  },
            width: 500,
            height: 600
            };
            //Render the plot to the div tag with id "plot"
            Plotly.newPlot("bar", chartData, layout);

//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\BUBBLE CHART
            var trace2 = {
                  x: initialId.otu_ids,
                  y: initialId.sample_values,
                  mode: 'markers',
                  marker: {
                    size: initialId.sample_values,
                    color: initialId.otu_ids
                  }
            };
                
            var data2 = [trace2];
                
            var layout2 = {
                  title: 'Marker Size',
                  showlegend: false,
                  height: 600,
                  width: 1200
            };
            Plotly.newPlot('bubble', data2, layout2);

//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\GUAGE
      var data3 = [
            {//https://plotly.com/javascript/gauge-charts/
            domain: { x: [0, 1], y: [0, 1] },
            value: initDemo.wfreq,
            title: { 
                  text: `<b>Belly Button Washing Frequency</b><br>Scrubs per Week` },
                  type: "indicator",
                  mode: "gauge+number",
                  gauge: {
                        axis: {range: [null, 9]},
                        //https://gka.github.io/palettes/#/9|s|9d9d9d,96ffea,ffffe0|ffffe0,ff005e,93003a|0|1
                        steps: [
                              {range: [null, 1], color: "#ffffe0"},
                              {range: [1, 2], color: "#eafee1"},
                              {range: [2, 3], color: "#d6f9df"},
                              {range: [3, 4], color: "#c5f1db"},
                              {range: [4, 5], color: "#b7e6d4"},
                              {range: [5, 6], color: "#acd8ca"},
                              {range: [6, 7], color: "#a5c7bd"},
                              {range: [7, 8], color: "#a0b4ae"},
                              {range: [8, 9], color: "#9d9d9d"}
                              ],
                  bar: {color: "green"}
                        }
            }
      ];
      var layout3 = {width: 500, height: 500};
      Plotly.newPlot('gauge', data3, layout3);
                  
      }
      
// ====================LISTEN FOR DROPDOWN CHANGES==================================================
      d3.selectAll("#selDataset").on("change", getData);
      // get data for user input fromn dropdown option
      function getData() {
            // prevent the page from refreshing
            d3.event.preventDefault();
            // get subject id no from dropdown list
            var inputElement = d3.select("#selDataset");
            var selSubject = inputElement.property("value");
            // find subject id metadata and samples
            var subject = [];
            var sampleId = [];
            for (var i = 0; i < data.metadata.length; i++) {
                  check = data.metadata[i].id
                  if (check == selSubject) {
                        subject = data.metadata[i] }
                  subjectSample = data.samples[i].id
                  if (subjectSample == selSubject) {
                        sampleId = data.samples[i] }
            } 
            // display html ID value
            var ID = sampleId.id
            console.log(`id is ${ID}`)
            document.getElementById("id").innerHTML = ID;


            //push dropdown selected sample to charting functions
            descriptionInfo(subject);
            barChart(sampleId);
            bubbleChart(sampleId)
            gaugeChart(subject)   
      }

//------------------------------------------------------------------------------------------------
      function descriptionInfo(input) {
            var htmlDemo = []
            Object.entries(input).forEach(function([key, value]) {
                  htmlDemo.push("<p><b>" + key + "</b>" + ": " + value + "</p>")
                  })
            document.getElementById("sample-metadata").innerHTML = htmlDemo.join("");   
      }
//------------------------------------------------------------------------------------------------
      function barChart(input) {
            var arr = [];
            arr.push(input);
            console.log(arr)
            arr.sort((a, b) => b.sample_values - a.sample_values);
            // var sampleData = sortedSample.slice(0,10);
            // var reverseSample = sampleData.reverse()
                    
            var x = arr[0].sample_values.slice(0,10).reverse();
            var y = arr[0].otu_ids.slice(0,10).reverse();
                  var y = y.map(function(obj){return 'OTU ' + obj;})
            var text = arr.map(object => object.otu_labels.slice(0,10).reverse());
            console.log(text)
            Plotly.restyle("bar", "x", [x]);
            Plotly.restyle("bar", "y", [y]);
       //     Plotly.restyle("bar", "text", [text]);
      }
//------------------------------------------------------------------------------------------------
      function bubbleChart(input) {
            x = input.otu_ids
            y = input.sample_values

            Plotly.restyle("bubble", "x", [x]);
            Plotly.restyle("bubble", "y", [y]);
      }
//------------------------------------------------------------------------------------------------
      function gaugeChart(input){
            var washFreq = input.wfreq;
            Plotly.restyle("gauge", "value", washFreq);
      }

      
      init();    
      
});