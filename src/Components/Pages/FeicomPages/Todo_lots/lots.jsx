import React, { useState } from "react";
import TodosList from "./TodosList";
import axiosInstance from "../../../../api/axios"; // adapte le chemin si besoin
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  FormGroup,
} from "reactstrap";

/**
 * Composant Lots
 * - Bande de progression en background en fonction de "pourcentage"
 * - Edition du pourcentage via modal (PUT /feicom/api/lots/{id}/)
 * - Suppression via **modal de confirmation** (DELETE /feicom/api/lots/{id}/)
 *
 * Props:
 *  - lots: Array<{ id, nom, statut, montant, pourcentage, projet, todos: [] }>
 *  - projectId: number (id du projet)
 *  - onChanged?: () => void (callback après succès PUT/DELETE)
 */
const Lots = ({ lots = [], projectId, onChanged }) => {
  const [open, setOpen] = useState(""); // accordéon (id ouvert)
  const toggle = (id) => setOpen((prev) => (prev === id ? "" : id));

  // --- MODAL édition pourcentage ---
  const [editOpen, setEditOpen] = useState(false);
  const [currentLot, setCurrentLot] = useState(null);
  const [percentInput, setPercentInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // --- MODAL confirmation suppression ---
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [lotToDelete, setLotToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Ouvre le modal d'édition de pourcentage
  const openEdit = (lot) => {
    setCurrentLot(lot);
    const p = parseFloat(lot?.pourcentage ?? 0);
    setPercentInput(Number.isFinite(p) ? String(p) : "0");
    setSaveError("");
    setEditOpen(true);
  };
  const closeEdit = () => {
    if (saving) return;
    setEditOpen(false);
    setCurrentLot(null);
    setPercentInput("");
    setSaveError("");
  };

  // PUT /feicom/api/lots/{id}/ (remplacement complet)
  const submitPercent = async () => {
    setSaveError("");
    const n = Number(percentInput);
    if (!Number.isFinite(n) || n < 0 || n > 100) {
      setSaveError("Le pourcentage doit être un nombre entre 0 et 100.");
      return;
    }
    if (!currentLot) return;

    const payload = {
      nom: currentLot.nom,
      statut: currentLot.statut || "NOT STARTED",
      montant: currentLot.montant ?? 0,
      pourcentage: n,
      projet: currentLot.projet || projectId,
    };

    setSaving(true);
    try {
      await axiosInstance.put(`/feicom/api/lots/${currentLot.id}/`, payload);
      setEditOpen(false);
      setCurrentLot(null);
      if (typeof onChanged === "function") onChanged();
    } catch (err) {
      setSaveError(
        err?.response?.data?.detail ||
          "Impossible d’enregistrer le pourcentage."
      );
    } finally {
      setSaving(false);
    }
  };

  // Ouvre le modal de confirmation de suppression
  const askDelete = (lot) => {
    setLotToDelete(lot);
    setDeleteError("");
    setConfirmOpen(true);
  };
  const closeConfirm = () => {
    if (deleting) return;
    setConfirmOpen(false);
    setLotToDelete(null);
    setDeleteError("");
  };

  // DELETE /feicom/api/lots/{id}/
  const confirmDelete = async () => {
    if (!lotToDelete) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await axiosInstance.delete(`/feicom/api/lots/${lotToDelete.id}/`);
      setConfirmOpen(false);
      setLotToDelete(null);
      if (typeof onChanged === "function") onChanged();
    } catch (err) {
      setDeleteError(
        err?.response?.data?.detail ||
          "Suppression impossible. Réessaie plus tard."
      );
    } finally {
      setDeleting(false);
    }
  };

  const badgeFor = (statut) => {
    if (statut === "STARTED") return <span className="badge bg-info ms-2">Started</span>;
    if (statut === "PLANNED") return <span className="badge bg-warning ms-2">Planned</span>;
    if (statut === "COMPLETED") return <span className="badge bg-success ms-2">Completed</span>;
    if (statut === "NOT STARTED") return <span className="badge bg-secondary ms-2">Not started</span>;
    return null;
  };

  const pct = (x) => {
    const v = Number(x);
    return Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : 0;
    // Garantit 0 <= v <= 100 et fallback à 0 si NaN
  };

  if (!lots.length) {
    return <div className="text-muted">Aucun lot pour ce projet.</div>;
  }

  return (
    <div className="w-100 d-flex flex-column gap-3">
      {lots.map((lot) => {
        const isOpen = open === String(lot.id);
        const value = pct(lot.pourcentage);

        // Style du conteneur avec bande de progression en background
        const bgStyle = {
          position: "relative",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          background: "#fff",
        };

        // Remplissage progressif (backdrop)
        const fillStyle = {
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${value}%`,
          background:
            "linear-gradient(90deg, rgba(16,185,129,0.22), rgba(59,130,246,0.18))",
          transition: "width 300ms ease",
          pointerEvents: "none",
        };

        return (
          <div key={lot.id} style={bgStyle}>
            <div style={fillStyle} aria-hidden="true" />

            {/* En-tête du lot */}
            <div
              className="w-100 px-4 py-3 d-flex align-items-center justify-content-between"
              style={{ position: "relative", zIndex: 1 }}
            >
              <div className="d-flex align-items-center gap-2">
                <button
                  onClick={() => toggle(String(lot.id))}
                  aria-expanded={isOpen}
                  className="btn btn-link p-0 text-decoration-none fw-semibold text-dark"
                >
                  {lot.nom}
                </button>
                {badgeFor(lot.statut)}
                <span className="ms-3 small text-muted">
                  {Number.isFinite(Number(lot.pourcentage)) ? `${value}%` : "0%"}
                </span>
              </div>

              <div className="d-flex align-items-center gap-2">
                {/* Modifier le pourcentage */}
                <Button
                  color="secondary"
                  size="sm"
                  onClick={() => openEdit(lot)}
                  title="Mettre à jour le pourcentage"
                >
                  % Modifier
                </Button>

                {/* Supprimer (ouvre le modal de confirmation) */}
                <Button
                  color="danger"
                  outline
                  size="sm"
                  onClick={() => askDelete(lot)}
                  title="Supprimer le lot"
                >
                  <i className="fa fa-trash" />
                </Button>

                {/* Chevron ouvrir/fermer */}
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => toggle(String(lot.id))}
                  aria-label={isOpen ? "Réduire" : "Déployer"}
                >
                  {isOpen ? "▲" : "▼"}
                </button>
              </div>
            </div>

            {/* Corps (todos) */}
            {isOpen && (
              <div
                className="px-3 pb-3 pt-2"
                style={{
                  position: "relative",
                  zIndex: 1,
                  background: "white",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <TodosList todos={lot.todos || []} />
              </div>
            )}
          </div>
        );
      })}

      {/* Modal édition pourcentage */}
      <Modal isOpen={editOpen} toggle={closeEdit} centered>
        <ModalHeader toggle={closeEdit}>Mettre à jour le pourcentage</ModalHeader>
        <ModalBody>
          {currentLot && (
            <>
              <div className="mb-2">
                <div className="fw-semibold">{currentLot.nom}</div>
                <div className="text-muted small">
                  Montant : {currentLot.montant ?? 0}
                </div>
              </div>

              <FormGroup>
                <Label>Pourcentage (0–100)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step="0.1"
                  value={percentInput}
                  onChange={(e) => setPercentInput(e.target.value)}
                />
              </FormGroup>

              {saveError ? (
                <div className="alert alert-danger py-2">{saveError}</div>
              ) : null}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeEdit} disabled={saving}>
            Annuler
          </Button>
          <Button color="primary" onClick={submitPercent} disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal confirmation suppression */}
      <Modal isOpen={confirmOpen} toggle={closeConfirm} centered>
        <ModalHeader toggle={closeConfirm}>Confirmer la suppression</ModalHeader>
        <ModalBody>
          {lotToDelete ? (
            <>
              <p className="mb-2">
                Tu es sur le point de supprimer le lot&nbsp;
                <strong>{lotToDelete.nom}</strong>.
              </p>
              <p className="mb-0 text-danger small">
                Cette action est irréversible.
              </p>
              {deleteError ? (
                <div className="alert alert-danger py-2 mt-3">{deleteError}</div>
              ) : null}
            </>
          ) : (
            "Aucun lot sélectionné."
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeConfirm} disabled={deleting}>
            Annuler
          </Button>
          <Button color="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? "Suppression..." : "Supprimer"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Lots;
