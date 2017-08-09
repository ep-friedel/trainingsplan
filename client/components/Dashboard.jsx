import React from 'react';
import UserPlanList from './UserPlanList.jsx';
import ExerciseEditorController from './ExerciseEditorController.jsx';
import ExerciseListController from './ExerciseListController.jsx';
import PlanListController from './PlanListController.jsx';
import '../css/Dashboard.css';

export default class Dashboard extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <div className="dashBoard">
                {(() => {switch(this.props.activePage) {
                    case 'UserPlanList':
                        return <UserPlanList userId={this.props.options.user.id} show={true} currentPlan={this.props.options.currentPlan} plans={this.props.options.plans} setPlan={this.props.setPlan}/>;
                    case 'ExerciseEditor':
                        return <ExerciseListController></ExerciseListController>;
                    case 'PlanEditor':
                        return <PlanListController></PlanListController>;
                    default:
                        return (
                            <ul>
                                <li className="dashboardItem pointer column" onClick={() => this.props.openPage('UserPlanList')}>
                                    <span className="fa fa-play dashboardIcon"></span>
                                    <p>Training starten</p>
                                </li>
                                <li className="dashboardItem pointer column" onClick={() => this.props.openPage('PlanEditor')}>
                                    <span className="fa fa-list-alt dashboardIcon"></span>
                                    <p>Trainingspläne verwalten</p>
                                </li>
                                <li className="dashboardItem pointer column" onClick={() => this.props.openPage('ExerciseEditor')}>
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
