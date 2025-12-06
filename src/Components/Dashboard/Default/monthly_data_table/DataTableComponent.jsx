import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Btn, H4 } from '../../../../AbstractElements';
import CommonModal from '../../../UiKits/Modals/common/modal';
import axiosInstance from '../../../../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMonthly, createMonthly, updateMonthly, deleteMonthly, deleteManyMonthly,
  selectMonthly, selectMonthlyLoading, selectMonthlyError
} from '../../../../reduxtool/monthSlice';
import { toast } from 'react-toastify';

// --- Formulaire todo ---
const MonthlyForm = ({ initialData = {}, onSave, onCancel }) => {
  const [lotOptions, setLotOptions] = useState([]);
  const [loadingLots, setLoadingLots] = useState(false);

  //   {
  //   "agency": 0,
  //   "month": 9223372036854776000,
  //   "dpo_expenses": "-823956771.5",
  //   "dpo_progress": "-15",
  //   "actual_expenses": "9",
  //   "actual_progress": "-361.1",
  //   "notes": "string",
  //   "is_locked": true
  // }
  const [agency, setAgency] = useState(initialData.agency || "");
  const [month, setMonth] = useState(initialData.month || "");
  const [dpo_expenses, setDpoExpenses] = useState(initialData.dpo_expenses || "");
  const [dpo_progress, setDpoProgress] = useState(initialData.dpo_progress || "");
  const [actual_expenses, setActualExpenses] = useState(initialData.actual_expenses || "");
  const [actual_progress, setActualProgress] = useState(initialData.actual_progress || "");
  const [notes, setNotes] = useState(initialData.notes || "");
  const [is_locked, setIsLocked] = useState(initialData.is_locked || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ agency, month, dpo_expenses, dpo_progress, actual_expenses, actual_progress, notes, is_locked });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label>Agence</label>
        <input className="form-control" type="number" value={agency} onChange={e => setAgency(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Mois</label>
        <input className="form-control" type="number" value={month} onChange={e => setMonth(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Dépenses DPO</label>
        <input className="form-control" type="number" step="0.1" value={dpo_expenses} onChange={e => setDpoExpenses(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Avancement DPO</label>
        <input className="form-control" type="number" step="0.1" value={dpo_progress} onChange={e => setDpoProgress(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Dépenses actuel</label>
        <input className="form-control" type="number" step="0.1" value={actual_expenses} onChange={e => setActualExpenses(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Avancement actuel</label>
        <input className="form-control" type="number" step="0.1" value={actual_progress} onChange={e => setActualProgress(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Notes</label>
        <input className="form-control" type="text" value={notes} onChange={e => setNotes(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Verouillé</label>
        <input className="form-control" type="checkbox" checked={is_locked} onChange={e => setIsLocked(e.target.checked)} />
      </div>
      <div className="d-flex gap-2 mt-2">
        <Btn attrBtn={{ color: 'secondary', type: 'button', onClick: onCancel }}>Annuler</Btn>
        <Btn attrBtn={{ color: 'primary', type: 'submit' }}>Valider</Btn>
      </div>
    </form>
  );
};

const DeleteConfirm = ({ noms, onConfirm, onCancel }) => (
  <div>
    <p>
      Voulez-vous vraiment supprimer {noms.length > 1 ? "les todos suivants" : "ce todo"} ?<br />
      <strong>{noms.join(', ')}</strong>
    </p>
    <div className="d-flex gap-2">
      <Btn attrBtn={{ color: 'secondary', onClick: onCancel }}>Annuler</Btn>
      <Btn attrBtn={{ color: 'danger', onClick: onConfirm }}>Supprimer</Btn>
    </div>
  </div>
);

const MonthlyTable = () => {
  const dispatch = useDispatch();

  // Redux state
  const items = useSelector(selectMonthly);
  const loading = useSelector(selectMonthlyLoading);
  const error = useSelector(selectMonthlyError);

  // UI state
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  // Fetch init
  useEffect(() => {
    dispatch(fetchMonthly());
  }, [dispatch]);

  // Recherche locale
  const filteredData = useMemo(() => {
    const q = searchText?.trim().toLowerCase();
    if (!q) return items || [];
    return (items || []).filter(row =>
      Object.values(row || {}).join(' ').toLowerCase().includes(q)
    );
  }, [items, searchText]);

  // CRUD handlers
  const handleAdd = () => {
    setModalTitle('Ajouter un todo');
    setModalContent(
      <MonthlyForm
        onSave={async (form) => {
          await dispatch(createMonthly(form)).unwrap();
          setModalOpen(false);
          toast.success('Monthly Target ajouté avec succès');
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setModalTitle('Modifier le Target');
    setModalContent(
      <MonthlyForm
        initialData={row}
        onSave={async (form) => {
          await dispatch(updateMonthly({ id: row.target_id, data: form })).unwrap();
          setModalOpen(false);
          toast.success('Monthly Target modifié avec succès');
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const handleDeleteSingle = (row) => {
    setModalTitle('Suppression du Target');
    setModalContent(
      <DeleteConfirm
        noms={[`#${row.target_id}`]}
        onConfirm={async () => {
          await dispatch(deleteMonthly(row.target_id)).unwrap();
          setModalOpen(false);
          toast.success('Monthly Target supprimé avec succès');
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const handleDeleteMany = () => {
    setModalTitle('Suppression de plusieurs Targets');
    setModalContent(
      <DeleteConfirm
        noms={selectedRows.map(r => `#${r.target_id}`)}
        onConfirm={async () => {
          await dispatch(deleteManyMonthly(selectedRows.map(r => r.target_id))).unwrap();
          setToggleDelet(v => !v);
          setModalOpen(false);
          toast.success('Monthly Targets supprimés avec succès');
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  // Helpers UI
  const statusBadgeClass = (s) => {
    if (s === 'STARTED') return 'success';
    if (s === 'NOT STARTED') return 'warning';
    if (s === 'COMPLETED') return 'info';
    return 'secondary';
  };

  // Colonnes
  const tableColumns = [
    { name: 'Target', 
      selector: row => row.target_id, 
      sortable: true,
      width: '100px' },
    { name: 'Agency', 
      selector: row => row.agency, 
      sortable: true,
      width: '100px' },
    { name: 'Month', 
      selector: row => row.month, 
      sortable: true },
    { name: 'Expenses', 
      selector: row => row.dpo_expenses, 
      sortable: true },
    { name: 'Progress', 
      selector: row => row.dpo_progress, 
      sortable: true },
    { name: 'Actual Expenses', 
      selector: row => row.actual_expenses, 
      sortable: true },
    { name: 'Actual Progress', 
      selector: row => row.actual_progress, 
      sortable: true },
    { name: 'Notes', 
      selector: row => row.notes, 
      sortable: true },
    { name: 'Status', 
      selector: row => row.is_locked, 
      sortable: true,
      // either true green badge or false red badge
      cell: row => (
        <span className={`badge badge-${row.is_locked ? 'success' : 'danger'}`}>
          {row.is_locked ? 'Locked' : 'Unlocked'}
        </span>
      ),
    },
    { name: 'Created', 
      selector: row => row.created_at, 
      sortable: true },
    { name: 'Updated', 
      selector: row => row.updated_at, 
      sortable: true },
    {
      name: 'Actions',
      width: '140px',
      cell: row => (
        <div className='d-flex gap-1'>
          <Btn attrBtn={{ color: 'primary', size: 'sm', className: 'btn-sm py-1 px-2', onClick: () => handleEdit(row) }}>
            <i className="fa fa-edit"></i>
          </Btn>
          <Btn attrBtn={{ color: 'danger', size: 'sm', className: 'btn-sm py-1 px-2', onClick: () => handleDeleteSingle(row) }}>
            <i className="fa fa-trash"></i>
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
      <div className='d-flex align-items-center justify-content-between mb-2'>
        <H4 attrH4={{ className: 'text-muted m-0' }}>Gestion des Monthly targets</H4>
        <Btn attrBtn={{ color: 'success', onClick: handleAdd }}>Ajouter</Btn>
      </div>

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Recherche"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
      />

      {error && <div className='alert alert-danger'>{error}</div>}

      {selectedRows.length > 0 && (
        <div className='d-flex align-items-center justify-content-between bg-light-info p-2 mb-2'>
          <H4 attrH4={{ className: 'text-muted m-0' }}>Supprimer la sélection ({selectedRows.length})</H4>
          <Btn attrBtn={{ color: 'danger', onClick: handleDeleteMany }}>Supprimer</Btn>
        </div>
      )}

      <DataTable
        data={filteredData}
        columns={tableColumns}
        keyField="target_id"
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

export default MonthlyTable;
