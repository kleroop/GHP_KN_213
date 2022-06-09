import React, {Component} from 'react';
import Navbar from './shared/navbar';
import {app_logged_in} from '../common';

export default class Index extends Component {

    constructor(props) {
        super(props);
        if (app_logged_in()) {
            this.state = {
                navLinks: [
                    {
                        href: '/profile',
                        name: 'Profile'
                    }
                ],
                homeUrl: '/memo'
            };
        } else {
            this.state = {
                navLinks: [
                    {
                        href: '/register',
                        name: 'Register'
                    },
                    {
                        href: '/login',
                        name: 'Log in'
                    }
                ],
                homeUrl: '/index'
            };
        }

    }

    render() {
        return (
            <React.Fragment>
                <div className="horizontal-wrapper">
                    <Navbar home={this.state.homeUrl} links={this.state.navLinks}/>
                    <section className="fade_in_slow">
                        <div>
                            <h1 className="index-big-text"><i>So, you want to take a memo?</i></h1>
                            <img className="accent-img" src="/note-strip.jpg"
                                 alt="image showing a hand taking notes"/>
                            <article>
                                <h2>Behold!</h2>
                                <i>
                                    If you need a place where you can take short memos and share/edit them
                                    cooperatively,
                                    then you've found just what you need!
                                </i>
                                <div className="colbox outline-box">
                                    <a href="register.html">Register now and be productive!</a>
                                </div>
                            </article>
                            <div className="colbox">
                                <a href="login.html">login</a>
                                <a href="admin.html">admin</a>
                                <a href="register.html">register</a>
                                <a href="profile.html">profile</a>
                                <a href="memo.html">memo</a>
                                <a href="manage.html">invite</a>
                                <a href="home.html">home</a>
                            </div>
                        </div>
                    </section>


                </div>
                <footer className="fixed-footer">
                    <span>2022 MemoCorp®</span>
                </footer>
            </React.Fragment>
        );
    }
}

