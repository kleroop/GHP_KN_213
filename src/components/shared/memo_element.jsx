import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {api_get_memo} from '../../common';

export default class MemoElement extends Component {
    constructor(props) {
        super(props);
        const {id} = this.props;
        this.state = {
            id: id,
            memo: {
                tag: '',
                last_edited_by: '',
                last_edited: 0,
            }
        };
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

    async componentDidMount() {
        this.state.memo = await (await api_get_memo(this.state.id)).json();
        this.forceUpdate();
    }


    render() {
        const memo = this.state.memo;
        return (
            <div className="memo-block">
                <div>
                    <a href={`/memo/${this.state.id}`}> {memo.tag}</a>
                </div>
                <div>{this.format_date()}</div>
                <div>{this.format_time()}</div>
                <a className='memo-manage' href={`/manage/${this.state.id}`}>+</a>
            </div>
        );
    }
}

