// import the data 
d3.json("samples.json").then((data) => {
      console.log(data)
      
//\\\\\\\\\\\\\\\\\\\\\\\\\\DROPDOWN LIST
      // select dropdown menu by index
      var dropDownMenu = d3.select("#selDataset");
      // get dropdown options - names
      var names = data.names
      // append names to dropdown options
      names.forEach(element => { 
            dropDownMenu.append("option")
                        .text(element)
                        .property("value", element)
                  });
      // display html ID value            
      var ID = names[0];
      document.getElementById("id").innerHTML = ID;
      
//===============================INITIALISE INFO/GRAPHS =================================================
      function init() {
            //initial sample
            var initDemo = data.metadata[0];
            var initialId = data.samples[0];
            var initData = [];
            var htmlDemo = [];

///\\\\\\\\\\\\\\\\\\\\\\\\\\\\DEMOGRAPHIC INFO
            Object.entries(initDemo).forEach(function([key, value]) {
                  htmlDemo.push("<p><b>" + key.toUpperCase() + "</b>" + ": <br>" + value + "</p>")
                  })
            document.getElementById("sample-metadata").innerHTML = htmlDemo.join("");
            
// \\\\\\\\\\\\\\\\\\\\\\\\\\\BAR GRAPH
            initData.push(initialId)
            //sort values by sample_values
            var sortedSample = initData.sort((a, b) => b.sample_values - a.sample_values);   
            //slice the first 10 objects and reverse order for plotting
            var initSamples = sortedSample[0].sample_values.slice(0,10).reverse(); 
            var initOtuId = sortedSample[0].otu_ids.slice(0,10).reverse()
                  initOtuId = initOtuId.map(function(obj){return 'OTU ' + obj + '  ';});// add a prefix for each object in array
            var initOtuLabels = sortedSample[0].otu_labels.slice(0,10).reverse();
                  
            var trace1 = {
                  x: initSamples,
                  y: initOtuId,
                  text: initOtuLabels,
                  type: "bar",
                  orientation: "h"
            };
            // trace1 to array
            var chartData = [trace1];
            // apply the group bar mode to the layout
            var layout = {
                  title: `<b>Top 10 OTU Samples</b>`,
                  margin: {
                        l: 100,
                        r: 100,
                        t: 30,
                        b: 40
                        },
                  xaxis: {title: `<b>Sample Values<b>`},
                  width: 500,
                  height: 600
            };
            //render the plot to the div tag with id "plot"
            Plotly.newPlot("bar", chartData, layout);

//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\BUBBLE CHART
            var trace2 = {
                  x: initialId.otu_ids,
                  y: initialId.sample_values,
                  text: initOtuLabels,
                  mode: 'markers',
                  marker: {
                    size: initialId.sample_values,
                    color: initialId.otu_ids
                  }
            };
            //trace2 to array
            var data2 = [trace2];
            //apply the group mode to the layout  
            var layout2 = {
                  title: `<b>OTU Sample Values</b>`,
                  xaxis: {title: `<b>OTU ID<b>`},
                  yaxis: {title: `<b>Sample Values<b>`},
                  showlegend: false,
                  height: 600,
                  width: 1200
            };
            //render the plot to the div tag with id "bubble"
            Plotly.newPlot("bubble", data2, layout2);

//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\GAuGE
//https://plotly.com/javascript/gauge-charts/
      var data3 = [
            {
            domain: { x: [0, 1], y: [0, 1] }, //semi-circle domain
            value: initDemo.wfreq, //subject ID No.
            title: { 
                  text: `<b>Belly Button Washing Frequency</b><br>Scrubs per Week` },
                  type: "indicator",
                  mode: "gauge+number",
                  gauge: {
                        axis: {range: [null, 9]},
                        //https://gka.github.io/palettes/#/9|s|9d9d9d,96ffea,ffffe0|ffffe0,ff005e,93003a|0|1
                        //create ranges for gauge and choose color
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
                        bar: {color: "green"} //colour of gauge
                  }
            }
      ];
      //size gauge on page
      var layout3 = {width: 500, height: 500};
      //render the plot to the div tag with id "gauge"
      Plotly.newPlot("gauge", data3, layout3);           
      }
      
// ====================LISTEN FOR DROPDOWN CHANGES==================================================
      d3.selectAll("#selDataset").on("change", getData);
      // get data for user input fromn dropdown option
//----------------------------------------------------------------------------------------     
      function getData() {
            // prevent the page from refreshing
            d3.event.preventDefault();
            // get subject id no from dropdown list
            var inputElement = d3.select("#selDataset");
            var selSubject = inputElement.property("value");
            //find data matching user input from dropdown menu and save it
            for (var i = 0; i < data.metadata.length; i++) {
                  check = data.metadata[i].id;
                  if (check == selSubject) {
                        var subject = data.metadata[i] };
                  subjectSample = data.samples[i].id;
                  if (subjectSample == selSubject) {
                        var sampleId = data.samples[i] };
            };
            // display html ID value
            var ID = sampleId.id
            document.getElementById("id").innerHTML = ID;

            //push dropdown selected sample to charting functions
            descriptionInfo(subject);
            barChart(sampleId);
            bubbleChart(sampleId);
            gaugeChart(subject); 
      }

//------------------------------------------------------------------------------------------------
      //update subject description info
      function descriptionInfo(input) {
            var htmlDemo = [];
            //for each key and value, create a new array of HTML data to push into site
            Object.entries(input).forEach(function([key, value]) {
                  htmlDemo.push("<p><b>" + key.toUpperCase() + "</b>" + ": <br>" + value + "</p>")
            })
            document.getElementById("sample-metadata").innerHTML = htmlDemo.join("");   
      }
//------------------------------------------------------------------------------------------------
      //update bar chart
      function barChart(input) {
            var arr = [];
            arr.push(input);
            //sort input array by sample_values 
            arr.sort((a, b) => b.sample_values - a.sample_values);
            //slice and reverse values to restyle plot      
            var x = arr[0].sample_values.slice(0,10).reverse();
            var y = arr[0].otu_ids.slice(0,10).reverse();
                  var y = y.map(function(obj){return 'OTU ' + obj + '  ';}) //add prefix to each element
            var text = arr.map(object => object.otu_labels.slice(0,10).reverse());

            Plotly.restyle("bar", "x", [x]);
            Plotly.restyle("bar", "y", [y]);
            Plotly.restyle("bar", "text", [text]);
      }
//------------------------------------------------------------------------------------------------
      //update bubble chart
      function bubbleChart(input) {
            //restyle with new input values
            x = input.otu_ids;
            y = input.sample_values;
            text = input.otu_labels;
            Plotly.restyle("bubble", "x", [x]);
            Plotly.restyle("bubble", "y", [y]);
            Plotly.restyle("bar", "text", [text]);
      }
//------------------------------------------------------------------------------------------------
      //update gauge chart
      function gaugeChart(input){
            //restyle plot with new input values
            var washFreq = input.wfreq;
            Plotly.restyle("gauge", "value", washFreq);
      }

      init();      
});