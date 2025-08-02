// src/components/Departements/DeleteConfirm.js
import React from 'react';
import { Btn } from '../../../../AbstractElements';

const DeleteConfirm = ({ nom, onConfirm, onCancel }) => (
  <div>
    <p>Voulez-vous vraiment supprimer <strong>{nom}</strong> ?</p>
    <div className="d-flex gap-2">
      <Btn attrBtn={{ color: 'secondary', onClick: onCancel }}>Annuler</Btn>
      <Btn attrBtn={{ color: 'danger', onClick: onConfirm }}>Supprimer</Btn>
    </div>
  </div>
);
export default DeleteConfirm;
