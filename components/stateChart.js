import config from "./config.js";

// tooltip
const div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// legends
const state_leg_data = [
  {
    label: "Largest mobility decline",
    size: 4,
    color: "#D9A4C5",
    party: "Democrat governor",
  },
  {
    label: "Lockdown start",
    size: 8,
    color: "#1D5902",
    party: "Republican governor",
  },
  { size: 12 },
];


function setup(svg_state, state_data) {
    console.log("state data",state_data);

    
}


export function drawStateChart(svg_state, state_data) {
    setup(svg_state, state_data)
}