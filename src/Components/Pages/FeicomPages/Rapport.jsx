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
import style from './style.css';

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
            <div className="row">
            <header>
              <div style={{ color: "white" }} className="logo">FEICOM</div>
              <h1 style={{ alignItems: "center" }}>FICHE DE VISITE DE CHANTIER</h1>
              <div className="header-info">
                <p>Code FI-FPS-02</p>
                <p>Version: 1</p>
                <p>Date: 05/10/2020</p>
                <p>Page: 1/3</p>
              </div>
            </header>

            <div className="general-details">
              <div className="location-general">
                <p>Structure: ARES</p>
                <p>Date de la visite: 19 oct. 23</p>
                <p>Dernière visite: 23 août. 23</p>
                <p>Visite N°: 02</p>
              </div>

              <div className="location-details">
                <p>REGION: EST</p>
                <p>DEPARTEMENT: LOM-ET-DJEREM</p>
                <p>COMMUNE: DIANG</p>
              </div>
            </div>

            <h4 style={{ color: "#0077b6", alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
              OBJECT: PROJET DE CONSTRUCTION DE SIX (06) LOGEMENTS DE TYPE T2 ET T3 DANS LA COMMUNE DE DIANG (PCCM)
            </h4>

            <section className="section-title">
              <h3>1) Informations sur le suivi financier des conventions (Engagement)</h3>
            </section>

            <div className="table-section">
              <div className="row">
                <p>Accord: COPIL</p>
                <p>Convention: Oui N° 049/PCCM/FEICOM/DG/CAJ/DCC/2023</p>
                <p>Date d'octroi: 30 juin. 21</p>
              </div>
              <div className="row">
                <p>PCCM</p>
                <p>Date de signature: 26 avr. 23</p>
              </div>
              <div className="row">
                <p>Montant: 108 420 000 FCFA TTC</p>
                <p>Avenant: Montant: Entrez Montant Avenant FCFA TTC</p>
              </div>
              <div className="row">
                <p>Nombre de lots: 01 Mise en œuvre du financement: %</p>
                <p>Durée de la Convention: An(s)</p>
              </div>
            </div>

            <section className="section-title">
              <h3>2) Informations générales sur le chantier visité</h3>
            </section>

            <div className="two-column-layout">
              <div className="column">
                <h4>Entreprise des Travaux : Présente</h4>
                <div className="sub-section">
                  <h5>Contrat</h5>
                  <p>Nom: TROPICAL FOREST MANAGEMENT SARL</p>
                  <p>Lot: Pas de Lot</p>
                  <p>BP: 14734 YAOUNDE</p>
                  <p>Tél: 678648009</p>
                  <p>Montant: 108 400 000 FCFCA TTC</p>
                  <p>Avenant: Entrée N°</p>
                  <p>Date de Démarrage: 3 juil. 23</p>
                  <p>Délais: 07Mois</p>
                </div>
                <div className="sub-section">
                  <h5>Documents Disponibles</h5>
                  <p>ANO au Contrat: <span style={{ color: "red" }}>Non</span></p>
                  <p>Assurance TRC: <span style={{ color: "red" }}>Oui</span></p>
                  <p>Caution de BF: <span style={{ color: "red" }}>Oui</span></p>
                  <p>Projet d'exécution: <span style={{ color: "red" }}>Non</span></p>
                </div>
                <div className="sub-section">
                  <h5>Situation des travaux</h5>
                  <p>Avancement: 24,3%</p>
                  <p>Consommation des Délais: 52,38%</p>
                  <p>Situation des Travaux: Travaux en Cours</p>
                  <p>Nature de la Visite: Mission de suivi</p>
                </div>
                <div className="sub-section">
                  <h5>Situation des Payements</h5>
                  <p>Décompte: Non</p>
                  <p>Montant: 0FCFATTC</p>
                  <p>AV Demar: <span style={{ color: "red" }}>Oui</span></p>
                  <p>Avancement financier: 0%</p>
                  <p>Observations: Entrez vos observations sur situation des payements</p>
                </div>
              </div>

              <div className="column">
                <h4>Maîtrise d'Œuvre: Absente</h4>
                <div className="sub-section">
                  <h5>Contrat</h5>
                  <p>Nom: Entrez Nom de la Maîtrise d'œuvre</p>
                  <p>Lot: Aucun</p>
                  <p>BP:</p>
                  <p>Tél: Entrez N°Tél</p>
                  <p>Montant: Montant du Contrat ? FCFATTC</p>
                  <p>Avenant: Entrée N°</p>
                  <p>Date de Démarrage: Entrez Date</p>
                  <p>Délais: Mois</p>
                </div>
                <div className="sub-section">
                  <h5>Documents Disponibles</h5>
                  <p>ANO au Contrat: <span style={{ color: "red" }}>Non</span></p>
                  <p>Assurance TRC: <span style={{ color: "red" }}>Non</span></p>
                  <p>Caution de BF: <span style={{ color: "red" }}>Non</span></p>
                  <p>Programme d'action: <span style={{ color: "red" }}>Non</span></p>
                </div>
                <div className="sub-section">
                  <h5>Situation du suivi</h5>
                  <p>Avancement: %</p>
                  <p>Consommation des Délais: %</p>
                  <p>Rapports de suivi: Aucune Transmission</p>
                  <p>Nature de la Visite: Entrez Nature visite</p>
                </div>
                <div className="sub-section">
                  <h5>Situation des Payements</h5>
                  <p>Décompte: <span style={{ color: "red" }}>Non</span></p>
                  <p>Montant: 0FCFATTC</p>
                  <p>AV Demar: <span style={{ color: "red" }}>Non</span></p>
                  <p>Avancement financier: 0%</p>
                  <p>Observations: Entrez vos observations sur situation des payements</p>
                </div>
              </div>
            </div>

            <section className="section-titre">
              <h3>3) Suivi des activités sur site</h3>
            </section>
          </div>

          <div className="contener">
            <table>
              <tr>
                <td className="left-column">
                  <p style={{ marginBottom: "15px" }}><b><u>Mise en Œuvre des dernières recommandations</u></b></p>
                  <p style={{ marginBottom: "10px" }}><b><u>Observation et constats</u></b></p>
                  <p>Sur le site, accompagné du Maire, nous avons
                constaté que l’entreprise s’est mobilisée et les
                travaux sont en cours, rendus à la fin du chainage
                  haut pour le bloc de T3 et à la fin des travaux de 
                  fondation pour les deux blocs de T2. En termes de mobilisation,
                  19 personnels présents à savoir 01 conducteur des travaux,
                    03 chefs chantier, 06 maçons, 02 ferrailleurs,
                  07 manœuvres, s’activaient aux élevations des murs 
                  de soubassement restants.  S’agissant des matériels
                  et matériaux, deux tas de sable, un tas de gravier
                  et une vingtaine de sacs de ciment sont disponibles 
                  sur le chantier. Le taux d’avancement est de 24,3%
                    pour une consommation des délais de 52,38%, soit
                    un écart négatif de 28,08% à rattraper absolument.
                La cadence actuelle des travaux est satisfaisante mais
                  à maintenir pour pouvoir livrer l’ouvrage dans les délais 
                contractuels. Cependant, il a été relevé l’absence de tamis
                pour sable et d’EPI chez certains ouvriers. 
                Par ailleurs, l’entreprise n’a pas transmis à date le projet 
                d’exécution des ouvrages.</p>
                </td>
                <td className="right-column">
                  <p style={{ marginBottom: "20px" }}><b><u>Recomandations</u></b></p>
                  <p>A l’endroit de l’entreprise, il a été recommandé de :</p>
                  <ul>
                    <li>Systématiser le port des EPI ;</li>
                    <li>Acquérir un tamis pour le sable ;</li>
                    <li>Maintenir la cadence actuelle des travaux ;</li>
                    <li>Transmettre le projet d’exécution ;</li>
                  </ul>
                  <p><p> A l’endroit du Maître d’ouvrage, il a été recommandé 
    de transmettre tous les documents administratifs liés au 
    projet (marché, OS de démarrage, …)</p></p>
                </td>
              </tr>
            </table>

            <h3 style={{ backgroundColor: "rgb(222, 252, 184)" }}>
              <span style={{ color: "red" }}>4)</span> Images du Projet
            </h3>

            <div className="images">
              <div className="img-block">
                <img src="src/assets/images/glenov-brankovic-e4B5AvA7Jqo-unsplash.jpg" alt="Plaque de chantier" />
                <p style={{ backgroundColor: "rgb(222, 222, 248)" }}><b>Plaque de chantier</b></p>
              </div>
              <div className="img-block">
                <img src="src/assets/images/glenov-brankovic-e4B5AvA7Jqo-unsplash.jpg" alt="Façade principale du bloc T3" />
                <p style={{ backgroundColor: "rgb(219, 219, 250)" }}><b>Façade principale du bloc de T3</b></p>
              </div>
            </div>
            <div className="images">
              <div className="img-block">
                <img src="src/assets/images/glenov-brankovic-e4B5AvA7Jqo-unsplash.jpg" alt="Plaque de chantier" />
                <p style={{ backgroundColor: "rgb(222, 222, 248)" }}><b>Bloc de T3.</b></p>
              </div>
              <div className="img-block">
                <img src="src/assets/images/glenov-brankovic-e4B5AvA7Jqo-unsplash.jpg" alt="Façade principale du bloc T3" />
                <p style={{ backgroundColor: "rgb(219, 219, 250)" }}><b>Travaux de fondation d'un bloc de T2.</b></p>
              </div>

            </div>

    <div className="images">
              <div className="img-block">
                <img src="src/assets/images/glenov-brankovic-e4B5AvA7Jqo-unsplash.jpg" alt="Plaque de chantier" />
                <p style={{ backgroundColor: "rgb(222, 222, 248)" }}><b>Travaux de fondation d'un bloc de T2.</b></p>
              </div>
              <div className="img-block">
                <img src="src/assets/images/glenov-brankovic-e4B5AvA7Jqo-unsplash.jpg" alt="Façade principale du bloc T3" />
                <p style={{ backgroundColor: "rgb(219, 219, 250)" }}><b>.Terrassement général</b></p>
              </div>

            </div>

          </div>
          


          <div className="rower">
              <div className="img-blocked">
                <p style={{ backgroundColor: "rgb(222, 222, 248)" }}>Appréciation des Travaux</p>
                <p>Très bien</p>
              </div>
              <div className="img-blocked">
                <p style={{ backgroundColor: "rgb(222, 222, 248)" }}>Appréciation des Travaux</p>
                <p>M.Mme:</p>
              </div>
            </div>
          

          <div className="signatures">
            <p>27-août-25 Visa</p>
            <div className="sign-row">
              <div className="sign-line">N --------------------------------------</div>
              <div className="sign-line">N+1 --------------------------------------</div>
              <div className="sign-line">N+2 --------------------------------------</div>
            </div>
          </div>
          

          <footer>
            <p style={{ marginLeft: "130px" }}>
              <strong>FONDS SPECIAL D'ÉQUIPEMENT ET D'INTERVENTION INTERCOMMUNALE / SPECIAL COUNCIL SUPPORT FUND FOR MUTUAL ASSISTANCE</strong>
            </p>
            <p style={{ marginLeft: "230px" }}>
              <strong>B.P./P.O.Box.: 718 Yaoundé, Cameroun.-FEICOM, 381, Rue 4565 MIMBOMAN Yaoundé</strong>
            </p>
            <p style={{ marginLeft: "310px" }}>
              <strong>Tél. (237) 222 23 51 64-Fax. (237) 222 23 17 59</strong>
            </p>
            <p style={{ marginLeft: "300px" }}>
              <strong>Site web: www.feicom.cm / Email: feicom@feicom.cm </strong>
            </p>
            <p style={{ color: "red", marginLeft: "380px" }}>Certifié ISO 9001</p>
          </footer>
        </Container>
      </div>
    </>
  );
};

export default DeepSeekHTML;