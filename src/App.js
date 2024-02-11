//
// TODO:
// 1. Frame heught back
//
import './App.css';

import React from 'react';
import ReactDOM from 'react-dom';

import * as THREE from 'three';

import 'fontsource-roboto';
import { Button } from '@material-ui/core';
import { Slider } from '@material-ui/core';
import { Checkbox } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import { ListItemIcon } from '@material-ui/core';
import { ListItemText } from '@material-ui/core';
import { Divider } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link';
import Hidden from '@material-ui/core/Hidden';
import { ChromePicker } from 'react-color';

import { MovieFilter,
         BubbleChart,
         Brightness4,
         PanTool,
         AllOut,
         Grain,
         HelpOutline,
         BorderBottom,
         BorderLeft,
         SwapHoriz,
         SwapVert,
         VerticalSplit,
         ZoomOutMap,
         Iso,
         InvertColors,
         ColorLens,
         Face,
         Settings,
         CallMade,
         CallReceived,
         ExpandLess,
         Equalizer,
         FormatSize,
         Filter1,
         Filter2,
         Filter3,
         ThumbUp,
         ThumbDown,
         SignalCellularNull,
         Business,
         BlurOn,
         BorderAll } from '@material-ui/icons';

import { resolution, materials } from './materials';
import { Scene } from './scene';
import { videoMesh } from './scene';
import { renderer } from './scene';
import { mask, masksData, maskMaterials } from './mask';

//
// Globals
//
const drawerWidth = '20%';
var activeMat = 10;
var activeMask = 2;
var fontSize = 0.008;
var threshold = 0.0001;
var drawMarks = true;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(rgb(88, 88, 88), rgb(0, 0, 0))'
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: '#292929',
    color: '#c1c1c1'
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth
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
    background: '#292929',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
    color: '#c1c1c1'
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
    width: '100%',
    background: '#292929'
  },
  customTooltip: {
    backgroundColor: 'rgba(55, 55, 55, 0.6)',
    color: 'rgba(193, 193, 193, 1)',
    fontSize: 14
  },
  mark: {
    color: "#c1c1c1"
  },
  customArrow: {
    fontSize: 20,
    color: 'rgba(63, 81, 181, 1)',
    "&::before": {
      backgroundColor: "rgba(0, 0, 0, 0)",
      border: "2px solid #ff9127"
    }
  }
}));

//
// Drawer
//
export default function PersistentDrawerRight() {
  const classes = useStyles();
  const theme = useTheme();

  // Drawer handles
  const [open, setEffectsOpen] = React.useState(false);
  function handleEffectsOpen() {
    setEffectsOpen(true);
  }
  function handleEffectsClose() {
    setEffectsOpen(false);
  }

  // Settings handle
  const [openSettings, setOpenSettings] = React.useState(false);
  function handleSettingsOpen() {
    setOpenSettings(true);
  }
  function handleSettingsClose() {
    setOpenSettings(false);
  }
  
  // Size handle
  const [sizeValue, setSizeValue] = React.useState(2.1);
  function handleSizeChange(event, newValue) {
    setSizeValue(newValue);
    materials[activeMat].uniforms['u_size'].value = newValue;
  }

// WhirlpoolA handle
  const [whirlpoolA, setWhirlpoolA] = React.useState(400.0);
  function handleWhirlpoolA(event, newValue) {
    setWhirlpoolA(newValue);
    materials[activeMat].uniforms['u_a'].value = newValue;
  }

// WhirlpoolB handle
  const [whirlpoolB, setWhirlpoolB] = React.useState(200.0);
  function handleWhirlpoolB(event, newValue) {
    setWhirlpoolB(newValue);
    materials[activeMat].uniforms['u_b'].value = newValue;
  }

// Scale handle
  const [scaleValue, setScaleValue] = React.useState(resolution.y);
  function handleScaleChange(event, newValue) {
    setScaleValue(newValue);
    const aspect = resolution.x / resolution.y;
    resolution.y = newValue;
    resolution.x = resolution.y * aspect;
    renderer.setSize(resolution.x, resolution.y);
  }

  // Fonts scale handle
  const [fontSizeValue, setFontSize] = React.useState(0.005);
  function handleFontSizeChange(event, newValue) {
    setFontSize(newValue);
    fontSize = newValue;
  }

  // Threshold change handle
  const [thresholdValue, setThresholdValue] = React.useState(0.0001);
  function handleThresholdChange(event, newValue) {
    setThresholdValue(newValue);
    threshold = newValue;
  }

  // Toon hue handle
  const [toonHue, setToonHue] = React.useState([1.0, 106.0, 219.0, 296.0]);
  function handleToonHue(event, newValue) {
    setToonHue(newValue);
    materials[activeMat].uniforms['u_hue_levels'].value = newValue;
  }

  // Toon sat handle
  const [toonSat, setToonSat] = React.useState([0.0, 0.3, 0.6, 1.0]);
  function handleToonSat(event, newValue) {
    setToonSat(newValue);
    materials[activeMat].uniforms['u_sat_levels'].value = newValue;
  }

  // Toon value handle
  const [toonValue, setToonValue] = React.useState([0.0, 0.3, 0.6, 1.0]);
  const handleToonValue = (event, newValue) => {
    setToonValue(newValue);
    materials[activeMat].uniforms[ 'u_val_levels' ].value = newValue;
  };

  // Poster gamma handle
  const [posterGamma, setPosterGamma] = React.useState(4.0);
  const handlePosterGamma = (event, newValue) => {
    setPosterGamma(newValue);
    materials[activeMat].uniforms[ 'u_gamma' ].value = newValue;
  };

  // Poster number of colors handle
  const [posterNumColors, setPosterNumColors] = React.useState(8.0);
  const handlePosterNumColors = (event, newValue) => {
    setPosterNumColors(newValue);
    materials[activeMat].uniforms[ 'u_num_colors' ].value = newValue;
  };

  // Gobelin size handle
  const [gobelinSize, setGobelinSize] = React.useState(6.0);
  const handleGobelinSize = (event, newValue) => {
    setGobelinSize(newValue);
    materials[activeMat].uniforms[ 'u_size' ].value = newValue;
  };

  // Gobelin dim handle
  const [gobelinDim, setGobelinDim] = React.useState(768.0);
  const handleGobelinDim = (event, newValue) => {
    setGobelinDim(newValue);
    materials[activeMat].uniforms[ 'u_dim' ].value = newValue;
  };

  // Gobelin invert handle
  const [gobelinInvert, setGobelinInvert] = React.useState(false);
  const handleGobelinInvert = (event) => {
    setGobelinInvert(event.target.checked);
    materials[activeMat].uniforms[ 'u_invert' ].value = event.target.checked;
  };

  // Line handle
  const [lineLimit, setLineLimit] = React.useState(0.5);
  const handleLineLimit = (event, newValue) => {
    setLineLimit(newValue);
    materials[activeMat].uniforms[ 'u_limit' ].value = newValue;
  };

  // Sobel dX handle
  const [sobelDxValue, setSobelDxValue] = React.useState(0.002);
  const handleSobelDx = (event, newValue) => {
    setSobelDxValue(newValue);
    materials[activeMat].uniforms[ 'u_dX' ].value = newValue;
  };
  
  // Sobel dY handle
  const [sobelDyValue, setSobelDyValue] = React.useState(0.002);
  const handleSobelDy = (event, newValue) => {
    setSobelDyValue(newValue);
    materials[activeMat].uniforms[ 'u_dY' ].value = newValue;
  };

  // Honeycombs size handle
  const [sizeHoneyValue, setHoneySizeValue] = React.useState(0.01);
  const handleHoneySizeChange = (event, newValue) => {
    setHoneySizeValue(newValue);
    materials[activeMat].uniforms[ 'u_size' ].value = newValue;
  };

  // Pixel x-size handle
  const [pixelSizeXValue, setPixelSizeValueX] = React.useState(1024.0);
  const handlePixelSizeXChange = (event, newValue) => {
    setPixelSizeValueX(newValue);
    materials[activeMat].uniforms[ 'u_size_x' ].value = newValue;
  };

  // Pixel y-size handle
  const [pixelSizeYValue, setPixelSizeValueY] = React.useState(768.0);
  const handlePixelSizeYChange = (event, newValue) => {
    setPixelSizeValueY(newValue);
    materials[activeMat].uniforms[ 'u_size_y' ].value = newValue;
  };

  // Darkness handle
  const [darknessValue, setDarknessValue] = React.useState(2.1);
  const handleDarknessChange = (event, newValue) => {
    setDarknessValue(newValue);
    materials[activeMat].uniforms[ 'u_darkness' ].value = newValue;
  };

  // Active mask handle
  const masksMarks = [
    {
      value: 0,
      label: 'Beard',
    },
    {
      value: 1,
      label: 'Eyes',
    },
    {
      value: 2,
      label: 'Demon',
    }
  ];
  const [activeMaskValue, setActiveMaskValue] = React.useState(2);
  function handleActiveMaskChange(event, newValue) {
    setActiveMaskValue(newValue);
    activeMask = newValue;
    mask.geometry = masksData[activeMask].geometry;
    mask.geometry.setDrawRange( 0, masksData[activeMask].range);
    
    if(mask.material !== maskMaterials.Grid)
      mask.material = masksData[activeMask].material;
  }

  // Blending handle
  const blendings = [ THREE.NoBlending,
                      THREE.NormalBlending,
                      THREE.AdditiveBlending,
                      THREE.SubtractiveBlending,
                      THREE.MultiplyBlending ];
  const blendingsMarks = [
    {
      value: 0,
      label: 'No',
    },
    {
      value: 1,
      label: 'Normal',
    },
    {
      value: 2,
      label: 'Add',
    },
    {
      value: 3,
      label: 'Sub',
    },
    {
      value: 4,
      label: 'Mul',
    }
  ];

  const [blendingValue, setBlendingValue] = React.useState(1);
  function handleBlending(event, newValue) {
    setBlendingValue(newValue);
    mask.material.blending = blendings[newValue];
  }

  // Material transparency handle
  const [matGridTexture, setGridTexture] = React.useState(false);
  const handleGridTexture = (event) => {
    setGridTexture(event.target.checked);
    if(event.target.checked)
      mask.material = maskMaterials.Grid;
    else
      mask.material = masksData[activeMask].material;
  };

  // Draw marks handle
  const [drawMarksChecked, setDrawMarksChecked] = React.useState(false);
  const handleDrawMarks = (event) => {
    setDrawMarksChecked(event.target.checked);
    drawMarks = event.target.checked;

    if(materials[activeMat].uniforms['u_debug'])
    materials[activeMat].uniforms['u_debug'].value = drawMarks;
  };
  
  // Accordion handle
  const [expanded, setAccordExpanded] = React.useState(false);
  const handleAccordChange = (material, mask) => (event, isExpanded) => {
    setAccordExpanded(isExpanded ? material : false);
    activeMat = material;
    activeMask = mask;
    videoMesh.material = materials[activeMat];
  };

  // Dialog
  const [openHelp, setOpenHelp] = React.useState(false);
  const handleOpenHelp = () => {
    setOpenHelp(true);
  };
  const handleCloseHelp = () => {
    setOpenHelp(false);
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
        <Toolbar position="sticky">
          <Typography variant="h6" noWrap className={classes.title}>
            Shader Pipe
          </Typography>

          <IconButton
            aria-label="open drawer"
            edge="end"
            onClick={handleEffectsOpen}
            className={clsx(open && classes.hide)}
            style={{ color: '#ff9127' }}>
            <BubbleChart />
          </IconButton>

          <IconButton
            edge="end"
            onClick={handleSettingsOpen}
            className={clsx(open && classes.hide)}
            style={{ color: '#ff9127' }}>
            <Settings />
          </IconButton>

          <IconButton
            edge="end"
            onClick={handleOpenHelp}
            className={clsx(open && classes.hide)}
            style={{ color: '#ff9127' }}>
            <HelpOutline />
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
          <Grid container spacing={2} alignItems="center" justifyContent="center" direction="column">
            <Grid item id="scene"/>
          </Grid>
        </div>
      </main>

      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={openSettings}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <ListItemIcon style={{ color: '#ff9127' }}><Settings/></ListItemIcon>
          <ListItemText primary="Settings" style={{ color: '#c1c1c1' }}/>
          <IconButton onClick={handleSettingsClose}
            style={{ color: '#FF9127' }}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
         <ListItem divider={true}>
            <Tooltip title="Frame height" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
              <ListItemIcon style={{ color: '#c1c1c1' }}><ZoomOutMap/></ListItemIcon>
            </Tooltip>
            <Slider value={scaleValue}
              onChange={handleScaleChange}
              defaultValue={resolution.y}
              valueLabelDisplay="auto"
              step={1.0}
              min={480}
              max={5200}
              classes={{ markLabel: classes.mark }}
              style={{ color: '#FF9127' }}/>
          </ListItem>

          <ListItem divider={true}>
            <Tooltip title="Noise threshold" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
              <ListItemIcon style={{ color: '#c1c1c1' }}><Equalizer/></ListItemIcon>
            </Tooltip>
            <Slider value={thresholdValue}
              onChange={handleThresholdChange}
              defaultValue={0.0001}
              valueLabelDisplay="auto"
              step={0.0001}
              min={0.0001}
              max={0.01}
              classes={{ markLabel: classes.mark }}
              style={{ color: '#FF9127' }}/>
          </ListItem>

          <ListItem divider={true}>
            <Tooltip title="Landmarks size" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
              <ListItemIcon style={{ color: '#c1c1c1' }}><FormatSize/></ListItemIcon>
            </Tooltip>
            <Slider value={fontSizeValue}
              onChange={handleFontSizeChange}
              defaultValue={0.008}
              valueLabelDisplay="auto"
              step={0.0001}
              min={0.001}
              max={0.01}
              classes={{ markLabel: classes.mark }}
              style={{ color: '#FF9127' }}/>
          </ListItem>

          <ListItem divider={true}>
            <Tooltip title="Landmarks" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
              <ListItemIcon style={{ color: '#c1c1c1' }}><Grain /></ListItemIcon>
            </Tooltip>
            <Checkbox 
              style = {{color: "#ff9127"}} 
              defaultChecked={true}
              onChange={handleDrawMarks}
              name="checkedA" />
          </ListItem>
          </List>
      </Drawer>

      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}>
        <div className={classes.drawerHeader}>
          <ListItemIcon style={{ color: '#ff9127' }}><BubbleChart/></ListItemIcon>
          <ListItemText primary="Effects" style={{ color: '#c1c1c1' }}/>
          <IconButton onClick={handleEffectsClose}
            style={{ color: '#FF9127' }}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        
        <Accordion expanded={activeMat === 10} onChange={handleAccordChange(10, 2)} style={{ background: '#292929' }}>
          <AccordionSummary
            expandIcon={activeMat === 10 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header">
            <ListItemIcon style={{ color: '#ff9127' }}><Face /></ListItemIcon>
            <ListItemText primary="Mask" style={{ color: '#c1c1c1' }}/>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <List className={classes.list}>
              <ListItem divider={true}>
                <Tooltip title="Geometry" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><SignalCellularNull /></ListItemIcon>
                </Tooltip>
                <Slider value={activeMaskValue}
                  onChange={handleActiveMaskChange}
                  defaultValue={2}
                  valueLabelDisplay="auto"
                  marks={masksMarks}
                  step={1}
                  min={0}
                  max={2}
                  classes={{ markLabel: classes.mark }}
                  style={{ color: '#ff9127' }}/>
              </ListItem>

              <ListItem divider={true}>
                <Tooltip title="Blending" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><Business /></ListItemIcon>
                </Tooltip>
                <Slider value={blendingValue}
                  onChange={handleBlending}
                  defaultValue={1}
                  valueLabelDisplay="auto"
                  marks={blendingsMarks}
                  step={1}
                  min={0}
                  max={4}
                  classes={{ markLabel: classes.mark }}
                  style={{ color: '#ff9127' }}/>
              </ListItem>

              <ListItem divider={true}>
              <Tooltip title="Grid texture" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                <ListItemIcon style={{ color: '#c1c1c1' }}><BorderAll /></ListItemIcon>
              </Tooltip>
              <Checkbox
                style = {{color: "#ff9127"}}
                defaultChecked={false}
                onChange={handleGridTexture}/>
              </ListItem>

              <ListItem divider={true}>
                <Tooltip title="Vertex 1" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><Filter1 /></ListItemIcon>
                </Tooltip>
                <ChromePicker
                color={ '#000' }
                onChangeComplete={color => {
                 for(let c=0; c<mask.geometry.attributes.color.array.length;)
                 {
                    mask.geometry.attributes.color.array[c++] = parseFloat(color.rgb.r) / 255.0;
                    mask.geometry.attributes.color.array[c++] = parseFloat(color.rgb.g) / 255.0;
                    mask.geometry.attributes.color.array[c++] = parseFloat(color.rgb.b) / 255.0;
                    c+=6;
                 }

                }}/>
              </ListItem>

              <ListItem divider={true}>
                <Tooltip title="Vertex 2" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><Filter2 /></ListItemIcon>
                </Tooltip>
                <ChromePicker
                  color={ '#000' }
                  onChangeComplete={color => {
                    for(let c=0; c<mask.geometry.attributes.color.array.length;)
                    {
                      c+=3;
                      mask.geometry.attributes.color.array[c++] = parseFloat(color.rgb.r) / 255.0;
                      mask.geometry.attributes.color.array[c++] = parseFloat(color.rgb.g) / 255.0;
                      mask.geometry.attributes.color.array[c++] = parseFloat(color.rgb.b) / 255.0;
                      c+=3;
                    }
                  }}/>
              </ListItem>

              <ListItem divider={true}>
                <Tooltip title="Vertex 3" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><Filter3 /></ListItemIcon>
                </Tooltip>
                <ChromePicker
                  color={ '#000' }
                  onChangeComplete={color => {
                    for(let c=0; c<mask.geometry.attributes.color.array.length;)
                    {
                      c+=6;
                      mask.geometry.attributes.color.array[c++] = parseFloat(color.rgb.r) / 255.0;
                      mask.geometry.attributes.color.array[c++] = parseFloat(color.rgb.g) / 255.0;
                      mask.geometry.attributes.color.array[c++] = parseFloat(color.rgb.b) / 255.0;
                    }
                  }}/>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion expanded={activeMat === 0} onChange={handleAccordChange(0)} style={{ background: '#292929' }}>
          <AccordionSummary
            expandIcon={activeMat === 0 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header">
            <ListItemIcon style={{ color: '#ff9127' }}><PanTool/></ListItemIcon>
            <ListItemText primary="Fireball" style={{ color: '#c1c1c1' }}/>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <List className={classes.list}>
              <ListItem divider={true}>
                <Tooltip title="Size" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><AllOut /></ListItemIcon>
                </Tooltip>   
                <Slider value={sizeValue}
                  onChange={handleSizeChange}
                  defaultValue={2.1}
                  valueLabelDisplay="auto"
                  step={0.01}
                  min={0.0}
                  max={3.0}
                  classes={{ markLabel: classes.mark }}
                  style={{ color: '#FF9127' }}/>
              </ListItem>
              <ListItem divider={true}>
                <Tooltip title="Darkness" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><Brightness4 /></ListItemIcon>
                </Tooltip>
                <Slider value={darknessValue}
                  onChange={handleDarknessChange}
                  defaultValue={2.1}
                  valueLabelDisplay="auto"
                  step={0.1}
                  min={0.0}
                  max={15.0}
                  classes={{ markLabel: classes.mark }}
                  style={{ color: '#FF9127' }}/>
              </ListItem>
              <ListItem divider={true}>
                <Tooltip title="Color" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><ColorLens /></ListItemIcon>
                </Tooltip>
                <ChromePicker
                color={ '#000' }
                onChangeComplete={color => {
                  materials[activeMat].uniforms['u_left_hand_color'].value = [parseFloat(color.rgb.r) / 255.0,
                                                                              parseFloat(color.rgb.g) / 255.0,
                                                                              parseFloat(color.rgb.b) / 255.0,
                                                                              parseFloat(color.rgb.a) / 255.0]; }}/>
{/*                                                                              
              </ListItem>
              <ListItem divider={true}>
                <Tooltip title="Right hand color" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><ThumbDown /></ListItemIcon>
                </Tooltip>
                <ChromePicker
                color={ '#000' }
                onChangeComplete={color => {
                  materials[activeMat].uniforms['u_right_hand_color'].value = [parseFloat(color.rgb.r) / 255.0,
                                                                               parseFloat(color.rgb.g) / 255.0,
                                                                               parseFloat(color.rgb.b) / 255.0,
                                                                               parseFloat(color.rgb.a) / 255.0]; }}/>
*/}                                                                               
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={activeMat === 1} onChange={handleAccordChange(1)} style={{ background: '#292929' }}>
          <AccordionSummary
            expandIcon={activeMat === 1 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header">
            <ListItemIcon style={{ color: '#ff9127' }}><MovieFilter /></ListItemIcon>
            <ListItemText primary="Whirlpool" style={{ color: '#c1c1c1' }}/>
          </AccordionSummary>
          <Divider />          
          <AccordionDetails>
            <List className={classes.list}>
            <ListItem divider={true}>
              <Tooltip title="Scale A" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                <ListItemIcon style={{ color: '#c1c1c1' }}><CallReceived /></ListItemIcon>
              </Tooltip>  
                <Slider value={whirlpoolA}
                  onChange={handleWhirlpoolA}
                  defaultValue={2.1}
                  valueLabelDisplay="auto"
                  step={10.0}
                  min={10.0}
                  max={1000.0}
                  classes={{ markLabel: classes.mark }}
                  style={{ color: '#FF9127' }}/>
            </ListItem>
            <ListItem divider={true}>
              <Tooltip title="Scale B" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                <ListItemIcon style={{ color: '#c1c1c1' }}><CallMade /></ListItemIcon>
              </Tooltip>
              <Slider value={whirlpoolB}
                  onChange={handleWhirlpoolB}
                  defaultValue={2.1}
                  valueLabelDisplay="auto"
                  step={10.0}
                  min={10.0}
                  max={1000.0}
                  classes={{ markLabel: classes.mark }}
                  style={{ color: '#FF9127' }}/>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion expanded={activeMat === 2} onChange={handleAccordChange(2)} style={{ background: '#292929' }}>
          <AccordionSummary
            expandIcon={activeMat === 2 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon style={{ color: '#ff9127' }}><MovieFilter /></ListItemIcon>
            <ListItemText primary="Toon" style={{ color: '#c1c1c1' }}/>
          </AccordionSummary>
          <Divider />          
          <AccordionDetails>
            <List className={classes.list}>
              <ListItem divider={true}>
                <Tooltip title="Hue levels" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><ColorLens /></ListItemIcon>
                </Tooltip>  
                  <Slider value={toonHue}
                    onChange={handleToonHue}
                    defaultValue={[1.0, 106.0, 219.0, 296.0]}
                    valueLabelDisplay="auto"
                    step={1.0}
                    min={1.0}
                    max={360.0}
                    classes={{ markLabel: classes.mark }}
                    style={{ color: '#FF9127' }}/>
              </ListItem>

              <ListItem divider={true}>
                <Tooltip title="Saturation levels" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><InvertColors /></ListItemIcon>
                </Tooltip>  
                  <Slider value={toonSat}
                    onChange={handleToonSat}
                    defaultValue={[0.0, 0.3, 0.6, 1.0]}
                    valueLabelDisplay="auto"
                    step={0.01}
                    min={0.01}
                    max={1.0}
                    classes={{ markLabel: classes.mark }}
                    style={{ color: '#FF9127' }}/>
              </ListItem>

              <ListItem divider={true}>
                <Tooltip title="Value levels" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><Brightness4 /></ListItemIcon>
                </Tooltip>  
                  <Slider value={toonValue}
                    onChange={handleToonValue}
                    defaultValue={[0.0, 0.3, 0.6, 1.0]}
                    valueLabelDisplay="auto"
                    step={0.01}
                    min={0.01}
                    max={1.0}
                    classes={{ markLabel: classes.mark }}
                    style={{ color: '#FF9127' }}/>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={activeMat === 3} onChange={handleAccordChange(3)} style={{ background: '#292929' }}>
          <AccordionSummary
            expandIcon={activeMat === 3 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon style={{ color: '#ff9127' }}><MovieFilter /></ListItemIcon>
            <ListItemText primary="Posterize" style={{ color: '#c1c1c1' }}/>
          </AccordionSummary>
          <Divider />          
          <AccordionDetails>
            <List className={classes.list}>
                <ListItem divider={true}>
                  <Tooltip title="Gamma" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                    <ListItemIcon style={{ color: '#c1c1c1' }}><InvertColors /></ListItemIcon>
                  </Tooltip>  
                   <Slider value={posterGamma}
                      onChange={handlePosterGamma}
                      defaultValue={4.0}
                      valueLabelDisplay="auto"
                      step={0.1}
                      min={0.1}
                      max={12.0}
                      classes={{ markLabel: classes.mark }}
                      style={{ color: '#FF9127' }}/>
                </ListItem>
                <ListItem divider={true}>
                  <Tooltip title="Number of colors" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                    <ListItemIcon style={{ color: '#c1c1c1' }}><ColorLens /></ListItemIcon>
                  </Tooltip>
                  <Slider value={posterNumColors}
                      onChange={handlePosterNumColors}
                      defaultValue={8.0}
                      valueLabelDisplay="auto"
                      step={1.0}
                      min={2.0}
                      max={32.0}
                      classes={{ markLabel: classes.mark }}
                      style={{ color: '#FF9127' }}/>
                 </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion expanded={activeMat === 4} onChange={handleAccordChange(4)} style={{ background: '#292929' }}>
          <AccordionSummary
            expandIcon={activeMat === 4 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon style={{ color: '#ff9127' }}><MovieFilter /></ListItemIcon>
            <ListItemText primary="Crosshatch" style={{ color: '#c1c1c1' }}/>
          </AccordionSummary>
        </Accordion>
        
        <Accordion expanded={activeMat === 5} onChange={handleAccordChange(5)} style={{ background: '#292929' }}>
          <AccordionSummary
            expandIcon={activeMat === 5 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon style={{ color: '#ff9127' }}><MovieFilter /></ListItemIcon>
            <ListItemText primary="Gobelin" style={{ color: '#c1c1c1' }}/>
          </AccordionSummary>
          <Divider />
          
          <AccordionDetails>
            <List className={classes.list}>
              <ListItem divider={true}>
                <Tooltip title="Size" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><AllOut /></ListItemIcon>
                </Tooltip>  
                  <Slider value={gobelinSize}
                    onChange={handleGobelinSize}
                    defaultValue={6.0}
                    valueLabelDisplay="auto"
                    step={1.0}
                    min={5.0}
                    max={25.0}
                    classes={{ markLabel: classes.mark }}
                    style={{ color: '#FF9127' }}/>
              </ListItem>
              
              <ListItem divider={true}>
                <Tooltip title="Dimension" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><ZoomOutMap /></ListItemIcon>
                </Tooltip>  
                  <Slider value={gobelinDim}
                    onChange={handleGobelinDim}
                    defaultValue={768.0}
                    valueLabelDisplay="auto"
                    step={10.0}
                    min={200.0}
                    max={1000.0}
                    classes={{ markLabel: classes.mark }}
                    style={{ color: '#FF9127' }}/>
              </ListItem>
              <ListItem divider={true}>
                <Tooltip title="Invert" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><Iso /></ListItemIcon>
                </Tooltip>  
                  <Checkbox
                    style = {{color: "#ff9127"}} 
                    defaultChecked={false}
                    onChange={handleGobelinInvert}
                    name="checkedGobelinInvert" />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion expanded={activeMat === 6} onChange={handleAccordChange(6)} style={{ background: '#292929' }}>
          <AccordionSummary
            expandIcon={activeMat === 6 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon style={{ color: '#ff9127' }}><MovieFilter /></ListItemIcon>
            <ListItemText primary="Pixelization" style={{ color: '#c1c1c1' }}/>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <List className={classes.list}>
              <ListItem divider={true}>
                <Tooltip title="Size X" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><BorderBottom /></ListItemIcon>
                </Tooltip>  
                  <Slider value={pixelSizeXValue}
                    onChange={handlePixelSizeXChange}
                    defaultValue={1024.}
                    valueLabelDisplay="auto"
                    step={10.0}
                    min={50.0}
                    max={1000.0}
                    classes={{ markLabel: classes.mark }}
                    style={{ color: '#FF9127' }}/>
              </ListItem>
              <ListItem divider={true}>
                <Tooltip title="Size Y" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><BorderLeft /></ListItemIcon>
                </Tooltip>
                <Slider value={pixelSizeYValue}
                    onChange={handlePixelSizeYChange}
                    defaultValue={768.}
                    valueLabelDisplay="auto"
                    step={10.0}
                    min={50.0}
                    max={1000.0}
                    classes={{ markLabel: classes.mark }}
                    style={{ color: '#FF9127' }}/>
                </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={activeMat === 7} onChange={handleAccordChange(7)} style={{ background: '#292929' }}>
          <AccordionSummary
            expandIcon={activeMat === 7 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon style={{ color: '#ff9127' }}><MovieFilter /></ListItemIcon>
            <ListItemText primary="Honeycombs" style={{ color: '#c1c1c1' }}/>
          </AccordionSummary>
          <Divider />          
          <AccordionDetails>
            <List className={classes.list}>
              <ListItem divider={true}>
                <Tooltip title="Size" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><AllOut /></ListItemIcon>
                </Tooltip>  
                  <Slider value={sizeHoneyValue}
                    onChange={handleHoneySizeChange}
                    defaultValue={0.01}
                    valueLabelDisplay="auto"
                    step={0.001}
                    min={0.005}
                    max={0.07}
                    classes={{ markLabel: classes.mark }}
                    style={{ color: '#FF9127' }}/>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={activeMat === 8} onChange={handleAccordChange(8)} style={{ background: '#292929' }}>
          <AccordionSummary
            expandIcon={activeMat === 8 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon style={{ color: '#ff9127' }}><MovieFilter /></ListItemIcon>
            <ListItemText primary="Pen" style={{ color: '#c1c1c1' }}/>
          </AccordionSummary>
          <Divider />          
          <AccordionDetails>
            <List className={classes.list}>
              <ListItem divider={true}>
                <Tooltip title="Details" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><VerticalSplit /></ListItemIcon>
                </Tooltip>  
                  <Slider value={lineLimit}
                    onChange={handleLineLimit}
                    defaultValue={0.5}
                    valueLabelDisplay="auto"
                    step={0.01}
                    min={0.01}
                    max={1.5}
                    classes={{ markLabel: classes.mark }}
                    style={{ color: '#FF9127' }}/>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={activeMat === 9} onChange={handleAccordChange(9)} style={{ background: '#292929' }}>
          <AccordionSummary
            expandIcon={activeMat === 9 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon style={{ color: '#ff9127' }}><MovieFilter /></ListItemIcon>
            <ListItemText primary="Sobel" style={{ color: '#c1c1c1' }}/>
          </AccordionSummary>
          <Divider />          
          <AccordionDetails>
            <List className={classes.list}>
              <ListItem divider={true}>
                <Tooltip title="dX" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><SwapHoriz /></ListItemIcon>
                </Tooltip>  
                  <Slider value={sobelDxValue}
                    onChange={handleSobelDx}
                    defaultValue={0.002}
                    valueLabelDisplay="auto"
                    step={0.0001}
                    min={0.000}
                    max={0.01}
                    classes={{ markLabel: classes.mark }}
                    style={{ color: '#FF9127' }}/>
              </ListItem>
              <ListItem divider={true}>
                <Tooltip title="dY" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon style={{ color: '#c1c1c1' }}><SwapVert /></ListItemIcon>
                </Tooltip>
                <Slider value={sobelDyValue}
                    onChange={handleSobelDy}
                    defaultValue={0.002}
                    valueLabelDisplay="auto"
                    step={0.0001}
                    min={0.000}
                    max={0.01}
                    style={{ color: '#FF9127' }}/>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        
      </Drawer>
      
      <Dialog
        open={openHelp}
        onClose={handleCloseHelp}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
      
        <DialogTitle id="alert-dialog-title">
        {"Shader Pipe"}
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Simple sandbox for experiments with&nbsp;
            <Link href="https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)">
               GLSL
            </Link>
             &nbsp;and Google's&nbsp;
            <Link href="https://mediapipe.dev/">
               Mediapipe
            </Link>
            , based on&nbsp;
            <Link href="https://reactjs.org/">
               React
            </Link>
            &nbsp;with&nbsp;
            <Link href="https://material-ui.com/">
               Material-UI
            </Link>
            &nbsp;and&nbsp;
            <Link href="https://threejs.org/">
               Three.js
            </Link>.
            <br/>
          </Typography>
          <Typography gutterBottom>
            Allow browser to use your camera, select image filtering <MovieFilter color="action"/>, face <Face color="action"/> or hands pose <PanTool color="action"/> effects from menu, play with controls to adjust them.
          </Typography>
          <Typography gutterBottom>
            <br/>
            Sources at &nbsp;
            <Link href="https://github.com/syanenko/shaderpipe">
               GitHub
            </Link>.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHelp} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

//
// Rendering
//
ReactDOM.render(
  <PersistentDrawerRight />,
  document.getElementById("root")
);

ReactDOM.render(
  <Scene />,
  document.getElementById('scene')
);

export {activeMat, fontSize, threshold, activeMask, drawMarks};