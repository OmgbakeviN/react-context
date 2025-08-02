import React, { Fragment, useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Btn, H4 } from '../../../../AbstractElements';
import axiosInstance from '../../../../api/axios';
import CommonModal from '../../../UiKits/Modals/common/modal';

// --- Formulaire Projet ---
const ProjetForm = ({ initialData = {}, onSave, onCancel }) => {
  const [libelle, setLibelle] = useState(initialData.libelle || "");
  const [duree, setDuree] = useState(initialData.duree || "");
  const [montant_ht, setMontantHt] = useState(initialData.montant_ht || "");
  const [type, setType] = useState(initialData.type || "");
  const [numero_convention, setNumeroConvention] = useState(initialData.numero_convention || "");
  const [date_debut, setDateDebut] = useState(initialData.date_debut || "");
  const [date_fin, setDateFin] = useState(initialData.date_fin || "");
  const [entreprise, setEntreprise] = useState(
    typeof initialData.entreprise === "object"
      ? initialData.entreprise.id
      : initialData.entreprise || ""
  );
  const [commune, setCommune] = useState(
    typeof initialData.commune === "object"
      ? initialData.commune.id
      : initialData.commune || ""
  );

  const [entrepriseOptions, setEntrepriseOptions] = useState([]);
  const [communeOptions, setCommuneOptions] = useState([]);
  const [loadingEntreprises, setLoadingEntreprises] = useState(false);
  const [loadingCommunes, setLoadingCommunes] = useState(false);

  // Charger les entreprises
  useEffect(() => {
    setLoadingEntreprises(true);
    axiosInstance.get('/feicom/api/entreprises/')
      .then(res => {
        const options = res.data.map(item => ({
          value: item.id,
          label: `${item.id} - ${item.nom}`
        }));
        setEntrepriseOptions(options);
      })
      .finally(() => setLoadingEntreprises(false));
  }, []);

  // Charger les communes
  useEffect(() => {
    setLoadingCommunes(true);
    axiosInstance.get('/feicom/api/communes/')
      .then(res => {
        const options = res.data.map(item => ({
          value: item.id,
          label: `${item.id} - ${item.nom}`
        }));
        setCommuneOptions(options);
      })
      .finally(() => setLoadingCommunes(false));
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ libelle, duree, montant_ht, type, numero_convention, date_debut, date_fin, entreprise, commune });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label>Libellé</label>
        <input className="form-control" value={libelle} onChange={e => setLibelle(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Durée</label>
        <input className="form-control" type="number" value={duree} onChange={e => setDuree(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Montant HT</label>
        <input className="form-control" type="number" value={montant_ht} onChange={e => setMontantHt(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Type</label>
        <select className="form-control" value={type} onChange={e => setType(e.target.value)} required>
          <option value="">Sélectionnez un type</option>
          <option value="INFRA">INFRA</option>
          <option value="ETUDE">ETUDE</option>
          {/* Ajoute d'autres types si besoin */}
        </select>
      </div>
      <div className="mb-2">
        <label>Numéro de convention</label>
        <input className="form-control" value={numero_convention} onChange={e => setNumeroConvention(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Date de début</label>
        <input className="form-control" type="date" value={date_debut} onChange={e => setDateDebut(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Date de fin</label>
        <input className="form-control" type="date" value={date_fin} onChange={e => setDateFin(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Entreprise</label>
        <select
          className="form-control"
          value={entreprise}
          onChange={e => setEntreprise(Number(e.target.value))}
          required
          disabled={loadingEntreprises}
        >
          <option value="">Sélectionnez une entreprise</option>
          {entrepriseOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label>Commune</label>
        <select
          className="form-control"
          value={commune}
          onChange={e => setCommune(Number(e.target.value))}
          required
          disabled={loadingCommunes}
        >
          <option value="">Sélectionnez une commune</option>
          {communeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="d-flex gap-2 mt-2">
        <Btn attrBtn={{ color: 'secondary', type: 'button', onClick: onCancel }}>Annuler</Btn>
        <Btn attrBtn={{ color: 'primary', type: 'submit' }}>Valider</Btn>
      </div>
    </form>
  );
};

// --- Modale de suppression multiple/simple ---
const DeleteConfirm = ({ noms, onConfirm, onCancel }) => (
  <div>
    <p>
      Voulez-vous vraiment supprimer {noms.length > 1 ? "les projets suivants" : "ce projet"} ?<br />
      <strong>{noms.join(', ')}</strong>
    </p>
    <div className="d-flex gap-2">
      <Btn attrBtn={{ color: 'secondary', onClick: onCancel }}>Annuler</Btn>
      <Btn attrBtn={{ color: 'danger', onClick: onConfirm }}>Supprimer</Btn>
    </div>
  </div>
);

const ProjetTable = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const [error, setError] = useState(null);

  // -- API fetch --
  const fetchProjets = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/feicom/api/projets/');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la récupération des projets : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjets();
  }, []);

  // Suppression multiple
  const handleDelete = () => {
    setModalTitle('Suppression de plusieurs projets');
    setModalContent(
      <DeleteConfirm
        noms={selectedRows.map(r => r.libelle)}
        onConfirm={async () => {
          try {
            await Promise.all(
              selectedRows.map(row =>
                axiosInstance.delete(`/feicom/api/projets/${row.id}/`)
              )
            );
            setToggleDelet(!toggleDelet);
            setModalOpen(false); 
            fetchProjets();
          } catch (err) {
            setError("Erreur lors de la suppression : " + err.message);
          }
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // Suppression simple
  const handleDeleteSingle = row => {
    setModalTitle('Suppression du projet');
    setModalContent(
      <DeleteConfirm
        noms={[row.libelle]}
        onConfirm={async () => {
          await axiosInstance.delete(`/feicom/api/projets/${row.id}/`);
          setModalOpen(false);
          fetchProjets();
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // Ajout
  const handleAdd = () => {
    setModalTitle('Ajouter un projet');
    setModalContent(
      <ProjetForm
        onSave={async (data) => {
          await axiosInstance.post('/feicom/api/projets/', data);
          setModalOpen(false);
          fetchProjets();
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // Modification
  const handleEdit = row => {
    setModalTitle('Modifier le projet');
    setModalContent(
      <ProjetForm
        initialData={row}
        onSave={async (data) => {
          await axiosInstance.put(`/feicom/api/projets/${row.id}/`, data);
          setModalOpen(false);
          fetchProjets();
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const handleRowSelected = useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, []);

  // Colonnes du tableau
  const tableColumns = [
    { name: '#', selector: (row, index) => index + 1, width: '50px', center: true },
    { name: "Libellé", selector: row => row.libelle, sortable: true },
    { name: "Durée", selector: row => row.duree },
    { name: "Montant HT", selector: row => row.montant_ht },
    { name: "Type", selector: row => row.type },
    { name: "Numéro convention", selector: row => row.numero_convention },
    { name: "Date début", selector: row => row.date_debut },
    { name: "Date fin", selector: row => row.date_fin },
    { name: "Entreprise", selector: row => row.entreprise }, // affichera l'id
    { name: "Commune", selector: row => row.commune },       // affichera l'id
    {
      name: 'Actions',
      cell: row => (
        <div className='d-flex gap-1'>
          <Btn attrBtn={{ 
            color: 'primary', 
            size: 'sm', 
            className: 'btn-sm py-1 px-2', 
            onClick: () => handleEdit(row) 
          }}>
            <i className="fa fa-edit"></i>
          </Btn>
          <Btn attrBtn={{ 
            color: 'danger', 
            size: 'sm', 
            className: 'btn-sm py-1 px-2', 
            onClick: () => handleDeleteSingle(row) 
          }}>
            <i className="fa fa-trash"></i>
          </Btn>
        </div>
      ),
      width: '120px',
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <Fragment>
      <div className='d-flex align-items-center justify-content-between mb-2'>
        <H4 attrH4={{ className: 'text-muted m-0' }}>Gestion des Projets</H4>
        <Btn attrBtn={{ color: 'success', onClick: handleAdd }}>Ajouter</Btn>
      </div>
      {error && <div className='alert alert-danger'>{error}</div>}
      {selectedRows.length > 0 && (
        <div className='d-flex align-items-center justify-content-between bg-light-info p-2 mb-2'>
          <H4 attrH4={{ className: 'text-muted m-0' }}>Supprimer la sélection</H4>
          <Btn attrBtn={{ color: 'danger', onClick: handleDelete }}>Supprimer</Btn>
        </div>
      )}
      <DataTable
        data={data}
        columns={tableColumns}
        striped
        center
        pagination
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleDelet}
        progressPending={loading}
        noDataComponent="Aucune donnée"
      />
      <CommonModal isOpen={modalOpen} title={modalTitle} toggler={() => setModalOpen(false)}>
        {modalContent}
      </CommonModal>
    </Fragment>
  );
};

export default ProjetTable;
