

import React, { Component, PropTypes } from 'react';
import $float from 'utils/float';

const BEFORE_PRICES = {
    USD: '$'
};

const AFTER_PRICES = {
    RUB: 'руб.'
};

class PriceText extends Component {

    static propTypes = {
        currency: PropTypes.string,
        price: PropTypes.string,
        className: PropTypes.string
    };

    render() {
        var { currency, price, className } = this.props;
        price = $float.toString(price);
        return (
            <span className={className}>
                {BEFORE_PRICES[currency]}
                {BEFORE_PRICES[currency] && ' '}
                {price}
                {AFTER_PRICES[currency] && ' '}
                {AFTER_PRICES[currency]}
            </span>
        );
    }
}

export default PriceText;