import React from "react";
import { ParentSize } from "@vx/responsive";
import { scaleBand, scaleLinear } from "@vx/scale";
import { Line } from "@vx/shape";
import { Point } from "@vx/point";
import { Group } from "@vx/group";
import { Grid, GridColumns } from "@vx/grid";
import { AxisTop, AxisLeft } from "@vx/axis";
import { Text } from "@vx/text";
import debounce from "debounce";
import ChartContainer from "../../components/ChartContainer";
import Select from "../../components/Select";

const getNth = n =>
  ["st", "nd", "rd"][((((n + 90) % 100) - 10) % 10) - 1] || "th";

export default class ArrowPlot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indicator: "Academic Books: Quantity and Academic Impact",
      hovered: ""
    };
    this.changeIndicator = this.changeIndicator.bind(this);
    this.setHoverState = debounce(this.setHover.bind(this), 200);
    this.clearHoverState = debounce(this.clearHover.bind(this), 200);
  }

  changeIndicator(val) {
    this.setState({ indicator: val });
  }

  setHover(val) {
    this.setState({ hovered: val });
  }
  clearHover(val) {
    this.setState({ hovered: "" });
  }

  render() {
    const { data, definitions, description, title } = this.props;
    const { indicator } = this.state;
    const margin = {
      top: 28,
      right: 37,
      bottom: 0,
      left: 250
    };
    const indicators = Object.keys(data[0]).filter(
      d => d !== "school" && d !== "NRC Ranking"
    );
    const ranks = data.map(d => d["NRC Ranking"]);
    const schools = data.map(row => row.school);
    const SelectComponent = (
      <Select
        options={indicators}
        selected={indicator}
        onChange={val => this.changeIndicator(val)}
      />
    );
    return (
      <ChartContainer
        title={title}
        description={description}
        height={1100}
        maxWidth={1200}
        definitions={definitions}
        style={{ backgroundColor: "#fff", padding: "1rem" }}
        selectComponent={SelectComponent}
      >
        <ParentSize>
          {({ width, height }) => {
            const xMax = width - margin.left - margin.right;
            const yMax = height - margin.top - margin.bottom;
            const xScale = scaleLinear({
              domain: [1, 52],
              rangeRound: [0, xMax]
            });
            const yScale = scaleBand({
              domain: schools,
              rangeRound: [0, yMax]
            });

            if (width < 100) return null;

            return (
              <svg width={width} height={height}>
                <defs>
                  <marker
                    id="arrow-red"
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="4.5"
                    markerHeight="4.5"
                    orient="auto"
                    fill="#FF2D44"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" />
                  </marker>
                  <marker
                    id="arrow-blue"
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="4.5"
                    markerHeight="4.5"
                    orient="auto"
                    fill="#2DD1AC"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" />
                  </marker>
                </defs>
                <AxisTop
                  scale={xScale}
                  top={margin.top}
                  left={margin.left}
                  hideTicks={true}
                  hideAxisLine={true}
                  tickFormat={(val, i) => `${val}${getNth(val)}`}
                  tickLabelProps={(val, i) => ({
                    fontSize: "12px",
                    textAnchor: "middle",
                    dy: "-5px",
                    display:
                      val === 1 || val === 26 || val === 52 ? "block" : "none"
                  })}
                  numTicks={52}
                />
                <AxisLeft
                  scale={yScale}
                  left={10}
                  top={margin.top}
                  hideTicks={true}
                  hideAxisLine={true}
                  tickComponent={({ x, y, formattedValue }) => (
                    <g>
                      <Text
                        x={x}
                        y={y}
                        fontSize="12px"
                        textAnchor="start"
                        dominantBaseline="middle"
                        dy="-7px"
                        opacity={
                          this.state.hovered === formattedValue
                            ? 1
                            : this.state.hovered.length === 0
                              ? 1
                              : 0.2
                        }
                        onMouseEnter={e => this.setHoverState(formattedValue)}
                        onMouseLeave={e => {
                          this.setState({ hovered: "" });
                          this.clearHoverState();
                        }}
                        style={{
                          cursor: "pointer",
                          fontWeight:
                            this.state.hovered === formattedValue
                              ? "bold"
                              : "normal"
                        }}
                      >
                        {formattedValue}
                      </Text>
                    </g>
                  )}
                />
                <Grid
                  lineStyle={{ pointerEvents: "none" }}
                  xScale={xScale}
                  yScale={yScale}
                  width={xMax}
                  height={yMax - 20}
                  top={margin.top}
                  left={margin.left}
                  strokeDasharray="2,2"
                  stroke="#D1D1D1"
                  numTicks={width > 600 ? 52 : 26}
                />
                <Group top={margin.top} left={margin.left}>
                  {data.map(d => {
                    const p1 = new Point({
                      x: xScale(+d["NRC Ranking"]),
                      y: 0
                    });
                    const p2 = new Point({
                      x: xScale(+d[indicator]),
                      y: 0
                    });
                    const facingRight =
                      +d["NRC Ranking"] > +d[indicator]
                        ? true
                        : +d["NRC Ranking"] < +d[indicator]
                          ? false
                          : undefined;
                    const marker =
                      +d["NRC Ranking"] > +d[indicator]
                        ? "url(#arrow-blue)"
                        : +d["NRC Ranking"] < +d[indicator]
                          ? "url(#arrow-red)"
                          : null;
                    return (
                      <Group
                        top={yScale(d.school)}
                        onMouseEnter={e => this.setHoverState(d.school)}
                        onMouseLeave={e => {
                          this.setState({ hovered: "" });
                          this.clearHoverState();
                        }}
                        opacity={
                          this.state.hovered === d.school
                            ? 1
                            : this.state.hovered.length === 0
                              ? 1
                              : 0.2
                        }
                        style={{
                          cursor: "pointer"
                        }}
                        key={d.school}
                      >
                        <Text
                          fontSize="12px"
                          textAnchor={facingRight ? "start" : "end"}
                          dx={facingRight ? "10px" : "-10px"}
                          verticalAnchor="middle"
                          x={xScale(+d["NRC Ranking"])}
                          y={0}
                          style={{
                            display:
                              this.state.hovered === d.school ? "block" : "none"
                          }}
                        >{`${d["NRC Ranking"]}${getNth(
                          +d["NRC Ranking"]
                        )}`}</Text>
                        <Line
                          from={p1}
                          to={p2}
                          markerEnd={marker}
                          strokeWidth={2}
                          stroke={
                            +d["NRC Ranking"] > +d[indicator]
                              ? "#2DD1AC"
                              : +d["NRC Ranking"] < +d[indicator]
                                ? "#FF2D44"
                                : null
                          }
                        />
                        <Line
                          from={p1}
                          to={p2}
                          strokeWidth={15}
                          stroke="transparent"
                        />
                        <circle
                          cx={xScale(+d["NRC Ranking"])}
                          cy={0}
                          r={3}
                          fill="#fff"
                          stroke="#8B8B8B"
                          strokeWidth={3}
                        />
                        <Text
                          fontSize="12px"
                          textAnchor={facingRight ? "end" : "start"}
                          dx={facingRight ? "-10px" : "10px"}
                          verticalAnchor="middle"
                          x={xScale(+d[indicator])}
                          y={0}
                          style={{
                            display:
                              this.state.hovered === d.school ? "block" : "none"
                          }}
                        >{`${d[indicator]}${getNth(+d[indicator])}`}</Text>
                      </Group>
                    );
                  })}
                </Group>
              </svg>
            );
          }}
        </ParentSize>
      </ChartContainer>
    );
  }
}
