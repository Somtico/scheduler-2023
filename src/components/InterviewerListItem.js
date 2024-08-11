import React from "react";
import classnames from "classnames";

import "components/InterviewerListItem.scss";

export default function InterviewerItem(props) {
  const itemClass = classnames("interviewers__item", {
    "interviewers__item--selected": props.selected
  });

  return (
    <li className={itemClass} data-testid="interviewers" onClick={props.setInterviewer}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
        data-testid="interviewer"
      />
      {props.selected && props.name}
    </li>
  );
}
