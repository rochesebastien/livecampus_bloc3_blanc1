import './DashboardPage.css';
import Header from './Header';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const baseURI = import.meta.env.VITE_API_BASE_URL;
const DashboardPage = () => {
    const [clients, setClients] = useState([]);
    const navigate = useNavigate();

    const handleDelete = async (id) => {
        
        try {
            const response = await fetch(`${baseURI}api/dashboard/clients/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setClients(clients.filter(client => client.id !== id));
            // Handle success response here
            console.log('Client deleted');
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleEdit = (id) => {
        navigate(`/dashboard/update/${id}`);
    };

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await await fetch(baseURI + 'api/dashboard/clients');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                setClients(data);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchClients();
    }, []);


    return (
        <div className='client_page'>
            <Header />
            <h1>Dashboard</h1>
            {clients.length === 0 ? (
                <p>Il n&apos;y a pas de client</p>
            ) : (
                <>
                    <p>Nombre de clients: {clients.length}</p>
                    <table className=''>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Adresse mail</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(client => (
                                <tr key={client.id}>
                                    <td>{client.lastname}</td>
                                    <td>{client.firstname}</td>
                                    <td>{client.email}</td>
                                    <td>
                                        <button onClick={() => handleDelete(client.id)}>Supprimer</button>
                                        <button onClick={() => handleEdit(client.id)}>Modifier</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default DashboardPage;