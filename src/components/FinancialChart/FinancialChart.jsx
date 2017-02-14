
import React, { Component, PropTypes } from 'react';

import rootStyles from './styles/root';
import { timeHint as timeHintStyle, valueHint as valueHintStyle, yearHint as yearHintStyle } from './styles/text';
import palette from './styles/palette';
import timeHintBox from './styles/timeHintBox';
import yearHintBox from './styles/yearHintBox';
import valueHintBox from './styles/valueHintBox';
import axisBox from './styles/axisBox';
import date, { months } from 'utils/date'
import math from 'utils/math';
import dom from 'utils/dom';

import './FinancialChart.less';

const COUNT_OF_YAXIS = 5; // 2 minimum.
const POINTER_CLIP_ID = 'pointer-clip';

class FinancialChart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pointerPrice: null
        };
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }

    getNearestPrice(mousePos) {
        const { data : { prices } } = this.props;
        const timeLimits = this.getTimeLimits();
        const xGraphLimits = this.getXGraphLimits();
        const xPart = math.partOfRange(xGraphLimits.min, xGraphLimits.max,  mousePos.x + xGraphLimits.min);
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
        const mousePos = dom.getMousePos(e);
        const nearestPrice = this.getNearestPrice(mousePos);

        const culcGraphPoint = this.getCulcGraphPoint();
        const point = culcGraphPoint(nearestPrice);
        const previousPrice = prices[prices.indexOf(nearestPrice) - 1] || null;
        this.setState({
            pointerPrice: {
                point,
                price: nearestPrice,
                previousPrice
            }
        });
    }

    handleMouseOut() {
        this.setState({
            pointerPrice: null
        });
    }

    getValueHints() {
        var valueLimits = this.getValueLimits(),
            step = (valueLimits.max / (COUNT_OF_YAXIS - 1)),
            result = [];
        for (let index = 0; index < COUNT_OF_YAXIS; index++) {
            // Крайние лимиты берем как они есть.
            if (index === 0) {
                result.push(valueLimits.max);
            } else if (index === COUNT_OF_YAXIS - 1) {
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
            min: 0,
            max: math.getNearestMaxGraphLimit(this.getMaxPrice())
        };
    }

    getXGraphLimits() {
        const { width } = this.props;
        const { left, right } = axisBox;
        return {
            min: left,
            max: width - right
        };
    }

    getYGraphLimits() {
        const { height } = this.props;
        const { bottom, top } = axisBox;
        return {
            min: top,
            max: height - bottom
        };
    }

    getCulcGraphPoint() {
        const xGraphLimits = this.getXGraphLimits();
        const yGraphLimits = this.getYGraphLimits();
        const timeLimits   = this.getTimeLimits();
        const rateLimits   = this.getValueLimits();
        const xWeight      = xGraphLimits.max - xGraphLimits.min;
        const yWeight      = yGraphLimits.max - yGraphLimits.min;

        return (price) => {
            var [ date, rate ] = price;
            // Берём остаток от доли т.к. ось y растет сверху вниз.
            const datePart = math.partOfRange(timeLimits.min, timeLimits.max, date);
            const ratePart = (1 - math.partOfRange(rateLimits.min, rateLimits.max, rate));
            return {
                x: xGraphLimits.min + datePart * xWeight,
                y: yGraphLimits.min + ratePart * yWeight
            };
        };
    }

    renderGraph() {
        const timeLimits     = this.getTimeLimits();
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

    renderPricePointer() {
        var point = null;
        if (this.state.pointerPrice) {
            point = this.state.pointerPrice.point;
        }
        return (
            <g clipPath={`url(#${POINTER_CLIP_ID})`}>
                <g ref={e => this.pointer = e} transform={point ? `translate(${point.x},${point.y})` : 'translate(0,0)'} visibility={point ? 'visible' : 'hidden'}>
                <line strokeDasharray="4, 4" fill={palette.pointerLine} x1="0" y1="0" x2="0" y2="10000"
                    stroke={palette.pointerLine}
                    strokeWidth="1" />
                <circle stroke={palette.background}
                    fill={palette.graph}
                    strokeWidth="2"
                    cx="0"
                    cy="0"
                    r="4" />
                </g>
            </g>
        );
    }

    renderPointerClip() {
        const { width, height } = this.props;
        const { top, left, bottom, right } = axisBox;

        return (
            <clipPath id={POINTER_CLIP_ID}>
                <rect x={left}
                      y={top}
                      width={width - left - right}
                      height={height - top - bottom} />
            </clipPath>
        );
    }

    renderHitArea() {
        const { width, height } = this.props;
        const { top, left, bottom, right } = axisBox;

        return (
            <rect onMouseMove={this.handleMouseMove}
                  onMouseOut={this.handleMouseOut}
                  className="financial-chart__hit-area"
                  x={left}
                  y={top}
                  width={width - left - right}
                  height={height - top - bottom}
                  fill="transparent" />
        );
    }

    renderTimeHints() {
        const { left, right, bottom } = timeHintBox;
        const { width, height } = this.props;
        const top = parseInt(height - bottom, 10);
        const leftTo = width - right;
        const step = (leftTo - left) / months.length;
        const nodes = months.map((month, index) => {
            const x = left + (step / 2) + step * index;
            return (
                <text x={x}
                      style={timeHintStyle}
                      textAnchor="middle"
                      y={top}
                      opacity="1"
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
        var date = data.prices[0][0];
        if (date) {
            date = new Date(date);
            node = (
                <text x={left}
                      style={yearHintStyle}
                      textAnchor="start"
                      y={height - bottom}
                      opacity="1">
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
                      y={y}
                      opacity="1">
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
        const { left, right, bottom, top } = axisBox;
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
                opacity="1"
                d={`M ${point1.x} ${point1.y} L ${point2.x} ${point2.y}`}
            />);
        });

        return (
            <g className="financial-chart__yaxiss">
                {nodes}
            </g>
        );
    }

    renderPriceTicket() {
        const pointerPrice = this.state.pointerPrice;
        if (pointerPrice) {
            let currency = this.props.data.baseCurrency;
            let priceDelta;
            let point = this.state.pointerPrice.point;
            if (pointerPrice.previousPrice) {
                priceDelta = pointerPrice.price[1] - pointerPrice.previousPrice[1];
                priceDelta = priceDelta.toFixed(2);
            }
            return (
                <g className="financial-chart__price-hint"
                   transform={`translate(${point.x}, ${point.y})`}>
                    <text y={5}
                          textAnchor="middle"
                          opacity="1">
                        <tspan>
                            {pointerPrice.price[1]} {currency}
                        </tspan>
                    </text>
                    <text y={25}
                          textAnchor="middle"
                          opacity="1">
                        <tspan>
                            {date.toRussianString(new Date(pointerPrice.price[0]))}
                        </tspan>
                    </text>
                    <text y={45}
                          textAnchor="middle"
                          opacity="1">
                        <tspan>
                            {priceDelta}
                        </tspan>
                    </text>
                </g>
            );
        }
        return (
            <g className="financial-chart__price-hint"
               transform={`translate(150, 150)`}
               visibility="hidden">
            </g>
        )
    }

    render() {
        const { width, height } = this.props;

        // todo: втавить на фон {palette.background}
        return (
            <div>
                <svg version="1.1" className="financial-chart"
                     style={rootStyles}
                     xmlns="http://www.w3.org/2000/svg"
                     width={width}
                     viewBox={`0 0 ${width} ${height}`}
                     height={height}>
                    <desc>Financial chart</desc>
                    <defs>
                        {this.renderPointerClip()}
                    </defs>
                    <rect x="0" y="0" width={width} height={height} fill="transparent" />
                    {this.renderYAxises()}
                    {this.renderValueHints()}
                    {this.renderTimeHints()}
                    {this.renderYearHint()}
                    {this.renderGraph()}
                    {this.renderPricePointer()}
                    {this.renderPriceTicket()}
                    {this.renderHitArea()}
                </svg>
            </div>
        );
    }
}

export default FinancialChart;