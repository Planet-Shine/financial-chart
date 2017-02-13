import React, { Component } from 'react';
import { FinancialChart } from 'components';
import './App.less';

class App extends Component {

  render() {

    return (
        <div className="app">
          <div className="app__content">
            <FinancialChart />
          </div>
          <div className="app__layout">
          </div>
        </div>
    );
  }
}

export default App;
