import React, { useEffect, useMemo, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Row, Col, Label, Input } from "reactstrap";
import axiosInstance from "../../../../../api/axios";
import { toast } from "react-toastify";

import SearchableDropdown from "./searchableDropdown";

/**
 * ProjectQuickEdit
 * Bouton + Modal d’édition partielle d’un projet (PATCH /feicom/api/projets/{id}/partial/)
 *
 * Props:
 *  - project: objet projet courant (doit contenir id)
 *  - onUpdated?: (updatedProject) => void   // callback après succès (ex: reloadProject)
 *
 * Champs envoyés (canonique + simples): libelle, type, commune (id), numero_convention,
 * montant_ttc, approving_body, date_debut, date_fin, geolocalisation, locality
 *
 * NB: Le backend accepte aussi les alias (no_convention, cost_ttc, start_date, end_date),
 * mais on reste en canonique pour la clarté.
 */
const ProjectQuickEdit = ({ project, onUpdated }) => {
  const [open, setOpen] = useState(false);

  // --- states formulaire (préremplis depuis project) ---
  const [libelle, setLibelle] = useState("");
  const [type, setType] = useState("INFRA");
  const [commune, setCommune] = useState("");            // id (number as string)
  const [numeroConvention, setNumeroConvention] = useState("");
  const [montantTtc, setMontantTtc] = useState("");      // string attendu côté API
  const [approvingBody, setApprovingBody] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [geolocalisation, setGeolocalisation] = useState("");
  const [locality, setLocality] = useState("");

  // --- listes auxiliaires (types, communes) ---
  const TYPES = useMemo(() => ([
    { value: "INFRA", label: "INFRA" },
    { value: "EQUIPEMENT", label: "EQUIPEMENT" },
    { value: "ETUDE", label: "ETUDE" },
  ]), []);

  const [communes, setCommunes] = useState([]);
  const [loadingCommunes, setLoadingCommunes] = useState(false);

  // Initialisation des champs quand le projet change
  useEffect(() => {
    if (!project) return;
    setLibelle(project.libelle || "");
    setType(project.type || "INFRA");
    setCommune(project?.commune?.id ? String(project.commune.id) : ""); // on stocke en string pour le <select>
    setNumeroConvention(project.numero_convention || "");
    setMontantTtc(project.montant_ttc || ""); // s'il existe; sinon tu peux calculer depuis montant_ht si besoin
    setApprovingBody(project.approving_body || "");
    setDateDebut(project.date_debut || "");
    setDateFin(project.date_fin || "");
    setGeolocalisation(project.geolocalisation || "");
    setLocality(project.locality || "");
  }, [project]);

  // Charger les communes pour le select (léger)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoadingCommunes(true);
        const { data } = await axiosInstance.get("/feicom/api/communes/");
        if (mounted) setCommunes(Array.isArray(data) ? data : []);
      } catch (e) {
        // on ne bloque pas l’édition si l’API communes tombe
        console.error("[COMMUNES] Error:", e?.response?.data || e?.message);
        if (mounted) setCommunes([]);
      } finally {
        if (mounted) setLoadingCommunes(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // mapping communes -> items pour le dropdown
  const communeItems = useMemo(() => {
    return (communes || []).map((c) => ({
      value: c.id,
      label: `${c.nom} — ${c?.departement?.nom ?? ""} (${c?.departement?.agence?.code ?? ""})`.trim(),
    }));
  }, [communes]);

  const toggle = () => setOpen((o) => !o);

  const resetAndClose = () => {
    setOpen(false);
  };

  // Envoi PATCH
  const handleSave = async (e) => {
    e.preventDefault();
    if (!project?.id) return;

    const payload = {
      libelle: libelle || undefined,
      type: type || undefined,
      commune: commune ? Number(commune) : undefined,
      numero_convention: numeroConvention || undefined,
      montant_ttc: montantTtc || undefined,
      approving_body: approvingBody || undefined,
      date_debut: dateDebut || undefined,
      date_fin: dateFin || undefined,
      geolocalisation: geolocalisation || undefined,
      locality: locality || undefined,
    };

    // Nettoyage: on retire les undefined pour n’envoyer QUE les champs modifiés/renseignés
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    try {
      const url = `/feicom/api/projets/${project.id}/partial/`;
      console.log("[PROJECT PATCH] URL:", url);
      console.log("[PROJECT PATCH] Payload:", payload);
      const { data } = await axiosInstance.patch(url, payload);
      toast.success("Projet modifié avec succès.");
      if (typeof onUpdated === "function") onUpdated(data);
      resetAndClose();
    } catch (e) {
      console.error("[PROJECT PATCH] Error:", e?.response?.data || e?.message);
      const msg = e?.response?.data?.detail || "La modification a échoué.";
      toast.error(msg);
    }
  };

  return (
    <>
      {/* Bouton à mettre dans l'entête */}
      <Button color="primary" size="sm" onClick={toggle}>
        Modifier
      </Button>

      {/* Modal édition */}
      <Modal isOpen={open} toggle={toggle} size="lg" centered scrollable>
        <ModalHeader toggle={toggle}>Modifier le projet</ModalHeader>
        <Form onSubmit={handleSave}>
          <ModalBody>
            <Row className="g-3">
              <Col md="8">
                <Label className="form-label">Libellé</Label>
                <Input value={libelle} onChange={(e) => setLibelle(e.target.value)} />
              </Col>
              <Col md="4">
                <Label className="form-label">Type</Label>
                <Input type="select" value={type} onChange={(e) => setType(e.target.value)}>
                  {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </Input>
              </Col>

              <Col md="6">
                  <Label className="form-label">Commune</Label>
                  <SearchableDropdown
                    items={communeItems}
                    value={commune}
                    onChange={(val) => setCommune(String(val))}
                    disabled={loadingCommunes}
                    noSelectionLabel="— (inchangé)"
                    placeholder="Rechercher une commune…"
                  />
              </Col>

              <Col md="6">
                <Label className="form-label">N° de convention</Label>
                <Input value={numeroConvention} onChange={(e) => setNumeroConvention(e.target.value)} />
              </Col>

              <Col md="6">
                <Label className="form-label">Montant TTC</Label>
                <Input
                  type="text"
                  placeholder="ex: 154300000.00"
                  value={montantTtc}
                  onChange={(e) => setMontantTtc(e.target.value)}
                />
              </Col>
              <Col md="6">
                <Label className="form-label">Instance d’attribution</Label>
                <Input value={approvingBody} onChange={(e) => setApprovingBody(e.target.value)} />
              </Col>

              <Col md="6">
                <Label className="form-label">Date début</Label>
                <Input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
              </Col>
              <Col md="6">
                <Label className="form-label">Date fin</Label>
                <Input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
              </Col>

              <Col md="6">
                <Label className="form-label">Localité</Label>
                <Input value={locality} onChange={(e) => setLocality(e.target.value)} />
              </Col>
              <Col md="6">
                <Label className="form-label">Géolocalisation</Label>
                <Input placeholder="lat,lon (ex: 3.867,-11.521)" value={geolocalisation} onChange={(e) => setGeolocalisation(e.target.value)} />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button type="button" color="secondary" onClick={toggle}>Annuler</Button>
            <Button type="submit" color="primary">Enregistrer</Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default ProjectQuickEdit;
