import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Btn, H4 } from '../../../../AbstractElements';
import CommonModal from '../../../UiKits/Modals/common/modal';
import axiosInstance from '../../../../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTodos, createTodo, updateTodo, deleteTodo, deleteManyTodos,
  selectTodos, selectTodosLoading, selectTodosError
} from '../../../../reduxtool/todosSlice';

// --- Formulaire todo ---
const TodoForm = ({ initialData = {}, onSave, onCancel }) => {
  const [nom, setNom] = useState(initialData.nom || "");
  const [pourcentage, setPourcentage] = useState(initialData.pourcentage || "");
  const [statut, setStatut] = useState(initialData.statut || "");
  const [lot, setLot] = useState(
    typeof initialData.lot === "object" ? initialData.lot.id : (initialData.lot || "")
  );

  const [lotOptions, setLotOptions] = useState([]);
  const [loadingLots, setLoadingLots] = useState(false);

  // Charger les lots (simple fetch local; tu peux aussi brancher sur lotsSlice si tu veux mutualiser)
  useEffect(() => {
    (async () => {
      setLoadingLots(true);
      try {
        const res = await axiosInstance.get('/feicom/api/lots/');
        const list = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
        const options = list.map(item => ({
          value: item.id,
          label: `${item.id} - ${item.nom}`,
        }));
        setLotOptions(options);
      } finally {
        setLoadingLots(false);
      }
    })();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ nom, pourcentage, statut, lot: lot ? Number(lot) : "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label>Nom</label>
        <input className="form-control" value={nom} onChange={e => setNom(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Pourcentage</label>
        <input className="form-control" type="number" step="0.1" value={pourcentage} onChange={e => setPourcentage(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Statut</label>
        <select className="form-control" value={statut} onChange={e => setStatut(e.target.value)} required>
          <option value="">Sélectionnez…</option>
          <option value="NOT STARTED">NOT STARTED</option>
          <option value="STARTED">STARTED</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
      </div>
      <div className="mb-2">
        <label>Lot</label>
        <select
          className="form-control"
          value={lot}
          onChange={e => setLot(Number(e.target.value))}
          required
          disabled={loadingLots}
        >
          <option value="">Sélectionnez un lot</option>
          {lotOptions.map(opt => (
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

const TodoTable = () => {
  const dispatch = useDispatch();

  // Redux state
  const items = useSelector(selectTodos);
  const loading = useSelector(selectTodosLoading);
  const error = useSelector(selectTodosError);

  // UI state
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  // Fetch init
  useEffect(() => {
    dispatch(fetchTodos());
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
      <TodoForm
        onSave={async (form) => {
          await dispatch(createTodo(form)).unwrap();
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setModalTitle('Modifier le todo');
    setModalContent(
      <TodoForm
        initialData={row}
        onSave={async (form) => {
          await dispatch(updateTodo({ id: row.id, data: form })).unwrap();
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const handleDeleteSingle = (row) => {
    setModalTitle('Suppression du todo');
    setModalContent(
      <DeleteConfirm
        noms={[row.nom]}
        onConfirm={async () => {
          await dispatch(deleteTodo(row.id)).unwrap();
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const handleDeleteMany = () => {
    setModalTitle('Suppression de plusieurs todos');
    setModalContent(
      <DeleteConfirm
        noms={selectedRows.map(r => r.nom)}
        onConfirm={async () => {
          await dispatch(deleteManyTodos(selectedRows.map(r => r.id))).unwrap();
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

  // Helpers UI
  const statusBadgeClass = (s) => {
    if (s === 'STARTED') return 'success';
    if (s === 'NOT STARTED') return 'warning';
    if (s === 'COMPLETED') return 'info';
    return 'secondary';
  };

  // Colonnes
  const tableColumns = [
    { name: '#', selector: (row, index) => index + 1, width: '50px', center: true },
    { name: 'Nom', selector: row => row.nom, sortable: true },
    {
      name: 'Statut',
      selector: row => row.statut,
      sortable: true,
      cell: row => (
        <span className={`badge badge-${statusBadgeClass(row.statut)}`}>
          {row.statut}
        </span>
      ),
    },
    {
      name: 'Pourcentage',
      selector: row => row.pourcentage,
      sortable: true,
      cell: row => `${row.pourcentage ?? 0}%`,
    },
    {
      name: 'Lot',
      selector: row => (typeof row.lot === 'object' ? (row.lot.nom ?? row.lot.id) : row.lot),
      sortable: true,
      wrap: true,
    },
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
        <H4 attrH4={{ className: 'text-muted m-0' }}>Gestion des Todos</H4>
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

export default TodoTable;
