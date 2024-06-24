import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";

const ContactForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/emails', { firstName, lastName, email });
      console.log('Contact saved:', response.data);
      toast.success('Email has been saved succesfully to db');
    } catch (error) {
      console.error('Error saving contact:', error);
    } 
  };

  return (
    <div className="container m-auto max-w-2xl py-24 flex justify-center items-center min-h-screen">
      <div className="w-[80%] md:max-w-[500px] bg-white px-6 py-8 mb-4 shadow-md rounded-md border md:m-0">
        <form className=" max-w-[500px] m-auto" onSubmit={handleSubmit}>
        <h2 className="text-3xl text-center font-bold mb-6">Email Collector</h2>
        
        <div className='pb-4'>
            <label className=' font-semibold'>First Name:</label>
            <input  className="border-2 border-gray-300 rounded w-full py-2 pl-2" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div className='pb-4'>
            <label className=' font-semibold'>Last Name:</label>
            <input className="border-2 border-gray-300 rounded w-full py-2 pl-2"  type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required/>
        </div>
        <div className='pb-4'>
            <label className=' font-semibold'>Email:</label>
            <input className="border-2 border-gray-300 rounded w-full py-2 pl-2"  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        </div>
        <button className=" mt-6 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline" type="submit">Save Contact</button>
        </form>
    
      </div>
    </div>
  );
};

export default ContactForm;
