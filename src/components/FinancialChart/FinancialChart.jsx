import React, { Component, PropTypes } from 'react';
import { PriceTicket, FinancialChartGraph } from 'components';

import * as $props from './props';
import * as $boxes from 'components/FinancialChart/props/boxes';
import './FinancialChart.less';
import $math from 'utils/math';
import $dom from 'utils/dom';

const POINTER_CLIP_ID = 'pointer-clip';
const MINIMUM_VALUE = 0;

class FinancialChart extends Component {

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        prices: PropTypes.array,
        baseCurrency: PropTypes.string,
        evaluateCurrency: PropTypes.string,
        onClearPointerPrice: PropTypes.func,
        onNewPointerPrice: PropTypes.func
    };

    /*

        _oldPrices = null;
        isNewPrices(prices) {
            const result = this._oldPrices === prices;
            this._oldPrices = prices;
            return result;
        }

    */
    
    constructor(props) {
        super(props);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }

    isTouchEnd = false;

    handleMouseMove(e) {
        if (e.type === 'touchstart') {
            this.isTouchEnd = false;
        }
        if (this.isTouchEnd === true && e.type === 'mousemove') {
            return;
        }
        const mousePos = $dom.getMousePos(e);
        const nearestPrice = this.getNearestPrice(mousePos);
        this.props.onNewPointerPrice(nearestPrice);
    }

    handleMouseOut(e) {
        if (e.type === 'touchend') {
            this.isTouchEnd = true;
        }
        this.props.onClearPointerPrice();
    }

    getCulcGraphPoint() {
        const areaSize = this.getGraphAreaSize();
        const timeLimits = this.getTimeLimits();
        const rateLimits = this.getValueLimits();

        return (price) => {
            var [ date, rate ] = price;
            // Берём остаток от доли т.к. ось y растет сверху вниз.
            const datePart = $math.partOfRange(timeLimits.min, timeLimits.max, date);
            const ratePart = (1 - $math.partOfRange(rateLimits.min, rateLimits.max, rate));
            return {
                x: datePart * areaSize.width,
                y: ratePart * areaSize.height
            };
        };
    }

    getTimeLimits() {
        var { prices, year } = this.props;
        const date = new Date(prices[0][0]);
        year = year || date.getFullYear();
        return {
            min: new Date(year, 0, 1).getTime(),
            max: new Date(year + 1, 0, -1).getTime()
        };
    }

    getValueLimits() {
        return {
            min: MINIMUM_VALUE,
            max: $math.getNearestMaxGraphLimit(this.getMaxPrice())
        };
    }

    getMaxPrice() {
        var { prices } = this.props;
        prices = prices.map(price => price[1]);
        return Math.max.apply(null, prices) || 0;
    }

    getGraphAreaSize() {
        const {width, height} = this.props;
        const {left, right, bottom, top} = $boxes.graphArea;
        return {
            width: width - right - left,
            height: height - bottom - top
        };
    }

    getPoints() {
        const timeLimits = this.getTimeLimits();
        const culcGraphPoint = this.getCulcGraphPoint();
        const { prices } = this.props;
        const points = [];
        prices.forEach(exchangeRate => {
            var [ date ] = exchangeRate;
            if (date <= timeLimits.max && date >= timeLimits.min) {
                let point = culcGraphPoint(exchangeRate);
                points.push(point);
            }
        });
        return points;
    }

    getPreviousPrice([ targetDate ]) {
        const { prices } = this.props;
        const index = prices.findIndex(
            ([ date ]) =>
            date === targetDate
        );
        return prices[index - 1];
    }

    getNearestPrice(mousePos) {
        const { prices } = this.props;
        const timeLimits = this.getTimeLimits();
        const areaSize = this.getGraphAreaSize();
        const xPart = $math.partOfRange(0, areaSize.width,  mousePos.x);
        const targetTimestamp = timeLimits.min + parseInt((timeLimits.max - timeLimits.min) * xPart, 10);
        var nearestPrice = null;
        var minimalDelta = null;

        prices.forEach((price) => {
            let delta = Math.abs(price[0] - targetTimestamp);
            if (nearestPrice !== null) {
                if (delta < minimalDelta) {
                    minimalDelta = delta;
                    nearestPrice = price;
                }
            } else { // nearestPrice === null
                nearestPrice = price;
                minimalDelta = delta;
            }
        });

        return nearestPrice;
    }

    renderPricePointer() {
        const { pointerPrice }  = this.props;
        const point = pointerPrice && this.getCulcGraphPoint()(pointerPrice);
        return (
            <g clipPath={`url(#${POINTER_CLIP_ID})`}>
                <g transform={point ? `translate(${point.x},${point.y})` : 'translate(0,0)'} visibility={point ? 'visible' : 'hidden'}>
                    <line {...$props.pricePointer.line} />
                    <circle {...$props.pricePointer.aim} />
                </g>
            </g>
        );
    }

    renderPointerClip() {
        const { width, height } = this.props;
        const { top, left, bottom, right } = $boxes.graphArea;
        return (
            <clipPath id={POINTER_CLIP_ID}>
                <rect x={$props.pointerClip.x}
                      y={$props.pointerClip.y}
                      width={width - left - right + $props.pointerClip.additionalWidth}
                      height={height - top - bottom} />
            </clipPath>
        );
    }

    renderPriceTicket() {
        const { width, pointerPrice, evaluateCurrency } = this.props;
        const { graphArea : {left, right, switchHintSideRightLimit} } = $boxes;
        const point = pointerPrice && this.getCulcGraphPoint()(pointerPrice);
        const positionSide =
                point && (point.x > (width - left - right) - switchHintSideRightLimit)
                ? 'left' : 'right';
        const previousPrice = pointerPrice && this.getPreviousPrice(pointerPrice);
        return (
            <PriceTicket
                point={point}
                previousPrice={previousPrice}
                positionSide={positionSide}
                evaluateCurrency={evaluateCurrency}
                pointerPrice={pointerPrice} />
        );
    }

    renderHitArea() {
        const { width, height } = this.getGraphAreaSize();
        return (
            <div onMouseMove={this.handleMouseMove}
                 onMouseOut={this.handleMouseOut}
                 onTouchMove={this.handleMouseMove}
                 onTouchStart={this.handleMouseMove}
                 onTouchEnd={this.handleMouseOut}
                 onTouchCancel={this.handleMouseOut}
                 className="financial-chart__hit-area"
                 style={{
                    width,
                    height
                 }}>
            </div>
        );
    }

    render() {
        const {
            width,
            height,
            prices
        } = this.props;
        const year = new Date(prices[0][0]).getFullYear();

        const { graphArea } = $boxes;
        const points = this.getPoints();
        const valueLimits = this.getValueLimits();

        return (
            <div className="financial-chart" 
                style={{
                    width,
                    height
                }}>
                <svg version="1.1"
                     xmlns="http://www.w3.org/2000/svg"
                     width={width}
                     viewBox={`0 0 ${width} ${height}`}
                     height={height} {...$props.root}>
                    <desc>Financial chart</desc>
                    <defs>
                        {this.renderPointerClip()}
                    </defs>
                    <FinancialChartGraph
                        width={width}
                        height={height}
                        points={points}
                        valueLimits={valueLimits}
                        year={year}>
                        {this.renderPricePointer()}
                    </FinancialChartGraph>
                </svg>
                <div className="financial-chart__ticket-box" style={{
                    top: graphArea.top,
                    left: graphArea.left
                }}>
                    {this.renderPriceTicket()}
                    {this.renderHitArea()}
                </div>
            </div>
        );
    }
}

export default FinancialChart;
