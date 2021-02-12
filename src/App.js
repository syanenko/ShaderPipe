import './App.css';

import React from 'react';
import ReactDOM from 'react-dom';

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
         ExpandLess } from '@material-ui/icons';

import { resolution, materials } from './materials';
import { Scene } from './scene';
import { videoMesh } from './scene';
import { renderer } from './scene';

//
// Globals
//
const drawerWidth = '20%';
var activeMat = 10;

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
  customTooltip: {
    backgroundColor: 'rgba(63, 81, 181, 1)',
    fontSize: 14
  },
  customArrow: {
    color: 'rgba(63, 81, 181, 1)'
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
  const [gobelinDim, setGobelinDim] = React.useState(600.0);
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
  const [pixelSizeXValue, setPixelSizeValueX] = React.useState(640.0);
  const handlePixelSizeXChange = (event, newValue) => {
    setPixelSizeValueX(newValue);
    materials[activeMat].uniforms[ 'u_size_x' ].value = newValue;
  };

  // Pixel y-size handle
  const [pixelSizeYValue, setPixelSizeValueY] = React.useState(480.0);
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

  // Draw marks handle
  const [drawMarksChecked, setDrawMarksChecked] = React.useState(false);
  const handleDrawMarks = (event) => {
    setDrawMarksChecked(event.target.checked);
    materials[activeMat].uniforms[ 'u_debug' ].value = event.target.checked;
  };
  
  // Accordion handle
  const [expanded, setAccordExpanded] = React.useState(false);
  const handleAccordChange = (panel) => (event, isExpanded) => {
    setAccordExpanded(isExpanded ? panel : false);
    activeMat = panel;
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
        <Toolbar>
          <Typography variant="h6" noWrap className={classes.title}>
            Shader play
          </Typography>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleEffectsOpen}
            className={clsx(open && classes.hide)}>
            <BubbleChart />
          </IconButton>

          <IconButton
            color="inherit"
            edge="end"
            onClick={handleSettingsOpen}
            className={clsx(open && classes.hide)}>
            <Settings />
          </IconButton>

          <IconButton
            color="inherit"
            edge="end"
            onClick={handleOpenHelp}
            className={clsx(open && classes.hide)}>
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
          <Grid container spacing={2} alignItems="center" justify="center" direction="column">
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
          <ListItemIcon><Settings/></ListItemIcon>
          <ListItemText primary="Settings" />
          <IconButton onClick={handleSettingsClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
         <ListItem divider={true}>
                      <Tooltip title="Frame height" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                        <ListItemIcon><ZoomOutMap/></ListItemIcon>
                      </Tooltip>
                     <Slider value={scaleValue}
                        onChange={handleScaleChange}
                        defaultValue={resolution.y}
                        valueLabelDisplay="auto"
                        step={1.0}
                        min={480}
                        max={5200}
                      />
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
        }}
      >
        <div className={classes.drawerHeader}>
          <ListItemIcon><BubbleChart/></ListItemIcon>
          <ListItemText primary="Effects" />
          <IconButton onClick={handleEffectsClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        
        <Accordion expanded={activeMat === 10} onChange={handleAccordChange(10)}>
          <AccordionSummary
            expandIcon={activeMat === 10 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header">
            <ListItemIcon><Face /></ListItemIcon>
            <ListItemText primary="Mask" />
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <List className={classes.list}>
              <ListItem divider={true}>
                <Tooltip title="Marks" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                  <ListItemIcon><Grain /></ListItemIcon>
                </Tooltip>
               <Checkbox 
                  color="primary"
                  defaultChecked={false}
                  onChange={handleDrawMarks}
                  name="checkedA" />
             </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion expanded={activeMat === 0} onChange={handleAccordChange(0)}>
          <AccordionSummary
            expandIcon={activeMat === 0 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon><PanTool/></ListItemIcon>
            <ListItemText primary="Fireball" />
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <List className={classes.list}>
                  <ListItem divider={true}>
                    <Tooltip title="Size" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                      <ListItemIcon><AllOut /></ListItemIcon>
                    </Tooltip>   
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
                    <Tooltip title="Darkness" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                      <ListItemIcon><Brightness4 /></ListItemIcon>
                    </Tooltip>
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
                    <Tooltip title="Marks" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                      <ListItemIcon><Grain /></ListItemIcon>
                    </Tooltip>
                   <Checkbox 
                      color="primary"
                      defaultChecked={false}
                      onChange={handleDrawMarks}
                      name="checkedA" />
                 </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={activeMat === 1} onChange={handleAccordChange(1)}>
          <AccordionSummary
            expandIcon={activeMat === 1 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon><MovieFilter /></ListItemIcon>
            <ListItemText primary="Whirlpool" />
          </AccordionSummary>
          <Divider />          
          <AccordionDetails>
            <List className={classes.list}>
                <ListItem divider={true}>
                  <Tooltip title="Scale A" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                    <ListItemIcon><CallReceived /></ListItemIcon>
                  </Tooltip>  
                   <Slider value={whirlpoolA}
                      onChange={handleWhirlpoolA}
                      defaultValue={2.1}
                      valueLabelDisplay="auto"
                      step={10.0}
                      min={10.0}
                      max={1000.0}
                    />
                </ListItem>
                <ListItem divider={true}>
                  <Tooltip title="Scale B" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                    <ListItemIcon><CallMade /></ListItemIcon>
                  </Tooltip>
                  <Slider value={whirlpoolB}
                      onChange={handleWhirlpoolB}
                      defaultValue={2.1}
                      valueLabelDisplay="auto"
                      step={10.0}
                      min={10.0}
                      max={1000.0}
                   />
                 </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion expanded={activeMat === 2} onChange={handleAccordChange(2)}>
          <AccordionSummary
            expandIcon={activeMat === 2 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon><MovieFilter /></ListItemIcon>
            <ListItemText primary="Toon" />
          </AccordionSummary>
          <Divider />          
          <AccordionDetails>
            <List className={classes.list}>
                <ListItem divider={true}>
                  <Tooltip title="Hue levels" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                    <ListItemIcon><ColorLens /></ListItemIcon>
                  </Tooltip>  
                   <Slider value={toonHue}
                      onChange={handleToonHue}
                      defaultValue={[1.0, 106.0, 219.0, 296.0]}
                      valueLabelDisplay="auto"
                      step={1.0}
                      min={1.0}
                      max={360.0}
                    />
                </ListItem>

                <ListItem divider={true}>
                  <Tooltip title="Saturation levels" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                    <ListItemIcon><InvertColors /></ListItemIcon>
                  </Tooltip>  
                   <Slider value={toonSat}
                      onChange={handleToonSat}
                      defaultValue={[0.0, 0.3, 0.6, 1.0]}
                      valueLabelDisplay="auto"
                      step={0.01}
                      min={0.01}
                      max={1.0}
                    />
                </ListItem>

                <ListItem divider={true}>
                  <Tooltip title="Value levels" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                    <ListItemIcon><Brightness4 /></ListItemIcon>
                  </Tooltip>  
                   <Slider value={toonValue}
                      onChange={handleToonValue}
                      defaultValue={[0.0, 0.3, 0.6, 1.0]}
                      valueLabelDisplay="auto"
                      step={0.01}
                      min={0.01}
                      max={1.0}
                    />
                </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={activeMat === 3} onChange={handleAccordChange(3)}>
          <AccordionSummary
            expandIcon={activeMat === 3 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon><MovieFilter /></ListItemIcon>
            <ListItemText primary="Posterize" />
          </AccordionSummary>
          <Divider />          
          <AccordionDetails>
            <List className={classes.list}>
                <ListItem divider={true}>
                  <Tooltip title="Gamma" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                    <ListItemIcon><InvertColors /></ListItemIcon>
                  </Tooltip>  
                   <Slider value={posterGamma}
                      onChange={handlePosterGamma}
                      defaultValue={4.0}
                      valueLabelDisplay="auto"
                      step={0.1}
                      min={0.1}
                      max={12.0}
                    />
                </ListItem>
                <ListItem divider={true}>
                  <Tooltip title="Number of colors" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                    <ListItemIcon><ColorLens /></ListItemIcon>
                  </Tooltip>
                  <Slider value={posterNumColors}
                      onChange={handlePosterNumColors}
                      defaultValue={8.0}
                      valueLabelDisplay="auto"
                      step={1.0}
                      min={2.0}
                      max={32.0}
                   />
                 </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion expanded={activeMat === 4} onChange={handleAccordChange(4)}>
          <AccordionSummary
            expandIcon={activeMat === 4 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon><MovieFilter /></ListItemIcon>
            <ListItemText primary="Crosshatch" />
          </AccordionSummary>
        </Accordion>
        
        <Accordion expanded={activeMat === 5} onChange={handleAccordChange(5)}>
          <AccordionSummary
            expandIcon={activeMat === 5 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon><MovieFilter /></ListItemIcon>
            <ListItemText primary="Gobelin" />
          </AccordionSummary>
          <Divider />
          
          <AccordionDetails>
            <List className={classes.list}>
                <ListItem divider={true}>
                  <Tooltip title="Size" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                    <ListItemIcon><AllOut /></ListItemIcon>
                  </Tooltip>  
                   <Slider value={gobelinSize}
                      onChange={handleGobelinSize}
                      defaultValue={6.0}
                      valueLabelDisplay="auto"
                      step={1.0}
                      min={5.0}
                      max={25.0}
                    />
                </ListItem>
                
                <ListItem divider={true}>
                  <Tooltip title="Dimension" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                    <ListItemIcon><ZoomOutMap /></ListItemIcon>
                  </Tooltip>  
                   <Slider value={gobelinDim}
                      onChange={handleGobelinDim}
                      defaultValue={600.0}
                      valueLabelDisplay="auto"
                      step={10.0}
                      min={200.0}
                      max={1000.0}
                    />
                </ListItem>
                <ListItem divider={true}>
                  <Tooltip title="Invert" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                    <ListItemIcon><Iso /></ListItemIcon>
                  </Tooltip>  
                   <Checkbox 
                      color="primary"
                      defaultChecked={false}
                      onChange={handleGobelinInvert}
                      name="checkedGobelinInvert" />
                </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion expanded={activeMat === 6} onChange={handleAccordChange(6)}>
          <AccordionSummary
            expandIcon={activeMat === 6 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon><MovieFilter /></ListItemIcon>
            <ListItemText primary="Pixelization" />
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <List className={classes.list}>
                <ListItem divider={true}>
                  <Tooltip title="Size X" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                    <ListItemIcon><BorderBottom /></ListItemIcon>
                  </Tooltip>  
                   <Slider value={pixelSizeXValue}
                      onChange={handlePixelSizeXChange}
                      defaultValue={640.}
                      valueLabelDisplay="auto"
                      step={10.0}
                      min={50.0}
                      max={1000.0}
                    />
                </ListItem>
                <ListItem divider={true}>
                  <Tooltip title="Size Y" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                    <ListItemIcon><BorderLeft /></ListItemIcon>
                  </Tooltip>
                  <Slider value={pixelSizeYValue}
                      onChange={handlePixelSizeYChange}
                      defaultValue={480.}
                      valueLabelDisplay="auto"
                      step={10.0}
                      min={50.0}
                      max={1000.0}
                   />
                 </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={activeMat === 7} onChange={handleAccordChange(7)}>
          <AccordionSummary
            expandIcon={activeMat === 7 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon><MovieFilter /></ListItemIcon>
            <ListItemText primary="Honeycombs" />
          </AccordionSummary>
          <Divider />          
          <AccordionDetails>
            <List className={classes.list}>
                <ListItem divider={true}>
                  <Tooltip title="Size" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                    <ListItemIcon><AllOut /></ListItemIcon>
                  </Tooltip>  
                   <Slider value={sizeHoneyValue}
                      onChange={handleHoneySizeChange}
                      defaultValue={0.01}
                      valueLabelDisplay="auto"
                      step={0.001}
                      min={0.005}
                      max={0.07}
                    />
                </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={activeMat === 8} onChange={handleAccordChange(8)}>
          <AccordionSummary
            expandIcon={activeMat === 8 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon><MovieFilter /></ListItemIcon>
            <ListItemText primary="Pen" />
          </AccordionSummary>
          <Divider />          
          <AccordionDetails>
            <List className={classes.list}>
                <ListItem divider={true}>
                  <Tooltip title="Details" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                    <ListItemIcon><VerticalSplit /></ListItemIcon>
                  </Tooltip>  
                   <Slider value={lineLimit}
                      onChange={handleLineLimit}
                      defaultValue={0.5}
                      valueLabelDisplay="auto"
                      step={0.01}
                      min={0.01}
                      max={1.5}
                    />
                </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={activeMat === 9} onChange={handleAccordChange(9)}>
          <AccordionSummary
            expandIcon={activeMat === 9 ? <Hidden xsUp><ExpandLess display="none" /></Hidden> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <ListItemIcon><MovieFilter /></ListItemIcon>
            <ListItemText primary="Sobel" />
          </AccordionSummary>
          <Divider />          
          <AccordionDetails>
            <List className={classes.list}>
                <ListItem divider={true}>
                  <Tooltip title="dX" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                    <ListItemIcon><SwapHoriz /></ListItemIcon>
                  </Tooltip>  
                   <Slider value={sobelDxValue}
                      onChange={handleSobelDx}
                      defaultValue={0.002}
                      valueLabelDisplay="auto"
                      step={0.0001}
                      min={0.000}
                      max={0.01}
                    />
                </ListItem>
                <ListItem divider={true}>
                  <Tooltip title="dY" placement="left" classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }} arrow>
                    <ListItemIcon><SwapVert /></ListItemIcon>
                  </Tooltip>
                  <Slider value={sobelDyValue}
                      onChange={handleSobelDy}
                      defaultValue={0.002}
                      valueLabelDisplay="auto"
                      step={0.0001}
                      min={0.000}
                      max={0.01}
                   />
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
        {"Shader play"}
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
            <Link href="https://github.com/syanenko/shaderplay">
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

export {activeMat};