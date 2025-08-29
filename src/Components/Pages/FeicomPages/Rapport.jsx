import React, { useRef } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Badge,
  FormGroup,
  Input,
  Label
} from 'reactstrap';
// importing feicom logo
import logo from './logo.png';
//on vas imprimer DeepSeekHTML
import ReactToPrint  from 'react-to-print';
import dayjs from 'dayjs';

const DeepSeekHTML = (props) => {
  const componentRef = useRef();
  const { project } = props;

  console.log(project)

  const { visit } = props;

  console.log(visit)

  const printStyle = `
    @page {
      size: A4;
      margin: 10mm;
    }
    
    @media print {
      /* Force l'impression des arrière-plans et des couleurs */
      body {
        -webkit-print-color-adjust: exact;
      }
      .card-header {
        background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%) !important;
        color: white !important;
      }
      .bg-light {
        background-color: #f8f9fa !important;
      }
      .bg-info {
        background-color: #cff4fc !important;
      }
      .shadow-sm {
        box-shadow: 0 .125rem .25rem rgba(0,0,0,.075)!important;
      }
    }
  `;
  return (
    <>
      <div className="d-flex justify-content-end my-3">
        <ReactToPrint
          trigger={() => <button className="btn btn-primary">Print</button>} 
          content={() => componentRef.current}
          documentTitle="Rapport_Visite"
          pageStyle={printStyle}
          copyStyles={true}
        />
      </div>
      <div ref={componentRef}>
        <Container className="my-4 p-0" style={{ maxWidth: '960px' }}>
          <Card className="shadow-sm">
            {/* Header */}
            <CardHeader className="text-white" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}>
              <Row className="align-items-center">
                <Col>
                  <h1 className="h3 mb-1">FICHE DE VISITE DE {project.libelle}</h1>
                  <p className="mb-0 small">Structure : {project.commune.nom} | Date de la visite : {dayjs(visit.date).format('DD MMMM YYYY')} | Visite N°: {visit.id}</p>
                </Col>
                <Col xs="auto">
                  <div className="bg-white p-2 rounded">
                    <img 
                      src={logo} 
                      alt="FEICOM Logo" 
                      style={{ height: '60px' }}
                    />
                  </div>
                </Col>
              </Row>
            </CardHeader>

            {/* Location Info */}
            <div className="bg-light py-2">
              <Container>
                <Row className="text-center">
                  <Col>
                    <p className="fw-bold mb-1">RÉGION</p>
                    <p className="text-primary fw-medium mb-0">EST</p>
                  </Col>
                  <Col>
                    <p className="fw-bold mb-1">DÉPARTEMENT</p>
                    <p className="text-primary fw-medium mb-0">{project.commune.departement}</p>
                  </Col>
                  <Col>
                    <p className="fw-bold mb-1">COMMUNE</p>
                    <p className="text-primary fw-medium mb-0">{project.commune.nom}</p>
                  </Col>
                </Row>
              </Container>
            </div>

            <CardBody>
              {/* Section 1: Financial Info */}
              <Card className="mb-4">
                <CardHeader className="bg-light d-flex align-items-center">
                  <i className="fas fa-file-invoice-dollar text-primary me-2"></i>
                  <h5 className="mb-0">Informations sur le suivi financier des conventions (Engagement)</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <p className="fw-bold">Accord : <span className="fw-normal">COPIL</span></p>
                      <p className="fw-bold">Convention N° : <span className="fw-normal">  {project.numero_convention}</span></p>
                      <p className="fw-bold">Date d'octroi : <span className="fw-normal">30 juin. 21</span></p>
                    </Col>
                    <Col md={6}>
                      <p className="fw-bold">PCCM</p>
                      <p className="fw-bold">Date de signature : <span className="fw-normal">26 avr. 23</span></p>
                    </Col>
                  </Row>
                  
                  <div className="bg-info bg-opacity-10 p-3 rounded my-3">
                    <p className="fw-bold text-primary mb-1">Objet :</p>
                    <p className="mb-0">PROJET DE CONSTRUCTION DE SIX (06) LOGEMENTS DE TYPE T2 ET T3 DANS LA COMMUNE DE DIANG (PCCM)</p>
                  </div>
                  
                  <Row className="my-3">
                    <Col md={6}>
                      <p className="fw-bold">Montant : <span className="text-success fw-bold">{project.montant_ht} FCFA TTC</span></p>
                    </Col>
                    <Col md={6}>
                      <p className="fw-bold">Avenant : <span className="fw-normal">……</span></p>
                      <p className="fw-bold">Montant : <span className="fw-normal">Entrez Montant Avenant FCFA TTC</span></p>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={4}>
                      <p className="fw-bold">Nombre de lots : <span className="fw-normal">01</span></p>
                    </Col>
                    <Col md={4}>
                      <p className="fw-bold">Mise en Œuvre du financement : <span className="fw-normal">50%</span></p>
                    </Col>
                    <Col md={4}>
                      <p className="fw-bold">Durée de la Convention : <span className="fw-normal">{project.duree} Mois</span></p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              {/* Section 2: General Info */}
              <Card className="mb-4">
                <CardHeader className="bg-light d-flex align-items-center">
                  <i className="fas fa-info-circle text-primary me-2"></i>
                  <h5 className="mb-0">Informations générales sur le chantier visité</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    {/* Entreprise */}
                    <Col md={6}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-bold text-primary mb-0">Entreprise des Travaux :</h6>
                        <Badge color="success">Présente</Badge>
                      </div>
                      <div className="ps-3 border-start border-2 border-primary">
                        <p className="fw-bold mb-1">Contrat Nom : <span className="fw-normal">{project.entreprise.nom}</span></p>
                        <p className="fw-bold mb-1">Lot : <span className="fw-normal">Pas de Lot</span></p>
                        <p className="fw-bold mb-1">Siege Social : <span className="fw-normal">{project.entreprise.siege_social}</span></p>
                        <p className="fw-bold mb-1">Tel : <span className="fw-normal">{project.entreprise.contact}</span></p>
                        <p className="fw-bold mb-1">Montant : <span className="text-success">{project.montant_ht} FCFA TTC</span></p>
                        <p className="fw-bold mb-1">Os de Démarrage : <span className="fw-normal">3 juil. 23</span></p>
                        <p className="fw-bold mb-1">Délais : <span className="fw-normal">{project.duree} Mois</span></p>
                      </div>
                      
                      <div className="mt-3">
                        <h6 className="fw-bold mb-2">Documents Disponibles</h6>
                        <Row>
                          <Col>
                            <p>ANO au Contrat : <Badge color="danger">Non</Badge></p>
                            <p>Caution de BF : <Badge color="success">Oui</Badge></p>
                          </Col>
                          <Col>
                            <p>Assurance TRC : <Badge color="success">Oui</Badge></p>
                            <p>Projet d'exécution : <Badge color="danger">Non</Badge></p>
                          </Col>
                        </Row>
                      </div>
                      
                      <div className="mt-3">
                        <h6 className="fw-bold mb-2">Situation des travaux</h6>
                        <Row>
                          <Col>
                            <p>Avancement : <span className="fw-bold text-info">24,3%</span></p>
                            <p>Consommation des Délais : <span className="fw-bold text-warning">52,38%</span></p>
                          </Col>
                          <Col>
                            <p>Situation des Travaux : <span className="fw-normal">Travaux en Cours</span></p>
                            <p>Nature de la Visite : <span className="fw-normal">Mission de suivi</span></p>
                          </Col>
                        </Row>
                      </div>
                      
                      <div className="mt-3">
                        <h6 className="fw-bold mb-2">Situation des Payements</h6>
                        <Row>
                          <Col>
                            <p>Décompte : <Badge color="danger">Non</Badge></p>
                            <p>Montant : <span className="fw-normal">0 FCFA TTC</span></p>
                          </Col>
                          <Col>
                            <p>AV Demar : <Badge color="success">Oui</Badge></p>
                            <p>Avancement financier : <span className="fw-bold">0%</span></p>
                          </Col>
                        </Row>
                        <p className="mt-2 small fst-italic">Observations: Entrez vos observations sur situation des payements</p>
                      </div>
                    </Col>
                    
                    {/* Maîtrise d'Œuvre */}
                    <Col md={6}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-bold text-primary mb-0">Maîtrise d'Œuvre :</h6>
                        <Badge color="danger">Absente</Badge>
                      </div>
                      <div className="ps-3 border-start border-2 border-primary">
                        <p className="fw-bold mb-1">Contrat Nom : <span className="fw-normal">Entrez Nom de la Maîtrise d'œuvre ?</span></p>
                        <p className="fw-bold mb-1">Lot : <span className="fw-normal">Aucun</span></p>
                        <p className="fw-bold mb-1">BP : <span className="fw-normal"> </span></p>
                        <p className="fw-bold mb-1">Tel : <span className="fw-normal">Entrez N°Tél</span></p>
                        <p className="fw-bold mb-1">Montant : <span className="fw-normal">Montant du Contrat ? FCFA TTC</span></p>
                        <p className="fw-bold mb-1">Avenant : <span className="fw-normal">Entrée N°</span></p>
                      </div>
                      
                      <div className="mt-3">
                        <h6 className="fw-bold mb-2">Documents Disponibles</h6>
                        <Row>
                          <Col>
                            <p>ANO au Contrat : <Badge color="danger">Non</Badge></p>
                            <p>Caution de BF : <Badge color="danger">Non</Badge></p>
                          </Col>
                          <Col>
                            <p>Assurance TRC : <Badge color="danger">Non</Badge></p>
                            <p>Programme d'action : <Badge color="danger">Non</Badge></p>
                          </Col>
                        </Row>
                      </div>
                      
                      <div className="mt-3">
                        <h6 className="fw-bold mb-2">Situation du suivi</h6>
                        <Row>
                          <Col>
                            <p>Avancement : <span className="fw-normal">…… %</span></p>
                            <p>Consommation des Délais : <span className="fw-normal">…… %</span></p>
                          </Col>
                          <Col>
                            <p>Rapports de suivi : <span className="fw-normal">Aucune Transmission</span></p>
                            <p>Nature de la Visite : <span className="fw-normal">Entrez Nature visite</span></p>
                          </Col>
                        </Row>
                      </div>
                      
                      <div className="mt-3">
                        <h6 className="fw-bold mb-2">Situation des Payements</h6>
                        <Row>
                          <Col>
                            <p>Décompte : <Badge color="danger">Non</Badge></p>
                            <p>Montant : <span className="fw-normal">0 FCFA TTC</span></p>
                          </Col>
                          <Col>
                            <p>AV Demar : <Badge color="danger">Non</Badge></p>
                            <p>Avancement financier : <span className="fw-bold">0%</span></p>
                          </Col>
                        </Row>
                        <p className="mt-2 small fst-italic">Observations: Entrez vos observations sur situation des payements</p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              {/* Section 3: Site Activities */}
              <Card className="mb-4">
                <CardHeader className="bg-light d-flex align-items-center">
                  <i className="fas fa-hard-hat text-primary me-2"></i>
                  <h5 className="mb-0">Suivi des activités sur site</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <h6 className="fw-bold text-primary mb-2">Mise en Œuvre des dernières recommandations Observations et constats</h6>
                      <p className="text-justify">{visit.old_record}</p>
                    </Col>
                    <Col md={6}>
                      <h6 className="fw-bold text-primary mb-2">Recommandations</h6>
                      <p className="text-justify">{visit.recommandations}</p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              {/* Section 4: Project Images */}
              <Card className="mb-4">
                <CardHeader className="bg-light d-flex align-items-center">
                  <i className="fas fa-images text-primary me-2"></i>
                  <h5 className="mb-0">Images du Projet</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6} className="mb-3 text-center">
                      <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '192px' }}>
                        <span className="text-muted">Place de chantier</span>
                      </div>
                      <p className="mt-2 small">Place de chantier</p>
                    </Col>
                    <Col md={6} className="mb-3 text-center">
                      <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '192px' }}>
                        <span className="text-muted">Facade principale du bloc de T3</span>
                      </div>
                      <p className="mt-2 small">Facade principale du bloc de T3</p>
                    </Col>
                    <Col md={6} className="text-center">
                      <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '192px' }}>
                        <span className="text-muted">Bloc de T3</span>
                      </div>
                      <p className="mt-2 small">Bloc de T3</p>
                    </Col>
                    <Col md={6} className="text-center">
                      <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '192px' }}>
                        <span className="text-muted">Travaux de fondation</span>
                      </div>
                      <p className="mt-2 small">Travaux de fondation d'un bloc de T2</p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              {/* Section 5: Work Assessment */}
              <Card>
                <CardHeader className="bg-light d-flex align-items-center">
                  <i className="fas fa-clipboard-check text-primary me-2"></i>
                  <h5 className="mb-0">Appréciation des Travaux</h5>
                </CardHeader>
                <CardBody>
                  <Row className="justify-content-around mb-4">
                    <Col xs="auto">
                      <FormGroup check inline>
                        <Input type="radio" name="assessment" id="very-good" />
                        <Label check for="very-good">Très Bien</Label>
                      </FormGroup>
                    </Col>
                    <Col xs="auto">
                      <FormGroup check inline>
                        <Input type="radio" name="assessment" id="good" />
                        <Label check for="good">Bien</Label>
                      </FormGroup>
                    </Col>
                    <Col xs="auto">
                      <FormGroup check inline>
                        <Input type="radio" name="assessment" id="quite-good" />
                        <Label check for="quite-good">Assez Bien</Label>
                      </FormGroup>
                    </Col>
                    <Col xs="auto">
                      <FormGroup check inline>
                        <Input type="radio" name="assessment" id="passable" />
                        <Label check for="passable">Passable</Label>
                      </FormGroup>
                    </Col>
                    <Col xs="auto">
                      <FormGroup check inline>
                        <Input type="radio" name="assessment" id="mediocre" />
                        <Label check for="mediocre">Médiocre</Label>
                      </FormGroup>
                    </Col>
                    <Col xs="auto">
                      <FormGroup check inline>
                        <Input type="radio" name="assessment" id="bad" />
                        <Label check for="bad">Mauvais</Label>
                      </FormGroup>
                    </Col>
                  </Row>
                  
                  <Row className="align-items-end">
                    <Col md={6}>
                      <p>27-aOÛt-25</p>
                      <p className="mt-3">Visa</p>
                      <Row>
                        <Col>
                          <p>N ---</p>
                        </Col>
                        <Col>
                          <p>N+1 ---</p>
                        </Col>
                        <Col>
                          <p>N+2 ---</p>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6} className="text-md-end">
                      <p className="fw-bold mb-1">FONDS SPÉCIAL D'ÉQUIPEMENT ET D'INTERVENTION INTERCOMMUNALE</p>
                      <p className="fw-bold mb-1">SPECIAL COUNCIL SUPPORT FUND FOR MUTUAL ASSISTANCE</p>
                      <p className="small mb-1">B.P. / P.O.Box. : 718 Yaoundé, Cameroun. - FEICOM, 381, Rue 4565 MINBOMAN Yaoundé 4<sup>ème</sup></p>
                      <p className="small mb-1">Tél. (237) 222 23 51 64 - Fax. (237) 222 23 17 59</p>
                      <p className="small mb-1">Site web: www.feicom.cm / Email: feicom@feicom.cm</p>
                      <p className="small fw-bold mt-1">Certifié ISO 9001</p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </CardBody>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default DeepSeekHTML;