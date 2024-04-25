import config from "./config.js";

// tooltip
const div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

function setup(svg_scatter, scatter_data) {
  console.log(scatter_data);

  // color scale for scatter plot
  const colScale = d3
    .scaleOrdinal()
    .range([
      config.colors.dark_green,
      config.colors.dark_pink,
      config.colors.med_pink,
      config.colors.light_pink,
    ])
    .domain(["April 2020", "August 2020", "January 2021", "April 2021"]);

  /* SCATTERPLOT! */
  scatter_data.forEach(function (d) {
    d.weekly_new_cases_per_100k = +d.weekly_new_cases_per_100k;
    d.pct_change_baseline = +d.pct_change_baseline;
    d.log_weekly_cases_per_100k = Math.log(d.weekly_new_cases_per_100k);
  });

  var scatter_x_min = d3.min(scatter_data, function (d) {
    return d.log_weekly_cases_per_100k;
  });
  var scatter_x_max = d3.max(scatter_data, function (d) {
    return d.log_weekly_cases_per_100k;
  });

  var scatter_y_min = d3.min(scatter_data, function (d) {
    return d.pct_change_baseline;
  });
  var scatter_y_max = d3.max(scatter_data, function (d) {
    return d.pct_change_baseline;
  });

  // x axis
  var x_scale_scatter = d3
    .scaleLinear()
    // 0.5 padding
    .domain([scatter_x_min - 0.5, scatter_x_max + 0.5]);

  // y axis
  var y_scale_scatter = d3
    .scaleLinear()
    // 5% padding
    .domain([scatter_y_max + 5, scatter_y_min - 5]);

  // x axis grid lines
  var scatter_x_grid = svg_scatter.append("g").attr("class", "grid");

  // y axis grid lines
  var scatter_y_grid = svg_scatter.append("g").attr("class", "grid");

  // mobility y axis label
  svg_scatter.append("g").attr("class", "y_label_text");

  // text
  svg_scatter
    .selectAll(".y_label_text")
    .append("text")
    .attr("text-anchor", "top")
    .attr("y", config.arrow_margin.top + 5)
    .attr("x", config.arrow_margin.left + config.label_type_size)
    .text("Change in Mobility");
  svg_scatter
    .selectAll(".y_label_text")
    .append("text")
    .attr("text-anchor", "top")
    .attr("y", config.arrow_margin.top + config.label_leading)
    .attr("x", config.arrow_margin.left + config.label_type_size)
    .text("From Baseline (%)");

  // arrowhead for mobility
  svg_scatter
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
  svg_scatter
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

  // cases x axis label
  svg_scatter.append("g").attr("class", "x_label_text");

  // text
  svg_scatter
    .selectAll(".x_label_text")
    .append("text")
    .attr("text-anchor", "top")
    .text("New Covid Cases per 100,000 (log)");

  // arrowhead for cases
  svg_scatter
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
  svg_scatter
    .append("path")
    .attr("class", "arrow_scatter")
    .attr("stroke", "black")
    .attr("stroke-width", config.line_width)
    .attr("marker-start", "url(#arrow)")
    .attr("fill", "none");

  // make the dots
  var scatter_dots = svg_scatter
    .append("g")
    .attr("class", "scatter_dots")
    .selectAll(null)
    .data(scatter_data)
    .enter()
    .append("circle")
    .attr("class", "scatter_circ")
    .attr("id", function (d) {
      return "circ_" + d.month.replaceAll(" ", "");
    })
    .attr("r", 4)
    .style("fill", function (d) {
      return colScale(d.month);
    })
    .on("mouseover", function (event, d) {
      div.transition().duration(200).style("opacity", 1);

      div
        .html("<span class = tooltip_text>" + d.month + "</span>")
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 25 + "px");

      // highlight all the dots that have the same month as the one hovered
      var selected_month = d3.select(this).attr("id");
      console.log(selected_month);

      d3.selectAll("circle").attr("opacity", 0.05);
      d3.selectAll("#" + selected_month).attr("opacity", 1);
    })
    .on("mouseout", function (d) {
      div.transition().duration(100).style("opacity", 0);

      d3.selectAll("circle").attr("opacity", 1);
    });

  // checkboxes
  d3.selectAll(".checkbox").on("change", function () {
    // filter data if (un)checked
    var selected = this.value;
    var opacity = this.checked ? 1 : 0;

    svg_scatter
      .selectAll(".scatter_circ")
      .filter(function (d) {
        return selected == d.month.replaceAll(" ", "");
      })
      .transition()
      .duration(250)
      .style("opacity", opacity);
  });

  /* TOOLTIP */
  // keep tooltip visible if user scrolls off of element but onto tooltip
  div
    .on("mouseover", function (d) {
      div.transition().style("opacity", "1");
    })
    .on("mouseout", function (d) {
      div.transition().duration(500).style("opacity", "0");
    });

  /////////////////////////////////////////////
  // Resize\

  /* SCATTERPLOT! */

  var screen_height = window.innerHeight;
  var screen_width = window.innerWidth;

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

  var scatter_height = 0.6 * screen_height;

  svg_scatter.attr("width", width).attr("height", scatter_height);

  x_scale_scatter.range([0, width - config.margin.left]);
  y_scale_scatter.range([0, scatter_height - 2 * config.margin.top]);

  // x axis
  svg_scatter
    .append("g")
    .attr("class", "x_axis")
    .attr("id", "scatter_x_axis")
    .call(d3.axisBottom(x_scale_scatter).ticks(4).tickSizeOuter(0))
    .attr(
      "transform",
      "translate(" +
        config.margin.left +
        "," +
        (scatter_height - 2 * config.margin.top) +
        ")"
    );

  // y axis
  svg_scatter
    .append("g")
    .attr("class", "y_axis")
    .attr("id", "scatter_y_axis")
    .call(
      d3
        .axisLeft(y_scale_scatter)
        .ticks(4)
        .tickSizeOuter(0)
        .tickFormat((d) => d + "%")
    )
    .attr("transform", "translate(" + config.margin.left + "," + 0 + ")");

  // add x gridlines
  function make_scatter_x_gridlines() {
    return d3.axisBottom(x_scale_scatter).ticks(4);
  }

  scatter_x_grid
    .attr(
      "transform",
      "translate(" +
        config.margin.left +
        "," +
        (scatter_height - 2 * config.margin.top) +
        ")"
    )
    .call(
      make_scatter_x_gridlines()
        .tickSize(-(scatter_height - config.margin.top))
        .tickFormat("")
    );

  // add y gridlines
  function make_scatter_y_gridlines() {
    return d3.axisLeft(y_scale_scatter).ticks(4);
  }

  scatter_y_grid
    .attr("transform", "translate(" + config.margin.left + "," + 0 + ")")
    .call(
      make_scatter_y_gridlines()
        .tickSize(-(width - config.margin.left))
        .tickFormat("")
    );

  // x axis label
  var scatter_label_height = scatter_height - config.label_type_size + 3;
  var scatter_x_label = svg_scatter.selectAll(".x_label_text").select("text");
  var scatter_x_label_length =
    d3.max(scatter_x_label.nodes(), (n) => n.getComputedTextLength()) + 3;

  svg_scatter
    .selectAll(".x_label_text")
    .select("text")
    .attr("y", scatter_label_height + 3)
    .attr("x", config.margin.left);

  svg_scatter.selectAll(".arrow_scatter").attr(
    "d",
    d3.line()([
      [
        scatter_x_label_length + config.arrow_margin.right,
        scatter_label_height,
      ],
      [scatter_x_label_length + config.arrow_margin.left, scatter_label_height],
    ])
  );

  scatter_dots
    .attr("cx", function (d) {
      return x_scale_scatter(d.log_weekly_cases_per_100k);
    })
    .attr("cy", function (d) {
      return y_scale_scatter(d.pct_change_baseline);
    })
    .attr("transform", "translate(" + config.margin.left + "," + 0 + ")");
}

export function drawScatterPlot(svg_scatter, scatter_data) {
  setup(svg_scatter, scatter_data);
}
