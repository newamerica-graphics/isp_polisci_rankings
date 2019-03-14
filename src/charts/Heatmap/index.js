import React from "react";
import { Group } from "@vx/group";
import { scaleBand } from "@vx/scale";
import { withTooltip, TooltipWithBounds } from "@vx/tooltip";
import { ParentSize } from "@vx/responsive";
import { localPoint } from "@vx/event";
import { min, max } from "d3-array";
import { scale } from "chroma-js";
import { AxisTop, AxisLeft } from "@vx/axis";
import ChartContainer from "../../components/ChartContainer";

const Heatmap = ({
  width,
  height,
  title,
  description,
  margin = {
    top: 220,
    left: 250,
    right: 90,
    bottom: 0
  },
  data,
  definitions,
  showTooltip,
  hideTooltip,
  tooltipOpen,
  tooltipLeft,
  tooltipTop,
  tooltipData
}) => {
  // bounds
  const columnNames = Object.keys(data[0]).filter(
    d => d !== "school" && d !== "NRC Ranking"
  );

  const columnScales = columnNames.map(ind => ({
    name: ind,
    scale: scale(["#ffffff", "#4C81DB"])
      .domain([0, max(data, d => parseFloat(d[ind]))])
      .mode("rgb")
  }));
  const schools = data.map(d => d.school);

  return (
    <ChartContainer
      title={title}
      maxWidth={1200}
      height={height}
      definitions={definitions}
      description={description}
    >
      <ParentSize>
        {({ width, height }) => {
          if (width < 600) {
            margin.right = 10;
            margin.top = 10;
          } else {
            margin.top = 220;
            margin.right = 90;
          }
          const xMax = width - margin.left - margin.right;
          const yMax = height - margin.bottom - margin.top;
          const xScale = scaleBand({
            range: [0, xMax],
            domain: columnNames,
            padding: 0.2
          });
          const yScale = scaleBand({
            range: [0, yMax],
            domain: schools,
            padding: 0.2
          });
          return (
            <svg width={width} height={height}>
              {width > 600 && (
                <AxisTop
                  scale={xScale}
                  top={margin.top}
                  left={margin.left}
                  hideTicks={true}
                  hideAxisLine={true}
                  tickLabelProps={(val, i) => ({
                    transform: `rotate(315 ${xScale(val)}, 0)`,
                    fontSize: "12px",
                    dx: "10px",
                    dy: "10px"
                  })}
                />
              )}
              <AxisLeft
                scale={yScale}
                left={10}
                top={margin.top + xScale.padding()}
                hideTicks={true}
                hideAxisLine={true}
                labelClassName="dv-heatmap-axis-label-item"
                tickComponent={({ x, y, formattedValue }) => (
                  <g>
                    <rect
                      x={x}
                      y={y - 8}
                      width={margin.left}
                      height={yScale.bandwidth()}
                      fill="white"
                    />
                    <text x={x + 4} y={y + 5} fontSize="12px">
                      {formattedValue}
                    </text>
                  </g>
                )}
              />
              <Group top={margin.top} left={margin.left}>
                {data.map((row, i) => {
                  return (
                    <Group
                      key={`heatmap-${i}`}
                      className="vx-heatmap-column"
                      top={yScale(row.school)}
                    >
                      {columnScales.map((column, j) => {
                        return (
                          <rect
                            key={`heatmap-tile-rect-${j}`}
                            className="heatmap-rect"
                            fill={column.scale(parseFloat(row[column.name]))}
                            width={xScale.bandwidth()}
                            height={yScale.bandwidth()}
                            x={xScale(column.name)}
                            y={0}
                            onMouseEnter={e => {
                              const data = {
                                school: row.school,
                                indicator: column.name,
                                rank: row[column.name]
                              };
                              const coords = localPoint(
                                e.target.ownerSVGElement,
                                e
                              );
                              showTooltip({
                                tooltipLeft: coords.x,
                                tooltipTop: coords.y,
                                tooltipData: data
                              });
                            }}
                            onMouseOut={hideTooltip}
                            onTouchStart={e => {
                              const data = {
                                school: row.school,
                                indicator: column.name,
                                rank: row[column.name]
                              };
                              const coords = localPoint(
                                e.target.ownerSVGElement,
                                e
                              );
                              showTooltip({
                                tooltipLeft: coords.x,
                                tooltipTop: coords.y,
                                tooltipData: data
                              });
                            }}
                            onTouchEnd={hideTooltip}
                          />
                        );
                      })}
                    </Group>
                  );
                })}
              </Group>
            </svg>
          );
        }}
      </ParentSize>
      {tooltipOpen && (
        <TooltipWithBounds
          left={tooltipLeft}
          top={tooltipTop}
          style={{
            padding: "1rem",
            borderRadius: 0,
            boxShadow:
              "0 2px 5px 0 rgba(0, 0, 0, 0.15), 0 2px 10px 0 rgba(0, 0, 0, 0.1)",
            color: "#333333"
          }}
        >
          <h4
            style={{
              marginTop: 0,
              marginBottom: "0.5rem",
              fontSize: "1rem"
            }}
          >
            {tooltipData.school}
          </h4>
          <div style={{ paddingBottom: "0.5rem", fontSize: "14px" }}>
            {tooltipData.indicator}: <strong>{tooltipData.rank}</strong>
          </div>
        </TooltipWithBounds>
      )}
    </ChartContainer>
  );
};

export default withTooltip(Heatmap);
