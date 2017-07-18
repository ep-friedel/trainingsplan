import React from 'react';
import '../css/Dialog.css';

export default class Dialog extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        if (!this.props.opts.showDialog) {
            return null;
        }

        let buttonList = this.props.opts.buttons.map((button, index) => {
            return React.createElement('button', {
                    onClick: (evt) => button.click(evt),
                    key: index,
                    className: 'dialogButton'
                },
                button.name);
        });

        return React.createElement(
            'div',
            {className: 'dialogBackdrop'},
            React.createElement(
                'div',
                {className: 'dialog'},
                React.createElement(
                    'div',
                    {className: 'dialogHeader row'},
                    React.createElement(
                        'h3',
                        {className: 'dialogHeadline'},
                        this.props.opts.title ? this.props.opts.title : ''
                    ),
                    (this.props.opts.hideClose ? null : React.createElement(
                        'span',
                        {
                            className: 'fa fa-window-close-o dialogCloseButton pointer',
                            onClick: this.props.close
                        }
                    ))
                ),
                React.createElement(
                    'div',
                    {className: 'dialogBody'},
                    (this.props.opts.text ? this.props.opts.text : null),
                    (this.props.opts.content ? this.props.opts.content : null),
                    (this.props.children ? this.props.children : null)
                ),
                React.createElement(
                    'div',
                    {className: 'dialogFooter'},
                    buttonList
                )
            )
        );
    }
}