import * as React from "react";
import { Consumer } from "./containers/Provider";
import { Gql } from "./gql";

interface State {
  loading: boolean;
  error: any;
  data: any;
}

interface Props {
  children: (data: any, onMutation: any) => React.ReactNode;
  query: Gql;
  variables: any;
  fetchData: (gql: Gql, variables: any) => Promise<any>;
}

class Mutation extends React.Component<Props, State> {
  state = {
    loading: false,
    error: false,
    data: {}
  };

  onMutation = () => {
    this.fetchData();
  };

  fetchData = async (): Promise<any> => {
    this.setState({
      loading: true,
      error: false
    });

    let response;

    try {
      response = await this.props.fetchData(
        this.props.query,
        this.props.variables
      );
    } catch (error) {
      return this.setState({ loading: false, error: error });
    }

    const responseData = await response.json();

    if (responseData.errors) {
      return this.setState({
        loading: false,
        error: responseData.errors[0]
      });
    }

    this.setState({
      loading: false,
      error: false,
      data: responseData.data
    });
  };

  render() {
    const { children } = this.props;

    return children(this.onMutation, this.state);
  }
}

export default (props: any) => (
  <Consumer>
    {({ fetchData }) => <Mutation {...props} fetchData={fetchData} />}
  </Consumer>
);
