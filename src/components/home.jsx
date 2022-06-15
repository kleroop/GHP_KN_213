import React, {Component} from 'react';
import Navbar from './shared/navbar';
import MemoElement from './shared/memo_element';
import {
    app_notification,
    api_chpassword,
    api_deluser,
    api_logout,
    app_logout,
    app_getuser,
    api_user_stats
} from '../common';


export default class Home extends Component {
    constructor(props) {
        super(props);
        if (!app_getuser()) {
            window.location.href = '/index';
        }
        this.state = {
            homeUrl: '/home',
            navLinks: [
                {
                    name: app_getuser().username,
                    href: '/profile'
                }
            ],
            stats: {
                memoIdsOwner: [],
                memoIdsMember: []
            }
        };
    }

    async componentDidMount() {
        this.state.stats = await (await api_user_stats(app_getuser().sub)).json();
        this.forceUpdate();
    }

    async handle_newmemo(e) {
        window.location.href = '/memo';
    }


    render() {
        return (
            <React.Fragment>
                <Navbar home={this.state.homeUrl} links={this.state.navLinks}/>
                <button className="create_btn" onClick={(e) => this.handle_newmemo(e)}>Crete new memo</button>
                <section>
                    <div className="memo-row">
                        {
                            this.state.stats.memoIdsOwner.map((id, index) => {
                                return <MemoElement key={id} id={id}/>;
                            })
                        }
                    </div>
                </section>
            </React.Fragment>
        );
    }
}