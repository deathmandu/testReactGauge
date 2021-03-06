import React from 'react';
import { expect } from 'chai';
import { mount, render } from 'enzyme';
import _ from 'lodash';

import { Gauge } from '../src';

const wrappedGauge = mount(
    <Gauge
        scale={{ customTicks: [1, 2, 3] }}
        value={2}
        valueIndicator={{
            fill: 'green',
            stroke: 'red',
            strokeWidth: 1
        }}
    />
).render();

describe('Main', () => {
    const wrapper = wrappedGauge;

    it('should return svg', () => {
        expect(wrapper.find('svg')).to.have.length(1);
    });

    it('should return valid className', () => {
        expect(wrapper.find('svg').attr('class')).to.be.equal('dx-react-gauge');
    });

    it('should calculate linearScale by start/end value and width', () => {
        const gaugeLabels = mount(<Gauge />)
                .render()
                .find('.axis')
                .find('text');
        _.range(0, 100, 10).forEach((label, ind) => {
            expect(gaugeLabels.eq(ind).text()).to.be.equal(label.toString());
        });
    });
});

describe('Axis', () => {
    const wrappedAxis = wrappedGauge
        .find('.axis')
        .eq(0);

    it('should return only one node', () => {
        expect(wrappedGauge.find('.axis')).to.have.length(1);
    });

    it('should return g', () => {
        expect(wrappedAxis.get(0).tagName).to.be.equal('g');
    });

    describe('range container', () => {
        it('should have rangeContainer rect', () => {
            expect(wrappedAxis.find('rect')).to.have.length(1);
        });
        it('should return valid coords for rangeContainer', () => {
            expect(wrappedAxis
                .find('rect')
                .parent('g')
                .parent('g')
                .eq(0)
                .attr('transform')
            ).to.equal('translate(50,5)');
            expect(wrappedAxis.find('rect').attr('x')).to.equal('0');
            expect(wrappedAxis.find('rect').attr('y')).to.equal('0');
            expect(wrappedAxis.find('rect').attr('width')).to.equal('400');
            expect(wrappedAxis.find('rect').attr('height')).to.equal('5');
        });

        it('should return valid backgroundColor for rangeContainer', () => {
            expect(wrappedAxis.find('rect').attr('fill')).to.equal('gray');
        });
    });

    describe('ticks', () => {
        it('should return ticks with path', () => {
            expect(wrappedAxis.find('path')).to.have.length(3);
        });

        it('should return valid dAttribute for every path', () => {
            const paths = wrappedAxis.find('path');
            expect(paths.eq(0).attr('d')).to.equal('M0 0 L0 10');
            expect(paths.eq(1).attr('d')).to.equal('M200 0 L200 10');
            expect(paths.eq(2).attr('d')).to.equal('M400 0 L400 10');
        });

        it('should return default tick color', () => {
            expect(wrappedAxis.find('path').eq(0).attr('stroke')).to.equal('white');
        });

        it('should return default tickWidth', () => {
            expect(wrappedAxis.find('path').eq(0).attr('stroke-width')).to.equal('2');
        });
    });

    describe('labels', () => {
        it('should return ticks with labels', () => {
            expect(wrappedAxis.find('text')).to.have.length(3);
        });

        it('should be text with expected x attribute', () => {
            expect(wrappedAxis.find('text').eq(0).attr('x')).to.equal('0');
            expect(wrappedAxis.find('text').eq(1).attr('x')).to.equal('200');
            expect(wrappedAxis.find('text').eq(2).attr('x')).to.equal('400');
        });

        it('should set correct offset to labels', () => {
            expect(wrappedAxis.find('text').eq(0).attr('y')).to.equal('30');
        });
    });
});

describe('valueIndicator', () => {
    const wrappedValueIndicator = wrappedGauge.find('.valueIndicator').eq(0);
    it('should return valueIndicator', () => {
        expect(wrappedGauge.find('.valueIndicator')).to.have.length(1);
    });

    it('should return rect', () => {
        expect(wrappedValueIndicator.get(0).tagName).to.be.equal('rect');
    });

    it('should be rect with expected width and height', () => {
        expect(wrappedValueIndicator.eq(0).attr('width')).to.be.equal('200');
        expect(wrappedValueIndicator.eq(0).attr('height')).to.be.equal('10');
    });

    it('should have rect start point', () => {
        expect(wrappedValueIndicator.eq(0).attr('x')).to.be.equal('0');
        expect(wrappedValueIndicator.eq(0).attr('y')).to.be.equal('0');
    });

    it('should have selected valueIndicator color', () => {
        expect(wrappedValueIndicator.eq(0).attr('fill')).to.be.equal('green');
    });

    it('should have selected valueIndicator stroke', () => {
        expect(wrappedValueIndicator.eq(0).attr('stroke')).to.be.equal('red');
    });

    it('should have selected valueIndicator stroke-width', () => {
        expect(wrappedValueIndicator.eq(0).attr('stroke-width')).to.be.equal('1');
    });
});

describe('animation', () => {
    it('should have transform property for valueIndicatorGroup', () => {
        const wrappedGroup = wrappedGauge.find('.valueIndicatorGroup').eq(0);
        expect(wrappedGroup.eq(0).attr('transform')).to.be.equal('translate(0, 5)');
    });
});

describe('subValueIndicator', () => {
    const subValueGaugeMarkup = (
        <Gauge><circle className="subValueIndicator" value={10} /></Gauge>
    );
    const subValueGauge = mount(subValueGaugeMarkup).render();
    const subValueStaticGauge = render(subValueGaugeMarkup);
    it('should have subValueIndicatorGroup with transform on x', () => {
        const subValueIndicator = subValueGauge.find('.subValueIndicatorGroup').get(0);
        expect(subValueIndicator.parent.tagName).to.be.equal('g');
        expect(subValueStaticGauge.find('.subValueIndicatorGroup')
            .attr('style')).to.be.equal('transform:translate(40px, 0px);');
    });

    describe('circle', () => {
        const gaugeWithCircle = mount(
            <Gauge><circle cx="0" cy="0" fill="red" r={3} className="subValueIndicator" /></Gauge>
        ).render();
        it('should have circle in group with arguments', () => {
            const subValueIndicator = gaugeWithCircle.find('.subValueIndicator').eq(0);
            expect(subValueIndicator.parent().get(0).tagName).to.be.equal('g');
            expect(subValueIndicator.get(0).tagName).to.be.equal('circle');
            expect(subValueIndicator.attr('cx')).to.be.equal('0');
            expect(subValueIndicator.attr('cy')).to.be.equal('0');
            expect(subValueIndicator.attr('fill')).to.be.equal('red');
            expect(subValueIndicator.attr('r')).to.be.equal('3');
        });
    });

    describe('rect', () => {
        const gauge = mount(
            <Gauge>
                <rect
                    x="-50"
                    y="-10"
                    fill="red"
                    width={100}
                    height={10}
                    className="subValueIndicator"
                />
            </Gauge>
        ).render();
        const indicator = gauge.find('.subValueIndicator').eq(0);
        it('should have rect with expected attributes', () => {
            expect(indicator.get(0).tagName).to.be.equal('rect');
            expect(indicator.attr('x')).to.be.equal('-50');
            expect(indicator.attr('y')).to.be.equal('-10');
            expect(indicator.attr('fill')).to.be.equal('red');
            expect(indicator.attr('width')).to.be.equal('100');
            expect(indicator.attr('height')).to.be.equal('10');
        });
    });

    describe('with valueIndicator', () => {
        const gauge = mount(
            <Gauge><circle className="subValueIndicator" /></Gauge>
        ).render();
        const subValueIndicator = gauge.find('.subValueIndicator').get(0);
        const valueIndicator = gauge.find('.valueIndicator').get(0);
        it('should have expected subValueIndicator and valueIndicator', () => {
            expect(subValueIndicator.tagName).to.be.equal('circle');
            expect(valueIndicator.tagName).to.be.equal('rect');
        });
    });

    describe('multiple', () => {
        const gauge = mount(
            <Gauge>
                <circle r={3} className="subValueIndicator" />
                <rect className="subValueIndicator" />
            </Gauge>
        ).render();
        const subvalueIndicators = gauge.find('.subValueIndicator');
        it('should have multiple indicators on gauge', () => {
            expect(subvalueIndicators.get(0).tagName).to.be.equal('circle');
            expect(subvalueIndicators.get(1).tagName).to.be.equal('rect');
        });
    });
});
