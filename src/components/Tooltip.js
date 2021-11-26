import ReactTooltip from "react-tooltip";
import { Icon } from '@iconify/react'
import lightbulbIcon from '@iconify/icons-mdi/lightbulb'

const Tooltip = (props) => {
    return (
      <>
      <button data-tip data-for="registerTip">
        {lightbulbIcon}
      </button>
      <ReactTooltip place="top" effect="solid">
        {props.text}
      </ReactTooltip>
      </>
    )
}

export default Tooltip