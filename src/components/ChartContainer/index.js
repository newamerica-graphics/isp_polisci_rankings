import React from "react";
import "./ChartContainer.scss";

const Title = props => <h3 className="chart__title">{props.title}</h3>;
const Subtitle = props => <h4 className="chart__subtitle">{props.subtitle}</h4>;
const Source = props => (
  <span className="chart__source">Source: {props.source}</span>
);
const InfoIcon = props => (
  <svg
    viewBox="0 0 35 35"
    xmlns="http://www.w3.org/2000/svg"
    className="dv-info-icon"
  >
    <g fill="none" fill-rule="evenodd">
      <circle fill="silver" fill-rule="nonzero" cx="17.5" cy="17.5" r="17.5" />
      <text
        font-family="CircularStd-Black, Circular Std"
        font-size="18"
        font-weight="700"
        fill="#333"
      >
        <tspan x="15" y="24">
          i
        </tspan>
      </text>
    </g>
  </svg>
);

const ChartContainer = props => (
  <div className="dv-chart">
    <div className="chart__meta-container">
      {props.title ? <Title title={props.title} /> : null}
      <div class="dv-info-icon-container">
        <span className="dv-info-icon__label">Indicator Definititions</span>
        <InfoIcon />
      </div>
    </div>
    <div
      className="chart__figure"
      style={{ height: props.height, maxWidth: props.width, margin: "auto" }}
    >
      {props.children}
    </div>
    <div className="chart__source-container">
      {props.source ? <Source source={props.source} /> : null}
    </div>
  </div>
);

export default ChartContainer;
