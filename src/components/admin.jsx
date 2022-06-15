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
    api_login, app_login, api_admin_login, app_admin_login
} from '../common';


export default class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            homeUrl: '/index',
            navLinks: []
        };
        if (!app_getuser().is_admin) {
            window.location.href = '/index';
        }
    }

    async handle_submit(e) {
        e.preventDefault();
        const form = e.target.elements;

        if (await app_admin_login(form.username.value)) {
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
                        <h2>Log in as another user</h2>
                        <form className="input-block" onSubmit={(e) => this.handle_submit(e)}>
                            <input className="input" type="text" name="username" placeholder="Username" required/>
                            <br/>
                            <br/>
                            <input className="submit-btn" type="submit" value="Login as user"/>
                        </form>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}