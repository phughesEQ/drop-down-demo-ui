import React, {useEffect} from 'react';
import './App.css';
import 'react-dropdown/style.css';
import axios from "axios";
import {Box, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";

const APIGatewayURL = '';

const sortAlphabetically = (first, second) => {
    let textA = first.name.toUpperCase();
    let textB = second.name.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
}

const convertResults = (item) => {
    return {
        label: `${item.partner.S} - ${item.vertical.S}`,
        value: item.itemId.S,
        name: `${item.partner.S} - ${item.vertical.S}`,
        attributes: item.attributes.S.split(',')
    }
}

function App() {
    let [integrationOptions, setIntegrationOptions] = React.useState([]);
    let [selectedAttributes, setSelectedAttributes] = React.useState([]);
    let [selectedOption, setSelectedOption] = React.useState('');

    const fetchData = async () => {
        const result = await axios.get(APIGatewayURL)
        const items = result.data.map(convertResults).sort(sortAlphabetically)

        setIntegrationOptions(items)
    }

    useEffect(() => {
        fetchData().catch((e) => console.error(e))
    }, [])

    const handleChange = (event) => {
        const id = event.target.value
        const attributes = integrationOptions.filter(item => item.value === id).flatMap(option => option.attributes)

        setSelectedOption(id);
        setSelectedAttributes(attributes);
    };

    return (
        <div className="App">

            <FormControl variant="standard" sx={{m: 1, minWidth: 200}}>
                <InputLabel id="demo-simple-select-label">Integration</InputLabel>
                <Select labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedOption}
                        label="Age"
                        onChange={handleChange}
                >{
                    integrationOptions.map(option => {
                        return <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    })
                }</Select>
            </FormControl>
            <Box component="form"
                 sx={{'& .MuiTextField-root': {m: 2, width: '25ch'},}}
                 noValidate
                 autoComplete="off"
            >
                <div>{
                    selectedAttributes
                        .map(attribute => attribute !== '' ? <TextField
                            key={attribute}
                            required
                            id={attribute}
                            label={attribute}
                            defaultValue=''
                        /> : '')
                }</div>
            </Box>
        </div>
    );
}

export default App;
