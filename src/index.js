import "./index.scss";
import { DataTable } from "./charts/DataTable";
import Heatmap from "./charts/Heatmap";

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
      <DataTable
        data={data.ranks}
        columns={columns}
        showPagination={true}
        defaultPageSize={10}
        title="Test Title"
      />,
      el
    );
  },
  viz__heatmap: el => {
    ReactDOM.render(
      <Heatmap
        data={data.ranks}
        width="1200"
        height="1200"
        title="Test Title"
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
