import React from 'react';

export default class PlanList extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        if (!this.props.show) {
            return null;
        }

        let plans = this.props.plans.reduce((acc, plan, index) => {
            acc.push(<div className={"exerciseListRow pointer row " + (plan.selected ? 'selected' : '')} onClick={() => this.props.selectItem(index)}>
                    <img className="exerciseListImage" src={plan.imageUrl} />
                <h3>{plan.name}</h3>
            </div>);

            return acc;
        }, []);

        return (
            <div className="exerciseList">
                {this.props.showAddExercise ? (
                    <div className="exerciseListRow pointer row" onClick={() => this.props.selectItem('new')}>
                        <div className="fa fa-plus-circle exerciseListImage"></div>
                        <h3>Neuer Trainingsplan</h3>
                    </div>
                ) : null}
                {plans}
            </div>
        );
    }
}
