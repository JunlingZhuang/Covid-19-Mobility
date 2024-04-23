// Parse the data
function parseData(data) {
  const parseTime = d3.timeParse("%Y-%m-%d");
  data.forEach((d) => {
    d.week_start_date = parseTime(d.week_start_date);
    d.sah_week_start_date = parseTime(d.sah_week_start_date);
    d.pct_change_baseline = +d.pct_change_baseline; // 转换为数字
    d.log_weekly_new_cases = Math.log(d.weekly_avg_new_cases);
    d.sah_log_weekly_new_cases = Math.log(d.sah_weekly_avg_new_cases);
  });
  return data;
}

export function loadData() {
  return Promise.all([
    d3.csv(
      "https://raw.githubusercontent.com/JunlingZhuang/Covid-19-Mobility/main/data/state_data.csv"
    ),
    d3.csv(
      "https://raw.githubusercontent.com/JunlingZhuang/Covid-19-Mobility/main/data/us_ntl_data.csv"
    ),
    d3.csv(
      "https://raw.githubusercontent.com/JunlingZhuang/Covid-19-Mobility/main/data/lockdown_data.csv"
    ),
  ])
    .then((dataset) => {
      const [state_data, us_data, lockdown_data] = dataset;
      state_data.sort(
        (x, y) =>
          d3.ascending(
            x.mobility_lockdown_lag_wk,
            y.mobility_lockdown_lag_wk
          ) || d3.ascending(x.sah_week_start_date, y.sah_week_start_date)
      );

      return {
        state_data: parseData(state_data),
        us_data: us_data,
        lockdown_data: parseData(lockdown_data),
      };
    })
    .catch((error) => {
      console.error("Error loading the data");
      throw error;
    });
}
