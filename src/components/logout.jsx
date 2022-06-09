import React, {Component} from 'react';
import {app_logout} from '../common';

export default class Logout extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        await app_logout();
        window.location.href = '/index';
    }


    render() {
        return '';
    }
}