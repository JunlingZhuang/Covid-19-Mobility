import { loadData } from "./dataLoader.js";
import { drawlineChart } from "./lineChart.js";

document.addEventListener("DOMContentLoaded", function () {
  const svgLineChart = d3.select(".us-graph").append("svg");
  //   const svgNational = d3.select(".national-chart").append("svg");
  //   const svgScatter = d3.select(".scatter-plot").append("svg");

  loadData().then((data) => {
    drawlineChart(svgLineChart, data.us_data);
    // drawNationalChart(svgNational, data[1]);
    // drawScatterPlot(svgScatter, data[2]);
  });
});
