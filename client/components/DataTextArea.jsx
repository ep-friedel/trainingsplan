import React from 'react';

export default class DataInput extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'h4',
                {className:"margin-top"},
                this.props.name
            ),
            React.createElement(
                'textarea',
                {
                    defaultValue: this.props.defaultValue,
                    onChange: (evt) => this.props.callback(evt.target.value),
                    className: this.props.className ? this.props.className : 'width100',
                    onClick: (evt) => evt.target.select()
                }
            ),
        );
    }
}