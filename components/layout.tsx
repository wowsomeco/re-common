import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import { Theme, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { createStyles, makeStyles } from '@mui/styles';
import clsx from 'clsx';
import * as React from 'react';
import { FiChevronLeft, FiChevronRight, FiMenu } from 'react-icons/fi';

import { useAppProvider } from '~w-common/contexts/appContext';

const useStyles = (drawerWidth: number = 240, isMenuBar: boolean = false) =>
  makeStyles((theme: Theme) =>
    createStyles({
      root: {
        display: 'flex',
        height: '100vh'
      },
      drawer: {
        [theme.breakpoints.up(isMenuBar ? 'md' : 'sm')]: {
          width: isMenuBar ? 0 : drawerWidth,
          flexShrink: 0
        }
      },
      appBar: {
        [theme.breakpoints.up(isMenuBar ? 'md' : 'sm')]: {
          width: isMenuBar ? '100%' : `calc(100% - ${drawerWidth}px)`,
          marginLeft: drawerWidth
        }
      },
      menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(isMenuBar ? 'md' : 'sm')]: {
          display: 'none'
        }
      },
      closeButton: {
        [theme.breakpoints.up(isMenuBar ? 'md' : 'sm')]: {
          display: 'none'
        }
      },
      // necessary for content to be below app bar
      toolbar: {
        ...theme.mixins.toolbar,
        display: 'flex',
        alignItems: 'center'
      },
      drawerPaper: {
        width: drawerWidth,
        overflowX: 'hidden'
      },
      content: {
        flexGrow: 1,
        paddingTop: theme.mixins.toolbar.minHeight
      }
    })
  );

export interface LayoutProps {
  menuBar?: React.ReactNode;
  sideBar: React.ReactNode;
  sideBarWidth?: number;
  headerSlot?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  menuBar,
  sideBar,
  sideBarWidth = 240,
  headerSlot,
  children
}) => {
  const { appName } = useAppProvider();

  const classes = useStyles(sideBarWidth, !!menuBar)();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (isMobile) => (
    <div>
      <div className={classes.toolbar}>
        <IconButton
          onClick={handleDrawerToggle}
          color='inherit'
          aria-label='close drawer'
          className={classes.closeButton}
        >
          {theme.direction === 'ltr' ? <FiChevronLeft /> : <FiChevronRight />}
        </IconButton>
      </div>
      {isMobile ? (
        <div
          role='presentation'
          // onClick={handleDrawerToggle}
          // onKeyDown={handleDrawerToggle}
        >
          {sideBar}
        </div>
      ) : (
        sideBar
      )}
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position='fixed' className={clsx(classes.appBar)} color='inherit'>
        <Toolbar className='flex items-center justify-between'>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <FiMenu />
          </IconButton>
          <div className='flex justify-between items-center'>
            <p className='text-blue-400 font-bold sm:mr-3'>{appName}</p>
            {menuBar && (
              <Hidden smDown={!menuBar} mdDown={!!menuBar} implementation='css'>
                {menuBar}
              </Hidden>
            )}
          </div>

          {headerSlot}
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation='css'>
          <Drawer
            container={document.body}
            variant='temporary'
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer(true)}
          </Drawer>
        </Hidden>
        {!menuBar && (
          <Hidden smDown={!menuBar} mdDown={!!menuBar} implementation='css'>
            <Drawer
              classes={{
                paper: classes.drawerPaper
              }}
              variant='permanent'
              open
            >
              {drawer(false)}
            </Drawer>
          </Hidden>
        )}
      </nav>
      <main className={clsx(classes.content, 'bg-gray-50 overflow-y-scroll')}>
        {children}
      </main>
    </div>
  );
};
