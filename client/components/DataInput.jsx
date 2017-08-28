import React from 'react';

export default class DataInput extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return React.createElement(
            'div',
            {className: (this.props.datatype ==='checkbox') ? 'row' : ''},
            React.createElement(
                'h4',
                {className:"margin-top"},
                this.props.name
            ),
            React.createElement(
                'input',
                {
                    defaultValue: this.props.defaultValue,
                    onChange: (evt) => this.props.callback((this.props.datatype === 'checkbox') ? evt.target.checked : evt.target.value),
                    className: this.props.className ? this.props.className : 'width90',
                    type: this.props.datatype ? this.props.datatype : 'text',
                    onClick: (evt) => evt.target.select()
                }
            ),
        );
    }
}