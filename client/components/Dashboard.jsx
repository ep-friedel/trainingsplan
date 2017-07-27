import React from 'react';
import PlanList from './PlanList.jsx';
import ExerciseCreator from './ExerciseCreator.jsx';
import '../css/Dashboard.css';

export default class Dashboard extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <div className="dashBoard">
                {(() => {switch(this.props.activePage) {
                    case 'PlanList':
                        return <PlanList userId={this.props.options.user.id} show={true} currentPlan={this.props.options.currentPlan} plans={this.props.options.plans} setPlan={this.props.setPlan}/>;
                    case 'ExerciseCreator':
                        return <ExerciseCreator display="true"></ExerciseCreator>;
                    default:
                        return (
                            <ul>
                                <li className="dashboardItem pointer column" onClick={() => this.props.openPage('PlanList')}>
                                    <span className="fa fa-play dashboardIcon"></span>
                                    <p>Training starten</p>
                                </li>
                                <li className="dashboardItem pointer column" onClick={() => this.props.openPage('')}>
                                    <span className="fa fa-list-alt dashboardIcon"></span>
                                    <p>Trainingspläne verwalten</p>
                                </li>
                                <li className="dashboardItem pointer column" onClick={() => this.props.openPage('ExerciseCreator')}>
                                    <span className="fa fa-wrench dashboardIcon"></span>
                                    <p>Übungen verwalten</p>
                                </li>
                            </ul>
                        );
                    }
                })()}
            </div>
        );
    }
}
