import React, { useEffect, useState } from 'react';
import { Btn } from '../../../../AbstractElements';
import Select from 'react-select';
import axiosInstance from '../../../../api/axios';

const DepartementForm = ({ initialData = {}, onSave, onCancel }) => {
  const [nom, setNom] = useState(initialData.nom || "");
  // Si initialData.agence est un id, on prend le nombre. Si c'est un objet, on prend .id
  const [agence, setAgence] = useState(
    typeof initialData.agence === "object"
      ? initialData.agence.id
      : initialData.agence || ""
  );
  const [agenceOptions, setAgenceOptions] = useState([]);
  const [loadingAgences, setLoadingAgences] = useState(false);

  useEffect(() => {
    setLoadingAgences(true);
    axiosInstance.get('/feicom/api/agences/')
      .then(res => {
        const options = res.data
          .filter(item => typeof item.id === "number" && item.nom)
          .map(item => ({
            value: item.id,
            label: `${item.id} - ${item.nom}`
          }));
        setAgenceOptions(options);
      })
      .catch(() => setAgenceOptions([]))
      .finally(() => setLoadingAgences(false));
  }, []);

  // Pour sélectionner la bonne option lors de l'édition
  const selectedAgenceOption = agenceOptions.find(opt => opt.value === agence) || null;

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ nom, agence }); // agence = id number
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label>Nom du Département</label>
        <input className="form-control" value={nom} onChange={e => setNom(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label>Agence</label>
        <Select
          isLoading={loadingAgences}
          options={agenceOptions}
          value={selectedAgenceOption}
          onChange={opt => setAgence(opt ? opt.value : "")}
          placeholder="Sélectionnez une agence"
          isClearable
        />
      </div>
      <div className="d-flex gap-2">
        <Btn attrBtn={{ color: 'secondary', type: 'button', onClick: onCancel }}>Annuler</Btn>
        <Btn attrBtn={{ color: 'primary', type: 'submit' }}>Valider</Btn>
      </div>
    </form>
  );
};

export default DepartementForm;
 