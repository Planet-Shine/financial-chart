
import React, { Component } from 'react';

import rootStyles from './styles/Root';
import textStyles from './styles/Text';

import './FinancialChart.less';

class FinancialChart extends Component {

    render() {
        return (
            <div>
                <svg version="1.1" className="financial-chart"
                     style={rootStyles}
                     xmlns="http://www.w3.org/2000/svg" width="651" viewBox="0 0 651 352" height="352">

                    <desc>Financial chart</desc>

                    <g className="highcharts-grid highcharts-yaxis-grid ">
                        <path fill="none" stroke="#e6e6e6" strokeWidth="1" opacity="1" className="highcharts-grid-line"
                              d="M 39 112.5 L 641 112.5"/>
                        <path fill="none" stroke="#e6e6e6" strokeWidth="1" opacity="1" className="highcharts-grid-line"
                              d="M 39 44.5 L 641 44.5"/>
                        <path fill="none" stroke="#e6e6e6" strokeWidth="1" opacity="1" className="highcharts-grid-line"
                              d="M 39 180.5 L 641 180.5"/>
                        <path fill="none" stroke="#e6e6e6" strokeWidth="1" opacity="1" className="highcharts-grid-line"
                              d="M 39 247.5 L 641 247.5"/>
                    </g>
                    
                    <g className="highcharts-grid highcharts-yaxis-grid highcharts-navigator-yaxis">
                        <path fill="none" class="highcharts-grid-line" d="M 39 307.5 L 641 307.5" opacity="1" />
                    </g>

                    <g className="highcharts-axis-labels highcharts-yaxis-labels">
                        <text x="24" style={textStyles}
                              text-anchor="end" transform="translate(0,0)" y="116" opacity="1">
                            <tspan>20</tspan>
                        </text>
                        <text x="0" style={textStyles}
                              text-anchor="end" transform="translate(0,0)" y="-9999">
                            <tspan>30</tspan>
                        </text>
                        <text x="24" style={textStyles}
                              text-anchor="end" transform="translate(0,0)" y="184" opacity="1">
                            <tspan>10</tspan>
                        </text>
                        <text x="24" style={textStyles}
                              text-anchor="end" transform="translate(0,0)" y="251" opacity="1">
                            <tspan>0</tspan>
                        </text>
                    </g>

                    <g className="highcharts-axis-labels highcharts-xaxis-labels ">
                        <text x="438.6137803166771"
                              style={textStyles}
                              text-anchor="middle" transform="translate(0,0)" y="266" opacity="1">
                            <tspan>дек, 2015</tspan>
                        </text>
                        <text x="265.13987773097114"
                              style={textStyles}
                              text-anchor="middle" transform="translate(0,0)" y="266" opacity="1">
                            <tspan>дек, 2014</tspan>
                        </text>
                        <text x="91.66597514526521"
                              style={textStyles}
                              text-anchor="middle" transform="translate(0,0)" y="266" opacity="1">
                            <tspan>дек, 2013</tspan>
                        </text>
                        <text x="178.4029264381175"
                              style={textStyles}
                              text-anchor="middle" transform="translate(0,0)" y="266" opacity="1">
                            <tspan>июн, 2014</tspan>
                        </text>
                        <text x="351.87682902382477"
                              style={textStyles}
                              text-anchor="middle" transform="translate(0,0)" y="266" opacity="1">
                            <tspan>июн, 2015</tspan>
                        </text>
                        <text x="525.3507316095294"
                              style={textStyles}
                              text-anchor="middle" transform="translate(0,0)" y="266" opacity="1">
                            <tspan>июн, 2016</tspan>
                        </text>
                        <text x="612.087682902383"
                              style={textStyles}
                              text-anchor="middle" transform="translate(0,0)" y="266" opacity="1">
                            <tspan>дек, 2016</tspan>
                        </text>
                    </g>
                </svg>
            </div>
        );
    }
}

export default FinancialChart;
