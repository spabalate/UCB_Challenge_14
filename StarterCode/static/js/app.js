// Function to handle dropdown menu change
function optionChanged(selectedSample) {
    d3.json("samples.json").then(function(data) {
        // Find the index of the selectedSample in the names array
        var selectedIndex = data.names.indexOf(selectedSample);

        // Check if the selectedSample exists in the names array
        if (selectedIndex !== -1) {
            // Use the index to get the corresponding metadata
            var selectedData = data.metadata[selectedIndex];

            // Update demographic info
            updateDemographicInfo(selectedData);

            // Call the function to update the bar chart
            updateBarChart(data.samples[selectedIndex]);

            // Call the function to update the bubble chart
            updateBubbleChart(data.samples[selectedIndex]);

            // Call the function to update the gauge chart
            updateGaugeChart(selectedData);
        } else {
            console.error("Selected sample not found in the data.");
        }
    });
}

// Function to update demographic info
function updateDemographicInfo(metadata) {
    var demographicInfo = d3.select("#sample-metadata");
    demographicInfo.html("");

    // Check if metadata is defined and not empty
    if (metadata && Object.keys(metadata).length > 0) {
        // Iterate through metadata and append key-value pairs to the demographic info div
        Object.entries(metadata).forEach(([key, value]) => {
            demographicInfo.append("p").text(`${key}: ${value}`);
        });
    } else {
        // Handle the case when metadata is undefined or empty
        demographicInfo.append("p").text("No demographic information available.");
    }
}

// Function to update bar chart
function updateBarChart(selectedData) {
    var top10Values = selectedData.sample_values.slice(0, 10).reverse();
    var top10Labels = selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    var hoverText = selectedData.otu_labels.slice(0, 10).reverse();

    var trace = {
        type: "bar",
        orientation: "h",
        x: top10Values,
        y: top10Labels,
        text: hoverText
    };

    var layout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU ID" }
    };

    Plotly.newPlot("bar", [trace], layout);
}

// Function to update bubble chart
function updateBubbleChart(selectedData) {
    var trace = {
        x: selectedData.otu_ids,
        y: selectedData.sample_values,
        mode: 'markers',
        marker: {
            size: selectedData.sample_values,
            color: selectedData.otu_ids,
            colorscale: 'Earth'
        },
        text: selectedData.otu_labels
    };

    var layout = {
        title: 'Bubble Chart',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' }
    };

    Plotly.newPlot("bubble", [trace], layout);
}

// Function to update gauge chart
function updateGaugeChart(selectedData) {
    // Assuming 'wfreq' is the key for washing frequency in the metadata
    var washFrequency = selectedData.wfreq;

    // Gauge chart trace
    var trace = {
        type: "indicator",
        mode: "gauge+number",
        value: washFrequency,
        title: { text: "Belly Button Washing Frequency<br>Scrubs per Week" },
        gauge: {
            axis: { range: [0, 9], tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
            bar: { color: "rgba(127,205,187, 0.7)" },  // Change color to match the 'Earth' color scale
            steps: [
                { range: [0, 1], color: "rgba(255, 0, 0, 0.1)" },
                { range: [1, 2], color: "rgba(255, 0, 0, 0.2)" },
                { range: [2, 3], color: "rgba(255, 0, 0, 0.3)" },
                { range: [3, 4], color: "rgba(255, 0, 0, 0.4)" },
                { range: [4, 5], color: "rgba(255, 0, 0, 0.5)" },
                { range: [5, 6], color: "rgba(255, 0, 0, 0.6)" },
                { range: [6, 7], color: "rgba(255, 0, 0, 0.7)" },
                { range: [7, 8], color: "rgba(255, 0, 0, 0.8)" },
                { range: [8, 9], color: "rgba(255, 0, 0, 0.9)" }
            ],
        }
    };

    // Gauge chart layout
    var layout = { width: 600, height: 400 };

    // Create gauge chart
    Plotly.newPlot("gauge", [trace], layout);
}

// Initial data loading and chart rendering
d3.json("samples.json").then(function(data) {
    var dropdownMenu = d3.select("#selDataset");
    data.names.forEach(function(sample) {
        dropdownMenu.append("option").text(sample).property("value", sample);
    });

    // Initial chart rendering
    optionChanged(data.names[0]);
});
