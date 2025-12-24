// src/Components/Pages/FeicomPages/ProjectPage/index.jsx
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import {
  Container, Row, Col, Card, CardBody, CardHeader, Badge, Button,
  Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Progress
} from "reactstrap";
import { Breadcrumbs } from "../../../../AbstractElements";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../../../../api/axios";
import CommonModal from "../../../UiKits/Modals/common/modal";
import Rapport from "../Rapport";
import ProjectVisitForm from "./ProjectVisitForm";

// ==== Composants UI “dumb” ====
import ProjectHeader from "./components/ProjectHeader";
import ProjectTabs from "./components/ProjectTabs";
import ProjectResume from "./components/ProjectResume";
import ProjectFinance from "./components/ProjectFinance";
import ProjectVisitsTable from "./components/ProjectVisitsTable";
import ProjectFiles from "./components/ProjectFiles";
import ProjectLots from "./components/ProjectLots";
import ProjectGallery from "./components/ProjectGallery";
import ImageLightbox from "./components/ImageLightbox";
import ProjectQuickEdit from "./components/ProjectQuickEdit";

dayjs.locale("fr");

// Format monétaire
const money = (n) =>
  (Number(n) || 0).toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " FCFA";

// Catégories de fichiers proposées
const FILE_CATEGORIES = ["CONTRACT", "REPORT", "INVOICE", "PLAN", "LETTER", "PICTURE", "OTHER"];

const SingleProject = () => {
  const { id } = useParams();

  // ---------- States principaux ----------
  const [project, setProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(false);
  const [errorProject, setErrorProject] = useState("");

  // Galerie
  const [gallery, setGallery] = useState({ project: null, count: 0, images: [] });
  const [imgOpen, setImgOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  // Fichiers
  const [files, setFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesError, setFilesError] = useState("");
  const [uploadCategory, setUploadCategory] = useState(FILE_CATEGORIES[0]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Fichiers – accordéon simple
  const [openCat, setOpenCat] = useState("");
  const toggleCat = (cat) => setOpenCat((prev) => (prev === cat ? "" : cat));

  // Fichiers – suppression
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [deletingFile, setDeletingFile] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Onglet actif
  const [active, setActive] = useState("visites");

  // Modals visites
  const [modalAddVisitOpen, setModalAddVisitOpen] = useState(false);
  const [modalVisitOpen, setModalVisitOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [visit, setVisit] = useState(null);

  // Lots – ajout
  const [addLotOpen, setAddLotOpen] = useState(false);
  const [newLotName, setNewLotName] = useState("");
  const [newLotAmount, setNewLotAmount] = useState("");
  const [addingLot, setAddingLot] = useState(false);
  const [addLotError, setAddLotError] = useState("");

  // ---------- Fetchers (avec logs pour debug) ----------
  const loadProject = useCallback(async () => {
    if (!id) return;
    setLoadingProject(true);
    setErrorProject("");
    try {
      const url = `/feicom/api/projets/${id}/`;
      console.log("[PROJECT] GET", url);
      const { data } = await axiosInstance.get(url);
      console.log("[PROJECT] Response:", data);
      setProject(data);
    } catch (e) {
      console.error("[PROJECT] Error:", e?.response?.data || e?.message);
      setErrorProject(e?.response?.data?.detail || "Chargement du projet impossible.");
    } finally {
      setLoadingProject(false);
    }
  }, [id]);

  const loadGallery = useCallback(async () => {
    if (!id) return;
    try {
      const url = `/feicom/api/projets/${id}/images/`;
      console.log("[GALLERY] GET", url);
      const { data } = await axiosInstance.get(url);
      console.log("[GALLERY] Response:", data);
      setGallery(data || { project: id, count: 0, images: [] });
    } catch (e) {
      console.error("[GALLERY] Error:", e?.response?.data || e?.message);
      setGallery({ project: id, count: 0, images: [] });
    }
  }, [id]);

  const loadFiles = useCallback(async () => {
    if (!id) return;
    setFilesLoading(true);
    setFilesError("");
    try {
      const url = `/feicom/api/files/projets/${id}/files/`;
      console.log("[FILES] GET", url);
      const { data } = await axiosInstance.get(url);
      console.log("[FILES] Response:", data);
      setFiles(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("[FILES] Error:", e?.response?.data || e?.message);
      setFiles([]);
      setFilesError(e?.response?.data?.detail || "Impossible de charger les pièces jointes.");
    } finally {
      setFilesLoading(false);
    }
  }, [id]);

  // ---------- Effets init ----------
  useEffect(() => { loadProject(); }, [loadProject]);
  useEffect(() => { loadGallery(); }, [loadGallery]);
  useEffect(() => { loadFiles(); }, [loadFiles]);

  // ---------- Handlers FICHIERS ----------
  const handlePickFiles = (e) => setUploadFiles(Array.from(e.target.files || []));

  const handleUploadFiles = async (e) => {
    e.preventDefault();
    if (!uploadCategory || !uploadFiles.length) return;

    setUploading(true);
    try {
      for (const f of uploadFiles) {
        const formData = new FormData();
        formData.append("projet", id);
        formData.append("category", uploadCategory);
        formData.append("file", f);
        console.log("[FILES] POST /feicom/api/files/upload/", { projet: id, category: uploadCategory, file: f.name });
        await axiosInstance.post("/feicom/api/files/upload/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setUploadFiles([]);
      await loadFiles();
    } catch (e) {
      console.error("[FILES] Upload error:", e?.response?.data || e?.message);
      setFilesError(e?.response?.data?.detail || "Échec de l’upload.");
    } finally {
      setUploading(false);
    }
  };

  const askDeleteFile = (file) => {
    setFileToDelete(file);
    setDeleteError("");
    setConfirmDeleteOpen(true);
  };
  const closeConfirmDelete = () => {
    if (deletingFile) return;
    setConfirmDeleteOpen(false);
    setFileToDelete(null);
    setDeleteError("");
  };
  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    setDeletingFile(true);
    setDeleteError("");
    try {
      const url = `/feicom/api/files/${fileToDelete.id}/`;
      console.log("[FILES] DELETE", url);
      await axiosInstance.delete(url);
      setFiles((prev) => prev.filter((x) => x.id !== fileToDelete.id));
      setConfirmDeleteOpen(false);
      setFileToDelete(null);
    } catch (e) {
      console.error("[FILES] Delete error:", e?.response?.data || e?.message);
      setDeleteError(e?.response?.data?.detail || "Suppression impossible.");
    } finally {
      setDeletingFile(false);
    }
  };

  // ---------- Handlers GALERIE ----------
  const openImageAt = (i) => { setImgIndex(i); setImgOpen(true); };
  const closeImage = () => setImgOpen(false);
  const prevImage = () => setImgIndex((i) => (i - 1 >= 0 ? i - 1 : i));
  const nextImage = () => setImgIndex((i) => (i + 1 < gallery.images.length ? i + 1 : i));

  // Navigation clavier pour la galerie
  useEffect(() => {
    if (!imgOpen) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imgOpen, gallery.images.length]);

  // ---------- Handlers VISITES ----------
  const openAddVisit = () => {
    setModalTitle(<div className="fw-semibold">Fiche de Visite – PCCM / FEICOM</div>);
    setModalAddVisitOpen(true);
  };
  const openVisit = (row) => {
    setVisit(row);
    setModalTitle(<div className="fw-semibold">Visite – PCCM / FEICOM</div>);
    setModalVisitOpen(true);
  };

  // ---------- Handlers LOTS ----------
  const reloadProject = useCallback(async () => { await loadProject(); }, [loadProject]);

  const openAddLot = () => {
    setAddLotError("");
    setNewLotName("");
    setNewLotAmount("");
    setAddLotOpen(true);
  };
  const closeAddLot = () => setAddLotOpen(false);

  const handleCreateLot = async (e) => {
    e.preventDefault();
    setAddLotError("");
    if (!newLotName?.trim()) return setAddLotError("Le nom est requis.");
    if (!newLotAmount || isNaN(Number(newLotAmount))) return setAddLotError("Le montant doit être un nombre.");

    setAddingLot(true);
    try {
      console.log("[LOTS] POST /feicom/api/lots/", {
        nom: newLotName.trim(), statut: "NOT STARTED", montant: Number(newLotAmount), pourcentage: "0", projet: Number(id)
      });
      await axiosInstance.post("/feicom/api/lots/", {
        nom: newLotName.trim(),
        statut: "NOT STARTED",
        montant: Number(newLotAmount),
        pourcentage: "0",
        projet: Number(id),
      });
      setAddLotOpen(false);
      await reloadProject();
      setActive("lots");
    } catch (e) {
      console.error("[LOTS] Create error:", e?.response?.data || e?.message);
      setAddLotError(e?.response?.data?.detail || "Impossible d’ajouter le lot.");
    } finally {
      setAddingLot(false);
    }
  };

  // ---------- Contenu des onglets (branché sur les composants) ----------
  const panes = {
    resume: <ProjectResume project={project} />,
    financement: <ProjectFinance project={project} money={money} />,
    visites: (
      <ProjectVisitsTable
        visits={project?.visites || []}
        loading={loadingProject}
        onOpenVisit={openVisit}
        onAddNew={openAddVisit}
      />
    ),
    fichiers: (
      <ProjectFiles
        files={files}
        filesLoading={filesLoading}
        filesError={filesError}
        uploadCategory={uploadCategory}
        uploadFiles={uploadFiles}
        uploading={uploading}
        onPickFiles={handlePickFiles}
        onUpload={handleUploadFiles}
        onOpenFile={(f) => window.open(f.url || f.file, "_blank", "noopener")}
        onAskDelete={askDeleteFile}
        categories={{ list: FILE_CATEGORIES, onChange: setUploadCategory }}
        openCat={openCat}
        toggleCat={toggleCat}
      />
    ),
    lots: (
      <ProjectLots
        lots={project?.lots || []}
        projectId={project?.id}
        onAdd={openAddLot}
        onChanged={reloadProject}
      />
    ),
  };

  // ---------- Rendu ----------
  if (loadingProject && !project) {
    return (
      <Fragment>
        <Breadcrumbs mainTitle="FEICOM" parent="FEICOM" title="Projet" />
        <Container fluid><p>Chargement du projet…</p></Container>
      </Fragment>
    );
  }
  if (errorProject) {
    return (
      <Fragment>
        <Breadcrumbs mainTitle="FEICOM" parent="FEICOM" title="Projet" />
        <Container fluid>
          <div className="alert alert-warning">{errorProject}</div>
          <Button color="secondary" onClick={loadProject}>Réessayer</Button>
        </Container>
      </Fragment>
    );
  }
  if (!project) return null;

  return (
    <Fragment>
      <Breadcrumbs mainTitle="FEICOM" parent="FEICOM" title={`Projet #${project.id}`} />
      <Container fluid>
        <Row className="g-3">
          <Col lg="9" xl="9">
            {/* Bandeau entête + mini KPIs */}
            <ProjectHeader
              project={project}
              money={money}
              rightActions={
                <ProjectQuickEdit
                  project={project}
                  onUpdated={async () => {
                    // soit on remplace le state par "data" retournée,
                    // soit on refetch pour être sûr d’avoir le dernier état backend
                    await loadProject();
                  }}
                />
              }
            />

            {/* Onglets + contenus */}
            <ProjectTabs active={active} setActive={setActive} panes={panes} />
          </Col>

          <Col lg="3" xl="3">
            {/* Carte Galerie (colonne droite) */}
            <ProjectGallery gallery={gallery} onOpenAt={openImageAt} />
          </Col>
        </Row>
      </Container>

      {/* Lightbox image */}
      <ImageLightbox
        isOpen={imgOpen}
        onClose={closeImage}
        src={gallery?.images?.[imgIndex]}
        index={imgIndex}
        count={gallery?.images?.length || 0}
        onPrev={prevImage}
        onNext={nextImage}
      />

      {/* Modal ajout de visite */}
      <CommonModal
        isOpen={modalAddVisitOpen}
        title={<div className="fw-semibold">Fiche de Visite – PCCM / FEICOM</div>}
        toggler={() => setModalAddVisitOpen(false)}
        size="lg"
      >
        <ProjectVisitForm
          projetId={id}
          onSubmit={async () => {
            await reloadProject();
            setModalAddVisitOpen(false);
          }}
        />
      </CommonModal>

      {/* Modal consultation Visite → Rapport */}
      <CommonModal
        isOpen={modalVisitOpen}
        title={<div className="fw-semibold">Visite – PCCM / FEICOM</div>}
        toggler={() => setModalVisitOpen(false)}
        size="lg"
      >
        <Rapport project={project} visit={visit} />
      </CommonModal>

      {/* Modal ajout Lot */}
      <CommonModal
        isOpen={addLotOpen}
        title={<div className="fw-semibold">Ajouter un lot</div>}
        toggler={closeAddLot}
        size="md"
      >
        <form onSubmit={handleCreateLot} className="p-2">
          <div className="mb-3">
            <Label className="form-label">Nom du lot</Label>
            <Input
              type="text"
              placeholder="Ex. Terrassements"
              value={newLotName}
              onChange={(e) => setNewLotName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Label className="form-label">Montant</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="Ex. 12500000"
              value={newLotAmount}
              onChange={(e) => setNewLotAmount(e.target.value)}
            />
          </div>
          {addLotError && <div className="alert alert-danger py-2">{addLotError}</div>}
          <div className="d-flex justify-content-end gap-2">
            <Button type="button" color="secondary" onClick={closeAddLot} disabled={addingLot}>
              Annuler
            </Button>
            <Button type="submit" color="primary" disabled={addingLot}>
              {addingLot ? "Enregistrement..." : "Ajouter"}
            </Button>
          </div>
        </form>
      </CommonModal>

      {/* Modal confirmation suppression fichier */}
      <Modal isOpen={confirmDeleteOpen} toggle={closeConfirmDelete} centered>
        <ModalHeader toggle={closeConfirmDelete}>Confirmer la suppression</ModalHeader>
        <ModalBody>
          {fileToDelete ? (
            <>
              <p className="mb-2">
                Tu es sur le point de supprimer le fichier&nbsp;
                <strong>{(fileToDelete.file || fileToDelete.url || "").split("/").pop()}</strong>.
              </p>
              <p className="mb-0 text-danger small">Cette action est irréversible.</p>
              {deleteError && <div className="alert alert-danger py-2 mt-3">{deleteError}</div>}
            </>
          ) : ("Aucun fichier sélectionné.")}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeConfirmDelete} disabled={deletingFile}>Annuler</Button>
          <Button color="danger" onClick={confirmDeleteFile} disabled={deletingFile}>
            {deletingFile ? "Suppression..." : "Supprimer"}
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default SingleProject;
