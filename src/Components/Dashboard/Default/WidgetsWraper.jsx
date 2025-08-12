import React, { useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';
import {
  WidgetsData1 as WD1,
  WidgetsData2,
  WidgetsData3,
  WidgetsData4,
  WidgetsData5,
  WidgetsData6,
} from '../../../Data/DefaultDashboard';
import Widgets1 from '../../Common/CommonWidgets/Widgets1';
import axiosInstance from '../../../api/axios';

const WidgetsWrapper = () => {
  const [widgets1Data, setWidgets1Data] = useState(WD1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await axiosInstance.get('/feicom/agences/count/');
        if (!cancelled) {
          setWidgets1Data(prev => ({
            ...prev,
            total: res.data.total_agences,
          }));
        }
      } catch (e) {
        if (!cancelled) {
          console.error('Failed to load agences count:', e);
          setWidgets1Data(prev => ({
            ...prev,
            total: 0, // fallback
          }));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Col xxl='auto' xl='3' sm='6' className='box-col-6'>
        <Row>
          <Col xl='12'>
            <Widgets1 data={widgets1Data} loading={loading} />
          </Col>
          <Col xl='12'>
            <Widgets1 data={WidgetsData2} />
          </Col>
        </Row>
      </Col>
      <Col xxl='auto' xl='3' sm='6' className='box-col-6'>
        <Row>
          <Col xl='12'>
            <Widgets1 data={WidgetsData3} />
          </Col>
          <Col xl='12'>
            <Widgets1 data={WidgetsData4} />
          </Col>
        </Row>
      </Col>
      <Col xxl='auto' xl='12' sm='6' className='box-col-6'>
        <Row>
          <Col xxl='12' xl='6' className='box-col-12'>
            <Widgets1 data={WidgetsData5} />
          </Col>
          <Col xxl='12' xl='6' className='box-col-12'>
            <Widgets1 chartClass='profit-chart ' data={WidgetsData6} />
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default WidgetsWrapper;
