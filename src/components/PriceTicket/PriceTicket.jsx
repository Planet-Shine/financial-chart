import React, { Component } from 'react';
import { PriceText } from 'components';

import './PriceTicket.less';
import { graphArea as graphAreaBox } from 'components/FinancialChartGraph/styles/boxes';

import $float from 'utils/float';
import $date from 'utils/date';
import classNames from 'classnames';

class PriceTicket extends Component {

    render () {
        const pointerPrice = this.props.pointerPrice;
        if (pointerPrice) {
            let currency = this.props.baseCurrency;
            let priceDelta;
            let priceDeltaString;
            let point = this.props.pointerPrice.point;
            if (pointerPrice.previousPrice) {
                priceDelta = pointerPrice.price[1] - pointerPrice.previousPrice[1];
                priceDeltaString = $float.toString(Math.abs(priceDelta.toFixed(2) || 0));
            }
            return (
                <div className="price-ticket"
                     style={{
                        left: point.x + graphAreaBox.left, // Корректируем в соответсвии с областью графика.
                        top: point.y + graphAreaBox.top
                     }}>
                    <div className="price-ticket__sub">
                        <div className="price-ticket__date">
                            {$date.toRussianString(new Date(pointerPrice.price[0]))}
                        </div>
                        <div>
                            <PriceText className="price-ticket__price"
                                       price={pointerPrice.price[1].toFixed(2)}
                                       currency={currency} />
                            <span className={classNames({
                                    'price-ticket__delta': true,
                                    'price-ticket__delta_positive': priceDelta > 0,
                                    'price-ticket__delta_negative': priceDelta < 0,
                                    'price-ticket__delta_zero': !priceDelta
                                })}>
                                {priceDeltaString}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div></div>
        );
    }
}

export default PriceTicket;