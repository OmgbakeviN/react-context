// MultiStepPCCMVisit.jsx
import React, { useState, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Progress,
  Alert,
} from "reactstrap";
import { H3 } from "../../../../AbstractElements";
import Datepicker from "../../../Forms/FormWidget/DatePicker";

export default function ProjectVisitForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  const [startDate, setstartDate] = useState(new Date());
  const handleChange = (date) => {
    setstartDate(date);
  };

  const [form, setForm] = useState({
    // --- STEP 1: Administrative & Contract (from the fiche) ---
    structure: "ARES",
    region: "EST",
    departement: "LOM-ET-DJEREM",
    commune: "DIANG",
    dateVisite: "",
    derniereVisite: "",
    visiteNo: "",
    accord: "COPIL PCCM",
    conventionOuiNon: "Oui",
    conventionNumero: "",
    dateOctroi: "",
    dateSignature: "",
    objet:
      "PROJET DE CONSTRUCTION DE SIX (06) LOGEMENTS DE TYPE T2 ET T3 DANS LA COMMUNE DE DIANG (PCCM)",
    montantTTC: "",
    avenantMontantTTC: "",
    nombreLots: "01",
    miseEnOeuvreFinancementPct: "",
    dureeConventionMois: "",
    entrepriseTravauxPresence: "Présente",
    maitriseOeuvrePresence: "Absente",

    // Contrat (Entreprise)
    entNom: "TROPICAL FOREST MANAGEMENT SARL",
    entLot: "Pas de Lot",
    entBP: "14734 YAOUNDE",
    entTel: "678648009",
    entMontantTTC: "",
    entAvenantNo: "",
    entOSDemarrage: "",
    entDelaisMois: "07",

    // Contrat (Maîtrise d’Œuvre)
    moeNom: "",
    moeLot: "Aucun",
    moeBP: "",
    moeTel: "",
    moeMontantTTC: "",
    moeAvenantNo: "",
    moeOSDemarrage: "",
    moeDelaisMois: "",

    // Documents disponibles (Entreprise)
    doc_anoContrat_ent: "Non",
    doc_assuranceTRC_ent: "Oui",
    doc_cautionBF_ent: "Oui",
    doc_projetExecution_ent: "Non",
    doc_programmeAction_ent: "Non",

    // Documents disponibles (MOE)
    doc_anoContrat_moe: "Non",
    doc_assuranceTRC_moe: "Non",
    doc_cautionBF_moe: "Non",
    doc_projetExecution_moe: "Non",
    doc_programmeAction_moe: "Non",

    // --- STEP 2: Site status, payments, observations ---
    avancementPct: "",
    consommationDelaisPct: "",
    natureVisite: "Mission de suivi",
    situationSuiviTransmission: "Aucune Transmission",

    // Paiements (1)
    decompte1: "Non",
    avDemar1: "Oui",
    montant1: "0",
    avancementFinancier1: "0",

    // Paiements (2)
    decompte2: "Non",
    avDemar2: "Non",
    montant2: "0",
    avancementFinancier2: "0",

    observationsPaiements: "",

    // Observations & constats (free text gathered from the fiche)
    observationsConstats: "",
    // Recommandations
    recoEntreprise_epi: true,
    recoEntreprise_tamis: true,
    recoEntreprise_cadence: true,
    recoEntreprise_projetExecution: true,
    recoMaitreOuvrage_docsAdministratifs: true,
  });

  const steps = useMemo(
    () => [
      { key: "admin", title: "Visit Details" },
      { key: "site", title: "Observations and recommendations" },
    ],
    []
  );

  const progress = Math.round(((step + 1) / steps.length) * 100);

  function update(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function validateStep0() {
    // Minimal required fields for Step 1
    const req = [
      //   "structure",
      //   "region",
      //   "departement",
      //   "commune",
      //   "dateVisite",
      //   "accord",
      //   "objet",
      //   "montantTTC",
      //   "entNom",
      //   "entOSDemarrage",
      //   "entDelaisMois",
    ];
    for (const k of req) {
      if (!String(form[k] || "").trim()) {
        return `Please complete required field: ${k}`;
      }
    }
    return "";
  }

  function validateStep1() {
    // Minimal required fields for Step 2
    const req = ["avancementPct", "consommationDelaisPct", "natureVisite"];
    for (const k of req) {
      if (!String(form[k] || "").trim()) {
        return `Please complete required field: ${k}`;
      }
    }
    return "";
  }

  function next() {
    setError("");
    const err = step === 0 ? validateStep0() : "";
    if (err) {
      setError(err);
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function back() {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  }

  function submit() {
    setError("");
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    // Hand over final data
    if (typeof onSubmit === "function") {
      onSubmit(form);
    } else {
      // fallback: preview in console
      console.log("PCCM Visit Form Submitted:", form);
      alert("Form submitted ✅ (check console for data)");
    }
  }

  return (
    <Col>
      <Card className="shadow-sm">
        <CardHeader className="bg-white">
          {/* Title + progress */}
          <Row className="d-flex flex-row gap-2">
            {/* <Col md="12">
              <div className="fw-semibold text-wrap">
                Fiche de Visite – PCCM / FEICOM
              </div>
            </Col> */}

            <Col md="12">
              {/* progress block: full width on xs, shrink on sm+ */}
              <div className="w-100 w-sm-auto text-sm-end">
                <small className="text-muted">{progress}%</small>
                <Progress
                  value={progress}
                  className="mt-1"
                  style={{ height: 6 }}
                />
              </div>
            </Col>
          </Row>

          {/* Steps: horizontal scroll on mobile */}
          <div className="steps-scroll d-flex flex-nowrap gap-2 mt-3 overflow-auto pe-1">
            {steps.map((s, i) => (
              <div
                key={s.key}
                className="d-flex align-items-center flex-shrink-0"
              >
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center
            ${
              i === step
                ? "bg-primary text-white"
                : i < step
                ? "bg-success text-white"
                : "bg-light"
            }`}
                  style={{ width: 36, height: 36, fontWeight: 700 }}
                >
                  {i + 1}
                </div>
                {/* hide labels on xs to save space */}
                <small
                  className={`ms-2 d-none d-sm-inline ${
                    i === step ? "fw-semibold" : ""
                  }`}
                >
                  {s.title}
                </small>
              </div>
            ))}
          </div>

          {error ? (
            <Alert color="danger" className="mb-0 mt-3">
              {error}
            </Alert>
          ) : null}
        </CardHeader>

        <CardBody>
          {step === 0 && (
            <Form>
              <H3 className="mb-">
                <strong>A. General Information</strong>{" "}
              </H3>

              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label>Date of Visit</Label>
                    <Input
                      type="date"
                      name="dateVisite"
                      value={form.dateVisite}
                      onChange={update}
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label>Last Visit</Label>
                    <Input
                      type="date"
                      name="derniereVisite"
                      value={form.derniereVisite}
                      onChange={update}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label>Entreprise des Travaux</Label>
                    <Input
                      type="select"
                      name="entrepriseTravauxPresence"
                      value={form.entrepriseTravauxPresence}
                      onChange={update}
                    >
                      <option>Présente</option>
                      <option>Absente</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label>Maîtrise d’Œuvre</Label>
                    <Input
                      type="select"
                      name="maitriseOeuvrePresence"
                      value={form.maitriseOeuvrePresence}
                      onChange={update}
                    >
                      <option>Présente</option>
                      <option>Absente</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label>Nature of the visit</Label>
                    <Input
                      name="natureVisite"
                      value={form.natureVisite}
                      onChange={update}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <h6 className="mt-3 mb-3">
                <strong>B. Available Documents</strong>
              </h6>
              <Row>
                <Col md="6">
                  <strong>Company</strong>
                  <Row className="mt-2">
                    <Col md="6">
                      <FormGroup>
                        <Label>ANO or Contrat</Label>
                        <Input
                          type="select"
                          name="doc_anoContrat_ent"
                          value={form.doc_anoContrat_ent}
                          onChange={update}
                        >
                          <option>Oui</option>
                          <option>Non</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label>Assurance TRC</Label>
                        <Input
                          type="select"
                          name="doc_assuranceTRC_ent"
                          value={form.doc_assuranceTRC_ent}
                          onChange={update}
                        >
                          <option>Oui</option>
                          <option>Non</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label>Caution de BF</Label>
                        <Input
                          type="select"
                          name="doc_cautionBF_ent"
                          value={form.doc_cautionBF_ent}
                          onChange={update}
                        >
                          <option>Oui</option>
                          <option>Non</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label>Projet d’exécution</Label>
                        <Input
                          type="select"
                          name="doc_projetExecution_ent"
                          value={form.doc_projetExecution_ent}
                          onChange={update}
                        >
                          <option>Oui</option>
                          <option>Non</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <Label>Programme d’action</Label>
                        <Input
                          type="select"
                          name="doc_programmeAction_ent"
                          value={form.doc_programmeAction_ent}
                          onChange={update}
                        >
                          <option>Oui</option>
                          <option>Non</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col md="6">
                  <strong>Maîtrise d’Œuvre</strong>
                  <Row className="mt-2">
                    <Col md="6">
                      <FormGroup>
                        <Label>ANO au Contrat</Label>
                        <Input
                          type="select"
                          name="doc_anoContrat_moe"
                          value={form.doc_anoContrat_moe}
                          onChange={update}
                        >
                          <option>Oui</option>
                          <option>Non</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label>Assurance TRC</Label>
                        <Input
                          type="select"
                          name="doc_assuranceTRC_moe"
                          value={form.doc_assuranceTRC_moe}
                          onChange={update}
                        >
                          <option>Oui</option>
                          <option>Non</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label>Caution de BF</Label>
                        <Input
                          type="select"
                          name="doc_cautionBF_moe"
                          value={form.doc_cautionBF_moe}
                          onChange={update}
                        >
                          <option>Oui</option>
                          <option>Non</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label>Projet d’exécution</Label>
                        <Input
                          type="select"
                          name="doc_projetExecution_moe"
                          value={form.doc_projetExecution_moe}
                          onChange={update}
                        >
                          <option>Oui</option>
                          <option>Non</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <Label>Programme d’action</Label>
                        <Input
                          type="select"
                          name="doc_programmeAction_moe"
                          value={form.doc_programmeAction_moe}
                          onChange={update}
                        >
                          <option>Oui</option>
                          <option>Non</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          )}

          {step === 1 && (
            <Form>
              <h6 className="mt-3 mb-2">
                {" "}
                <strong>C. Observations & findings (site)</strong>
              </h6>
              <FormGroup>
                <Input
                  type="textarea"
                  name="observationsConstats"
                  value={form.observationsConstats}
                  onChange={update}
                  rows="6"
                  placeholder="Ex: mobilisation du personnel, matériaux disponibles, écart avancement vs délais, EPI manquants, projet d’exécution non transmis, etc."
                />
              </FormGroup>
              <FormGroup className="mt-3">
                <Label>
                  <h6 className="mt-3 mb-2">
                    <strong>D. Recommendations</strong>
                  </h6>
                </Label>
                <Input
                  type="textarea"
                  name="observationsPaiements"
                  value={form.observationsPaiements}
                  onChange={update}
                  rows="3"
                />
              </FormGroup>
            </Form>
          )}
        </CardBody>
      </Card>

      <div className="d-flex justify-content-between mt-3">
        <Button color="secondary" outline disabled={step === 0} onClick={back}>
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button color="primary" onClick={next}>
            Next
          </Button>
        ) : (
          <Button color="success" onClick={submit}>
            Submit
          </Button>
        )}
      </div>
    </Col>
  );
}
