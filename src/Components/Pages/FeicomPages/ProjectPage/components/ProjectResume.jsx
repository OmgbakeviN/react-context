// ProjectResume.jsx
import React from "react";
import { Row, Col, Card, CardBody, UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody, Badge } from "reactstrap";

/**
 * Onglet "Résumé"
 * Props:
 *  - project: objet projet
 *  - infoCards: { convention, entreprise, moe, observations, recommandations } // (optionnel) si tu veux surcharger
 */
const ProjectResume = ({ project }) => {
  if (!project) return null;

  // Exemples de champs "démonstratifs" si ton backend ne fournit pas tout
  const convention = {
    numero: project?.numero_convention || "—",
    os: project?.start_meeting_date || "—",
    duree_mois: project?.duree ?? "—",
  };

  const entreprise = {
    nom: project?.entreprise?.nom || "—",
    telephone: project?.entreprise?.contact || "—",
    bp: project?.entreprise?.siege_social || "—",
  };

  const moe = {
    nom: "Maîtrise d’œuvre (exemple)", // adapte si tu as la donnée
    telephone: "—",
  };

  const documents = {
    ano: !!project?.contract_ano_date,
    trc: true,
    caution: !!project?.approving_body,
    projet_execution: true,
    programme_action: true,
  };

  const observations = project?.funding_purpose || "—";
  const recommandations = "—";

  return (
    <Row className="g-3">
      <Col md="6">
        <Card className="border-0" style={{ background: "#f8fafc" }}>
          <CardBody>
            <div className="text-uppercase small text-muted mb-2">Convention</div>
            <div className="fw-semibold">N° {convention.numero}</div>
            <div className="small">OS de démarrage : {convention.os}</div>
            <div className="small">Durée : {convention.duree_mois} mois</div>
          </CardBody>
        </Card>
      </Col>

      <Col md="6">
        <Card className="border-0" style={{ background: "#f8fafc" }}>
          <CardBody>
            <div className="text-uppercase small text-muted mb-2">Entreprise</div>
            <div className="fw-semibold">{entreprise.nom}</div>
            <div className="small">{entreprise.telephone}</div>
            <div className="small">{entreprise.bp}</div>
          </CardBody>
        </Card>
      </Col>

      <Col md="6">
        <Card className="border-0" style={{ background: "#f8fafc" }}>
          <CardBody>
            <div className="text-uppercase small text-muted mb-2">Maîtrise d’œuvre</div>
            <div className="fw-semibold">{moe.nom}</div>
            <div className="small">{moe.telephone}</div>
          </CardBody>
        </Card>
      </Col>

      <Col md="6">
        <UncontrolledAccordion stayOpen>
          <AccordionItem>
            <AccordionHeader targetId="docs">Documents disponibles</AccordionHeader>
            <AccordionBody accordionId="docs">
              {[
                ["ANO", documents.ano],
                ["TRC", documents.trc],
                ["Caution", documents.caution],
                ["Projet d’exécution", documents.projet_execution],
                ["Programme d’action", documents.programme_action],
              ].map(([label, ok]) => (
                <div className="d-flex justify-content-between align-items-center mb-2" key={label}>
                  <span>{label}</span>
                  <Badge color={ok ? "success" : "secondary"}>{ok ? "Oui" : "Non"}</Badge>
                </div>
              ))}
            </AccordionBody>
          </AccordionItem>
        </UncontrolledAccordion>
      </Col>

      <Col md="12">
        <Card className="border-0" style={{ background: "#fff7ed" }}>
          <CardBody>
            <div className="text-uppercase small text-muted mb-2">Observations</div>
            <div>{observations}</div>
          </CardBody>
        </Card>
      </Col>

      <Col md="12">
        <Card className="border-0" style={{ background: "#ecfeff" }}>
          <CardBody>
            <div className="text-uppercase small text-muted mb-2">Recommandations</div>
            <div>{recommandations}</div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ProjectResume;
