import React, { Component } from 'react'
import Select from 'react-select'
import axios from 'axios'
import {RELATIONSHIP_API_URL} from '../../constants'

export default class GroupIndivSelectSingle extends Component {

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

	async getOptions(){
		const res = await axios.get(RELATIONSHIP_API_URL+ "/GetAllGroupsAndIndivs/")
		const data = res.data

		const options = data.map(d => ({
			"value" : d.value,
			"label" : d.label
		}))

		this.setState({selectOptions: options})
/*
		const resIndiv = await axios.get(INDIVIDUALS_API_URL)
		const dataIndiv = resIndiv.data

		const optionsIndiv = dataIndiv.map(d => ({
			"value" : d.id,
			"label" : d.surname +', '+ d.firstname
		}))

		this.setState({selectOptions: options, ...optionsIndiv})
		*/
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