import React from 'react';
import DataInput from './DataInput.jsx';
import DataTextArea from './DataTextArea.jsx';

export default class UserPlanEditor extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <div className="margin-bottom">
                <div className="colum margin-top">
                    <div className="row alignCenter start width90 margin-center">
                        <div className="imageWrapper margin-right">
                            <img src={this.props.template.imageUrl} className="exerciseListImage" />
                        </div>
                        <h3 className="no-margin">{this.props.template.name}</h3>
                    </div>
                    <DataInput defaultValue={this.props.plan.name ? this.props.plan.name : this.props.template.name}
                        callback={(value) => this.props.setProperty('name', value)}
                        className=""
                        name="Planname:"
                        datatype="text"></DataInput>
                    <DataInput defaultValue={this.props.plan.active}
                        callback={(checked) => this.props.setProperty('active', checked)}
                        className=""
                        name="Aktiv:"
                        datatype="checkbox"></DataInput>
                    <DataTextArea defaultValue={this.props.plan.note ? this.props.plan.note : this.props.template.note}
                        callback={note => this.props.setProperty('note', note)}
                        className=""
                        name="Anmerkungen:" ></DataTextArea>
                </div>
                {this.props.template.exercises.map((exercise, exIndex) => {
                    return (<div className="column margin-top">
                        <div className="row alignCenter start width90 margin-center margin-top">
                            <div className="imageWrapper margin-right">
                                <img src={exercise.imageUrl} className="exerciseListImage" />
                            </div>
                            <h3 className="no-margin">{exercise.name}</h3>
                        </div>
                        {Object.keys(exercise.setup).map(key => {
                            return (<DataInput defaultValue={exercise.name}
                            callback={value => this.props.setSetupKey(exIndex, key, value)}
                            className=""
                            name={key + ':'}
                            datatype={exercise.setup[key]}></DataInput>);
                        })}
                    </div>)
                })}
            </div>
        )
    }
}