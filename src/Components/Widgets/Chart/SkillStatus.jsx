// src/Components/Widgets/Chart/SkillStatus.jsx
import React, { Fragment, useMemo } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import Chart from 'react-apexcharts';
import { TrendingUp } from 'react-feather';
import { H5 } from '../../../AbstractElements';

const SkillStatusChart = ({ kpis, title = "Skill Status" }) => {
  const dpo = kpis?.totals?.dpo_progress || {};
  // valeurs numériques (par ex. year_total & month_total)
  const series = useMemo(() => {
    const yt = Number(dpo?.year_total ?? 0);
    const mt = Number(dpo?.month_total ?? 0);
    return [isFinite(yt) ? yt : 0, isFinite(mt) ? mt : 0];
  }, [dpo]);

  const radialChartLive = {
    series,
    options: {
      chart: { type: 'radialBar', height: 375, offsetY: -30, offsetX: 20 },
      plotOptions: {
        radialBar: {
          hollow: { margin: 10, size: '30%', background: 'transparent' },
          track: { show: true, background: '#f2f2f2', strokeWidth: '10%', margin: 3 },
        },
      },
      labels: ["year_total", "month_total"],
      colors: ['#7366ff','#f73164'],
      legend: { show: true, markers: { width: 60, height: 12, radius: 3 } },
    },
  };

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <Row>
            <Col xs='9'><H5>{title}</H5></Col>
            <Col xs='3' className='text-end'><TrendingUp className='text-muted' /></Col>
          </Row>
        </CardHeader>
        <CardBody>
          <div className='chart-container'>
            <div id='circlechart'>
              <Chart options={radialChartLive.options} series={radialChartLive.series} height='350' type='radialBar' />
            </div>
          </div>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default SkillStatusChart;
