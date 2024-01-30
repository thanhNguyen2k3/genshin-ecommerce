import axios from 'axios';

const instance = axios.create({
    url: `${process.env.NEXT_URL}`,
});

export default instance;
