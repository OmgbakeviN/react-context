// ImageLightbox.jsx
import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

/**
 * Modal image avec contrôles précédent/suivant
 * Props:
 *  - isOpen, onClose, src, index, count, onPrev, onNext
 */
const ImageLightbox = ({ isOpen, onClose, src, index, count, onPrev, onNext }) => (
  <Modal isOpen={isOpen} toggle={onClose} size="xl" centered>
    <ModalHeader toggle={onClose}>Image {index + 1} / {count}</ModalHeader>
    <ModalBody className="d-flex justify-content-center">
      {src && <img src={src} alt={`Projet image ${index + 1}`} className="img-fluid" style={{ maxHeight: "80vh", userSelect: "none" }} />}
    </ModalBody>
    <ModalFooter className="d-flex justify-content-between">
      <Button color="secondary" onClick={onPrev} disabled={index === 0}>← Précédent</Button>
      <div className="text-muted small">Utilise les flèches ← → du clavier</div>
      <Button color="primary" onClick={onNext} disabled={index + 1 >= count}>Suivant →</Button>
    </ModalFooter>
  </Modal>
);

export default ImageLightbox;
