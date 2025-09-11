// TodosList.js
import React from 'react';
import DataTable from 'react-data-table-component';


const TodosList = ({ todos }) => {
    const columns = [
        {
            name: "Nom",
            selector: (row) => row.nom,
            sortable: true,
        },
        {
            name: "Statut",
            selector: (row) => row.statut,
            sortable: true,
            // badges pour STARTED, NOT STARTED ET IN PROGRESS
            cell: (row) => {
                if (row.statut === "STARTED") {
                    return <span className="badge bg-success">Started</span>;
                } else if (row.statut === "NOT STARTED") {
                    return <span className="badge bg-danger">Not Started</span>;
                } else {
                    return <span className="badge bg-warning">In Progress</span>;
                }
            },
        },
    ]
    
    return (
        <DataTable
            columns={columns}
            data={todos}
            pagination
            paginationRowsPerPageOptions={[5, 10, 15]}
            paginationPerPage={5}
            paginationComponentOptions={{ rowsPerPageText: "Lignes par page" }}
        />
    );
};

export default TodosList;