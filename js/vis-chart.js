// Mapping from field name to index number;
// this improves the accessibility to the towns data
//    by creating the shorthand for indices
// e.g. "fields.total_pop" returns "1"
//    because it's the 2nd element in stats.columns
fields = {};
stats.columns.forEach((column, index) => {
  fields[column] = index;
});

const monthRangeStart = "2015-4";
const monthRangeEnd = "2020-3";

const COLORS = {
  sapporo: "rgba(148, 0, 255, 1)",
  sendai: "rgba(0, 0, 255, 1)",
  tokyo: "rgba(0, 191, 255, 1)",
  nagoya: "rgba(0, 255, 0, 1)",
  osaka: "rgba(255, 255, 0, 1)",
  hiroshima: "rgba(255, 165, 0, 1)",
  fukuoka: "rgba(255, 0, 0, 1)",
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
const getColumn = (
  columnName,
  startMonth = monthRangeStart,
  endMonth = monthRangeEnd
) => {
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

// Get HTML DOM
var ctx = document.getElementById("chartSummer").getContext("2d");
ctx.canvas.width = 1500;
ctx.canvas.height = 600;

datasetsAll = [];
for (let [dtypeEn, dtypeJa] of Object.entries(DTYPES)) {
  let datasetsSingle = []; // datasets for a data type; e.g. avg_temp
  for (let [cityNameEn, cityNameJa] of Object.entries(CITY_NAMES)) {
    datasetsSingle.push({
      label: cityNameJa,
      backgroundColor: COLORS[cityNameEn],
      borderColor: COLORS[cityNameEn],
      data: getColumn(cityNameEn + "-" + dtypeEn), // e.g. sendai-avg_temp
      fill: false,
    });
  }
  datasetsAll.push({
    label: dtypeJa,
    datasets: datasetsSingle,
  });
}

var config = {
  type: "line",
  data: {
    labels: getColumn("month"),
    datasets: datasetsAll[0].datasets,
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: "七都市の" + datasetsAll[0].label,
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
            labelString: "年月",
          },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: datasetsAll[0].label,
          },
        },
      ],
    },
  },
};

window.onload = function () {
  new Chart(ctx, config);
};