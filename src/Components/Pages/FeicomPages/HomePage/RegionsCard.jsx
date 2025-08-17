import React from "react";
import { Container, Row, Col, Card, CardHeader } from "reactstrap";
import { H5 } from '../../../../AbstractElements';

import RegionalPerformanceCard from "./RegionalPerformanceCard";

const RegionsCard = () => {
  const regionsData = [
    {
      id: "2",
      name: "Adamaoua — ARAD",
      totalProjects: 120,
      onTrackPercentage: 75,
      delayedPercentage: 15,
      averageCompletionRate: 68,
      provisionalAcceptances: 45,
      finalAcceptances: 30,
      totalBudget: 15000000000,
      totalDisbursed: 10000000000,
    },
    {
      id: "3",
      name: "Centre — ARCE",
      totalProjects: 85,
      onTrackPercentage: 60,
      delayedPercentage: 25,
      averageCompletionRate: 55,
      provisionalAcceptances: 20,
      finalAcceptances: 15,
      totalBudget: 9000000000,
      totalDisbursed: 5500000000,
    },
    {
      id: "4",
      name: "Est — ARES",
      totalProjects: 40,
      onTrackPercentage: 88,
      delayedPercentage: 5,
      averageCompletionRate: 80,
      provisionalAcceptances: 10,
      finalAcceptances: 8,
      totalBudget: 4000000000,
      totalDisbursed: 3800000000,
    },
    {
      id: "5",
      name: "Extrême-Nord — AREN",
      totalProjects: 65,
      onTrackPercentage: 50,
      delayedPercentage: 30,
      averageCompletionRate: 40,
      provisionalAcceptances: 15,
      finalAcceptances: 10,
      totalBudget: 7500000000,
      totalDisbursed: 3000000000,
    },
    {
      id: "6",
      name: "Littoral — ARLT",
      totalProjects: 90,
      onTrackPercentage: 70,
      delayedPercentage: 20,
      averageCompletionRate: 65,
      provisionalAcceptances: 35,
      finalAcceptances: 28,
      totalBudget: 10000000000,
      totalDisbursed: 7000000000,
    },
    {
      id: "7",
      name: "Nord — ARNO",
      totalProjects: 30,
      onTrackPercentage: 95,
      delayedPercentage: 3,
      averageCompletionRate: 90,
      provisionalAcceptances: 8,
      finalAcceptances: 7,
      totalBudget: 3500000000,
      totalDisbursed: 3200000000,
    },

    {
      id: "8",
      name: "Nord-Ouest — ARNW",
      totalProjects: 30,
      onTrackPercentage: 95,
      delayedPercentage: 3,
      averageCompletionRate: 90,
      provisionalAcceptances: 8,
      finalAcceptances: 7,
      totalBudget: 3500000000,
      totalDisbursed: 3200000000,
    },

    {
      id: "9",
      name: "Ouest — AROU",
      totalProjects: 30,
      onTrackPercentage: 95,
      delayedPercentage: 3,
      averageCompletionRate: 90,
      provisionalAcceptances: 8,
      finalAcceptances: 7,
      totalBudget: 3500000000,
      totalDisbursed: 3200000000,
    },

    {
      id: "10",
      name: "Sud — ARSU",
      totalProjects: 30,
      onTrackPercentage: 95,
      delayedPercentage: 3,
      averageCompletionRate: 90,
      provisionalAcceptances: 8,
      finalAcceptances: 7,
      totalBudget: 3500000000,
      totalDisbursed: 3200000000,
    },
     {
      id: "1",
      name: "Sud-Ouest — ARSW",
      totalProjects: 30,
      onTrackPercentage: 95,
      delayedPercentage: 3,
      averageCompletionRate: 90,
      provisionalAcceptances: 8,
      finalAcceptances: 7,
      totalBudget: 3500000000,
      totalDisbursed: 3200000000,
    },
  ];

  return (
    <Container fluid className="min-vh-100 bg-light py-4">
      <Card>
        <CardHeader>
          <H5>National Project Overview</H5>
        </CardHeader>
      </Card>

      <Row className="g-4 justify-content-center">
        {regionsData.map((region) => (
          <Col key={region.id} xs="12" md="6" lg="4">
            <RegionalPerformanceCard regionData={region} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RegionsCard;
