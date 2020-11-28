import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
    overrides: {
        MuiCardHeader: {
            root: {
                paddingTop: '0px',
                paddingBottom: '0px'
            },
            titleTypographyProps: {
                variant: 'h6'
            }
        },
        MuiTableCell: {
            root: {
                paddingTop: '0px',
                paddingBottom: '0px'
            }
        }
    }
});
