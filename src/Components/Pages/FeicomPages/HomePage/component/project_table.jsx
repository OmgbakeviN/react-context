// src/Components/Pages/FeicomPages/Dashboard/component/project_table.jsx
import DataTable from 'react-data-table-component';

const columns = [
  { name: 'id', selector: row => row.id, sortable: true },
  { name: 'libelle', selector: row => row.libelle, sortable: true },
  { name: 'montant ttc', selector: row => row.montant_ttc, sortable: true },
  { name: 'date debut', selector: row => row.date_debut, sortable: true },
  { name: 'date fin', selector: row => row.date_fin, sortable: true },
  { name: 'commune', selector: row => row.commune, sortable: true },
  { name: 'departement', selector: row => row.departement, sortable: true },
  { name: 'agence', selector: row => row.agence, sortable: true },
  { name: 'current status', selector: row => row.current_status, sortable: true },
];

function ProjectTable({ data = [] }) {
  return (
    <DataTable columns={columns} data={data} pagination dense />
  );
};

export default ProjectTable;
