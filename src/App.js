import React from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';
import './styles/main.css';
import Index from './components/index';
import Login from './components/login';
import Register from './components/register';
import Logout from './components/logout';
import Profile from './components/profile';
import Admin from './components/admin';
import Home from './components/home';
import Memo from './components/memo';
import Manage from './components/manage';
import ChatRoom from './components/chatroom';


export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/index"/>}/>
            <Route path="index" element={<Index/>}/>
            <Route path="login" element={<Login/>}/>
            <Route path="register" element={<Register/>}/>
            <Route path="logout" element={<Logout/>}/>
            <Route path="profile" element={<Profile/>}/>
            <Route path="memo" element={<Memo/>}/>
            <Route path="memo/:id" element={<Memo/>}/>
            <Route path="home" element={<Home/>}/>
            <Route path="admin" element={<Admin/>}/>
            <Route path="manage/:id" element={<Manage/>}/>
            <Route path="chatroom" element={<ChatRoom/>}/>
            <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
    );
}
