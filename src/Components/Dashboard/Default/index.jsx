import React, { Fragment } from "react";
import { Container, Row } from "reactstrap";
import { Breadcrumbs } from "../../../AbstractElements";
import { AllowedAccess } from 'react-permission-role'; 

import OverallBalance from "./OverallBalance";
import GreetingCard from "./GreetingCard";
import WidgetsWrapper from "./WidgetsWraper";
import RecentOrders from "./RecentOrders";
import ActivityCard from "./ActivityCard";
import RecentSales from "./RecentSales";
import TimelineCard from "./TimelineCard";
import PreAccountCard from "./PreAccountCard";
import TotalUserAndFollower from "./TotalUserAndFollower";
import PaperNote from "./PaperNote";
import ProjectDash from "./project_data_dashboard/index";
import AgencyDash from "./agency_data_dash/index";

const Dashboard = () => {
  return (
    <Fragment>
      <Breadcrumbs mainTitle="Default" parent="Dashboard" title="Default" />
      <Container fluid={true}>
        <Row className="widget-grid">
          <AllowedAccess roles={['NATIONAL']}>
            <GreetingCard />
          </AllowedAccess>
          <WidgetsWrapper />
          <ProjectDash />
          <WidgetsWrapper />
          <AgencyDash />
          {/* <OverallBalance />
          <RecentOrders />
          <ActivityCard />
          <RecentSales />
          <TimelineCard />
          <PreAccountCard />
          <TotalUserAndFollower />
          <PaperNote /> */}
        </Row>
      </Container>
    </Fragment>
  );
};

export default Dashboard;
