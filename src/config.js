import axios from 'axios';

const host = 'localhost:8808'

export default axios.create({
  baseURL: 'http://' + host,
});
