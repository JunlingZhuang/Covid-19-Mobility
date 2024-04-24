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
  console.log("state data", state_data);
  /* US State GRAPH */
  /* STATE TIMELINE */
  // sort by lag time and the day the stay-at-home (sah) order began
  state_data.sort(function (x, y) {
    return (
      d3.ascending(x.mobility_lockdown_lag_wk, y.mobility_lockdown_lag_wk) ||
      d3.ascending(x.sah_week_start_date, y.sah_week_start_date)
    );
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
  var x_scale = d3.scaleTime().domain([x_min, x_max]);

  // y axis
  var y_scale = d3.scaleBand().domain(states);

  // x axis grid lines
  var x_axis_grid = svg_state.append("g").attr("class", "grid");

  // create lines that connect the circles
  var lines_btwn = svg_state
    .append("g")
    .attr("class", "lines_btwn_circs_g")
    .selectAll(null)
    .data(state_data)
    .enter()
    .append("line")
    .attr("class", "line_between")
    .attr("id", function (d) {
      return d.Code;
    })
    .attr("stroke", config.grey)
    .attr("stroke-width", config.line_width)
    .attr("opacity", 1)
    .on("mouseover", onMouseover)
    .on("mouseout", onMouseout);

  // create the circles for when the state observed its largest decline in mobility (week_start_date)
  var start_circs = svg_state
    .append("g")
    .attr("class", "start_circ_g")
    .selectAll(null)
    .data(state_data)
    .enter()
    .append("circle")
    .attr("class", "start")
    .attr("id", function (d) {
      return d.Code;
    })
    .style("fill", config.med_pink)
    .attr("r", function (d) {
      return d.log_weekly_new_cases;
    })
    .on("mouseover", onMouseover)
    .on("mouseout", onMouseout);

  // create the circles for when the state imposed stay-at-home order
  var sah_circs = svg_state
    .append("g")
    .attr("class", "sah_circ_g")
    .selectAll(null)
    .data(state_data)
    .enter()
    .append("circle")
    .attr("class", "sah")
    .attr("id", function (d) {
      return d.Code;
    })
    .style("fill", config.dark_green)
    .attr("r", function (d) {
      return d.sah_log_weekly_new_cases;
    })
    .on("mouseover", onMouseover)
    .on("mouseout", onMouseout);

  // legend
  // circles for categorical color data (sah date vs date of largest mobility drop)
  var col_circ = state_leg_data.filter(function (d, i) {
    return i < 2;
  });

  var state_leg = svg_state
    .append("g")
    .attr("class", "state_leg")
    .selectAll(null)
    .data(col_circ)
    .enter()
    .append("circle")
    .attr("r", config.leg_circ_size)
    .style("fill", function (d) {
      return d.color;
    });

  // labels for color circles
  var state_leg_color_lab = d3
    .selectAll(".state_leg")
    .selectAll("text")
    .data(col_circ)
    .enter()
    .append("text")
    .text(function (d) {
      return d.label;
    });

  // circles for size
  var state_leg_sizes = d3
    .selectAll(".state_leg")
    .selectAll(null)
    .data(state_leg_data)
    .enter()
    .append("circle")
    .attr("r", function (d) {
      return d.size;
    })
    .style("fill", "black");

  // label for size circles
  var state_leg_size_lab = d3
    .selectAll(".state_leg")
    .append("text")
    .text("New Covid Cases (log)");

  // circles for party
  var state_leg_party = d3
    .selectAll(".state_leg")
    .selectAll(null)
    .data(col_circ)
    .enter()
    .append("circle")
    .attr("r", 4)
    .style("fill", function (d) {
      if (d.party == "Democrat governor") {
        return "blue";
      } else {
        return "red";
      }
    });

  // label for party circles
  var state_leg_party_lab = d3
    .selectAll(".state_leg")
    .selectAll(null)
    .data(col_circ)
    .enter()
    .append("text")
    .text(function (d) {
      return d.party;
    });

  ////////////////////////////////////////////////////////////////////////
  // RESIZE
  // sets height and width based on device
  var screen_height = window.innerHeight;
  var screen_width = window.innerWidth;
  var width, state_height, ticks_unit, leg_width;
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
  /* STATE DATA */
  // desktop set up
  var state_height;
  if (screen_width > 900) {
    state_height = screen_height * 0.8;
    // mobile set up
  } else {
    state_height = screen_height;
  }

  svg_state.attr("width", width).attr("height", state_height);

  x_scale.range([0, width - 2 * config.margin.left]);
  y_scale.range([0, state_height - config.margin.top]);

  console.log(config.margin.top, config.margin.top);
  // x axis
  svg_state
    .append("g")
    .attr("class", "x_axis")
    .attr("id", "lag_x_axis")
    .call(
      d3.axisTop(x_scale).ticks(ticks_unit).tickFormat(d3.timeFormat("%b %d"))
    ) // "Mar 2020"
    .attr(
      "transform",
      "translate(" + config.margin.left + "," + config.margin.top + ")"
    );

  // add x gridlines
  function make_state_x_gridlines() {
    return d3.axisBottom(x_scale).ticks(ticks_unit);
  }

  console.log(config.margin.top, state_height);
  x_axis_grid
    .attr(
      "transform",
      "translate(" + config.margin.left + "," + state_height + ")"
    )
    .call(
      make_state_x_gridlines()
        .tickSize(-(state_height - config.margin.top))
        .tickFormat("")
        .tickSizeOuter(0)
    );

  console.log(config.label_type_size, config.margin.top);
  // y axis
  svg_state
    .append("g")
    .attr("class", "y_axis")
    .attr("id", "lag_y_axis")
    .call(d3.axisLeft(y_scale))
    .attr(
      "transform",
      "translate(" + config.label_type_size + "," + config.margin.top + ")"
    );

  // assign y-axis labels (the state codes) an id so that their style attributes can be manipulated in mouseover/out events
  svg_state
    .select(".y_axis")
    .selectAll("text")
    .attr("text-anchor", "start")
    .attr("id", function (d, i) {
      return state_data[i].Code;
    });

  // party circles
  var party_circ = d3
    .select("#lag_y_axis")
    .append("g")
    .attr("class", "party_circ")
    .selectAll(null)
    .data(state_data)
    .enter()
    .append("circle")
    .attr("class", "party")
    .attr("id", function (d, i) {
      return d.Code;
    })
    .attr("r", 2.5)
    .style("fill", function (d) {
      if (d.governor_party == "democrat") {
        return "blue";
      } else {
        return "red";
      }
    })
    .attr("cx", config.label_type_size + 5)
    .attr("cy", function (d) {
      return y_scale(d.Code) + config.lag_label_type_size;
    });
}

// FUNCTIONS

/* MOUSEOVER FUNCTION */
function onMouseover(e, d) {
  div.transition().duration(100).style("opacity", 1);

  div
    .html(
      "<span class = tooltip_text>" +
        d.region +
        ": " +
        d.mobility_lockdown_lag_wk +
        " week lag" +
        "</span>"
    )
    .style("left", e.pageX + 5 + "px")
    .style("top", e.pageY - 25 + "px");

  var this_id = d3.select(this).attr("id");

  d3.selectAll("circle").attr("opacity", 0.1);
  d3.selectAll("line").attr("opacity", 0.1);
  d3.selectAll("text").attr("opacity", 0.1);

  d3.selectAll("#" + this_id).attr("opacity", 1);
}

function onMouseout() {
  div.transition().duration(1000).style("opacity", 0);

  d3.selectAll("circle").attr("opacity", 1);
  d3.selectAll("line").attr("opacity", 1);
  d3.selectAll("text").attr("opacity", 1);
}

export function drawStateChart(svg_state, state_data) {
  setup(svg_state, state_data);
}
