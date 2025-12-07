import React, { Fragment } from "react";
import { useMemo } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
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
// notre graphique
import Example from "./component/graph_paiement";
// widjet
import Widgets1 from "../../../Common/CommonWidgets/Widgets1";
// radial chart
import RadialChart from "./component/Radial_chart";


const Page1 = () => {
  const w_final = useMemo(
    () => ({
      color: "success",
      icon: "check",
      title: "Réceptions définitives",
      total: "19%",
      gros: null,
    }),
  );

  const data = [
    { name: 'Pourcentage paiement', value: 75, color: '#4CAF50' }
  ];
  return (
    <Fragment>
      <Breadcrumbs mainTitle="Dashboard" parent="Feicom" title="Dashboard" />
      <Container fluid={true}>
        <Row className="widget-grid">
          {/* <GreetingCard /> */}
          <WidgetsWrapper />
          {/* <RegionsCard /> */}
          {/* <ProjectDetails /> */}
          {/* <OverallBalance />
          <RecentOrders />
          <ActivityCard />
          <RecentSales />
          <TimelineCard />
          <PreAccountCard />
          <TotalUserAndFollower/>
          <PaperNote /> */}
        </Row>
        <Row>
          <Col md={12} lg={6}>
            <Example />
          </Col>
          <Col md={12} lg={6}>
            <Row>
              <Card>
                <CardBody>
                  <RadialChart
                    data={data}
                    title="Progression des paiements"
                    unit="%"
                    innerRadius={40}
                    outerRadius={80}
                  />
                </CardBody>
              </Card>
            </Row>
            <Row>
              <Widgets1 data={w_final} />
            </Row>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Page1;
