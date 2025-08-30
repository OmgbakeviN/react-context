import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Btn, H4 } from '../../../../AbstractElements';
import CommonModal from '../../../UiKits/Modals/common/modal';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchExercices,
  createExercice,
  updateExercice,
  deleteExercice,
  deleteManyExercices,
  selectExercices,
  selectExercicesLoading,
  selectExercicesError,
} from '../../../../reduxtool/exercicesSlice';

// --- Formulaire exercice ---
const ExerciceForm = ({ initialData = {}, onSave, onCancel }) => {
  const [budget, setBudget] = useState(initialData.budget ?? '');
  const [annee, setAnnee] = useState(initialData.annee ?? '');
  const [taux_consomme, setTauxConsomme] = useState(initialData.taux_consomme ?? '');
  const [pourcentage_consomme, setPourcentageConsomme] = useState(initialData.pourcentage_consomme ?? '');

  useEffect(() => {
    setBudget(initialData.budget ?? '');
    setAnnee(initialData.annee ?? '');
    setTauxConsomme(initialData.taux_consomme ?? '');
    setPourcentageConsomme(initialData.pourcentage_consomme ?? '');
  }, [initialData.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      budget,
      annee,
      taux_consomme,
      pourcentage_consomme,
    });
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
        <label>Taux consommé (%)</label>
        <input className="form-control" type="number" step="0.01" value={taux_consomme} onChange={e => setTauxConsomme(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Pourcentage consommé (%)</label>
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
      Voulez-vous vraiment supprimer {noms.length > 1 ? 'les exercices sélectionnés' : 'cet exercice'} ?
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
  const dispatch = useDispatch();

  // Redux state
  const items   = useSelector(selectExercices);
  const loading = useSelector(selectExercicesLoading);
  const error   = useSelector(selectExercicesError);

  // UI local
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  // Fetch au montage
  useEffect(() => {
    dispatch(fetchExercices());
  }, [dispatch]);

  // Recherche
  const filteredData = useMemo(() => {
    const q = searchText?.trim().toLowerCase();
    if (!q) return items || [];
    return (items || []).filter(row =>
      Object.values(row || {}).join(' ').toLowerCase().includes(q)
    );
  }, [items, searchText]);

  // CRUD
  const handleAdd = () => {
    setModalTitle('Ajouter un exercice');
    setModalContent(
      <ExerciceForm
        onSave={async (form) => {
          await dispatch(createExercice(form)).unwrap();
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setModalTitle("Modifier l'exercice");
    setModalContent(
      <ExerciceForm
        initialData={row}
        onSave={async (form) => {
          await dispatch(updateExercice({ id: row.id, data: form })).unwrap();
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const handleDeleteSingle = (row) => {
    setModalTitle("Suppression de l'exercice");
    setModalContent(
      <DeleteConfirm
        noms={[`Exercice ${row.annee}`]}
        onConfirm={async () => {
          await dispatch(deleteExercice(row.id)).unwrap();
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const handleDeleteMany = () => {
    setModalTitle('Suppression de plusieurs exercices');
    setModalContent(
      <DeleteConfirm
        noms={selectedRows.map(r => `Exercice ${r.annee}`)}
        onConfirm={async () => {
          await dispatch(deleteManyExercices(selectedRows.map(r => r.id))).unwrap();
          setToggleDelet(v => !v);
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  // Helpers affichage % (convertir string -> nombre sûr)
  const toPct = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.min(Math.max(n, 0), 100) : 0;
  };

  // Colonnes
  const tableColumns = [
    { name: '#', selector: (row, index) => index + 1, width: '60px', center: true },
    { name: 'Budget', selector: row => row.budget, sortable: true },
    { name: 'Année', selector: row => row.annee, sortable: true },
    {
      name: 'Taux consommé',
      selector: row => row.taux_consomme,
      sortable: true,
      cell: row => {
        const val = toPct(row.taux_consomme);
        return (
          <div className="progress" style={{ height: 20, minWidth: 120 }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${val}%` }}
              aria-valuenow={val}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {val}%
            </div>
          </div>
        );
      }
    },
    {
      name: 'Pourcentage consommé',
      selector: row => row.pourcentage_consomme,
      sortable: true,
      cell: row => {
        const val = toPct(row.pourcentage_consomme);
        return (
          <div className="progress" style={{ height: 20, minWidth: 120 }}>
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${val}%` }}
              aria-valuenow={val}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {val}%
            </div>
          </div>
        );
      }
    },
    {
      name: 'Actions',
      width: '140px',
      cell: row => (
        <div className="d-flex gap-1">
          <Btn attrBtn={{ color: 'primary', size: 'sm', className: 'btn-sm py-1 px-2', onClick: () => handleEdit(row) }}>
            <i className="fa fa-edit" />
          </Btn>
          <Btn attrBtn={{ color: 'danger', size: 'sm', className: 'btn-sm py-1 px-2', onClick: () => handleDeleteSingle(row) }}>
            <i className="fa fa-trash" />
          </Btn>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <H4 attrH4={{ className: 'text-muted m-0' }}>Gestion des Exercices</H4>
        <Btn attrBtn={{ color: 'success', onClick: handleAdd }}>Ajouter</Btn>
      </div>

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Recherche"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {error && <div className="alert alert-danger">{error}</div>}

      {selectedRows.length > 0 && (
        <div className="d-flex align-items-center justify-content-between bg-light-info p-2 mb-2">
          <H4 attrH4={{ className: 'text-muted m-0' }}>
            Supprimer la sélection ({selectedRows.length})
          </H4>
          <Btn attrBtn={{ color: 'danger', onClick: handleDeleteMany }}>Supprimer</Btn>
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

export default ExerciceTable;
