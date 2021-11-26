import React, { Component } from 'react'
import Select from 'react-select'
import axios from 'axios'
import {GROUPS_API_URL} from '../../constants'

export default class GroupSelect extends Component {

	constructor(props){
		super(props)
		this.state = {
			selectOptions : [],
			id: "",
			name: ''
		}
	}

	componentDidMount(){
		this.getOptions()
	}

	async getOptions() {
		const res = await axios.get(GROUPS_API_URL)
		const data = res.data

		const options = data.map(d => ({
			"value" : d.id,
			"label" : d.title
		}))

		this.setState({selectOptions: options})
	}

	handleChange(e){
		this.setState({id:e.value, name:e.label})
		this.props.onChange(e.value)
	}

	render() {
		return (
			<div>
				<Select options={this.state.selectOptions} onChange={this.handleChange.bind(this)} />
			</div>
		)
	}
}