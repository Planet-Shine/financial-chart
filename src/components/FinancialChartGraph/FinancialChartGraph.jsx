
import React, { Component, PropTypes } from 'react';

import palette from 'components/FinancialChart/styles/palette';
import { timeHint as timeHintStyle, valueHint as valueHintStyle, yearHint as yearHintStyle } from './styles/hints';
import {timeHint as timeHintBox, yearHint as yearHintBox, valueHint as valueHintBox, graphArea as graphAreaBox} from './styles/boxes';

import { months } from 'utils/date'
import $math from 'utils/math';
import $dom from 'utils/dom';
import $collection from 'utils/collection';

const YAXIS_COUNT = 5; // 2 minimum.
const MINIMUM_VALUE = 0;

class FinancialChartGraph extends Component {

    constructor(props) {
        super(props);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }

    getNearestPrice(mousePos) {
        const { data : { prices } } = this.props;
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

    handleMouseMove(e) {
        const { data : { prices } } = this.props;
        const mousePos = $dom.getMousePos(e);
        const nearestPrice = this.getNearestPrice(mousePos);

        const culcGraphPoint = this.getCulcGraphPoint();
        const point = culcGraphPoint(nearestPrice);
        const previousPrice = prices[prices.indexOf(nearestPrice) - 1] || null;
        this.props.onNewPointerPrice({
            point,
            price: nearestPrice,
            previousPrice
        });
    }

    handleMouseOut() {
        this.props.onClearPointerPrice();
    }

    getValueHints() {
        var valueLimits = this.getValueLimits(),
            step = (valueLimits.max / (YAXIS_COUNT - 1)),
            result = [];
        for (let index = 0; index < YAXIS_COUNT; index++) {
            // Крайние лимиты берем как они есть.
            if (index === 0) {
                result.push(valueLimits.max);
            } else if (index === YAXIS_COUNT - 1) {
                result.push(valueLimits.min);
                // Остальные лимиты - вычисляем.
            } else {
                result.push(valueLimits.max - (step * index));
            }
        }
        return result;
    }

    getTimeLimits() {
        var { data, year } = this.props;
        const date = new Date(data.prices[0][0]);
        year = year || date.getFullYear();
        return {
            min: new Date(year, 0, 1).getTime(),
            max: new Date(year + 1, 0, -1).getTime()
        };
    }

    getMaxPrice() {
        var { data : { prices } } = this.props;
        prices = prices.map(price => price[1]);
        return Math.max.apply(null, prices);
    }

    getValueLimits() {
        return {
            min: MINIMUM_VALUE,
            max: $math.getNearestMaxGraphLimit(this.getMaxPrice())
        };
    }


    getGraphAreaSize() {
        const { width, height } = this.props;
        const { left, right, bottom, top } = graphAreaBox;
        return {
            width: width - right - left,
            height: height - bottom - top
        };
    }

    renderGraph() {
        const timeLimits = this.getTimeLimits();
        const culcGraphPoint = this.getCulcGraphPoint();

        const { data } = this.props;
        const d = data.prices.reduce((result, exchangeRate) => {
            var [ date ] = exchangeRate;
            if (date <= timeLimits.max && date >= timeLimits.min) {
                const point1 = culcGraphPoint(exchangeRate);
                return result + `${result ? ' L' : 'M'} ${point1.x} ${point1.y}`;
            }
            return result;
        }, '');

        return (
            <g className="financial-chart__graph">
                <path
                    fill="none"
                    d={d}
                    stroke={palette.graph}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    strokeLinecap="round" />
            </g>
        );
    }

    renderTimeHints() {
        const { left, right, bottom } = timeHintBox;
        const { width, height } = this.props;
        const top = parseInt(height - bottom, 10);
        const leftTo = width - right;
        const step = (leftTo - left) / months.length;
        const nodes = months.map((month, index) => {
            const x = left + (step / 2) + step * index; // Добавляем половину шага, т.к. надпись должна быть в центре своего диапазона.
            return (
                <text x={x}
                      style={timeHintStyle}
                      textAnchor="middle"
                      y={top}
                      key={index}>
                    <tspan>
                        {months[index]}
                    </tspan>
                </text>
            );
        });

        return (
            <g className="financial-chart__time-hints">
                {nodes}
            </g>
        );
    }

    renderYearHint() {
        const { data } = this.props;
        const { left, bottom } = yearHintBox;
        const { height } = this.props;
        var node = null;
        // По первой дате определяем год.
        var date = data.prices[0][0];
        if (date) {
            date = new Date(date);
            node = (
                <text x={left}
                      style={yearHintStyle}
                      textAnchor="start"
                      y={height - bottom}>
                    <tspan>{date.getFullYear()}</tspan>
                </text>
            );
        }
        return (
            <g className="financial-chart__year-hint">
                {node}
            </g>
        );
    }

    renderValueHints() {
        const { left, top, bottom } = valueHintBox;
        const { height } = this.props;
        const topTo = height - bottom;
        const valueHints = this.getValueHints();
        const step = (topTo - top) / (valueHints.length - 1); // Отнимаем 1цу, т.к. промежутков у нас на 1 меньше. Начинается и кончается линией.
        const nodes = valueHints.map((valueHint, index) => {
            const y = top + step * index;
            return (
                <text key={index}
                      x={left}
                      style={valueHintStyle}
                      textAnchor="end"
                      y={y}>
                    <tspan>
                        {valueHint}
                    </tspan>
                </text>
            );
        });

        return (
            <g className="financial-chart__value-hints">
                {nodes}
            </g>
        );
    }

    renderYAxises() {
        const { left, right, bottom, top } = graphAreaBox;
        const { width, height } = this.props;
        const valueHints = this.getValueHints();
        const leftTo = width - right;
        const topTo  = height - bottom;
        const stepY  = (topTo - top) / (valueHints.length - 1); // Отнимаем 1цу, т.к. промежутков у нас на 1 меньше. Начинается и кончается линией.
        const nodes = valueHints.map((valueHint, index) => {
            const y = top + stepY * index;
            const point1 = {
                x: left,
                y: y
            };
            const point2 = {
                x: leftTo,
                y: y
            };
            return (<path
                key={index}
                fill="none"
                stroke={palette.axis}
                strokeWidth="1.5"
                d={`M ${point1.x} ${point1.y} L ${point2.x} ${point2.y}`}
            />);
        });

        return (
            <g className="financial-chart__yaxiss">
                {nodes}
            </g>
        );
    }

    renderHitArea() {
        const { width, height } = this.getGraphAreaSize();
        return (
            <rect onMouseMove={this.handleMouseMove}
                  onMouseOut={this.handleMouseOut}
                  className="financial-chart__hit-area"
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                  fill="transparent" />
        );
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

    shouldComponentUpdate(nextProps) {
        return !$collection.equal(nextProps, this.props);
    }

    render() {
        const { width, height } = this.props;

        return (
            <g>
                <rect x="0" y="0" width={width} height={height} fill={palette.background} />
                {this.renderYAxises()}
                {this.renderValueHints()}
                {this.renderTimeHints()}
                {this.renderYearHint()}
                <g transform={`translate(${graphAreaBox.left}, ${graphAreaBox.top})`}>
                    {this.renderGraph()}
                    {this.props.children}
                    {this.renderHitArea()}
                </g>
            </g>
        );
    }
}

export default FinancialChartGraph;