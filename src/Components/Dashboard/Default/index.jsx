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
import Depart_data from "./department_data_table/index"
import Agent_data from "./agency_data_table/index"
import Commune_data from "./commune_data_table/index"
import Enterprice_data from "./enterprise_data_table/index"
import Lots_data from "./lots_data_table/index"
import Exercise_data from "./exercise_data_table/index"
import Project_data from "./project_data_table/index"
import Todos_data from "./todo_data_table/index"
import Visit_data from "./visit_data_table/index"

const Dashboard = () => {
  return (
    <Fragment>
      <Breadcrumbs mainTitle="Default" parent="Dashboard" title="Default" />
      <Container fluid={true}>
        <Row className="widget-grid">
          <AllowedAccess roles={['REGIONAL']}>
            <GreetingCard />
          </AllowedAccess>
          <Depart_data />
          <Agent_data />
          <Commune_data />
          <Enterprice_data />
          <Lots_data />
          <Exercise_data />
          <Project_data />
          <Todos_data />
          <Visit_data />
          <WidgetsWrapper />
          <OverallBalance />
          <RecentOrders />
          <ActivityCard />
          <RecentSales />
          <TimelineCard />
          <PreAccountCard />
          <TotalUserAndFollower />
          <PaperNote />
        </Row>
      </Container>
    </Fragment>
  );
};

export default Dashboard;
