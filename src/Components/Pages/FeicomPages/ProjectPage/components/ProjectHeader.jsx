// ProjectHeader.jsx
import React from "react";
import { Card, CardBody, CardHeader, Row, Col, Badge, Progress, Button } from "reactstrap";

/**
 * En-tête projet (titre, localisation) + 4 mini-KPIs
 * Props:
 *  - project: objet projet (ex: { libelle, status, progress, payment_percent, montant_ht, ... })
 *  - money: fn de formatage monétaire
 */
const ProjectHeader = ({ project, money,rightActions }) => {
  if (!project) return null;

  return (
    <Card className="shadow-sm">
      <CardBody className="py-4">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h2 className="mb-1">{project.libelle}</h2>
            <div className="text-muted">
              {project?.commune?.departement?.agence?.nom} •{" "}
              {project?.commune?.departement?.nom} •{" "}
              {project?.commune?.nom}
            </div>
          </div>
          
          <div className="d-flex align-items-center gap-2">
            <Badge color="primary" pill className="px-3 py-2">{project?.status}</Badge>
            {rightActions || null}
            <Button color="secondary" size="sm" onClick={() => window.history.back()}>
              ← Retour
            </Button>
          </div>
        </div>

        {/* 4 mini-KPIs */}
        <Row className="g-3 mt-3">
          <Col md="6" lg="6">
            <Card className="border-0" style={{ background: "#f1f5f9" }}>
              <CardBody>
                <div className="fw-bold mb-1">Montant TTC</div>
                <div className="fs-4">{money(project?.montant_ht)}</div>
              </CardBody>
            </Card>
          </Col>

          <Col md="6" lg="6">
            <Card className="border-0" style={{ background: "#f8fafc" }}>
              <CardBody>
                <div className="fw-bold mb-2">Avancement physique</div>
                <Progress style={{ height: 14 }} value={project?.progress || 0}>
                  {(project?.progress || 0)}%
                </Progress>
              </CardBody>
            </Card>
          </Col>

          <Col md="6" lg="6">
            <Card className="border-0" style={{ background: "#fff7ed" }}>
              <CardBody>
                <div className="fw-bold mb-2">Délais consommés</div>
                <Progress color="warning" style={{ height: 14 }} value={project?.time_consumed_percent || 0}>
                  {(project?.time_consumed_percent || 0)}%
                </Progress>
              </CardBody>
            </Card>
          </Col>

          <Col md="6" lg="6">
            <Card className="border-0" style={{ background: "#ecfeff" }}>
              <CardBody>
                <div className="fw-bold mb-2">Avancement financier</div>
                <Progress color="info" style={{ height: 14 }} value={project?.payment_percent || 0}>
                  {(project?.payment_percent || 0)}%
                </Progress>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default ProjectHeader;
