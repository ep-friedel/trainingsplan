import React from 'react';
import PlanController from './PlanController.jsx';
import '../css/PlanList.css';

export default class UserPlanList extends React.Component {
    constructor(props) {
        super();

    }

    render() {
        let tp,
            tpList = [];

        if (!this.props.show) {
            return null;
        }

        for (tp in this.props.plans) {
            tpList.push(
                <PlanController key={tp} dataId={tp} options={this.props.plans[tp]} currentPlan={this.props.currentPlan} userId={this.props.userId} setPlan={this.props.setPlan} />
            );
        }
        return (
            <div className="planList">
                {tpList}
            </div>
        )
    }
}