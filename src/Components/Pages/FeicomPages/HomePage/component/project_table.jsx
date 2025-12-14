import DataTable from 'react-data-table-component';

const columns = [
	{
		name: 'id',
		selector: row => row.id,
		sortable: true,
	},
	{
		name: 'libelle',
		selector: row => row.libelle,
		sortable: true,
	},
	{
		name: 'montant ttc',
		selector: row => row.montant_ttc,
		sortable: true,
	},
	{
		name: 'date debut',
		selector: row => row.date_debut,
		sortable: true,
	},
	{
		name: 'date fin',
		selector: row => row.date_fin,
		sortable: true,
	},
	{
		name: 'commune',
		selector: row => row.commune,
		sortable: true,
	},
	{
		name: 'departement',
		selector: row => row.departement,
		sortable: true,
	},
	{
		name: 'agence',
		selector: row => row.agence,
		sortable: true,
	},
	{
		name: 'current status',
		selector: row => row.current_status,
		sortable: true,
	}
];

const data = [
	{
		id: 1,
		libelle: 'Beetlejuice',
		montant_ttc: '1000',
		date_debut: '2022-01-01',
		date_fin: '2022-01-01',
		commune: 'Beetlejuice',
		departement: 'Beetlejuice',
		agence: 'Beetlejuice',
		current_status: 'Beetlejuice',
	},
	{
		id: 2,
		libelle: 'Ghostbusters',
		montant_ttc: '1000',
		date_debut: '2022-01-01',
		date_fin: '2022-01-01',
		commune: 'Ghostbusters',
		departement: 'Ghostbusters',
		agence: 'Ghostbusters',
		current_status: 'Ghostbusters',
	},
	{
		id: 3,
		libelle: 'E.T. The Extra-Terrestrial',
		montant_ttc: '1000',
		date_debut: '2022-01-01',
		date_fin: '2022-01-01',
		commune: 'E.T. The Extra-Terrestrial',
		departement: 'E.T. The Extra-Terrestrial',
		agence: 'E.T. The Extra-Terrestrial',
		current_status: 'E.T. The Extra-Terrestrial',
	},
	{
		id: 4,
		libelle: 'The Wizard of Oz',
		montant_ttc: '1000',
		date_debut: '2022-01-01',
		date_fin: '2022-01-01',
		commune: 'The Wizard of Oz',
		departement: 'The Wizard of Oz',
		agence: 'The Wizard of Oz',
		current_status: 'The Wizard of Oz',
	},
	{
		id: 5,
		libelle: 'The Lion King',
		montant_ttc: '1000',
		date_debut: '2022-01-01',
		date_fin: '2022-01-01',
		commune: 'The Lion King',
		departement: 'The Lion King',
		agence: 'The Lion King',
		current_status: 'The Lion King',
	},
	{
		id: 6,
		libelle: 'The Simpsons',
		montant_ttc: '1000',
		date_debut: '2022-01-01',
		date_fin: '2022-01-01',
		commune: 'The Simpsons',
		departement: 'The Simpsons',
		agence: 'The Simpsons',
		current_status: 'The Simpsons',
	},

]

function ProjectTable() {
	return (
		<DataTable
			columns={columns}
			data={data}
		/>
	);
};

export default ProjectTable;
