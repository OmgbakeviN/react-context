import React, { Fragment, useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Btn, H4 } from '../../../../AbstractElements';
import axiosInstance from '../../../../api/axios';
import CommonModal from '../../../UiKits/Modals/common/modal';

// --- Formulaire exercice ---
const ExerciceForm = ({ initialData = {}, onSave, onCancel }) => {
  const [budget, setBudget] = useState(initialData.budget || "");
  const [annee, setAnnee] = useState(initialData.annee || "");
  const [taux_consomme, setTauxConsomme] = useState(initialData.taux_consomme || "");
  const [pourcentage_consomme, setPourcentageConsomme] = useState(initialData.pourcentage_consomme || "");

  useEffect(() => {
    setBudget(initialData.budget || "");
    setAnnee(initialData.annee || "");
    setTauxConsomme(initialData.taux_consomme || "");
    setPourcentageConsomme(initialData.pourcentage_consomme || "");
  }, [initialData.id]);

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ budget, annee, taux_consomme, pourcentage_consomme });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label>Budget</label>
        <input className="form-control" type="number" step="0.01" value={budget} onChange={e => setBudget(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Année</label>
        <input className="form-control" type="number" value={annee} onChange={e => setAnnee(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Taux consommé</label>
        <input className="form-control" type="number" step="0.01" value={taux_consomme} onChange={e => setTauxConsomme(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Pourcentage consommé</label>
        <input className="form-control" type="number" step="0.01" value={pourcentage_consomme} onChange={e => setPourcentageConsomme(e.target.value)} required />
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
      Voulez-vous vraiment supprimer {noms.length > 1 ? "les exercices sélectionnés" : "cet exercice"} ?
      <br />
      <strong>{noms.join(', ')}</strong>
    </p>
    <div className="d-flex gap-2">
      <Btn attrBtn={{ color: 'secondary', onClick: onCancel }}>Annuler</Btn>
      <Btn attrBtn={{ color: 'danger', onClick: onConfirm }}>Supprimer</Btn>
    </div>
  </div>
);

const ExerciceTable = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const [error, setError] = useState(null);

  // -- API fetch --
  const fetchExercices = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/feicom/api/exercices/');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la récupération des exercices : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercices();
  }, []);

  // Suppression multiple
  const handleDelete = () => {
    setModalTitle('Suppression de plusieurs exercices');
    setModalContent(
      <DeleteConfirm
        noms={selectedRows.map(r => `Exercice ${r.annee}`)}
        onConfirm={async () => {
          try {
            await Promise.all(
              selectedRows.map(row =>
                axiosInstance.delete(`/feicom/api/exercices/${row.id}/`)
              )
            );
            setToggleDelet(!toggleDelet);
            setModalOpen(false); 
            fetchExercices();
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
    setModalTitle('Suppression de l\'exercice');
    setModalContent(
      <DeleteConfirm
        noms={[`Exercice ${row.annee}`]}
        onConfirm={async () => {
          await axiosInstance.delete(`/feicom/api/exercices/${row.id}/`);
          setModalOpen(false);
          fetchExercices();
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // Ajout
  const handleAdd = () => {
    setModalTitle('Ajouter un exercice');
    setModalContent(
      <ExerciceForm
        onSave={async (data) => {
          await axiosInstance.post('/feicom/api/exercices/', data);
          setModalOpen(false);
          fetchExercices();
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // Modification
  const handleEdit = row => {
    setModalTitle('Modifier l\'exercice');
    setModalContent(
      <ExerciceForm
        initialData={row}
        onSave={async (data) => {
          await axiosInstance.put(`/feicom/api/exercices/${row.id}/`, data);
          setModalOpen(false);
          fetchExercices();
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
    { name: "Budget", selector: row => row.budget, sortable: true },
    { name: "Année", selector: row => row.annee, sortable: true },
    { name: "Taux consommé", selector: row => row.taux_consomme },
    { name: "Pourcentage consommé", selector: row => row.pourcentage_consomme },
    {
      name: 'Actions',
      cell: row => (
        <div className='d-flex gap-2'>
          <Btn attrBtn={{ color: 'primary', size: 'sm', onClick: () => handleEdit(row) }}>Modifier</Btn>
          <Btn attrBtn={{ color: 'danger', size: 'sm', onClick: () => handleDeleteSingle(row) }}>Supprimer</Btn>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <Fragment>
      <div className='d-flex align-items-center justify-content-between mb-2'>
        <H4 attrH4={{ className: 'text-muted m-0' }}>Gestion des Exercices</H4>
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

export default ExerciceTable;
