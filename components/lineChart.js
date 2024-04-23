import config from "./config.js";
import { loadData } from "./dataLoader.js";

function setup(svg_us, us_data) {
  console.log(us_data);
  var parseTime = d3.timeParse("%Y-%m-%d");

  /* US NATIONAL GRAPH */
  // filter data
  us_data = us_data.filter(function (d, i) {
    return i < config.week_filter;
  });

  us_data.forEach(function (d) {
    d.week_start_date = parseTime(d.week_start_date);
    d.weekly_avg_new_cases = +d.weekly_avg_new_cases;
    d.pct_change_baseline = +d.pct_change_baseline;
  });

  // sort by week
  us_data.sort(function (x, y) {
    return d3.ascending(x.week_start_date, y.week_start_date);
  });

  var max_covid_cases = d3.max(us_data, function (d) {
    return d.weekly_avg_new_cases;
  });

  console.log(us_data);

  // covid cases line and area chart

  var x_scale_us = d3.scaleTime().domain(
    d3.extent(us_data, function (d) {
      return d.week_start_date;
    })
  );

  var y_scale_cases = d3
    .scaleLinear()
    // 1000 = a little padding at the top
    .domain([0, max_covid_cases + 1000]);
  // x axis grid lines
  var cases_y_grid = svg_us.append("g").attr("class", "grid");

  // x axis grid lines
  var mobility_y_grid = svg_us.append("g").attr("class", "grid");

  // cases y axis label
  svg_us.append("g").attr("class", "y_label_text").attr("id", "cases_y_label");

  // cases y axis text -- line break workaround
  svg_us
    .selectAll("#cases_y_label")
    .append("text")
    .attr("text-anchor", "top")
    .attr("y", config.arrow_margin.top + 5)
    .attr("x", config.arrow_margin.left + config.label_type_size)
    .text("Weekly New");
  svg_us
    .selectAll(".y_label_text")
    .append("text")
    .attr("text-anchor", "top")
    .attr("y", config.arrow_margin.top + config.label_leading)
    .attr("x", config.arrow_margin.left + config.label_type_size)
    .text("Covid Cases");

  // arrowhead for cases
  svg_us
    .append("defs")
    .append("marker")
    .attr("id", "arrow")
    .attr("viewBox", [0, 0, 20, 20])
    .attr("refX", 10)
    .attr("refY", 10)
    .attr("markerWidth", config.arrowhead_width)
    .attr("markerHeight", config.arrowhead_height)
    .attr("orient", "auto-start-reverse")
    .append("path")
    .attr("d", d3.line()(config.arrowPoints))
    .attr("stroke", "black");

  // arrow line for cases
  svg_us
    .append("path")
    .attr(
      "d",
      d3.line()([
        [config.arrow_margin.left, config.arrow_margin.top],
        [config.arrow_margin.left, config.arrow_margin.bottom],
      ])
    )
    .attr("stroke", "black")
    .attr("stroke-width", config.line_width)
    .attr("marker-start", "url(#arrow)")
    .attr("fill", "none");

  // mobility y axis label
  svg_us
    .append("g")
    .attr("class", "y_label_text")
    .attr("id", "mobility_y_label");

  // text
  svg_us
    .selectAll("#mobility_y_label")
    .append("text")
    .attr("id", "mobility_y_label_top")
    .attr("text-anchor", "top")
    .text("Change in Mobility");
  svg_us
    .selectAll("#mobility_y_label")
    .append("text")
    .attr("id", "mobility_y_label_bottom")
    .attr("text-anchor", "top")
    .text("From Baseline (%)");

  // arrowhead for mobility
  svg_us
    .append("defs")
    .append("marker")
    .attr("id", "arrow")
    .attr("viewBox", [0, 0, 20, 20])
    .attr("refX", 10)
    .attr("refY", 10)
    .attr("markerWidth", config.arrowhead_width)
    .attr("markerHeight", config.arrowhead_height)
    .attr("orient", "auto-start-reverse")
    .append("path")
    .attr("d", d3.line()(config.arrowPoints))
    .attr("stroke", "black");

  // arrow line for mobility
  svg_us
    .append("path")
    .attr("class", "arrow_mobility")
    .attr("stroke", "black")
    .attr("stroke-width", config.line_width)
    .attr("marker-end", "url(#arrow)")
    .attr("fill", "none");

  // area chart for covid cases
  const cases_area = svg_us
    .append("g")
    .attr("class", "cases_area")
    .append("path")
    .data([us_data])
    .attr("class", "area_chart")
    .attr("fill", config.colors.dark_green)
    .attr("opacity", 0.3)
    .attr("stroke", "none");

  // line for covid cases
  const cases_line = svg_us
    .append("g")
    .attr("class", "cases_line")
    .append("path")
    .data([us_data])
    .attr("class", "line_chart")
    .attr("fill", "none")
    .attr("stroke", config.colors.dark_green)
    .attr("stroke-width", config.line_width);

  // change in mobility line and area chart

  var max_pct_change_baseline = d3.max(us_data, function (d) {
    return d.pct_change_baseline;
  });
  var min_pct_change_baseline = d3.min(us_data, function (d) {
    return d.pct_change_baseline;
  });

  const y_scale_mobility = d3
    .scaleLinear()
    .domain([min_pct_change_baseline - 5, max_pct_change_baseline + 5]);

  // area chart for mobility
  var mobility_area = svg_us
    .append("g")
    .attr("class", "mobility_area")
    .append("path")
    .data([us_data])
    .attr("class", "area_chart")
    .attr("fill", config.colors.med_pink)
    .attr("opacity", 0.3)
    .attr("stroke", "none");

  // line chart for mobility
  var mobility_line = svg_us
    .append("g")
    .attr("class", "mobility_line")
    .append("path")
    .data([us_data])
    .attr("class", "line_chart")
    .attr("fill", "none")
    .attr("stroke", config.colors.med_pink)
    .attr("stroke-width", config.line_width);

  ////////////////////////////////////////////////////////////////
  //Resize
  const screen_height = window.innerHeight;
  const screen_width = window.innerWidth;
  var width;
  var ticks_unit;
  var leg_width;
  // desktop set up
  if (screen_width > 900) {
    width = screen_width * 0.44;
    ticks_unit = d3.timeDay.every(4);
    leg_width = 0.7 * width;
    // mobile set up
  } else {
    width = screen_width * 0.9;
    ticks_unit = d3.timeDay.every(7);
    leg_width = 0.58 * width;
  }

  /* US LINE GRAPH DATA */
  const us_height = screen_height / 2.2;
  svg_us.attr("width", width).attr("height", us_height);
  var cases_height = us_height * 0.475 - config.margin.top;
  var mobility_start_height = us_height * 0.525;

  // x axis
  x_scale_us
    // 1.5 * margin.left so there is space for y axis label
    .range([config.margin.left, width]);

  // area chart for covid cases
  // y axis
  y_scale_cases.range([cases_height, 0]);
  // x axis
  svg_us
    .append("g")
    .attr("class", "x_axis")
    .attr("id", "us_x_axis")
    .call(
      d3
        .axisBottom(x_scale_us)
        .ticks(3)
        .tickFormat(d3.timeFormat("%b %Y"))
        .tickSizeOuter(0)
        .tickPadding(0.025 * us_height)
    )
    .attr("transform", "translate(" + 0 + "," + cases_height + ")");

  // y axis
  svg_us
    .append("g")
    .attr("class", "y_axis")
    .attr("id", "cases_y_axis")
    .call(
      d3
        .axisLeft(y_scale_cases)
        .ticks(3)
        .tickFormat(d3.format(".0s"))
        .tickSizeOuter(0)
        .tickValues([10000, 20000, 30000])
        .tickPadding(-0.01 * us_height)
    )
    .attr("transform", "translate(" + config.margin.left + "," + 0 + ")");

  // y label
  var mobility_label_height =
    us_height -
    config.arrow_margin.top -
    config.margin.top -
    config.label_leading;
  var mobility_arrow_height = us_height - config.margin.top;

  svg_us
    .selectAll("#mobility_y_label_top")
    .attr("y", mobility_label_height)
    .attr("x", config.arrow_margin.left + config.label_type_size);
  svg_us
    .selectAll("#mobility_y_label_bottom")
    .attr("y", mobility_label_height + config.label_leading - 5)
    .attr("x", config.arrow_margin.left + config.label_type_size);

  svg_us.selectAll(".arrow_mobility").attr(
    "d",
    d3.line()([
      [
        config.arrow_margin.left,
        mobility_arrow_height - config.arrow_margin.bottom,
      ],
      [
        config.arrow_margin.left,
        mobility_arrow_height - config.arrow_margin.top,
      ],
    ])
  );

  // add y gridlines
  // cases graph
  function cases_y_gridlines() {
    return d3.axisLeft(y_scale_cases).ticks(3);
  }

  cases_y_grid
    .call(cases_y_gridlines().tickSize(-width).tickFormat("").tickSizeOuter(0))
    .attr("transform", "translate(" + config.margin.left + "," + 0 + ")");

  cases_area.attr(
    "d",
    d3
      .area()
      .x(function (d) {
        return x_scale_us(d.week_start_date);
      })
      .y0(cases_height)
      .y1(function (d) {
        return y_scale_cases(d.weekly_avg_new_cases);
      })
  );

  // line for area chart
  cases_line.attr(
    "d",
    d3
      .line()
      .x(function (d) {
        return x_scale_us(d.week_start_date);
      })
      .y(function (d) {
        return y_scale_cases(d.weekly_avg_new_cases);
      })
  );

  // area chart for mobility change
  // y axis
  y_scale_mobility.range([
    us_height - config.margin.top,
    mobility_start_height,
  ]);

  // add grid lines
  // mobility graph
  function mobility_y_gridlines() {
    return d3.axisLeft(y_scale_mobility).ticks(3);
  }

  mobility_y_grid
    .call(
      mobility_y_gridlines().tickSize(-width).tickFormat("").tickSizeOuter(0)
    )
    .attr("transform", "translate(" + config.margin.left + "," + 0 + ")");

  mobility_area.attr(
    "d",
    d3
      .area()
      .x(function (d) {
        return x_scale_us(d.week_start_date);
      })
      .y0(mobility_start_height)
      .y1(function (d) {
        return y_scale_mobility(d.pct_change_baseline);
      })
  );

  // line for area chart
  mobility_line.attr(
    "d",
    d3
      .line()
      .x(function (d) {
        return x_scale_us(d.week_start_date);
      })
      .y(function (d) {
        return y_scale_mobility(d.pct_change_baseline);
      })
  );

  // x axis
  svg_us
    .append("g")
    .attr("class", "x_axis_mobility")
    .call(d3.axisBottom(x_scale_us).ticks(0).tickSizeOuter(0))
    .attr("transform", "translate(" + 0 + "," + mobility_start_height + ")");

  // y axis
  svg_us
    .append("g")
    .attr("class", "y_axis")
    .attr("id", "mobility_y_axis")
    .call(
      d3
        .axisLeft(y_scale_mobility)
        .ticks(3)
        .tickFormat((d) => d + "%")
        .tickSizeOuter(0)
        .tickPadding(-0.005 * us_height)
    )
    .attr("transform", "translate(" + config.margin.left + "," + 0 + ")");
}

export function drawlineChart(svg_us, us_data) {
  setup(svg_us, us_data);
  ScrollTrigger.refresh();
  //   resize(svg_us, us_data);
}

export default drawlineChart;
