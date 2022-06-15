import React, {Component} from 'react';
import Navbar from './shared/navbar';
import {app_notification, app_login, api_login} from '../common';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            homeUrl: '/index',
            navLinks: [
                {
                    name: 'Register',
                    href: '/register'
                }
            ]
        };
    }

    async handle_submit(e) {
        e.preventDefault();
        const form = e.target.elements;
        const res = await app_login(form.username.value, form.password.value);
        if (res) {
            window.location.href = '/home';
        }
        return false;
    }

    render() {
        return (
            <React.Fragment>
                <Navbar home={this.state.homeUrl} links={this.state.navLinks}/>
                <section>
                    <div className="colbox">
                        <h2>Welcome back!</h2>
                        <form id="login-form" className="input-block" onSubmit={(e) => this.handle_submit(e)}>
                            <input className="input" type="text" name="username" placeholder="Username" required/>
                            <input className="input" type="password" name="password" placeholder="Password"
                                   required/>
                            <br/>
                            <br/>
                            <input className="submit-btn" type="submit" value="Log in"/>
                        </form>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}