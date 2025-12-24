// ProjectVisitsTable.jsx
import React from "react";
import DataTable from "react-data-table-component";
import { Badge, Button } from "reactstrap";
import dayjs from "dayjs";

/**
 * Onglet "Visites"
 * Props:
 *  - visits: array de visites (project.visites)
 *  - loading: bool
 *  - onOpenVisit: fn(visit) => void  // ouvre modal détail
 *  - onAddNew: fn() => void          // ouvre modal ajout
 */
const ProjectVisitsTable = ({ visits = [], loading, onOpenVisit, onAddNew }) => {
  const columns = [
    {
      name: "Date",
      selector: (row) => row.date,
      cell: (row) => dayjs(row.date).format("dddd, DD MMMM YYYY"),
      minWidth: "200px",
    },
    {
      name: "Entreprise",
      selector: (row) => row.enterprise_present,
      cell: (row) => (row.enterprise_present ? <Badge color="success">Présent</Badge> : <Badge color="danger">Absent</Badge>),
      center: true,
    },
    {
      name: "M_O",
      selector: (row) => row.moe_present,
      cell: (row) => (row.moe_present ? <Badge color="success">Présent</Badge> : <Badge color="danger">Absent</Badge>),
      center: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button color="info" size="sm" onClick={() => onOpenVisit(row)}>
          <i className="fa fa-eye" />
        </Button>
      ),
      width: "120px",
      ignoreRowClick: true,
      button: true,
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <Button color="primary" size="sm" onClick={onAddNew}>+ Ajouter une visite</Button>
      </div>

      <DataTable
        columns={columns}
        data={visits}
        striped
        center
        pagination
        progressPending={loading}
        noDataComponent="Aucune visite"
      />
    </>
  );
};

export default ProjectVisitsTable;
