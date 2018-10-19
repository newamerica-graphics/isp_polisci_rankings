import React from "react";
import { Group } from "@vx/group";
import { scaleBand } from "@vx/scale";
import { min, max } from "d3-array";
import { scale } from "chroma-js";
import { AxisTop, AxisLeft } from "@vx/axis";
import ChartContainer from "../../components/ChartContainer";

const Heatmap = ({
  width,
  height,
  title,
  margin = {
    top: 220,
    left: 140,
    right: 20,
    bottom: 110
  },
  data
}) => {
  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.bottom - margin.top;

  const columns = Object.keys(data[0]).filter(
    d => d !== "school" && d !== "NRC Ranking"
  );
  const schools = data.map(d => d.school);
  const dataMin = min(data, d => min(columns, c => +d[c]));
  const dataMax = max(data, d => max(columns, c => +d[c]));

  // scales
  //brighter teal: #a6fff7

  const colorScale = scale(["#72DCC4", "#4C81DB"])
    .domain([dataMin, dataMax])
    .mode("rgb");

  const xScale = scaleBand({
    range: [0, xMax],
    domain: columns,
    padding: 0.2
  });
  const yScale = scaleBand({
    range: [0, yMax],
    domain: schools,
    padding: 0.2
  });

  return (
    <ChartContainer title={title}>
      <svg width={width} height={height}>
        <AxisTop
          scale={xScale}
          top={margin.top}
          left={margin.left}
          hideTicks={true}
          hideAxisLine={true}
          tickLabelProps={(val, i) => ({
            transform: `rotate(315 ${xScale(val)}, 0)`,
            fontSize: "12px",
            fontWeight:
              val === "Academic Impact Ranking" ||
              val === "Policy Engagement Ranking"
                ? "bold"
                : "normal",
            dx: "10px",
            dy: "10px"
          })}
        />
        <AxisLeft
          scale={yScale}
          left={10}
          top={margin.top + xScale.padding()}
          hideTicks={true}
          hideAxisLine={true}
          tickLabelProps={(val, i) => ({
            fontSize: "12px",
            dy: "3px"
          })}
        />
        <Group top={margin.top} left={margin.left}>
          {data.map((row, i) => {
            return (
              <Group
                key={`heatmap-${i}`}
                className="vx-heatmap-column"
                top={yScale(row.school)}
              >
                {columns.map((column, j) => {
                  {
                    /* console.log(column); */
                  }
                  return (
                    <rect
                      key={`heatmap-tile-rect-${j}`}
                      className="heatmap-rect"
                      fill={colorScale(+row[column])}
                      width={xScale.bandwidth()}
                      height={yScale.bandwidth()}
                      x={xScale(column)}
                      y={0}
                    />
                  );
                })}
              </Group>
            );
          })}
        </Group>
      </svg>
    </ChartContainer>
  );
};

export default Heatmap;
