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
import { makeStyles, useTheme } from '@material-ui/core/styles';
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
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import { MovieFilter,
         PhotoFilter,
         Brightness4,
         PanTool,
         AllOut,
         ExpandMore,
         Grain,
         ExpandLess } from '@material-ui/icons';


const drawerWidth = '20%';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
    height: '100%'
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  list: {
    alignItems: 'center',
    width: '100%'
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
// Drawer
//
export default function PersistentDrawerRight() {
  const classes = useStyles();
  const theme = useTheme();

  // Drawer handles
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Size handle
  const [sizeValue, setSizeValue] = React.useState(2.1);
  const handleSizeChange = (event, newValue) => {
    setSizeValue(newValue);
    materials[activeMat].uniforms[ 'u_size' ].value = newValue;
  };

  // Darkness handle
  const [darknessValue, setDarknessValue] = React.useState(2.1);
  const handleDarknessChange = (event, newValue) => {
    setDarknessValue(newValue);
    materials[activeMat].uniforms[ 'u_darkness' ].value = newValue;
  };

  // Draw marks handle
  const [drawMarksChecked, setDrawMarksChecked] = React.useState(true);
  const handleDrawMarks = (event) => {
    setDrawMarksChecked(event.target.checked);
    materials[activeMat].uniforms[ 'u_debug' ].value = event.target.checked;
  };
  
  // Accordion handle
  const [expanded, setAccordExpanded] = React.useState(false);
  const handleAccordChange = (panel) => (event, isExpanded) => {
    setAccordExpanded(isExpanded ? panel : false);
    
    console.log(panel);
    activeMat = panel;
    mesh.material = materials[activeMat];
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <Typography variant="h6" noWrap className={classes.title}>
            Shader play
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            className={clsx(open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <div className={classes.root}>
          <Grid container spacing={2} alignItems="center" justify="center" direction="column">
            <Grid item id="scene"/>
          </Grid>
        </div>
      </main>
      
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        
        <Accordion expanded={expanded === '0'} onChange={handleAccordChange('0')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon><PanTool/></ListItemIcon>
            <ListItemText primary="Hands effect 1" />
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <List className={classes.list}>
                 <ListItem divider={true}>
                   <ListItemIcon><AllOut /></ListItemIcon>
                   <Slider value={sizeValue}
                      onChange={handleSizeChange}
                      defaultValue={2.1}
                      valueLabelDisplay="auto"
                      step={0.01}
                      min={0.0}
                      max={3.0}
                    />
                 </ListItem>
                 <ListItem divider={true}>
                   <ListItemIcon><Brightness4 /></ListItemIcon>
                   <Slider value={darknessValue}
                      onChange={handleDarknessChange}
                      defaultValue={2.1}
                      valueLabelDisplay="auto"
                      step={0.1}
                      min={0.0}
                      max={15.0}
                    />
                 </ListItem>
                 <ListItem divider={true}>
                   <ListItemIcon><Grain /></ListItemIcon>
                   <Checkbox 
                      color="primary"
                      defaultChecked={false}
                      onChange={handleDrawMarks}
                      name="checkedA" />
                 </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === '1'} onChange={handleAccordChange('1')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon><MovieFilter /></ListItemIcon>
            <ListItemText primary="Filter 1" />
          </AccordionSummary>
          <Divider />          
          <AccordionDetails>
            <List className={classes.list}>
                 <ListItem divider={true}>
                   <ListItemIcon><AllOut /></ListItemIcon>
                   <Slider value={sizeValue}
                      onChange={handleSizeChange}
                      defaultValue={2.1}
                      valueLabelDisplay="auto"
                      step={0.01}
                      min={0.0}
                      max={3.0}
                    />
                 </ListItem>
                 <ListItem divider={true}>
                   <ListItemIcon><Brightness4 /></ListItemIcon>
                   <Slider value={darknessValue}
                      onChange={handleDarknessChange}
                      defaultValue={2.1}
                      valueLabelDisplay="auto"
                      step={0.1}
                      min={0.0}
                      max={15.0}
                    />
                 </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
      </Drawer>
    </div>
  );
}

//
// TODO: Add filters and hands effects
//

//
// Rendering 
//
/*
ReactDOM.render(
  <Layout />,
  document.getElementById("root")
);
*/

ReactDOM.render(
  <PersistentDrawerRight />,
  document.getElementById("root")
);

/*
ReactDOM.render(
  <EffectsList />,
  document.getElementById("effects")
);
*/

ReactDOM.render(
  <Scene />,
  document.getElementById('scene')
);

// RenderControls();
