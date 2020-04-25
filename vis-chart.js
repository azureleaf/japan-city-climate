// Mapping from field name to index number;
// this improves the accessibility to the towns data
//    by creating the shorthand for indices
// e.g. "fields.total_pop" returns "1"
//    because it's the 2nd element in stats.columns
fields = {};
stats.columns.forEach((column, index) => {
  fields[column] = index;
});

const start = "2010-4";
const end = "2020-3";

// Get the values of the specified column
const getColumn = (
  columnName,
  startMonth = start,
  endMonth = end
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

var config = {
  type: "line",
  data: {
    labels: getColumn("month"),
    datasets: [
      {
        label: "Sendai",
        backgroundColor: "rgba(255, 0, 0, 1)",
        borderColor: "rgba(128, 0, 0, 1)",
        data: getColumn("sendai-avg_temp"),
        fill: false,
      },
      {
        label: "Fukuoka",
        backgroundColor: "rgba(0, 0, 255, 1)",
        borderColor: "rgba(0, 0, 128, 1)",
        data: getColumn("fukuoka-avg_temp"),
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: "七都市の月別平均気温",
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
            labelString: "平均気温",
          },
        },
      ],
    },
  },
};

window.onload = function () {
  new Chart(ctx, config);
};
