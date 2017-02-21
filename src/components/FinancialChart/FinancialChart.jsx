import React, { Component, PropTypes } from 'react';
import { PriceTicket, FinancialChartGraph } from 'components';

import * as $props from './props';
import * as $boxes from 'components/FinancialChart/props/boxes';
import './FinancialChart.less';

const POINTER_CLIP_ID = 'pointer-clip';

class FinancialChart extends Component {

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        data: PropTypes.object.isRequired,
        onClearPointerPrice: PropTypes.func,
        onNewPointerPrice: PropTypes.func
    };

    renderPricePointer() {
        const { pointerPrice }  = this.props;
        const { point } = pointerPrice || {};
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
        const { width, pointerPrice } = this.props;
        const { point } = pointerPrice || {};
        const { graphArea : {left, right, top, switchHintSideRightLimit} } = $boxes;
        const positionSide =
                point && (point.x > (width - left - right) - switchHintSideRightLimit)
                ? 'left' : 'right';
        return (
            <div className="financial-chart__ticket-box" style={{
                top: top,
                left: left
            }}>
                <PriceTicket
                    positionSide={positionSide}
                    evaluateCurrency={this.props.data.evaluateCurrency}
                    pointerPrice={pointerPrice} />
            </div>
        );
    }

    render() {
        const {
            width,
            height,
            data,
            onClearPointerPrice,
            onNewPointerPrice
        } = this.props;
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
                        onClearPointerPrice={onClearPointerPrice}
                        onNewPointerPrice={onNewPointerPrice}
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
