import axios from 'axios';

const API = axios.create({
  baseURL: 'https://poolly.onrender.com/api',
  withCredentials: true,
});

// Auth routes
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const logoutUser = () => API.post('/auth/logout');
export const getUser = () => API.get('/auth/getUser');
export const updateUsername = (data) => API.patch('/auth/update-username', data);


// Poll routes
export const createPoll = (data) => API.post('/polls/create', data);
export const getAllPolls = (page = 1, limit = 10, type = '') =>
  API.get(`/polls?page=${page}&limit=${limit}&type=${type}`);
export const getPollById = (id) => API.get(`/polls/${id}`);
export const voteOnPoll = (id, data) => API.post(`/polls/${id}/vote`, data);
export const getVotedPolls = (page = 1) => API.get(`/polls/voted?page=${page}`);
export const getMyPolls = (page = 1) => API.get(`/polls/my-polls?page=${page}`);
export const closePoll = (id) => API.patch(`/polls/${id}/close`);
export const openPoll = (id) => API.patch(`/polls/${id}/open`);
export const toggleBookmark = (id) => API.patch(`/polls/${id}/bookmark`);
export const getBookmarkedPolls = (page = 1) => API.get(`/polls/bookmarked?page=${page}`);
export const deletePoll = (id) => API.delete(`/polls/${id}`);
export const getTrendingPolls = () => API.get('/polls/trending');


export default API;
