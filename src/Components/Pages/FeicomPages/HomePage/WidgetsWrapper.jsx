import React from "react";
import { Col, Row } from "reactstrap";
import {
  MyWidgetsData,
  MyWidgetsData2,
  MyWidgetsData3,

  Widgets2Data2a,
  Widgets2Data2b,
  Widgets2Data2c,
} from "../../../../Data/DefaultDashboard/";
import Widgets1 from "../../../Common/CommonWidgets/Widgets1";
import Widgets2 from "../../../Common/CommonWidgets/Widgets2";

const WidgetsWrapper = () => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <Row className="g-3">
            <Col xs={4}>
              <Widgets1 data={MyWidgetsData} />
            </Col>
            <Col xs={4}>
              <Widgets1 data={MyWidgetsData2} />
            </Col>
            <Col xs={4}>
              <Widgets1 data={MyWidgetsData3} />
            </Col>
          
            <Col xs={4}>
            <Widgets2 chartClass='profit-chart ' data={Widgets2Data2a} />
          </Col>
          <Col xs={4}>
            <Widgets2 chartClass='profit-chart ' data={Widgets2Data2b} />
          </Col>
          <Col xs={4}>
            <Widgets2 chartClass='profit-chart ' data={Widgets2Data2c} />
          </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default WidgetsWrapper;
