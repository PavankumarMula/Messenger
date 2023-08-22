import React, { useEffect, useState } from "react";
import styles from "../styles/GroupBar.module.css";
import "../styles/Modal.css";
import Modal from "./Modal";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GroupsBar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [groups, setGroups] = useState([]);

  const navigate=useNavigate();

  // for fetching the All the users
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchUsers = async () => {
        const res = await axios.get(`http://localhost:4000/allusers`);
        if (res.status === 200) {
          setUsers(res.data);
          localStorage.setItem('users',JSON.stringify(res.data));
        }
        
      };
      fetchUsers();
    }
  }, []);

  // for fetching the all the groups
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // create a function to fetch the all the groups
      const fetchGroups = async () => {
        try {
          const res = await axios.get(`http://localhost:4000/groupNames`, {
            headers: { Authorization: token },
          });
          if (res.status === 200) {
            console.log(res.data)
            setGroups(res.data);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchGroups();
    }
  }, []);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const formHandler = async (e) => {
    const name = localStorage.getItem("name");

    e.preventDefault();
    const groupDetails = { groupName, selected, name };
    try {
      const res = await axios.post(
        `http://localhost:4000/creategroup`,
        groupDetails
      );
      const {createdBy:admin,groupId,groupName}=res.data.group
      setGroups(prev=>[...prev,{admin,groupId,groupName}]);
    } catch (error) {
      console.log(error);
    }

    closeModal();
  };

  const options = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));


  // group Page handler
  const groupPageHandler = (groupId) => {
   
    navigate(`grouppage/${groupId}`);
  };

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

        <div className={styles.groups}>
          {groups &&
            groups.map((group) => {
              return (
                <button
                  key={group.groupId}
                  onClick={() => groupPageHandler(group.groupId)}
                >
                  {group.groupName}
                </button>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default GroupsBar;
