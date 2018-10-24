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

export default class DotPlot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indicator1: "Academic Impact Ranking",
      indicator2: "Policy Engagement Ranking",
      hovered: ""
    };
    this.changeIndicator = this.changeIndicator.bind(this);
    this.setHoverState = debounce(this.setHover.bind(this), 200);
    this.clearHoverState = debounce(this.clearHover.bind(this), 200);
  }

  changeIndicator(indicator, val) {
    this.setState({ [indicator]: val });
  }

  setHover(val) {
    this.setState({ hovered: val });
  }
  clearHover(val) {
    this.setState({ hovered: "" });
  }

  render() {
    const { data, definitions, description, title } = this.props;
    const { indicator1, indicator2 } = this.state;
    const margin = {
      top: 80,
      right: 20,
      bottom: 10,
      left: 150
    };
    const indicators = Object.keys(data[0]).filter(d => d !== "school");
    const schools = data.map(row => row.school);
    const SelectComponent1 = (
      <Select
        options={indicators}
        selected={indicator1}
        onChange={val => this.changeIndicator("indicator1", val)}
      />
    );
    const SelectComponent2 = (
      <Select
        options={indicators}
        selected={indicator2}
        onChange={val => this.changeIndicator("indicator2", val)}
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
        selectComponent={SelectComponent1}
        selectComponent2={SelectComponent2}
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
                <Group top={10} left={margin.left}>
                  <circle
                    cx={0}
                    cy={0}
                    r={3}
                    fill="#fff"
                    stroke="#22C8A3"
                    strokeWidth={3}
                  />
                  <Text x={10} y={0} fontSize="12px" verticalAnchor="middle">
                    {indicator1}
                  </Text>
                  <circle
                    cx={0}
                    cy={20}
                    r={3}
                    fill="#fff"
                    stroke="#70689F"
                    strokeWidth={3}
                  />
                  <Text x={10} y={20} fontSize="12px" verticalAnchor="middle">
                    {indicator2}
                  </Text>
                </Group>
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
                  stroke="#d1d1d1"
                  numTicks={width > 600 ? 52 : 26}
                />
                <Group top={margin.top} left={margin.left}>
                  {data.map(d => {
                    const p1 = new Point({
                      x: xScale(+d[indicator1]),
                      y: 0
                    });
                    const p2 = new Point({
                      x: xScale(+d[indicator2]),
                      y: 0
                    });
                    const facingRight =
                      +d[indicator1] > +d[indicator2]
                        ? true
                        : +d[indicator1] < +d[indicator2]
                          ? false
                          : undefined;
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
                          x={xScale(+d[indicator1])}
                          y={0}
                          style={{
                            display:
                              this.state.hovered === d.school ? "block" : "none"
                          }}
                        >{`${d[indicator1]}${getNth(+d[indicator1])}`}</Text>
                        <Line
                          from={p1}
                          to={p2}
                          strokeWidth={2}
                          stroke="#BCBCBC"
                        />
                        <Line
                          from={p1}
                          to={p2}
                          strokeWidth={15}
                          stroke="transparent"
                        />
                        <circle
                          cx={xScale(+d[indicator1])}
                          cy={0}
                          r={3}
                          fill="#fff"
                          stroke="#22C8A3"
                          strokeWidth={3}
                        />
                        <circle
                          cx={xScale(+d[indicator2])}
                          cy={0}
                          r={3}
                          fill="#fff"
                          stroke="#70689F"
                          strokeWidth={3}
                        />
                        <Text
                          fontSize="12px"
                          textAnchor={facingRight ? "end" : "start"}
                          dx={facingRight ? "-10px" : "10px"}
                          verticalAnchor="middle"
                          x={xScale(+d[indicator2])}
                          y={0}
                          style={{
                            display:
                              this.state.hovered === d.school ? "block" : "none"
                          }}
                        >{`${d[indicator2]}${getNth(+d[indicator2])}`}</Text>
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
