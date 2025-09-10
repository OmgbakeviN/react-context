// MultiStepPCCMVisit.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
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
  Spinner,
} from "reactstrap";
import axiosInstance from "../../../../api/axios";

export default function MultiStepPCCMVisit({
  projects = [],
  projetId = {},
  onCreated,
}) {
  // --- Étapes & progression ---
  const steps = useMemo(
    () => [
      { key: "base", title: "Informations & Statuts" },
      { key: "notes", title: "Observations, Recos & Pièces" },
    ],
    []
  );
  const [step, setStep] = useState(0);
  const progress = Math.round(((step + 1) / steps.length) * 100);

  // --- États UI ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- Données du formulaire (mappées 1:1 avec l'API) ---
  const [form, setForm] = useState({
    // requis
    projet: projetId ?? "",
    date: "", // yyyy-mm-dd

    // optionnels
    last_site_visit_date: "", // yyyy-mm-dd
    enterprise_present: false,
    moe_present: false,
    contract_registered: false,
    performance_bond_provided: false,
    caution: "",
    appreciation: "", // GOOD, VERY_GOOD, FAIRLY_GOOD, PASSABLE, MEDIOCRE, POOR
    visit_nature: "",
    recommendations: "",
    observation: "",

    // fichiers (multipart)
    new_images: [], // FileList ou Array<File>
  });

  // Si un projet est fixé via props, on verrouille le champ
  useEffect(() => {
    if (projetId) {
      setForm((prev) => ({ ...prev, projet: projetId }));
    }
  }, [projetId]);

  // --- Helpers de mise à jour ---
  function updateField(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  function updateBool(e) {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  }
  function updateFiles(e) {
    const files = Array.from(e.target.files || []);
    setForm((prev) => ({ ...prev, new_images: files }));
  }

  // --- Validation par étape ---
  function validateStep0() {
    if (!form.date) return "La date de visite est requise.";
    if (!form.projet) return "Le projet est requis.";
    return "";
  }
  function validateStep1() {
    // Rien d'obligatoire ici côté API, mais on peut garder une cohérence UX si besoin
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

  // --- Soumission vers l'API (multipart/form-data) ---
  async function submit() {
    setError("");
    setSuccess("");
    const err = step === 1 ? validateStep1() : "";
    if (err) {
      setError(err);
      return;
    }

    // Construction du FormData -> chaque champ avec sa clé API exacte
    const fd = new FormData();
    fd.append("date", form.date);
    fd.append("projet", String(form.projet));

    if (form.last_site_visit_date) {
      fd.append("last_site_visit_date", form.last_site_visit_date);
    }
    fd.append("enterprise_present", String(!!form.enterprise_present));
    fd.append("moe_present", String(!!form.moe_present));
    fd.append("contract_registered", String(!!form.contract_registered));
    fd.append(
      "performance_bond_provided",
      String(!!form.performance_bond_provided)
    );

    if (form.caution) fd.append("caution", form.caution);
    if (form.appreciation) fd.append("appreciation", form.appreciation);
    if (form.visit_nature) fd.append("visit_nature", form.visit_nature);
    if (form.recommendations)
      fd.append("recommendations", form.recommendations);
    if (form.observation) fd.append("observation", form.observation);

    // Fichiers: même clé répétée "new_images"
    if (form.new_images && form.new_images.length) {
      form.new_images.forEach((file) => {
        fd.append("new_images", file); // DRF gère les champs répétés
      });
    }

    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/feicom/api/visites/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Visite créée avec succès.");
      if (typeof onCreated === "function") onCreated(data);

      // Reset doux (on garde le projet s'il est figé)
      setForm((prev) => ({
        ...prev,
        date: "",
        last_site_visit_date: "",
        enterprise_present: false,
        moe_present: false,
        contract_registered: false,
        performance_bond_provided: false,
        caution: "",
        appreciation: "",
        visit_nature: "",
        recommendations: "",
        observation: "",
        new_images: [],
      }));
      setStep(0);
    } catch (e) {
      // Essaye de remonter un message API utile
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        "Échec de la création de la visite.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Col>
      <Card className="shadow-sm">
        <CardHeader className="bg-white">
          {/* En-tête + progression */}
          <Row className="align-items-center">
            <Col xs="12" className="text-sm-end">
              <small className="text-muted">{progress}%</small>
              <Progress value={progress} className="mt-1" style={{ height: 6 }} />
            </Col>
          </Row>

          {/* Stepper compact */}
          <div className="d-flex flex-nowrap gap-2 mt-3 overflow-auto pe-1">
            {steps.map((s, i) => (
              <div key={s.key} className="d-flex align-items-center flex-shrink-0">
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center ${i === step
                    ? "bg-primary text-white"
                    : i < step
                      ? "bg-success text-white"
                      : "bg-light"
                    }`}
                  style={{ width: 36, height: 36, fontWeight: 700 }}
                >
                  {i + 1}
                </div>
                <small
                  className={`ms-2 d-none d-sm-inline ${i === step ? "fw-semibold" : ""
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
          {success ? (
            <Alert color="success" className="mb-0 mt-3">
              {success}
            </Alert>
          ) : null}
        </CardHeader>

        <CardBody>
          {/* ÉTAPE 1 : champs requis + statuts */}
          {step === 0 && (
            <Form>
              <h6 className="mb-3">
                <strong>A. Informations générales</strong>
              </h6>
              <Row>
                {!projetId && (
                  <Col md="6">
                    <FormGroup>
                      <Label>Projet *</Label>
                      <Input
                        type="select"
                        name="projet"
                        value={form.projet}
                        onChange={updateField}
                      >
                        <option value="">— Sélectionner —</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.libelle || `Projet #${p.id}`}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                )}
                <Col md="6">
                  <FormGroup>
                    <Label>Date de visite *</Label>
                    <Input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={updateField}
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label>Dernière visite (le cas échéant)</Label>
                    <Input
                      type="date"
                      name="last_site_visit_date"
                      value={form.last_site_visit_date}
                      onChange={updateField}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <h6 className="mt-2 mb-2">
                <strong>B. Présences & contrats</strong>
              </h6>
              <Row>
                <Col md="3">
                  <FormGroup check>
                    <Input
                      id="enterprise_present"
                      type="checkbox"
                      name="enterprise_present"
                      checked={form.enterprise_present}
                      onChange={updateBool}
                    />
                    <Label for="enterprise_present" check>
                      Entreprise présente ?
                    </Label>
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup check>
                    <Input
                      id="moe_present"
                      type="checkbox"
                      name="moe_present"
                      checked={form.moe_present}
                      onChange={updateBool}
                    />
                    <Label for="moe_present" check>
                      MOE présente ?
                    </Label>
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup check>
                    <Input
                      id="contract_registered"
                      type="checkbox"
                      name="contract_registered"
                      checked={form.contract_registered}
                      onChange={updateBool}
                    />
                    <Label for="contract_registered" check>
                      Contrat enregistré ?
                    </Label>
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup check>
                    <Input
                      id="performance_bond_provided"
                      type="checkbox"
                      name="performance_bond_provided"
                      checked={form.performance_bond_provided}
                      onChange={updateBool}
                    />
                    <Label for="performance_bond_provided" check>
                      Caution de bonne fin fournie ?
                    </Label>
                  </FormGroup>
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md="6">
                  <FormGroup>
                    <Label>Caution (référence / remarque)</Label>
                    <Input
                      name="caution"
                      value={form.caution}
                      onChange={updateField}
                      placeholder="Référence, observations sur la caution…"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label>Appréciation globale</Label>
                    <Input
                      type="select"
                      name="appreciation"
                      value={form.appreciation}
                      onChange={updateField}
                    >
                      <option value="">— Choisir —</option>
                      <option value="VERY_GOOD">Very good</option>
                      <option value="GOOD">Good</option>
                      <option value="FAIRLY_GOOD">Fairly good</option>
                      <option value="PASSABLE">Passable</option>
                      <option value="MEDIOCRE">Mediocre</option>
                      <option value="POOR">Poor</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormGroup>
                    <Label>Nature de la visite</Label>
                    <Input
                      name="visit_nature"
                      value={form.visit_nature}
                      onChange={updateField}
                      placeholder="Ex. Mission de suivi, contrôle qualité, réception partielle…"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          )}

          {/* ÉTAPE 2 : textes libres + pièces */}
          {step === 1 && (
            <Form>
              <h6 className="mb-2">
                <strong>C. Observations & constats</strong>
              </h6>
              <FormGroup>
                <Input
                  type="textarea"
                  name="observation"
                  value={form.observation}
                  onChange={updateField}
                  rows="6"
                  placeholder="Ex : mobilisation des équipes, matériaux sur site, écarts délais/avancement, EPI, plans d’exécution, etc."
                />
              </FormGroup>

              <h6 className="mt-3 mb-2">
                <strong>D. Recommandations</strong>
              </h6>
              <FormGroup>
                <Input
                  type="textarea"
                  name="recommendations"
                  value={form.recommendations}
                  onChange={updateField}
                  rows="4"
                  placeholder="Actions correctives, délais, responsabilités…"
                />
              </FormGroup>

              <h6 className="mt-3 mb-2">
                <strong>E. Pièces jointes (photos)</strong>
              </h6>
              <FormGroup>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={updateFiles}
                />
                <small className="text-muted d-block mt-1">
                  Formats image. Sélection multiple autorisée.
                </small>
              </FormGroup>
            </Form>
          )}
        </CardBody>
      </Card>

      {/* Actions */}
      <div className="d-flex justify-content-between mt-3">
        <Button color="secondary" outline disabled={step === 0 || loading} onClick={back}>
          Précédent
        </Button>

        {step < steps.length - 1 ? (
          <Button color="primary" onClick={next} disabled={loading}>
            Suivant
          </Button>
        ) : (
          <Button color="success" onClick={submit} disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" />&nbsp;Envoi…
              </>
            ) : (
              "Soumettre"
            )}
          </Button>
        )}
      </div>
    </Col>
  );
}
