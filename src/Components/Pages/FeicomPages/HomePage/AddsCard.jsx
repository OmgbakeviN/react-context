import React from "react";
import { Card, CardBody } from "reactstrap";
import {  H5 } from "../../../../AbstractElements";
import RadialProgressChart from "../../../Common/CommonWidgets/RadialProgressChart";

const AddsCard= ({ data }) => {
  return (
    <Card className="social-widget widget-hover">
      <CardBody>
        <div className="d-flex align-items-center justify-content-between"></div>
        <div className="social-content">
          <div>
            <H5 attrH5={{ className: "mb-1" }}>{data.total}</H5>
            <span className="f-light">{data.subTitle}</span>
          </div>
          
        </div>
      </CardBody>
    </Card>
  );
};

export default AddsCard;