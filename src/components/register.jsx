import React, {Component} from 'react';
import Navbar from './shared/navbar';
import {app_notification, app_login, api_login, api_register} from '../common';


export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            homeUrl: '/index',
            navLinks: [
                {
                    name: 'Log in',
                    href: '/login'
                }
            ]
        };
    }

    async handle_submit(e) {
        e.preventDefault();
        const form = e.target.elements;
        let resp, res;
        if (form.cpassword.value !== form.password.value) {
            app_notification('Passwords don\'t match!');
            return false;
        }
        try {
            resp = await api_register(form.username.value, form.password.value);
            res = await resp.json();
        } catch (err) {
            app_notification('No internet connection');
            return false;
        }
        if (!resp.ok) {
            app_notification(res.description);
            return false;
        }
        console.log(resp);
        console.log(res);
        resp = await api_login(form.username.value, form.password.value);
        res = await resp.json();
        await app_login(res.token1);
        window.location.href = '/home';
        return false;
    }

    render() {
        return (
            <React.Fragment>
                <Navbar home={this.state.homeUrl} links={this.state.navLinks}/>
                <section>
                    <div className="colbox">
                        <h2>Register</h2>
                        <form className="input-block" id="login-form" onSubmit={(e) => this.handle_submit(e)}>
                            <input className="input" type="text" name="username" placeholder="Username" required/>
                            <input className="input" type="password" name="password" placeholder="Password" required/>
                            <input className="input" type="password" name="cpassword" placeholder="Confirm Password" required/>
                            <br/>
                            <br/>
                            <input className="submit-btn" type="submit" value="Register"/>
                        </form>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}