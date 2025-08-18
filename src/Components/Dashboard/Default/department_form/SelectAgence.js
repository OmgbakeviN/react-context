import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axiosInstance from '../../../../api/axios';

const SelectAgence = ({ value, onChange }) => {
  const [agences, setAgences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgences = async () => {
      try {
        const response = await axiosInstance.get('/feicom/api/agences/');
        setAgences(response.data);
      } catch (err) {
        setAgences([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAgences();
  }, []);

  const options = agences.map(a => ({
    value: a.id,
    label: a.nom,
    agence: a,
  }));

  // Securisé:
  const selectedOption = !value
    ? null
    : typeof value === 'object'
    ? options.find(opt => opt.value === value.id) || null
    : options.find(opt => opt.value === value) || null;

  return (
    <Select
      isLoading={loading}
      options={options}
      value={selectedOption}
      onChange={opt => onChange(opt ? opt.agence : null)}
      placeholder="Sélectionner une agence"
      isClearable
      className="col-sm-12"
    />
  );
};

export default SelectAgence;
