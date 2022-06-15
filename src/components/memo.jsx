import React, {Component} from 'react';
import Navbar from './shared/navbar';
import {
    app_notification,
    api_chpassword,
    api_deluser,
    api_logout,
    app_logout,
    app_getuser,
    api_user_stats, api_get_memo, api_get_perms, api_create_memo, api_edit_memo
} from '../common';


export default class Memo extends Component {
    constructor(props) {
        super(props);
        const user = app_getuser();

        this.state = {
            navLinks: [
                {
                    href: '/profile',
                    name: localStorage.getItem('username')
                }
            ],
            homeUrl: '/home',
            readonly: true,
            data: {
                text: '',
                tag: '',
                owner_id: user.sub
            }
        };

        this.state.readonly = true;
        this.timer = null;
        const [, , mid] = window.location.pathname.split('/');
        this.memo_id = mid;
    }

    async componentDidMount() {
        if (this.memo_id) {
            const tag_input = document.getElementById('tag_input');
            const textarea_input = document.getElementById('textarea_input');

            const mresp = await api_get_memo(this.memo_id);
            if (!mresp.ok) {
                window.location.href = '/index';
            }
            const mdata = await mresp.json();
            this.state.data = mdata;
            const resp = await api_get_perms(this.memo_id);
            if (!resp.ok) window.location.href = '/index';
            this.state.readonly = false;
            tag_input.value = mdata.tag;
            textarea_input.value = mdata.text;

            console.log(mdata);

        } else {
            this.state.readonly = !app_getuser();
        }
        this.forceUpdate();

    }


    async syncMemo() {
        const mdata = this.state.data;
        if (!mdata.tag.trim()) mdata.tag = "New memo";
        if (!this.memo_id) {
            const resp = await api_create_memo(mdata.tag, mdata.text);
            if (resp.ok) {
                const res = await resp.json();
                this.memo_id = res.memoId;
                window.location.href = `/memo/${this.memo_id}`;
            }
        } else {
            await api_edit_memo(this.memo_id, mdata.tag, mdata.text);
        }
    }

    async handleInput(e) {
        clearTimeout(this.timer);
        const mdata = this.state.data;
        mdata.text = e.target.value.trimEnd();
        console.log(mdata.text);
        this.timer = setTimeout(async () => {
            await this.syncMemo();
        }, 3000);
    }

    async handleTag(e) {
        clearTimeout(this.timer);
        const mdata = this.state.data;
        mdata.tag = e.target.value.trim();
        console.log(mdata.tag);
        this.timer = setTimeout(async () => {
            await this.syncMemo();
        }, 3000);
    }


    render() {
        console.log(this.state.readonly);
        return (
            <React.Fragment>
                <Navbar home={this.state.homeUrl} links={this.state.navLinks}/>
                <br/>
                <input id="tag_input" className="memo-tag" placeholder="New memo" maxLength={20}
                       readOnly={this.state.readonly}
                       onChange={(e) => this.handleTag(e)}/>
                <textarea id="textarea_input" className="memo-edit" maxLength={404} readOnly={this.state.readonly}
                          onChange={(e) => this.handleInput(e)}></textarea>
            </React.Fragment>
        );
    }
}