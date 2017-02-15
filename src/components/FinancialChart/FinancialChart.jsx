import React, { Component, PropTypes } from 'react';
import { PriceTicket, FinancialChartGraph } from 'components';

import * as $props from './props';
import * as $boxes from 'components/FinancialChart/props/boxes';
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
        const { width } = this.props;
        var pointerPrice = null;
        var isLeftSideTicket = false;
        if (this.state.pointerPrice) {
            pointerPrice = Object.assign({}, this.state.pointerPrice);
            let point = Object.assign({}, this.state.pointerPrice.point);
            point.x += $boxes.graphArea.left;
            point.y += $boxes.graphArea.top;
            pointerPrice.point = point;
            isLeftSideTicket = (point.x > (width - $boxes.graphArea.left - $boxes.graphArea.right) - $boxes.graphArea.switchHintSideRightLimit);
        }
        return (
            <PriceTicket
                isLeftSideTicket={isLeftSideTicket}
                evaluateCurrency={this.props.data.evaluateCurrency}
                pointerPrice={pointerPrice} />
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
                     xmlns="http://www.w3.org/2000/svg"
                     width={width}
                     viewBox={`0 0 ${width} ${height}`}
                     height={height} {...$props.root}>
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
                {this.renderPriceTicket()}
            </div>
        );
    }
}

export default FinancialChart;
