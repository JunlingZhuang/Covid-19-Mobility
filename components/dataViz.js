import { loadData } from "./dataLoader.js";
import { drawlineChart } from "./lineChart.js";
import { drawStateChart } from "./stateChart.js";

document.addEventListener("DOMContentLoaded", function () {
  const svgLineChart = d3.select(".us-graph").append("svg");
  const svgStateChart = d3.select(".lag").append("svg");
  //   const svgScatter = d3.select(".scatter-plot").append("svg");

  loadData().then((data) => {
    drawlineChart(svgLineChart, data.us_data);
    drawStateChart(svgStateChart, data.state_data);
    // drawScatterPlot(svgScatter, data[2]);
  });
});
