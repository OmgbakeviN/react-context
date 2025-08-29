import React, { Fragment, useState, useEffect } from "react";
import { Breadcrumbs, Btn } from "../../../../AbstractElements";
import { useParams } from 'react-router-dom'; 
import axiosInstance from "../../../../api/axios";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  CardBody,
  Badge,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
  Progress,
  Button,
  ListGroup,
  ListGroupItem,
  UncontrolledAccordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  Input,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import HeaderCard from "../../../Common/Component/HeaderCard";
import DataTableComponent from "../../../Tables/DataTable/DataTableComponent";
import CommonModal from "../../../UiKits/Modals/common/modal";
import ProjectVisitForm from "./ProjectVisitForm";
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import Rapport from '../Rapport';

//on vas importer un modal de reactstrap
import { Modal, ModalHeader, ModalBody } from "react-bootstrap";

dayjs.locale('fr');
dayjs.extend(localizedFormat);

const SingleProject = () => {
  
  //on definit usenavigate
  const navigate = useNavigate();

  // on recupere le project id
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [visites, setVisites] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  // on charge les project detail avec useeffect
  useEffect(() =>{
    let cancelled = false;

    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/feicom/api/projets/${id}/`);
        if (!cancelled) setProject(response.data);
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.detail || "Une erreur est survenue lors du chargement du projet.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (id) fetchProject();
    return () => { cancelled = true; };
  }, [id]);


  console.log(project)

  // // on charge les visites d'un projet
  // useEffect(() =>{
  //   const fetchVisites = async () => {
  //     setLoading(true);
  //     setError(null);

  //     try {
  //       const response = await axiosInstance.get(`/feicom/api/visites/${id}/`); // on recupere le visit id
  //       setVisites(response.data);
  //       } catch (err) {
  //         setError(err.response?.data?.detail || "Une erreur est survenue lors du chargement du projet.")
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  
  //   if (id){
  //     fetchVisites();
  //   }
  // }, [id]);

  // console.log(visites)
  
  const [active, setActive] = useState("visites"); // onglet par défaut plus “vivant”

  // Manege the modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [modal2Open, setModal2Open] = useState(false);

  const handleAddModal = () => {
    setModalTitle(<div className="fw-semibold text-wrap"> Fiche de Visite – PCCM / FEICOM    </div>);
    setModalContent(<div> Test</div>);
    setModalOpen(true);
  };

  const handlevisitesModal = () => {
    setModalTitle(<div className="fw-semibold text-wrap"> Visite – PCCM / FEICOM    </div>);
    setModalContent(<div> Test</div>);
    setModal2Open(true);
  };

  //lets keep the informations of the visit column
  const [visit, setVisit] = useState(null);

  // on definit les colones de notre datatable
  const columns = [
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
      cell: (row) => dayjs(row.date).format('dddd, DD MMMM YYYY'),
    },
    { // entreprise_present is boolean it is either true or false
      name: "entreprise present",
      selector: (row) => row.enterprise_present,
      sortable: true,
      cell: row => {
        // conditional rendering base on bollean value
        return row.enterprise_present ? (
          <Badge color="success">Present</Badge>
        ) : (
          <Badge color="danger">Absent</Badge>
        )
      }
    }, 
    { // moe_present is boolean it is either true or false
      name: "Moe_present",
      selector: (row) => row.moe_present,
      sortable: true,
      cell: row => {
        // conditional rendering base on bollean value
        return row.moe_present ? (
          <Badge color="success">Present</Badge>
        ) : (
          <Badge color="danger">Absent</Badge>
        )
      }
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="d-flex gap-1">
          <Btn
          attrBtn={{
            color: 'info',
            size: 'sm',
            className: 'btn-sm py-1 px-2',
            onClick: () => {
              handlevisitesModal();
              setVisit(row);
            }
          }}
          >
            <i className="fa fa-eye" />
          </Btn>
        </div>
      ),
      width: '150px',
      ignoreRowClick: true,
      button: true,
    },  
  ];

  // // on appelle le project id avec axios nstance
  // const fetchProject = async () => {
  //   try {
  //     const res = await axiosInstance.get(`/feicom/api/projets/${id}/`); // on recupere le project id
  //     return res.data;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // ----- Données fictives (statique) -----
  const p = {
    id: 1,
    titre: "project.libelle",
    region: "Centre",
    departement: "Mfoundi",
    commune: "Yaoundé I",
    montant_ttc: 120000000,
    avancement_physique: 60,
    delais_consommes: 45,
    avancement_financier: 50,
    statut: "En cours",
    updated_at: "2025-03-20 14:12",
    convention: { numero: "CV-2025-001", os: "2025-01-15", duree_mois: 12 },
    entreprise: {
      nom: "Entreprise XYZ",
      telephone: "699 00 11 22",
      bp: "BP 12345",
    },
    moe: { nom: "Bureau MOE Alpha", telephone: "677 33 44 55" },
    observations: "Travaux en bonne progression. Approvisionnement régulier.",
    recommandations:
      "Accélérer la livraison des matériaux pour tenir le jalon T3.",
    financements: [
      {
        type: "Acompte démarrage",
        reference: "AV001",
        date: "2025-01-20",
        montant: 20000000,
        statut: "Payé",
      },
      {
        type: "Décompte 1",
        reference: "DC001",
        date: "2025-03-10",
        montant: 30000000,
        statut: "Payé",
      },
      {
        type: "Décompte 2",
        reference: "DC002",
        date: "2025-04-30",
        montant: 25000000,
        statut: "En traitement",
      },
    ],
    visites: [
      {
        date: "2025-02-01",
        presence_entreprise: true,
        presence_moe: true,
        avancement: 30,
        delais: 25,
        note: "Implantations OK.",
      },
      {
        date: "2025-03-05",
        presence_entreprise: true,
        presence_moe: false,
        avancement: 60,
        delais: 45,
        note: "Élévation murs niveau 1.",
      },
    ],
    fichiers: [
      { nom: "Plan d’exécution.pdf", url: "#" },
      { nom: "Rapport visite chantier.docx", url: "#" },
      { nom: "Programme d’action.xlsx", url: "#" },
    ],
    documents: {
      ano: true,
      trc: true,
      caution: false,
      projet_execution: true,
      programme_action: true,
    },
  };

  const money = (n) =>
    (n ?? 0).toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " FCFA";

  if(!project) {
    return <p>Chargement ...</p>
  }

  return (
    <Fragment>
      <Breadcrumbs mainTitle="FEICOM" parent="FEICOM" title="Project id" />
      <Container fluid={true}>
        <Row>
          <Col className="widget-grid">
            {/* Bandeau titre + actions rapides */}
            <Row className="g-3">
              <Col lg="9" xl="9">
                <Card className="shadow-sm">
                  <CardBody className="py-4">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                      <div>
                        <h2 className="mb-1">{project.libelle}</h2>
                        <div className="text-muted">
                          {project.commune.departement.agence.nom} • {project.commune.departement.nom} • {project.commune.nom}
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Badge color="primary" pill className="px-3 py-2">
                          {project.status}
                        </Badge>
                        <Button
                          color="secondary"
                          size="sm"
                          onClick={() => window.history.back()}
                        >
                          ← Retour
                        </Button>
                      </div>
                    </div>

                    {/* KPIs en cards fines */}
                    <Row className="g-3 mt-3">
                      <Col md="6" lg="6">
                        <Card
                          className="border-0"
                          style={{ background: "#f1f5f9" }}
                        >
                          <CardBody>
                            <div className="fw-bold mb-1">Montant TTC</div>
                            <div className="fs-4">{money(project.montant_ht)}</div>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col md="6" lg="6">
                        <Card
                          className="border-0"
                          style={{ background: "#f8fafc" }}
                        >
                          <CardBody>
                            <div className="fw-bold mb-2">
                              Avancement physique
                            </div>
                            <Progress
                              style={{ height: 14 }}
                              value={p.avancement_physique}
                            >
                              {p.avancement_physique}%
                            </Progress>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col md="6" lg="6">
                        <Card
                          className="border-0"
                          style={{ background: "#fff7ed" }}
                        >
                          <CardBody>
                            <div className="fw-bold mb-2">Délais consommés</div>
                            <Progress
                              color="warning"
                              style={{ height: 14 }}
                              value={project.pourcentage_consomme}
                            >
                              {project.pourcentage_consomme}%
                            </Progress>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col md="6" lg="6">
                        <Card
                          className="border-0"
                          style={{ background: "#ecfeff" }}
                        >
                          <CardBody>
                            <div className="fw-bold mb-2">
                              Avancement financier
                            </div>
                            <Progress
                              color="info"
                              style={{ height: 14 }}
                              value={p.avancement_financier}
                            >
                              {p.avancement_financier}%
                            </Progress>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>

                {/* Bloc Tabs dans une large card */}
                <Card className="shadow-sm mt-3">
                  <CardHeader className="bg-white">
                    <Nav tabs pills>
                      <NavItem>
                        <NavLink
                          className={active === "resume" ? "active" : ""}
                          onClick={() => setActive("resume")}
                        >
                          Résumé
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={active === "financement" ? "active" : ""}
                          onClick={() => setActive("financement")}
                        >
                          Financement
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={active === "visites" ? "active" : ""}
                          onClick={() => setActive("visites")}
                        >
                          Visites
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={active === "fichiers" ? "active" : ""}
                          onClick={() => setActive("fichiers")}
                        >
                          Pièces jointes
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </CardHeader>
                  <CardBody>
                    <TabContent activeTab={active}>
                      {/* ----- RESUME ----- */}
                      <TabPane tabId="resume">
                        <Row className="g-3">
                          <Col md="6">
                            <Card
                              className="border-0"
                              style={{ background: "#f8fafc" }}
                            >
                              <CardBody>
                                <div className="text-uppercase small text-muted mb-2">
                                  Convention
                                </div>
                                <div className="fw-semibold">
                                  N° {p.convention.numero}
                                </div>
                                <div className="small">
                                  OS de démarrage : {p.convention.os}
                                </div>
                                <div className="small">
                                  Durée : {p.convention.duree_mois} mois
                                </div>
                              </CardBody>
                            </Card>
                          </Col>
                          <Col md="6">
                            <Card
                              className="border-0"
                              style={{ background: "#f8fafc" }}
                            >
                              <CardBody>
                                <div className="text-uppercase small text-muted mb-2">
                                  Entreprise
                                </div>
                                <div className="fw-semibold">
                                  {p.entreprise.nom}
                                </div>
                                <div className="small">
                                  {p.entreprise.telephone}
                                </div>
                                <div className="small">{p.entreprise.bp}</div>
                              </CardBody>
                            </Card>
                          </Col>
                          <Col md="6">
                            <Card
                              className="border-0"
                              style={{ background: "#f8fafc" }}
                            >
                              <CardBody>
                                <div className="text-uppercase small text-muted mb-2">
                                  Maîtrise d’œuvre
                                </div>
                                <div className="fw-semibold">{p.moe.nom}</div>
                                <div className="small">{p.moe.telephone}</div>
                              </CardBody>
                            </Card>
                          </Col>
                          <Col md="6">
                            <UncontrolledAccordion stayOpen>
                              <AccordionItem>
                                <AccordionHeader targetId="docs">
                                  Documents disponibles
                                </AccordionHeader>
                                <AccordionBody accordionId="docs">
                                  <ListGroup flush>
                                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                                      ANO{" "}
                                      <Badge
                                        color={
                                          p.documents.ano
                                            ? "success"
                                            : "secondary"
                                        }
                                      >
                                        {p.documents.ano ? "Oui" : "Non"}
                                      </Badge>
                                    </ListGroupItem>
                                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                                      TRC{" "}
                                      <Badge
                                        color={
                                          p.documents.trc
                                            ? "success"
                                            : "secondary"
                                        }
                                      >
                                        {p.documents.trc ? "Oui" : "Non"}
                                      </Badge>
                                    </ListGroupItem>
                                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                                      Caution{" "}
                                      <Badge
                                        color={
                                          p.documents.caution
                                            ? "success"
                                            : "secondary"
                                        }
                                      >
                                        {p.documents.caution ? "Oui" : "Non"}
                                      </Badge>
                                    </ListGroupItem>
                                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                                      Projet d’exécution{" "}
                                      <Badge
                                        color={
                                          p.documents.projet_execution
                                            ? "success"
                                            : "secondary"
                                        }
                                      >
                                        {p.documents.projet_execution
                                          ? "Oui"
                                          : "Non"}
                                      </Badge>
                                    </ListGroupItem>
                                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                                      Programme d’action{" "}
                                      <Badge
                                        color={
                                          p.documents.programme_action
                                            ? "success"
                                            : "secondary"
                                        }
                                      >
                                        {p.documents.programme_action
                                          ? "Oui"
                                          : "Non"}
                                      </Badge>
                                    </ListGroupItem>
                                  </ListGroup>
                                </AccordionBody>
                              </AccordionItem>
                            </UncontrolledAccordion>
                          </Col>

                          <Col md="12">
                            <Card
                              className="border-0"
                              style={{ background: "#fff7ed" }}
                            >
                              <CardBody>
                                <div className="text-uppercase small text-muted mb-2">
                                  Observations
                                </div>
                                <div>{p.observations}</div>
                              </CardBody>
                            </Card>
                          </Col>
                          <Col md="12">
                            <Card
                              className="border-0"
                              style={{ background: "#ecfeff" }}
                            >
                              <CardBody>
                                <div className="text-uppercase small text-muted mb-2">
                                  Recommandations
                                </div>
                                <div>{p.recommandations}</div>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                      </TabPane>

                      {/* ----- FINANCEMENT ----- */}
                      <TabPane tabId="financement">
                        <Row className="g-3">
                          <Col md="12">
                            <Card
                              className="border-0"
                              style={{ background: "#f8fafc" }}
                            >
                              <CardBody className="d-flex flex-wrap gap-4">
                                <div>
                                  <div className="text-muted small">
                                    Montant TTC
                                  </div>
                                  <div className="fs-4 fw-bold">
                                    {money(p.montant_ttc)}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-muted small">
                                    Total payé
                                  </div>
                                  <div className="fs-4 fw-bold">
                                    {money(50000000)}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-muted small">
                                    Reste à payer
                                  </div>
                                  <div className="fs-4 fw-bold">
                                    {money(p.montant_ttc - 50000000)}
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          </Col>
                          <Col md="12">
                            <Card>
                              <CardBody>
                                <div className="fw-bold mb-2">
                                  Lignes financières
                                </div>
                                <Table
                                  responsive
                                  hover
                                  className="align-middle"
                                >
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
                                    {p.financements.map((f, i) => (
                                      <tr key={i}>
                                        <td>{f.type}</td>
                                        <td>{f.reference}</td>
                                        <td>{f.date}</td>
                                        <td>{money(f.montant)}</td>
                                        <td>
                                          <Badge
                                            color={
                                              String(f.statut)
                                                .toLowerCase()
                                                .includes("pay")
                                                ? "success"
                                                : "warning"
                                            }
                                          >
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
                      </TabPane>

                      {/* ----- VISITES ----- */}
                      <TabPane tabId="visites">
                        <Row className="g-3">
                          <Col className="text-end">
                            <Btn
                              attrBtn={{
                                color: "primary",
                                onClick: handleAddModal,
                              }}
                            >
                              Add Project Visit
                            </Btn>
                          </Col>
                          <Col lg="12">
                            <Card>
                              <CardBody>
                                <div className="fw-bold mb-2">
                                  Visit history
                                </div>
                                {/* <Table
                                  responsive
                                  hover
                                  className="align-middle"
                                >
                                  <thead>
                                    <tr>
                                      <th>Date</th>
                                      <th>Présence</th>
                                      <th>Avancement</th>
                                      <th>Délais</th>
                                      <th>Note</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {project.visites.map((v, i) => (
                                      <tr key={i}>
                                        <td>{v.date}</td>
                                        <td>
                                          {v.presence_entreprise && (
                                            <Badge
                                              color="success"
                                              className="me-1"
                                            >
                                              Entreprise
                                            </Badge>
                                          )}
                                          {v.presence_moe && (
                                            <Badge color="info">MOE</Badge>
                                          )}
                                        </td>
                                        <td>{v.avancement}%</td>
                                        <td>{v.delais}%</td>
                                        <td className="text-muted">{v.note}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table> */}

                                {/* on affiche les visites avec react data table */}
                                <DataTable
                                  columns={columns}
                                  data={project.visites}
                                  striped
                                  center
                                  pagination
                                  progressPending={loading}
                                  noDataComponent="NAN"
                                /> 
                                
                              </CardBody>
                            </Card>
                            {/* <Container fluid={true}>
                              <Row>
                                <Col sm="12">
                                  <Card>
                                    <HeaderCard title="Select Multiple and Delete Single Data" />
                                    <CardBody>
                                      <DataTableComponent />
                                    </CardBody>
                                  </Card>
                                </Col>
                              </Row>
                            </Container> */}
                          </Col>
                        </Row>
                      </TabPane>

                      {/* ----- FICHIERS ----- */}
                      <TabPane tabId="fichiers">
                        <Row className="g-3">
                          <Col md="12">
                            <Card>
                              <CardBody>
                                <div className="fw-bold mb-3">
                                  Pièces jointes
                                </div>
                                <ListGroup>
                                  {p.fichiers.map((f, i) => (
                                    <ListGroupItem
                                      key={i}
                                      className="d-flex justify-content-between align-items-center"
                                    >
                                      <span className="text-truncate">
                                        {f.nom}
                                      </span>
                                      <Button color="primary" size="sm" outline>
                                        Ouvrir
                                      </Button>
                                    </ListGroupItem>
                                  ))}
                                </ListGroup>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </Col>

              {/* Colonne droite “Infos + Stats rapides” */}
              <Col lg="3" xl="3">
                <Row className="g-3">
                  <Col md="12">
                    <Card className="shadow-sm h-100">
                      <CardHeader className="bg-white">Informations</CardHeader>
                      <CardBody>
                        <div className="d-flex justify-content-between">
                          <span>Région</span>
                          <span className="fw-semibold">{p.region}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Département</span>
                          <span className="fw-semibold">{p.departement}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Commune</span>
                          <span className="fw-semibold">{p.commune}</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                          <span>Montant TTC</span>
                          <span className="fw-semibold">
                            {money(p.montant_ttc)}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Décaissements</span>
                          <span className="fw-semibold">{money(50000000)}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Reste à payer</span>
                          <span className="fw-semibold">
                            {money(p.montant_ttc - 50000000)}
                          </span>
                        </div>
                        <hr />
                        <div className="small text-muted">
                          Dernière mise à jour
                        </div>
                        <div>{p.updated_at}</div>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col md="12">
                    <Card className="shadow-sm">
                      <CardHeader className="bg-white">
                        Jalons à venir
                      </CardHeader>
                      <CardBody>
                        <ListGroup flush>
                          <ListGroupItem className="d-flex justify-content-between align-items-center">
                            Livraison lot 1 <Badge color="secondary">T3</Badge>
                          </ListGroupItem>
                          <ListGroupItem className="d-flex justify-content-between align-items-center">
                            Réception provisoire{" "}
                            <Badge color="secondary">T4</Badge>
                          </ListGroupItem>
                          <ListGroupItem className="d-flex justify-content-between align-items-center">
                            Réception définitive{" "}
                            <Badge color="secondary">+12 mois</Badge>
                          </ListGroupItem>
                        </ListGroup>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col md="12">
                    <Card className="shadow-sm">
                      <CardHeader className="bg-white">
                        Risques & alertes
                      </CardHeader>
                      <CardBody>
                        <ListGroup flush>
                          <ListGroupItem className="d-flex justify-content-between align-items-center">
                            Retard matériaux{" "}
                            <Badge color="warning">Modéré</Badge>
                          </ListGroupItem>
                          <ListGroupItem className="d-flex justify-content-between align-items-center">
                            Intempéries <Badge color="success">Faible</Badge>
                          </ListGroupItem>
                          <ListGroupItem className="d-flex justify-content-between align-items-center">
                            Variation prix <Badge color="danger">Élevé</Badge>
                          </ListGroupItem>
                        </ListGroup>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <CommonModal isOpen={modalOpen} title={modalTitle} toggler={() => setModalOpen(false)} size="lg">
        <ProjectVisitForm onSubmit={(data) => console.log(data)} />
      </CommonModal>
      <CommonModal isOpen={modal2Open} title={modalTitle} toggler={() => setModal2Open(false)} size="lg">
        {/* on passe project et aussi la visite en props */}
        <Rapport project={project} visit={visit} />
      </CommonModal>
    </Fragment>
  );
};

export default SingleProject;
