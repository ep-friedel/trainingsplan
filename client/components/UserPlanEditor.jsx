import React from 'react';

export default class UserPlanEditor extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        console.log(this.props)
        return (
            <div>
                <div className="colum">
                    <div className="row">
                        <h3>{this.props.template.name}</h3>
                        <div className="imageWrapper">
                            <img src={this.props.template.imageUrl} className="exerciseListImage" />
                        </div>
                    </div>
                    <div className="row">
                        <h3>Mein Name:</h3>
                        <input type="text" value={this.props.plan.name} onChange={(evt) => this.props.setProperty('name', evt.target.value)}/>
                    </div>
                    <div className="row">
                        <h3>Aktiv:</h3>
                        <input type="checkbox" checked={this.props.plan.active} onChange={(evt) => this.props.setProperty('active', evt.target.checked)}/>
                    </div>
                    <div className="row">
                        <h3>Anmerkung:</h3>
                        <textarea onChange={(evt) => this.props.setProperty('note', evt.target.value)}>{this.props.plan.note ? this.props.plan.note : this.props.template.note}</textarea>
                    </div>
                </div>
                {this.props.template.exercises.map((exercise, exIndex) => {
                    return (<div className="column">
                        <div className="row">
                            <h3>{exercise.name}</h3>
                            <div className="imageWrapper">
                                <img src={exercise.imageUrl} className="exerciseListImage" />
                            </div>
                        </div>
                        {Object.keys(exercise.setup).map(key => {
                            return (<div className="row">
                                <h4>{key}:</h4>
                                <input type={exercise.setup[key]} onChange={() => this.props.setSetupKey(exIndex, key, this.value)} />
                            </div>);
                        })}
                    </div>)
                })}
            </div>
        )
    }
}