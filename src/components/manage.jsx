import React, {Component} from 'react';
import Navbar from './shared/navbar';
import {
    api_delete_memo,
    api_get_memo,
    api_get_perms,
    api_set_perms,
    api_user_stats,
    app_getuser,
    app_notification
} from '../common';

export default class Manage extends Component {

    constructor(props) {
        super(props);
        if (!app_getuser()) {
            window.location.href = '/index';
        }
        const [, , mid] = window.location.pathname.split('/');
        this.state = {
            navLinks: [
                {
                    href: '/profile',
                    name: localStorage.getItem('username')
                }
            ],
            homeUrl: '/home',
            memo: {
                text: '',
                tag: '',
                last_edited_by: 0,
                last_edited: 0,
                owner_id: 0
            },
            members: []
        };
        this.user_members = [];
        this.memo_id = mid;
    }


    async componentDidMount() {
        const mresp = await api_get_memo(this.memo_id);
        if (!mresp.ok) {
            window.location.href = '/index';
        }
        const mdata = await mresp.json();
        this.state.memo = mdata;
        if (this.state.memo.owner_id !== app_getuser().sub) {
            window.location.href = '/index';
        }
        await this.reload_user_members();

    }

    async reload_user_members() {
        const resp = await api_get_perms(this.memo_id);
        this.state.members = (await resp.json()).usersWithAccess;
        for (const id of this.state.members) {
            const resp = api_user_stats(id);
            if (resp.ok) {
                const res = await resp.json();
                this.user_members.push(res);
            }
        }
        this.forceUpdate();
    }

    format_date() {
        const memo = this.state.memo;
        if (!memo.last_edited) return '';
        return (new Date(memo.last_edited)).toDateString();
    }

    format_time() {
        const memo = this.state.memo;
        if (!memo.last_edited) return '';
        return (new Date(memo.last_edited)).toLocaleTimeString('uk-UK');
    }

    async syncPerms() {
        const ls = [];
        for (const user of this.user_members) {
            ls.push(user.id);
        }
        await api_set_perms(this.memo_id, ls);
        await this.reload_user_members();
        this.forceUpdate();
    }

    async handleInvite(e) {
        e.preventDefault();
        const form = e.target.elements;
        const id = form.username.value;
        const resp = await api_user_stats(id);
        const res = await resp.json();
        if (!resp.ok) {
            await this.reload_user_members();
            app_notification(resp.description);
            return;
        }
        this.user_members.push(res);
        await this.syncPerms();
    }

    async handleRemove(e) {
        e.preventDefault();
        const form = e.target.elements;
        const uname = form.username.value;
        this.user_members = this.user_members.filter((v) => v.username !== uname);
        await this.syncPerms();
    }

    async handleDelete(e) {
        e.preventDefault();
        await api_delete_memo(this.memo_id);
        window.location.href = '/home';
    }

    render() {
        const memo = this.state.memo;
        return (
            <React.Fragment>

                <Navbar home={this.state.homeUrl} links={this.state.navLinks}/>
                <section>
                    <div className="colbox">
                        <h2>Invite user</h2>
                        <form className="input-block" onSubmit={(e) => this.handleInvite(e)}>
                            <input className="input" type="text" name="username" placeholder="Username" required/>

                            <input className="submit-btn" type="submit" value="Invite"/>
                        </form>
                        <h2>Remove user</h2>
                        <form className="input-block" onSubmit={(e) => this.handleRemove(e)}>
                            <select name="username">
                                {this.user_members.map((user, index) => {
                                    return (<option data-uid={user.id} key={index}>{user.username}</option>);
                                })}
                            </select>
                            <input className="submit-btn-critical" type="submit" value="Confirm"/>
                        </form>
                        <h2>Last edited</h2>
                        <div className="colbox">
                            <div>{this.format_date()}</div>
                            <div>{this.format_time()}</div>
                        </div>
                        <h2>Delete memo</h2>
                        <form className="input-block" onSubmit={(e) => this.handleDelete(e)}>
                            <input className="submit-btn-critical" type="submit" value="Delete"/>
                        </form>
                    </div>
                </section>


            </React.Fragment>
        );
    }
}

