import React, {Component} from 'react';
import Navbar from './shared/navbar';
import {
    app_notification,
    api_chpassword,
    api_deluser,
    api_logout,
    app_logout,
    app_getuser,
    api_user_stats
} from '../common';


export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            homeUrl: '/home',
            navLinks: [
                {
                    name: 'Log out',
                    href: '/logout'
                },
            ],
            stats: {
                memoIdsOwner: [],
                memoIdsMember: []
            }
        };
        if (!app_getuser()) {
            window.location.href = '/index';
        }
        this.state.username = app_getuser().username;
    }

    async componentDidMount() {
       this.state.stats = await (await api_user_stats(app_getuser().sub)).json();
       console.log(this.state);
       this.forceUpdate();
    }

    async handle_deluser(e) {
        e.preventDefault();
        await api_deluser();
        await app_logout();
        window.location.href = '/index';
    }

    async handle_submit(e) {
        e.preventDefault();
        const form = e.target.elements;
        if (form.newpassword1.value !== form.newpassword2.value) {
            app_notification('Passwords don\'t match!');
            return false;
        }
        let resp, res;
        try {
            resp = await api_chpassword(form.password.value, form.newpassword1.value);
            res = await resp.json();
        } catch (err) {
            app_notification('Network error');
            return false;
        }
        if (!resp.ok) {
            app_notification(res.description);
            return false;
        }

        return false;
    }

    render() {
        return (
            <React.Fragment>
                <Navbar home={this.state.homeUrl} links={this.state.navLinks}/>
                <section>
                    <div className="colbox">
                        <h2>Username</h2>
                        <div>{this.state.username}</div>
                        <h2>Statistics</h2> { /* todo*/}
                        <div>Memos created: {this.state.stats.memoIdsOwner.length}</div>
                        <div>Memos member: {this.state.stats.memoIdsMember.length}</div>

                        <h2>Change password</h2>
                        <form className="input-block" id="change-password-form"
                              onSubmit={(e) => this.handle_submit(e)}>
                            <input className="input" type="password" name="password" placeholder="Old password"
                                   required/>
                            <input className="input" type="password" name="newpassword1" placeholder="New password"
                                   required/>
                            <input className="input" type="password" name="newpassword2"
                                   placeholder="Repeat new password" required/>
                            <br/>
                            <br/>
                            <input className="submit-btn" type="submit" value="Change password"/>
                        </form>
                        <form className="input-block" onSubmit={(e) => this.handle_deluser(e)}>
                            <input className="submit-btn-critical" type="submit" value="DELETE USER"/>
                        </form>

                    </div>
                </section>
            </React.Fragment>
        );
    }
}