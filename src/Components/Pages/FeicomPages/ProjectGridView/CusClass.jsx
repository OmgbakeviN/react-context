import React from "react";
import {
  Col,
  Row,
  Progress,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
} from "reactstrap";
import { useNavigate } from "react-router";
import { Btn,  } from "../../../../AbstractElements";

const CusClass = ({ item }) => {

  // console.log(item)
  const navigate = useNavigate();
  const project = {
    name: "Le pouvoir d'avancer de manière sûre",
    company: "Diallo De Oliveira SARL",
    type: "AONO",
    year: 2025,
    convention: "CONV-3650",
    montant: 9321722753.76,
    startDate: "2025-02-19",
    endDate: "2027-02-09",
    commune: "Ngaoui",
    completion: 65, // Example percentage
  };

  return (
    <>
      <Card className="shadow rounded-3 my-3">
        <CardBody>
          <CardTitle tag="h2" className="mb-3">
            <strong>{item.libelle}</strong>
          </CardTitle>
          <CardSubtitle className="mb-2 text-muted border-b-2 pb-2">
            Entreprise: {item.entreprise.nom}
          </CardSubtitle>

          <CardText>
            <Row className="details">
              <Col xs="6">
                <strong>Type:</strong> {item.type} <br />
              </Col>

              <Col className="text-end">
                <Btn
                  attrBtn={{
                    color: "info",
                    size: "sm",
                    className: "btn-sm py-1 px-2",
                    onClick: () =>
                      navigate(
                        `${process.env.PUBLIC_URL}/pages/FeicomPages/ProjectPage/SingleProject/${item.id}/detail`
                      ),
                  }}
                >
                  <i className="fa fa-eye" />
                </Btn>
              </Col>
            </Row>
            <strong>Commune:</strong> {item.commune.nom} <br />
            <strong>Année d'Exercice:</strong> {item.exercice.annee} <br />
            <strong>No Convention:</strong> {item.numero_convention} <br />
            <strong>Montant HT:</strong>{" "}
            <span className={"font-success fw-bold"}>
              {item.montant_ht.toLocaleString("fr-FR", {
                style: "currency",
                currency: "XAF",
              })}{" "}
              --{" "}
              {project.montant.toLocaleString("fr-FR", {
                style: "currency",
                currency: "XAF",
              })}{" "}
            </span>
            <br />
            <strong>Date de Début:</strong>{" "}
            {new Date(item.date_debut).toLocaleDateString("fr-FR")} <br />
            <strong>Date de Fin:</strong>{" "}
            {new Date(item.date_fin).toLocaleDateString("fr-FR")} <br />
            <Row className="details" style={{ marginBottom: "15px" }}>
              <Col
                xs="6"
                dstyle={{ padding: "5px" }}
                className={
                  item.badge === "Done" ? "font-success" : "font-primary"
                }
              >
                <strong>Completion Rate :</strong>{" "}
              </Col>
              <Col>
                <Progress
                  value={project.completion}
                  color={project.completion < 50 ? "warning" : "success"}
                  className="mt-2"
                >
                  {project.completion}%
                </Progress>
              </Col>
            </Row>
          </CardText>
        </CardBody>
      </Card>
    </>
  );
};

export default CusClass;
