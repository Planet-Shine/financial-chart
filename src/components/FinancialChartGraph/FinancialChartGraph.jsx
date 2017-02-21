
import React, { Component, PropTypes } from 'react';

import * as $props from 'components/FinancialChart/props';
import * as $boxes from 'components/FinancialChart/props/boxes';

import { months } from 'utils/date'

import $collection from 'utils/collection';

const YAXIS_COUNT = 5; // 2 minimum.

class FinancialChartGraph extends Component {

    static propTypes = {
        year: PropTypes.number,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        points: PropTypes.array,
        valueLimits: PropTypes.object
    };

    getValueHints() {
        var { valueLimits } = this.props,
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

    renderGraph() {
        const { points } = this.props;
        const d = points.reduce(
            (result, point) =>
            (result + `${result ? ' L' : 'M'} ${point.x} ${point.y}`)
        , '');

        return (
            <g className="financial-chart__graph">
                <path d={d} {...$props.graph} />
            </g>
        );
    }

    renderTimeHints() {
        const { left, right, bottom } = $boxes.timeHint;
        const { width, height } = this.props;
        const top = parseInt(height - bottom, 10);
        const leftTo = width - right;
        const step = (leftTo - left) / months.length;
        const nodes = months.map((month, index) => {
            const x = left + (step / 2) + step * index; // Добавляем половину шага, т.к. надпись должна быть в центре своего диапазона.
            return (
                <text key={index}
                      x={x}
                      y={top}
                      {...$props.timeHint}>
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
        const { year } = this.props;
        const { left, bottom } = $boxes.yearHint;
        const { height } = this.props;
        var node = null;
        // По первой дате определяем год.
        if (year) {
            node = (
                <text x={left}
                      y={height - bottom}
                    {...$props.yearHint}>
                    <tspan>{year}</tspan>
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
        const { left, top, bottom } = $boxes.valueHint;
        const { height } = this.props;
        const topTo = height - bottom;
        const valueHints = this.getValueHints();
        const step = (topTo - top) / (valueHints.length - 1); // Отнимаем 1цу, т.к. промежутков у нас на 1 меньше. Начинается и кончается линией.
        const nodes = valueHints.map((valueHint, index) => {
            const y = top + step * index;
            return (
                <text key={index}
                      x={left}
                      y={y}
                      {...$props.valueHint}>
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
        const { left, right, bottom, top } = $boxes.graphArea;
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
                d={`M ${point1.x} ${point1.y} L ${point2.x} ${point2.y}`}
                {...$props.axis}
            />);
        });

        return (
            <g className="financial-chart__yaxiss">
                {nodes}
            </g>
        );
    }

    shouldComponentUpdate(nextProps) {
        return !$collection.equal(nextProps, this.props);
    }

    render() {
        const { width, height } = this.props;
        return (
            <g>
                <rect x="0" y="0" width={width} height={height} {...$props.backgroundBox} />
                {this.renderYAxises()}
                {this.renderValueHints()}
                {this.renderTimeHints()}
                {this.renderYearHint()}
                <g transform={`translate(${$boxes.graphArea.left}, ${$boxes.graphArea.top})`}>
                    {this.renderGraph()}
                    {this.props.children}
                </g>
            </g>
        );
    }
}

export default FinancialChartGraph;