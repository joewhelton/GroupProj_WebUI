const drawerWidth = 240;

export const styles = (theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar,
    root: {},
    details: {
        display: 'flex'
    },
    avatar: {
        height: 110,
        width: 100,
        flexShrink: 0,
        flexGrow: 0
    },
    locationText: {
        paddingLeft: '15px'
    },
    buttonProperty: {
        position: 'absolute',
        top: '50%'
    },
    uiProgess: {
        position: 'fixed',
        zIndex: '1000',
        height: '31px',
        width: '31px',
        left: '50%',
        top: '35%'
    },
    progess: {
        position: 'absolute'
    },
    uploadButton: {
        marginLeft: '8px',
        margin: theme.spacing(1)
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10
    },
    customSuccess: {
        color: '#119505',
        fontSize: '0.8rem',
        marginTop: 10
    },
    submitButton: {
        marginTop: '10px'
    },
    fab: {
        margin: theme.spacing(1),
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    iconLink: {
        color: '#666'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    },
    userAvatar:{
        marginTop: 20,
        height: 80,
        width: 80
    },
    switchHolder:{
        display: 'flex',
        alignSelf: 'flex-end'
    },
    rangeLabel:{
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '0.8rem',
        marginTop: '0.1rem',
        marginBottom: '1rem'
    },
    rangeSlider:{
        paddingBottom: 0
    },
    tableHeading:{
        backgroundColor: 'rgba(0, 101, 179, 0.8)'
    },
    tableHeadingCell:{
        fontWeight: 'bold',
        color: 'white',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem'
    }
});