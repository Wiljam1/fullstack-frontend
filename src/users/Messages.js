import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MessageViewer = () => {
  const [messages, setMessages] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const storedUser = JSON.parse(sessionStorage.getItem('user'));
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState({
    sender: storedUser.id,
    receiverUsername: '',
    subject: '',
    content: '',
  });

  useEffect(() => {
    axios.get('http://localhost:8081/users')
        .then(response => setUsers(response.data))
        .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleInputChange = (e) => {
    setNewMessage({ ...newMessage, [e.target.name]: e.target.value });
  };

  const onSelectUser = (user) => {
    setSelectedReceiver(user);
  };

  const isMessageSender = async (message) => {
    try {
      const senderId = storedUser.id;
      const response = await axios.get(`http://localhost:8083/messages/${senderId}`);
      console.log("Message id: " + message.id + " and responsedata id: " + response.data.some(sentMessage => sentMessage.id))
      return response.data.some(sentMessage => sentMessage.id === message.id);
    } catch (error) {
      console.error('Error fetching messages:', error);
      return false;
    }
  };

  useEffect(() => {
    if (selectedReceiver) {
      const senderId = storedUser.id;
      const receiverId = selectedReceiver.id;

      axios
          .get(`http://localhost:8083/messages/${senderId}/${receiverId}`)
          .then((response) => setMessages(response.data))
          .catch((error) => console.error('Error fetching messages:', error));
    }
  }, [selectedReceiver]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fetch the user with the provided receiverUsername
    axios.get(`http://localhost:8081/userInfo/${newMessage.receiverUsername}`)
        .then(response => {
          const receiverUser = response.data;

          const messageData = {
            sender: storedUser.id,
            receiver: receiverUser.id,
            subject: newMessage.subject,
            content: newMessage.content,
            date: new Date()
          };

          // Send the request to create a new message
          axios.post('http://localhost:8083/message', messageData)
              .then(response => {
                setMessages([...messages, response.data]);
                setNewMessage({ receiverUsername: '', subject: '', content: '' });
              })
              .catch(error => console.error('Error sending message:', error));
        })
        .catch(error => console.error('Error fetching user:', error)); 
  };

  return (
      <div className="container">
        <div className="row">
          <div>
            <label htmlFor="receiver">Select Receiver:</label>
            <select
                id="receiver"
                value={selectedReceiver ? JSON.stringify(selectedReceiver) : ""}
                onChange={(e) => onSelectUser(JSON.parse(e.target.value))}
            >
              <option value="">-Receiver-</option>
              {users.map((user) => (
                  <option key={user.id} value={JSON.stringify(user)}>
                    {user.name}
                  </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 mb-4">
            <div className="border rounded p-4 shadow">
              <h2 className="text-center m-4">All Messages</h2>
              <table className="table table-striped">
                <thead>
                <tr>
                  <th>Date</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Subject</th>
                  <th>Content</th>
                </tr>
                </thead>
                <tbody>
                {messages.map((message) => (
                    <tr key={message.id}>
                      <td>{message.date ? new Date(message.date).toLocaleString() : 'N/A'}</td>
                      <td>{isMessageSender(message) ? storedUser.username : selectedReceiver.username}</td>
                      <td>{isMessageSender(message) ? selectedReceiver.username : storedUser.username}</td>
                      <td>{message.subject}</td>
                      <td>{message.content}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="border rounded p-4 shadow">
              <h2 className="text-center m-4">Send a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="receiverUsername" className="form-label">
                    Receiver Username:
                  </label>
                  <input
                      type="text"
                      className="form-control"
                      id="receiverUsername"
                      name="receiverUsername"
                      value={newMessage.receiverUsername}
                      onChange={handleInputChange}
                      required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">
                    Subject:
                  </label>
                  <input
                      type="text"
                      className="form-control"
                      id="subject"
                      name="subject"
                      value={newMessage.subject}
                      onChange={handleInputChange}
                      required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    Content:
                  </label>
                  <input
                      type="text"
                      className="form-control"
                      id="content"
                      name="content"
                      value={newMessage.content}
                      onChange={handleInputChange}
                      required
                  />
                </div>
                <button type="submit" className="btn btn-outline-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default MessageViewer;