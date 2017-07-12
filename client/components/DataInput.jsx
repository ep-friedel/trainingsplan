import React from 'react';

export default class dataInput extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'h4',
                null,
                this.props.name
            ),
            React.createElement(
                'input',
                {
                    defaultValue: this.props.defaultValue,
                    onChange: (evt) => this.props.callback(evt.target.value),
                    className: this.props.className ? this.props.className : 'width90',
                    type: this.props.datatype ? this.props.datatype : 'text',
                    onClick: (evt) => evt.target.select()
                }
            ),
        );
    }
}