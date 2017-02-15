import React, { Component, PropTypes } from 'react';
import { PriceText } from 'containers';

import './PriceTicket.less';

import $float from 'utils/float';
import $date from 'utils/date';
import classNames from 'classnames';

class PriceTicket extends Component {

    static propTypes = {
        pointerPrice: PropTypes.object,
        isLeftSideTicket: PropTypes.bool,
        evaluateCurrency: PropTypes.string
    };

    render () {
        const { pointerPrice, evaluateCurrency, isLeftSideTicket } = this.props;

        if (pointerPrice) {
            let priceDelta;
            let priceDeltaString;
            let point = this.props.pointerPrice.point;
            if (pointerPrice.previousPrice) {
                priceDelta = pointerPrice.price[1] - pointerPrice.previousPrice[1];
                priceDeltaString = $float.toString(Math.abs(priceDelta.toFixed(2) || 0));
            }
            return (
                <div className={classNames("price-ticket", isLeftSideTicket && "price-ticket_left-side")}
                     style={{
                        left: point.x,
                        top: point.y
                     }}>
                    <div className="price-ticket__sub">
                        <div className="price-ticket__date">
                            {$date.toRussianString(new Date(pointerPrice.price[0]))}
                        </div>
                        <div>
                            <PriceText className="price-ticket__price"
                                       price={pointerPrice.price[1].toFixed(2)}
                                       currency={evaluateCurrency} />
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