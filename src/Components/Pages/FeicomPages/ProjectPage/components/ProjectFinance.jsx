// ProjectFinance.jsx
import React from "react";
import { Row, Col, Card, CardBody, Table, Badge } from "reactstrap";

/**
 * Onglet "Financement"
 * Props:
 *  - project: objet projet
 *  - money: fn de formatage
 *  - lines: [] lignes financières si tu en as (sinon démo)
 */
const ProjectFinance = ({ project, money, lines = [] }) => {
  const montantTtc = Number(project?.montant_ht || 0);
  const totalPaye = 50000000; // à remplacer si tu as la vraie donnée
  const reste = montantTtc - totalPaye;

  const demoLines = lines.length
    ? lines
    : [
        { type: "Acompte démarrage", reference: "AV001", date: "2025-01-20", montant: 20000000, statut: "Payé" },
        { type: "Décompte 1", reference: "DC001", date: "2025-03-10", montant: 30000000, statut: "Payé" },
        { type: "Décompte 2", reference: "DC002", date: "2025-04-30", montant: 25000000, statut: "En traitement" },
      ];

  return (
    <Row className="g-3">
      <Col md="12">
        <Card className="border-0" style={{ background: "#f8fafc" }}>
          <CardBody className="d-flex flex-wrap gap-4">
            <div>
              <div className="text-muted small">Montant TTC</div>
              <div className="fs-4 fw-bold">{money(montantTtc)}</div>
            </div>
            <div>
              <div className="text-muted small">Total payé</div>
              <div className="fs-4 fw-bold">{money(totalPaye)}</div>
            </div>
            <div>
              <div className="text-muted small">Reste à payer</div>
              <div className="fs-4 fw-bold">{money(reste)}</div>
            </div>
          </CardBody>
        </Card>
      </Col>

      <Col md="12">
        <Card>
          <CardBody>
            <div className="fw-bold mb-2">Lignes financières</div>
            <Table responsive hover className="align-middle">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Réf.</th>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {demoLines.map((f, i) => (
                  <tr key={i}>
                    <td>{f.type}</td>
                    <td>{f.reference}</td>
                    <td>{f.date}</td>
                    <td>{money(f.montant)}</td>
                    <td>
                      <Badge color={String(f.statut).toLowerCase().includes("pay") ? "success" : "warning"}>
                        {f.statut}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ProjectFinance;
