import React, { Component } from 'react';
import { FinancialChart } from 'components';
import './App.less';
import exchangeRates from 'data/exchangeRates';

class App extends Component {

  render() {

    return (
        <div className="app">
          <div className="app__content">
            <FinancialChart height={280} width={864} data={exchangeRates} />
          </div>
          <div className="app__layout">
          </div>
        </div>
    );
  }
}

export default App;
