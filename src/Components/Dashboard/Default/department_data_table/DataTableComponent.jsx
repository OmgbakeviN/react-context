import React, { Fragment, useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Btn, H4 } from '../../../../AbstractElements';
import axiosInstance from '../../../../api/axios';
import CommonModal from '../../../UiKits/Modals/common/modal';
import DepartementForm from '../department_form/index'
import DeleteConfirm from '../department_delete/index'

const DataTableComponent = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const [error, setError] = useState(null);

  // --- HANDLERS --- //

  const fetchDepartements = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/feicom/api/departements/');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la récupération des départements : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartements();
    // eslint-disable-next-line
  }, []);

  // Suppression de plusieurs lignes
const handleDelete = () => {
  setModalTitle('Suppression de plusieurs départements');
  setModalContent(
    <DeleteConfirm
      noms={selectedRows.map(r => r.nom)}
      onConfirm={async () => {
        try {
          await Promise.all(
            selectedRows.map(row =>
              axiosInstance.delete(`/feicom/api/departements/${row.id}/`)
            )
          );
          setToggleDelet(!toggleDelet);
          setModalOpen(false); 
          fetchDepartements();
        } catch (err) {
          setError("Erreur lors de la suppression : " + err.message);
        }
      }}
      onCancel={() => setModalOpen(false)}
    />
  );
  setModalOpen(true);
};

  // Suppression d'une seule ligne via bouton "Supprimer"
  const handleDeleteSingle = row => {
    setModalTitle('Suppression du département');
    setModalContent(
      <DeleteConfirm
        nom={row.nom}
        onConfirm={async () => {
          await axiosInstance.delete(`/feicom/api/departements/${row.id}/`);
          setModalOpen(false);
          fetchDepartements();
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // Ajout
  const handleAdd = () => {
    setModalTitle('Ajouter un département');
    setModalContent(
      <DepartementForm
        onSave={async (data) => {
          await axiosInstance.post('/feicom/api/departements/', data);
          setModalOpen(false);
          fetchDepartements();
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // Modification
  const handleEdit = row => {
    setModalTitle('Modifier le département');
    setModalContent(
      <DepartementForm
        initialData={row}
        onSave={async (data) => {
          await axiosInstance.put(`/feicom/api/departements/${row.id}/`, data);
          setModalOpen(false);
          fetchDepartements();
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // Sélection de lignes
  const handleRowSelected = useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, []);

  // --- COLUMNS (créées APRÈS les handlers) --- //
  const tableColumns = [
    {
      name: '#',
      selector: (row, index) => index + 1,
      width: '50px',
      center: true,
    },
    {
      name: 'Nom du Département',
      selector: row => row.nom,
      sortable: true,
    },
    {
      name: 'Agence',
      selector: row => row.agence,
      sortable: true,
    },
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
        <H4 attrH4={{ className: 'text-muted m-0' }}>Gestion des Départements</H4>
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

export default DataTableComponent;
