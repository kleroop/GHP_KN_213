import React, {Component} from 'react';
import Navbar from './shared/navbar';
import {app_notification, api_chpassword, api_deluser, api_logout, app_logout} from '../common';


export default class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            homeUrl: '/index',
            navLinks: [
            ]
        };
    }

    render() {
        return (
            <React.Fragment>
                <Navbar home={this.state.homeUrl} links={this.state.navLinks}/>
                <section>
                    <div className="colbox">
                        <h2>Manage user</h2>
                        <form className="input-block">
                            <input className="input" type="text" name="username" placeholder="Username" required/>
                            <br/>
                            <br/>
                            <input className="submit-btn-critical" type="submit" value="Delete user (cannot be undone)"/>
                        </form>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}