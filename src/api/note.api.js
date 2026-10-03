import httpClient from "./httpClient";

export const listNotes = (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([key, value]) => value !== "" && value !== undefined && value !== null)
  );
  return httpClient.get("/notes", { params: cleanParams }).then((res) => res.data.data);
};
export const createNote = (data) => httpClient.post("/notes", data).then((res) => res.data.data);
export const updateNote = ({ id, data }) => httpClient.patch(`/notes/${id}`, data).then((res) => res.data.data);
export const togglePin = (id) => httpClient.patch(`/notes/${id}/pin`).then((res) => res.data.data);
export const archiveNote = ({ id, archived }) => httpClient.patch(`/notes/${id}/archive`, { archived }).then((res) => res.data.data);
