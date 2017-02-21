import React, { Component } from 'react';
import { FinancialChart } from 'components';
import './App.less';
import exchangeRates from 'data/exchangeRates';

class App extends Component {

  state = {
        pointerPrice: null
  };

  constructor() {
    super();
    this.handleClearPointerPrice = this.handleClearPointerPrice.bind(this);
    this.handleNewPointerPrice = this.handleNewPointerPrice.bind(this);
  }

  getPricesOfYear(year) {
    return exchangeRates.prices.filter((price) => {
        return new Date(price[0]).getFullYear() === year;
    })
  }

  handleNewPointerPrice(pointerPrice) {
      this.setState({ pointerPrice });
  }

  handleClearPointerPrice() {
      this.setState({ pointerPrice: null });
  }

  render() {
    var { pointerPrice } = this.state,
        chartExchangeRates = Object.assign({}, exchangeRates, {prices: this.getPricesOfYear(2015)});

    return (
        <div className="app">
          <div className="app__content">
            <FinancialChart onClearPointerPrice={this.handleClearPointerPrice}
                            onNewPointerPrice={this.handleNewPointerPrice}
                            pointerPrice={pointerPrice}
                            height={280}
                            width={864}
                            data={chartExchangeRates} />
          </div>
          <div className="app__layout">
          </div>
        </div>
    );
  }
}

export default App;
