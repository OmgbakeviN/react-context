// ProjectFiles.jsx
import React from "react";
import { Card, CardBody, FormGroup, Label, Input, Button, ListGroup, ListGroupItem, Badge } from "reactstrap";
import dayjs from "dayjs";

/**
 * Onglet "Pièces jointes"
 * Props:
 *  - files: []
 *  - filesLoading: bool
 *  - filesError: string
 *  - uploadCategory: string
 *  - uploadFiles: File[]
 *  - uploading: bool
 *  - onPickFiles: (e) => void
 *  - onUpload: (e) => Promise<void>
 *  - onOpenFile: (f) => void
 *  - onAskDelete: (f) => void
 *  - categories: string[]
 *  - openCat: string
 *  - toggleCat: (cat) => void
 */
const ProjectFiles = ({
  files, filesLoading, filesError,
  uploadCategory, uploadFiles, uploading,
  onPickFiles, onUpload, onOpenFile, onAskDelete,
  categories, openCat, toggleCat
}) => {
  // helpers
  const filenameFrom = (f) => {
    const s = f?.file || f?.url || "";
    try {
      const decoded = decodeURIComponent(s);
      return decoded.split("/").pop() || s;
    } catch {
      return s.split("/").pop() || s;
    }
  };
  const groupByCategory = (items) => {
    const map = {};
    (items || []).forEach((it) => {
      const cat = it.category || "UNCATEGORIZED";
      if (!map[cat]) map[cat] = [];
      map[cat].push(it);
    });
    return map;
  };

  return (
    <Card>
      <CardBody>
        <div className="fw-bold mb-3">Pièces jointes</div>

        {/* Formulaire d'upload (multipart/form-data) */}
        <form onSubmit={onUpload} className="d-flex flex-wrap gap-2 align-items-end mb-3">
          <FormGroup className="me-2 mb-2">
            <Label className="form-label">Catégorie</Label>
            <Input type="select" value={uploadCategory} onChange={(e) => categories.onChange(e.target.value)}>
              {categories.list.map((c) => (<option key={c} value={c}>{c}</option>))}
            </Input>
          </FormGroup>

          <FormGroup className="me-2 mb-2">
            <Label className="form-label">Fichiers</Label>
            <Input type="file" multiple onChange={onPickFiles} />
          </FormGroup>

          <div className="mb-2">
            <Button color="primary" type="submit" disabled={uploading}>
              {uploading ? "Envoi..." : "Ajouter"}
            </Button>
          </div>
        </form>

        {uploadFiles?.length > 0 && (
          <div className="small text-muted mb-3">{uploadFiles.length} fichier(s) sélectionné(s)</div>
        )}

        {filesError && <div className="alert alert-warning py-2">{filesError}</div>}

        {/* Explorer par catégories */}
        {filesLoading ? (
          <div className="text-muted small">Chargement des fichiers…</div>
        ) : (
          (() => {
            const byCat = groupByCategory(files);
            const cats = Object.keys(byCat).sort();
            if (!cats.length) return <div className="text-muted small">Aucun fichier pour ce projet.</div>;

            return (
              <div className="d-flex flex-column gap-2">
                {cats.map((cat) => {
                  const isOpen = openCat === cat;
                  const wrapStyle = { position: "relative", overflow: "hidden", border: "1px solid #e5e7eb", borderRadius: 12, background: "#fff" };
                  const headerStyle = { position: "relative", zIndex: 1 };

                  return (
                    <div key={cat} style={wrapStyle}>
                      <div className="w-100 px-4 py-3 d-flex align-items-center justify-content-between" style={headerStyle}>
                        <div className="d-flex align-items-center gap-2">
                          <button onClick={() => toggleCat(cat)} className="btn btn-link p-0 text-decoration-none fw-semibold text-dark" type="button">
                            {cat}
                          </button>
                          <Badge color="light" className="text-muted">{byCat[cat].length}</Badge>
                        </div>
                        <button className="btn btn-light btn-sm" onClick={() => toggleCat(cat)} type="button">{isOpen ? "▲" : "▼"}</button>
                      </div>

                      {isOpen && (
                        <div className="px-3 pb-3 pt-2" style={{ borderTop: "1px solid #e5e7eb" }}>
                          <ListGroup flush>
                            {byCat[cat].map((f) => (
                              <ListGroupItem key={f.id} className="d-flex justify-content-between align-items-center">
                                <div className="text-truncate me-2" style={{ maxWidth: 420 }}>
                                  <div className="fw-semibold text-truncate">{filenameFrom(f)}</div>
                                  {f.created_at && (
                                    <div className="small text-muted">Ajouté le {dayjs(f.created_at).format("DD/MM/YYYY HH:mm")}</div>
                                  )}
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                  <Button color="primary" size="sm" outline onClick={() => onOpenFile(f)}>
                                    <i className="fa fa-eye" />
                                  </Button>
                                  <Button color="danger" size="sm" outline onClick={() => onAskDelete(f)}>
                                    <i className="fa fa-trash" />
                                  </Button>
                                </div>
                              </ListGroupItem>
                            ))}
                          </ListGroup>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()
        )}
      </CardBody>
    </Card>
  );
};

export default ProjectFiles;
