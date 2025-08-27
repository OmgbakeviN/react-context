import React, { Fragment, useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Btn, H4 } from '../../../../AbstractElements';
import axiosInstance from '../../../../api/axios';
import CommonModal from '../../../UiKits/Modals/common/modal';

// --- Formulaire visite ---
const VisiteForm = ({ initialData = {}, onSave, onCancel }) => {
  const [date, setDate] = useState(initialData.date || "");
  const [old_record, setOldRecord] = useState(initialData.old_record || "");
  const [new_record, setNewRecord] = useState(initialData.new_record || "");
  const [observation, setObservation] = useState(initialData.observation || "");
  const [image, setImage] = useState(initialData.image || "");
  const [projet, setProjet] = useState(
    typeof initialData.projet === "object"
      ? initialData.projet.id
      : initialData.projet || ""
  );
  const [projetOptions, setProjetOptions] = useState([]);
  const [loadingProjets, setLoadingProjets] = useState(false);

  // Charger les projets pour le select
  useEffect(() => {
    setLoadingProjets(true);
    axiosInstance.get('/feicom/api/projets/')
      .then(res => {
        const options = res.data.map(item => ({
          value: item.id,
          label: `${item.id} - ${item.libelle || item.nom || 'Projet'}`
        }));
        setProjetOptions(options);
      })
      .finally(() => setLoadingProjets(false));
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ date, old_record, new_record, observation, image, projet });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label>Date</label>
        <input className="form-control" type="date" value={date} onChange={e => setDate(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Ancien relevé</label>
        <input className="form-control" value={old_record} onChange={e => setOldRecord(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Nouveau relevé</label>
        <input className="form-control" value={new_record} onChange={e => setNewRecord(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Observation</label>
        <input className="form-control" value={observation} onChange={e => setObservation(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Image (lien ou nom fichier)</label>
        <input className="form-control" value={image} onChange={e => setImage(e.target.value)} />
      </div>
      <div className="mb-2">
        <label>Projet</label>
        <select
          className="form-control"
          value={projet}
          onChange={e => setProjet(Number(e.target.value))}
          required
          disabled={loadingProjets}
        >
          <option value="">Sélectionnez un projet</option>
          {projetOptions.map(opt => (
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
      Voulez-vous vraiment supprimer {noms.length > 1 ? "les visites sélectionnées" : "cette visite"} ?<br />
      <strong>{noms.join(', ')}</strong>
    </p>
    <div className="d-flex gap-2">
      <Btn attrBtn={{ color: 'secondary', onClick: onCancel }}>Annuler</Btn>
      <Btn attrBtn={{ color: 'danger', onClick: onConfirm }}>Supprimer</Btn>
    </div>
  </div>
);

const VisiteTable = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  // -- API fetch --
  const fetchVisites = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/feicom/api/visites/');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la récupération des visites : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // filtering search
  const filteredData = data.filter(row => 
    Object.values(row).join(' ').toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    fetchVisites();
  }, []);

  // Suppression multiple
  const handleDelete = () => {
    setModalTitle('Suppression de plusieurs visites');
    setModalContent(
      <DeleteConfirm
        noms={selectedRows.map(r => `Visite du ${r.date}`)}
        onConfirm={async () => {
          try {
            await Promise.all(
              selectedRows.map(row =>
                axiosInstance.delete(`/feicom/api/visites/${row.id}/`)
              )
            );
            setToggleDelet(!toggleDelet);
            setModalOpen(false); 
            fetchVisites();
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
    setModalTitle('Suppression de la visite');
    setModalContent(
      <DeleteConfirm
        noms={[`Visite du ${row.date}`]}
        onConfirm={async () => {
          await axiosInstance.delete(`/feicom/api/visites/${row.id}/`);
          setModalOpen(false);
          fetchVisites();
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // Ajout
  const handleAdd = () => {
    setModalTitle('Ajouter une visite');
    setModalContent(
      <VisiteForm
        onSave={async (data) => {
          await axiosInstance.post('/feicom/api/visites/', data);
          setModalOpen(false);
          fetchVisites();
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // Modification
  const handleEdit = row => {
    setModalTitle('Modifier la visite');
    setModalContent(
      <VisiteForm
        initialData={row}
        onSave={async (data) => {
          await axiosInstance.put(`/feicom/api/visites/${row.id}/`, data);
          setModalOpen(false);
          fetchVisites();
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
    { name: "Date", selector: row => row.date, sortable: true },
    { name: "Ancien relevé", selector: row => row.old_record },
    { name: "Nouveau relevé", selector: row => row.new_record },
    { name: "Observation", selector: row => row.observation },
    { name: "Projet", selector: row => row.projet.libelle }, // (affiche l'id du projet, tu peux mapper le nom si tu veux)
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
        <H4 attrH4={{ className: 'text-muted m-0' }}>Gestion des Visites</H4>
        <Btn attrBtn={{ color: 'success', onClick: handleAdd }}>Ajouter</Btn>
      </div>
      <input type="text" className="form-control mb-2" placeholder="Recherche" onChange={e => setSearchText(e.target.value)} />
      {error && <div className='alert alert-danger'>{error}</div>}
      {selectedRows.length > 0 && (
        <div className='d-flex align-items-center justify-content-between bg-light-info p-2 mb-2'>
          <H4 attrH4={{ className: 'text-muted m-0' }}>Supprimer la sélection</H4>
          <Btn attrBtn={{ color: 'danger', onClick: handleDelete }}>Supprimer</Btn>
        </div>
      )}
      <DataTable
        data={filteredData}
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

export default VisiteTable;
