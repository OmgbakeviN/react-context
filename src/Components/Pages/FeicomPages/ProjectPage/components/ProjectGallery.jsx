// ProjectGallery.jsx
import React from "react";
import { Card, CardBody, CardHeader, Badge } from "reactstrap";

/**
 * Carte "Galerie"
 * Props:
 *  - gallery: { project, count, images: [] }
 *  - onOpenAt: fn(index) => void // ouvre le lightbox au clic
 */
const ProjectGallery = ({ gallery, onOpenAt }) => {
  const count = gallery?.count || gallery?.images?.length || 0;

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-white d-flex justify-content-between align-items-center">
        <span>Galerie du projet</span>
        <Badge color="light" className="text-muted">{count} image(s)</Badge>
      </CardHeader>
      <CardBody>
        {!gallery?.images?.length ? (
          <div className="text-muted small">Aucune image disponible pour ce projet.</div>
        ) : (
          <div className="d-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {gallery.images.map((src, i) => (
              <button
                key={src}
                onClick={() => onOpenAt(i)}
                className="p-0 border-0 bg-transparent"
                style={{ width: "100%", aspectRatio: "1 / 1", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
                title={`Ouvrir l’image ${i + 1}`}
              >
                <img src={src} alt={`Projet image ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ProjectGallery;
