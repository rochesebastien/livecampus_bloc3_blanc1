import { useState, useContext } from 'react';
import './SigninForm.css';
import { useNavigate, useParams } from 'react-router-dom';

const baseURI = import.meta.env.VITE_API_BASE_URL;

const UpdateClientForm = () => {
  const [formData, setFormData] = useState({
    lastname: '',
    firstname: ''
  });
  const navigate = useNavigate();
  const { id } = useParams();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    const { role } = formData;

    const response = await fetch(`${baseURI}api/dashboard/clients/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role })
    });

    if (response.ok) {
        // Handle success
        navigate("/dashboard");
        console.log('User modified successfully');
    } else {
        // Handle error
        console.error('Failed to modify user', response.status);
        console.error('Failed to modify user');
    }
};

  return (
    <form className="signin-form" onSubmit={handleSubmit}>
      <h2>Modification</h2>
      <input type="text" name="role" placeholder="Role" value={formData.role} onChange={handleChange} required />
      <button type="submit">Modifier</button>
    </form>
  );
};

export default UpdateClientForm;
