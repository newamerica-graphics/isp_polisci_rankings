import "./index.scss";
import { DataTableWithSearch } from "./charts/DataTable";
import Heatmap from "./charts/Heatmap";
import ArrowPlot from "./charts/ArrowPlot";
import DotPlot from "./charts/DotPlot";

let queue = [];
let data = null;

const settings = {
  viz__1: el => {
    const columns = [
      {
        Header: "School",
        accessor: "school"
      },
      {
        Header: "NRC Ranking",
        accessor: "NRC Ranking"
      },
      {
        Header: "Academic Impact Ranking",
        accessor: "Academic Impact Ranking"
      },
      {
        Header: "Policy Engagement Ranking",
        accessor: "Policy Engagement Ranking"
      }
    ];
    ReactDOM.render(
      <DataTableWithSearch
        data={data.ranks}
        columns={columns}
        showPagination={true}
        defaultPageSize={10}
        title={data.meta.filter(d => d.chart === "table1")[0].title}
        description={data.meta.filter(d => d.chart === "table1")[0].description}
        defaultSortMethod={(a, b) => +b - +a}
        definitions={data.definitions}
        showDefinitions={false}
      />,
      el
    );
  },
  viz__arrowplot: el => {
    ReactDOM.render(
      <ArrowPlot
        data={data.ranks}
        definitions={data.definitions}
        title={data.meta.filter(d => d.chart === "arrowplot")[0].title}
        description={
          data.meta.filter(d => d.chart === "arrowplot")[0].description
        }
      />,
      el
    );
  },
  viz__dotplot: el => {
    ReactDOM.render(
      <DotPlot
        data={data.ranks}
        definitions={data.definitions}
        title={data.meta.filter(d => d.chart === "dotplot")[0].title}
        description={
          data.meta.filter(d => d.chart === "dotplot")[0].description
        }
      />,
      el
    );
  },
  viz__heatmap: el => {
    ReactDOM.render(
      <Heatmap
        data={data.ranks}
        definitions={data.definitions}
        width="1200"
        height="1200"
        title={data.meta.filter(d => d.chart === "heatmap")[0].title}
        description={
          data.meta.filter(d => d.chart === "heatmap")[0].description
        }
      />,
      el
    );
  },
  viz__all_indicators: el => {
    const columns = Object.keys(data.ranks[0]).map(column => ({
      Header: column === "school" ? "School" : column,
      accessor: column,
      minWidth: 150
    }));
    ReactDOM.render(
      <DataTableWithSearch
        data={data.ranks}
        height={1050}
        columns={columns}
        showPagination={true}
        defaultPageSize={20}
        title={data.meta.filter(d => d.chart === "table2")[0].title}
        description={data.meta.filter(d => d.chart === "table2")[0].description}
        defaultSortMethod={(a, b) => +b - +a}
        definitions={data.definitions}
        showDefinitions={true}
      />,
      el
    );
  }
};

fetch(
  "https://na-data-projects.s3.amazonaws.com/data/isp/political_science_rankings.json"
)
  .then(response => response.json())
  .then(_data => {
    data = _data;
    for (let i = 0; i < queue.length; i++) queue[i]();
  });

window.renderDataViz = function(el) {
  let id = el.getAttribute("id");
  let chart = settings[id];
  if (!chart) return;

  if (data) {
    chart(el);
  } else {
    queue.push(() => chart(el));
  }
};
