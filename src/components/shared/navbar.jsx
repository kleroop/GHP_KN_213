import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class Navbar extends Component {
    render() {
        const {home, links} = this.props;

        return (
            <header>
                <nav className="navbar">
                    <div className="logo">
                        <Link to={home}>Memo</Link>
                    </div>
                    {
                        links.map(({href, name}, index) => {
                            return (
                                <div key={index}>
                                    <Link to={href}>{name}</Link>
                                </div>
                            );
                        })
                    }
                </nav>
            </header>
        );
    }
}

