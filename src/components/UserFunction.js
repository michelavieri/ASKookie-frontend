import axios from 'axios';

export const register = newUser => {
    return axios
    .post('/register', {
        email: newUser.email,
        username: newUser.username,
        password: newUser.password
    })
    .then(response => {
        console.log("Registered")
    });
}

export const login = user => {
    return axios
    .post('/login', {
        username: user.username,
        password: user.password
    })
    .then(res => {
        console.log(res.data.token);
        localStorage.setItem('usertoken', res.data.token)
        return res.data.token
    })
    .catch(err => {
        console.log(err)
    });
}