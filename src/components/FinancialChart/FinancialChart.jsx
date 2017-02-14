
import React, { Component, PropTypes } from 'react';

import rootStyles from './styles/root';
import { timeHint as timeHintStyle, valueHint as valueHintStyle, yearHint as yearHintStyle } from './styles/text';
import palette from './styles/palette';
import timeHintBox from './styles/timeHintBox';
import yearHintBox from './styles/yearHintBox';
import valueHintBox from './styles/valueHintBox';
import axisBox from './styles/axisBox';
import months from './months'
import math from 'utils/math';

import './FinancialChart.less';

const COUNT_OF_YAXIS = 5; // 2 minimum.

class FinancialChart extends Component {

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
        var date;
        if (data[0]) {
            date = new Date(data[0].date);
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

    renderYaxiss() {
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
                        strokeWidth="1"
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

    getTimeLimits() {
        const { data } = this.props;
        const { date } = data[0];
        const year = date.getFullYear();
        return {
            min: new Date(year, 0, 1), // С первых секунд первого дня года.
            max: new Date(year + 1, 0, 1) // До первой секунды следующего года.
        };
    }

    getMaxRate() {
        const { data } = this.props;
        const rates = data.map(exchangeRate => exchangeRate.rate);
        return Math.max.apply(null, rates);
    }

    getNearestMaxLimit(value) {
        const [ integerValueString, decimalValueString ] = String(value).split(',');
        var nearstMaximum;
        function getNextMaxDigit(targetDigit) {
            // для  0,1,2,3,4,5,6,7,8, 9
            return [2,2,4,4,6,6,8,8,10,10][targetDigit];
        }
        if (integerValueString && integerValueString !== '0') {
            let digitCount = integerValueString.length;
            let firstDigit = parseInt(integerValueString[0], 10);
            let nextMaxDigit = getNextMaxDigit(firstDigit);
            nearstMaximum = nextMaxDigit * Math.pow(10, digitCount - 1);
        } else {
            let significandDecimalValueString = String(parseInt(decimalValueString, 10));
            let zeroCount = decimalValueString.length - significandDecimalValueString.length;
            let firstDigit = parseInt(significandDecimalValueString[0], 10);
            let nextMaxDigit = getNextMaxDigit(firstDigit);
            nearstMaximum = nextMaxDigit / Math.pow(10, zeroCount);
        }
        return nearstMaximum;
    }

    getValueLimits() {
        return {
            min: 0,
            max: this.getNearestMaxLimit(this.getMaxRate())
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

    renderGraph() {
        const timeLimits   = this.getTimeLimits();
        const rateLimits   = this.getValueLimits();
        const xGraphLimits = this.getXGraphLimits();
        const yGraphLimits = this.getYGraphLimits();
        const xWeight = xGraphLimits.max - xGraphLimits.min;
        const yWeight = yGraphLimits.max - yGraphLimits.min;
        const { data } = this.props;
        const d = data.reduce((result, exchangeRate) => {
            const { date, rate } = exchangeRate;
            // Берём остаток от доли т.к. ось y растет сверху вниз.
            const datePart = (1 - math.partOfRange(timeLimits.min.getTime(), timeLimits.max.getTime(), date.getTime()));
            const ratePart = (1 - math.partOfRange(rateLimits.min, rateLimits.max, rate));
            const point1 = {
                x: xGraphLimits.min + datePart * xWeight,
                y: yGraphLimits.min + ratePart * yWeight
            };
            return result + `${result ? ' L' : 'M'} ${point1.x} ${point1.y}`;
        }, '');

        // "M -5.1586590499701 147.22786031746034 L 9.2974994988384 146.87231466666665 L 23.753658047647 146.80593268817205 L 38.209816596457 146.63833133333333 L 52.665975145265 146.23288482758622 L 67.122133694074 145.4203864516129 L 81.578292242884 140.34923743589744 L 96.034450791692 131.41994021505377 L 110.4906093405 120.61944238095236 L 124.94676788931 121.193331827957 L 139.40292643812 121.29280777777778 L 153.85908498693 121.16696322580646 L 168.31524353574 112.32770387096772 L 182.77140208454 109.11932266666665 L 197.22756063335 113.35338769230769 L 211.68371918216 98.1486738095238 L 226.13987773097 92.05586644444445 L 240.59603627978 90.2653608888889 L 255.05219482859 26.67915000000002 L 269.5083533774 20.694791397849457 L 283.96451192621 34.983010888888856 L 298.42067047501 48.35119784946235 L 312.87682902382 52.75894355555553 L 327.33298757263 42.09004494623659 L 341.78914612144 45.38253634408602 L 356.24530467025 46.67151644444448 L 370.70146321906 45.261770752688136 L 385.15762176787 35.28374400000004 L 399.61378031668 33.30515182795699 L 414.06993886549 25.418108888888895 L 428.5260974143 19.879121839080483 L 442.9822559631 22.09085032258065 L 457.43841451191 28.844208444444433 L 471.89457306072 31.696601935483898 L 486.35073160953 33.529306666666656 L 500.80689015834 34.38552602150537 L 515.26304870715 30.407146881720422 L 529.71920725596 24.504171111111134 L 544.17536580477 26.69686301075265 L 558.63152435357 22.71624666666662 L 573.08768290238 19.88861591397847 L 587.54384145119 12.572979569892453 L 602 16.004977948717965"

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

    render() {
        const { width, height } = this.props;

        return (
            <div>
                <svg version="1.1" className="financial-chart"
                     style={rootStyles}
                     xmlns="http://www.w3.org/2000/svg" width={width} viewBox={`0 0 ${width} ${height}`} height={height}>
                    <desc>Financial chart</desc>
                    {this.renderYaxiss()}
                    {this.renderGraph()}
                    {this.renderValueHints()}
                    {this.renderTimeHints()}
                    {this.renderYearHint()}
                </svg>
            </div>
        );
    }
}

export default FinancialChart;
