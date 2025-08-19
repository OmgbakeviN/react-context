import React, { Fragment } from "react";
import { Container, Row } from "reactstrap";
import { Breadcrumbs } from "../../../../AbstractElements";
import GreetingCard from "./GreetingCard";
// import OverallBalance from "../../../Dashboard/Default/OverallBalance";
// import RecentOrders from "../../../Dashboard/Default/RecentOrders";
// import ActivityCard from "../../../Dashboard/Default/ActivityCard";
// import RecentSales from "../../../Dashboard/Default/RecentSales";
// import TimelineCard from "../../../Dashboard/Default/TimelineCard";
// import PreAccountCard from "../../../Dashboard/Default/PreAccountCard";
// import TotalUserAndFollower from "../../../Dashboard/Default/TotalUserAndFollower";
// import PaperNote from "../../../Dashboard/Default/PaperNote";
import WidgetsWrapper from "./WidgetsWrapper";
import RegionsCard from "./RegionsCard";
import ProjectDetails from "./Test";




const Page1 = () => {
  return (
    <Fragment>
      <Breadcrumbs mainTitle="Dashboard" parent="Feicom" title="Dashboard" />
      <Container fluid={true}>
        <Row className="widget-grid">
          <GreetingCard />
          <WidgetsWrapper />
          <RegionsCard />
          {/* <OverallBalance />
          <RecentOrders />
          <ActivityCard />
          <RecentSales />
          <TimelineCard />
          <PreAccountCard />
          <TotalUserAndFollower/>
          <PaperNote /> */}
        </Row>
      </Container>
    </Fragment>
  );
};

export default Page1;
