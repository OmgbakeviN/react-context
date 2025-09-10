// TodosList.js
import React from 'react';

const TodosList = ({ todos }) => {
    if (!todos || todos.length === 0) {
        return <p>Aucun todo disponible.</p>;
    }

    // Styles de base pour la liste
    const listStyle = {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        border: '1px solid #ccc',
        borderRadius: '5px',
    };

    // Styles pour chaque élément de la liste
    const listItemStyle = {
        padding: '10px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#f8f9fa',
        transition: 'background-color 0.2s ease-in-out',
    };

    // Style pour le statut
    const statusStyle = {
        color: 'green',
        fontWeight: 'bold',
    };

    return (
        <ul style={listStyle}>
            {todos.map((todo, index) => (
                <li
                    key={todo.id}
                    style={{
                        ...listItemStyle,
                        // Supprime la bordure du dernier élément
                        borderBottom: index === todos.length - 1 ? 'none' : '1px solid #eee',
                    }}
                >
                    <strong>{todo.nom}</strong> - <span style={statusStyle}>Statut : {todo.statut}</span>
                </li>
            ))}
        </ul>
    );
};

export default TodosList;