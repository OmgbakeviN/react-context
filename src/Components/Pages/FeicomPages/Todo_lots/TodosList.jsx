// TodosList.js
import React from 'react';
import DataTable from 'react-data-table-component';
import axiosInstance from "../../../../api/axios";
// on ajoute un toast en cas de reussite
import { toast } from 'react-toastify';

const STATUS = ["NOT STARTED", "STARTED", "IN PROGRESS"];

const pretty = (s) => {
  if (s === "NOT STARTED") return "Not Started";
  if (s === "IN PROGRESS") return "In Progress";
  return "Started";
};

const badgeClass = (s) => {
  if (s === "STARTED") return "badge bg-success";
  if (s === "NOT STARTED") return "badge bg-danger";
  return "badge bg-warning";
};

const TodosList = ({ todos, lotId }) => {
  const [rows, setRows] = React.useState(todos || []);

  React.useEffect(() => {
    setRows(todos || []);
  }, [todos]);

  const updateStatus = async (row, newStatus) => {
    const prevRows = rows;
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, statut: newStatus } : r)));

    try {
      await axiosInstance.put(`/feicom/api/todos/${row.id}/`, {
        nom: row.nom,
        statut: newStatus,
        lot: (typeof row.lot === 'object' && row.lot?.id) ? row.lot.id : (row.lot ?? lotId),
      });
      toast.success('Statut mis à jour');
    } catch (err) {
      setRows(prevRows);
      console.error(err);
      toast.error("Échec de la mise à jour du statut. Réessayez.");
    }
  };

  const columns = [
    {
      name: "Nom",
      selector: (row) => row.nom,
      sortable: true,
    },
    {
      name: "Statut",
      sortable: true,
      cell: (row) => (
        <span className={badgeClass(row.statut)}>{pretty(row.statut)}</span>
      ),
    },
    {
      name: "Changer le statut",
      right: true,
      cell: (row) => (
        <select
          aria-label="Changer le statut"
          value={row.statut}
          onChange={(e) => updateStatus(row, e.target.value)}
          className="form-select form-select-sm"
          style={{ width: 160 }}
        >
          {STATUS.map((s) => (
            <option key={s} value={s}>{pretty(s)}</option>
          ))}
        </select>
      ),
    },
  ];
  return (
    <DataTable
      columns={columns}
      data={rows}
      pagination
      paginationRowsPerPageOptions={[5, 10, 15]}
      paginationPerPage={5}
      paginationComponentOptions={{ rowsPerPageText: "Lignes par page" }}
    />
  );
};

export default TodosList;
