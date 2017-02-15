import React, { Component, PropTypes } from 'react';
import { PriceTicket, FinancialChartGraph } from 'components';

import rootStyles from './styles/root';
import palette from './styles/palette';
import { graphArea as graphAreaBox } from 'components/FinancialChartGraph/styles/boxes';
import './FinancialChart.less';

const POINTER_CLIP_ID = 'pointer-clip';

class FinancialChart extends Component {

    constructor(props) {
        super(props);
        this.handleNewPointerPrice = this.handleNewPointerPrice.bind(this);
        this.handleClearPointerPrice = this.handleClearPointerPrice.bind(this);
        this.state = {
            pointerPrice: null
        };
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
        const { top, left, bottom, right } = graphAreaBox;

        return (
            <clipPath id={POINTER_CLIP_ID}>
                <rect x={0}
                      y={0}
                      width={width - left - right}
                      height={height - top - bottom} />
            </clipPath>
        );
    }

    handleNewPointerPrice(newPointerPrice) {
        this.setState({
            pointerPrice: newPointerPrice
        });
    }

    handleClearPointerPrice() {
        this.setState({
            pointerPrice: null
        });
    }

    render() {
        const { width, height, data } = this.props;

        return (
            <div className="financial-chart" 
                style={{
                    width,
                    height
                }}>
                <svg version="1.1"
                     style={rootStyles}
                     xmlns="http://www.w3.org/2000/svg"
                     width={width}
                     viewBox={`0 0 ${width} ${height}`}
                     height={height}>
                    <desc>Financial chart</desc>
                    <defs>
                        {this.renderPointerClip()}
                    </defs>
                    <FinancialChartGraph
                        onClearPointerPrice={this.handleClearPointerPrice}
                        onNewPointerPrice={this.handleNewPointerPrice}
                        width={width}
                        height={height}
                        data={data}>
                        {this.renderPricePointer()}
                    </FinancialChartGraph>
                </svg>
                <PriceTicket
                    chartSize={{
                        width: width,
                        height: height
                    }}
                    evaluateCurrency={this.props.data.evaluateCurrency}
                    pointerPrice={this.state.pointerPrice} />
            </div>
        );
    }
}

export default FinancialChart;
