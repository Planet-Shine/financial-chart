import React, { Component } from 'react';
import { FinancialChart } from 'components';
import './App.less';
import exchangeRates from 'data/exchangeRates';

class App extends Component {

  getPricesOfYear(year) {
    return exchangeRates.prices.filter((price) => {
        return new Date(price[0]).getFullYear() === year;
    })
  }

  render() {
    var chartExchangeRates = Object.assign({}, exchangeRates, {prices: this.getPricesOfYear(2015)});

    return (
        <div className="app">
          <div className="app__content">
            <FinancialChart height={280} width={864} data={chartExchangeRates} />
          </div>
          <div className="app__layout">
          </div>
        </div>
    );
  }
}

export default App;
