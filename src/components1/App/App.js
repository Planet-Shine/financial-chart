import React, { Component } from 'react';
import { FinancialChart } from 'components';
import './App.less';

class App extends Component {

  render() {

    return (
      <div className="App">
          <FinancialChart />
      </div>
    );
  }
}

export default App;
