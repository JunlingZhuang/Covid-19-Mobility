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

const leg_circ_size = 8;
const leg_padding = 25;

// color scale for scatter plot
const colScale = d3
  .scaleOrdinal()
  .range([dark_green, dark_pink, med_pink, light_pink])
  .domain(["April 2020", "August 2020", "January 2021", "April 2021"]);

// viz svg
const svg_state = d3.select(".lag").append("svg");

const svg_us = d3.select(".us-graph").append("svg");

const svg_scatter = d3.select(".scatter").append("svg");

Promise.all([
  d3.csv(
    "https://raw.githubusercontent.com/JunlingZhuang/Covid-19-Mobility/main/data/state_data.csv"
  ),
  d3.csv(
    "https://raw.githubusercontent.com/JunlingZhuang/Covid-19-Mobility/main/data/us_ntl_data.csv"
  ),
  d3
    .csv(
      "https://raw.githubusercontent.com/JunlingZhuang/Covid-19-Mobility/main/data/lockdown_data.csv"
    )

    .then(function (data, error) {
      if (error) {
        console.log("reading file error");
      }
      // assigned data to variables
      state_data = data[0];
      us_data = data[1];
      scatter_data = data[2];

      // SETUP
      // initiates elements
      function setup() {
        /* FORMAT DATA TYPES */
        var parseTime = d3.timeParse("%Y-%m-%d");

        /* STATE TIMELINE */
        // sort by lag time and the day the stay-at-home (sah) order began
        state_data.sort(function (x, y) {
          return (
            d3.ascending(
              x.mobility_lockdown_lag_wk,
              y.mobility_lockdown_lag_wk
            ) || d3.ascending(x.sah_week_start_date, y.sah_week_start_date)
          );
        });

        // correct data types
        state_data.forEach(function (d) {
          d.week_start_date = parseTime(d.week_start_date);
          d.sah_week_start_date = parseTime(d.sah_week_start_date);
          d.pct_change_baseline = +d.pct_change_baseline;
          d.log_weekly_new_cases = Math.log(d.weekly_avg_new_cases);
          d.sah_log_weekly_new_cases = Math.log(d.sah_weekly_avg_new_cases);
        });

        /* DOMAINS AND AXES */
        // find x and y domains from data
        var min_date = d3.min(state_data, function (d) {
          return d.week_start_date;
        });
        var x_min = d3.timeDay.offset(min_date, -3);

        var max_date = d3.max(state_data, function (d) {
          return d.sah_week_start_date;
        });
        var x_max = d3.timeDay.offset(max_date, 3);

        var states = state_data.map(function (d) {
          return d.Code;
        });

        // x axis
        x_scale = d3.scaleTime().domain([x_min, x_max]);

        // y axis
        y_scale = d3.scaleBand().domain(states);

        // x axis grid lines
        x_axis_grid = svg_state.append("g").attr("class", "grid");
      }
    }),
]);
