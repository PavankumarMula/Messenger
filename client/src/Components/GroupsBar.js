import React, { useEffect, useState } from "react";
import styles from "../styles/GroupBar.module.css";
import "../styles/Modal.css";
import Modal from './Modal';
import { messagesCtx } from "../context/messagesContext";
import { useContext } from "react";
import { MultiSelect } from "react-multi-select-component"; 
import axios from "axios";

const GroupsBar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const { messages } = useContext(messagesCtx);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUsers = async () => {
        const res = await axios.get(`http://localhost:4000/allusers`);
        if (res.status === 200) setUsers(res.data);
      }
      fetchUsers();
    }
  }, []);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const formHandler = async(e) => {
    const name=localStorage.getItem('name');
    
    e.preventDefault();
    const groupDetails={groupName,selected,name}
    try {
     const res= await axios.post(`http://localhost:4000/creategroup`,groupDetails);  
     console.log(res);
    } 
    
    catch (error) {
      console.log(error);
    }

   

    closeModal();
  };

  const options = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  return (
    <>
      <div className={styles.bar}>
        <button onClick={openModal}>Create Group</button>
        <Modal isOpen={modalOpen} onClose={closeModal}>
          <div className="modal">
            <h2>Create Group</h2>
            <form onSubmit={formHandler}>
              <div className="input-group">
                <label htmlFor="groupName">Group Name:</label>
                <input
                  type="text"
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="selectedUsers">Select Users:</label>
                <MultiSelect
                  id="selectedUsers"
                  isMulti
                  options={options}
                  value={selected}
                  onChange={setSelected}
                />
              </div>
              <button type="submit">Create Group</button>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default GroupsBar;
