// Define margin and arrow_padding outside the config object
const margin = { top: 25, bottom: 0, left: 40, right: 40 };
const arrow_padding = 8;

// Now define the config object using the previously defined variables
const config = {
  margin: margin,
  colors: {
    light_green: "#E6F6D7",
    med_green: "#C1DAB0",
    dark_green: "#1D5902",
    light_pink: "#F8D7EB",
    med_pink: "#D9A4C5",
    dark_pink: "#B55997",
    grey: "#DBDBDB",
  },

  // arrow settings
  arrowPoints: [
    [0, 0],
    [0, 20],
    [20, 10],
  ],
  arrow_padding: arrow_padding,
  arrow_margin: {
    top: 20,
    bottom: 60,
    left: margin.left + arrow_padding,
    right: margin.left + arrow_padding + 60,
  },
  arrowhead_width: 4,
  arrowhead_height: 6,

  // label settings
  label_leading: 20,

  // milestones
  milestones: [
    { Name: "WHO declares pandemic", milestone_date: "2020-03-11" },
    { Name: "US records first COVID death", milestone_date: "2020-02-06" },
    { Name: "More than 80,000 confirmed cases", milestone_date: "2020-03-27" },
  ],

  // miscellaneous
  num_states: 43, // 43 states with stay at home orders (7 never implemented one)
  line_width: 2, // lines (arrow and connecting dots)
  week_filter: 20, // how many weeks to include on area chart
  label_type_size: 9.5, // type size of axis labels using for spacing
  lag_label_type_size: 8, // type size of lag labels
};

export default config;
