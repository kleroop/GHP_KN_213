import {io} from 'socket.io-client';
import React, {Component} from 'react';
import Navbar from './shared/navbar';
import {
    app_notification,
    api_chpassword,
    api_deluser,
    api_logout,
    app_logout,
    app_getuser,
    APP_ADMIN_ID,
    api_login, app_login, api_admin_login, app_admin_login, BASE_URL
} from '../common';


export default class ChatRoom extends Component {
    constructor(props) {
        super(props);
        const user = app_getuser();
        if (!user) window.location.href = '/index';
        this.state = {
            homeUrl: '/home',
            navLinks: [
                {
                    href: '/profile',
                    name: user.username
                }
            ],
            ready: false
        };

        this.user = user;
    }

    leave_room() {
        this.socket.emit('left', {}, function () {
            this.socket.disconnect();
            window.location.href = '/home';
        });
    }

    async handle_submit(e) {
        e.preventDefault();
        const form = e.target.elements;
        console.log(form.msg.value);
        this.socket.emit('text', {uid: this.user.sub, msg: form.msg.value + '\n'});
        form.msg.value = '';
        return false;
    }

    async componentDidMount() {
        this.tarea = document.getElementById('tarea');
        this.tarea.scrollTop = this.tarea.scrollHeight;

        const where = 'http://localhost:8080/chatroom';
        const socket = io.connect(where);
        this.socket = socket;
        socket.on('connect', () => {
            console.log('joined');
            socket.emit('joined', {uid: this.user.sub});
        });
        socket.on('status', (data) => {
            console.log('state');
            this.setState((state, props) => {
                return {ready: true};
            });
        });
        socket.on('message', (data) => {
            console.log('message:');
            console.log(data);
            const was_bottom = this.tarea.scrollHeight - this.tarea.scrollTop === this.tarea.clientHeight;
            this.tarea.value += data['msg'];
            console.log(was_bottom);
            if (was_bottom) {
                this.tarea.scrollTop = this.tarea.scrollHeight;
            }
        });
    }


    render() {
        return (
            <React.Fragment>
                <Navbar home={this.state.homeUrl} links={this.state.navLinks}/>
                <section>
                    <h2>Global messaging & support</h2>
                    <textarea readOnly={true} className="memo-edit" id="tarea"></textarea>
                    <div className="rowbox">
                        <form className="input-block" onSubmit={(e) => this.handle_submit(e)}>
                            <input autoFocus={true} className="input" type="text" name="msg" placeholder="Type here" required/>
                            <br/>
                            <br/>
                            <input className="submit-btn" type="submit" value="Send" disabled={!this.state.ready}/>
                        </form>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}
