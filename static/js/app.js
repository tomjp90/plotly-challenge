// import the data 
d3.json("samples.json").then((data) => {
      console.log(data)
      // select dropdown menu by index
      var dropDownMenu = d3.select("#selDataset");
      // get dropdown options
      var names = data.names
      // append names to dropdown options
      names.forEach(element => { 
            dropDownMenu.append("option")
                        .text(element)
                        .property("value", element) 
      });

      //INITIAL DESCRIPTION PANEL --------------------------------------------------------------------
      function init() {
            var initDemo = data.metadata[0];
            var htmlDemo = [];
            Object.entries(initDemo).forEach(function([key, value]) {
                  htmlDemo.push("<p><b>" + key + "</b>" + ": " + value + "</p>")
            })
            document.getElementById("sample-metadata").innerHTML = htmlDemo.join("");
      }

      // LISTEN FOR DROPDOWN CHANGES---------------------------------------------------------------------
      d3.selectAll("#selDataset").on("change", getData);
      // get data for user input fromn dropdown option
      function getData() {
            // prevent the page from refreshing
            d3.event.preventDefault();
            var inputElement = d3.select("#selDataset");
            var selSubject = inputElement.property("value");

            var subject = [];
            var sampleId = [];
            for (var i = 0; i < data.metadata.length; i++) {
                  check = data.metadata[i].id
                  if (check == selSubject) {
                        subject = data.metadata[i] 
                  }
                  sample = data.samples[i].id
                  if (sample == selSubject) {
                        sampleId = data.samples[i] 
                  }
            } 

      descriptionInfo(subject);
      barChart(sampleId);
            
      }

      function descriptionInfo(subject) {
            var htmlDemo = []
            Object.entries(subject).forEach(function([key, value]) {
                  htmlDemo.push("<p><b>" + key + "</b>" + ": " + value + "</p>")
            })
            document.getElementById("sample-metadata").innerHTML = htmlDemo.join("");   
      }

      function barChart(sampleId){
            // create empty array to push selected input data
            var arr = [];
            arr.push(sampleId)
            // sort array of samples_values
            var sortedSample = arr.sort((a, b) => b.sample_values - a.sample_values);
            // slice the first 10 objects for plotting
            var sortedSample = sortedSample.slice(0, 10);
            // Reverse the array to accommodate Plotly's defaults
            var sortedSample = sortedSample.reverse();
            // Add "OTU" prefix to the IDs
            var sortedSample = sortedSample.map(i => ({ ...i, otu_ids: 'OTU ' + i.otu_ids }));
            console.log(sortedSample)
            // var sampleValues = reverseSample.sample_values
            // var otuId = reverseSample.otu_ids
            
            var trace1 = {
                  x: sortedSample.flatMap(object => object.sample_values),
                  y: sortedSample.flatMap(object => object.otu_ids),
                  type: "bar",
                  orientation: "h"
                  };

            // data
            var chartData = [trace1];

            // Apply the group bar mode to the layout
            var layout = {
            title: "OTU vs Sample",
            margin: {
                  l: 100,
                  r: 100,
                  t: 100,
                  b: 100
                  }
            };

            //Render the plot to the div tag with id "plot"
            Plotly.newPlot("bar", chartData, layout);
      }
      

      
      init();    
});