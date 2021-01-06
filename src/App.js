import './App.css';

import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import { resolution, materials, fingers } from './materials';

// TODO: separate UI
import 'fontsource-roboto';
import { Button } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { Slider } from '@material-ui/core';
import { Checkbox } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { FormGroup } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { ListSubheader } from '@material-ui/core';
import { List } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import { ListItemIcon } from '@material-ui/core';
import { ListItemText } from '@material-ui/core';
import { Collapse } from '@material-ui/core';
import { Divider } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


import { MovieFilter,
         PanTool,
         ExpandMore,
         ExpandLess } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  title: {
    flexGrow: 1,
  },
}));


//
// Debug marks checkbox
//
/*
function DebugMarks() {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    materials[activeMat].uniforms[ 'u_debug' ].value = event.target.checked;
  };

  return (
      <FormGroup row>
      <FormControlLabel
        control={<Checkbox 
                  color="primary"
                  defaultChecked={false}
                  onChange={handleChange}
                  name="checkedA" />}
        label="Draw marks"
      />
      </FormGroup>
  );
}
*/


//
// Toggle debug marks
//
class ToggleMarks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: materials[activeMat].uniforms[ 'u_debug' ].value};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick()
  {
    materials[activeMat].uniforms[ 'u_debug' ].value = !materials[activeMat].uniforms[ 'u_debug' ].value;    
    
    this.setState(state => ({
      isToggleOn: materials[activeMat].uniforms[ 'u_debug' ].value
    }));
  }

  render()
  {
    return (
      <Button size='large' variant="contained" color="primary" onClick={this.handleClick}>
        {materials[activeMat].uniforms[ 'u_debug' ].value ? 'Hide marks' : 'Draw marks'}
      </Button>
    );
  }
}

//
// Size
//
function SizeSlider() {
  const classes = useStyles();
  const [value, setValue] = React.useState(2.1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    materials[activeMat].uniforms[ 'u_size' ].value = newValue;
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item>
          <Typography id="continuous-slider" gutterBottom>
            Size
          </Typography>
        </Grid>
        <Grid item xs>
          <Slider value={value}
            onChange={handleChange}
            defaultValue={2.1}
            valueLabelDisplay="auto"
            step={0.01}
            min={0.0}
            max={3.0}
          />
        </Grid>
      </Grid>
    </div>
  );
};

//
// Darkness
//
function DarknesSlider() {
  const classes = useStyles();
  const [value, setValue] = React.useState(1.5);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    materials[activeMat].uniforms[ 'u_darkness' ].value = newValue;
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item>
          <Typography id="continuous-slider" gutterBottom>
            Darkness
          </Typography>
        </Grid>
        <Grid item xs>
          <Slider value={value}
            onChange={handleChange}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
            step={0.1}
            min={0.0}
            max={15.0}
          />
        </Grid>
      </Grid>
    </div>
  );
};


//
// Layout
//
var MAX_SLOT = 10;

function Layout() {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item id="app_bar" xs={12}>
        </Grid>
        
        <Grid item id="scene" xs={6}/><Grid item id="effects" xs={6}xs/>
        <Grid item xs={6}/> <Grid item xs={6}><Divider /></Grid>
        
        <Grid item id="info" xs={6} />
        <Grid item id="slot_0"  xs={6}/>
        
        <Grid item xs={6}/> <Grid item id="slot_1"  xs={6} />
        <Grid item xs={6}/> <Grid item id="slot_2"  xs={6} />
        <Grid item xs={6}/> <Grid item id="slot_3"  xs={6} />
        <Grid item xs={6}/> <Grid item id="slot_4"  xs={6} />
        <Grid item xs={6}/> <Grid item id="slot_5"  xs={6} />
        <Grid item xs={6}/> <Grid item id="slot_6"  xs={6} />
        <Grid item xs={6}/> <Grid item id="slot_7"  xs={6} />
        <Grid item xs={6}/> <Grid item id="slot_8"  xs={6} />
        <Grid item xs={6}/> <Grid item id="slot_9"  xs={6} />
      </Grid>
    </div>
  );
};


//
// Globals
//
var mesh;
var activeMat = 0, maxMat = 2;
var controlsNum = 0;

//
// Scene
//
class Scene extends React.Component
{
  componentDidMount()
  {
    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(resolution.x, resolution.y);

    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    this.mount.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneBufferGeometry( 2, 2 );
    mesh = new THREE.Mesh(geometry, materials[activeMat]);
    scene.add(mesh);

    var animate = function ()
    {
      requestAnimationFrame( animate );

      materials[activeMat].uniforms[ 'u_time' ].value = performance.now() / 1000;
      materials[activeMat].uniforms[ 'u_resolution'    ].value = resolution;
      materials[activeMat].uniforms[ 'u_fingers_right' ].value = fingers[0];
      materials[activeMat].uniforms[ 'u_fingers_left'  ].value = fingers[1];
      
      renderer.render(scene, camera);
    };

    animate();
  }

  render()
  {
    return ( <div ref={ref =>	(this.mount = ref)} />)
  }
}

//
// Info
//
function Info()
{
  const classes = useStyles();
  return ( <Paper className={classes.paper} >
            {materials[activeMat].uniforms[ 'info' ].value}
          </Paper> );
}

//
// Controls
//
function RenderControls()
{
  let newControlsNum = 0;
  for (const property in materials[activeMat].uniforms)
  {
    const control = materials[activeMat].uniforms[property].control;
    
    if( typeof control !== 'undefined')
    {
      const slot = document.getElementById("slot_" + (newControlsNum++));
      ReactDOM.unmountComponentAtNode(slot)
      ReactDOM.render(React.createElement(eval(control)), slot);
    }
  }
  
  for (let s=newControlsNum; s<controlsNum; s++)
  {
    const slot = document.getElementById("slot_" + s);
    ReactDOM.unmountComponentAtNode(slot)
  }
  
  controlsNum = newControlsNum;
  
  ReactDOM.render(
    <Info />,
    document.getElementById("info")
  );
}

//
// Effects list
//
function EffectsList() {
  const classes = useStyles();
  
  // Handle filters collapse
  const [openFilters, setOpenFilters] = React.useState(false);
  const handleClickCollapseFilters = () => {
    setOpenFilters(!openFilters);
  };

  // Handle hands collapse
  const [openHands, setOpenHands] = React.useState(false);
  const handleClickCollapseHands = () => {
    setOpenHands(!openHands);
  };

  // Handle item click
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    activeMat = index;
    mesh.material = materials[activeMat];
    RenderControls();
  };

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}>

      <Divider />
      <ListItem button onClick={handleClickCollapseFilters}>
        <ListItemIcon>
          <MovieFilter />
        </ListItemIcon>
        <ListItemText primary="Filters" />
        {openFilters ? <ExpandLess /> :
                       <ExpandMore /> }
      </ListItem>
      
      <Collapse in={openFilters} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
        
          <ListItem button className={classes.nested}  selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
            <ListItemIcon>
              <MovieFilter fontSize="inherit" />
            </ListItemIcon>
            <ListItemText primary="Filter 1" />
          </ListItem>

          <ListItem button className={classes.nested}  selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
            <ListItemIcon>
              <MovieFilter fontSize="inherit" />
            </ListItemIcon>
            <ListItemText primary="Filter 2" />
          </ListItem>
        
        </List>
      </Collapse>

      <Divider />
       
      <ListItem button onClick={handleClickCollapseHands}>
        <ListItemIcon>
          <PanTool />
        </ListItemIcon>

        <ListItemText primary="Hands" />
        {openHands ? <ExpandLess /> :
                     <ExpandMore /> }
      </ListItem>
      
      <Collapse in={openHands} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
        
          <ListItem button className={classes.nested} selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}  >
            <ListItemIcon>
              <PanTool fontSize="inherit" />
            </ListItemIcon>
            <ListItemText primary="Hands 1" />
          </ListItem>

          <ListItem button className={classes.nested} selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1) } >
            <ListItemIcon>
              <PanTool fontSize="inherit" />
            </ListItemIcon>
            <ListItemText primary="Hands 2" />
          </ListItem>
        
        </List>
      </Collapse>
      <Divider />
    </List>
  );
}

//
// Application bar
//
function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Shader play
          </Typography>
          <Button color="inherit">About</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

//
// Rendering 
//
ReactDOM.render(
  <Layout />,
  document.getElementById("root")
);

ReactDOM.render(
  <ButtonAppBar />,
  document.getElementById("app_bar")
);

ReactDOM.render(
  <EffectsList />,
  document.getElementById("effects")
);

ReactDOM.render(
  <Scene />,
  document.getElementById('scene')
);

RenderControls();
