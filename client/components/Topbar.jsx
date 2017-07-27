import React from 'react';
import menu from './Menu.jsx';
import '../css/Topbar.css';

export default class Topbar extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        if (this.props.opts.hideTopbar) {
            return null;
        }

        return React.createElement(
            'div',
            {className: 'topbar row'},
            React.createElement(
                'button',
                {className: 'topbarButton pointer fa fa-home fa-lg', onClick: () => this.props.openHome()}
            ),
            /*React.createElement(
                profile,
                {className: ''}
            )*/
            React.createElement(
                menu,
                {
                    className: '',
                    showMenu: true,
                    setPlan: this.props.setPlan
                }
            )
        );
    }
}