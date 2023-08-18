import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/chatPage.module.css";
import Modal from "./Modal";
import { MultiSelect } from "react-multi-select-component";

const GroupPage = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [adminUser, setAdminUser] = useState({});
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [openModal, setModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [options, setOptions] = useState([]);
  const [addMode, setAddMode] = useState(false);

  useEffect(() => {
    // Fetch group details based on ID
    const fetchGroupDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/groupPage/${id}`);
        const { groupId, groupName, createdBy, users } = res.data;

        // Extract isAdmin property for the adminUser
        const adminUserData = users.find((user) => user.groupUser.isAdmin);
        setAdminUser(adminUserData);
        setGroupName(groupName);
        setUsers(users);
        setGroupId(groupId);
      } catch (error) {
        console.log(error);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      fetchGroupDetails();
    }
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchGroupChats();
    }
  }, []);

  // Fetch group-related chats
  const fetchGroupChats = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/getGroupChats/${id}`);
      if (res.status === 200) setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Sending message handler
  const sendMsgFormHandler = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (id !== "" && token) {
      try {
        const res = await axios.post(
          `http://localhost:4000/sendmsgingroup`,
          { input, groupId },
          {
            headers: { Authorization: token },
          }
        );

        if (res.status === 200) {
          const { id, userName, message } = res.data;
          setMessages((prev) => [...prev, { id, userName, message }]);
          setInput("");
          
        }
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Modal close handler
  const closeModal = () => {
    setModalOpen(false);
  };

  // Add user handler
  const addUserHandler = () => {
    setModalOpen(true);
    setAddMode(true);
    // Get the list of all users from local storage
    const jsonData = localStorage.getItem("users");
    const allTheUsers = JSON.parse(jsonData);

    // Filter out users who are already in the current group
    if (users && allTheUsers) {
      const availableUsers = allTheUsers.filter(
        (user) => !users.some((existingUser) => existingUser.id === user.id)
      );

      // Populate available users for selection
      const people = availableUsers.map((user) => ({
        value: user.id,
        label: user.name,
      }));
      setOptions(people);
    }
  };

  // Logged-in user
  const loggedInuser = localStorage.getItem("name");

  // Remove user handler
  const removeUserHandler = () => {
    setModalOpen(true);
    setAddMode(false);

    // Populate selected users for removal
    const people = users.map((user) => ({
      value: user.id,
      label: user.name,
    }));

    setOptions(people);
  };

  // Modal form submit handler
  const formHandler = async (e) => {
    console.log("form submitted");
    e.preventDefault();

    try {
      if (addMode) {
        // Add user to the group
        const addRes = await axios.post(`http://localhost:4000/adduser/${id}`, {
          selectedUsers,
        });

        if (addRes.status === 200) {
          // Fetch updated group details
          const groupRes = await axios.get(`http://localhost:4000/groupPage/${id}`);
          const { groupId, groupName, createdBy, users } = groupRes.data;
          // Update the UI with new group details
          updateGroupDetails({ groupId, groupName, users });
        }
      } else {
        // Remove user from the group
        const removeRes = await axios.post(`http://localhost:4000/removeuser/${id}`, {
          selectedUsers,
        });

        if (removeRes.status === 200) {
          // Fetch updated group details
          const groupRes = await axios.get(`http://localhost:4000/groupPage/${id}`);
          const { groupId, groupName, createdBy, users } = groupRes.data;
          // Update the UI with new group details
          updateGroupDetails({ groupId, groupName, users });
        }
      }
    } catch (error) {
      console.log(error);
    }

    setModalOpen(false);
  };

  // Update group details in the UI
  const updateGroupDetails = ({ groupId, groupName, users }) => {
    // Extract isAdmin property for the adminUser
    const adminUserData = users.find((user) => user.groupUser.isAdmin);
    setAdminUser(adminUserData);
    setGroupName(groupName);
    setUsers(users);
    setGroupId(groupId);
  };

  return (
    <>
      <center>
        <h2 style={{ fontFamily: "Poppins" }}>welcome to {groupName} Group</h2>
      </center>
      <div className={styles.admin}></div>
      <div className={styles.chatpageContainer}>
        <div
          style={{
            display: "flex",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <p> Admin : {adminUser.name && adminUser.name.toUpperCase()}</p>
          Users :
          {users &&
            users
              .filter((user) => user.groupUser.isAdmin !== true)
              .map((user) => {
                return <span key={user.id}> {user.name},</span>;
              })}
          {adminUser.name === loggedInuser && (
            <>
              <button onClick={addUserHandler}>Add User</button>
              <button onClick={removeUserHandler}>Remove User</button>
            </>
          )}
        </div>

        {messages &&
          messages.map((message) => (
            <div key={message.id} className={styles.messageContainer}>
              <span className={styles.name}>{message.userName}</span>
              <p>{message.message}</p>
            </div>
          ))}
      </div>
      <div className={styles.message}>
        <form onSubmit={sendMsgFormHandler}>
          <input
            type="text"
            placeholder="type here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></input>
          <button>Send</button>
        </form>
      </div>
      <Modal isOpen={openModal} onClose={closeModal}>
        <div className="modal">
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
                value={selectedUsers}
                onChange={setSelectedUsers}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default GroupPage;
