import React from "react";
import ChartContainer from "../../components/ChartContainer";
import ReactTable from "react-table";
import Pagination from "./Pagination";
import withSearch from "./WithSearch";
import Select from "../../components/Select";
import "react-table/react-table.css";
import "./DataTable.scss";

class DataTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      data,
      columns,
      title,
      description,
      subtitle,
      source,
      showPagination,
      children,
      definitions,
      showDefinitions,
      height = "auto",
      ...otherProps
    } = this.props;

    return (
      <ChartContainer
        title={title}
        description={description}
        source={source}
        maxWidth={1200}
        height={height}
        definitions={definitions}
        showDefinitions={showDefinitions}
      >
        <div>
          {children}
          <ReactTable
            data={data}
            columns={columns}
            className="-striped"
            showPagination={showPagination ? showPagination : false}
            showPageSizeOptions={false}
            PaginationComponent={Pagination}
            {...otherProps}
          />
        </div>
      </ChartContainer>
    );
  }
}
const DataTableWithSearch = withSearch(DataTable);
export { DataTable, DataTableWithSearch };
