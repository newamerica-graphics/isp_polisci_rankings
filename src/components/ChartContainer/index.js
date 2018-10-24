import React from "react";
import InfoContainer from "../InfoContainer";
import "./ChartContainer.scss";
import Select from "../Select";

const Title = props => <h3 className="chart__title">{props.title}</h3>;
const Subtitle = props => <h4 className="chart__subtitle">{props.subtitle}</h4>;
const Description = props => (
  <p className="chart__description">{props.description}</p>
);
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
      <circle fill="#C0C0C0" fill-rule="nonzero" cx="17.5" cy="17.5" r="17.5" />
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
const BackIcon = props => (
  <svg
    viewBox="0 0 35 35"
    xmlns="http://www.w3.org/2000/svg"
    className="dv-info-icon"
  >
    <g fill="none">
      <circle fill="#C0C0C0" cx="17.5" cy="17.5" r="17.5" />
      <path
        d="M17.94 10.827l.226-1.59a.206.206 0 0 0-.094-.207.207.207 0 0 0-.225.006l-3.536 2.484a.209.209 0 0 0 .001.34l3.535 2.484a.206.206 0 0 0 .314-.239l-.204-1.516c2.985.236 5.307 2.767 5.307 5.816 0 3.219-2.586 5.837-5.764 5.837-3.178 0-5.764-2.618-5.764-5.836a.206.206 0 0 0-.205-.208h-1.326a.206.206 0 0 0-.205.208C10 22.593 13.364 26 17.5 26s7.5-3.407 7.5-7.594c0-3.97-3.157-7.347-7.06-7.58z"
        fill="#333"
      />
    </g>
  </svg>
);

class ChartContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showInfo: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.setState(prevState => ({ showInfo: !prevState.showInfo }));
  }

  render() {
    const {
      title,
      description,
      height,
      maxWidth,
      source,
      definitions,
      style,
      selectComponent,
      selectComponent2,
      showDefinitions = true
    } = this.props;
    return (
      <div className="dv-chart">
        <div className="chart__meta-container">
          <div>
            {title ? (
              <Title
                title={!this.state.showInfo ? title : "Indicator Definitions"}
              />
            ) : null}
            {description ? (
              <Description
                description={!this.state.showInfo ? description : null}
              />
            ) : null}
          </div>
          {showDefinitions ? (
            <a
              class="dv-info-icon-container"
              href="#"
              onClick={this.handleClick}
            >
              <span className="dv-info-icon__label">
                {!this.state.showInfo ? "Indicator Definitions" : "Back"}
              </span>
              {!this.state.showInfo ? <InfoIcon /> : <BackIcon />}
            </a>
          ) : null}
        </div>

        {selectComponent && selectComponent2 && !this.state.showInfo ? (
          <div className="dv-filter-controls">
            <div>
              <span
                style={{
                  paddingRight: "0.5rem",
                  fontSize: "14px",
                  fontFamily: "Circular"
                }}
              >
                Compare
              </span>
              {selectComponent}
              <span
                style={{
                  padding: "0 0.5rem",
                  fontSize: "14px",
                  fontFamily: "Circular"
                }}
              >
                against
              </span>
              {selectComponent2}
            </div>
          </div>
        ) : selectComponent && !this.state.showInfo ? (
          <div className="dv-filter-controls">{selectComponent}</div>
        ) : null}

        <div
          className="chart__figure"
          style={{
            height: height,
            maxWidth: maxWidth,
            margin: "auto",
            ...style,
            backgroundColor: this.state.showInfo
              ? "#f5f5f5"
              : style
                ? style.backgroundColor
                : "#f5f5f5",
            padding: this.state.showInfo
              ? 0
              : style && style.padding
                ? style.padding
                : 0
          }}
        >
          {this.state.showInfo ? (
            <InfoContainer definitions={definitions} />
          ) : (
            this.props.children
          )}
        </div>
        <div className="chart__source-container">
          {source ? <Source source={source} /> : null}
        </div>
      </div>
    );
  }
}

export default ChartContainer;
