// margins
const margin = { top: 25, bottom: 0, left: 40, right: 40 };

// colors
const light_green = "#E6F6D7";
const med_green = "#C1DAB0";
const dark_green = "#1D5902";
const light_pink = "#F8D7EB";
const med_pink = "#D9A4C5";
const dark_pink = "#B55997";
const grey = "#DBDBDB";

//arrow
const arrowPoints = [
  [0, 0],
  [0, 20],
  [20, 10],
];
const arrow_padding = 8;
const arrow_margin = {
  top: 20,
  bottom: 60,
  left: margin.left + arrow_padding,
  right: margin.left + arrow_padding + 60,
};
const label_leading = 20;
const arrowhead_width = 4;
const arrowhead_height = 6;

// covid milestones
const milestones = [
  { Name: "WHO declares pandemic", milestone_date: "2020-03-11" },
  { Name: "US records first COVID death", milestone_date: "2020-02-06" },
  { Name: "More than 80,000 confirmed cases", milestone_date: "2020-03-27" },
];

// miscellaneous
const num_states = 43; // 43 states with stay at home orders (7 never implemented one)
const line_width = 2; // lines (arrow and connecting dots)
const week_filter = 20; // how many weeks to include on area chart
const label_type_size = 9.5; // type size of axis labels using for spacing
const lag_label_type_size = 8;

// tooltip
const div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
