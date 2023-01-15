import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/Context";
import "./home.css";
import moment from "moment";
import { toast } from "react-toastify";
import {
  addNote,
  getNotes,
  updateNote,
  deleteNote,
  deleteUser,
} from "../../services/api";

const Home = () => {
  const [state, setState] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingA, setIsLoadingA] = useState(false);
  const [addNotes, setAddNotes] = useState("none");

  // form
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  //edit data
  const [edit, setEdit] = useState([]);
  const [updateData, setUpdateData] = useState({
    title: "",
    note: "",
  });

  const [filterTitle, setFilterTitle] = useState("");

  /* filter Data on SearchBar */
  /* title match card display */

  const filterData = (item) => {
    // console.log(item);
    if (!filterTitle) {
      return item;
    }
    // search imp function *********
    return item.title.toLowerCase().includes(filterTitle.toLowerCase());
  };

  //new Notes added databse
  const handleAddNote = async (e) => {
    try {
      setIsLoadingA(true);
      if (!title || !note) {
        toast.error("Empty Field");
        setIsLoadingA(false);
        return;
      }
      const { data } = await addNote(title, note);
      //console.log(data);
      if (data.status !== "ok") {
        toast.error(data.error);
        setIsLoadingA(false);
        return;
      }

      setTitle("");
      setNote("");
      setIsLoadingA(false);
      await handleGetNotes();
      toast.success(data.message);
    } catch (err) {
      setIsLoadingA(false);
      console.log(err);
    }
  };

  const handleEditNote = (id) => {
    //console.log(id);
    let editData = [];
    setEdit(editData);
    for (let i = 0; i < state.user.notes.length; i++) {
      if (state.user.notes[i]._id === id) {
        editData.push(state.user.notes[i]);
        //console.log(state.user.notes[i]);
      }
    }
  };

  const OnValueChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const handleUpdateNote = async (id) => {
    // console.log(id);
    //console.log(updateData);
    try {
      setIsLoading(true);
      if (!updateData) {
        toast.error("Empty Field");
        setIsLoading(false);
        return;
      }
      // console.log(updateData);
      const { data } = await updateNote(id, updateData);

      if (data.status !== "ok") {
        toast.error(data.error);
        setIsLoading(false);
        return;
      }

      await handleGetNotes();
      setIsLoading(false);
      toast.success(data.message);
      setTitle("");
      setNote("");
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  const handleGetNotes = async () => {
    try {
      const { data } = await getNotes();
      //console.log(data);
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data.user;
      localStorage.setItem("auth", JSON.stringify(auth));
      //update Context
      setState({ ...state, user: data.user });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to Delete ?")) {
        return;
      }

      const { data } = await deleteNote(id);

      if (data.status !== "ok") {
        toast.error(data.error);
        return;
      }

      await handleGetNotes();
      toast.success(data.message);
    } catch (err) {
      console.log(err);
    }
  };

  /* add notes form view  */
  const handleAddNotesForm = () => {
    setNote("");
    setTitle("");
    if (addNotes === "") {
      setAddNotes("none");
    } else {
      setAddNotes("");
    }
  };

  /* account delete */
  const handleDeleteUser = async () => {
    try {
      if (window.confirm("Are you sure you want to Logout ?")) {
        const { data } = await deleteUser();
        if (data.status !== "ok") {
          toast.error(data.error);
          return;
        }
        window.localStorage.removeItem("auth");
        setState(null);
        toast.success(data.message);
        window.location = "/";
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* user Logout */
  const logout = async () => {
    try {
      if (window.confirm("Are you sure you want to Logout ?")) {
        window.localStorage.removeItem("auth");
        setState(null);
        toast.success("Logout successfully");
        window.location = "/";
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-fluid main-container m-0 p-0">
      <div className="navbar-container shadow">
        <div className="AppName">
          <span className="">KeepNote</span>
        </div>
        <div className="searchBar">
          <div className="search">
            <input
              type="text"
              className="searchBox"
              placeholder="Search notes..."
              onChange={(e) => setFilterTitle(e.target.value)}
            />
            <ion-icon name="search-circle"></ion-icon>
          </div>
        </div>
        <div className="User">
          <span className="Username">
            {state && state.user ? state.user.username : "User"}
          </span>
          <span className="logout ms-5 btn btn-danger" onClick={logout}>
            Logout
          </span>
          <span
            className="logout ms-5 btn btn-danger"
            onClick={handleDeleteUser}
          >
            Delete Account
          </span>
        </div>
      </div>

      <div className="buttonView" onClick={handleAddNotesForm}>
        <span>Add Notes</span>
      </div>

      <div className="form-container" style={{ display: addNotes }}>
        <div className="card">
          <input
            type="text"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            type="text"
            placeholder="Notes..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>

          <div className="d-flex align-self-end">
            <button
              className="btn btn-secondary addButton"
              onClick={handleAddNotesForm}
            >
              Close
            </button>
            <button
              className="btn btn-primary addButton"
              onClick={handleAddNote}
              disabled={isLoadingA}
            >
              {isLoadingA ? (
                <span
                  className="spinner-border spinner-border-sm me-3 fs-4"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : null}
              Add
            </button>
          </div>
        </div>
      </div>

      {state && state.user && state.user.notes ? (
        <div className="notes-container">
          {state &&
            state.user.notes
              .filter((item) => filterData(item))
              .map((item, index) => (
                <div className="card shadow w-auto h-auto" key={item._id}>
                  <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>{item.title}</div>
                      <div className="icons">
                        <button
                          className="position-absolute top-4 end-0 pe-5"
                          style={{
                            border: "none",
                            background: "none",
                          }}
                          onClick={() => handleEditNote(item._id)}
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          data-bs-whatever="@mdo"
                        >
                          <ion-icon name="create-outline"></ion-icon>
                        </button>

                        <button
                          className="position-absolute top-4 end-0 pe-2 "
                          style={{
                            border: "none",
                            background: "none",
                          }}
                          onClick={() => handleDeleteNote(item._id)}
                        >
                          <ion-icon
                            className=""
                            style={{ fontSize: "20px" }}
                            name="trash-outline"
                          ></ion-icon>
                        </button>

                        <div
                          className="modal fade"
                          id="exampleModal"
                          tabIndex={-1}
                          aria-labelledby="exampleModalLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog">
                            {edit &&
                              edit.map((edit) => (
                                <div className="modal-content" key={edit._id}>
                                  <div className="modal-header">
                                    <h5
                                      className="modal-title"
                                      id="exampleModalLabel"
                                    >
                                      Edit Notes
                                    </h5>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                    />
                                  </div>
                                  <div className="modal-body">
                                    <form>
                                      <div className="mb-3">
                                        <label
                                          htmlFor="recipient-name"
                                          className="col-form-label"
                                        >
                                          Title
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="recipient-name"
                                          onChange={OnValueChange}
                                          name="title"
                                          defaultValue={edit.title}
                                          placeholder=""
                                        />
                                      </div>
                                      <div className="mb-3">
                                        <label
                                          htmlFor="message-text"
                                          className="col-form-label"
                                        >
                                          Notes
                                        </label>
                                        <textarea
                                          className="form-control"
                                          id="message-text"
                                          onChange={OnValueChange}
                                          name="note"
                                          defaultValue={edit.note}
                                          placeholder=""
                                        />
                                      </div>
                                    </form>
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="btn btn-secondary"
                                      data-bs-dismiss="modal"
                                      onClick={() => setEdit([])}
                                    >
                                      Close
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateNote(edit._id)}
                                      className="btn btn-primary"
                                      disabled={isLoading}
                                    >
                                      {isLoading ? (
                                        <span
                                          className="spinner-border spinner-border-sm me-3 fs-4"
                                          role="status"
                                          aria-hidden="true"
                                        ></span>
                                      ) : null}
                                      Update
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">{item.note}</div>
                  <div className="card-footer text-muted">
                    {moment(item.createdAt).fromNow()}
                  </div>
                </div>
              ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;
