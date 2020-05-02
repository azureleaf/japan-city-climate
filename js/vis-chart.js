// Mapping from field name to index number;
// this improves the accessibility to the towns data
//    by creating the shorthand for indices
// e.g. "fields.total_pop" returns "1"
//    because it's the 2nd element in stats.columns
fields = {};
stats.columns.forEach((column, index) => {
  fields[column] = index;
});

let chart;

let MONTHS = {};
stats.data.forEach((row) => {
  [year, month] = row[fields.month].split("-");
  MONTHS[year] = MONTHS[year] || [];
  MONTHS[year].push(month);
});

const COLORS = {
  sapporo: "rgba(148, 0, 255, 1)",
  sendai: "rgba(0, 0, 255, 1)",
  tokyo: "rgba(0, 191, 255, 1)",
  nagoya: "rgba(0, 255, 0, 1)",
  osaka: "rgba(255, 165, 0, 1)",
  hiroshima: "rgba(255, 0, 0, 1)",
  fukuoka: "rgba(255, 0, 255, 1)",
};

const DTYPES = {
  boiling_days: "猛暑日",
  midsummer_days: "真夏日",
  summer_days: "夏日",
  winter_days: "冬日",
  midwinter_days: "真冬日",
  hot_nights: "熱帯夜",
  avg_temp: "平均気温(℃)",
  daily_high_avg_temp: "日最高気温の平均(℃)",
  daily_low_avg_temp: "日最低気温の平均(℃)",
  ppt_mm: "降水量の合計(mm)",
  sunlight_hrs: "日照時間(時間)",
  snowfall_cm: "降雪量合計(cm)",
};

const CITY_NAMES = {
  sapporo: "札幌",
  sendai: "仙台",
  tokyo: "東京",
  nagoya: "名古屋",
  osaka: "大阪",
  hiroshima: "広島",
  fukuoka: "福岡",
};

// Get the values of the specified column
const getColumn = (columnName, startMonth, endMonth) => {
  let values = [];
  stats.data.map((row) => {
    if (
      isLaterOrEqual(row[fields.month], startMonth) &&
      isLaterOrEqual(endMonth, row[fields.month])
    )
      values.push(row[fields[columnName]]);
  });
  return values;
};

// Judge if the 1st arg month is equal to / later than the 2nd one
const isLaterOrEqual = (newMonth, baseMonth) => {
  const [yearNew, monthNew] = newMonth.split("-");
  const [yearBase, monthBase] = baseMonth.split("-");
  return (
    Number(yearNew) > Number(yearBase) ||
    (Number(yearNew) == Number(yearBase) &&
      Number(monthNew) >= Number(monthBase))
  );
};

const getDatasetsAll = (start, end) => {
  datasetsAll = {};
  for (let [dtypeEn, dtypeJa] of Object.entries(DTYPES)) {
    // datasets for a data type; e.g. avg_temp
    // This array includes data of all the cities for the data type
    let datasetsSingle = [];

    for (let [cityNameEn, cityNameJa] of Object.entries(CITY_NAMES)) {
      datasetsSingle.push({
        label: cityNameJa,
        backgroundColor: COLORS[cityNameEn],
        borderColor: COLORS[cityNameEn],
        data: getColumn(cityNameEn + "-" + dtypeEn, start, end), // e.g. sendai-avg_temp
        fill: false,
      });
    }
    datasetsAll[dtypeEn] = {
      label: dtypeJa,
      datasets: datasetsSingle,
    };
  }

  return datasetsAll;
};

const render = (dtype = "winter_days", start = "2015-4", end = "2020-3") => {
  // Get HTML DOM
  var ctx = document.getElementById("chartArea").getContext("2d");
  ctx.canvas.width = 800;
  ctx.canvas.height = 400;

  const datasetsAll = getDatasetsAll(start, end);
  if (!Object.keys(datasetsAll).includes(dtype)) {
    console.error("Error: Invalid data type passed to rendering function!");
    return;
  }

  var chartOptions = {
    responsive: true,
    title: {
      display: true,
      text: "七都市の" + datasetsAll[dtype].label,
    },
    tooltips: {
      mode: "index",
      intersect: false,
    },
    hover: {
      mode: "nearest",
      intersect: true,
    },
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "年-月",
          },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: datasetsAll[dtype].label,
          },
        },
      ],
    },
    elements: {
      line: {
        tension: 0, // Suppress curved line
      },
    },
  };

  var chartData = {
    labels: getColumn("month", start, end),
    datasets: datasetsAll[dtype].datasets,
  };

  // Totally remove the current chart
  // Alternatively, you can use chart.update()
  // .update() is better for app performance,
  // however, I failed to re-render chart correcly with it
  if (chart != undefined) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: chartData,
    options: chartOptions,
  });
};

// window.onload = function () {
//   render();
// };
